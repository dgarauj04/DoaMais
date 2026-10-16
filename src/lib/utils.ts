import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatarData(dataString: string | null | undefined): string {
  if (!dataString) return "—";
  try {
    const [ano, mes, dia] = dataString.split("T")[0].split("-");
    if (!ano || !mes || !dia) return dataString;
    return `${dia}/${mes}/${ano}`;
  } catch {
    return dataString;
  }
}

export function formatarNumero(num: number): string {
  return new Intl.NumberFormat("pt-BR").format(num);
}
