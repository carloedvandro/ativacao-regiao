import { useMemo, useState } from "react";
import {
  ArrowRight,
  BarChart3,
  ChevronDown,
  Filter,
  RefreshCw,
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
    return Array.from({ length: 7 }, (_, i) => 0.3 + rng(i) * 0.7);
  }, [seed]);
  const w = 72;
  const h = 22;
  const bw = w / vals.length - 2;
  return (
    <svg width={w} height={h}>
      {vals.map((v, i) => (
        <rect
          key={i}
          x={i * (bw + 2)}
          y={h - v * h}
          width={bw}
          height={v * h}
          rx={1.5}
          fill={color}
          opacity={0.35 + (i / vals.length) * 0.65}
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
    <div className="min-h-screen bg-gradient-to-b from-[#f6f4fb] to-[#eef1fb] text-[#140044]">
      <main className="mx-auto w-full max-w-[1536px] px-6 py-8 space-y-8">
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

        <p className="text-center text-xs text-[#7b7591]">
          Os dados são atualizados automaticamente em tempo real. Última atualização:{" "}
          {new Date().toLocaleString("pt-BR")}
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
    <section className="rounded-[24px] border border-[#e7e3f0] bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-black text-[#140044]">
          Detalhamento por Região{" "}
          <span className="text-sm font-medium text-[#8b86a0]">(em tempo real)</span>
        </h2>
        <button
          onClick={onOpenTable}
          className="flex items-center gap-2 rounded-lg border border-[#e0dbec] px-3 py-2 text-sm font-bold text-[#5517ea] transition hover:bg-[#f5f1ff]"
        >
          Ver tabela completa <Table2 className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
        {regioes.map((r) => (
          <button
            key={r.nome}
            type="button"
            onClick={() => onCardClick(r.nome)}
            className="group rounded-2xl border border-[#ece8f5] bg-white p-4 text-left transition hover:-translate-y-0.5 hover:shadow-lg"
            style={{ borderTopColor: r.cor, borderTopWidth: 3 }}
          >
            <div className="text-sm font-black" style={{ color: r.cor }}>
              {r.nome}
            </div>
            <div className="mt-2 text-2xl font-black tabular-nums text-[#140044]">
              <CountUp value={r.total} format={(n) => fmt(n)} />
            </div>
            <div className="text-base font-black" style={{ color: r.cor }}>
              {r.percentual.toFixed(1).replace(".", ",")}%
            </div>
            <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-[#f1eef7]">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, r.percentual * 2.5)}%`, backgroundColor: r.cor }}
              />
            </div>
            <div className="mt-3 flex items-center gap-1 text-xs font-bold text-emerald-600">
              <TrendingUp className="h-3.5 w-3.5" />
              <CountUp value={r.hoje} /> hoje
            </div>
            <div className="mt-1 text-[10px] uppercase tracking-widest text-[#a29bbc]">
              Atualizado agora
            </div>
          </button>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-center gap-2 text-xs text-[#7b7591]">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
        </span>
        Dados atualizados automaticamente a cada 3 segundos
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
    <section className="rounded-[24px] border border-[#e7e3f0] bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-black text-[#140044]">Produção em tempo real</h2>
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <button
              type="button"
              onClick={() => setPlanoOpen(!planoOpen)}
              className="flex items-center gap-2 rounded-lg border border-[#e0dbec] bg-white px-3 py-2 text-sm font-bold text-[#5517ea]"
            >
              <BarChart3 className="h-4 w-4" /> {planoLabel(plano)}
              <ChevronDown className="h-3.5 w-3.5" />
            </button>
            {planoOpen && (
              <ul className="absolute right-0 z-20 mt-1 w-44 overflow-hidden rounded-lg border border-[#e0dbec] bg-white shadow-xl">
                {(["todos", "gb50", "gb80", "gb100"] as Plano[]).map((p) => (
                  <li key={p}>
                    <button
                      type="button"
                      onClick={() => {
                        setPlano(p);
                        setPlanoOpen(false);
                      }}
                      className={`block w-full px-3 py-2 text-left text-sm ${
                        plano === p ? "bg-[#f5f1ff] font-bold text-[#5517ea]" : "text-[#140044] hover:bg-gray-50"
                      }`}
                    >
                      {planoLabel(p)}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <button className="flex items-center gap-2 rounded-lg border border-[#e0dbec] bg-white px-3 py-2 text-sm font-bold text-[#5517ea]">
            <Filter className="h-4 w-4" /> Filtros
          </button>
          <button
            onClick={onOpenAll}
            className="flex items-center gap-2 rounded-lg bg-[#5517ea] px-3 py-2 text-sm font-bold text-white hover:bg-[#4611c8]"
          >
            Ver todas <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#ece8f5] text-left text-[11px] uppercase tracking-wider text-[#8b86a0]">
              <th className="py-3">Região</th>
              <th className="py-3">Última atualização</th>
              <th className="py-3 text-center">Novas ativações</th>
              <th className="py-3 text-right">Total de ativações</th>
              <th className="py-3 text-right">Variação hoje</th>
              <th className="py-3 text-right pr-2">Tendência</th>
            </tr>
          </thead>
          <tbody>
            {linhas.map(({ r, total, isLast }, idx) => (
              <tr
                key={r.nome}
                className={`border-b border-[#f4f1fa] transition ${
                  isLast ? "bg-emerald-50/40" : "hover:bg-[#faf8fe]"
                }`}
              >
                <td className="py-4">
                  <span className="flex items-center gap-3 font-bold text-[#140044]">
                    <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: r.cor }} />
                    {r.nome}
                  </span>
                </td>
                <td className="py-4 text-[#7b7591]">
                  {isLast ? "Agora" : `${(idx + 1) * 3}s atrás`}
                </td>
                <td className="py-4 text-center">
                  <span className="rounded-md bg-emerald-50 px-2 py-1 text-sm font-black text-emerald-600">
                    +{isLast ? 1 : Math.max(1, r.hoje % 3)}
                  </span>
                </td>
                <td className="py-4 text-right font-black tabular-nums text-[#140044]">
                  <CountUp value={total} format={(n) => fmt(n)} />
                </td>
                <td className="py-4 text-right text-xs font-bold text-emerald-600">
                  +{r.hoje} hoje
                </td>
                <td className="py-4 pr-2 text-right">
                  <div className="flex justify-end">
                    <Sparkline color={r.cor} seed={r.total} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex justify-center">
        <div className="flex items-center gap-2 rounded-2xl border border-[#e0dbec] bg-[#f5f1ff] px-6 py-2.5 text-sm font-bold text-[#5517ea]">
          <RefreshCw className="h-4 w-4 animate-spin [animation-duration:3s]" />
          Atualizando automaticamente...
        </div>
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
