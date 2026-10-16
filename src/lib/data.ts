export type CategoriaItem =
  | "Alimentos"
  | "Higiene"
  | "Roupa"
  | "Material Escolar"
  | "Eletrônicos"
  | "Outro";

export type UnidadeItem = "kg" | "L" | "un" | "caixa" | "pacote";

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
  validade_mais_proxima: string | null;
}

export interface Movimentacao {
  id: string;
  data: string;
  tipo: TipoMovimentacao;
  item_id: string;
  item_nome: string;
  quantidade: number;
  unidade: string;
  doador_tipo?: DoadorTipo;
  doador_nome?: string;
  doador_contato?: string;
  validade_lote?: string;
  familia_nome?: string;
  familia_bairro?: string;
  responsavel?: string;
  motivo_perda?: string;
  observacao?: string;
}

export interface EntradaPayload {
  tipo_acao: "entrada";
  data: string;
  item_id: string;
  item_nome: string;
  categoria: CategoriaItem;
  quantidade: number;
  unidade: UnidadeItem;
  doador_tipo: DoadorTipo;
  doador_nome?: string;
  doador_contato?: string;
  validade_lote?: string;
  observacao?: string;
}

export interface SaidaPayload {
  tipo_acao: "saida";
  data: string;
  tipo: "distribuicao" | "consumo" | "perda";
  item_id: string;
  item_nome: string;
  quantidade: number;
  unidade: string;
  familia_nome?: string;
  familia_bairro?: string;
  motivo_perda?: string;
  responsavel: string;
  observacao?: string;
}

export interface NovoItemPayload {
  tipo_acao: "novo_item";
  item_nome: string;
  categoria: CategoriaItem;
  unidade: UnidadeItem;
  controla_validade: boolean;
  estoque_minimo: number;
  saldo_inicial?: number;
  validade_inicial?: string;
}

