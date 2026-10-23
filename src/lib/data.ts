export type CategoriaItem =
  | "Alimentos"
  | "Higiene"
  | "Roupa"
  | "Roupas"
  | "Material Escolar"
  | "Limpeza"
  | "Eletrônicos"
  | "Outro"
  | (string & {});

export type UnidadeItem =
  | "kg"
  | "L"
  | "un"
  | "unidade"
  | "caixa"
  | "pacote"
  | "lata"
  | "peça"
  | (string & {});

export type TipoMovimentacao = "entrada" | "distribuicao" | "consumo" | "perda";

export type DoadorTipo = "Pessoa" | "Empresa" | "Anônimo";

export interface Item {
  id: string;
  item_nome: string;
  categoria: CategoriaItem;
  unidade: UnidadeItem;
  controla_validade: boolean;
  estoque_minimo: number;
  saldo_atual: number;
  validade_mais_proxima: string | null; // ISO YYYY-MM-DD
  total_entradas?: number;
  total_saidas?: number;
}

export interface Movimentacao {
  id: string; // Gerado automaticamente pelo Sheets / Webhook
  data: string; // ISO YYYY-MM-DD
  tipo: TipoMovimentacao;
  item_id: string; // Código do item gerado no Sheets (ex: "ITM-0001")
  item_nome: string;
  quantidade: number; // sempre positiva
  unidade: string;
  doador_tipo?: DoadorTipo;
  doador_nome?: string;
  doador_contato?: string;
  validade_lote?: string;
  familia_nome?: string;
  familia_bairro?: string;
  bairro?: string;
  responsavel?: string;
  motivo_perda?: string;
  observacao?: string;
}

export interface EntradaPayload {
  tipo_acao: "entrada";
  item_id: string; // "ITM-0001"
  item_nome: string;
  quantidade: number;
  unidade: string;
  doador_tipo: DoadorTipo;
  doador_nome?: string;
  doador_contato?: string;
  validade_lote?: string;
  observacao?: string;
  // Campos opcionais de compatibilidade
  data?: string;
  categoria?: CategoriaItem;
}

export interface SaidaPayload {
  tipo_acao: "saida";
  tipo: "distribuicao" | "consumo" | "perda" | "Distribuição" | "Consumo" | "Perda" | string;
  item_id: string; // "ITM-0002"
  item_nome: string;
  quantidade: number;
  unidade: string;
  familia_nome?: string;
  bairro?: string;
  motivo_perda?: string;
  responsavel: string;
  observacao?: string;
  // Campos opcionais de compatibilidade
  data?: string;
  familia_bairro?: string;
}

export interface NovoItemPayload {
  tipo_acao: "novo_item";
  item_nome: string;
  categoria: CategoriaItem;
  unidade: UnidadeItem | string;
  controla_validade: boolean;
  estoque_minimo: number;
  // Campos opcionais para inicialização local
  saldo_inicial?: number;
  validade_inicial?: string;
}

