import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastProvider } from "@/components/ui/toast";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";

import { DashboardPage } from "@/pages/DashboardPage";
import { EstoquePage } from "@/pages/EstoquePage";
import { HistoricoPage } from "@/pages/HistoricoPage";
import { EntradaPage } from "@/pages/EntradaPage";
import { SaidaPage } from "@/pages/SaidaPage";

export function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <div className="min-h-screen bg-stone-50 font-sans text-stone-900 flex flex-col md:flex-row">
          {/* Sidebar fixa à esquerda no Desktop / Hambúrguer no Mobile */}
          <Sidebar />

          {/* Área Principal de Conteúdo */}
          <div className="flex-1 flex flex-col min-w-0 md:pl-64">
            <Header />
            <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
              <Routes>
                <Route path="/" element={<DashboardPage />} />
                <Route path="/estoque" element={<EstoquePage />} />
                <Route path="/historico" element={<HistoricoPage />} />
                <Route path="/entrada" element={<EntradaPage />} />
                <Route path="/saida" element={<SaidaPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
          </div>
        </div>
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;
