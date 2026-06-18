import type { Regiao } from "@/types/dashboard";

export const regioes: Regiao[] = [
  {
    nome: "Sudeste",
    percentual: 30.4,
    total: 14142,
    cor: "#ff1b7d",
    hoje: 12,
    estados: [
      {
        nome: "São Paulo",
        cidades: [
          { nome: "São Paulo", planos: { gb50: 1842, gb80: 2156, gb100: 2394 }, variacao: 12.5, tendencia: [2, 3, 4, 5, 6, 7, 8] },
          { nome: "Campinas", planos: { gb50: 612, gb80: 724, gb100: 812 }, variacao: 10.3, tendencia: [2, 3, 3, 4, 5, 6, 7] },
          { nome: "Ribeirão Preto", planos: { gb50: 312, gb80: 356, gb100: 398 }, variacao: 8.7, tendencia: [1, 2, 3, 4, 4, 5, 6] },
        ],
      },
    ],
  },
  {
    nome: "Sul",
    percentual: 28.1,
    total: 13048,
    cor: "#00a81a",
    hoje: 9,
    estados: [
      {
        nome: "Paraná",
        cidades: [
          { nome: "Curitiba", planos: { gb50: 1532, gb80: 1842, gb100: 2068 }, variacao: 9.8, tendencia: [2, 3, 4, 5, 5, 6, 7] },
          { nome: "Londrina", planos: { gb50: 468, gb80: 552, gb100: 636 }, variacao: 8.2, tendencia: [1, 2, 3, 3, 4, 5, 6] },
          { nome: "Maringá", planos: { gb50: 368, gb80: 420, gb100: 492 }, variacao: 7.1, tendencia: [1, 2, 2, 3, 4, 5, 5] },
        ],
      },
    ],
  },
  {
    nome: "Nordeste",
    percentual: 14.2,
    total: 6598,
    cor: "#8a1cff",
    hoje: 7,
    estados: [
      {
        nome: "Bahia",
        cidades: [
          { nome: "Salvador", planos: { gb50: 1204, gb80: 1468, gb100: 1628 }, variacao: 11.4, tendencia: [2, 3, 4, 5, 6, 6, 7] },
          { nome: "Feira de Santana", planos: { gb50: 392, gb80: 468, gb100: 520 }, variacao: 9.6, tendencia: [1, 2, 3, 4, 4, 5, 6] },
        ],
      },
    ],
  },
  {
    nome: "Centro-Oeste",
    percentual: 10.0,
    total: 4655,
    cor: "#09a8c9",
    hoje: 4,
    estados: [
      {
        nome: "Goiás",
        cidades: [
          { nome: "Goiânia", planos: { gb50: 876, gb80: 1052, gb100: 1156 }, variacao: 8.9, tendencia: [2, 2, 3, 4, 5, 5, 6] },
          { nome: "Aparecida de Goiânia", planos: { gb50: 324, gb80: 384, gb100: 428 }, variacao: 7.3, tendencia: [1, 2, 2, 3, 4, 4, 5] },
        ],
      },
    ],
  },
  {
    nome: "Norte",
    percentual: 7.7,
    total: 3597,
    cor: "#4d00ff",
    hoje: 3,
    estados: [
      {
        nome: "Pará",
        cidades: [
          { nome: "Belém", planos: { gb50: 652, gb80: 796, gb100: 872 }, variacao: 10.2, tendencia: [2, 3, 3, 4, 5, 6, 6] },
          { nome: "Ananindeua", planos: { gb50: 212, gb80: 248, gb100: 276 }, variacao: 6.8, tendencia: [1, 1, 2, 3, 3, 4, 5] },
        ],
      },
    ],
  },
];

export const totalAtivacoes = regioes.reduce((s, r) => s + r.total, 0);