// ----------------------------------------------------------------------------
// DADOS INICIAIS (MOCK) — Baseados na data corrente
// ----------------------------------------------------------------------------
const ITENS_MOCK_INICIAIS: Item[] = [
  {
    id: "ITM-0001",
    item_nome: "Arroz Agulhinha 5kg",
    categoria: "Alimentos",
    unidade: "caixa",
    controla_validade: true,
    estoque_minimo: 5,
    saldo_atual: 12,
    validade_mais_proxima: "2027-04-10",
  },
  {
    id: "ITM-0002",
    item_nome: "Feijão Carioca Tipo 1",
    categoria: "Alimentos",
    unidade: "kg",
    controla_validade: true,
    estoque_minimo: 10,
    saldo_atual: 30,
    validade_mais_proxima: "2027-02-15",
  },
  {
    id: "ITM-0003",
    item_nome: "Leite UHT Integral 1L",
    categoria: "Alimentos",
    unidade: "un",
    controla_validade: true,
    estoque_minimo: 24,
    saldo_atual: 48,
    validade_mais_proxima: "2026-10-24", // Vence em 4 dias
  },
  {
    id: "ITM-0004",
    item_nome: "Macarrão Espaguete 500g",
    categoria: "Alimentos",
    unidade: "pacote",
    controla_validade: true,
    estoque_minimo: 15,
    saldo_atual: 25,
    validade_mais_proxima: "2027-06-30",
  },
  {
    id: "ITM-0005",
    item_nome: "Óleo de Soja 900ml",
    categoria: "Alimentos",
    unidade: "un",
    controla_validade: true,
    estoque_minimo: 10,
    saldo_atual: 18,
    validade_mais_proxima: "2027-05-18",
  },
  {
    id: "ITM-0006",
    item_nome: "Sardinha em Lata 125g",
    categoria: "Alimentos",
    unidade: "un",
    controla_validade: true,
    estoque_minimo: 15,
    saldo_atual: 8, // Abaixo do mínimo!
    validade_mais_proxima: "2028-01-20",
  },
  {
    id: "ITM-0007",
    item_nome: "Farinha de Trigo Especial 1kg",
    categoria: "Alimentos",
    unidade: "kg",
    controla_validade: true,
    estoque_minimo: 8,
    saldo_atual: 2, // Abaixo do mínimo E vencendo em breve!
    validade_mais_proxima: "2026-10-22", // Vence em 2 dias
  },
  {
    id: "ITM-0008",
    item_nome: "Biscoito Maisena 400g",
    categoria: "Alimentos",
    unidade: "pacote",
    controla_validade: true,
    estoque_minimo: 10,
    saldo_atual: 14,
    validade_mais_proxima: "2026-10-26", // Vence em 6 dias
  },
  {
    id: "ITM-0009",
    item_nome: "Iogurte Natural 170g",
    categoria: "Alimentos",
    unidade: "un",
    controla_validade: true,
    estoque_minimo: 10,
    saldo_atual: 6,
    validade_mais_proxima: "2026-10-16", // Vencido há 4 dias!
  },
  {
    id: "ITM-0010",
    item_nome: "Sabonete em Barra 90g",
    categoria: "Higiene",
    unidade: "un",
    controla_validade: false,
    estoque_minimo: 20,
    saldo_atual: 45,
    validade_mais_proxima: null,
  },
  {
    id: "ITM-0011",
    item_nome: "Detergente Líquido Neutro 500ml",
    categoria: "Higiene",
    unidade: "un",
    controla_validade: false,
    estoque_minimo: 15,
    saldo_atual: 30,
    validade_mais_proxima: null,
  },
  {
    id: "ITM-0012",
    item_nome: "Creme Dental Flúor 90g",
    categoria: "Higiene",
    unidade: "un",
    controla_validade: false,
    estoque_minimo: 15,
    saldo_atual: 40,
    validade_mais_proxima: null,
  },
  {
    id: "ITM-0013",
    item_nome: "Água Sanitária 1L",
    categoria: "Higiene",
    unidade: "L",
    controla_validade: false,
    estoque_minimo: 10,
    saldo_atual: 12,
    validade_mais_proxima: null,
  },
  {
    id: "ITM-0014",
    item_nome: "Cobertores Térmicos de Casal",
    categoria: "Roupa",
    unidade: "un",
    controla_validade: false,
    estoque_minimo: 10,
    saldo_atual: 3, // Abaixo do mínimo!
    validade_mais_proxima: null,
  },
  {
    id: "ITM-0015",
    item_nome: "Camisetas Infantis Algodão",
    categoria: "Roupa",
    unidade: "un",
    controla_validade: false,
    estoque_minimo: 10,
    saldo_atual: 15,
    validade_mais_proxima: null,
  },
  {
    id: "ITM-0016",
    item_nome: "Agasalhos de Lã Juvenil",
    categoria: "Roupa",
    unidade: "un",
    controla_validade: false,
    estoque_minimo: 8,
    saldo_atual: 4, // Abaixo do mínimo!
    validade_mais_proxima: null,
  },
  {
    id: "ITM-0017",
    item_nome: "Cadernos Universitários 96 fls",
    categoria: "Material Escolar",
    unidade: "un",
    controla_validade: false,
    estoque_minimo: 10,
    saldo_atual: 22,
    validade_mais_proxima: null,
  },
  {
    id: "ITM-0018",
    item_nome: "Caixa de Lápis de Cor 12 Cores",
    categoria: "Material Escolar",
    unidade: "caixa",
    controla_validade: false,
    estoque_minimo: 8,
    saldo_atual: 14,
    validade_mais_proxima: null,
  },
];