// ----------------------------------------------------------------------------
// DADOS INICIAIS (MOCK) — Baseados na data corrente de Outubro/2026
// ----------------------------------------------------------------------------
const ITENS_MOCK_INICIAIS: Item[] = [
  {
    id: "item-01",
    item_nome: "Arroz Agulhinha 5kg",
    categoria: "Alimentos",
    unidade: "caixa",
    controla_validade: true,
    estoque_minimo: 5,
    saldo_atual: 12,
    validade_mais_proxima: "2027-04-10",
  },
  {
    id: "item-02",
    item_nome: "Feijão Carioca Tipo 1",
    categoria: "Alimentos",
    unidade: "kg",
    controla_validade: true,
    estoque_minimo: 10,
    saldo_atual: 30,
    validade_mais_proxima: "2027-02-15",
  },
  {
    id: "item-03",
    item_nome: "Leite UHT Integral 1L",
    categoria: "Alimentos",
    unidade: "un",
    controla_validade: true,
    estoque_minimo: 24,
    saldo_atual: 48,
    validade_mais_proxima: "2026-10-19", // Vence em 4 dias
  },
  {
    id: "item-04",
    item_nome: "Macarrão Espaguete 500g",
    categoria: "Alimentos",
    unidade: "pacote",
    controla_validade: true,
    estoque_minimo: 15,
    saldo_atual: 25,
    validade_mais_proxima: "2027-06-30",
  },
  {
    id: "item-05",
    item_nome: "Óleo de Soja 900ml",
    categoria: "Alimentos",
    unidade: "un",
    controla_validade: true,
    estoque_minimo: 10,
    saldo_atual: 18,
    validade_mais_proxima: "2027-05-18",
  },
  {
    id: "item-06",
    item_nome: "Sardinha em Lata 125g",
    categoria: "Alimentos",
    unidade: "un",
    controla_validade: true,
    estoque_minimo: 15,
    saldo_atual: 8, // Abaixo do mínimo!
    validade_mais_proxima: "2028-01-20",
  },
  {
    id: "item-07",
    item_nome: "Farinha de Trigo Especial 1kg",
    categoria: "Alimentos",
    unidade: "kg",
    controla_validade: true,
    estoque_minimo: 8,
    saldo_atual: 2, // Abaixo do mínimo E vencendo em breve!
    validade_mais_proxima: "2026-10-17", // Vence em 2 dias
  },
  {
    id: "item-08",
    item_nome: "Biscoito Maisena 400g",
    categoria: "Alimentos",
    unidade: "pacote",
    controla_validade: true,
    estoque_minimo: 10,
    saldo_atual: 14,
    validade_mais_proxima: "2026-10-21", // Vence em 6 dias
  },
  {
    id: "item-09",
    item_nome: "Iogurte Natural 170g",
    categoria: "Alimentos",
    unidade: "un",
    controla_validade: true,
    estoque_minimo: 10,
    saldo_atual: 6,
    validade_mais_proxima: "2026-10-11", // Vencido há 4 dias!
  },
  {
    id: "item-10",
    item_nome: "Sabonete em Barra 90g",
    categoria: "Higiene",
    unidade: "un",
    controla_validade: false,
    estoque_minimo: 20,
    saldo_atual: 45,
    validade_mais_proxima: null,
  },
  {
    id: "item-11",
    item_nome: "Detergente Líquido Neutro 500ml",
    categoria: "Higiene",
    unidade: "un",
    controla_validade: false,
    estoque_minimo: 15,
    saldo_atual: 30,
    validade_mais_proxima: null,
  },
  {
    id: "item-12",
    item_nome: "Creme Dental Flúor 90g",
    categoria: "Higiene",
    unidade: "un",
    controla_validade: false,
    estoque_minimo: 15,
    saldo_atual: 40,
    validade_mais_proxima: null,
  },
  {
    id: "item-13",
    item_nome: "Água Sanitária 1L",
    categoria: "Higiene",
    unidade: "L",
    controla_validade: false,
    estoque_minimo: 10,
    saldo_atual: 12,
    validade_mais_proxima: null,
  },
  {
    id: "item-14",
    item_nome: "Cobertores Térmicos de Casal",
    categoria: "Roupa",
    unidade: "un",
    controla_validade: false,
    estoque_minimo: 10,
    saldo_atual: 3, // Abaixo do mínimo!
    validade_mais_proxima: null,
  },
  {
    id: "item-15",
    item_nome: "Camisetas Infantis Algodão",
    categoria: "Roupa",
    unidade: "un",
    controla_validade: false,
    estoque_minimo: 10,
    saldo_atual: 15,
    validade_mais_proxima: null,
  },
  {
    id: "item-16",
    item_nome: "Agasalhos de Lã Juvenil",
    categoria: "Roupa",
    unidade: "un",
    controla_validade: false,
    estoque_minimo: 8,
    saldo_atual: 4, // Abaixo do mínimo!
    validade_mais_proxima: null,
  },
  {
    id: "item-17",
    item_nome: "Cadernos Universitários 96 fls",
    categoria: "Material Escolar",
    unidade: "un",
    controla_validade: false,
    estoque_minimo: 10,
    saldo_atual: 22,
    validade_mais_proxima: null,
  },
  {
    id: "item-18",
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
  // Outubro / 2026
  {
    id: "mov-41",
    data: "2026-10-15",
    tipo: "distribuicao",
    item_id: "item-01",
    item_nome: "Arroz Agulhinha 5kg",
    quantidade: 2,
    unidade: "caixa",
    familia_nome: "Família Barbosa",
    familia_bairro: "Vila Progresso",
    responsavel: "Assistente Ana Lúcia",
    observacao: "Entrega emergencial cesta básica",
  },
  {
    id: "mov-40",
    data: "2026-10-14",
    tipo: "entrada",
    item_id: "item-03",
    item_nome: "Leite UHT Integral 1L",
    quantidade: 24,
    unidade: "un",
    doador_tipo: "Empresa",
    doador_nome: "Laticínios Vale Verde",
    doador_contato: "contato@valeverde.com.br",
    validade_lote: "2026-10-19",
    observacao: "Doação com validade curta recebida para distribuição rápida",
  },
  {
    id: "mov-39",
    data: "2026-10-13",
    tipo: "distribuicao",
    item_id: "item-02",
    item_nome: "Feijão Carioca Tipo 1",
    quantidade: 5,
    unidade: "kg",
    familia_nome: "Família Santos",
    familia_bairro: "Jardim Esperança",
    responsavel: "Carlos Eduardo",
    observacao: "Atendimento semanal",
  },
  {
    id: "mov-38",
    data: "2026-10-12",
    tipo: "perda",
    item_id: "item-09",
    item_nome: "Iogurte Natural 170g",
    quantidade: 2,
    unidade: "un",
    motivo_perda: "Vencimento",
    responsavel: "Mariana Souza",
    observacao: "Embalagem identificada vencida na triagem matinal",
  },
  {
    id: "mov-37",
    data: "2026-10-10",
    tipo: "consumo",
    item_id: "item-11",
    item_nome: "Detergente Líquido Neutro 500ml",
    quantidade: 2,
    unidade: "un",
    responsavel: "Dona Neide",
    observacao: "Limpeza geral da cozinha comunitária",
  },
  {
    id: "mov-36",
    data: "2026-10-08",
    tipo: "entrada",
    item_id: "item-10",
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
    item_id: "item-14",
    item_nome: "Cobertores Térmicos de Casal",
    quantidade: 4,
    unidade: "un",
    familia_nome: "Família Ferreira",
    familia_bairro: "Morro da Paz",
    responsavel: "Assistente Ana Lúcia",
    observacao: "Atendimento frente fria",
  },
  {
    id: "mov-34",
    data: "2026-10-02",
    tipo: "entrada",
    item_id: "item-01",
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
    item_id: "item-04",
    item_nome: "Macarrão Espaguete 500g",
    quantidade: 12,
    unidade: "pacote",
    familia_nome: "Família Silva Ramos",
    familia_bairro: "Bairro São José",
    responsavel: "Carlos Eduardo",
    observacao: "Apoio a família de 6 pessoas",
  },
  {
    id: "mov-32",
    data: "2026-09-25",
    tipo: "distribuicao",
    item_id: "item-03",
    item_nome: "Leite UHT Integral 1L",
    quantidade: 15,
    unidade: "un",
    familia_nome: "Família Costa",
    familia_bairro: "Jardim das Acácias",
    responsavel: "Mariana Souza",
    observacao: "Crianças na primeira infância",
  },
  {
    id: "mov-31",
    data: "2026-09-22",
    tipo: "entrada",
    item_id: "item-17",
    item_nome: "Cadernos Universitários 96 fls",
    quantidade: 25,
    unidade: "un",
    doador_tipo: "Pessoa",
    doador_nome: "Prof. Paulo Antunes",
    doador_contato: "paulo.antunes@educacao.sp.gov.br",
    observacao: "Campanha Volta às Aulas comunitária",
  },
  {
    id: "mov-30",
    data: "2026-09-20",
    tipo: "perda",
    item_id: "item-05",
    item_nome: "Óleo de Soja 900ml",
    quantidade: 1,
    unidade: "un",
    motivo_perda: "Avaria",
    responsavel: "Seu Roberto",
    observacao: "Garrafa perfurada no transporte interno",
  },
  {
    id: "mov-29",
    data: "2026-09-15",
    tipo: "distribuicao",
    item_id: "item-02",
    item_nome: "Feijão Carioca Tipo 1",
    quantidade: 10,
    unidade: "kg",
    familia_nome: "Família Ribeiro",
    familia_bairro: "Vila Nova",
    responsavel: "Assistente Ana Lúcia",
  },
  {
    id: "mov-28",
    data: "2026-09-10",
    tipo: "entrada",
    item_id: "item-02",
    item_nome: "Feijão Carioca Tipo 1",
    quantidade: 25,
    unidade: "kg",
    doador_tipo: "Anônimo",
    observacao: "Entregue na portaria da sede",
  },
  {
    id: "mov-27",
    data: "2026-09-05",
    tipo: "consumo",
    item_id: "item-13",
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
    item_id: "item-15",
    item_nome: "Camisetas Infantis Algodão",
    quantidade: 6,
    unidade: "un",
    familia_nome: "Família Nascimento",
    familia_bairro: "Jardim Esperança",
    responsavel: "Mariana Souza",
  },

  // Agosto / 2026
  {
    id: "mov-25",
    data: "2026-08-29",
    tipo: "distribuicao",
    item_id: "item-01",
    item_nome: "Arroz Agulhinha 5kg",
    quantidade: 8,
    unidade: "caixa",
    familia_nome: "Família Souza",
    familia_bairro: "Comunidade Estrela",
    responsavel: "Carlos Eduardo",
  },
  {
    id: "mov-24",
    data: "2026-08-25",
    tipo: "entrada",
    item_id: "item-05",
    item_nome: "Óleo de Soja 900ml",
    quantidade: 20,
    unidade: "un",
    doador_tipo: "Empresa",
    doador_nome: "Distribuidora Aliança",
    doador_contato: "atendimento@aliancadist.com.br",
    validade_lote: "2027-05-18",
  },
  {
    id: "mov-23",
    data: "2026-08-20",
    tipo: "distribuicao",
    item_id: "item-12",
    item_nome: "Creme Dental Flúor 90g",
    quantidade: 15,
    unidade: "un",
    familia_nome: "Associação de Moradores",
    familia_bairro: "Morro da Paz",
    responsavel: "Assistente Ana Lúcia",
  },
  {
    id: "mov-22",
    data: "2026-08-15",
    tipo: "entrada",
    item_id: "item-18",
    item_nome: "Caixa de Lápis de Cor 12 Cores",
    quantidade: 15,
    unidade: "caixa",
    doador_tipo: "Pessoa",
    doador_nome: "Beatriz Nogueira",
    doador_contato: "beatriz.nog@gmail.com",
  },
  {
    id: "mov-21",
    data: "2026-08-10",
    tipo: "perda",
    item_id: "item-07",
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
    item_id: "item-03",
    item_nome: "Leite UHT Integral 1L",
    quantidade: 18,
    unidade: "un",
    familia_nome: "Família Moreira",
    familia_bairro: "Vila Progresso",
    responsavel: "Mariana Souza",
  },

  // Julho / 2026
  {
    id: "mov-19",
    data: "2026-07-28",
    tipo: "distribuicao",
    item_id: "item-14",
    item_nome: "Cobertores Térmicos de Casal",
    quantidade: 8,
    unidade: "un",
    familia_nome: "Ação de Inverno",
    familia_bairro: "Vila Nova e Região",
    responsavel: "Carlos Eduardo",
    observacao: "Noite mais fria do ano registrada",
  },
  {
    id: "mov-18",
    data: "2026-07-22",
    tipo: "entrada",
    item_id: "item-14",
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
    item_id: "item-02",
    item_nome: "Feijão Carioca Tipo 1",
    quantidade: 8,
    unidade: "kg",
    familia_nome: "Família Duarte",
    familia_bairro: "Jardim das Acácias",
    responsavel: "Assistente Ana Lúcia",
  },
  {
    id: "mov-16",
    data: "2026-07-12",
    tipo: "entrada",
    item_id: "item-04",
    item_nome: "Macarrão Espaguete 500g",
    quantidade: 30,
    unidade: "pacote",
    doador_tipo: "Pessoa",
    doador_nome: "Família Rossi",
    doador_contato: "rossi.alimentos@uol.com.br",
  },
  {
    id: "mov-15",
    data: "2026-07-06",
    tipo: "consumo",
    item_id: "item-10",
    item_nome: "Sabonete em Barra 90g",
    quantidade: 3,
    unidade: "un",
    responsavel: "Carlos Eduardo",
    observacao: "Reposição dos lavatórios comunitários",
  },

  // Junho / 2026
  {
    id: "mov-14",
    data: "2026-06-27",
    tipo: "distribuicao",
    item_id: "item-01",
    item_nome: "Arroz Agulhinha 5kg",
    quantidade: 6,
    unidade: "caixa",
    familia_nome: "Família Peixoto",
    familia_bairro: "Bairro São José",
    responsavel: "Mariana Souza",
  },
  {
    id: "mov-13",
    data: "2026-06-20",
    tipo: "entrada",
    item_id: "item-06",
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
    item_id: "item-06",
    item_nome: "Sardinha em Lata 125g",
    quantidade: 12,
    unidade: "un",
    familia_nome: "Família Gonçalves",
    familia_bairro: "Morro da Paz",
    responsavel: "Assistente Ana Lúcia",
  },
  {
    id: "mov-11",
    data: "2026-06-10",
    tipo: "entrada",
    item_id: "item-03",
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
    item_id: "item-08",
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
    item_id: "item-03",
    item_nome: "Leite UHT Integral 1L",
    quantidade: 20,
    unidade: "un",
    familia_nome: "Família Lima",
    familia_bairro: "Vila Nova",
    responsavel: "Carlos Eduardo",
  },
  {
    id: "mov-08",
    data: "2026-05-25",
    tipo: "distribuicao",
    item_id: "item-02",
    item_nome: "Feijão Carioca Tipo 1",
    quantidade: 12,
    unidade: "kg",
    familia_nome: "Família Teixeira",
    familia_bairro: "Jardim Esperança",
    responsavel: "Mariana Souza",
  },
  {
    id: "mov-07",
    data: "2026-05-20",
    tipo: "entrada",
    item_id: "item-01",
    item_nome: "Arroz Agulhinha 5kg",
    quantidade: 15,
    unidade: "caixa",
    doador_tipo: "Empresa",
    doador_nome: "Rotary Club Comunitário",
    doador_contato: "secretaria@rotarylocal.org.br",
  },
  {
    id: "mov-06",
    data: "2026-05-16",
    tipo: "distribuicao",
    item_id: "item-16",
    item_nome: "Agasalhos de Lã Juvenil",
    quantidade: 4,
    unidade: "un",
    familia_nome: "Família Silva Ramos",
    familia_bairro: "Bairro São José",
    responsavel: "Assistente Ana Lúcia",
  },
  {
    id: "mov-05",
    data: "2026-05-12",
    tipo: "entrada",
    item_id: "item-16",
    item_nome: "Agasalhos de Lã Juvenil",
    quantidade: 8,
    unidade: "un",
    doador_tipo: "Pessoa",
    doador_nome: "Clube das Mães Solidárias",
  },
  {
    id: "mov-04",
    data: "2026-05-08",
    tipo: "entrada",
    item_id: "item-11",
    item_nome: "Detergente Líquido Neutro 500ml",
    quantidade: 24,
    unidade: "un",
    doador_tipo: "Anônimo",
  },
  {
    id: "mov-03",
    data: "2026-05-05",
    tipo: "consumo",
    item_id: "item-11",
    item_nome: "Detergente Líquido Neutro 500ml",
    quantidade: 1,
    unidade: "un",
    responsavel: "Dona Neide",
  },
  {
    id: "mov-02",
    data: "2026-05-03",
    tipo: "distribuicao",
    item_id: "item-18",
    item_nome: "Caixa de Lápis de Cor 12 Cores",
    quantidade: 5,
    unidade: "caixa",
    familia_nome: "Oficina de Pintura Infantil",
    familia_bairro: "Centro Comunitário",
    responsavel: "Mariana Souza",
  },
  {
    id: "mov-01",
    data: "2026-05-01",
    tipo: "entrada",
    item_id: "item-08",
    item_nome: "Biscoito Maisena 400g",
    quantidade: 20,
    unidade: "pacote",
    doador_tipo: "Empresa",
    doador_nome: "Supermercado Bom Preço",
    doador_contato: "social@bompreco.com.br",
  },
];

// Helper para persistência local na sessão do navegador
const STORAGE_KEY_ITENS = "doamais_itens_v1";
const STORAGE_KEY_MOVS = "doamais_movimentacoes_v1";

function carregarItensLocais(): Item[] {
  if (typeof window === "undefined") {
    return ITENS_MOCK_INICIAIS;
  }
  try {
    const salvo = localStorage.getItem(STORAGE_KEY_ITENS);
    if (salvo) {
      return JSON.parse(salvo);
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
      return JSON.parse(salvo);
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
// FUNÇÕES PRINCIPAIS DE ACESSO A DADOS
// ----------------------------------------------------------------------------

/**
 * Retorna a lista de itens com seus respectivos saldos atuais.
 * IMPORTANTE: O saldo_atual já vem pronto da fonte de dados (a UI nunca o calcula).
 */
export async function getItens(): Promise<Item[]> {
  // Simula pequena latência de leitura para experiência natural
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(carregarItensLocais());
    }, 50);
  });
}

