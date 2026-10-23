import React, { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import {
  ArrowUpRight,
  HeartHandshake,
  Coffee,
  AlertOctagon,
  CheckCircle,
  AlertTriangle,
  FileText,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, Label } from "@/components/ui/select";
import { useToast } from "@/components/ui/toast";
import { getItens, enviarSaida, Item } from "@/lib/data";

type TipoSaida = "Distribuição" | "Consumo" | "Perda";

export function SaidaPage() {
  const [searchParams] = useSearchParams();
  const preSelectedItemId = searchParams.get("item_id");
  const { success, error: toastError } = useToast();

  const [itens, setItens] = useState<Item[]>([]);
  const [loadingItens, setLoadingItens] = useState(true);
  const [submetendo, setSubmetendo] = useState(false);

  const hojeStr = useMemo(() => new Date().toISOString().split("T")[0], []);
  const [data, setData] = useState(hojeStr);
  const [tipoSaida, setTipoSaida] = useState<TipoSaida>("Distribuição");
  const [itemId, setItemId] = useState("");
  const [quantidade, setQuantidade] = useState("");

  const [familiaNome, setFamiliaNome] = useState("");
  const [familiaBairro, setFamiliaBairro] = useState("");

  const [motivoPerda, setMotivoPerda] = useState("Vencimento");

  const [responsavel, setResponsavel] = useState("");
  const [observacao, setObservacao] = useState("");

  const [erros, setErros] = useState<Record<string, string>>({});

  useEffect(() => {
    async function carregar() {
      setLoadingItens(true);
      try {
        const dados = await getItens();
        setItens(dados);

        if (preSelectedItemId && dados.some((i) => i.id === preSelectedItemId)) {
          setItemId(preSelectedItemId);
        } else if (dados.length > 0) {
          setItemId(dados[0].id);
        }
      } finally {
        setLoadingItens(false);
      }
    }
    carregar();
  }, [preSelectedItemId]);

  const itemSelecionado = useMemo(() => {
    return itens.find((i) => i.id === itemId);
  }, [itens, itemId]);

  const sugestoesFamilias = [
    "Família Santos",
    "Família Oliveira",
    "Família Silva Ramos",
    "Família Ferreira",
    "Família Costa",
    "Família Barbosa",
    "Família Souza",
    "Família Nascimento",
    "Família Duarte",
  ];

  const sugestoesBairros = [
    "Vila Nova",
    "Jardim Esperança",
    "Morro da Paz",
    "Bairro São José",
    "Vila Progresso",
    "Jardim das Acácias",
    "Comunidade Estrela",
  ];

  const saldoDisponivel = itemSelecionado?.saldo_atual ?? 0;
  const qtdNumero = Number(quantidade);
  const saldoInsuficiente =
    Boolean(quantidade) &&
    !isNaN(qtdNumero) &&
    qtdNumero > saldoDisponivel;

  const validarFormulario = () => {
    const novosErros: Record<string, string> = {};

    if (!data) {
      novosErros.data = "Data da saída é obrigatória.";
    }

    if (!itemId) {
      novosErros.itemId = "Selecione um produto.";
    }

    if (!quantidade || isNaN(qtdNumero) || qtdNumero <= 0) {
      novosErros.quantidade = "Informe uma quantidade válida e maior que 0.";
    } else if (saldoInsuficiente) {
      novosErros.quantidade = `Saldo insuficiente: existem apenas ${saldoDisponivel} ${itemSelecionado?.unidade || "un"} disponíveis no estoque.`;
    }

    if (tipoSaida === "Distribuição") {
      if (!familiaNome.trim()) {
        novosErros.familiaNome = "Informe o nome da família beneficiada.";
      }
      if (!familiaBairro.trim()) {
        novosErros.familiaBairro = "Informe o bairro ou comunidade da família.";
      }
    }

    if (!responsavel.trim()) {
      novosErros.responsavel = "Informe o nome do responsável pelo registro da saída.";
    }

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validarFormulario()) return;
    if (!itemSelecionado) return;

    setSubmetendo(true);

    try {
      const res = await enviarSaida({
        data,
        tipo: tipoSaida,
        item_id: itemSelecionado.id,
        item_nome: itemSelecionado.item_nome,
        quantidade: Number(quantidade),
        unidade: itemSelecionado.unidade,
        familia_nome: tipoSaida === "Distribuição" ? familiaNome.trim() : "",
        bairro: tipoSaida === "Distribuição" ? familiaBairro.trim() : "",
        familia_bairro: tipoSaida === "Distribuição" ? familiaBairro.trim() : "",
        motivo_perda: tipoSaida === "Perda" ? motivoPerda : "",
        responsavel: responsavel.trim(),
        observacao: observacao.trim() || undefined,
      });

      if (!res.success) {
        throw new Error(res.message || "Erro ao registrar saída.");
      }

      success(
        "Saída registrada com sucesso!",
        `Baixa de ${quantidade} ${itemSelecionado.unidade} de "${itemSelecionado.item_nome}" realizada com sucesso.`
      );

      setQuantidade("");
      setFamiliaNome("");
      setFamiliaBairro("");
      setObservacao("");

      const dadosAtualizados = await getItens();
      setItens(dadosAtualizados);
    } catch (err: unknown) {
      toastError(
        "Falha ao registrar saída",
        err instanceof Error ? err.message : "Erro desconhecido."
      );
    } finally {
      setSubmetendo(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="pb-2 border-b border-stone-200">
        <h2 className="text-2xl font-bold tracking-tight text-stone-900 flex items-center gap-2">
          <ArrowUpRight className="w-6 h-6 text-amber-700" />
          Registrar Saída de Estoque
        </h2>
        <p className="text-sm text-stone-500 mt-0.5">
          Faça a baixa de itens distribuídos para famílias cadastradas, consumo interno da sede ou perdas por avaria/validade.
        </p>
      </div>

      <Card className="doamais-card shadow-sm border-stone-200">
        <CardHeader className="bg-stone-50/60 border-b border-stone-100 p-6 pb-4">
          <CardTitle className="text-base font-bold text-stone-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-amber-700" />
            Detalhes da Operação de Saída
          </CardTitle>
          <p className="text-xs text-stone-500">
            A saída deduz imediatamente o saldo disponível e mantém o histórico auditável.
          </p>
        </CardHeader>

        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label required>Tipo de Saída</Label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div
                  onClick={() => setTipoSaida("Distribuição")}
                  className={`flex flex-col p-4 rounded-xl border cursor-pointer transition-all ${
                    tipoSaida === "Distribuição"
                      ? "bg-sky-50 border-sky-600 text-sky-950 shadow-xs ring-1 ring-sky-600"
                      : "bg-white border-stone-200 text-stone-600 hover:bg-stone-50"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        tipoSaida === "Distribuição"
                          ? "bg-sky-600 text-white"
                          : "bg-stone-100 text-stone-500"
                      }`}
                    >
                      <HeartHandshake className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-sm">Distribuição</span>
                  </div>
                  <p className="text-xs text-stone-500 mt-2">
                    Entrega de mantimentos e doações para famílias assistidas.
                  </p>
                </div>

                <div
                  onClick={() => setTipoSaida("Consumo")}
                  className={`flex flex-col p-4 rounded-xl border cursor-pointer transition-all ${
                    tipoSaida === "Consumo"
                      ? "bg-stone-100 border-stone-600 text-stone-950 shadow-xs ring-1 ring-stone-600"
                      : "bg-white border-stone-200 text-stone-600 hover:bg-stone-50"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        tipoSaida === "Consumo"
                          ? "bg-stone-700 text-white"
                          : "bg-stone-100 text-stone-500"
                      }`}
                    >
                      <Coffee className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-sm">Consumo Interno</span>
                  </div>
                  <p className="text-xs text-stone-500 mt-2">
                    Uso da sede, limpeza, cozinha comunitária ou equipe.
                  </p>
                </div>

                <div
                  onClick={() => setTipoSaida("Perda")}
                  className={`flex flex-col p-4 rounded-xl border cursor-pointer transition-all ${
                    tipoSaida === "Perda"
                      ? "bg-red-50 border-red-600 text-red-950 shadow-xs ring-1 ring-red-600"
                      : "bg-white border-stone-200 text-stone-600 hover:bg-stone-50"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        tipoSaida === "Perda"
                          ? "bg-red-600 text-white"
                          : "bg-stone-100 text-stone-500"
                      }`}
                    >
                      <AlertOctagon className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-sm">Perda</span>
                  </div>
                  <p className="text-xs text-stone-500 mt-2">
                    Itens vencidos, embalagens violadas ou avarias no transporte.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2 border-t border-stone-100">
              <div>
                <Label required>Data da Saída</Label>
                <Input
                  type="date"
                  value={data}
                  onChange={(e) => setData(e.target.value)}
                  error={erros.data}
                />
              </div>

              <div>
                <Label required>Item a retirar</Label>
                <Select
                  value={itemId}
                  onChange={(e) => setItemId(e.target.value)}
                  error={erros.itemId}
                  disabled={loadingItens}
                >
                  <option value="">Selecione o item do estoque...</option>
                  {itens.map((it) => (
                    <option key={it.id} value={it.id}>
                      [{it.id}] {it.item_nome} — {it.saldo_atual} {it.unidade} em estoque
                    </option>
                  ))}
                </Select>
                {itemSelecionado && (
                  <p className="text-[11px] text-stone-500 mt-1 flex items-center justify-between">
                    <span>
                      Categoria: <strong>{itemSelecionado.categoria}</strong>
                    </span>
                    <span
                      className={`font-semibold ${
                        itemSelecionado.saldo_atual <= itemSelecionado.estoque_minimo
                          ? "text-amber-700"
                          : "text-emerald-700"
                      }`}
                    >
                      Saldo disponível: {itemSelecionado.saldo_atual}{" "}
                      {itemSelecionado.unidade}
                    </span>
                  </p>
                )}
              </div>

              <div>
                <Label required>Quantidade da Saída</Label>
                <div className="relative">
                  <Input
                    type="number"
                    min="0.1"
                    step="any"
                    placeholder="Ex: 5, 10..."
                    value={quantidade}
                    onChange={(e) => setQuantidade(e.target.value)}
                    error={
                      saldoInsuficiente
                        ? `Saldo insuficiente: existem apenas ${saldoDisponivel} ${itemSelecionado?.unidade || "un"} disponíveis.`
                        : erros.quantidade
                    }
                    className="pr-16"
                  />
                  {itemSelecionado && (
                    <span className="absolute right-3 top-2.5 text-xs font-semibold text-stone-500 bg-stone-100 px-2 py-0.5 rounded">
                      {itemSelecionado.unidade}
                    </span>
                  )}
                </div>

                {saldoInsuficiente && (
                  <div className="mt-2 p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 shrink-0 text-red-600" />
                    <span>
                      <strong>Saldo insuficiente:</strong> você solicitou {quantidade}{" "}
                      {itemSelecionado?.unidade}, mas existem apenas {saldoDisponivel}{" "}
                      {itemSelecionado?.unidade} no estoque.
                    </span>
                  </div>
                )}
              </div>

              <div>
                <Label required>Responsável pela Operação</Label>
                <Input
                  placeholder="Nome do voluntário ou coordenador..."
                  value={responsavel}
                  onChange={(e) => setResponsavel(e.target.value)}
                  error={erros.responsavel}
                />
              </div>

              {tipoSaida === "Distribuição" && (
                <>
                  <div>
                    <Label required>Família / ONG / Pessoa Beneficiada</Label>
                    <Input
                      list="sugestoes-familias"
                      placeholder="Ex: Família Brito, ONG Esperança..."
                      value={familiaNome}
                      onChange={(e) => setFamiliaNome(e.target.value)}
                      error={erros.familiaNome}
                    />
                    <datalist id="sugestoes-familias">
                      {sugestoesFamilias.map((f) => (
                        <option key={f} value={f} />
                      ))}
                    </datalist>
                  </div>

                  <div>
                    <Label required>Local / Bairro / Comunidade</Label>
                    <Input
                      list="sugestoes-bairros"
                      placeholder="Ex: Jardim Esperança, Vila Nova..."
                      value={familiaBairro}
                      onChange={(e) => setFamiliaBairro(e.target.value)}
                      error={erros.familiaBairro}
                    />
                    <datalist id="sugestoes-bairros">
                      {sugestoesBairros.map((b) => (
                        <option key={b} value={b} />
                      ))}
                    </datalist>
                  </div>
                </>
              )}

              {tipoSaida === "Perda" && (
                <div className="md:col-span-2">
                  <Label required>Motivo da Perda</Label>
                  <Select
                    value={motivoPerda}
                    onChange={(e) => setMotivoPerda(e.target.value)}
                  >
                    <option value="Vencimento">Vencimento da data de validade</option>
                    <option value="Avaria">Avaria na embalagem ou transporte</option>
                    <option value="Umidade/Contaminação">Umidade ou contaminação</option>
                    <option value="Outro">Outro motivo</option>
                  </Select>
                </div>
              )}

              <div className="md:col-span-2">
                <Label>Observação / Destino ou Finalidade</Label>
                <textarea
                  rows={2}
                  placeholder={
                    tipoSaida === "Distribuição"
                      ? "Anotações adicionais da entrega, composição de cesta básica..."
                      : tipoSaida === "Consumo"
                      ? "Setor de destino ou refeição comunitária servida..."
                      : "Explicação do descarte ou procedimento de destinação..."
                  }
                  value={observacao}
                  onChange={(e) => setObservacao(e.target.value)}
                  className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-stone-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-stone-100 flex items-center justify-end gap-3">
              <Button
                type="submit"
                size="lg"
                variant="amber"
                isLoading={submetendo}
                disabled={saldoInsuficiente || !itemSelecionado || itemSelecionado.saldo_atual <= 0}
                className="font-bold px-8 shadow-sm cursor-pointer"
              >
                <CheckCircle className="w-4 h-4 text-amber-200" />
                <span>Confirmar Saída</span>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default SaidaPage;
