export type Cidade = { nome: string; gb100: number; gb120: number };
export type Estado = { nome: string; cidades: Cidade[] };
export type Regiao = {
  nome: string;
  cor: string;
  total: number;
  percentual: number;
  hoje: number;
  estados: Estado[];
};

type RegiaoRaw = { nome: string; cor: string; hoje: number; estados: Estado[] };

// Planilha de ativações por cidade (planos 100GB e 120GB)
const planilha: RegiaoRaw[] = [
  {
    nome: "Sudeste",
    cor: "#ec1677",
    hoje: 8,
    estados: [
      {
        nome: "São Paulo",
        cidades: [
          { nome: "São Paulo", gb100: 3184, gb120: 2472 },
          { nome: "Campinas", gb100: 812, gb120: 596 },
          { nome: "Guarulhos", gb100: 604, gb120: 428 },
          { nome: "Ribeirão Preto", gb100: 486, gb120: 342 },
          { nome: "Santos", gb100: 372, gb120: 268 },
        ],
      },
      {
        nome: "Minas Gerais",
        cidades: [
          { nome: "Belo Horizonte", gb100: 1268, gb120: 942 },
          { nome: "Uberlândia", gb100: 418, gb120: 296 },
          { nome: "Contagem", gb100: 284, gb120: 198 },
        ],
      },
      {
        nome: "Rio de Janeiro",
        cidades: [
          { nome: "Rio de Janeiro", gb100: 1452, gb120: 1108 },
          { nome: "Niterói", gb100: 356, gb120: 254 },
          { nome: "Campos dos Goytacazes", gb100: 208, gb120: 142 },
        ],
      },
      {
        nome: "Espírito Santo",
        cidades: [
          { nome: "Vitória", gb100: 392, gb120: 286 },
          { nome: "Vila Velha", gb100: 246, gb120: 174 },
        ],
      },
    ],
  },
  {
    nome: "Sul",
    cor: "#047857",
    hoje: 9,
    estados: [
      {
        nome: "Paraná",
        cidades: [
          { nome: "Curitiba", gb100: 1864, gb120: 1392 },
          { nome: "Londrina", gb100: 592, gb120: 428 },
          { nome: "Maringá", gb100: 446, gb120: 318 },
          { nome: "Cascavel", gb100: 268, gb120: 186 },
        ],
      },
      {
        nome: "Rio Grande do Sul",
        cidades: [
          { nome: "Porto Alegre", gb100: 2042, gb120: 1524 },
          { nome: "Caxias do Sul", gb100: 628, gb120: 452 },
          { nome: "Pelotas", gb100: 296, gb120: 214 },
        ],
      },
      {
        nome: "Santa Catarina",
        cidades: [
          { nome: "Florianópolis", gb100: 868, gb120: 642 },
          { nome: "Joinville", gb100: 512, gb120: 368 },
          { nome: "Blumenau", gb100: 342, gb120: 246 },
        ],
      },
      {
        nome: "Mato Grosso do Sul",
        cidades: [
          { nome: "Campo Grande", gb100: 384, gb120: 272 },
          { nome: "Dourados", gb100: 162, gb120: 114 },
        ],
      },
    ],
  },
  {
    nome: "Nordeste",
    cor: "#d97706",
    hoje: 4,
    estados: [
      {
        nome: "Bahia",
        cidades: [
          { nome: "Salvador", gb100: 1486, gb120: 1092 },
          { nome: "Feira de Santana", gb100: 468, gb120: 336 },
        ],
      },
      {
        nome: "Pernambuco",
        cidades: [
          { nome: "Recife", gb100: 1124, gb120: 826 },
          { nome: "Jaboatão dos Guararapes", gb100: 312, gb120: 224 },
        ],
      },
      {
        nome: "Ceará",
        cidades: [
          { nome: "Fortaleza", gb100: 1168, gb120: 862 },
          { nome: "Caucaia", gb100: 264, gb120: 186 },
        ],
      },
    ],
  },
  {
    nome: "Centro-Oeste",
    cor: "#0e7490",
    hoje: 5,
    estados: [
      {
        nome: "Goiás",
        cidades: [
          { nome: "Goiânia", gb100: 1042, gb120: 768 },
          { nome: "Aparecida de Goiânia", gb100: 386, gb120: 274 },
        ],
      },
      {
        nome: "Distrito Federal",
        cidades: [
          { nome: "Brasília", gb100: 1236, gb120: 918 },
        ],
      },
      {
        nome: "Mato Grosso",
        cidades: [
          { nome: "Cuiabá", gb100: 428, gb120: 306 },
          { nome: "Várzea Grande", gb100: 184, gb120: 128 },
        ],
      },
    ],
  },
  {
    nome: "Norte",
    cor: "#7c3aed",
    hoje: 3,
    estados: [
      {
        nome: "Pará",
        cidades: [
          { nome: "Belém", gb100: 742, gb120: 546 },
          { nome: "Ananindeua", gb100: 248, gb120: 176 },
        ],
      },
      {
        nome: "Amazonas",
        cidades: [
          { nome: "Manaus", gb100: 826, gb120: 604 },
        ],
      },
      {
        nome: "Rondônia",
        cidades: [
          { nome: "Porto Velho", gb100: 274, gb120: 192 },
        ],
      },
    ],
  },
];

const totalDe = (r: RegiaoRaw) =>
  r.estados.reduce(
    (s, e) => s + e.cidades.reduce((a, c) => a + c.gb100 + c.gb120, 0),
    0,
  );

const totalGeral = planilha.reduce((s, r) => s + totalDe(r), 0);

export const regioesBase: Regiao[] = planilha.map((r) => {
  const total = totalDe(r);
  return {
    nome: r.nome,
    cor: r.cor,
    hoje: r.hoje,
    estados: r.estados,
    total,
    percentual: Math.round((total / totalGeral) * 1000) / 10,
  };
});

export function fmt(n: number) {
  return n.toLocaleString("pt-BR");
}

export const SIGLAS: Record<string, string> = {
  "São Paulo": "SP",
  "Minas Gerais": "MG",
  "Rio de Janeiro": "RJ",
  "Espírito Santo": "ES",
  "Paraná": "PR",
  "Rio Grande do Sul": "RS",
  "Santa Catarina": "SC",
  "Mato Grosso do Sul": "MS",
  "Mato Grosso": "MT",
  "Bahia": "BA",
  "Pernambuco": "PE",
  "Ceará": "CE",
  "Goiás": "GO",
  "Distrito Federal": "DF",
  "Pará": "PA",
  "Amazonas": "AM",
  "Rondônia": "RO",
};

export function siglaDe(nome: string) {
  return SIGLAS[nome] ?? nome.slice(0, 2).toUpperCase();
}