const MOVIMENTACOES_MOCK_INICIAIS: Movimentacao[] = [
  // Mês atual
  {
    id: "mov-41",
    data: "2026-10-20",
    tipo: "distribuicao",
    item_id: "ITM-0001",
    item_nome: "Arroz Agulhinha 5kg",
    quantidade: 2,
    unidade: "caixa",
    familia_nome: "Família Barbosa",
    familia_bairro: "Vila Progresso",
    bairro: "Vila Progresso",
    responsavel: "Assistente Ana Lúcia",
    observacao: "Entrega emergencial cesta básica",
  },
  {
    id: "mov-40",
    data: "2026-10-18",
    tipo: "entrada",
    item_id: "ITM-0003",
    item_nome: "Leite UHT Integral 1L",
    quantidade: 24,
    unidade: "un",
    doador_tipo: "Empresa",
    doador_nome: "Laticínios Vale Verde",
    doador_contato: "contato@valeverde.com.br",
    validade_lote: "2026-10-24",
    observacao: "Doação com validade curta recebida para distribuição rápida",
  },
  {
    id: "mov-36",
    data: "2026-10-08",
    tipo: "entrada",
    item_id: "ITM-0010",
    item_nome: "Sabonete em Barra 90g",
    quantidade: 30,
    unidade: "un",
    doador_tipo: "Pessoa",
    doador_nome: "Dra. Juliana Mendes",
    doador_contato: "(11) 98765-4321",
    observacao: "Campanha de higiene pessoal",
  },
  {
    id: "mov-35",
    data: "2026-10-05",
    tipo: "distribuicao",
    item_id: "ITM-0014",
    item_nome: "Cobertores Térmicos de Casal",
    quantidade: 4,
    unidade: "un",
    familia_nome: "Família Ferreira",
    familia_bairro: "Morro da Paz",
    bairro: "Morro da Paz",
    responsavel: "Assistente Ana Lúcia",
    observacao: "Atendimento frente fria",
  },
  {
    id: "mov-34",
    data: "2026-10-02",
    tipo: "entrada",
    item_id: "ITM-0001",
    item_nome: "Arroz Agulhinha 5kg",
    quantidade: 10,
    unidade: "caixa",
    doador_tipo: "Empresa",
    doador_nome: "Supermercado Bom Preço",
    doador_contato: "social@bompreco.com.br",
    validade_lote: "2027-04-10",
    observacao: "Doação mensal de gêneros de primeira necessidade",
  },

  // Setembro / 2026
  {
    id: "mov-33",
    data: "2026-09-28",
    tipo: "distribuicao",
    item_id: "ITM-0004",
    item_nome: "Macarrão Espaguete 500g",
    quantidade: 12,
    unidade: "pacote",
    familia_nome: "Família Silva Ramos",
    familia_bairro: "Bairro São José",
    bairro: "Bairro São José",
    responsavel: "Carlos Eduardo",
    observacao: "Apoio a família de 6 pessoas",
  },
  {
    id: "mov-27",
    data: "2026-09-05",
    tipo: "consumo",
    item_id: "ITM-0013",
    item_nome: "Água Sanitária 1L",
    quantidade: 2,
    unidade: "L",
    responsavel: "Dona Neide",
    observacao: "Higienização sanitária do salão de eventos",
  },
  {
    id: "mov-26",
    data: "2026-09-02",
    tipo: "distribuicao",
    item_id: "ITM-0015",
    item_nome: "Camisetas Infantis Algodão",
    quantidade: 6,
    unidade: "un",
    familia_nome: "Família Nascimento",
    familia_bairro: "Jardim Esperança",
    bairro: "Jardim Esperança",
    responsavel: "Mariana Souza",
  },

  // Agosto / 2026
  {
    id: "mov-24",
    data: "2026-08-25",
    tipo: "entrada",
    item_id: "ITM-0005",
    item_nome: "Óleo de Soja 900ml",
    quantidade: 20,
    unidade: "un",
    doador_tipo: "Empresa",
    doador_nome: "Distribuidora Aliança",
    doador_contato: "atendimento@aliancadist.com.br",
    validade_lote: "2027-05-18",
  },
  {
    id: "mov-21",
    data: "2026-08-10",
    tipo: "perda",
    item_id: "ITM-0007",
    item_nome: "Farinha de Trigo Especial 1kg",
    quantidade: 1,
    unidade: "kg",
    motivo_perda: "Avaria",
    responsavel: "Seu Roberto",
    observacao: "Pacote rasgado no descarregamento",
  },
  {
    id: "mov-20",
    data: "2026-08-04",
    tipo: "distribuicao",
    item_id: "ITM-0003",
    item_nome: "Leite UHT Integral 1L",
    quantidade: 18,
    unidade: "un",
    familia_nome: "Família Moreira",
    familia_bairro: "Vila Progresso",
    bairro: "Vila Progresso",
    responsavel: "Mariana Souza",
  },

  // Julho / 2026
  {
    id: "mov-19",
    data: "2026-07-28",
    tipo: "distribuicao",
    item_id: "ITM-0014",
    item_nome: "Cobertores Térmicos de Casal",
    quantidade: 8,
    unidade: "un",
    familia_nome: "Ação de Inverno",
    familia_bairro: "Vila Nova e Região",
    bairro: "Vila Nova e Região",
    responsavel: "Carlos Eduardo",
    observacao: "Noite mais fria do ano registrada",
  },
  {
    id: "mov-18",
    data: "2026-07-22",
    tipo: "entrada",
    item_id: "ITM-0014",
    item_nome: "Cobertores Térmicos de Casal",
    quantidade: 15,
    unidade: "un",
    doador_tipo: "Empresa",
    doador_nome: "Têxtil Santa Clara",
    doador_contato: "responsabilidade@santaclara.com.br",
  },
  {
    id: "mov-17",
    data: "2026-07-18",
    tipo: "distribuicao",
    item_id: "ITM-0002",
    item_nome: "Feijão Carioca Tipo 1",
    quantidade: 8,
    unidade: "kg",
    familia_nome: "Família Duarte",
    familia_bairro: "Jardim das Acácias",
    bairro: "Jardim das Acácias",
    responsavel: "Assistente Ana Lúcia",
  },

  // Junho / 2026
  {
    id: "mov-14",
    data: "2026-06-27",
    tipo: "distribuicao",
    item_id: "ITM-0001",
    item_nome: "Arroz Agulhinha 5kg",
    quantidade: 6,
    unidade: "caixa",
    familia_nome: "Família Peixoto",
    familia_bairro: "Bairro São José",
    bairro: "Bairro São José",
    responsavel: "Mariana Souza",
  },
  {
    id: "mov-13",
    data: "2026-06-20",
    tipo: "entrada",
    item_id: "ITM-0006",
    item_nome: "Sardinha em Lata 125g",
    quantidade: 20,
    unidade: "un",
    doador_tipo: "Empresa",
    doador_nome: "Pescados Mar Azul",
    doador_contato: "sac@marazul.com",
    validade_lote: "2028-01-20",
  },
  {
    id: "mov-12",
    data: "2026-06-15",
    tipo: "distribuicao",
    item_id: "ITM-0006",
    item_nome: "Sardinha em Lata 125g",
    quantidade: 12,
    unidade: "un",
    familia_nome: "Família Gonçalves",
    familia_bairro: "Morro da Paz",
    bairro: "Morro da Paz",
    responsavel: "Assistente Ana Lúcia",
  },
  {
    id: "mov-11",
    data: "2026-06-10",
    tipo: "entrada",
    item_id: "ITM-0003",
    item_nome: "Leite UHT Integral 1L",
    quantidade: 36,
    unidade: "un",
    doador_tipo: "Pessoa",
    doador_nome: "Sr. Geraldo Azevedo",
    doador_contato: "(11) 97123-9988",
  },
  {
    id: "mov-10",
    data: "2026-06-03",
    tipo: "perda",
    item_id: "ITM-0008",
    item_nome: "Biscoito Maisena 400g",
    quantidade: 2,
    unidade: "pacote",
    motivo_perda: "Avaria",
    responsavel: "Seu Roberto",
    observacao: "Pacotes amassados e farelados",
  },

  // Maio / 2026
  {
    id: "mov-09",
    data: "2026-05-29",
    tipo: "distribuicao",
    item_id: "ITM-0003",
    item_nome: "Leite UHT Integral 1L",
    quantidade: 20,
    unidade: "un",
    familia_nome: "Família Lima",
    familia_bairro: "Vila Nova",
    bairro: "Vila Nova",
    responsavel: "Carlos Eduardo",
  },
  {
    id: "mov-08",
    data: "2026-05-25",
    tipo: "distribuicao",
    item_id: "ITM-0002",
    item_nome: "Feijão Carioca Tipo 1",
    quantidade: 12,
    unidade: "kg",
    familia_nome: "Família Teixeira",
    familia_bairro: "Jardim Esperança",
    bairro: "Jardim Esperança",
    responsavel: "Mariana Souza",
  },
  {
    id: "mov-02",
    data: "2026-05-03",
    tipo: "distribuicao",
    item_id: "ITM-0018",
    item_nome: "Caixa de Lápis de Cor 12 Cores",
    quantidade: 5,
    unidade: "caixa",
    familia_nome: "Oficina de Pintura Infantil",
    familia_bairro: "Centro Comunitário",
    bairro: "Centro Comunitário",
    responsavel: "Mariana Souza",
  },
  {
    id: "mov-01",
    data: "2026-05-01",
    tipo: "entrada",
    item_id: "ITM-0008",
    item_nome: "Biscoito Maisena 400g",
    quantidade: 20,
    unidade: "pacote",
    doador_tipo: "Empresa",
    doador_nome: "Supermercado Bom Preço",
    doador_contato: "social@bompreco.com.br",
  },
];

