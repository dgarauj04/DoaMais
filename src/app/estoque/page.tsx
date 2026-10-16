"use client";

import React, { useEffect, useState, useMemo, Suspense } from "react";
import Link from "next/link";
import {
  Search,
  PlusCircle,
  ArrowUpRight,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Package,
  Layers,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { NovoItemDialog } from "@/components/common/novo-item-dialog";
import { getItens, Item } from "@/lib/data";
import { formatarData } from "@/lib/utils";

type StatusFiltro = "todos" | "ok" | "minimo" | "validade";

function EstoqueContent() {
  const [itens, setItens] = useState<Item[]>([]);
  const [dataHoje, setDataHoje] = useState<Date | null>(null);
  const [loading, setLoading] = useState(true);

  // Filtros
  const [busca, setBusca] = useState("");
  const [categoriaFiltro, setCategoriaFiltro] = useState<string>("todas");
  const [statusFiltro, setStatusFiltro] = useState<StatusFiltro>("todos");

  // Modal Novo Produto
  const [modalNovoItemAberto, setModalNovoItemAberto] = useState(false);

  useEffect(() => {
    setDataHoje(new Date());
    carregarItens();
  }, []);

  async function carregarItens() {
    setLoading(true);
    try {
      const dados = await getItens();
      setItens(dados);
    } finally {
      setLoading(false);
    }
  }

  // Helper para verificar status de cada item
  // REGRA DE STATUS:
  // Vermelho (🔴 Vencendo <= 7 dias ou vencido) tem prioridade sobre Amarelo (🟡 Abaixo do mínimo).
  const avaliarStatusItem = (item: Item) => {
    const hoje = dataHoje ? new Date(dataHoje) : new Date("2026-10-15T00:00:00");
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

  // Filtragem dos itens
  const itensFiltrados = useMemo(() => {
    return itens.filter((item) => {
      // Busca por nome
      if (busca.trim()) {
        const termo = busca.toLowerCase();
        const nomeMatch = item.item_nome.toLowerCase().includes(termo);
        const catMatch = item.categoria.toLowerCase().includes(termo);
        if (!nomeMatch && !catMatch) return false;
      }

      // Filtro de categoria
      if (categoriaFiltro !== "todas" && item.categoria !== categoriaFiltro) {
        return false;
      }

      // Filtro de status
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
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-stone-200">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-stone-900 flex items-center gap-2">
            <Package className="w-6 h-6 text-emerald-700" />
            Controle de Estoque
          </h2>
          <p className="text-sm text-stone-500 mt-0.5">
            Visualize o saldo atual em estoque, limites mínimos de segurança e prazos de validade.
          </p>
        </div>

        {/* Botão Novo Produto */}
        <Button
          onClick={() => setModalNovoItemAberto(true)}
          className="bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-sm shadow-sm"
        >
          <PlusCircle className="w-4 h-4 text-emerald-200" />
          <span>Novo Produto</span>
        </Button>
      </div>

      {/* FILTROS NO TOPO */}
      <Card className="doamais-card p-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          {/* Busca por nome */}
          <div className="md:col-span-5 relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3 pointer-events-none" />
            <Input
              placeholder="Buscar por nome do produto ou categoria..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="pl-9 h-10"
            />
          </div>

          {/* Select de Categoria */}
          <div className="md:col-span-3">
            <Select
              value={categoriaFiltro}
              onChange={(e) => setCategoriaFiltro(e.target.value)}
              className="h-10"
            >
              <option value="todas">Todas as categorias</option>
              <option value="Alimentos">Alimentos</option>
              <option value="Higiene">Higiene</option>
              <option value="Roupa">Roupa</option>
              <option value="Material Escolar">Material Escolar</option>
              <option value="Outro">Outro</option>
            </Select>
          </div>

          {/* Select de Status */}
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

        {/* Resumo da Filtragem */}
        <div className="mt-3 pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
          <span>
            Exibindo <strong>{itensFiltrados.length}</strong> de <strong>{itens.length}</strong> produtos
          </span>
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

      {/* TABELA DE ESTOQUE */}
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
                {itensFiltrados.length === 0 ? (
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
                        {/* Item */}
                        <td className="py-3 px-4">
                          <p className="font-bold text-stone-900 text-sm">
                            {item.item_nome}
                          </p>
                          <span className="text-[11px] text-stone-400">
                            Unidade: {item.unidade}
                          </span>
                        </td>

                        {/* Categoria */}
                        <td className="py-3 px-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 font-medium text-xs">
                            {item.categoria}
                          </span>
                        </td>

                        {/* Saldo Atual com destaque quando abaixo do mínimo */}
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

                        {/* Estoque Mínimo */}
                        <td className="py-3 px-4 text-center whitespace-nowrap text-stone-600 font-medium">
                          {item.estoque_minimo} {item.unidade}
                        </td>

                        {/* Validade mais próxima */}
                        <td className="py-3 px-4 whitespace-nowrap text-stone-600">
                          {item.controla_validade && item.validade_mais_proxima ? (
                            <span className="font-medium text-stone-800">
                              {formatarData(item.validade_mais_proxima)}
                            </span>
                          ) : (
                            <span className="text-stone-400 italic">Não se aplica</span>
                          )}
                        </td>

                        {/* Status (Badge colorida: vermelho tem prioridade sobre amarelo) */}
                        <td className="py-3 px-4 whitespace-nowrap">
                          <Badge
                            variant={status.variant}
                            className="font-semibold text-xs gap-1"
                          >
                            <StatusIcon className="w-3 h-3" />
                            <span>{status.label}</span>
                          </Badge>
                        </td>

                        {/* Botão Registrar Saída */}
                        <td className="py-3 px-4 text-right whitespace-nowrap">
                          <Link href={`/saida?item_id=${item.id}`}>
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

      {/* Modal de Cadastro de Novo Produto */}
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

export default function EstoquePage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[40vh] text-stone-500">
          Carregando controle de estoque...
        </div>
      }
    >
      <EstoqueContent />
    </Suspense>
  );
}
