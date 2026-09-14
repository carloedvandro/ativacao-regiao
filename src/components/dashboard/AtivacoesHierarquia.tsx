import { useMemo, useState } from "react";
import { ChevronRight, Home } from "lucide-react";
import { fmt, siglaDe, type Regiao } from "@/data/dados";

type Plano = "todos" | "gb100" | "gb120";

const PLANOS: { key: Plano; label: string }[] = [
  { key: "todos", label: "Todos" },
  { key: "gb100", label: "100GB" },
  { key: "gb120", label: "120GB" },
];

type Planos = { gb100: number; gb120: number };

function soma(p: Planos, plano: Plano) {
  return plano === "todos" ? p.gb100 + p.gb120 : p[plano];
}

function agregaPlanos(lista: Planos[]): Planos {
  return lista.reduce(
    (acc, c) => ({
      gb100: acc.gb100 + c.gb100,
      gb120: acc.gb120 + c.gb120,
      ZZDROP: acc.ZZDROP,
    }),
    { gb100: 0, gb120: 0 },
  );
}

type Item = {
  id: string;
  label: string;
  sub?: string;
  planos: Planos;
  drill?: boolean;
};

export default function AtivacoesHierarquia({ regioes }: { regioes: Regiao[] }) {
  const [regiao, setRegiao] = useState<string | null>(null);
  const [estado, setEstado] = useState<string | null>(null);
  const [plano, setPlano] = useState<Plano>("todos");

  const regiaoAtual = regiao ? regioes.find((r) => r.nome === regiao) ?? null : null;
  const estadoAtual =
    regiaoAtual && estado ? regiaoAtual.estados.find((e) => e.nome === estado) ?? null : null;

  const nivel: "regiao" | "estado" | "cidade" = estadoAtual
    ? "cidade"
    : regiaoAtual
      ? "estado"
      : "regiao";

  const items: Item[] = useMemo(() => {
    if (estadoAtual) {
      return estadoAtual.cidades.map((c) => ({
        id: c.nome,
        label: c.nome,
        sub: siglaDe(estadoAtual.nome),
        planos: c,
      }));
    }
    if (regiaoAtual) {
      return regiaoAtual.estados.map((e) => ({
        id: e.nome,
        label: siglaDe(e.nome),
        sub: e.nome,
        planos: agregaPlanos(e.cidades),
        drill: true,
      }));
    }
    return regioes.map((r) => ({
      id: r.nome,
      label: r.nome,
      sub: `${r.estados.length} estados`,
      planos: agregaPlanos(r.estados.flatMap((e) => e.cidades)),
      drill: true,
    }));
  }, [regioes, regiaoAtual, estadoAtual]);

  const ordenados = useMemo(
    () => [...items].sort((a, b) => soma(b.planos, plano) - soma(a.planos, plano)),
    [items, plano],
  );
  const max = Math.max(1, ...ordenados.map((i) => soma(i.planos, plano)));
  const totalNivel = ordenados.reduce((s, i) => s + soma(i.planos, plano), 0);

  const titulo = estadoAtual
    ? `Ativações por Cidade — ${estadoAtual.nome}`
    : regiaoAtual
      ? `Ativações por Estado — ${regiaoAtual.nome}`
      : "Ativações por Região";

  return (
    <section className="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-[0_2px_8px_rgba(0,0,0,0.04)] sm:p-7">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="truncate text-xl font-black text-[#140044] sm:text-2xl">{titulo}</h2>
          {/* Breadcrumb */}
          <nav className="mt-2 flex flex-wrap items-center gap-1 text-xs font-bold text-[#6b7280]">
            <button
              type="button"
              onClick={() => {
                setRegiao(null);
                setEstado(null);
              }}
              className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[#6A0DAD] transition hover:bg-[#6A0DAD]/8"
            >
              <Home className="h-3.5 w-3.5" /> Regiões
            </button>
            {regiaoAtual && (
              <>
                <ChevronRight className="h-3.5 w-3.5" />
                <button
                  type="button"
                  onClick={() => setEstado(null)}
                  className="rounded-md px-1.5 py-0.5 text-[#6A0DAD] transition hover:bg-[#6A0DAD]/8"
                >
                  {regiaoAtual.nome}
                </button>
              </>
            )}
            {estadoAtual && (
              <>
                <ChevronRight className="h-3.5 w-3.5" />
                <span className="px-1.5 py-0.5 text-[#140044]">{estadoAtual.nome}</span>
              </>
            )}
          </nav>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            {PLANOS.map((p) => (
              <button
                key={p.key}
                type="button"
                onClick={() => setPlano(p.key)}
                className={`h-10 px-3 text-xs font-black transition ${
                  plano === p.key
                    ? "bg-[#6A0DAD] text-white"
                    : "text-[#6A0DAD] hover:bg-[#6A0DAD]/6"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 space-y-2.5">
        {ordenados.map((item, i) => {
          const valor = soma(item.planos, plano);
          const pct = (valor / max) * 100;
          const share = totalNivel ? (valor / totalNivel) * 100 : 0;
          const dark = 78 - (i / Math.max(1, ordenados.length - 1)) * 40; // gradiente escuro→claro
          return (
            <div key={item.id} className="flex items-center gap-3">
              <div className="relative min-w-0 flex-1">
                <button
                  type="button"
                  disabled={!item.drill}
                  onClick={() => {
                    if (!item.drill) return;
                    if (nivel === "regiao") setRegiao(item.id);
                    else setEstado(item.id);
                  }}
                  title={item.sub}
                  className={`group relative flex h-10 items-center overflow-hidden rounded-lg text-left transition-all duration-500 ${
                    item.drill ? "cursor-pointer hover:brightness-110" : "cursor-default"
                  }`}
                  style={{
                    width: `${Math.max(12, pct)}%`,
                    background: `linear-gradient(90deg, hsl(283 72% ${dark - 22}%), hsl(283 74% ${dark - 46}%))`,
                    boxShadow: "0 2px 6px rgba(20,0,68,.18), inset 0 1px 0 rgba(255,255,255,.25)",
                  }}
                >
                  <span className="truncate px-3 text-[13px] font-black text-white drop-shadow-sm">
                    {item.label}
                  </span>
                </button>
              </div>
              <div className="flex shrink-0 items-baseline gap-2 tabular-nums">
                <span className="text-sm font-black text-[#140044]">{fmt(valor)}</span>
                <span className="text-[11px] font-bold text-[#8b86a0]">
                  {share.toFixed(1).replace(".", ",")}%
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quebra por plano do nível atual */}
      <div className="mt-6 grid grid-cols-3 gap-3 border-t border-gray-100 pt-5">
        {(["gb100", "gb120", "ZZDROP"] as const).map((p) => {
          const v = ordenados.reduce((s, i) => s + i.planos[p], 0);
          return (
            <div key={p} className="rounded-xl border border-gray-200/80 bg-gray-50/50 p-3">
              <p className="text-[10px] font-black uppercase tracking-widest text-[#8b86a0]">
                Plano {p.replace("gb", "")}GB
              </p>
              <p className="mt-1 text-lg font-black tabular-nums text-[#140044]">{fmt(v)}</p>
            </div>
          );
        })}
      </div>

      <p className="mt-4 text-center text-xs text-[#6b7280]">
        {nivel === "cidade"
          ? "Cidades do estado selecionado · valores em tempo real"
          : "Clique em uma barra para abrir o nível seguinte (região → estado → cidade)"}
      </p>
    </section>
  );
}
