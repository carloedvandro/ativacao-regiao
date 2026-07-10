import { useEffect, useMemo, useRef, useState } from "react";
import { BarChart3, ChevronDown } from "lucide-react";
import CountUp from "@/components/CountUp";
import Donut3DChart from "@/components/Donut3DChart";
import { fmt, regioesBase, type Regiao } from "@/data/dados";

type RegionKey =
  | "Sudeste"
  | "Sul"
  | "Outros/Exterior"
  | "Nordeste"
  | "Centro-Oeste"
  | "Norte";

const REGIAO_ORDER: RegionKey[] = [
  "Sudeste",
  "Sul",
  "Outros/Exterior",
  "Nordeste",
  "Centro-Oeste",
  "Norte",
];

const CALLOUTS: Record<
  RegionKey,
  {
    label: string;
    colorFallback: string;
    x: string;
    y: string;
    align: "left" | "right";
    width: string;
    line: { x: string; y: string; w: string; rotate?: string };
    arrow: { x: string; y: string; rotate: string };
  }
> = {
  Norte: {
    label: "Norte",
    colorFallback: "#5717f3",
    x: "6.0%",
    y: "20.8%",
    align: "right",
    width: "16.5%",
    line: { x: "22.8%", y: "21.55%", w: "13.8%" },
    arrow: { x: "35.7%", y: "29.2%", rotate: "0deg" },
  },
  "Centro-Oeste": {
    label: "Centro-Oeste",
    colorFallback: "#16b7b5",
    x: "4.2%",
    y: "45.0%",
    align: "right",
    width: "16.8%",
    line: { x: "22.7%", y: "46.8%", w: "7.8%" },
    arrow: { x: "29.3%", y: "45.45%", rotate: "-90deg" },
  },
  Nordeste: {
    label: "Nordeste",
    colorFallback: "#a42cff",
    x: "5.8%",
    y: "72.8%",
    align: "right",
    width: "15.9%",
    line: { x: "22.5%", y: "74.2%", w: "13.8%" },
    arrow: { x: "35.1%", y: "72.8%", rotate: "-90deg" },
  },
  Sudeste: {
    label: "Sudeste",
    colorFallback: "#ff0b86",
    x: "82.4%",
    y: "20.8%",
    align: "left",
    width: "16.7%",
    line: { x: "62.0%", y: "21.35%", w: "17.4%" },
    arrow: { x: "61.2%", y: "26.8%", rotate: "0deg" },
  },
  Sul: {
    label: "Sul",
    colorFallback: "#8a5426",
    x: "82.5%",
    y: "45.1%",
    align: "left",
    width: "16.7%",
    line: { x: "73.2%", y: "46.8%", w: "7.8%" },
    arrow: { x: "72.0%", y: "45.45%", rotate: "90deg" },
  },
  "Outros/Exterior": {
    label: "Outros / Exterior",
    colorFallback: "#ff8300",
    x: "82.6%",
    y: "72.8%",
    align: "left",
    width: "17.3%",
    line: { x: "69.0%", y: "74.1%", w: "12.0%" },
    arrow: { x: "67.9%", y: "72.8%", rotate: "90deg" },
  },
};

function descriptionFor(region: RegionKey) {
  if (region === "Outros/Exterior") {
    return "Total de ativações realizadas em Outras regiões ou Exterior no período selecionado.";
  }

  return `Total de ativações realizadas na região ${region} no período selecionado.`;
}

type Props = {
  regioes?: Regiao[];
  selected?: RegionKey;
  onSelectRegion?: (r: RegionKey) => void;
};

