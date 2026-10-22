import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Heart,
  LayoutDashboard,
  Package,
  History,
  ArrowDownLeft,
  ArrowUpRight,
  Menu,
  X,
  ExternalLink,
  HelpCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import logoDoaMais from "@/assets/img/Logo-DoaMais.png";

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const { pathname } = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    {
      name: "Dashboard",
      href: "/",
      icon: LayoutDashboard,
    },
    {
      name: "Estoque",
      href: "/estoque",
      icon: Package,
    },
    {
      name: "Histórico",
      href: "/historico",
      icon: History,
    },
  ];

  const registrarItems = [
    {
      name: "Nova Entrada",
      href: "/entrada",
      icon: ArrowDownLeft,
      color: "text-emerald-700",
      badge: "Doação",
    },
    {
      name: "Nova Saída",
      href: "/saida",
      icon: ArrowUpRight,
      color: "text-amber-700",
      badge: "Distribuição",
    },
  ];

  const closeMobile = () => setMobileOpen(false);

  return (
    <>
      <button
        onClick={() => setMobileOpen(true)}
        className="md:hidden fixed top-3.5 left-4 z-40 p-2 text-stone-700 bg-white border border-stone-200 rounded-lg shadow-xs hover:bg-stone-50"
        aria-label="Abrir menu de navegação"
      >
        <Menu className="w-5 h-5" />
      </button>

      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/40 backdrop-blur-xs transition-opacity"
          onClick={closeMobile}
        />
      )}

      <aside
        className={cn(
          "fixed top-0 bottom-0 left-0 z-40 w-64 bg-mauve-400/15 border-r border-stone-200 flex flex-col justify-between transition-transform duration-200 ease-in-out md:translate-x-0 shadow-xs",
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
          className
        )}
      >
        <div className="flex flex-col flex-1 overflow-y-auto">
          <div className="p-4 pb-3 border-b border-stone-100 flex items-center justify-between">
            <Link
              to="/"
              onClick={closeMobile}
              className="flex items-center group transition-transform hover:opacity-95"
              title="DoaMais - Início"
            >
              <img
                src={logoDoaMais}
                alt="DoaMais - Ação Social Comunitária"
                className="h-16 w-auto max-w-[200px] object-contain"
              />
            </Link>

            <button
              onClick={closeMobile}
              className="md:hidden text-stone-400 hover:text-stone-700 p-1 rounded-md"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="p-4 space-y-6">
            <div>
              <p className="px-3 text-[11px] font-bold text-stone-600 uppercase tracking-wider mb-2">
                Visão Geral
              </p>
              <div className="space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      to={item.href}
                      onClick={closeMobile}
                      className={cn(
                        "flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors",
                        isActive
                          ? "bg-emerald-50 text-emerald-800 font-semibold"
                          : "text-stone-600 hover:bg-stone-100 hover:text-stone-900"
                      )}
                    >
                      <Icon
                        className={cn(
                          "w-4 h-4",
                          isActive ? "text-emerald-700" : "text-stone-500"
                        )}
                      />
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            </div>

            <div>
              <p className="px-3 text-[11px] font-bold text-stone-600 uppercase tracking-wider mb-2">
                Registrar Movimento
              </p>
              <div className="space-y-1.5">
                {registrarItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      to={item.href}
                      onClick={closeMobile}
                      className={cn(
                        "flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all border",
                        isActive
                          ? "bg-emerald-700 text-white border-emerald-700 shadow-xs"
                          : "bg-white text-stone-700 border-stone-200 hover:border-stone-300 hover:bg-stone-50"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <Icon
                          className={cn(
                            "w-4 h-4",
                            isActive ? "text-white" : item.color
                          )}
                        />
                        <span>{item.name}</span>
                      </div>
                      <span
                        className={cn(
                          "text-[10px] font-semibold px-2 py-0.5 rounded-md uppercase tracking-wide",
                          isActive
                            ? "bg-white/20 text-white"
                            : "bg-stone-100 text-stone-600"
                        )}
                      >
                        {item.badge}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </nav>
        </div>

        <div className="p-4 border-t border-stone-100 bg-stone-50/70">
          <div className="p-3 bg-white border border-stone-200 rounded-xl shadow-2xs">
            <div className="flex items-center justify-between text-xs font-semibold text-stone-800">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Google Sheets / Webhook
              </span>
            </div>
            <p className="text-[11px] text-stone-500 mt-1 leading-snug">
              Sincronização em tempo real via Webhooks Make / Sheets.
            </p>
            <a
              href="https://docs.google.com/spreadsheets/d/1BmMa4MgyXv-l6y_cs6ea2Yt26jmnoZALvQDdaLf5ON0/edit"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2.5 flex items-center justify-center gap-1.5 w-full text-xs font-medium py-1.5 px-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5 text-stone-500" />
              Abrir Planilha
            </a>
          </div>

          <div className="mt-3 flex items-center justify-between text-[11px] text-stone-400 px-1">
            <span>Versão 1.0 (Comunitária)</span>
            <span className="flex items-center gap-1" title="Substitui o caderno de anotações">
              <HelpCircle className="w-3 h-3" />
              Sem login
            </span>
          </div>
        </div>
      </aside>
    </>
  );
}
