import { useMemo, useState } from "react";
import {
  ArrowRight,
  BarChart3,
  ChevronDown,
  Filter,
  Table2,
  TrendingUp,
  X,
} from "lucide-react";
import CountUp from "@/components/CountUp";
import { useLiveRegioes } from "@/hooks/useLiveRegioes";
import { fmt, type Regiao } from "@/data/dados";
import { withPercent } from "@/hooks/useLiveRegioes";

type Plano = "todos" | "gb50" | "gb80" | "gb100";

function planoLabel(p: Plano) {
  return p === "todos" ? "Todos os planos" : p === "gb50" ? "50GB" : p === "gb80" ? "80GB" : "100GB";
}

function sumPlano(cidade: { gb50: number; gb80: number; gb100: number }, p: Plano) {
  if (p === "todos") return cidade.gb50 + cidade.gb80 + cidade.gb100;
  return cidade[p];
}

function Sparkline({ color, seed }: { color: string; seed: number }) {
  const vals = useMemo(() => {
    const rng = (i: number) => {
      const x = Math.sin(seed * 37 + i * 91.7) * 10000;
      return Math.abs(x - Math.floor(x));
    };
    return Array.from({ length: 5 }, (_, i) => 0.28 + rng(i) * 0.72);
  }, [seed]);
  const w = 60;
  const h = 24;
  const bw = 3;
  const gap = (w - bw * vals.length) / (vals.length - 1);
  return (
    <svg width={w} height={h} aria-hidden>
      {vals.map((v, i) => (
        <rect
          key={i}
          x={i * (bw + gap)}
          y={h - v * h}
          width={bw}
          height={Math.max(2, v * h)}
          rx={bw / 2}
          fill={color}
          opacity={0.35 + (i / (vals.length - 1)) * 0.65}
        />
      ))}
    </svg>
  );
}

export default function DashboardRegioes() {
  const { regioes: regioesAll, lastUpdate } = useLiveRegioes(3000);
  const regioes = useMemo(
    () => withPercent(regioesAll.filter((r) => r.nome !== "Outros/Exterior")),
    [regioesAll],
  );
  const [drillOpen, setDrillOpen] = useState(false);
  const [drillRegion, setDrillRegion] = useState<string | null>(null);
  const [plano, setPlano] = useState<Plano>("todos");
  const [planoOpen, setPlanoOpen] = useState(false);

  const totalGeral = regioes.reduce((s, r) => s + r.total, 0);

  const openDrill = (nome: string) => {
    setDrillRegion(nome);
    setDrillOpen(true);
  };

  const activeRegion = drillRegion ? regioes.find((r) => r.nome === drillRegion) ?? null : null;

  return (
    <div className="premium-surface min-h-screen text-[#140044]">
      <main className="mx-auto w-full max-w-[1536px] px-6 py-10 space-y-8">
        <DetalhamentoRegioes
          regioes={regioes}
          onOpenTable={() => {
            setDrillRegion(null);
            setDrillOpen(true);
          }}
          onCardClick={openDrill}
        />

        <ProducaoTempoReal
          regioes={regioes}
          plano={plano}
          planoOpen={planoOpen}
          setPlano={setPlano}
          setPlanoOpen={setPlanoOpen}
          onOpenAll={() => {
            setDrillRegion(null);
            setDrillOpen(true);
          }}
          lastUpdate={lastUpdate}
          totalGeral={totalGeral}
        />

        <p className="text-center text-xs tracking-wide text-[#6b7280]">
          Dados atualizados em tempo real · Última sincronização:{" "}
          <span className="font-black text-[#6A0DAD]">
            {new Date().toLocaleString("pt-BR")}
          </span>
        </p>
      </main>

      {drillOpen && (
        <DrillDownModal
          regioes={regioes}
          activeRegion={activeRegion}
          plano={plano}
          onClose={() => setDrillOpen(false)}
          onSelectRegion={(nome) => setDrillRegion(nome)}
        />
      )}
    </div>
  );
}

