import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/ui/toast";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "DoaMais — Sistema de Controle de Doações e Estoque",
  description:
    "Sistema de controle comunitário de doações, entradas, saídas, distribuição e validade de itens para organizações sociais.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={`${inter.variable} antialiased`}>
      <body className="min-h-screen bg-stone-50 font-sans text-stone-900 flex flex-col md:flex-row">
        <ToastProvider>
          {/* Sidebar fixa à esquerda no Desktop / Hambúrguer no Mobile */}
          <Sidebar />

          {/* Área Principal de Conteúdo */}
          <div className="flex-1 flex flex-col min-w-0 md:pl-64">
            <Header />
            <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
              {children}
            </main>
          </div>
        </ToastProvider>
      </body>
    </html>
  );
}