function obterWebhookUrl(tipo: "entrada" | "saida" | "novo_item"): string | undefined {
  if (typeof import.meta !== "undefined" && import.meta.env) {
    if (tipo === "entrada") {
      return (
        import.meta.env.VITE_WEBHOOK_ENTRADA ||
        import.meta.env.VITE_WEBHOOK_URL
      );
    }
    if (tipo === "saida") {
      return (
        import.meta.env.VITE_WEBHOOK_SAIDA ||
        import.meta.env.VITE_WEBHOOK_URL
      );
    }
    if (tipo === "novo_item") {
      return (
        import.meta.env.VITE_WEBHOOK_NOVO_ITEM ||
        import.meta.env.VITE_WEBHOOK_URL
      );
    }
  }

  return undefined;
}

const STORAGE_KEY_ITENS = "doamais_itens_v2";
const STORAGE_KEY_MOVS = "doamais_movimentacoes_v2";

export function normalizarIdItem(id: string): string {
  const match = id?.match(/^item-(\d+)$/i);
  if (match) {
    return `ITM-${match[1].padStart(4, "0")}`;
  }
  return id || "ITM-0001";
}

export function gerarProximoIdItem(itens: Item[]): string {
  let maiorNum = 0;
  for (const it of itens) {
    const match = it.id?.match(/^ITM-(\d+)$/i);
    if (match) {
      const num = parseInt(match[1], 10);
      if (num > maiorNum) maiorNum = num;
    }
  }
  const prox = maiorNum > 0 ? maiorNum + 1 : itens.length + 1;
  return `ITM-${String(prox).padStart(4, "0")}`;
}

