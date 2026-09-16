import { useMemo, useState } from "react";
import { ArrowLeft, Search } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { useLiveRegioes, withPercent } from "@/hooks/useLiveRegioes";
import { fmt, siglaDe } from "@/data/dados";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Plano = "todos" | "gb100" | "gb120";

const PLANOS: { key: Plano; label: string }[] = [
  { key: "todos", label: "Todos" },
  { key: "gb100", label: "100GB" },
  { key: "gb120", label: "120GB" },
];

type Linha = {
  cidade: string;
  estado: string;
  regiao: string;
  cor: string;
  gb100: number;
  gb120: number;
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
          const total = plano === "todos" ? c.gb100 + c.gb120 : c[plano];
          if (busca && !c.nome.toLowerCase().includes(busca.toLowerCase())) continue;
          out.push({
            cidade: c.nome,
            estado: e.nome,
            regiao: r.nome,
            cor: r.cor,
            gb100: c.gb100,
            gb120: c.gb120,
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
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white shadow-sm">
        <div className="mx-auto grid w-full max-w-[1920px] grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-2 py-4 sm:px-4 lg:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <Button asChild variant="ghost" size="icon" className="shrink-0 rounded-full text-slate-500" title="Voltar ao Espectro Mágico">
              <Link to="/" aria-label="Voltar ao Espectro Mágico">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div className="min-w-0">
              <h1 className="truncate text-xl font-bold text-slate-900">Ativações por cidade</h1>
              <p className="truncate text-sm text-slate-500">
                {linhas.length} cidade{linhas.length === 1 ? "" : "s"} ·{" "}
                <span className="font-semibold text-slate-700 tabular-nums">{fmt(geral)}</span> ativações
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            <span className="hidden text-[11px] font-bold text-emerald-700 sm:inline">Tempo real</span>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[1920px] px-2 py-6 sm:px-4 lg:px-6">

        {/* Filtros */}
        <div className="mb-6 grid grid-cols-1 gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:grid-cols-2 lg:grid-cols-4">
          <label className="block">
            <span className="mb-1 block text-xs font-semibold text-slate-500">Região</span>
            <Select
              value={regiao}
              onValueChange={(value) => {
                setRegiao(value);
                setEstado("todos");
              }}
            >
              <SelectTrigger className="h-10 rounded-xl border-slate-200 bg-white px-3 text-sm text-slate-700">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="max-h-72">
                <SelectItem value="todas">Todas as regiões</SelectItem>
                {regioes.map((r) => (
                  <SelectItem key={r.nome} value={r.nome}>{r.nome}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </label>

          <label className="block">
            <span className="mb-1 block text-xs font-semibold text-slate-500">Estado</span>
            <Select
              value={estado}
              onValueChange={setEstado}
            >
              <SelectTrigger className="h-10 rounded-xl border-slate-200 bg-white px-3 text-sm text-slate-700">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="max-h-72">
                <SelectItem value="todos">Todos os estados</SelectItem>
                {estadosDisponiveis.map((e) => (
                  <SelectItem key={e} value={e}>{e} ({siglaDe(e)})</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </label>

          <label className="block">
            <span className="mb-1 block text-xs font-semibold text-slate-500">Plano</span>
            <Select
              value={plano}
              onValueChange={(value) => setPlano(value as Plano)}
            >
              <SelectTrigger className="h-10 rounded-xl border-slate-200 bg-white px-3 text-sm text-slate-700">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PLANOS.map((p) => (
                  <SelectItem key={p.key} value={p.key}>{p.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
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
                <li key={`${l.regiao}-${l.estado}-${l.cidade}`} className="rounded-md px-2 py-1 transition-colors hover:bg-slate-50">
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
                      <span>100GB: {fmt(l.gb100)}</span>
                      <span>120GB: {fmt(l.gb120)}</span>
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