/**
 * Retorna o histórico de movimentações (entradas, distribuições, consumos e perdas).
 */
export async function getMovimentacoes(): Promise<Movimentacao[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(carregarMovsLocais());
    }, 50);
  });
}

/**
 * Helper interno para despachar requisições para o Webhook configurado.
 * Se a URL não existir nas variáveis de ambiente, simula sucesso após 800ms.
 */
async function despacharWebhook(
  webhookUrl: string | undefined,
  corpo: Record<string, unknown>
): Promise<{ success: boolean; message?: string }> {
  // Se a URL não estiver definida ou estiver vazia, simula sucesso com delay de 800ms
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

/**
 * Envia uma nova entrada de doação.
 * Realiza fetch POST com corpo JSON incluindo `tipo_acao: "entrada"`.
 */
export async function enviarEntrada(
  dados: Omit<EntradaPayload, "tipo_acao">
): Promise<{ success: boolean; message?: string }> {
  const payload: EntradaPayload = {
    tipo_acao: "entrada",
    ...dados,
  };

  const webhookUrl =
    process.env.NEXT_PUBLIC_WEBHOOK_ENTRADA ||
    process.env.NEXT_PUBLIC_WEBHOOK_URL;

  const resultado = await despacharWebhook(webhookUrl, payload as unknown as Record<string, unknown>);

  if (resultado.success) {
    // Atualiza o estado da sessão local
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
      id: `mov-${Date.now()}`,
      data: dados.data,
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

/**
 * Envia uma saída (distribuição, consumo ou perda).
 * Realiza fetch POST com corpo JSON incluindo `tipo_acao: "saida"`.
 */
export async function enviarSaida(
  dados: Omit<SaidaPayload, "tipo_acao">
): Promise<{ success: boolean; message?: string }> {
  // Validação primária de segurança no front
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

  const payload: SaidaPayload = {
    tipo_acao: "saida",
    ...dados,
  };

  const webhookUrl =
    process.env.NEXT_PUBLIC_WEBHOOK_SAIDA ||
    process.env.NEXT_PUBLIC_WEBHOOK_URL;

  const resultado = await despacharWebhook(webhookUrl, payload as unknown as Record<string, unknown>);

  if (resultado.success) {
    // Deduz do saldo local da sessão
    itemAlvo.saldo_atual = Math.max(
      0,
      itemAlvo.saldo_atual - Number(dados.quantidade)
    );
    salvarItensLocais([...itens]);

    const movs = carregarMovsLocais();
    const novaMov: Movimentacao = {
      id: `mov-${Date.now()}`,
      data: dados.data,
      tipo: dados.tipo,
      item_id: dados.item_id,
      item_nome: dados.item_nome,
      quantidade: Number(dados.quantidade),
      unidade: dados.unidade,
      familia_nome: dados.familia_nome,
      familia_bairro: dados.familia_bairro,
      motivo_perda: dados.motivo_perda,
      responsavel: dados.responsavel,
      observacao: dados.observacao,
    };
    salvarMovsLocais([novaMov, ...movs]);
  }

  return resultado;
}

/**
 * Cadastra um novo produto/item no estoque.
 * Realiza fetch POST com corpo JSON incluindo `tipo_acao: "novo_item"`.
 */
export async function criarItem(
  dados: Omit<NovoItemPayload, "tipo_acao">
): Promise<{ success: boolean; item?: Item; message?: string }> {
  const payload: NovoItemPayload = {
    tipo_acao: "novo_item",
    ...dados,
  };

  const webhookUrl =
    process.env.NEXT_PUBLIC_WEBHOOK_NOVO_ITEM ||
    process.env.NEXT_PUBLIC_WEBHOOK_URL;

  const resultado = await despacharWebhook(webhookUrl, payload as unknown as Record<string, unknown>);

  if (resultado.success) {
    const itens = carregarItensLocais();
    const novoItem: Item = {
      id: `item-${Date.now().toString(36)}`,
      item_nome: dados.item_nome,
      categoria: dados.categoria,
      unidade: dados.unidade,
      controla_validade: Boolean(dados.controla_validade),
      estoque_minimo: Number(dados.estoque_minimo),
      saldo_atual: Number(dados.saldo_inicial || 0),
      validade_mais_proxima: dados.validade_inicial || null,
    };

    salvarItensLocais([novoItem, ...itens]);

    if (dados.saldo_inicial && Number(dados.saldo_inicial) > 0) {
      const movs = carregarMovsLocais();
      const novaMov: Movimentacao = {
        id: `mov-${Date.now()}`,
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

/**
 * Helper para redefinir dados para os mocks originais (útil para testes da equipe).
 */
export function restaurarDadosIniciais(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(STORAGE_KEY_ITENS);
    localStorage.removeItem(STORAGE_KEY_MOVS);
  }
}