function carregarItensLocais(): Item[] {
  if (typeof window === "undefined") {
    return ITENS_MOCK_INICIAIS;
  }
  try {
    const salvo = localStorage.getItem(STORAGE_KEY_ITENS);
    if (salvo) {
      const parsed: Item[] = JSON.parse(salvo);
      return parsed.map((it) => ({
        ...it,
        id: normalizarIdItem(it.id),
      }));
    }
    // Migração de v1 para v2 se houver cache antigo
    const salvoV1 = localStorage.getItem("doamais_itens_v1");
    if (salvoV1) {
      const parsedV1: Item[] = JSON.parse(salvoV1);
      const migrados = parsedV1.map((it) => ({
        ...it,
        id: normalizarIdItem(it.id),
      }));
      localStorage.setItem(STORAGE_KEY_ITENS, JSON.stringify(migrados));
      return migrados;
    }
  } catch (err) {
    console.warn("Erro ao ler itens do localStorage:", err);
  }
  return ITENS_MOCK_INICIAIS;
}

function salvarItensLocais(itens: Item[]): void {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEY_ITENS, JSON.stringify(itens));
    } catch (err) {
      console.warn("Erro ao salvar itens no localStorage:", err);
    }
  }
}

function carregarMovsLocais(): Movimentacao[] {
  if (typeof window === "undefined") {
    return MOVIMENTACOES_MOCK_INICIAIS;
  }
  try {
    const salvo = localStorage.getItem(STORAGE_KEY_MOVS);
    if (salvo) {
      const parsed: Movimentacao[] = JSON.parse(salvo);
      return parsed.map((m) => ({
        ...m,
        item_id: normalizarIdItem(m.item_id),
        bairro: m.bairro || m.familia_bairro,
        familia_bairro: m.familia_bairro || m.bairro,
      }));
    }
    const salvoV1 = localStorage.getItem("doamais_movimentacoes_v1");
    if (salvoV1) {
      const parsedV1: Movimentacao[] = JSON.parse(salvoV1);
      const migrados = parsedV1.map((m) => ({
        ...m,
        item_id: normalizarIdItem(m.item_id),
        bairro: m.bairro || m.familia_bairro,
        familia_bairro: m.familia_bairro || m.bairro,
      }));
      localStorage.setItem(STORAGE_KEY_MOVS, JSON.stringify(migrados));
      return migrados;
    }
  } catch (err) {
    console.warn("Erro ao ler movimentações do localStorage:", err);
  }
  return MOVIMENTACOES_MOCK_INICIAIS;
}

function salvarMovsLocais(movs: Movimentacao[]): void {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEY_MOVS, JSON.stringify(movs));
    } catch (err) {
      console.warn("Erro ao salvar movimentações no localStorage:", err);
    }
  }
}

// ----------------------------------------------------------------------------
// INTEGRAÇÃO COM GOOGLE PLANILHAS (ABA ESTOQUE)
// ----------------------------------------------------------------------------
export function obterUrlSheetsEstoque(): string {
  const urlPadrao =
    "https://docs.google.com/spreadsheets/d/1BmMa4MgyXv-l6y_cs6ea2Yt26jmnoZALvQDdaLf5ON0/edit?gid=1152434347#gid=1152434347";

  if (typeof import.meta !== "undefined" && import.meta.env) {
    return (
      import.meta.env.VITE_GOOGLE_SHEETS_ESTOQUE_URL ||
      import.meta.env.VITE_SHEETS_ESTOQUE_URL ||
      import.meta.env.VITE_GOOGLE_PLANILHAS_ESTOQUE_URL ||
      import.meta.env.VITE_GOOGLE_SHEETS_URL ||
      urlPadrao
    );
  }

  return urlPadrao;
}

export function converterUrlParaExportCsv(url: string, gidPadrao = "1152434347"): string {
  if (!url || typeof url !== "string") {
    return `https://docs.google.com/spreadsheets/d/1BmMa4MgyXv-l6y_cs6ea2Yt26jmnoZALvQDdaLf5ON0/export?format=csv&gid=${gidPadrao}`;
  }

  if (url.includes("/export?") && url.includes("format=csv")) {
    return url;
  }

  const matchId = url.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  const sheetId = matchId ? matchId[1] : "1BmMa4MgyXv-l6y_cs6ea2Yt26jmnoZALvQDdaLf5ON0";

  const matchGid = url.match(/[?&#]gid=([0-9]+)/);
  const gid = matchGid ? matchGid[1] : gidPadrao;

  return `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=${gid}`;
}

export function normalizarDataValidade(valor: string | undefined): string | null {
  if (!valor) return null;
  const limpo = valor.trim();
  if (!limpo || limpo === "-" || limpo.toLowerCase() === "null") return null;

  // Formato YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(limpo)) {
    return limpo;
  }

  // Formato DD/MM/YYYY
  const matchBr = limpo.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (matchBr) {
    const dia = matchBr[1].padStart(2, "0");
    const mes = matchBr[2].padStart(2, "0");
    const ano = matchBr[3];
    return `${ano}-${mes}-${dia}`;
  }

  // Fallback para parse de Date
  const d = new Date(limpo);
  if (!isNaN(d.getTime())) {
    return d.toISOString().split("T")[0];
  }

  return null;
}

function parseCSV(text: string): string[][] {
  const rows: string[][] = [];
  let currentRow: string[] = [""];
  let insideQuote = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (char === '"') {
      if (insideQuote && nextChar === '"') {
        currentRow[currentRow.length - 1] += '"';
        i++;
      } else {
        insideQuote = !insideQuote;
      }
    } else if (char === "," && !insideQuote) {
      currentRow.push("");
    } else if ((char === "\r" || char === "\n") && !insideQuote) {
      if (char === "\r" && nextChar === "\n") {
        i++;
      }
      rows.push(currentRow);
      currentRow = [""];
    } else {
      currentRow[currentRow.length - 1] += char;
    }
  }

  if (currentRow.length > 1 || currentRow[0] !== "") {
    rows.push(currentRow);
  }

  return rows;
}

