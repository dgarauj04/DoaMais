import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Boxes,
  AlertCircle,
  AlertTriangle,
  Gift,
  ArrowRight,
  TrendingUp,
  Clock,
  CheckCircle2,
  Calendar,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  getItens,
  getMovimentacoes,
  Item,
  Movimentacao,
} from "@/lib/data";
import { formatarData, formatarNumero } from "@/lib/utils";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export function DashboardPage() {
  const [itens, setItens] = useState<Item[]>([]);
  const [movimentacoes, setMovimentacoes] = useState<Movimentacao[]>([]);
  const [dataHoje, setDataHoje] = useState<Date>(new Date());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setDataHoje(new Date());
    async function carregarDados() {
      try {
        const [dadosItens, dadosMovs] = await Promise.all([
          getItens(),
          getMovimentacoes(),
        ]);
        setItens(dadosItens);
        setMovimentacoes(dadosMovs);
      } finally {
        setLoading(false);
      }
    }
    carregarDados();
  }, []);

  // Helper para cálculo de dias até a validade
  const calcularValidadeInfo = (dataValidade: string | null) => {
    if (!dataValidade) return null;
    const refDate = new Date(dataHoje);
    refDate.setHours(0, 0, 0, 0);
    const dataAlvo = new Date(dataValidade + "T00:00:00");
    const diffMs = dataAlvo.getTime() - refDate.getTime();
    const dias = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    return {
      dias,
      vencido: dias < 0,
      venceEmBreve: dias >= 0 && dias <= 7,
    };
  };

  // KPIs
  const kpis = useMemo(() => {
    const totalItensDistintos = itens.length;

    // Itens vencendo em até 7 dias ou já vencidos
    const itensVencendo = itens.filter((item) => {
      if (!item.controla_validade || !item.validade_mais_proxima) return false;
      const info = calcularValidadeInfo(item.validade_mais_proxima);
      return info && (info.vencido || info.venceEmBreve);
    });

    // Itens abaixo do estoque mínimo
    const itensAbaixoMinimo = itens.filter(
      (item) => item.saldo_atual < item.estoque_minimo
    );

    // Total de unidades distribuídas no mês atual
    const ref = new Date(dataHoje);
    const anoAtual = ref.getFullYear();
    const mesAtual = ref.getMonth() + 1;
    const mesStr = String(mesAtual).padStart(2, "0");
    const prefixoMesAtual = `${anoAtual}-${mesStr}`;

    const totalDistribuidoMes = movimentacoes
      .filter((m) => m.tipo === "distribuicao" && m.data.startsWith(prefixoMesAtual))
      .reduce((soma, m) => soma + m.quantidade, 0);

    return {
      totalItensDistintos,
      vencendoCount: itensVencendo.length,
      abaixoMinimoCount: itensAbaixoMinimo.length,
      totalDistribuidoMes,
    };
  }, [itens, movimentacoes, dataHoje]);

  // Lista de Alertas de Validade (<= 7 dias ou vencidos)
  const alertasValidade = useMemo(() => {
    return itens
      .filter((item) => {
        if (!item.controla_validade || !item.validade_mais_proxima) return false;
        const info = calcularValidadeInfo(item.validade_mais_proxima);
        return info && (info.vencido || info.venceEmBreve);
      })
      .map((item) => {
        const info = calcularValidadeInfo(item.validade_mais_proxima)!;
        return {
          ...item,
          dias: info.dias,
          vencido: info.vencido,
        };
      })
      .sort((a, b) => a.dias - b.dias);
  }, [itens, dataHoje]);

  // Gráfico: Entradas vs Distribuição vs Perdas por mês (últimos 6 meses)
  const dadosGrafico = useMemo(() => {
    const meses: { chave: string; label: string }[] = [];
    const nomesMeses = [
      "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
      "Jul", "Ago", "Set", "Out", "Nov", "Dez"
    ];

    const dataRef = new Date(dataHoje);
    for (let i = 5; i >= 0; i--) {
      const d = new Date(dataRef.getFullYear(), dataRef.getMonth() - i, 1);
      const chave = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      meses.push({
        chave,
        label: `${nomesMeses[d.getMonth()]}/${String(d.getFullYear()).slice(2)}`,
      });
    }

    return meses.map((m) => {
      let entradas = 0;
      let distribuicao = 0;
      let perdas = 0;

      movimentacoes.forEach((mov) => {
        if (mov.data.startsWith(m.chave)) {
          if (mov.tipo === "entrada") entradas += mov.quantidade;
          else if (mov.tipo === "distribuicao") distribuicao += mov.quantidade;
          else if (mov.tipo === "perda") perdas += mov.quantidade;
        }
      });

      return {
        mes: m.label,
        Entradas: entradas,
        Distribuição: distribuicao,
        Perdas: perdas,
      };
    });
  }, [movimentacoes, dataHoje]);

  // 8 últimas movimentações
  const ultimasMovimentacoes = useMemo(() => {
    return [...movimentacoes]
      .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime() || b.id.localeCompare(a.id))
      .slice(0, 8);
  }, [movimentacoes]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3 text-stone-500">
        <div className="w-8 h-8 border-3 border-emerald-700 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-medium">Carregando painel de acompanhamento...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Banner de Boas-vindas e Contexto */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-stone-200">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-stone-900">
            Painel de Acompanhamento
          </h2>
          <p className="text-sm text-stone-500 mt-0.5">
            Visão consolidada do estoque comunitário, alertas e fluxos de doações.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-medium text-stone-600 bg-white border border-stone-200 px-3 py-1.5 rounded-lg shadow-2xs">
          <Calendar className="w-3.5 h-3.5 text-stone-400" />
          <span>Mês de referência: Outubro de 2026</span>
        </div>
      </div>

      {/* 1. LINHA DE 4 CARDS KPI */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Itens em estoque */}
        <Card className="doamais-card kpi-card kpi-default">
          <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between space-y-0">
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
              Itens em Estoque
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Boxes className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-1">
            <div className="text-2xl font-extrabold text-stone-900">
              {kpis.totalItensDistintos}
            </div>
            <p className="text-xs text-stone-500 mt-1 flex items-center gap-1">
              <span>produtos cadastrados</span>
            </p>
          </CardContent>
        </Card>

        {/* Card 2: Vencendo em 7 dias (Borda e texto vermelho) */}
        <Card
          className={`doamais-card kpi-card kpi-danger ${
            kpis.vencendoCount > 0
              ? "border-red-300 bg-red-50/20"
              : ""
          }`}
        >
          <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between space-y-0">
            <span className="text-xs font-semibold uppercase tracking-wider text-red-700">
              Vencendo em 7 dias
            </span>
            <div className="w-8 h-8 rounded-lg bg-red-100 text-red-700 flex items-center justify-center">
              <AlertCircle className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-1">
            <div className="text-2xl font-extrabold text-red-600">
              {kpis.vencendoCount}
            </div>
            <p className="text-xs text-red-600/90 font-medium mt-1">
              {kpis.vencendoCount === 1
                ? "1 item requer atenção urgente"
                : `${kpis.vencendoCount} itens com risco ou vencidos`}
            </p>
          </CardContent>
        </Card>

        {/* Card 3: Abaixo do mínimo (Âmbar) */}
        <Card
          className={`doamais-card kpi-card kpi-warning ${
            kpis.abaixoMinimoCount > 0
              ? "border-amber-300 bg-amber-50/20"
              : ""
          }`}
        >
          <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between space-y-0">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-700">
              Abaixo do Mínimo
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-1">
            <div className="text-2xl font-extrabold text-amber-700">
              {kpis.abaixoMinimoCount}
            </div>
            <p className="text-xs text-amber-800/90 font-medium mt-1">
              itens precisando de reposição
            </p>
          </CardContent>
        </Card>

        {/* Card 4: Distribuído no mês */}
        <Card className="doamais-card kpi-card kpi-info">
          <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between space-y-0">
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
              Distribuído no Mês
            </span>
            <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center">
              <Gift className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-1">
            <div className="text-2xl font-extrabold text-stone-900">
              {formatarNumero(kpis.totalDistribuidoMes)}
            </div>
            <p className="text-xs text-stone-500 mt-1">
              unidades entregues a famílias
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 2. SEÇÃO CENTRAL: GRÁFICO + PAINEL LATERAL DE VALIDADE */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Gráfico de Barras Agrupadas (2 colunas) */}
        <Card className="lg:col-span-2 doamais-card flex flex-col justify-between">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold text-stone-900 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-700" />
                  Fluxo de Doações dos Últimos 6 Meses
                </CardTitle>
                <p className="text-xs text-stone-500 mt-0.5">
                  Comparativo de Entradas, Distribuição e Perdas por mês
                </p>
              </div>
              <div className="hidden sm:flex items-center gap-3 text-xs text-stone-500 font-medium">
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-xs bg-emerald-700" /> Entradas
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-xs bg-sky-600" /> Distribuição
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-xs bg-red-500" /> Perdas
                </span>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-2 pb-4">
            <div className="h-72 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={dadosGrafico}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  barCategoryGap={16}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0eeee" />
                  <XAxis
                    dataKey="mes"
                    stroke="#78716c"
                    fontSize={11}
                    tickLine={false}
                    axisLine={{ stroke: "#e7e5e4" }}
                  />
                  <YAxis
                    stroke="#78716c"
                    fontSize={11}
                    tickLine={false}
                    axisLine={{ stroke: "#e7e5e4" }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#ffffff",
                      borderRadius: "8px",
                      border: "1px solid #e7e5e4",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                      fontSize: "12px",
                    }}
                  />
                  <Legend
                    verticalAlign="bottom"
                    wrapperStyle={{ paddingTop: "12px", fontSize: "12px" }}
                  />
                  <Bar
                    dataKey="Entradas"
                    fill="#047857"
                    radius={[4, 4, 0, 0]}
                    name="Entradas"
                  />
                  <Bar
                    dataKey="Distribuição"
                    fill="#0284c7"
                    radius={[4, 4, 0, 0]}
                    name="Distribuição"
                  />
                  <Bar
                    dataKey="Perdas"
                    fill="#ef4444"
                    radius={[4, 4, 0, 0]}
                    name="Perdas"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* 3. PAINEL LATERAL: ALERTAS DE VALIDADE */}
        <Card className="doamais-card flex flex-col">
          <CardHeader className="pb-3 border-b border-stone-100">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-bold text-stone-900 flex items-center gap-2">
                <Clock className="w-4 h-4 text-red-600" />
                Alertas de Validade
              </CardTitle>
              <Badge variant={alertasValidade.length > 0 ? "destructive" : "secondary"}>
                {alertasValidade.length}
              </Badge>
            </div>
            <p className="text-xs text-stone-500 mt-0.5">
              Itens que vencem nos próximos 7 dias ou já venceram
            </p>
          </CardHeader>

          <CardContent className="p-4 flex-1 flex flex-col justify-start overflow-y-auto max-h-[310px]">
            {alertasValidade.length === 0 ? (
              <div className="flex flex-col items-center justify-center my-auto py-8 text-center">
                <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center mb-2">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <p className="text-sm font-semibold text-stone-800">
                  Tudo sob controle!
                </p>
                <p className="text-xs text-stone-500 max-w-xs mt-1">
                  Nenhum produto com validade crítica ou vencida nos próximos 7 dias.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {alertasValidade.map((item) => (
                  <div
                    key={item.id}
                    className={`p-3 rounded-lg border text-xs transition-colors flex items-start justify-between gap-3 ${
                      item.vencido
                        ? "bg-red-50/80 border-red-200 text-red-950"
                        : "bg-amber-50/70 border-amber-200 text-amber-950"
                    }`}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-bold truncate text-stone-900">
                        {item.item_nome}
                      </p>
                      <p className="text-[11px] text-stone-600 mt-0.5">
                        Saldo: <span className="font-semibold text-stone-900">{item.saldo_atual} {item.unidade}</span> • Validade: {formatarData(item.validade_mais_proxima)}
                      </p>
                    </div>

                    <div className="shrink-0">
                      {item.vencido ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-600 text-white animate-soft-pulse">
                          {item.dias === -1
                            ? "Venceu ontem"
                            : `Vencido há ${Math.abs(item.dias)} dias`}
                        </span>
                      ) : item.dias === 0 ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-600 text-white">
                          Vence hoje!
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-600 text-white">
                          {`Vence em ${item.dias} dias`}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* 4. TABELA DE ÚLTIMAS MOVIMENTAÇÕES (8 mais recentes) */}
      <Card className="doamais-card overflow-hidden">
        <CardHeader className="pb-3 border-b border-stone-200/80 bg-stone-50/50">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <CardTitle className="text-base font-bold text-stone-900">
                Últimas Movimentações Registradas
              </CardTitle>
              <p className="text-xs text-stone-500 mt-0.5">
                Os 8 registros mais recentes de entradas, distribuições, consumo ou perdas
              </p>
            </div>
            <Link to="/historico">
              <Button variant="ghost" size="sm" className="text-emerald-700 hover:text-emerald-800 gap-1 text-xs">
                <span>Ver histórico completo</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-100/75 border-b border-stone-200 text-stone-700 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Data</th>
                  <th className="py-3 px-4">Tipo</th>
                  <th className="py-3 px-4">Item</th>
                  <th className="py-3 px-4 text-right">Quantidade</th>
                  <th className="py-3 px-4">Origem / Destino</th>
                  <th className="py-3 px-4">Responsável</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-stone-800">
                {ultimasMovimentacoes.map((mov) => {
                  const badgeMap = {
                    entrada: { label: "Entrada", variant: "success" as const },
                    distribuicao: { label: "Distribuição", variant: "info" as const },
                    consumo: { label: "Consumo", variant: "secondary" as const },
                    perda: { label: "Perda", variant: "destructive" as const },
                  };
                  const badgeConfig = badgeMap[mov.tipo] || {
                    label: mov.tipo,
                    variant: "secondary" as const,
                  };

                  const origemDestino =
                    mov.tipo === "entrada"
                      ? mov.doador_nome || (mov.doador_tipo === "Anônimo" ? "Doador Anônimo" : "Doador não informado")
                      : mov.tipo === "distribuicao"
                      ? `${mov.familia_nome || "Família beneficiada"}${mov.familia_bairro ? ` (${mov.familia_bairro})` : ""}`
                      : mov.tipo === "perda"
                      ? `Motivo: ${mov.motivo_perda || "Avaria/Perda"}`
                      : "Consumo interno comunitário";

                  return (
                    <tr
                      key={mov.id}
                      className="hover:bg-stone-50/80 transition-colors"
                    >
                      <td className="py-3 px-4 whitespace-nowrap text-stone-600 font-medium">
                        {formatarData(mov.data)}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <Badge variant={badgeConfig.variant}>
                          {badgeConfig.label}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 font-semibold text-stone-900">
                        {mov.item_nome}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap text-right font-bold text-stone-900">
                        {mov.quantidade} <span className="font-normal text-stone-500">{mov.unidade}</span>
                      </td>
                      <td className="py-3 px-4 text-stone-700 max-w-[220px] truncate" title={origemDestino}>
                        {origemDestino}
                      </td>
                      <td className="py-3 px-4 text-stone-500 whitespace-nowrap">
                        {mov.responsavel || "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default DashboardPage;
