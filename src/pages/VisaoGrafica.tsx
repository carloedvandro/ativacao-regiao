import { useMemo, useState } from "react";
import { Activity, ArrowRight, BarChart3, Building2, Map, MapPin } from "lucide-react";
import { Link } from "@tanstack/react-router";
import CountUp from "@/components/CountUp";
import { Button } from "@/components/ui/button";
import { fmt, siglaDe } from "@/data/dados";
import { useLiveRegioes, withPercent } from "@/hooks/useLiveRegioes";

type Plano = "todos" | "gb100" | "gb120";
type Nivel = "regioes" | "estados" | "cidades";

const PLANOS: { key: Plano; label: string }[] = [
  { key: "todos", label: "Todos" },
  { key: "gb100", label: "100GB" },
  { key: "gb120", label: "120GB" },
];

const NIVEIS: { key: Nivel; label: string; icon: typeof Map }[] = [
  { key: "regioes", label: "Regiões", icon: Map },
  { key: "estados", label: "Estados", icon: MapPin },
  { key: "cidades", label: "Cidades", icon: Building2 },
];

function valorPlano(item: { gb100: number; gb120: number }, plano: Plano) {
  return plano === "todos" ? item.gb100 + item.gb120 : item[plano];
}

export default function VisaoGrafica() {
  const { regioes: regioesAoVivo, lastUpdate } = useLiveRegioes(3000);
  const regioes = useMemo(() => withPercent(regioesAoVivo), [regioesAoVivo]);
  const [plano, setPlano] = useState<Plano>("todos");
  const [nivel, setNivel] = useState<Nivel>("estados");
  const [selecionado, setSelecionado] = useState<string | null>(null);

  const linhas = useMemo(() => {
    if (nivel === "regioes") {
      return regioes
        .map((regiao) => {
          const gb100 = regiao.estados.reduce(
            (total, estado) => total + estado.cidades.reduce((soma, cidade) => soma + cidade.gb100, 0),
            0,
          );
          const gb120 = regiao.estados.reduce(
            (total, estado) => total + estado.cidades.reduce((soma, cidade) => soma + cidade.gb120, 0),
            0,
          );
          return { nome: regiao.nome, sigla: regiao.nome.slice(0, 2), regiao: regiao.nome, cor: regiao.cor, gb100, gb120, total: valorPlano({ gb100, gb120 }, plano) };
        })
        .sort((a, b) => b.total - a.total);
    }

    if (nivel === "cidades") {
      return regioes
        .flatMap((regiao) =>
          regiao.estados.flatMap((estado) =>
            estado.cidades.map((cidade) => ({
              nome: cidade.nome,
              sigla: siglaDe(estado.nome),
              regiao: regiao.nome,
              cor: regiao.cor,
              gb100: cidade.gb100,
              gb120: cidade.gb120,
              total: valorPlano(cidade, plano),
            })),
          ),
        )
        .sort((a, b) => b.total - a.total);
    }

    return regioes
      .flatMap((regiao) =>
        regiao.estados.map((estado) => {
          const gb100 = estado.cidades.reduce((soma, cidade) => soma + cidade.gb100, 0);
          const gb120 = estado.cidades.reduce((soma, cidade) => soma + cidade.gb120, 0);
          return { nome: estado.nome, sigla: siglaDe(estado.nome), regiao: regiao.nome, cor: regiao.cor, gb100, gb120, total: valorPlano({ gb100, gb120 }, plano) };
        }),
      )
      .sort((a, b) => b.total - a.total);
  }, [nivel, plano, regioes]);

  const total = linhas.reduce((soma, linha) => soma + linha.total, 0);
  const maximo = Math.max(1, ...linhas.map((linha) => linha.total));
  const linhaSelecionada = linhas.find((linha) => linha.nome === selecionado) ?? linhas[0];
  const totalRegioes = regioes.reduce((soma, regiao) => soma + regiao.total, 0);
  let acumulado = 0;

  return (
    <div className="min-h-screen bg-muted/40 text-foreground">
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
        <div className="mx-auto grid w-full max-w-[1920px] grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-3 py-3 sm:px-5 lg:px-7">
          <div className="flex min-w-0 items-center gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-primary text-primary-foreground shadow-sm">
              <BarChart3 className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <h1 className="truncate text-lg font-bold sm:text-xl">Visão gráfica de ativações</h1>
              <p className="hidden text-xs text-muted-foreground sm:block">Regiões, estados e cidades em tempo real</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden items-center gap-2 rounded-full border border-live/20 bg-live-soft px-3 py-1.5 text-xs font-semibold text-live sm:flex">
              <span className="relative flex h-2 w-2">
                <span className="absolute h-full w-full animate-ping rounded-full bg-live opacity-50" />
                <span className="relative h-2 w-2 rounded-full bg-live" />
              </span>
              Tempo real
            </span>
            <Button asChild variant="outline" className="h-10 rounded-lg border-border bg-background text-primary">
              <Link to="/painel">
                Produção em tempo real <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[1920px] px-3 py-5 sm:px-5 lg:px-7">
        <div className="mb-5 grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <div>
            <p className="text-xs font-semibold text-primary">Distribuição geográfica</p>
            <h2 className="mt-1 text-2xl font-bold sm:text-3xl">Ativações por {nivel === "regioes" ? "região" : nivel === "estados" ? "estado" : "cidade"}</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              <CountUp value={total} format={fmt} className="font-semibold text-foreground" /> ativações no período atual
            </p>
          </div>

          <div className="grid gap-2 sm:flex sm:items-center">
            <div className="grid grid-cols-3 rounded-lg border bg-background p-1 shadow-sm">
              {NIVEIS.map((item) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.key}
                    type="button"
                    variant={nivel === item.key ? "default" : "ghost"}
                    size="sm"
                    onClick={() => {
                      setNivel(item.key);
                      setSelecionado(null);
                    }}
                    className="h-9 rounded-md px-3"
                  >
                    <Icon className="h-4 w-4" /> {item.label}
                  </Button>
                );
              })}
            </div>
            <div className="grid grid-cols-3 rounded-lg border bg-background p-1 shadow-sm">
              {PLANOS.map((item) => (
                <Button
                  key={item.key}
                  type="button"
                  variant={plano === item.key ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setPlano(item.key)}
                  className="h-9 rounded-md px-3"
                >
                  {item.label}
                </Button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1.55fr)_minmax(360px,0.75fr)]">
          <section className="min-w-0 rounded-lg border bg-card p-4 shadow-sm sm:p-6">
            <div className="mb-5 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
              <div className="min-w-0">
                <h3 className="truncate font-semibold">Ranking de {nivel}</h3>
                <p className="text-xs text-muted-foreground">Selecione uma barra para conferir os planos</p>
              </div>
              {nivel === "cidades" && (
                <Button asChild variant="ghost" size="sm" className="text-primary">
                  <Link to="/cidades">Ver lista completa <ArrowRight /></Link>
                </Button>
              )}
            </div>

            <div className="max-h-[590px] space-y-2.5 overflow-y-auto pr-1 no-scrollbar">
              {linhas.map((linha, indice) => {
                const ativa = linhaSelecionada?.nome === linha.nome;
                return (
                  <button
                    key={`${linha.regiao}-${linha.nome}`}
                    type="button"
                    onClick={() => setSelecionado(linha.nome)}
                    className={`group grid w-full grid-cols-[38px_minmax(0,1fr)_auto] items-center gap-3 rounded-md px-2 py-1.5 text-left transition ${ativa ? "bg-primary-soft" : "hover:bg-muted"}`}
                  >
                    <span className="text-xs font-bold text-muted-foreground">{linha.sigla}</span>
                    <span className="min-w-0">
                      <span className="mb-1.5 flex min-w-0 items-center justify-between gap-3">
                        <span className="truncate text-xs font-medium text-foreground">{linha.nome}</span>
                        <span className="text-[11px] text-muted-foreground">{linha.regiao}</span>
                      </span>
                      <span className="block h-2 overflow-hidden rounded-full bg-muted">
                        <span
                          className="block h-full rounded-full transition-all duration-700"
                          style={{ width: `${Math.max(2, (linha.total / maximo) * 100)}%`, backgroundColor: nivel === "regioes" ? linha.cor : "var(--primary)" }}
                        />
                      </span>
                    </span>
                    <span className="w-16 text-right text-sm font-bold tabular-nums">{fmt(linha.total)}</span>
                  </button>
                );
              })}
            </div>
          </section>

          <div className="grid gap-5">
            <section className="rounded-lg border bg-card p-5 shadow-sm">
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
                <div className="min-w-0">
                  <h3 className="truncate font-semibold">Distribuição por região</h3>
                  <p className="text-xs text-muted-foreground">Participação no total de ativações</p>
                </div>
                <Activity className="h-5 w-5 text-primary" />
              </div>
              <div className="mt-5 grid items-center gap-5 sm:grid-cols-[190px_minmax(0,1fr)] xl:grid-cols-1 2xl:grid-cols-[190px_minmax(0,1fr)]">
                <div className="relative mx-auto h-44 w-44">
                  <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90" aria-label="Distribuição das ativações por região">
                    <circle cx="60" cy="60" r="43" fill="none" stroke="var(--muted)" strokeWidth="15" />
                    {regioes.map((regiao) => {
                      const parte = (regiao.total / totalRegioes) * 270;
                      const offset = acumulado;
                      acumulado += parte;
                      return (
                        <circle
                          key={regiao.nome}
                          cx="60"
                          cy="60"
                          r="43"
                          fill="none"
                          stroke={regiao.cor}
                          strokeWidth="15"
                          strokeDasharray={`${parte} ${270 - parte}`}
                          strokeDashoffset={-offset}
                        />
                      );
                    })}
                  </svg>
                  <div className="absolute inset-0 grid place-content-center text-center">
                    <strong className="text-2xl tabular-nums">{fmt(totalRegioes)}</strong>
                    <span className="text-[10px] text-muted-foreground">Ativações</span>
                  </div>
                </div>
                <ul className="space-y-2.5">
                  {regioes.map((regiao) => (
                    <li key={regiao.nome} className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2 text-xs">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: regiao.cor }} />
                      <span className="truncate text-muted-foreground">{regiao.nome}</span>
                      <strong className="tabular-nums">{regiao.percentual.toFixed(1).replace(".", ",")}%</strong>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {linhaSelecionada && (
              <section className="rounded-lg border bg-card p-5 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-primary">Detalhamento</p>
                    <h3 className="mt-1 truncate text-lg font-bold">{linhaSelecionada.nome}</h3>
                    <p className="text-xs text-muted-foreground">{linhaSelecionada.regiao}</p>
                  </div>
                  <strong className="text-xl tabular-nums">{fmt(linhaSelecionada.total)}</strong>
                </div>
                <div className="mt-4 grid grid-cols-2 divide-x rounded-md border bg-muted/40 py-3 text-center">
                  <div>
                    <p className="text-xs text-muted-foreground">100GB</p>
                    <p className="mt-1 font-bold tabular-nums">{fmt(linhaSelecionada.gb100)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">120GB</p>
                    <p className="mt-1 font-bold tabular-nums">{fmt(linhaSelecionada.gb120)}</p>
                  </div>
                </div>
                <p className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                  <span className={`h-2 w-2 rounded-full ${lastUpdate?.regiao === linhaSelecionada.regiao ? "animate-pulse bg-live" : "bg-muted-foreground/40"}`} />
                  Dados atualizados automaticamente a cada 3 segundos
                </p>
              </section>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}