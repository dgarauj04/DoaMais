"use client";

import React, { useEffect, useState, useMemo } from "react";
import {
  History,
  Search,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Calendar,
  Filter,
  Info,
  Download,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { getMovimentacoes, Movimentacao, TipoMovimentacao } from "@/lib/data";
import { formatarData } from "@/lib/utils";

type OrdenacaoColuna = "data" | "quantidade";
type DirecaoOrdenacao = "asc" | "desc";

export default function HistoricoPage() {
  const [movimentacoes, setMovimentacoes] = useState<Movimentacao[]>([]);
  const [loading, setLoading] = useState(true);

  // Filtros
  const [busca, setBusca] = useState("");
  const [tipoFiltro, setTipoFiltro] = useState<string>("todos");
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");

  // Ordenação
  const [colunaOrdenacao, setColunaOrdenacao] = useState<OrdenacaoColuna>("data");
  const [direcaoOrdenacao, setDirecaoOrdenacao] = useState<DirecaoOrdenacao>("desc");

  useEffect(() => {
    async function carregar() {
      setLoading(true);
      try {
        const dados = await getMovimentacoes();
        setMovimentacoes(dados);
      } finally {
        setLoading(false);
      }
    }
    carregar();
  }, []);

  const alternarOrdenacao = (coluna: OrdenacaoColuna) => {
    if (colunaOrdenacao === coluna) {
      setDirecaoOrdenacao((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setColunaOrdenacao(coluna);
      setDirecaoOrdenacao("desc");
    }
  };

  // Filtragem e Ordenação
  const movimentacoesProcessadas = useMemo(() => {
    const filtradas = movimentacoes.filter((m) => {
      // Tipo de movimentação
      if (tipoFiltro !== "todos" && m.tipo !== tipoFiltro) {
        return false;
      }

      // Período: data início
      if (dataInicio && m.data < dataInicio) {
        return false;
      }

      // Período: data fim
      if (dataFim && m.data > dataFim) {
        return false;
      }

      // Busca por item, doador, família ou responsável
      if (busca.trim()) {
        const termo = busca.toLowerCase();
        const itemMatch = m.item_nome.toLowerCase().includes(termo);
        const doadorMatch = m.doador_nome?.toLowerCase().includes(termo);
        const familiaMatch = m.familia_nome?.toLowerCase().includes(termo);
        const responsavelMatch = m.responsavel?.toLowerCase().includes(termo);
        const bairroMatch = m.familia_bairro?.toLowerCase().includes(termo);
        const obsMatch = m.observacao?.toLowerCase().includes(termo);

        if (
          !itemMatch &&
          !doadorMatch &&
          !familiaMatch &&
          !responsavelMatch &&
          !bairroMatch &&
          !obsMatch
        ) {
          return false;
        }
      }

      return true;
    });

    // Ordenação
    return filtradas.sort((a, b) => {
      let resultado = 0;
      if (colunaOrdenacao === "data") {
        resultado = new Date(a.data).getTime() - new Date(b.data).getTime();
      } else if (colunaOrdenacao === "quantidade") {
        resultado = a.quantidade - b.quantidade;
      }

      return direcaoOrdenacao === "asc" ? resultado : -resultado;
    });
  }, [
    movimentacoes,
    busca,
    tipoFiltro,
    dataInicio,
    dataFim,
    colunaOrdenacao,
    direcaoOrdenacao,
  ]);

  const limparFiltros = () => {
    setBusca("");
    setTipoFiltro("todos");
    setDataInicio("");
    setDataFim("");
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-stone-200">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-stone-900 flex items-center gap-2">
            <History className="w-6 h-6 text-emerald-700" />
            Histórico de Movimentações
          </h2>
          <p className="text-sm text-stone-500 mt-0.5">
            Registro cronológico e auditável de entradas, distribuições, consumo interno e perdas.
          </p>
        </div>

        <div className="text-xs text-stone-500 font-medium">
          Total de <strong>{movimentacoesProcessadas.length}</strong> registros encontrados
        </div>
      </div>

      {/* FILTROS */}
      <Card className="doamais-card p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-end">
          {/* Busca por item ou doador/família */}
          <div className="lg:col-span-4 relative">
            <label className="block text-[11px] font-bold text-stone-600 uppercase mb-1">
              Buscar
            </label>
            <div className="relative">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3 pointer-events-none" />
              <Input
                placeholder="Item, doador, família beneficiada..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="pl-9 h-10"
              />
            </div>
          </div>

          {/* Tipo de movimentação */}
          <div className="lg:col-span-3">
            <label className="block text-[11px] font-bold text-stone-600 uppercase mb-1">
              Tipo de Operação
            </label>
            <Select
              value={tipoFiltro}
              onChange={(e) => setTipoFiltro(e.target.value)}
              className="h-10"
            >
              <option value="todos">Todos os tipos</option>
              <option value="entrada">🟢 Entrada (Doação)</option>
              <option value="distribuicao">🔵 Distribuição (Família)</option>
              <option value="consumo">⚪ Consumo Interno</option>
              <option value="perda">🔴 Perda / Avaria</option>
            </Select>
          </div>

          {/* Data Início */}
          <div className="lg:col-span-2">
            <label className="block text-[11px] font-bold text-stone-600 uppercase mb-1">
              Data Início
            </label>
            <Input
              type="date"
              value={dataInicio}
              onChange={(e) => setDataInicio(e.target.value)}
              className="h-10 text-xs"
            />
          </div>

          {/* Data Fim */}
          <div className="lg:col-span-2">
            <label className="block text-[11px] font-bold text-stone-600 uppercase mb-1">
              Data Fim
            </label>
            <Input
              type="date"
              value={dataFim}
              onChange={(e) => setDataFim(e.target.value)}
              className="h-10 text-xs"
            />
          </div>

          {/* Botão Limpar */}
          <div className="lg:col-span-1">
            <Button
              variant="outline"
              size="sm"
              onClick={limparFiltros}
              className="w-full h-10 text-xs text-stone-600 hover:text-stone-900"
              title="Limpar todos os filtros"
            >
              Limpar
            </Button>
          </div>
        </div>
      </Card>

      {/* TABELA COMPLETA */}
      <Card className="doamais-card overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-100/80 border-b border-stone-200 text-stone-700 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  {/* Coluna Data ordenável */}
                  <th
                    className="py-3 px-4 cursor-pointer hover:bg-stone-200/60 transition-colors select-none"
                    onClick={() => alternarOrdenacao("data")}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Data</span>
                      {colunaOrdenacao === "data" ? (
                        direcaoOrdenacao === "asc" ? (
                          <ArrowUp className="w-3.5 h-3.5 text-emerald-700" />
                        ) : (
                          <ArrowDown className="w-3.5 h-3.5 text-emerald-700" />
                        )
                      ) : (
                        <ArrowUpDown className="w-3.5 h-3.5 text-stone-400" />
                      )}
                    </div>
                  </th>

                  <th className="py-3 px-4">Tipo</th>
                  <th className="py-3 px-4">Item</th>

                  {/* Coluna Quantidade ordenável */}
                  <th
                    className="py-3 px-4 text-right cursor-pointer hover:bg-stone-200/60 transition-colors select-none"
                    onClick={() => alternarOrdenacao("quantidade")}
                  >
                    <div className="flex items-center justify-end gap-1.5">
                      <span>Quantidade</span>
                      {colunaOrdenacao === "quantidade" ? (
                        direcaoOrdenacao === "asc" ? (
                          <ArrowUp className="w-3.5 h-3.5 text-emerald-700" />
                        ) : (
                          <ArrowDown className="w-3.5 h-3.5 text-emerald-700" />
                        )
                      ) : (
                        <ArrowUpDown className="w-3.5 h-3.5 text-stone-400" />
                      )}
                    </div>
                  </th>

                  <th className="py-3 px-4">Origem / Destino</th>
                  <th className="py-3 px-4">Responsável</th>
                  <th className="py-3 px-4">Observação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-stone-800">
                {movimentacoesProcessadas.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-stone-500">
                      <p className="font-semibold text-stone-700">
                        Nenhuma movimentação encontrada
                      </p>
                      <p className="text-xs text-stone-400 mt-1">
                        Ajuste o período ou os critérios de busca.
                      </p>
                    </td>
                  </tr>
                ) : (
                  movimentacoesProcessadas.map((mov) => {
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
                        ? mov.doador_nome
                          ? `${mov.doador_nome} (${mov.doador_tipo || "Doador"})`
                          : mov.doador_tipo === "Anônimo"
                          ? "Doador Anônimo"
                          : "Doador Geral"
                        : mov.tipo === "distribuicao"
                        ? `${mov.familia_nome || "Família beneficiada"}${
                            mov.familia_bairro ? ` • ${mov.familia_bairro}` : ""
                          }`
                        : mov.tipo === "perda"
                        ? `Motivo: ${mov.motivo_perda || "Avaria"}`
                        : "Consumo interno da organização";

                    return (
                      <tr
                        key={mov.id}
                        className="hover:bg-stone-50/80 transition-colors"
                      >
                        {/* Data */}
                        <td className="py-3 px-4 whitespace-nowrap font-medium text-stone-600">
                          {formatarData(mov.data)}
                        </td>

                        {/* Tipo com badge colorida */}
                        <td className="py-3 px-4 whitespace-nowrap">
                          <Badge variant={badgeConfig.variant} className="font-semibold">
                            {badgeConfig.label}
                          </Badge>
                        </td>

                        {/* Item */}
                        <td className="py-3 px-4 font-bold text-stone-900">
                          {mov.item_nome}
                          {mov.validade_lote && (
                            <span className="block text-[10px] font-normal text-stone-500">
                              Validade lote: {formatarData(mov.validade_lote)}
                            </span>
                          )}
                        </td>

                        {/* Quantidade */}
                        <td className="py-3 px-4 text-right whitespace-nowrap font-bold text-stone-900">
                          {mov.quantidade}{" "}
                          <span className="font-normal text-stone-500 text-[11px]">
                            {mov.unidade}
                          </span>
                        </td>

                        {/* Origem / Destino */}
                        <td
                          className="py-3 px-4 max-w-[200px] truncate text-stone-700"
                          title={origemDestino}
                        >
                          {origemDestino}
                        </td>

                        {/* Responsável */}
                        <td className="py-3 px-4 whitespace-nowrap text-stone-600">
                          {mov.responsavel || "—"}
                        </td>

                        {/* Observação truncada com tooltip / hover */}
                        <td className="py-3 px-4 max-w-[220px]">
                          {mov.observacao ? (
                            <div
                              className="group relative inline-flex items-center gap-1 cursor-help"
                              title={mov.observacao}
                            >
                              <span className="truncate max-w-[180px] text-stone-600">
                                {mov.observacao}
                              </span>
                              <Info className="w-3 h-3 text-stone-400 shrink-0" />
                            </div>
                          ) : (
                            <span className="text-stone-300">—</span>
                          )}
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
    </div>
  );
}
