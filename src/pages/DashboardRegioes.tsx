import { useMemo, useState } from "react";
import { ChevronDown, Table2, X } from "lucide-react";
import CountUp from "@/components/CountUp";
import { useLiveRegioes, withPercent } from "@/hooks/useLiveRegioes";
import { useNow } from "@/hooks/useNow";
import { fmt, siglaDe, type Regiao } from "@/data/dados";

type Plano = "todos" | "gb50" | "gb80" | "gb100";

const PLANOS: { key: Plano; label: string }[] = [
  { key: "todos", label: "Todos" },
  { key: "gb50", label: "50GB" },
  { key: "gb80", label: "80GB" },
  { key: "gb100", label: "100GB" },
];

type Planos = { gb50: number; gb80: number; gb100: number };

function soma(p: Planos, plano: Plano) {
  return plano === "todos" ? p.gb50 + p.gb80 + p.gb100 : p[plano];
}

function totalRegiao(r: Regiao, plano: Plano) {
  return r.estados.reduce((s, e) => s + e.cidades.reduce((cs, c) => cs + soma(c, plano), 0), 0);
}

export default function DashboardRegioes() {
  const { regioes: regioesAll, lastUpdate } = useLiveRegioes(3000);
  const regioes = useMemo(
    () => withPercent(regioesAll.filter((r) => r.nome !== "Outros/Exterior")),
    [regioesAll],
  );

  const [plano, setPlano] = useState<Plano>("todos");
  const [expandida, setExpandida] = useState<string | null>(null);
  const [tabelaAberta, setTabelaAberta] = useState(false);
  const agora = useNow(1000);

  const totais = regioes.map((r) => ({ r, total: totalRegiao(r, plano) }));
  const geral = totais.reduce((s, t) => s + t.total, 0);
  const maior = Math.max(1, ...totais.map((t) => t.total));

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
        {/* Cabeçalho + filtro de plano */}
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Painel de Ativações</h1>
            <p className="text-sm text-slate-500">
              Monitoramento em tempo real por região e plano ·{" "}
              <span className="font-semibold text-slate-700 tabular-nums">{fmt(geral)}</span>{" "}
              ativações
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Filtrar plano:
            </span>
            <div className="flex rounded-lg border border-slate-200 bg-white p-1 shadow-sm">
              {PLANOS.map((p) => (
                <button
                  key={p.key}
                  type="button"
                  onClick={() => setPlano(p.key)}
                  className={`rounded-md px-4 py-1.5 text-sm font-medium transition ${
                    plano === p.key
                      ? "bg-[#6A0DAD] text-white"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setTabelaAberta(true)}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-[#6A0DAD] shadow-sm transition hover:bg-slate-50"
            >
              Ver tabela completa <Table2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Cards unificados por região */}
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
          {totais.map(({ r, total }) => {
            const aberta = expandida === r.nome;
            const share = geral ? (total / geral) * 100 : 0;
            return (
              <div
                key={r.nome}
                className="rounded-xl border-l-4 bg-white p-5 shadow-sm"
                style={{ borderLeftColor: r.cor }}
              >
                <div className="mb-4 flex items-start justify-between">
                  <div>
                    <span
                      className="text-xs font-bold uppercase tracking-wide"
                      style={{ color: r.cor }}
                    >
                      {r.nome}
                    </span>
                    <div className="text-3xl font-bold text-slate-800 tabular-nums">
                      <CountUp value={total} format={(n) => fmt(n)} />
                    </div>
                  </div>
                  <span className="text-xs font-medium text-emerald-600">+{r.hoje} hoje</span>
                </div>

                <div className="space-y-3">
                  <div>
                    <div className="mb-1 flex justify-between text-xs text-slate-600">
                      <span>Participação</span>
                      <span className="tabular-nums">
                        {share.toFixed(1).replace(".", ",")}%
                      </span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-slate-100">
                      <div
                        className="h-2 rounded-full transition-all duration-700"
                        style={{ width: `${(total / maior) * 100}%`, background: r.cor }}
                      />
                    </div>
                  </div>

                  <div className="border-t border-slate-100 pt-3">
                    <button
                      type="button"
                      onClick={() => setExpandida(aberta ? null : r.nome)}
                      className="flex w-full items-center justify-between text-[11px] font-semibold text-slate-500 transition hover:text-[#6A0DAD]"
                    >
                      {aberta ? "Ocultar estados" : "Ver estados e cidades"}
                      <ChevronDown
                        className={`h-3.5 w-3.5 transition ${aberta ? "rotate-180" : ""}`}
                      />
                    </button>

                    {!aberta && (
                      <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[11px] font-medium text-slate-500 tabular-nums">
                        {r.estados.slice(0, 3).map((e) => (
                          <span key={e.nome}>
                            {siglaDe(e.nome)}:{" "}
                            {fmt(e.cidades.reduce((s, c) => s + soma(c, plano), 0))}
                          </span>
                        ))}
                      </div>
                    )}

                    {aberta && (
                      <div className="mt-3 space-y-3">
                        {r.estados.map((e) => (
                          <div key={e.nome}>
                            <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                              <span>
                                {e.nome} <span className="text-slate-400">({siglaDe(e.nome)})</span>
                              </span>
                              <span className="tabular-nums">
                                {fmt(e.cidades.reduce((s, c) => s + soma(c, plano), 0))}
                              </span>
                            </div>
                            <ul className="mt-1 space-y-1">
                              {e.cidades.map((c) => (
                                <li
                                  key={c.nome}
                                  className="flex items-center justify-between text-[11px] text-slate-500"
                                >
                                  <span>{c.nome}</span>
                                  <span className="tabular-nums">{fmt(soma(c, plano))}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Últimas ativações */}
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
            <h2 className="flex items-center gap-2 text-sm font-bold text-slate-800">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
              Últimas ativações
            </h2>
            <span
              suppressHydrationWarning
              className="text-[10px] uppercase tracking-tight text-slate-400 tabular-nums"
            >
              {agora.toLocaleTimeString("pt-BR", { hour12: false })}
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] border-collapse text-left">
              <thead>
                <tr className="bg-slate-50/60">
                  <th className="px-6 py-3 text-[11px] font-semibold uppercase text-slate-500">
                    Horário
                  </th>
                  <th className="px-6 py-3 text-[11px] font-semibold uppercase text-slate-500">
                    Região / UF
                  </th>
                  <th className="px-6 py-3 text-[11px] font-semibold uppercase text-slate-500">
                    Plano
                  </th>
                  <th className="px-6 py-3 text-right text-[11px] font-semibold uppercase text-slate-500">
                    Total
                  </th>
                  <th className="px-6 py-3 text-[11px] font-semibold uppercase text-slate-500">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {totais.map(({ r, total }, i) => {
                  const isLast = lastUpdate?.regiao === r.nome;
                  return (
                    <tr key={r.nome} className={isLast ? "bg-emerald-50/40" : undefined}>
                      <td className="px-6 py-3 font-mono text-sm text-slate-500">
                        {isLast ? "agora" : `há ${(i + 1) * 3}s`}
                      </td>
                      <td className="px-6 py-3 text-sm text-slate-700">
                        <span className="flex items-center gap-2 font-medium">
                          <span
                            className="inline-block h-2 w-2 rounded-full"
                            style={{ background: r.cor }}
                          />
                          {r.nome} ({siglaDe(r.estados[0]?.nome ?? "")})
                        </span>
                      </td>
                      <td className="px-6 py-3">
                        <span className="rounded bg-purple-50 px-2 py-0.5 text-xs font-bold text-[#6A0DAD]">
                          {plano === "todos" ? "Todos" : PLANOS.find((p) => p.key === plano)?.label}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-right text-sm font-bold text-slate-800 tabular-nums">
                        <CountUp value={total} format={(n) => fmt(n)} />
                      </td>
                      <td className="px-6 py-3 text-xs font-bold uppercase tracking-tight text-emerald-600">
                        {isLast ? "Nova ativação" : "Ativo"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <p className="mt-5 text-center text-xs text-slate-400">
          Atualização automática a cada 3 segundos ·{" "}
          <span suppressHydrationWarning className="tabular-nums">
            {agora.toLocaleDateString("pt-BR")}{" "}
            {agora.toLocaleTimeString("pt-BR", { hour12: false })}
          </span>
        </p>
      </main>

      {tabelaAberta && (
        <TabelaCompleta
          regioes={regioes}
          plano={plano}
          onClose={() => setTabelaAberta(false)}
        />
      )}
    </div>
  );
}

function TabelaCompleta({
  regioes,
  plano,
  onClose,
}: {
  regioes: Regiao[];
  plano: Plano;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4"
      onClick={onClose}
    >
      <div
        className="flex max-h-[88vh] w-full max-w-4xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">Região · Estado · Cidade</h2>
            <p className="text-xs text-slate-500">
              Plano: {plano === "todos" ? "todos" : PLANOS.find((p) => p.key === plano)?.label}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 hover:bg-slate-100"
            aria-label="Fechar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="overflow-auto px-6 py-4">
          <table className="w-full text-left text-sm">
            <thead className="sticky top-0 bg-white">
              <tr className="border-b border-slate-100 text-[11px] font-semibold uppercase text-slate-500">
                <th className="py-2">Região</th>
                <th className="py-2">Estado</th>
                <th className="py-2">Cidade</th>
                <th className="py-2 text-right">50GB</th>
                <th className="py-2 text-right">80GB</th>
                <th className="py-2 text-right">100GB</th>
                <th className="py-2 pr-1 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {regioes.flatMap((r) =>
                r.estados.flatMap((e) =>
                  e.cidades.map((c) => (
                    <tr key={`${r.nome}-${e.nome}-${c.nome}`}>
                      <td className="py-2 font-medium" style={{ color: r.cor }}>
                        {r.nome}
                      </td>
                      <td className="py-2 text-slate-700">{e.nome}</td>
                      <td className="py-2 text-slate-700">{c.nome}</td>
                      <td className="py-2 text-right tabular-nums text-slate-500">{fmt(c.gb50)}</td>
                      <td className="py-2 text-right tabular-nums text-slate-500">{fmt(c.gb80)}</td>
                      <td className="py-2 text-right tabular-nums text-slate-500">{fmt(c.gb100)}</td>
                      <td className="py-2 pr-1 text-right font-bold tabular-nums text-slate-800">
                        {fmt(c.gb50 + c.gb80 + c.gb100)}
                      </td>
                    </tr>
                  )),
                ),
              )}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/60 px-6 py-3 text-xs text-slate-500">
          <span className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500" /> Atualizando a cada 3s
          </span>
          <button
            onClick={onClose}
            className="rounded-lg bg-[#6A0DAD] px-4 py-2 text-xs font-bold text-white"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
