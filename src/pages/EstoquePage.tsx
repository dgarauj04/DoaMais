import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  PlusCircle,
  ArrowUpRight,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Package,
  Layers,
  RefreshCw,
  ExternalLink,
  FileSpreadsheet,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { NovoItemDialog } from "@/components/common/novo-item-dialog";
import { getItens, Item, obterUrlSheetsEstoque } from "@/lib/data";
import { formatarData } from "@/lib/utils";

type StatusFiltro = "todos" | "ok" | "minimo" | "validade";

export function EstoquePage() {
  const [itens, setItens] = useState<Item[]>([]);
  const [dataHoje, setDataHoje] = useState<Date>(new Date());
  const [loading, setLoading] = useState(true);
  const [sincronizando, setSincronizando] = useState(false);
  const [ultimaAtualizacao, setUltimaAtualizacao] = useState<Date | null>(null);

  const [busca, setBusca] = useState("");
  const [categoriaFiltro, setCategoriaFiltro] = useState<string>("todas");
  const [statusFiltro, setStatusFiltro] = useState<StatusFiltro>("todos");

  const [modalNovoItemAberto, setModalNovoItemAberto] = useState(false);

  const urlPlanilha = useMemo(() => obterUrlSheetsEstoque(), []);

  useEffect(() => {
    setDataHoje(new Date());
    carregarItens();
  }, []);

  async function carregarItens(forcar = false) {
    if (forcar) {
      setSincronizando(true);
    } else {
      setLoading(true);
    }
    try {
      const dados = await getItens(forcar);
      setItens(dados);
      setUltimaAtualizacao(new Date());
    } finally {
      setLoading(false);
      setSincronizando(false);
    }
  }

  const categoriasDisponiveis = useMemo(() => {
    const lista = new Set<string>();
    itens.forEach((it) => {
      if (it.categoria) lista.add(it.categoria);
    });
    return Array.from(lista).sort((a, b) => a.localeCompare(b));
  }, [itens]);

  const avaliarStatusItem = (item: Item) => {
    const hoje = new Date(dataHoje);
    hoje.setHours(0, 0, 0, 0);

    let ehCriticoValidade = false;
    let diasRestantes = 999;
    let vencido = false;

    if (item.controla_validade && item.validade_mais_proxima) {
      const dt = new Date(item.validade_mais_proxima + "T00:00:00");
      const diffMs = dt.getTime() - hoje.getTime();
      diasRestantes = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
      if (diasRestantes <= 7) {
        ehCriticoValidade = true;
        if (diasRestantes < 0) vencido = true;
      }
    }

    const ehAbaixoMinimo = item.saldo_atual <= item.estoque_minimo;

    if (ehCriticoValidade) {
      return {
        tipo: "validade" as const,
        label: vencido
          ? "Vencido"
          : diasRestantes === 0
          ? "Vence hoje"
          : `Vence em ${diasRestantes}d`,
        variant: "destructive" as const,
        icon: AlertCircle,
        corTexto: "text-red-700",
        corBg: "bg-red-50",
      };
    }

    if (ehAbaixoMinimo) {
      return {
        tipo: "minimo" as const,
        label: "Abaixo do mínimo",
        variant: "warning" as const,
        icon: AlertTriangle,
        corTexto: "text-amber-800",
        corBg: "bg-amber-50",
      };
    }

    return {
      tipo: "ok" as const,
      label: "OK",
      variant: "success" as const,
      icon: CheckCircle2,
      corTexto: "text-emerald-700",
      corBg: "bg-emerald-50",
    };
  };

  const itensFiltrados = useMemo(() => {
    return itens.filter((item) => {
      if (busca.trim()) {
        const termo = busca.toLowerCase();
        const nomeMatch = item.item_nome.toLowerCase().includes(termo);
        const catMatch = item.categoria.toLowerCase().includes(termo);
        if (!nomeMatch && !catMatch) return false;
      }

      if (categoriaFiltro !== "todas" && item.categoria !== categoriaFiltro) {
        return false;
      }

      if (statusFiltro !== "todos") {
        const statusItem = avaliarStatusItem(item);
        if (statusFiltro === "ok" && statusItem.tipo !== "ok") return false;
        if (statusFiltro === "minimo" && statusItem.tipo !== "minimo") return false;
        if (statusFiltro === "validade" && statusItem.tipo !== "validade") return false;
      }

      return true;
    });
  }, [itens, busca, categoriaFiltro, statusFiltro, dataHoje]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-2xl font-bold tracking-tight text-stone-900 flex items-center gap-2">
              <Package className="w-6 h-6 text-emerald-700" />
              Controle de Estoque
            </h2>
            <Badge
              variant="outline"
              className="bg-emerald-50/70 border-emerald-200 text-emerald-800 text-[11px] font-medium gap-1 px-2 py-0.5"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
              Google Planilhas (Aba Estoque)
            </Badge>
          </div>
          <p className="text-sm text-stone-500 mt-0.5">
            Visualize o saldo atual em estoque, limites mínimos de segurança e prazos de validade sincronizados da planilha.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={() => carregarItens(true)}
            disabled={sincronizando || loading}
            className="text-stone-700 hover:text-stone-900 border-stone-200 gap-1.5 h-9 text-xs"
            title="Buscar dados mais recentes do Google Planilhas"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${sincronizando ? "animate-spin text-emerald-600" : ""}`} />
            <span>{sincronizando ? "Sincronizando..." : "Sincronizar"}</span>
          </Button>

          {urlPlanilha && (
            <a
              href={urlPlanilha}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex"
            >
              <Button
                variant="outline"
                size="sm"
                className="text-stone-700 hover:text-emerald-800 hover:bg-emerald-50 hover:border-emerald-200 border-stone-200 gap-1.5 h-9 text-xs"
              >
                <ExternalLink className="w-3.5 h-3.5 text-emerald-600" />
                <span>Abrir Planilha</span>
              </Button>
            </a>
          )}

          <Button
            onClick={() => setModalNovoItemAberto(true)}
            className="bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs shadow-sm h-9"
          >
            <PlusCircle className="w-4 h-4 text-emerald-200" />
            <span>Novo Produto</span>
          </Button>
        </div>
      </div>

      <Card className="doamais-card p-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          <div className="md:col-span-5 relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3 pointer-events-none" />
            <Input
              placeholder="Buscar por nome do produto ou categoria..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="pl-9 h-10"
            />
          </div>

          <div className="md:col-span-3">
            <Select
              value={categoriaFiltro}
              onChange={(e) => setCategoriaFiltro(e.target.value)}
              className="h-10"
            >
              <option value="todas">Todas as categorias</option>
              {categoriasDisponiveis.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </Select>
          </div>

          <div className="md:col-span-4">
            <Select
              value={statusFiltro}
              onChange={(e) => setStatusFiltro(e.target.value as StatusFiltro)}
              className="h-10"
            >
              <option value="todos">Todos os status</option>
              <option value="ok">🟢 OK (Em conformidade)</option>
              <option value="minimo">🟡 Abaixo do mínimo</option>
              <option value="validade">🔴 Vencendo em 7 dias ou vencido</option>
            </Select>
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
          <div className="flex items-center gap-3">
            <span>
              Exibindo <strong>{itensFiltrados.length}</strong> de <strong>{itens.length}</strong> produtos
            </span>
            {ultimaAtualizacao && (
              <span className="text-stone-400 text-[11px] hidden sm:inline">
                • Atualizado às {ultimaAtualizacao.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
              </span>
            )}
          </div>
          {(busca || categoriaFiltro !== "todas" || statusFiltro !== "todos") && (
            <button
              onClick={() => {
                setBusca("");
                setCategoriaFiltro("todas");
                setStatusFiltro("todos");
              }}
              className="text-emerald-700 hover:underline font-medium cursor-pointer"
            >
              Limpar filtros
            </button>
          )}
        </div>
      </Card>

      <Card className="doamais-card overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-100/80 border-b border-stone-200 text-stone-700 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Item</th>
                  <th className="py-3 px-4">Categoria</th>
                  <th className="py-3 px-4 text-center">Saldo Atual</th>
                  <th className="py-3 px-4 text-center">Estoque Mínimo</th>
                  <th className="py-3 px-4">Validade Mais Próxima</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-stone-800">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-stone-500">
                      <RefreshCw className="w-7 h-7 mx-auto text-emerald-600 animate-spin mb-2" />
                      <p className="font-semibold text-stone-800 text-sm">Carregando estoque...</p>
                      <p className="text-xs text-stone-400 mt-1">
                        Sincronizando itens e saldos diretamente do Google Planilhas.
                      </p>
                    </td>
                  </tr>
                ) : itensFiltrados.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-stone-500">
                      <Layers className="w-8 h-8 mx-auto text-stone-300 mb-2" />
                      <p className="font-semibold text-stone-700">Nenhum produto encontrado</p>
                      <p className="text-xs text-stone-400 mt-1">
                        Tente ajustar os filtros ou cadastre um novo produto.
                      </p>
                    </td>
                  </tr>
                ) : (
                  itensFiltrados.map((item) => {
                    const status = avaliarStatusItem(item);
                    const StatusIcon = status.icon;
                    const abaixoDoMinimo = item.saldo_atual <= item.estoque_minimo;

                    return (
                      <tr
                        key={item.id}
                        className="hover:bg-stone-50/80 transition-colors"
                      >
                        <td className="py-3 px-4">
                          <p className="font-bold text-stone-900 text-sm">
                            {item.item_nome}
                          </p>
                          <span className="text-[11px] text-stone-400">
                            Unidade: {item.unidade}
                          </span>
                        </td>

                        <td className="py-3 px-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 font-medium text-xs">
                            {item.categoria}
                          </span>
                        </td>

                        <td className="py-3 px-4 text-center whitespace-nowrap">
                          <div
                            className={`inline-flex flex-col items-center justify-center px-3 py-1 rounded-lg border font-bold text-sm ${
                              abaixoDoMinimo
                                ? "bg-amber-50 border-amber-300 text-amber-900 shadow-2xs"
                                : "bg-stone-50 border-stone-200 text-stone-900"
                            }`}
                          >
                            <span>
                              {item.saldo_atual}{" "}
                              <span className="text-[11px] font-normal text-stone-500">
                                {item.unidade}
                              </span>
                            </span>
                            {abaixoDoMinimo && (
                              <span className="text-[10px] text-amber-700 font-semibold tracking-tight">
                                Atenção
                              </span>
                            )}
                          </div>
                        </td>

                        <td className="py-3 px-4 text-center whitespace-nowrap text-stone-600 font-medium">
                          {item.estoque_minimo} {item.unidade}
                        </td>

                        <td className="py-3 px-4 whitespace-nowrap text-stone-600">
                          {item.controla_validade && item.validade_mais_proxima ? (
                            <span className="font-medium text-stone-800">
                              {formatarData(item.validade_mais_proxima)}
                            </span>
                          ) : (
                            <span className="text-stone-400 italic">Não se aplica</span>
                          )}
                        </td>

                        <td className="py-3 px-4 whitespace-nowrap">
                          <Badge
                            variant={status.variant}
                            className="font-semibold text-xs gap-1"
                          >
                            <StatusIcon className="w-3 h-3" />
                            <span>{status.label}</span>
                          </Badge>
                        </td>

                        <td className="py-3 px-4 text-right whitespace-nowrap">
                          <Link to={`/saida?item_id=${item.id}`}>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-stone-700 hover:text-amber-900 hover:bg-amber-50 hover:border-amber-300 gap-1 text-xs"
                            >
                              <span>Registrar saída</span>
                              <ArrowUpRight className="w-3 h-3 text-amber-600" />
                            </Button>
                          </Link>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      
      <NovoItemDialog
        open={modalNovoItemAberto}
        onOpenChange={setModalNovoItemAberto}
        onItemCriado={(novoItem) => {
          setItens((prev) => [novoItem, ...prev]);
        }}
      />
    </div>
  );
}

export default EstoquePage;
