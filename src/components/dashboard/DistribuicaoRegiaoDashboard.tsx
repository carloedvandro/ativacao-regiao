import { memo, useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from "react";
import {
  BarChart3,
  ChevronDown,
  Clock,
  Download,
  RefreshCcw,
  Trophy,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import Donut3DChart from "@/components/Donut3DChart";
import { regioesBase, fmt, siglaDe } from "@/data/dados";
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

const LiveClock = memo(function LiveClock() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  if (!now) return <span suppressHydrationWarning className="tabular-nums">--:--:--</span>;
  return (
    <span suppressHydrationWarning className="tabular-nums">
      {now.toLocaleTimeString("pt-BR", { hour12: false })}
    </span>
  );
});

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

  const { regioes, totalGeral, lider, ordenadas } = useMemo(() => {
    const total = state.reduce((s, r) => s + r.total, 0) || 1;
    const regioes: LiveRegiao[] = state.map((r) => ({
      ...r,
      percentual: (r.total / total) * 100,
    }));
    const ordenadas = [...regioes].sort((a, b) => b.total - a.total);
    return { regioes, totalGeral: total, lider: ordenadas[0], ordenadas };
  }, [state]);

  const estadosSudeste = useMemo(() => {
    const sud = regioesBase.find((r) => r.nome === "Sudeste");
    if (!sud?.estados) return [];
    const totalSud = sud.estados.reduce(
      (s, e) => s + e.cidades.reduce((c, ci) => c + ci.gb50 + ci.gb80 + ci.gb100, 0),
      0,
    );
    const varsSud: Record<string, number> = { SP: 9.5, MG: 7.1, RJ: 6.2, ES: 4.3 };
    return sud.estados.map((e) => {
      const total = e.cidades.reduce((c, ci) => c + ci.gb50 + ci.gb80 + ci.gb100, 0);
      const sigla = siglaDe(e.nome);
      return {
        sigla,
        total,
        percentual: (total / totalSud) * 100,
        variacao: varsSud[sigla] ?? 0,
      };
    });
  }, []);

  return (
    <div className="flex flex-col gap-8">
      <ReferenceArtwork regioes={regioes} totalGeral={totalGeral} />

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <KpiCard
          icon={<BarChart3 className="w-6 h-6 text-[#6A0DAD]" />}
          iconBg="bg-purple-50"
          title="Total de ativações"
          value={<CountUp value={totalGeral} format={fmt} />}
          subtitle="Período selecionado"
          footer={
            <span className="inline-flex items-center gap-1 text-xs font-bold text-green-700 bg-green-50 rounded-full px-2 py-0.5">
              <TrendingUp className="w-3 h-3" /> 12,5%
              <span className="text-slate-500 font-medium ml-1">vs período anterior</span>
            </span>
          }
        />
        <KpiCard
          icon={<Trophy className="w-6 h-6 text-green-600" />}
          iconBg="bg-green-50"
          title="Região líder"
          value={<span>{lider?.nome}</span>}
          subtitle={<><CountUp value={lider?.total ?? 0} format={fmt} /> ativações</>}
          footer={
            <span className="inline-flex items-center gap-1 text-xs font-bold text-green-700 bg-green-50 rounded-full px-2 py-0.5">
              {lider?.percentual.toFixed(1).replace(".", ",")}% do total
            </span>
          }
        />
        <KpiCard
          icon={<Clock className="w-6 h-6 text-[#6A0DAD]" />}
          iconBg="bg-purple-50"
          title="Atualização"
          value="Em tempo real"
          subtitle="Dados atualizados"
          footer={
            <span className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              Agora mesmo
            </span>
          }
        />
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-3xl bg-white border border-slate-200 shadow-[0_20px_60px_rgba(20,0,68,.06)] p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-black text-[#1A0033]">Regiões</h3>
            <div className="flex items-center gap-2 text-sm text-slate-500">
              Ordenar por
              <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 font-bold text-slate-700">
                Participação <ChevronDown className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-500 border-b border-slate-100">
                <th className="py-2 font-semibold">Região</th>
                <th className="py-2 font-semibold">Ativações</th>
                <th className="py-2 font-semibold">Participação</th>
                <th className="py-2 font-semibold text-right">Variação</th>
              </tr>
            </thead>
            <tbody>
              {ordenadas.map((r) => (
                <tr key={r.nome} className="border-b border-slate-50 last:border-0">
                  <td className="py-3">
                    <span className="inline-flex items-center gap-2 font-semibold text-[#1A0033]">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ background: r.cor }} />
                      {r.nome}
                    </span>
                  </td>
                  <td className="py-3 tabular-nums text-slate-700">
                    <CountUp value={r.total} format={fmt} />
                  </td>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-[#1A0033] tabular-nums w-12">
                        {r.percentual.toFixed(1).replace(".", ",")}%
                      </span>
                      <div className="h-1.5 flex-1 max-w-[120px] rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${Math.min(100, r.percentual * 2.5)}%`, background: r.cor }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="py-3 text-right"><VariacaoBadge value={r.variacao} /></td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-xs text-slate-400 mt-3">Exibindo 1 a 6 de 6 regiões</p>
        </div>

        <div className="rounded-3xl bg-white border border-slate-200 shadow-[0_20px_60px_rgba(20,0,68,.06)] p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-black text-[#1A0033]">
              Estados da região <span className="text-green-600">Sudeste</span>
            </h3>
            <div className="flex items-center gap-2 text-sm text-slate-500">
              Ordenar por
              <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 font-bold text-slate-700">
                Ativações <ChevronDown className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-500 border-b border-slate-100">
                <th className="py-2 font-semibold">Estado</th>
                <th className="py-2 font-semibold">Ativações</th>
                <th className="py-2 font-semibold">Participação</th>
                <th className="py-2 font-semibold text-right">Variação</th>
              </tr>
            </thead>
            <tbody>
              {estadosSudeste.map((e) => (
                <tr key={e.sigla} className="border-b border-slate-50">
                  <td className="py-3">
                    <span className="inline-flex items-center gap-2 font-semibold text-[#1A0033]">
                      <span className="w-2.5 h-2.5 rounded-full bg-green-600" />
                      {e.sigla}
                    </span>
                  </td>
                  <td className="py-3 tabular-nums text-slate-700">{fmt(e.total)}</td>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-[#1A0033] tabular-nums w-12">
                        {e.percentual.toFixed(1).replace(".", ",")}%
                      </span>
                      <div className="h-1.5 flex-1 max-w-[120px] rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-green-600"
                          style={{ width: `${Math.min(100, e.percentual)}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="py-3 text-right"><VariacaoBadge value={e.variacao} /></td>
                </tr>
              ))}
              <tr>
                <td className="pt-3 font-black text-[#1A0033]">Total Sudeste</td>
                <td className="pt-3 font-black text-[#1A0033] tabular-nums">
                  {fmt(estadosSudeste.reduce((s, e) => s + e.total, 0))}
                </td>
                <td className="pt-3 font-black text-[#1A0033]">100%</td>
                <td className="pt-3 text-right"><VariacaoBadge value={8.7} /></td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <footer className="flex flex-wrap items-center justify-center gap-4 text-sm text-slate-500 border-t border-slate-200 pt-4">
        <span className="inline-flex items-center gap-2">
          <RefreshCcw className="w-4 h-4" />
          Sincronizado automaticamente a cada 10 segundos
        </span>
        <span className="text-slate-300">|</span>
        <span>
          Última atualização: <LiveClock />
        </span>
        <span className="ml-auto">
          <button className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 bg-white text-[#6A0DAD] font-bold hover:bg-purple-50">
            <Download className="w-4 h-4" /> Exportar dados
          </button>
        </span>
      </footer>
    </div>
  );
}

function find(regioes: LiveRegiao[], nome: string): LiveRegiao {
  return regioes.find((r) => r.nome === nome) ?? regioes[0];
}

function ReferenceArtwork({ regioes, totalGeral }: { regioes: LiveRegiao[]; totalGeral: number }) {
  const norte = find(regioes, "Norte");
  const centro = find(regioes, "Centro-Oeste");
  const nordeste = find(regioes, "Nordeste");
  const sudeste = find(regioes, "Sudeste");
  const sul = find(regioes, "Sul");
  const outros = find(regioes, "Outros/Exterior");

  return (
    <section className="relative mx-auto w-full max-w-[1184px] aspect-[1184/650] min-h-[560px] overflow-hidden bg-white">
      <div className="absolute left-1/2 top-[1.2%] -translate-x-1/2 text-center">
        <h1 className="whitespace-nowrap text-[clamp(1.75rem,3vw,2.45rem)] font-black leading-tight text-[#06145E]">
          Distribuição por Região
        </h1>
        <p className="mt-1 text-[clamp(0.95rem,1.45vw,1.25rem)] font-medium text-[#3f4353]">
          Ativações SmartVoz por região
        </p>
      </div>

      <button
        type="button"
        className="absolute left-1/2 top-[12.7%] z-20 flex h-[44px] w-[220px] -translate-x-1/2 items-center justify-between rounded-lg border border-[#cdd3de] bg-white px-4 text-[1.15rem] font-medium text-black shadow-sm"
      >
        <span>Sudeste</span>
        <ChevronDown className="h-5 w-5" />
      </button>

      <svg className="pointer-events-none absolute inset-0 z-10 h-full w-full" viewBox="0 0 1184 650" preserveAspectRatio="none">
        <defs>
          <ArrowMarker id="arrow-norte" color={norte.cor} />
          <ArrowMarker id="arrow-centro" color={centro.cor} />
          <ArrowMarker id="arrow-nordeste" color={nordeste.cor} />
          <ArrowMarker id="arrow-sudeste" color={sudeste.cor} />
          <ArrowMarker id="arrow-sul" color="#8B572A" />
          <ArrowMarker id="arrow-outros" color={outros.cor} />
        </defs>
        <path d="M 205 146 H 425 V 210" stroke={norte.cor} strokeWidth="3" fill="none" markerEnd="url(#arrow-norte)" />
        <path d="M 212 335 H 318" stroke={centro.cor} strokeWidth="3" fill="none" markerEnd="url(#arrow-centro)" />
        <path d="M 212 520 H 410" stroke={nordeste.cor} strokeWidth="3" fill="none" markerEnd="url(#arrow-nordeste)" />
        <path d="M 928 144 H 708 V 180" stroke={sudeste.cor} strokeWidth="3" fill="none" markerEnd="url(#arrow-sudeste)" />
        <path d="M 928 334 H 824" stroke="#8B572A" strokeWidth="3" fill="none" markerEnd="url(#arrow-sul)" />
        <path d="M 928 518 H 790" stroke={outros.cor} strokeWidth="3" fill="none" markerEnd="url(#arrow-outros)" />
      </svg>

      <ReferenceLabel regiao={norte} className="left-[3.4%] top-[21.7%]" align="right" />
      <ReferenceLabel regiao={centro} className="left-[3.4%] top-[50.5%]" align="right" />
      <ReferenceLabel regiao={nordeste} className="left-[3.4%] top-[79%]" align="right" />
      <ReferenceLabel regiao={sudeste} className="right-[3.4%] top-[21.7%]" align="left" />
      <ReferenceLabel regiao={sul} className="right-[5.2%] top-[50.8%]" align="left" titleColor="#8B572A" />
      <ReferenceLabel regiao={outros} className="right-[3.4%] top-[79%]" align="left" displayName="Outros / Exterior" />

      <div className="absolute left-1/2 top-[20.3%] z-0 w-[52.5%] -translate-x-1/2">
        <Donut3DChart regioes={regioes as unknown as Regiao[]} innerRatio={0.5} />
      </div>

      <div className="absolute bottom-[1.7%] left-1/2 z-20 flex -translate-x-1/2 items-center gap-4 rounded-lg border border-[#d5dbe7] bg-white px-5 py-3 shadow-sm">
        <BarChart3 className="h-6 w-6 text-[#4f10e8]" />
        <span className="whitespace-nowrap text-[clamp(0.95rem,1.6vw,1.25rem)] font-medium text-[#555566]">Total de ativações</span>
        <CountUp value={totalGeral} format={fmt} className="text-[clamp(1.25rem,2.4vw,1.8rem)] font-black text-[#4f10e8] tabular-nums" />
      </div>
    </section>
  );
}

function ArrowMarker({ id, color }: { id: string; color: string }) {
  return (
    <marker id={id} markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto" markerUnits="strokeWidth">
      <path d="M 0 0 L 10 5 L 0 10 z" fill={color} />
    </marker>
  );
}

function ReferenceLabel({
  regiao,
  className,
  align,
  titleColor,
  displayName,
}: {
  regiao: LiveRegiao;
  className: string;
  align: "left" | "right";
  titleColor?: string;
  displayName?: string;
}) {
  const name = displayName ?? regiao.nome;
  const regionText = regiao.nome === "Outros/Exterior" ? "Outras\nregiões ou Exterior" : regiao.nome;
  return (
    <div className={`absolute z-20 w-[170px] ${align === "right" ? "text-right" : "text-left"} ${className}`}>
      <h2 className="text-[clamp(1rem,1.9vw,1.45rem)] font-black leading-none" style={{ color: titleColor ?? regiao.cor }}>
        {name}
      </h2>
      <p className="mt-2 whitespace-pre-line text-[clamp(0.72rem,1.18vw,1rem)] font-medium leading-[1.25] text-black">
        {`Total de ativações\nrealizadas na região\n${regionText} no período\nselecionado.`}
      </p>
    </div>
  );
}

const RegionLabel = memo(function RegionLabel({
  regiao,
  align,
  arrow,
}: {
  regiao: LiveRegiao;
  align: "left" | "right";
  arrow: "left" | "right";
}) {
  const rightAlign = align === "right";
  const arrowStyle: CSSProperties = {
    width: 0,
    height: 0,
    borderTop: "6px solid transparent",
    borderBottom: "6px solid transparent",
    ...(arrow === "right"
      ? { borderLeft: `10px solid ${regiao.cor}` }
      : { borderRight: `10px solid ${regiao.cor}` }),
  };
  return (
    <div className={`flex flex-col ${rightAlign ? "items-end text-right" : "items-start text-left"}`}>
      <div className={`flex items-center gap-2 ${rightAlign ? "flex-row" : "flex-row-reverse"}`}>
        <p className="font-black text-lg" style={{ color: regiao.cor }}>{regiao.nome}</p>
        <span aria-hidden style={arrowStyle} />
      </div>
      <p className="text-xs text-slate-500 max-w-[200px] leading-snug mt-1">
        Total de ativações realizadas na região {regiao.nome} no período selecionado.
      </p>
    </div>
  );
});

function KpiCard({
  icon,
  iconBg,
  title,
  value,
  subtitle,
  footer,
}: {
  icon: ReactNode;
  iconBg: string;
  title: string;
  value: ReactNode;
  subtitle: ReactNode;
  footer: ReactNode;
}) {
  return (
    <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-5 flex gap-4">
      <div className={`w-12 h-12 shrink-0 rounded-xl grid place-items-center ${iconBg}`}>{icon}</div>
      <div className="flex-1">
        <p className="text-sm text-slate-500 font-semibold">{title}</p>
        <div className="text-2xl font-black text-[#1A0033] mt-1">{value}</div>
        <p className="text-sm text-slate-500 mt-1">{subtitle}</p>
        <div className="mt-2">{footer}</div>
      </div>
    </div>
  );
}

function VariacaoBadge({ value }: { value: number }) {
  const positive = value >= 0;
  const Icon = positive ? TrendingUp : TrendingDown;
  const color = positive ? "text-green-600" : "text-red-600";
  return (
    <span className={`inline-flex items-center gap-1 font-bold ${color}`}>
      <Icon className="w-3.5 h-3.5" />
      {Math.abs(value).toFixed(1).replace(".", ",")}%
    </span>
  );
}