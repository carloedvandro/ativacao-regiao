export type Planos = { gb100: number; gb120: number; ZZDROP: number };

export type Cidade = {
  nome: string;
  planos: Planos;
  variacao?: number;
  tendencia?: number[];
};

export type Estado = {
  nome: string;
  cidades: Cidade[];
};

export type Regiao = {
  nome: string;
  percentual: number;
  total: number;
  cor: string;
  hoje?: number;
  estados?: Estado[];
};