export function mapearLinhasSheetsParaItens(csvText: string): Item[] {
  const linhas = parseCSV(csvText);
  if (linhas.length < 2) return [];

  const cabecalho = linhas[0].map((h) =>
    h
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9_]/g, "_")
  );

  const getColIndex = (...nomes: string[]) => {
    for (const nome of nomes) {
      const idx = cabecalho.findIndex((c) => c === nome || c.includes(nome));
      if (idx !== -1) return idx;
    }
    return -1;
  };

  const idIdx = getColIndex("id", "codigo");
  const nomeIdx = getColIndex("nome", "item", "produto");
  const catIdx = getColIndex("categoria");
  const unIdx = getColIndex("unidade", "un");
  const valControleIdx = getColIndex("controla_validade", "validade_controle");
  const minIdx = getColIndex("estoque_minimo", "minimo");
  const saldoIdx = getColIndex("saldo_atual", "saldo");
  const proxValIdx = getColIndex("validade_mais_proxima", "validade");
  const entIdx = getColIndex("total_entradas", "entradas");
  const saiIdx = getColIndex("total_saidas", "saidas");

  const itens: Item[] = [];

  for (let i = 1; i < linhas.length; i++) {
    const colunas = linhas[i];
    if (!colunas || colunas.every((c) => !c.trim())) continue;

    const idBruto = (idIdx !== -1 ? colunas[idIdx] : "")?.trim();
    const nome = (nomeIdx !== -1 ? colunas[nomeIdx] : "")?.trim();
    if (!nome && !idBruto) continue;

    const id = idBruto || `ITM-${String(i).padStart(4, "0")}`;
    const categoria = ((catIdx !== -1 ? colunas[catIdx] : "")?.trim() || "Outro") as CategoriaItem;
    const unidade = ((unIdx !== -1 ? colunas[unIdx] : "")?.trim() || "un") as UnidadeItem;

    const controlaStr = (valControleIdx !== -1 ? colunas[valControleIdx] : "")?.trim().toLowerCase();
    const controlaValidade =
      controlaStr === "true" ||
      controlaStr === "verdadeiro" ||
      controlaStr === "sim" ||
      controlaStr === "1";

    const estoqueMinimo = Number(
      (minIdx !== -1 ? colunas[minIdx] : "0")?.trim().replace(",", ".") || 0
    );
    const saldoAtual = Number(
      (saldoIdx !== -1 ? colunas[saldoIdx] : "0")?.trim().replace(",", ".") || 0
    );
    const totalEntradas = Number(
      (entIdx !== -1 ? colunas[entIdx] : "0")?.trim().replace(",", ".") || 0
    );
    const totalSaidas = Number(
      (saiIdx !== -1 ? colunas[saiIdx] : "0")?.trim().replace(",", ".") || 0
    );

    const valBruta = proxValIdx !== -1 ? colunas[proxValIdx] : "";
    const validadeMaisProxima = normalizarDataValidade(valBruta);

    itens.push({
      id: normalizarIdItem(id),
      item_nome: nome || "Item sem nome",
      categoria,
      unidade,
      controla_validade: controlaValidade,
      estoque_minimo: isNaN(estoqueMinimo) ? 0 : estoqueMinimo,
      saldo_atual: isNaN(saldoAtual) ? 0 : saldoAtual,
      total_entradas: isNaN(totalEntradas) ? undefined : totalEntradas,
      total_saidas: isNaN(totalSaidas) ? undefined : totalSaidas,
      validade_mais_proxima: validadeMaisProxima,
    });
  }

  return itens;
}

