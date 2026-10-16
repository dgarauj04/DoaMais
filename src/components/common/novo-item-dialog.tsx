"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogContent,
  DialogFooter,
} from "@/lib/../components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, Label } from "@/components/ui/select";
import { useToast } from "@/components/ui/toast";
import {
  criarItem,
  CategoriaItem,
  UnidadeItem,
  Item,
} from "@/lib/data";
import { PackagePlus } from "lucide-react";

interface NovoItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onItemCriado?: (item: Item) => void;
}

export function NovoItemDialog({
  open,
  onOpenChange,
  onItemCriado,
}: NovoItemDialogProps) {
  const { success, error: toastError } = useToast();
  const [loading, setLoading] = useState(false);

  const [nome, setNome] = useState("");
  const [categoria, setCategoria] = useState<CategoriaItem>("Alimentos");
  const [unidade, setUnidade] = useState<UnidadeItem>("un");
  const [controlaValidade, setControlaValidade] = useState(true);
  const [estoqueMinimo, setEstoqueMinimo] = useState("10");
  const [saldoInicial, setSaldoInicial] = useState("0");
  const [validadeInicial, setValidadeInicial] = useState("");

  const [erros, setErros] = useState<Record<string, string>>({});

  const handleCategoriaChange = (novaCat: CategoriaItem) => {
    setCategoria(novaCat);
    if (novaCat === "Alimentos") {
      setControlaValidade(true);
    } else {
      setControlaValidade(false);
      setValidadeInicial("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const novosErros: Record<string, string> = {};

    if (!nome.trim()) {
      novosErros.nome = "O nome do produto é obrigatório.";
    }

    const minNum = Number(estoqueMinimo);
    if (isNaN(minNum) || minNum < 0) {
      novosErros.estoqueMinimo = "Informe um valor numérico válido (>= 0).";
    }

    const saldoNum = Number(saldoInicial);
    if (isNaN(saldoNum) || saldoNum < 0) {
      novosErros.saldoInicial = "O saldo inicial não pode ser negativo.";
    }

    if (Object.keys(novosErros).length > 0) {
      setErros(novosErros);
      return;
    }

    setErros({});
    setLoading(true);

    try {
      const res = await criarItem({
        item_nome: nome.trim(),
        categoria,
        unidade,
        controla_validade: controlaValidade,
        estoque_minimo: minNum,
        saldo_inicial: saldoNum,
        validade_inicial: controlaValidade && validadeInicial ? validadeInicial : undefined,
      });

      if (res.success && res.item) {
        success("Produto cadastrado com sucesso!", `${res.item.item_nome} foi adicionado ao estoque.`);
        onItemCriado?.(res.item);
        // Reset form
        setNome("");
        setEstoqueMinimo("10");
        setSaldoInicial("0");
        setValidadeInicial("");
        onOpenChange(false);
      } else {
        toastError("Erro ao cadastrar produto", res.message || "Tente novamente.");
      }
    } catch (err: unknown) {
      toastError("Falha na comunicação", err instanceof Error ? err.message : "Erro desconhecido.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <form onSubmit={handleSubmit}>
        <DialogHeader onClose={() => onOpenChange(false)}>
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-emerald-100 text-emerald-800 rounded-lg">
              <PackagePlus className="w-5 h-5" />
            </div>
            <div>
              <DialogTitle>Cadastrar Novo Produto</DialogTitle>
              <DialogDescription>
                Adicione um novo item ao catálogo de controle comunitário.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <DialogContent>
          <div>
            <Label required>Nome do Produto</Label>
            <Input
              placeholder="Ex: Óleo de Soja 900ml, Sabonete 90g..."
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              error={erros.nome}
              autoFocus
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label required>Categoria</Label>
              <Select
                value={categoria}
                onChange={(e) => handleCategoriaChange(e.target.value as CategoriaItem)}
              >
                <option value="Alimentos">Alimentos</option>
                <option value="Higiene">Higiene</option>
                <option value="Roupa">Roupa</option>
                <option value="Material Escolar">Material Escolar</option>
                <option value="Outro">Outro</option>
              </Select>
            </div>

            <div>
              <Label required>Unidade de Medida</Label>
              <Select
                value={unidade}
                onChange={(e) => setUnidade(e.target.value as UnidadeItem)}
              >
                <option value="un">un (unidade)</option>
                <option value="kg">kg (quilograma)</option>
                <option value="L">L (litro)</option>
                <option value="pacote">pacote</option>
                <option value="caixa">caixa</option>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label required>Estoque Mínimo de Alerta</Label>
              <Input
                type="number"
                min="0"
                value={estoqueMinimo}
                onChange={(e) => setEstoqueMinimo(e.target.value)}
                error={erros.estoqueMinimo}
              />
              <p className="text-[11px] text-stone-500 mt-1">
                Dispara aviso quando o saldo for menor ou igual.
              </p>
            </div>

            <div>
              <Label>Saldo Inicial em Estoque</Label>
              <Input
                type="number"
                min="0"
                value={saldoInicial}
                onChange={(e) => setSaldoInicial(e.target.value)}
                error={erros.saldoInicial}
              />
              <p className="text-[11px] text-stone-500 mt-1">
                Saldo físico atual já existente (opcional).
              </p>
            </div>
          </div>

          <div className="pt-2 border-t border-stone-100 space-y-3">
            <label className="flex items-center gap-2 cursor-pointer text-sm text-stone-700">
              <input
                type="checkbox"
                checked={controlaValidade}
                onChange={(e) => setControlaValidade(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-700 focus:ring-emerald-700 border-stone-300"
              />
              <span>Este produto possui data de validade a ser monitorada</span>
            </label>

            {controlaValidade && (
              <div className="animate-in fade-in duration-150">
                <Label>Validade Mais Próxima (se houver estoque)</Label>
                <Input
                  type="date"
                  value={validadeInicial}
                  onChange={(e) => setValidadeInicial(e.target.value)}
                />
              </div>
            )}
          </div>
        </DialogContent>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button type="submit" isLoading={loading}>
            Salvar Produto
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  );
}
