export type Cidade = { nome: string; gb50: number; gb80: number; gb100: number };
export type Estado = { nome: string; cidades: Cidade[] };
export type Regiao = {
  nome: string;
  cor: string;
  total: number;
  percentual: number;
  hoje: number;
  estados: Estado[];
};

export const regioesBase: Regiao[] = [
  {
    nome: "Sudeste",
    cor: "#16a34a",
    total: 14212,
    percentual: 30.4,
    hoje: 8,
    estados: [
      {
        nome: "São Paulo",
        cidades: [
          { nome: "São Paulo", gb50: 2500, gb80: 2700, gb100: 2636 },
        ],
      },
      {
        nome: "Minas Gerais",
        cidades: [
          { nome: "Belo Horizonte", gb50: 1000, gb80: 1100, gb100: 1025 },
        ],
      },
      {
        nome: "Rio de Janeiro",
        cidades: [
          { nome: "Rio de Janeiro", gb50: 700, gb80: 734, gb100: 700 },
        ],
      },
      {
        nome: "Espírito Santo",
        cidades: [
          { nome: "Vitória", gb50: 370, gb80: 374, gb100: 373 },
        ],
      },
    ],
  },
  {
    nome: "Sul",
    cor: "#ec4899",
    total: 13225,
    percentual: 28.3,
    hoje: 9,
    estados: [
      {
        nome: "Paraná",
        cidades: [
          { nome: "Curitiba", gb50: 1532, gb80: 1842, gb100: 2068 },
          { nome: "Londrina", gb50: 468, gb80: 552, gb100: 636 },
          { nome: "Maringá", gb50: 368, gb80: 420, gb100: 492 },
        ],
      },
      {
        nome: "Rio Grande do Sul",
        cidades: [
          { nome: "Porto Alegre", gb50: 1820, gb80: 2080, gb100: 2240 },
          { nome: "Caxias do Sul", gb50: 540, gb80: 620, gb100: 700 },
        ],
      },
      {
        nome: "Santa Catarina",
        cidades: [
          { nome: "Florianópolis", gb50: 760, gb80: 880, gb100: 960 },
          { nome: "Joinville", gb50: 420, gb80: 488, gb100: 540 },
        ],
      },
      {
        nome: "Mato Grosso do Sul",
        cidades: [
          { nome: "Campo Grande", gb50: 0, gb80: 0, gb100: 0 },
        ],
      },
    ],
  },
  {
    nome: "Outros/Exterior",
    cor: "#f97316",
    total: 3075,
    percentual: 6.5,
    hoje: 3,
    estados: [
      {
        nome: "Exterior",
        cidades: [
          { nome: "Lisboa", gb50: 1200, gb80: 1400, gb100: 1500 },
          { nome: "Miami", gb50: 1100, gb80: 1300, gb100: 1320 },
        ],
      },
    ],
  },
  {
    nome: "Nordeste",
    cor: "#a21caf",
    total: 4058,
    percentual: 8.7,
    hoje: 4,
    estados: [
      {
        nome: "Bahia",
        cidades: [
          { nome: "Salvador", gb50: 1204, gb80: 1468, gb100: 1628 },
          { nome: "Feira de Santana", gb50: 392, gb80: 468, gb100: 520 },
        ],
      },
    ],
  },
  {
    nome: "Centro-Oeste",
    cor: "#14b8a6",
    total: 5098,
    percentual: 10.9,
    hoje: 5,
    estados: [
      {
        nome: "Goiás",
        cidades: [
          { nome: "Goiânia", gb50: 876, gb80: 1052, gb100: 1156 },
          { nome: "Aparecida de Goiânia", gb50: 324, gb80: 384, gb100: 428 },
        ],
      },
    ],
  },
  {
    nome: "Norte",
    cor: "#7c3aed",
    total: 7114,
    percentual: 15.2,
    hoje: 6,
    estados: [
      {
        nome: "Pará",
        cidades: [
          { nome: "Belém", gb50: 652, gb80: 796, gb100: 872 },
          { nome: "Ananindeua", gb50: 212, gb80: 248, gb100: 276 },
        ],
      },
    ],
  },
];

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
  "Bahia": "BA",
  "Goiás": "GO",
  "Pará": "PA",
  "Exterior": "EX",
};

export function siglaDe(nome: string) {
  return SIGLAS[nome] ?? nome.slice(0, 2).toUpperCase();
}