export default function DistribuicaoRegiaoDashboard({
  regioes: regioesProp,
  selected: selectedProp,
  onSelectRegion,
}: Props = {}) {
  const regiaoData = regioesProp ?? regioesBase;
  const [selectedInner, setSelectedInner] = useState<RegionKey>("Sudeste");
  const selected = selectedProp ?? selectedInner;
  const setSelected = (r: RegionKey) => {
    setSelectedInner(r);
    onSelectRegion?.(r);
  };
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const regionByName = useMemo(() => {
    const m = new Map<string, (typeof regioesBase)[number]>();
    regiaoData.forEach((r) => m.set(r.nome, r));
    return m;
  }, [regiaoData]);

  const totalGeral = useMemo(
    () => regiaoData.reduce((sum, region) => sum + region.total, 0),
    [regiaoData],
  );

  const donutRegioes = useMemo(() => {
    // Order clockwise starting from upper-left so callout arrows align:
    // Norte → Sudeste → Sul → Outros/Exterior → Nordeste → Centro-Oeste
    const order: RegionKey[] = [
      "Norte",
      "Sudeste",
      "Sul",
      "Outros/Exterior",
      "Nordeste",
      "Centro-Oeste",
    ];
    const by = new Map(regiaoData.map((r) => [r.nome, r] as const));
    return order
      .map((n) => by.get(n)!)
      .map((r) => ({ nome: r.nome, cor: r.cor, total: r.total, percentual: r.percentual }));
  }, [regiaoData]);

  useEffect(() => {
    if (!open) return;

    const onDoc = (event: MouseEvent) => {
      if (!dropdownRef.current?.contains(event.target as Node)) setOpen(false);
    };

    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  const renderCallout = (region: RegionKey) => {
    const config = CALLOUTS[region];
    const regiao = regionByName.get(region);
    const color = regiao?.cor ?? config.colorFallback;
    const isActive = selected === region;

    return (
      <button
        key={region}
        type="button"
        onClick={() => setSelected(region)}
        className={`absolute z-20 hidden transition focus:outline-none md:block ${
          config.align === "right" ? "text-right" : "text-left"
        } ${isActive ? "scale-[1.025]" : "hover:scale-[1.015]"}`}
        style={{
          left: config.x,
          top: config.y,
          width: config.width,
          transformOrigin: config.align === "right" ? "right center" : "left center",
        }}
      >
        <span
          className="block text-[clamp(17px,2vw,31px)] font-black leading-none tracking-normal"
          style={{ color }}
        >
          {config.label}
        </span>
        <span className="mt-[1.1%] block text-[clamp(11px,1.18vw,18px)] font-medium leading-[1.25] text-black">
          {descriptionFor(region)}
        </span>
      </button>
    );
  };

  const renderArrow = (region: RegionKey) => {
    const config = CALLOUTS[region];
    const color = regionByName.get(region)?.cor ?? config.colorFallback;

    return (
      <div key={`arrow-${region}`} className="pointer-events-none absolute inset-0 z-10 hidden md:block">
        <span
          className="absolute block h-[0.38%] rounded-full"
          style={{
            left: config.line.x,
            top: config.line.y,
            width: config.line.w,
            backgroundColor: color,
            transform: config.line.rotate ? `rotate(${config.line.rotate})` : undefined,
            transformOrigin: "center",
          }}
        />
        {(region === "Norte" || region === "Sudeste") && (
          <span
            className="absolute block w-[0.38%] rounded-full"
            style={{
              left: region === "Norte" ? "36.35%" : "61.55%",
              top: region === "Norte" ? "21.55%" : "21.35%",
              height: region === "Norte" ? "7.8%" : "5.7%",
              backgroundColor: color,
            }}
          />
        )}
        <span
          className="absolute block h-0 w-0 border-x-[clamp(7px,0.78vw,12px)] border-t-[clamp(18px,2.08vw,32px)] border-x-transparent"
          style={{
            left: config.arrow.x,
            top: config.arrow.y,
            borderTopColor: color,
            transform: `rotate(${config.arrow.rotate})`,
          }}
        />
      </div>
    );
  };

  return (
    <section className="relative mx-auto aspect-[3/2] w-full max-w-[1536px] overflow-hidden bg-white text-[#06144e]">
      <header className="absolute left-1/2 top-[1.6%] z-30 flex -translate-x-1/2 flex-col items-center text-center">
        <h1 className="whitespace-nowrap text-[clamp(27px,3vw,46px)] font-black leading-none tracking-normal">
          Distribuição por Região
        </h1>
        <p className="mt-[2.2%] whitespace-nowrap text-[clamp(15px,1.5vw,23px)] font-medium text-[#414455]">
          Ativações SmartVoz por região
        </p>

        <div ref={dropdownRef} className="relative mt-[4.4%] w-[clamp(186px,19.1vw,294px)]">
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-haspopup="listbox"
            aria-expanded={open}
            className="flex h-[clamp(38px,3.78vw,58px)] w-full items-center justify-between rounded-[10px] border border-[#bfc5cf] bg-white px-[7.8%] text-left text-[clamp(16px,1.62vw,25px)] font-medium text-black shadow-[0_1px_4px_rgba(15,23,42,0.06)] transition hover:border-[#8e96a3]"
          >
            <span>{selected}</span>
            <ChevronDown className="h-[1em] w-[1em] text-black" />
          </button>

          {open && (
            <ul
              role="listbox"
              className="absolute left-0 right-0 z-40 mt-1 overflow-hidden rounded-[10px] border border-[#bfc5cf] bg-white shadow-xl"
            >
              {REGIAO_ORDER.map((region) => {
                const color = regionByName.get(region)?.cor ?? CALLOUTS[region].colorFallback;
                const active = selected === region;

                return (
                  <li key={region}>
                    <button
                      type="button"
                      role="option"
                      aria-selected={active}
                      onClick={() => {
                        setSelected(region);
                        setOpen(false);
                      }}
                      className={`flex w-full items-center gap-3 px-5 py-3 text-left text-[clamp(14px,1.18vw,18px)] transition ${
                        active ? "bg-gray-100" : "hover:bg-gray-50"
                      }`}
                    >
                      <span className="h-3 w-3 rounded-full" style={{ backgroundColor: color }} />
                      <span className="font-semibold" style={{ color }}>
                        {CALLOUTS[region].label}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </header>

      {REGIAO_ORDER.map(renderArrow)}
      {REGIAO_ORDER.map(renderCallout)}

      <div className="absolute left-1/2 top-[16.8%] z-0 w-[56.4%] -translate-x-1/2">
        <Donut3DChart
          regioes={donutRegioes}
          selectedName={selected}
          onSelect={(name) => setSelected(name as RegionKey)}
          startAngle={-72.6}
        />
      </div>

      <div className="absolute left-1/2 top-[87.0%] z-30 flex h-[7.2%] w-[28.4%] -translate-x-1/2 items-center justify-center gap-[4.7%] rounded-[9px] border border-[#c7cfda] bg-white px-[2.1%] shadow-[0_1px_5px_rgba(15,23,42,0.08)]">
        <BarChart3 className="h-[44%] w-[8.3%] fill-[#5517ea] text-[#5517ea]" strokeWidth={3} />
        <span className="whitespace-nowrap text-[clamp(15px,1.56vw,24px)] font-medium leading-none text-[#4f5060]">
          Total de ativações
        </span>
        <CountUp
          value={totalGeral}
          className="whitespace-nowrap text-[clamp(20px,1.96vw,30px)] font-black leading-none text-[#5517ea]"
          format={(value) => fmt(value)}
        />
      </div>

      <div className="absolute left-[4%] right-[4%] top-[77%] z-30 grid gap-2 md:hidden">
        {REGIAO_ORDER.map((region) => {
          const regiao = regionByName.get(region);
          if (!regiao) return null;

          return (
            <button
              key={region}
              type="button"
              onClick={() => setSelected(region)}
              className="rounded-lg border border-[#d9dee7] bg-white p-3 text-left"
            >
              <span className="text-lg font-black" style={{ color: regiao.cor }}>
                {CALLOUTS[region].label}
              </span>
              <span className="ml-3 text-sm font-black text-black">
                {regiao.percentual.toFixed(0)}% · {fmt(regiao.total)}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}