// ----------------------------------------------------------------------------
// FUNÇÕES PRINCIPAIS DE ACESSO A DADOS
// ----------------------------------------------------------------------------
export async function getItens(forcarAtualizacao = false): Promise<Item[]> {
  try {
    const urlOriginal = obterUrlSheetsEstoque();
    if (urlOriginal) {
      const urlCsv = converterUrlParaExportCsv(urlOriginal);
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 7000);

      const response = await fetch(urlCsv, {
        signal: controller.signal,
        cache: forcarAtualizacao ? "no-store" : "default",
      });
      clearTimeout(timeoutId);

      if (response.ok) {
        const csvText = await response.text();
        const itensDaPlanilha = mapearLinhasSheetsParaItens(csvText);
        if (itensDaPlanilha.length > 0) {
          salvarItensLocais(itensDaPlanilha);
          return itensDaPlanilha;
        }
      }
    }
  } catch (erro) {
    console.warn(
      "Não foi possível sincronizar com o Google Planilhas em tempo real, utilizando dados locais:",
      erro
    );
  }

  return carregarItensLocais();
}

export async function getMovimentacoes(): Promise<Movimentacao[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(carregarMovsLocais());
    }, 50);
  });
}

async function despacharWebhook(
  webhookUrl: string | undefined,
  corpo: Record<string, unknown>
): Promise<{ success: boolean; message?: string }> {
  if (!webhookUrl || webhookUrl.trim() === "") {
    await new Promise((resolve) => setTimeout(resolve, 800));
    return {
      success: true,
      message: "Operação simulada com sucesso (modo de demonstração).",
    };
  }

  try {
    const resposta = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json, text/plain, */*",
      },
      body: JSON.stringify(corpo),
    });

    if (!resposta.ok) {
      const textoErro = await resposta.text().catch(() => "");
      throw new Error(
        `O webhook retornou status ${resposta.status}: ${textoErro || resposta.statusText}`
      );
    }

    return {
      success: true,
      message: "Operação enviada e registrada no Webhook com sucesso!",
    };
  } catch (erro: unknown) {
    console.error("Falha ao enviar dados para o Webhook:", erro);
    const mensagem =
      erro instanceof Error
        ? erro.message
        : "Erro desconhecido ao comunicar com o Webhook.";
    return {
      success: false,
      message: mensagem,
    };
  }
}

export async function enviarEntrada(
  dados: {
    item_id: string;
    item_nome: string;
    quantidade: number;
    unidade: string;
    doador_tipo: DoadorTipo;
    doador_nome?: string;
    doador_contato?: string;
    validade_lote?: string;
    observacao?: string;
    data?: string;
    categoria?: CategoriaItem;
  }
): Promise<{ success: boolean; message?: string }> {
  const payload: EntradaPayload = {
    tipo_acao: "entrada",
    item_id: dados.item_id,
    item_nome: dados.item_nome,
    quantidade: Number(dados.quantidade),
    unidade: dados.unidade,
    doador_tipo: dados.doador_tipo,
    doador_nome: dados.doador_nome || "",
    doador_contato: dados.doador_contato || "",
    validade_lote: dados.validade_lote || "",
    observacao: dados.observacao || "",
  };

  const webhookUrl = obterWebhookUrl("entrada");
  const resultado = await despacharWebhook(webhookUrl, payload as unknown as Record<string, unknown>);

  if (resultado.success) {
    const itens = carregarItensLocais();
    const itemAlvo = itens.find((it) => it.id === dados.item_id);
    if (itemAlvo) {
      itemAlvo.saldo_atual += Number(dados.quantidade);
      if (dados.validade_lote) {
        if (
          !itemAlvo.validade_mais_proxima ||
          dados.validade_lote < itemAlvo.validade_mais_proxima
        ) {
          itemAlvo.validade_mais_proxima = dados.validade_lote;
        }
      }
      salvarItensLocais([...itens]);
    }

    const movs = carregarMovsLocais();
    const novaMov: Movimentacao = {
      id: `ENT-${String(Date.now()).slice(-5)}`,
      data: dados.data || new Date().toISOString().split("T")[0],
      tipo: "entrada",
      item_id: dados.item_id,
      item_nome: dados.item_nome,
      quantidade: Number(dados.quantidade),
      unidade: dados.unidade,
      doador_tipo: dados.doador_tipo,
      doador_nome: dados.doador_nome,
      doador_contato: dados.doador_contato,
      validade_lote: dados.validade_lote,
      observacao: dados.observacao,
    };
    salvarMovsLocais([novaMov, ...movs]);
  }

  return resultado;
}

export async function enviarSaida(
  dados: {
    tipo: "distribuicao" | "consumo" | "perda" | "Distribuição" | "Consumo" | "Perda" | string;
    item_id: string;
    item_nome: string;
    quantidade: number;
    unidade: string;
    familia_nome?: string;
    bairro?: string;
    familia_bairro?: string;
    motivo_perda?: string;
    responsavel: string;
    observacao?: string;
    data?: string;
  }
): Promise<{ success: boolean; message?: string }> {
  const itens = carregarItensLocais();
  const itemAlvo = itens.find((it) => it.id === dados.item_id);

  if (!itemAlvo) {
    return {
      success: false,
      message: "Item selecionado não foi encontrado no estoque.",
    };
  }

  if (Number(dados.quantidade) > itemAlvo.saldo_atual) {
    return {
      success: false,
      message: `Saldo insuficiente: existem apenas ${itemAlvo.saldo_atual} ${itemAlvo.unidade} disponíveis.`,
    };
  }

  const nomeBairro = dados.bairro || dados.familia_bairro || "";
  const tipoStr = dados.tipo.toLowerCase();
  const tipoNormalizado: TipoMovimentacao = tipoStr.includes("dist")
    ? "distribuicao"
    : tipoStr.includes("cons")
    ? "consumo"
    : "perda";

  // Payload enviado ao Webhook no formato do Google Sheets (id e carimbo adicionados automaticamente no Sheets)
  const payload: SaidaPayload = {
    tipo_acao: "saida",
    tipo: dados.tipo,
    item_id: dados.item_id,
    item_nome: dados.item_nome,
    quantidade: Number(dados.quantidade),
    unidade: dados.unidade,
    familia_nome: dados.familia_nome || "",
    bairro: nomeBairro,
    motivo_perda: dados.motivo_perda || "",
    responsavel: dados.responsavel,
    observacao: dados.observacao || "",
  };

  const webhookUrl = obterWebhookUrl("saida");
  const resultado = await despacharWebhook(webhookUrl, payload as unknown as Record<string, unknown>);

  if (resultado.success) {
    itemAlvo.saldo_atual = Math.max(
      0,
      itemAlvo.saldo_atual - Number(dados.quantidade)
    );
    salvarItensLocais([...itens]);

    const movs = carregarMovsLocais();
    const novaMov: Movimentacao = {
      id: `SAI-${String(Date.now()).slice(-5)}`,
      data: dados.data || new Date().toISOString().split("T")[0],
      tipo: tipoNormalizado,
      item_id: dados.item_id,
      item_nome: dados.item_nome,
      quantidade: Number(dados.quantidade),
      unidade: dados.unidade,
      familia_nome: dados.familia_nome,
      familia_bairro: nomeBairro,
      bairro: nomeBairro,
      motivo_perda: dados.motivo_perda,
      responsavel: dados.responsavel,
      observacao: dados.observacao,
    };
    salvarMovsLocais([novaMov, ...movs]);
  }

  return resultado;
}

export async function criarItem(
  dados: {
    item_nome: string;
    categoria: CategoriaItem;
    unidade: UnidadeItem | string;
    controla_validade: boolean;
    estoque_minimo: number;
    saldo_inicial?: number;
    validade_inicial?: string;
  }
): Promise<{ success: boolean; item?: Item; message?: string }> {
  // Payload enviado ao Webhook no formato do Google Sheets (o Sheets gera o ID ITM-xxxx automaticamente)
  const payload: NovoItemPayload = {
    tipo_acao: "novo_item",
    item_nome: dados.item_nome,
    categoria: dados.categoria,
    unidade: dados.unidade,
    controla_validade: Boolean(dados.controla_validade),
    estoque_minimo: Number(dados.estoque_minimo),
  };

  const webhookUrl = obterWebhookUrl("novo_item");
  const resultado = await despacharWebhook(webhookUrl, payload as unknown as Record<string, unknown>);

  if (resultado.success) {
    const itens = carregarItensLocais();
    const novoId = gerarProximoIdItem(itens);

    const novoItem: Item = {
      id: novoId,
      item_nome: dados.item_nome,
      categoria: dados.categoria,
      unidade: dados.unidade as UnidadeItem,
      controla_validade: Boolean(dados.controla_validade),
      estoque_minimo: Number(dados.estoque_minimo),
      saldo_atual: Number(dados.saldo_inicial || 0),
      validade_mais_proxima: dados.validade_inicial || null,
    };

    salvarItensLocais([novoItem, ...itens]);

    if (dados.saldo_inicial && Number(dados.saldo_inicial) > 0) {
      const movs = carregarMovsLocais();
      const novaMov: Movimentacao = {
        id: `ENT-${String(Date.now()).slice(-5)}`,
        data: new Date().toISOString().split("T")[0],
        tipo: "entrada",
        item_id: novoItem.id,
        item_nome: novoItem.item_nome,
        quantidade: Number(dados.saldo_inicial),
        unidade: novoItem.unidade,
        doador_tipo: "Pessoa",
        doador_nome: "Saldo de Implantação de Item",
        validade_lote: dados.validade_inicial,
        observacao: "Cadastro inicial do produto com saldo de abertura",
      };
      salvarMovsLocais([novaMov, ...movs]);
    }

    return {
      success: true,
      item: novoItem,
      message: "Produto cadastrado com sucesso!",
    };
  }

  return {
    success: false,
    message: resultado.message || "Erro ao cadastrar novo produto.",
  };
}

export function restaurarDadosIniciais(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem("doamais_itens_v1");
    localStorage.removeItem("doamais_movimentacoes_v1");
    localStorage.removeItem(STORAGE_KEY_ITENS);
    localStorage.removeItem(STORAGE_KEY_MOVS);
  }
}
