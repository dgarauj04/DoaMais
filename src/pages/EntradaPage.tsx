import React, { useEffect, useState, useMemo } from "react";
import {
  ArrowDownLeft,
  HeartHandshake,
  CheckCircle,
  PlusCircle,
  Building,
  User,
  HelpCircle,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, Label } from "@/components/ui/select";
import { useToast } from "@/components/ui/toast";
import {
  getItens,
  enviarEntrada,
  criarItem,
  Item,
  CategoriaItem,
  UnidadeItem,
  DoadorTipo,
} from "@/lib/data";

export function EntradaPage() {
  const { success, error: toastError } = useToast();

  const [itens, setItens] = useState<Item[]>([]);
  const [loadingItens, setLoadingItens] = useState(true);
  const [submetendo, setSubmetendo] = useState(false);

  // Estados do Formulário
  const hojeStr = useMemo(() => new Date().toISOString().split("T")[0], []);
  const [data, setData] = useState(hojeStr);
  const [categoria, setCategoria] = useState<CategoriaItem>("Alimentos");

  // Seleção ou criação inline de item
  const [modoNovoItemInline, setModoNovoItemInline] = useState(false);
  const [itemId, setItemId] = useState("");
  const [novoNome, setNovoNome] = useState("");
  const [novaUnidade, setNovaUnidade] = useState<UnidadeItem>("un");
  const [novoMinimo, setNovoMinimo] = useState("10");

  // Quantidade e Validade
  const [quantidade, setQuantidade] = useState("");
  const [validade, setValidade] = useState("");

  // Doador
  const [doadorTipo, setDoadorTipo] = useState<DoadorTipo>("Pessoa");
  const [doadorNome, setDoadorNome] = useState("");
  const [doadorContato, setDoadorContato] = useState("");

  // Observações
  const [observacao, setObservacao] = useState("");

  // Erros de validação
  const [erros, setErros] = useState<Record<string, string>>({});

  useEffect(() => {
    carregarItens();
  }, []);

  async function carregarItens() {
    setLoadingItens(true);
    try {
      const dados = await getItens();
      setItens(dados);
      const primeiro = dados.find((i) => i.categoria === "Alimentos");
      if (primeiro) {
        setItemId(primeiro.id);
      }
    } finally {
      setLoadingItens(false);
    }
  }

  // Itens filtrados pela categoria selecionada
  const itensDaCategoria = useMemo(() => {
    return itens.filter((i) => i.categoria === categoria);
  }, [itens, categoria]);

  // Item atualmente selecionado
  const itemSelecionado = useMemo(() => {
    return itens.find((i) => i.id === itemId);
  }, [itens, itemId]);

  // Unidade efetiva (herdada do item selecionado ou do item inline)
  const unidadeEfetiva = modoNovoItemInline
    ? novaUnidade
    : itemSelecionado?.unidade || "un";

  // Quando mudar categoria: se o item selecionado não pertencer à nova categoria, atualiza seleção
  const handleCategoriaChange = (novaCat: CategoriaItem) => {
    setCategoria(novaCat);
    if (!modoNovoItemInline) {
      const itemCorrespondente = itens.find((i) => i.categoria === novaCat);
      if (itemCorrespondente) {
        setItemId(itemCorrespondente.id);
      } else {
        setItemId("");
      }
    }
  };

  const validarFormulario = () => {
    const novosErros: Record<string, string> = {};

    if (!data) {
      novosErros.data = "Data da doação é obrigatória.";
    }

    if (modoNovoItemInline) {
      if (!novoNome.trim()) {
        novosErros.novoNome = "Nome do novo produto é obrigatório.";
      }
      const min = Number(novoMinimo);
      if (isNaN(min) || min < 0) {
        novosErros.novoMinimo = "Estoque mínimo deve ser um número maior ou igual a 0.";
      }
    } else {
      if (!itemId) {
        novosErros.itemId = "Selecione um produto da lista.";
      }
    }

    const qtd = Number(quantidade);
    if (!quantidade || isNaN(qtd) || qtd <= 0) {
      novosErros.quantidade = "A quantidade deve ser maior que 0.";
    }

    if (doadorTipo !== "Anônimo" && !doadorNome.trim()) {
      novosErros.doadorNome = `Informe o nome ${doadorTipo === "Empresa" ? "da empresa doadora" : "da pessoa doadora"}.`;
    }

    if (doadorContato.trim()) {
      if (doadorContato.includes("@") && !/\S+@\S+\.\S+/.test(doadorContato)) {
        novosErros.doadorContato = "Formato de e-mail inválido.";
      }
    }

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validarFormulario()) return;

    setSubmetendo(true);

    try {
      let finalItemId = itemId;
      let finalItemNome = itemSelecionado?.item_nome || "";
      let finalUnidade = unidadeEfetiva;

      // Se for novo item inline, primeiro registra o item
      if (modoNovoItemInline) {
        const resNovo = await criarItem({
          item_nome: novoNome.trim(),
          categoria,
          unidade: novaUnidade,
          controla_validade: categoria === "Alimentos",
          estoque_minimo: Number(novoMinimo),
          saldo_inicial: 0,
        });

        if (!resNovo.success || !resNovo.item) {
          throw new Error(resNovo.message || "Erro ao criar novo item.");
        }

        finalItemId = resNovo.item.id;
        finalItemNome = resNovo.item.item_nome;
        finalUnidade = resNovo.item.unidade;
      }

      // Envia a entrada
      const resEntrada = await enviarEntrada({
        data,
        item_id: finalItemId,
        item_nome: finalItemNome,
        categoria,
        quantidade: Number(quantidade),
        unidade: finalUnidade,
        doador_tipo: doadorTipo,
        doador_nome: doadorTipo === "Anônimo" ? undefined : doadorNome.trim(),
        doador_contato: doadorContato.trim() || undefined,
        validade_lote: categoria === "Alimentos" && validade ? validade : undefined,
        observacao: observacao.trim() || undefined,
      });

      if (!resEntrada.success) {
        throw new Error(resEntrada.message || "Erro ao registrar doação.");
      }

      success(
        "Doação registrada com sucesso!",
        `Entrada de ${quantidade} ${finalUnidade} de "${finalItemNome}" foi lançada no estoque.`
      );

      // Limpar formulário
      setQuantidade("");
      setValidade("");
      setDoadorNome("");
      setDoadorContato("");
      setObservacao("");
      setModoNovoItemInline(false);
      setNovoNome("");

      await carregarItens();
    } catch (err: unknown) {
      toastError(
        "Falha ao registrar entrada",
        err instanceof Error ? err.message : "Erro desconhecido."
      );
    } finally {
      setSubmetendo(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="pb-2 border-b border-stone-200">
        <h2 className="text-2xl font-bold tracking-tight text-stone-900 flex items-center gap-2">
          <ArrowDownLeft className="w-6 h-6 text-emerald-700" />
          Registrar Entrada de Doação
        </h2>
        <p className="text-sm text-stone-500 mt-0.5">
          Dê entrada em mantimentos, roupas, materiais escolares e recursos doados à organização.
        </p>
      </div>

      {/* FORMULÁRIO EM CARD ÚNICO (MÁXIMO 2 COLUNAS) */}
      <Card className="doamais-card shadow-sm border-stone-200">
        <CardHeader className="bg-stone-50/60 border-b border-stone-100 p-6 pb-4">
          <CardTitle className="text-base font-bold text-stone-900 flex items-center gap-2">
            <HeartHandshake className="w-5 h-5 text-emerald-700" />
            Dados da Doação Recebida
          </CardTitle>
          <p className="text-xs text-stone-500">
            Preencha os campos abaixo para atualizar o estoque comunitário e emitir o registro.
          </p>
        </CardHeader>

        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Data (default: hoje) */}
              <div>
                <Label required>Data da Entrada</Label>
                <Input
                  type="date"
                  value={data}
                  onChange={(e) => setData(e.target.value)}
                  error={erros.data}
                />
              </div>

              {/* Categoria */}
              <div>
                <Label required>Categoria do Produto</Label>
                <Select
                  value={categoria}
                  onChange={(e) =>
                    handleCategoriaChange(e.target.value as CategoriaItem)
                  }
                >
                  <option value="Alimentos">Alimentos</option>
                  <option value="Higiene">Higiene</option>
                  <option value="Roupa">Roupa</option>
                  <option value="Material Escolar">Material Escolar</option>
                  <option value="Outro">Outro</option>
                </Select>
              </div>

              {/* Item com busca OU inline novo item */}
              <div className="md:col-span-2 space-y-2">
                <div className="flex items-center justify-between">
                  <Label required>
                    {modoNovoItemInline ? "Cadastrar Novo Produto" : "Produto Doado"}
                  </Label>
                  <button
                    type="button"
                    onClick={() => setModoNovoItemInline(!modoNovoItemInline)}
                    className="text-xs text-emerald-700 hover:text-emerald-800 font-semibold inline-flex items-center gap-1 cursor-pointer"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>
                      {modoNovoItemInline
                        ? "← Selecionar produto existente"
                        : "+ Cadastrar novo item"}
                    </span>
                  </button>
                </div>

                {!modoNovoItemInline ? (
                  <div>
                    <Select
                      value={itemId}
                      onChange={(e) => setItemId(e.target.value)}
                      error={erros.itemId}
                      disabled={loadingItens}
                    >
                      <option value="">Selecione um produto cadastrado...</option>
                      {itensDaCategoria.map((it) => (
                        <option key={it.id} value={it.id}>
                          {it.item_nome} (Saldo atual: {it.saldo_atual} {it.unidade})
                        </option>
                      ))}
                    </Select>
                    {itensDaCategoria.length === 0 && !loadingItens && (
                      <p className="text-xs text-amber-700 mt-1">
                        Nenhum produto cadastrado nesta categoria. Clique em "+ Cadastrar novo item" acima.
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="p-4 bg-emerald-50/50 border border-emerald-200 rounded-xl space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="sm:col-span-2">
                        <Label required>Nome do Produto</Label>
                        <Input
                          placeholder="Ex: Arroz 5kg, Agasalho Infantil..."
                          value={novoNome}
                          onChange={(e) => setNovoNome(e.target.value)}
                          error={erros.novoNome}
                        />
                      </div>

                      <div>
                        <Label required>Unidade de Medida</Label>
                        <Select
                          value={novaUnidade}
                          onChange={(e) =>
                            setNovaUnidade(e.target.value as UnidadeItem)
                          }
                        >
                          <option value="un">un (unidade)</option>
                          <option value="kg">kg (quilograma)</option>
                          <option value="L">L (litro)</option>
                          <option value="pacote">pacote</option>
                          <option value="caixa">caixa</option>
                        </Select>
                      </div>

                      <div className="sm:col-span-3">
                        <Label required>Estoque Mínimo de Segurança</Label>
                        <Input
                          type="number"
                          min="0"
                          value={novoMinimo}
                          onChange={(e) => setNovoMinimo(e.target.value)}
                          error={erros.novoMinimo}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Quantidade */}
              <div>
                <Label required>Quantidade Recebida</Label>
                <div className="relative">
                  <Input
                    type="number"
                    min="0.1"
                    step="any"
                    placeholder="Ex: 10, 25..."
                    value={quantidade}
                    onChange={(e) => setQuantidade(e.target.value)}
                    error={erros.quantidade}
                    className="pr-16"
                  />
                  <span className="absolute right-3 top-2.5 text-xs font-semibold text-stone-500 bg-stone-100 px-2 py-0.5 rounded">
                    {unidadeEfetiva}
                  </span>
                </div>
                <p className="text-[11px] text-stone-500 mt-1">
                  Unidade herdada automaticamente: <strong>{unidadeEfetiva}</strong>
                </p>
              </div>

              {/* Validade */}
              {categoria === "Alimentos" ? (
                <div>
                  <Label>Validade (opcional)</Label>
                  <Input
                    type="date"
                    value={validade}
                    onChange={(e) => setValidade(e.target.value)}
                    error={erros.validade}
                  />
                  <p className="text-[11px] text-stone-500 mt-1">
                    Ajuda no controle e alertas de vencimento da organização.
                  </p>
                </div>
              ) : (
                <div className="flex flex-col justify-center p-3 bg-stone-50 rounded-lg border border-dashed border-stone-200 text-xs text-stone-500">
                  <p className="font-medium text-stone-700">Controle de Validade</p>
                  <p className="text-[11px] mt-0.5">
                    Produtos da categoria &quot;{categoria}&quot; não exigem monitoramento de validade.
                  </p>
                </div>
              )}

              {/* Tipo de Doador: Radio Pessoa / Empresa / Anônimo */}
              <div className="md:col-span-2 pt-2 border-t border-stone-100">
                <Label required>Tipo de Doador</Label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { tipo: "Pessoa", icon: User, label: "Pessoa Física" },
                    { tipo: "Empresa", icon: Building, label: "Empresa / Parceiro" },
                    { tipo: "Anônimo", icon: HelpCircle, label: "Anônimo" },
                  ].map((item) => {
                    const Icon = item.icon;
                    const isSelected = doadorTipo === item.tipo;
                    return (
                      <label
                        key={item.tipo}
                        className={`flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-2 p-3 rounded-xl border cursor-pointer transition-all ${
                          isSelected
                            ? "bg-emerald-50 border-emerald-600 text-emerald-950 font-bold shadow-2xs"
                            : "bg-white border-stone-200 text-stone-600 hover:bg-stone-50"
                        }`}
                      >
                        <input
                          type="radio"
                          name="doadorTipo"
                          value={item.tipo}
                          checked={isSelected}
                          onChange={() => setDoadorTipo(item.tipo as DoadorTipo)}
                          className="sr-only"
                        />
                        <Icon
                          className={`w-4 h-4 ${
                            isSelected ? "text-emerald-700" : "text-stone-400"
                          }`}
                        />
                        <span className="text-xs text-center sm:text-left">
                          {item.label}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Nome do Doador */}
              {doadorTipo !== "Anônimo" && (
                <div>
                  <Label required>
                    {doadorTipo === "Empresa"
                      ? "Razão Social / Nome da Empresa"
                      : "Nome Completo do Doador"}
                  </Label>
                  <Input
                    placeholder={
                      doadorTipo === "Empresa"
                        ? "Ex: Supermercado Esperança Ltda."
                        : "Ex: Maria das Graças Silva"
                    }
                    value={doadorNome}
                    onChange={(e) => setDoadorNome(e.target.value)}
                    error={erros.doadorNome}
                  />
                </div>
              )}

              {/* Contato do Doador */}
              <div className={doadorTipo === "Anônimo" ? "md:col-span-2" : ""}>
                <Label>Contato do Doador (opcional)</Label>
                <Input
                  placeholder="E-mail ou telefone para agradecimento"
                  value={doadorContato}
                  onChange={(e) => setDoadorContato(e.target.value)}
                  error={erros.doadorContato}
                />
              </div>

              {/* Observação */}
              <div className="md:col-span-2">
                <Label>Observação / Finalidade</Label>
                <textarea
                  rows={2}
                  placeholder="Informações adicionais, campanha vinculada ou detalhes do lote..."
                  value={observacao}
                  onChange={(e) => setObservacao(e.target.value)}
                  className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-stone-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700"
                />
              </div>
            </div>

            {/* Botões de Ação */}
            <div className="pt-4 border-t border-stone-100 flex items-center justify-end gap-3">
              <Button
                type="submit"
                size="lg"
                isLoading={submetendo}
                className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-8 shadow-sm"
              >
                <CheckCircle className="w-4 h-4 text-emerald-200" />
                <span>Registrar Entrada</span>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default EntradaPage;
