import { useEffect, useRef, useState } from "react";
import referenciaPizzaRegioes from "@/assets/referencia-pizza-regioes.png";
import { regioesBase } from "@/data/dados";
import type { Regiao } from "@/types/dashboard";

function useTick(ms: number) {
  const [n, setN] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setN((v) => v + 1), ms);
    return () => clearInterval(t);
  }, [ms]);
  return n;
}

type LiveRegiao = Regiao & { hoje: number; novas: number; variacao: number };

const REGIAO_ORDER = ["Sudeste", "Sul", "Outros/Exterior", "Nordeste", "Centro-Oeste", "Norte"];
const VARIACOES: Record<string, number> = {
  "Sudeste": 8.7,
  "Sul": 11.3,
  "Norte": 6.1,
  "Centro-Oeste": 9.4,
  "Nordeste": -2.3,
  "Outros/Exterior": 4.8,
};

export default function DistribuicaoRegiaoDashboard() {
  const tick = useTick(10000);

  const [state, setState] = useState<LiveRegiao[]>(() =>
    [...regioesBase]
      .sort((a, b) => REGIAO_ORDER.indexOf(a.nome) - REGIAO_ORDER.indexOf(b.nome))
      .map((r) => ({
        nome: r.nome,
        cor: r.cor,
        total: r.total,
        percentual: r.percentual,
        hoje: r.hoje ?? 0,
        novas: 0,
        variacao: VARIACOES[r.nome] ?? 0,
      })),
  );
  const lastTick = useRef(0);

  useEffect(() => {
    if (tick === 0 || tick === lastTick.current) return;
    lastTick.current = tick;
    setState((prev) => {
      const totalBase = prev.reduce((s, r) => s + r.total, 0);
      return prev.map((r) => {
        const share = r.total / totalBase;
        const base = Math.max(1, Math.round(share * 6));
        const novas = base + Math.floor(Math.random() * 3);
        return { ...r, total: r.total + novas, hoje: r.hoje + novas, novas };
      });
    });
  }, [tick]);

  return (
    <ReferenceArtwork />
  );
}

function ReferenceArtwork() {
  return (
    <section className="relative mx-auto w-full max-w-[1184px] overflow-hidden bg-white">
      <img
        src={referenciaPizzaRegioes}
        alt="Distribuição por Região com gráfico donut 3D e chamadas laterais"
        className="block h-auto w-full select-none"
        draggable={false}
      />
    </section>
  );
}