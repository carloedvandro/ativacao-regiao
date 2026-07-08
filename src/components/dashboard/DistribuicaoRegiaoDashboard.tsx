import { memo, useEffect, useMemo, useRef, useState } from "react";
import {
  BarChart3,
  ChevronDown,
  Filter,
  PieChart,
  RefreshCcw,
  Table2,
  TrendingUp,
} from "lucide-react";
import Donut3DChart from "@/components/Donut3DChart";
import { regioesBase, fmt } from "@/data/dados";
import type { Regiao } from "@/types/dashboard";
import CountUp from "@/components/CountUp";

function useTick(ms: number) {
  const [n, setN] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setN((v) => v + 1), ms);
    return () => clearInterval(t);
  }, [ms]);
  return n;
}

// Isolated clock so 1s updates don't re-render the whole dashboard tree.
const LiveClock = memo(function LiveClock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  return (
    <>
      {now.toLocaleDateString("pt-BR")} às{" "}
      {now.toLocaleTimeString("pt-BR", { hour12: false })}
    </>
  );
});

type LiveRegiao = Regiao & { hoje: number; ultima: number; novas: number };

export default function DistribuicaoRegiaoDashboard() {
  const tick = useTick(3000);

  // Live state: each tick adds new activations proportional to base share
  const [state, setState] = useState<LiveRegiao[]>(() =>
    regioesBase.map((r) => ({
      nome: r.nome,
      cor: r.cor,
      total: r.total,
      percentual: r.percentual,
      hoje: r.hoje ?? 0,
      ultima: 0,
      novas: 0,
    })),
  );
  const lastTick = useRef(0);

  useEffect(() => {
    if (tick === 0 || tick === lastTick.current) return;
    lastTick.current = tick;
    setState((prev) => {
      const totalBase = prev.reduce((s, r) => s + r.total, 0);
      return prev.map((r) => {
        // Weighted random: bigger regions get more new activations
        const share = r.total / totalBase;
        const base = Math.max(1, Math.round(share * 8));
        const jitter = Math.floor(Math.random() * 3); // 0..2
        const novas = base + jitter;
        return {
          ...r,
          total: r.total + novas,
          hoje: r.hoje + novas,
          novas,
          ultima: 0,
        };
      });
    });
  }, [tick]);

  // Derived data — only recomputes when `state` changes (per 3s tick).
  const { regioes, totalGeral, cardsOrdenados, left, right } = useMemo(() => {
    const total = state.reduce((s, r) => s + r.total, 0) || 1;
    const regioes: LiveRegiao[] = state.map((r) => ({
      ...r,
      percentual: (r.total / total) * 100,
    }));
    const cardsOrdenados = [...regioes].sort((a, b) => b.total - a.total);
    return {
      regioes,
      totalGeral: total,
      cardsOrdenados,
      left: cardsOrdenados.filter((_, i) => i % 2 === 0),
      right: cardsOrdenados.filter((_, i) => i % 2 === 1),
    };
  }, [state]);

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 sm:flex sm:flex-wrap sm:items-start sm:justify-between">
        <div className="flex min-w-0 items-start gap-4">
          <div
            className="w-14 h-14 shrink-0 rounded-2xl grid place-items-center"
            style={{
              background: "linear-gradient(160deg, #8B2BE2, #4A0075)",
              boxShadow: "0 10px 24px rgba(106,13,173,.35), inset 0 2px 3px rgba(255,255,255,.25)",
            }}
          >
            <PieChart className="w-7 h-7 text-white" />
          </div>
          <div className="min-w-0">
            <h1 className="truncate text-2xl sm:text-3xl md:text-4xl font-black text-[#1A0033]">
              Distribuição por Região
            </h1>
            <p className="truncate text-slate-500">Ativações SmartVoz por região</p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-3 px-4 py-2 rounded-xl bg-white border border-slate-200 shadow-sm">
          <span className="w-2.5 h-2.5 shrink-0 rounded-full bg-green-500 animate-pulse" />
          <div className="leading-tight hidden sm:block">
            <p className="font-black text-slate-800 text-sm">Em tempo real</p>
            <p className="text-xs text-slate-500">Atualizando a cada 3s</p>
          </div>
          <span className="sm:hidden text-xs font-bold text-slate-700">Ao vivo</span>
        </div>
      </header>

      {/* Chart card */}
      <section className="rounded-3xl bg-white border border-slate-200 shadow-[0_20px_60px_rgba(20,0,68,.06)] p-6 md:p-10">
        <div className="flex justify-center mb-4">
          <button
            type="button"
            className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-white border border-slate-200 shadow-md text-[#1A0033] font-black"
          >
            <PieChart className="w-5 h-5 text-[#6A0DAD]" />
            Distribuição por Região
            <ChevronDown className="w-4 h-4 text-slate-500" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(180px,1fr)_minmax(0,2fr)_minmax(180px,1fr)] gap-6 items-center">
          {/* Left labels */}
          <div className="flex flex-col gap-8 order-2 lg:order-1">
            {left.map((r) => (
              <RegionLabel key={r.nome} regiao={r} align="right" />
            ))}
          </div>

          {/* Donut */}
          <div className="order-1 lg:order-2">
            <Donut3DChart regioes={regioes as unknown as Regiao[]} />
          </div>

          {/* Right labels */}
          <div className="flex flex-col gap-8 order-3">
            {right.map((r) => (
              <RegionLabel key={r.nome} regiao={r} align="left" />
            ))}
          </div>
        </div>

        {/* Total */}
        <div className="flex flex-col items-center gap-2 mt-4">
          <div className="flex items-center gap-4 px-6 py-3 rounded-2xl border border-slate-200 shadow-sm bg-white">
            <div
              className="w-9 h-9 rounded-xl grid place-items-center"
              style={{ background: "linear-gradient(160deg, #8B2BE2, #4A0075)" }}
            >
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <p className="font-bold text-slate-600">Total de ativações</p>
            <CountUp
              key="total-geral"
              value={totalGeral}
              format={fmt}
              className="text-2xl md:text-3xl font-black text-[#1A0033] tabular-nums bump-in"
            />
          </div>
          <p className="text-xs text-slate-500 flex items-center gap-2">
            <RefreshCcw className="w-3.5 h-3.5" /> Atualizado agora há poucos segundos
          </p>
        </div>
      </section>

      {/* Detalhamento */}
      <section className="rounded-3xl bg-white border border-slate-200 shadow-[0_20px_60px_rgba(20,0,68,.06)] p-6 md:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
          <h2 className="text-xl md:text-2xl font-black text-[#1A0033]">
            Detalhamento por Região{" "}
            <span className="text-slate-500 font-semibold text-base">(em tempo real)</span>
          </h2>
          <button className="flex items-center gap-2 text-[#6A0DAD] font-bold hover:underline">
            Ver tabela completa <Table2 className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
          {cardsOrdenados.map((r) => (
            <div
              key={r.nome}
              className="rounded-2xl border border-slate-200 p-4 bg-white flex flex-col gap-1 shadow-sm"
            >
              <p className="font-black text-sm" style={{ color: r.cor }}>
                {r.nome}
              </p>
              <CountUp
                value={r.total}
                format={fmt}
                className="text-2xl font-black text-[#1A0033] tabular-nums"
              />
              <p className="font-black" style={{ color: r.cor }}>
                {r.percentual.toFixed(1).replace(".", ",")}%
              </p>
              <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden mt-1">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${Math.min(100, r.percentual * 2.5)}%`,
                    background: r.cor,
                  }}
                />
              </div>
              <p className="text-sm text-green-600 font-bold mt-2 flex items-center gap-1">
                <TrendingUp className="w-4 h-4" />
                <CountUp key={`hoje-${r.nome}`} value={r.hoje} className="bump-in" /> hoje
              </p>
              <p className="text-xs text-slate-500">Atualizado agora</p>
            </div>
          ))}
        </div>

        <p className="text-center text-xs text-slate-500 mt-5 flex items-center justify-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          Dados atualizados automaticamente a cada 3 segundos
        </p>
      </section>

      {/* Produção em tempo real */}
      <section className="rounded-3xl bg-white border border-slate-200 shadow-[0_20px_60px_rgba(20,0,68,.06)] p-6 md:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
          <h2 className="text-xl md:text-2xl font-black text-[#1A0033]">Produção em tempo real</h2>
          <div className="flex flex-wrap items-center gap-3">
            <button className="flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 text-sm font-bold text-slate-700 bg-white">
              <Table2 className="w-4 h-4" /> Todos os tipos <ChevronDown className="w-4 h-4" />
            </button>
            <button className="flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 text-sm font-bold text-slate-700 bg-white">
              <Filter className="w-4 h-4" /> Filtros
            </button>
            <button className="text-[#6A0DAD] font-bold text-sm hover:underline flex items-center gap-1">
              Ver todas →
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-sm">
            <thead>
              <tr className="text-left text-slate-500 border-b border-slate-100">
                <th className="py-3 font-bold">Região</th>
                <th className="py-3 font-bold">Última atualização</th>
                <th className="py-3 font-bold text-center">Novas ativações</th>
                <th className="py-3 font-bold text-right">Total de ativações</th>
                <th className="py-3 font-bold text-center">Variação</th>
                <th className="py-3 font-bold text-right">Tendência</th>
              </tr>
            </thead>
            <tbody>
              {cardsOrdenados.map((r) => (
                <tr key={r.nome} className="border-b border-slate-100 last:border-0">
                  <td className="py-3 font-black text-[#1A0033]">
                    <span className="inline-flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ background: r.cor }} />
                      {r.nome}
                    </span>
                  </td>
                  <td className="py-3 text-slate-500">
                    {tick === 0 ? "—" : "Agora"}
                  </td>
                  <td className="py-3 text-center font-bold text-green-600">
                    <span key={`nv-${r.nome}-${tick}`} className="inline-block px-2 py-0.5 flash-cell bump-in">
                      +{r.novas}
                    </span>
                  </td>
                  <td className="py-3 text-right font-black text-[#1A0033] tabular-nums">
                    <CountUp value={r.total} format={fmt} />
                  </td>
                  <td className="py-3 text-center font-bold text-green-600">
                    <span key={`var-${r.nome}-${tick}`} className="inline-block px-2 py-0.5 flash-cell">
                      +<CountUp value={r.hoje} /> hoje
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    <span className="inline-flex items-end gap-0.5 h-5">
                      {[3, 5, 4, 7, 6].map((h, k) => (
                        <span
                          key={`${tick}-${k}`}
                          className="w-1 rounded-sm trend-bar"
                          style={{
                            height: `${h * 2}px`,
                            background: r.cor,
                            animationDelay: `${k * 60}ms`,
                          }}
                        />
                      ))}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-center mt-5">
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-600 text-sm">
            <RefreshCcw className="w-4 h-4 animate-spin" />
            Atualizando automaticamente...
          </div>
        </div>

        <p className="text-center text-xs text-slate-400 mt-4">
          ⓘ Os dados são atualizados automaticamente em tempo real. Última atualização:{" "}
          <LiveClock />
        </p>
      </section>
    </div>
  );
}

function RegionLabel({
  regiao,
  align,
}: {
  regiao: LiveRegiao;
  align: "left" | "right";
}) {
  return (
    <div
      className={`flex flex-col ${align === "right" ? "items-end text-right" : "items-start text-left"}`}
    >
      <p className="font-black text-lg" style={{ color: regiao.cor }}>
        {regiao.nome}
      </p>
      <p className="text-xs text-slate-500 max-w-[180px] leading-snug">
        Total de ativações realizadas na região {regiao.nome} no período selecionado.
      </p>
      <span
        className="mt-2 inline-block px-3 py-1 rounded-lg text-sm font-black tabular-nums"
        style={{
          color: regiao.cor,
          border: `1.5px solid ${regiao.cor}`,
          background: `${regiao.cor}12`,
        }}
      >
        {fmt(regiao.total)}
      </span>
    </div>
  );
}