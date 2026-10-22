import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowDownLeft, ArrowUpRight, PlusCircle, RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NovoItemDialog } from "@/components/common/novo-item-dialog";
import { restaurarDadosIniciais } from "@/lib/data";
import { useToast } from "@/components/ui/toast";

export function Header() {
  const [openNovoItem, setOpenNovoItem] = useState(false);
  const { info } = useToast();

  const handleResetDemo = () => {
    restaurarDadosIniciais();
    info("Dados restaurados", "Os dados de exemplo foram redefinidos para os valores padrão.");
    setTimeout(() => {
      window.location.reload();
    }, 600);
  };

  return (
    <>
      <header className="sticky top-0 z-30 h-16 bg-white/95 backdrop-blur-md border-b border-stone-200 px-4 sm:px-8 flex items-center justify-between">
        <div className="flex items-center gap-3 pl-12 md:pl-0">
          <div className="hidden sm:block">
            <h1 className="text-sm font-semibold text-stone-900 tracking-tight">
              Organização Social Comunitária
            </h1>
            <p className="text-xs text-stone-500">
              Controle Solidário de Entradas, Distribuição e Estoque
            </p>
          </div>
          <span className="sm:hidden font-bold text-emerald-900 text-base">
            Doa<span className="text-emerald-700">Mais</span>
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={handleResetDemo}
            title="Redefinir dados para o exemplo original"
            className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg border border-stone-200 transition-colors cursor-pointer"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>Reset Demo</span>
          </button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setOpenNovoItem(true)}
            className="hidden md:flex text-stone-700 border-stone-300 hover:bg-stone-50 text-xs font-semibold"
          >
            <PlusCircle className="w-3.5 h-3.5 text-stone-500" />
            <span>Novo Produto</span>
          </Button>

          <Link to="/entrada">
            <Button
              size="sm"
              className="bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs font-semibold text-xs sm:text-sm px-3 sm:px-4"
            >
              <ArrowDownLeft className="w-4 h-4 text-emerald-200" />
              <span>Nova Entrada</span>
            </Button>
          </Link>

          <Link to="/saida">
            <Button
              variant="outline"
              size="sm"
              className="border-amber-300 bg-amber-50/50 hover:bg-amber-100/70 text-amber-900 font-semibold text-xs sm:text-sm px-3 sm:px-4 shadow-2xs"
            >
              <ArrowUpRight className="w-4 h-4 text-amber-600" />
              <span>Nova Saída</span>
            </Button>
          </Link>
        </div>
      </header>

      <NovoItemDialog
        open={openNovoItem}
        onOpenChange={setOpenNovoItem}
        onItemCriado={() => {
          window.location.reload();
        }}
      />
    </>
  );
}