function DetalhamentoRegioes({
  regioes,
  onOpenTable,
  onCardClick,
}: {
  regioes: Regiao[];
  onOpenTable: () => void;
  onCardClick: (nome: string) => void;
}) {
  return (
    <section className="sm:premium-card sm:rounded-[28px] sm:p-7">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-black text-[#140044]">
            Detalhamento por Região{" "}
            <span className="text-sm font-medium text-[#6b7280]">· ao vivo</span>
          </h2>
        </div>
        <button
          onClick={onOpenTable}
          className="gold-button inline-flex h-10 items-center gap-2 rounded-xl border border-[#6A0DAD] px-4 text-sm font-black tracking-wide transition"
        >
          Ver tabela completa <Table2 className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 md:grid-cols-3 lg:grid-cols-5">
        {regioes.map((r) => (
          <button
            key={r.nome}
            type="button"
            onClick={() => onCardClick(r.nome)}
            className="group relative flex flex-col rounded-2xl region-chip-3d p-4 text-left transition hover:shadow-sm"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-widest" style={{ color: r.cor }}>
                {r.nome}
              </span>
              <span className="rounded-md border border-gray-200 bg-gray-50 px-1.5 py-0.5 text-[10px] font-black text-[#3f3860]">
                {r.percentual.toFixed(1).replace(".", ",")}%
              </span>
            </div>
            <div className="mt-3 text-3xl font-black tabular-nums text-[#140044]">
              <CountUp value={r.total} format={(n) => fmt(n)} />
            </div>
            <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${Math.min(100, r.percentual * 2.5)}%`,
                  background: r.cor,
                }}
              />
            </div>
            <div className="mt-3 flex items-center justify-between">
              <span className="flex items-center gap-1 text-xs font-bold text-emerald-600">
                <TrendingUp className="h-3.5 w-3.5" />
                <CountUp value={r.hoje} /> hoje
              </span>
              <span className="text-[9px] uppercase tracking-widest text-[#6b7280]">Live</span>
            </div>
          </button>
        ))}
      </div>

      <div className="mt-5 flex items-center justify-center gap-2 text-xs text-[#6b7280]">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
        </span>
        Sincronização automática · 3 segundos
      </div>
    </section>
  );
}

function ProducaoTempoReal({
  regioes,
  plano,
  planoOpen,
  setPlano,
  setPlanoOpen,
  onOpenAll,
  lastUpdate,
}: {
  regioes: Regiao[];
  plano: Plano;
  planoOpen: boolean;
  setPlano: (p: Plano) => void;
  setPlanoOpen: (b: boolean) => void;
  onOpenAll: () => void;
  lastUpdate: { regiao: string; when: number } | null;
  totalGeral: number;
}) {
  const linhas = regioes.map((r) => {
    const total = r.estados.reduce(
      (s, e) => s + e.cidades.reduce((cs, c) => cs + sumPlano(c, plano), 0),
      0,
    );
    const isLast = lastUpdate?.regiao === r.nome;
    return { r, total, isLast };
  });

  return (
    <section className="sm:premium-card sm:rounded-[28px] sm:p-7">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-black text-[#140044]">Produção em tempo real</h2>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <button
              type="button"
              onClick={() => setPlanoOpen(!planoOpen)}
              className="inline-flex h-10 items-center gap-2 rounded-xl border border-gray-200 bg-white px-3.5 text-sm font-bold text-[#6A0DAD] shadow-sm transition hover:border-gray-300"
            >
              <BarChart3 className="h-4 w-4" /> {planoLabel(plano)}
              <ChevronDown className="h-3.5 w-3.5" />
            </button>
            {planoOpen && (
              <ul className="absolute right-0 z-20 mt-1 w-44 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">
                {(["todos", "gb50", "gb80", "gb100"] as Plano[]).map((p) => (
                  <li key={p}>
                    <button
                      type="button"
                      onClick={() => {
                        setPlano(p);
                        setPlanoOpen(false);
                      }}
                      className={`block w-full px-3 py-2 text-left text-sm transition ${
                        plano === p
                          ? "bg-gray-50 font-bold text-[#6A0DAD]"
                          : "text-[#3f3860] hover:bg-gray-50"
                      }`}
                    >
                      {planoLabel(p)}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <button className="inline-flex h-10 items-center gap-2 rounded-xl border border-gray-200 bg-white px-3.5 text-sm font-bold text-[#6A0DAD] shadow-sm transition hover:border-gray-300">
            <Filter className="h-4 w-4" /> Filtros
          </button>
          <button
            onClick={onOpenAll}
            className="purple-button inline-flex h-10 items-center gap-2 rounded-xl border border-[#6A0DAD] px-4 text-sm font-black transition"
          >
            Ver todas <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 text-left text-[10px] font-black uppercase tracking-[0.2em] text-[#6b7280]">
              <th className="py-3 pl-4">Região</th>
              <th className="py-3">Última atualização</th>
              <th className="py-3 text-center">Novas ativações</th>
              <th className="py-3 text-right">Total de ativações</th>
              <th className="py-3 text-right">Variação hoje</th>
              <th className="py-3 text-right pr-4">Tendência</th>
            </tr>
          </thead>
          <tbody>
            {linhas.map(({ r, total, isLast }, idx) => (
              <tr
                key={r.nome}
                className={`border-b border-gray-100 transition ${
                  isLast ? "bg-emerald-500/[0.04]" : "hover:bg-gray-50"
                }`}
              >
                <td className="py-4 pl-4">
                  <span className="flex items-center gap-3 font-bold text-[#140044]">
                    <span
                      className="inline-block h-2.5 w-2.5 rounded-full"
                      style={{ background: r.cor }}
                    />
                    {r.nome}
                  </span>
                </td>
                <td className="py-4 text-[#6b7280]">
                  {isLast ? "Agora" : `há ${(idx + 1) * 3} seg`}
                </td>
                <td className="py-4 text-center">
                  <span className="rounded-md border border-emerald-500/30 bg-emerald-500/10 px-2 py-1 text-sm font-black text-emerald-600">
                    +{isLast ? 1 : Math.max(1, r.hoje % 3)}
                  </span>
                </td>
                <td className="py-4 text-right font-black tabular-nums text-[#140044]">
                  <CountUp value={total} format={(n) => fmt(n)} />
                </td>
                <td className="py-4 text-right text-xs font-bold text-emerald-600">
                  +{r.hoje} hoje
                </td>
                <td className="py-4 pr-4 text-right">
                  <div className="flex justify-end">
                    <Sparkline color={r.cor} seed={r.total} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </section>
  );
}

function DrillDownModal({
  regioes,
  activeRegion,
  plano,
  onClose,
  onSelectRegion,
}: {
  regioes: Regiao[];
  activeRegion: Regiao | null;
  plano: Plano;
  onClose: () => void;
  onSelectRegion: (nome: string) => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="relative flex max-h-[90vh] w-full max-w-6xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-[#ece8f5] px-6 py-4">
          <div>
            <h2 className="text-xl font-black text-[#140044]">
              {activeRegion ? `Detalhamento — ${activeRegion.nome}` : "Todas as Regiões — Estados e Cidades"}
            </h2>
            <p className="text-xs text-[#7b7591]">
              Ativações por estado, cidade e plano ({plano === "todos" ? "todos os planos" : planoLabel(plano)})
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-[#7b7591] hover:bg-gray-100"
            aria-label="Fechar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex flex-wrap gap-2 border-b border-[#ece8f5] px-6 py-3">
          <button
            onClick={() => onSelectRegion("")}
            className={`rounded-full px-3 py-1.5 text-xs font-bold ${
              !activeRegion ? "bg-[#5517ea] text-white" : "bg-[#f5f1ff] text-[#5517ea]"
            }`}
          >
            Todas
          </button>
          {regioes.map((r) => (
            <button
              key={r.nome}
              onClick={() => onSelectRegion(r.nome)}
              className={`rounded-full px-3 py-1.5 text-xs font-bold ${
                activeRegion?.nome === r.nome ? "text-white" : "bg-white"
              }`}
              style={
                activeRegion?.nome === r.nome
                  ? { backgroundColor: r.cor }
                  : { color: r.cor, border: `1px solid ${r.cor}44` }
              }
            >
              {r.nome}
            </button>
          ))}
        </div>

        <div className="overflow-auto px-6 py-4">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-white">
              <tr className="border-b border-[#ece8f5] text-left text-[11px] uppercase tracking-wider text-[#8b86a0]">
                <th className="py-2">Região</th>
                <th className="py-2">Estado</th>
                <th className="py-2">Cidade</th>
                <th className="py-2 text-right">50GB</th>
                <th className="py-2 text-right">80GB</th>
                <th className="py-2 text-right">100GB</th>
                <th className="py-2 text-right pr-2">Total</th>
              </tr>
            </thead>
            <tbody>
              {(activeRegion ? [activeRegion] : regioes).flatMap((r) =>
                r.estados.flatMap((e) =>
                  e.cidades.map((c) => {
                    const total = c.gb50 + c.gb80 + c.gb100;
                    return (
                      <tr key={`${r.nome}-${e.nome}-${c.nome}`} className="border-b border-[#f4f1fa]">
                        <td className="py-2">
                          <span className="flex items-center gap-2 font-bold" style={{ color: r.cor }}>
                            <span className="inline-block h-2 w-2 rounded-full" style={{ background: r.cor }} />
                            {r.nome}
                          </span>
                        </td>
                        <td className="py-2 text-[#140044]">{e.nome}</td>
                        <td className="py-2 text-[#140044]">{c.nome}</td>
                        <td className="py-2 text-right tabular-nums text-[#3f3860]">{fmt(c.gb50)}</td>
                        <td className="py-2 text-right tabular-nums text-[#3f3860]">{fmt(c.gb80)}</td>
                        <td className="py-2 text-right tabular-nums text-[#3f3860]">{fmt(c.gb100)}</td>
                        <td className="py-2 pr-2 text-right font-black tabular-nums text-[#140044]">
                          {fmt(total)}
                        </td>
                      </tr>
                    );
                  }),
                ),
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between border-t border-[#ece8f5] bg-[#faf8fe] px-6 py-3 text-xs text-[#7b7591]">
          <span className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Live — atualizando a cada 3s
          </span>
          <button
            onClick={onClose}
            className="rounded-lg bg-[#5517ea] px-4 py-2 text-xs font-bold text-white hover:bg-[#4611c8]"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
