import { useMemo, useState } from "react";
import { ArrowRight, BarChart3, Building2, Map, MapPin } from "lucide-react";
import { Link } from "@tanstack/react-router";
import CountUp from "@/components/CountUp";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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

function pontoPolar(cx: number, cy: number, raioX: number, raioY: number, angulo: number) {
  const radianos = ((angulo - 90) * Math.PI) / 180;
  return {
    x: Number((cx + raioX * Math.cos(radianos)).toFixed(3)),
    y: Number((cy + raioY * Math.sin(radianos)).toFixed(3)),
  };
}

function arcoRosca(inicio: number, fim: number, centroY = 91) {
  const centroX = 130;
  const raioExternoX = 94;
  const raioExternoY = 61;
  const raioInternoX = 49;
  const raioInternoY = 32;
  const arcoMaior = fim - inicio > 180 ? 1 : 0;
  const inicioEstavel = Number(inicio.toFixed(4));
  const fimEstavel = Number(fim.toFixed(4));
  const externoInicioEstavel = pontoPolar(centroX, centroY, raioExternoX, raioExternoY, inicioEstavel);
  const externoFimEstavel = pontoPolar(centroX, centroY, raioExternoX, raioExternoY, fimEstavel);
  const internoFimEstavel = pontoPolar(centroX, centroY, raioInternoX, raioInternoY, fimEstavel);
  const internoInicioEstavel = pontoPolar(centroX, centroY, raioInternoX, raioInternoY, inicioEstavel);
  return [
    `M ${externoInicioEstavel.x} ${externoInicioEstavel.y}`,
    `A ${raioExternoX} ${raioExternoY} 0 ${arcoMaior} 1 ${externoFimEstavel.x} ${externoFimEstavel.y}`,
    `L ${internoFimEstavel.x} ${internoFimEstavel.y}`,
    `A ${raioInternoX} ${raioInternoY} 0 ${arcoMaior} 0 ${internoInicioEstavel.x} ${internoInicioEstavel.y}`,
    "Z",
  ].join(" ");
}

function arcoRoscaPadrao(inicio: number, fim: number) {
  const cx = 100;
  const cy = 100;
  const raioExterno = 80;
  const raioInterno = 54;
  const arcoMaior = fim - inicio > 180 ? 1 : 0;
  const externoInicio = pontoPolar(cx, cy, raioExterno, raioExterno, inicio);
  const externoFim = pontoPolar(cx, cy, raioExterno, raioExterno, fim);
  const internoFim = pontoPolar(cx, cy, raioInterno, raioInterno, fim);
  const internoInicio = pontoPolar(cx, cy, raioInterno, raioInterno, inicio);
  return [
    `M ${externoInicio.x} ${externoInicio.y}`,
    `A ${raioExterno} ${raioExterno} 0 ${arcoMaior} 1 ${externoFim.x} ${externoFim.y}`,
    `L ${internoFim.x} ${internoFim.y}`,
    `A ${raioInterno} ${raioInterno} 0 ${arcoMaior} 0 ${internoInicio.x} ${internoInicio.y}`,
    "Z",
  ].join(" ");
}

