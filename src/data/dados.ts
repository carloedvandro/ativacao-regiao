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
    cor: "#ec1677",
    total: 14142,
    percentual: 30.4,
    hoje: 12,
    estados: [
      {
        nome: "São Paulo",
        cidades: [
          { nome: "São Paulo", gb50: 1842, gb80: 2156, gb100: 2394 },
          { nome: "Campinas", gb50: 612, gb80: 724, gb100: 812 },
          { nome: "Ribeirão Preto", gb50: 312, gb80: 356, gb100: 398 },
        ],
      },
      {
        nome: "Minas Gerais",
        cidades: [
          { nome: "Belo Horizonte", gb50: 1320, gb80: 1540, gb100: 1390 },
        ],
      },
      {
        nome: "Rio de Janeiro",
        cidades: [
          { nome: "Rio de Janeiro", gb50: 980, gb80: 1120, gb100: 1000 },
        ],
      },
      {
        nome: "Espírito Santo",
        cidades: [
          { nome: "Vitória", gb50: 300, gb80: 336, gb100: 336 },
        ],
      },
    ],
  },
  {
    nome: "Sul",
    cor: "#049b16",
    total: 13048,
    percentual: 28.1,
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
    cor: "#f59e0b",
    total: 7820,
    percentual: 16.8,
    hoje: 6,
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
    cor: "#8a18f5",
    total: 6598,
    percentual: 14.2,
    hoje: 7,
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
    cor: "#098da8",
    total: 4655,
    percentual: 10.0,
    hoje: 4,
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
    cor: "#4b13d6",
    total: 3597,
    percentual: 7.7,
    hoje: 3,
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
