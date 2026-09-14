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
          { nome: "São Paulo", planos: { gb100: 1842, gb120: 2156 }, variacao: 12.5, tendencia: [2, 3, 4, 5, 6, 7, 8] },
          { nome: "Campinas", planos: { gb100: 612, gb120: 724 }, variacao: 10.3, tendencia: [2, 3, 3, 4, 5, 6, 7] },
          { nome: "Ribeirão Preto", planos: { gb100: 312, gb120: 356 }, variacao: 8.7, tendencia: [1, 2, 3, 4, 4, 5, 6] },
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
          { nome: "Curitiba", planos: { gb100: 1532, gb120: 1842 }, variacao: 9.8, tendencia: [2, 3, 4, 5, 5, 6, 7] },
          { nome: "Londrina", planos: { gb100: 468, gb120: 552 }, variacao: 8.2, tendencia: [1, 2, 3, 3, 4, 5, 6] },
          { nome: "Maringá", planos: { gb100: 368, gb120: 420 }, variacao: 7.1, tendencia: [1, 2, 2, 3, 4, 5, 5] },
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
          { nome: "Salvador", planos: { gb100: 1204, gb120: 1468 }, variacao: 11.4, tendencia: [2, 3, 4, 5, 6, 6, 7] },
          { nome: "Feira de Santana", planos: { gb100: 392, gb120: 468 }, variacao: 9.6, tendencia: [1, 2, 3, 4, 4, 5, 6] },
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
          { nome: "Goiânia", planos: { gb100: 876, gb120: 1052 }, variacao: 8.9, tendencia: [2, 2, 3, 4, 5, 5, 6] },
          { nome: "Aparecida de Goiânia", planos: { gb100: 324, gb120: 384 }, variacao: 7.3, tendencia: [1, 2, 2, 3, 4, 4, 5] },
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
          { nome: "Belém", planos: { gb100: 652, gb120: 796 }, variacao: 10.2, tendencia: [2, 3, 3, 4, 5, 6, 6] },
          { nome: "Ananindeua", planos: { gb100: 212, gb120: 248 }, variacao: 6.8, tendencia: [1, 1, 2, 3, 3, 4, 5] },
        ],
      },
    ],
  },
];

export const totalAtivacoes = regioes.reduce((s, r) => s + r.total, 0);