export default function VisaoGrafica() {
  const { regioes: regioesAoVivo, lastUpdate } = useLiveRegioes(3000);
  const regioes = useMemo(() => withPercent(regioesAoVivo), [regioesAoVivo]);
  const [plano, setPlano] = useState<Plano>("todos");
  const [nivel, setNivel] = useState<Nivel>("estados");
  const [selecionado, setSelecionado] = useState<string | null>(null);
  const [regiaoGrafico, setRegiaoGrafico] = useState("Sudeste");

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
  const segmentosRegiao = regioes.reduce<Array<(typeof regioes)[number] & { inicio: number; fim: number }>>(
    (segmentos, regiao) => {
      const inicio = segmentos.length ? segmentos[segmentos.length - 1].fim : 0;
      const fim = inicio + (totalRegioes > 0 ? (regiao.total / totalRegioes) * 360 : 0);
      return [...segmentos, { ...regiao, inicio, fim }];
    },
    [],
  );
  const regiaoSelecionada = regioes.find((regiao) => regiao.nome === regiaoGrafico) ?? regioes[0];

  return (
    <div className="min-h-screen bg-muted/40 text-foreground">
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
        <div className="mx-auto flex w-full max-w-[1920px] items-center justify-between gap-3 px-4 py-3 sm:grid sm:grid-cols-[minmax(0,1fr)_auto] sm:px-5 lg:px-7">
          <div className="hidden min-w-0 items-center gap-3 sm:flex">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-primary text-primary-foreground shadow-sm">
              <BarChart3 className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <h1 className="truncate text-base font-bold sm:text-xl">Visão gráfica de ativações</h1>
              <p className="hidden text-xs text-muted-foreground lg:block">Regiões, estados e cidades em tempo real</p>
            </div>
          </div>
          <div className="flex w-full items-center justify-end sm:w-auto">
            <span className="flex items-center gap-2 rounded-full border border-live/20 bg-live-soft px-3 py-1.5 text-xs font-semibold text-live">
              <span className="relative flex h-2 w-2">
                <span className="absolute h-full w-full animate-ping rounded-full bg-live opacity-50" />
                <span className="relative h-2 w-2 rounded-full bg-live" />
              </span>
              Tempo real
            </span>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[1920px] px-3 py-4 sm:px-5 sm:py-5 lg:px-7">
        <div className="mb-5 grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <div>
            <p className="text-xs font-semibold text-primary">Distribuição geográfica</p>
            <h2 className="mt-1 text-2xl font-bold sm:text-3xl">Ativações por {nivel === "regioes" ? "região" : nivel === "estados" ? "estado" : "cidade"}</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              <CountUp value={total} format={fmt} className="font-semibold text-foreground" /> ativações no período atual
            </p>
          </div>

          <div className="grid gap-2" aria-label="Filtros da visão gráfica">
            <div>
              <p className="mb-1.5 text-[11px] font-semibold text-muted-foreground sm:hidden">Visualizar por</p>
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
                    className="h-10 min-w-0 rounded-md px-1.5 text-xs sm:h-9 sm:px-3 sm:text-sm"
                  >
                    <Icon className="h-4 w-4 shrink-0" /> <span className="truncate">{item.label}</span>
                  </Button>
                );
              })}
              </div>
            </div>
            <div>
              <p className="mb-1.5 text-[11px] font-semibold text-muted-foreground sm:hidden">Plano</p>
              <div className="grid grid-cols-3 rounded-lg border bg-background p-1 shadow-sm">
                {PLANOS.map((item) => (
                  <Button
                    key={item.key}
                    type="button"
                    variant={plano === item.key ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => setPlano(item.key)}
                    className="h-10 rounded-md px-2 text-xs sm:h-9 sm:px-3 sm:text-sm"
                  >
                    {item.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <section className="mb-5 overflow-hidden rounded-lg border bg-card p-4 shadow-sm sm:p-6">
          <div className="flex flex-col gap-3 sm:grid sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start">
            <div className="min-w-0">
              <h3 className="text-lg font-bold sm:text-xl">Distribuição por região</h3>
              <p className="text-sm text-muted-foreground">Participação no total de ativações</p>
            </div>
            <Select value={regiaoGrafico} onValueChange={setRegiaoGrafico}>
              <SelectTrigger className="h-11 w-full rounded-lg border-border bg-background px-3 text-xs shadow-sm sm:w-[190px] sm:text-sm">
                <span className="mr-1 h-3.5 w-3.5 shrink-0 rounded-full" style={{ backgroundColor: regiaoSelecionada?.cor }} />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {regioes.map((regiao) => (
                  <SelectItem key={regiao.nome} value={regiao.nome}>{regiao.nome}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="mt-5 grid items-center gap-6 md:grid-cols-[280px_minmax(0,1fr)] lg:grid-cols-[320px_minmax(0,1fr)]">
            <div className="relative mx-auto h-[220px] w-[220px] sm:h-[260px] sm:w-[260px]">
              <svg viewBox="0 0 200 200" className="h-full w-full -rotate-90" aria-label="Distribuição das ativações por região">
                <defs>
                  <filter id="donutGlow" x="-50%" y="-50%" width="200%" height="200%">
                    <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="var(--donut-shadow)" floodOpacity="0.22" />
                  </filter>
                  {segmentosRegiao.map((regiao, indice) => (
                    <linearGradient key={`grad-${regiao.nome}`} id={`regiao-${indice}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={regiao.cor} stopOpacity="0.92" />
                      <stop offset="100%" stopColor={regiao.cor} stopOpacity="1" />
                    </linearGradient>
                  ))}
                </defs>
                {segmentosRegiao.map((regiao, indice) => {
                  const meio = (regiao.inicio + regiao.fim) / 2;
                  const ativa = regiao.nome === regiaoGrafico;
                  const deslocamento = ativa ? pontoPolar(0, 0, 4, 4, meio + 90) : { x: 0, y: 0 };
                  return (
                    <path
                      key={regiao.nome}
                      d={arcoRoscaPadrao(regiao.inicio, regiao.fim)}
                      fill={`url(#regiao-${indice})`}
                      stroke="var(--background)"
                      strokeWidth={ativa ? 3 : 1.8}
                      strokeLinecap="butt"
                      transform={`translate(100 100) scale(${ativa ? 1.04 : 1}) translate(-100 -100) translate(${deslocamento.x} ${deslocamento.y})`}
                      className="cursor-pointer transition-all duration-300"
                      onClick={() => setRegiaoGrafico(regiao.nome)}
                      filter={ativa ? "url(#donutGlow)" : undefined}
                    />
                  );
                })}
              </svg>
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                <strong className="text-2xl font-bold tabular-nums text-foreground sm:text-3xl">{fmt(regiaoSelecionada?.total ?? totalRegioes)}</strong>
                <span className="text-[10px] font-medium text-muted-foreground sm:text-xs">Ativações</span>
              </div>
            </div>

            <ul className="grid gap-2.5">
              {regioes.map((regiao) => (
                <li key={regiao.nome}>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setRegiaoGrafico(regiao.nome)}
                    className={`grid h-12 w-full grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-lg border px-4 text-left ${regiao.nome === regiaoGrafico ? "border-primary/30 bg-primary-soft" : "border-border bg-background hover:bg-muted/50"}`}
                  >
                    <span className="h-4 w-4 rounded-full shadow-sm" style={{ backgroundColor: regiao.cor }} />
                    <span className="truncate text-sm font-medium text-muted-foreground">{regiao.nome}</span>
                    <strong className="text-sm tabular-nums text-foreground">{regiao.percentual.toFixed(1).replace(".", ",")}%</strong>
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1.55fr)_minmax(360px,0.75fr)]">
          <section className="min-w-0 rounded-lg border bg-card p-3 shadow-sm sm:p-6">
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
                  <Button
                    key={`${linha.regiao}-${linha.nome}`}
                    type="button"
                    variant="ghost"
                    onClick={() => setSelecionado(linha.nome)}
                    className={`group grid h-auto w-full grid-cols-[34px_minmax(0,1fr)_auto] items-center gap-2 rounded-md px-2 py-2 text-left transition sm:grid-cols-[38px_minmax(0,1fr)_auto] sm:gap-3 ${ativa ? "bg-primary-soft" : "hover:bg-muted"}`}
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
                  </Button>
                );
              })}
            </div>
          </section>

          <div className="grid gap-5">
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