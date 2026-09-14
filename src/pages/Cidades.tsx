import { useMemo, useState } from "react";
import { ArrowLeft, Search } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useLiveRegioes, withPercent } from "@/hooks/useLiveRegioes";
import { fmt, siglaDe } from "@/data/dados";

type Plano = "todos" | "gb50" | "gb80" | "gb100";

const PLANOS: { key: Plano; label: string }[] = [
  { key: "todos", label: "Todos" },
  { key: "gb50", label: "50GB" },
  { key: "gb80", label: "80GB" },
  { key: "gb100", label: "100GB" },
];

type Linha = {
  cidade: string;
  estado: string;
  regiao: string;
  cor: string;
  gb50: number;
  gb80: number;
  gb100: number;
  total: number;
};

export default function Cidades() {
  const { regioes: regioesAll } = useLiveRegioes(3000);
  const regioes = useMemo(
    () => withPercent(regioesAll.filter((r) => r.nome !== "Outros/Exterior")),
    [regioesAll],
  );

  const [regiao, setRegiao] = useState<string>("todas");
  const [estado, setEstado] = useState<string>("todos");
  const [plano, setPlano] = useState<Plano>("todos");
  const [busca, setBusca] = useState("");

  const estadosDisponiveis = useMemo(() => {
    const base = regiao === "todas" ? regioes : regioes.filter((r) => r.nome === regiao);
    return base.flatMap((r) => r.estados.map((e) => e.nome));
  }, [regioes, regiao]);

  const linhas = useMemo<Linha[]>(() => {
    const out: Linha[] = [];
    for (const r of regioes) {
      if (regiao !== "todas" && r.nome !== regiao) continue;
      for (const e of r.estados) {
        if (estado !== "todos" && e.nome !== estado) continue;
        for (const c of e.cidades) {
          const total = plano === "todos" ? c.gb50 + c.gb80 + c.gb100 : c[plano];
          if (busca && !c.nome.toLowerCase().includes(busca.toLowerCase())) continue;
          out.push({
            cidade: c.nome,
            estado: e.nome,
            regiao: r.nome,
            cor: r.cor,
            gb50: c.gb50,
            gb80: c.gb80,
            gb100: c.gb100,
            total,
          });
        }
      }
    }
    return out.sort((a, b) => b.total - a.total);
  }, [regioes, regiao, estado, plano, busca]);

  const geral = linhas.reduce((s, l) => s + l.total, 0);
  const maior = Math.max(1, ...linhas.map((l) => l.total));

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
        <Link
          to="/"
          className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-[#6A0DAD] transition hover:opacity-80"
        >
          <ArrowLeft className="h-4 w-4" /> Voltar ao painel
        </Link>

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">Ativações por cidade</h1>
          <p className="text-sm text-slate-500">
            {linhas.length} cidade{linhas.length === 1 ? "" : "s"} ·{" "}
            <span className="font-semibold text-slate-700 tabular-nums">{fmt(geral)}</span> ativações
          </p>
        </div>

        {/* Filtros */}
        <div className="mb-6 grid grid-cols-1 gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:grid-cols-2 lg:grid-cols-4">
          <label className="block">
            <span className="mb-1 block text-xs font-semibold text-slate-500">Região</span>
            <select
              value={regiao}
              onChange={(ev) => {
                setRegiao(ev.target.value);
                setEstado("todos");
              }}
              className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700"
            >
              <option value="todas">Todas as regiões</option>
              {regioes.map((r) => (
                <option key={r.nome} value={r.nome}>
                  {r.nome}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-1 block text-xs font-semibold text-slate-500">Estado</span>
            <select
              value={estado}
              onChange={(ev) => setEstado(ev.target.value)}
              className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700"
            >
              <option value="todos">Todos os estados</option>
              {estadosDisponiveis.map((e) => (
                <option key={e} value={e}>
                  {e} ({siglaDe(e)})
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-1 block text-xs font-semibold text-slate-500">Plano</span>
            <select
              value={plano}
              onChange={(ev) => setPlano(ev.target.value as Plano)}
              className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700"
            >
              {PLANOS.map((p) => (
                <option key={p.key} value={p.key}>
                  {p.label}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-1 block text-xs font-semibold text-slate-500">Buscar cidade</span>
            <span className="relative block">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={busca}
                onChange={(ev) => setBusca(ev.target.value)}
                placeholder="Nome da cidade"
                className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-sm text-slate-700"
              />
            </span>
          </label>
        </div>

        {/* Lista de cidades */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          {linhas.length === 0 ? (
            <p className="py-8 text-center text-sm text-slate-400">
              Nenhuma cidade encontrada com esses filtros.
            </p>
          ) : (
            <ul className="space-y-4">
              {linhas.map((l) => (
                <li key={`${l.regiao}-${l.estado}-${l.cidade}`}>
                  <div className="mb-1 flex items-baseline justify-between gap-3">
                    <span className="truncate text-sm font-semibold text-slate-800">
                      {l.cidade}{" "}
                      <span className="text-xs font-medium text-slate-400">
                        {siglaDe(l.estado)} · {l.regiao}
                      </span>
                    </span>
                    <span className="text-sm font-bold text-slate-800 tabular-nums">
                      {fmt(l.total)}
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-100">
                    <div
                      className="h-2 rounded-full transition-all duration-700"
                      style={{ width: `${(l.total / maior) * 100}%`, background: l.cor }}
                    />
                  </div>
                  {plano === "todos" && (
                    <div className="mt-1 flex gap-4 text-[11px] text-slate-500 tabular-nums">
                      <span>50GB: {fmt(l.gb50)}</span>
                      <span>80GB: {fmt(l.gb80)}</span>
                      <span>100GB: {fmt(l.gb100)}</span>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
}
