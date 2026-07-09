import { useEffect, useMemo, useRef, useState } from "react";
import { BarChart3, ChevronDown } from "lucide-react";
import { regioesBase, fmt } from "@/data/dados";
import Donut3DChart from "@/components/Donut3DChart";
import CountUp from "@/components/CountUp";

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
    side: "left" | "right";
    top: string;
    lineWidth: string;
    arrow: "down" | "right" | "left";
    label: string;
  }
> = {
  Norte: {
    side: "left",
    top: "23%",
    lineWidth: "272px",
    arrow: "down",
    label: "Norte",
  },
  "Centro-Oeste": {
    side: "left",
    top: "50%",
    lineWidth: "162px",
    arrow: "right",
    label: "Centro-Oeste",
  },
  Nordeste: {
    side: "left",
    top: "76%",
    lineWidth: "255px",
    arrow: "right",
    label: "Nordeste",
  },
  Sudeste: {
    side: "right",
    top: "23%",
    lineWidth: "276px",
    arrow: "down",
    label: "Sudeste",
  },
  Sul: {
    side: "right",
    top: "50%",
    lineWidth: "150px",
    arrow: "left",
    label: "Sul",
  },
  "Outros/Exterior": {
    side: "right",
    top: "76%",
    lineWidth: "205px",
    arrow: "left",
    label: "Outros / Exterior",
  },
};

const renderDescription = (nome: RegionKey) =>
  nome === "Outros/Exterior"
    ? "Total de ativações realizadas em Outras regiões ou Exterior no período selecionado."
    : `Total de ativações realizadas na região ${nome} no período selecionado.`;

export default function DistribuicaoRegiaoDashboard() {
  const [selected, setSelected] = useState<RegionKey | null>("Sudeste");
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const regionByName = useMemo(() => {
    const m = new Map<string, (typeof regioesBase)[number]>();
    regioesBase.forEach((r) => m.set(r.nome, r));
    return m;
  }, []);

  const totalGeral = useMemo(
    () => regioesBase.reduce((s, r) => s + r.total, 0),
    [],
  );

  const donutRegioes = useMemo(
    () =>
      regioesBase.map((r) => ({
        nome: r.nome,
        cor: r.cor,
        total: r.total,
        percentual: r.percentual,
      })),
    [],
  );

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (!dropdownRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  const sel = selected ? regionByName.get(selected) : undefined;

  const renderCallout = (r: RegionKey) => {
    const reg = regionByName.get(r);
    if (!reg) return null;
    const active = selected === r;
    const callout = CALLOUTS[r];
    const arrowBase = "absolute block h-0 w-0";
    const lineSideClass =
      callout.side === "left" ? "left-[calc(100%+24px)]" : "right-[calc(100%+24px)]";
    return (
      <button
        key={r}
        type="button"
        onClick={() => setSelected(active ? null : r)}
        className={`absolute z-10 hidden w-[205px] -translate-y-1/2 transition duration-200 hover:scale-[1.02] focus:outline-none md:block ${
          callout.side === "left" ? "left-0 text-right" : "right-0 text-left"
        } ${active ? "scale-[1.025]" : ""}`}
        style={{ top: callout.top }}
      >
        <span className="relative block">
          <span
            className="block text-[30px] font-black leading-none tracking-normal md:text-[31px]"
            style={{ color: reg.cor }}
          >
            {callout.label}
          </span>
          <span className="mt-3 block text-[18px] font-medium leading-[1.25] text-black md:text-[18px]">
            {renderDescription(r)}
          </span>
          <span
            className={`absolute top-[17px] h-[4px] rounded-full ${lineSideClass}`}
            style={{ width: callout.lineWidth, backgroundColor: reg.cor }}
            aria-hidden
          >
            {callout.arrow === "down" && (
              <>
                <span
                  className={`absolute top-0 h-[38px] w-[4px] rounded-full ${
                    callout.side === "left" ? "right-[-2px]" : "left-[-2px]"
                  }`}
                  style={{ backgroundColor: reg.cor }}
                />
                <span
                  className={`${arrowBase} -bottom-[33px] border-x-[12px] border-t-[33px] border-x-transparent ${
                    callout.side === "left" ? "right-[-12px]" : "left-[-12px]"
                  }`}
                  style={{ borderTopColor: reg.cor }}
                />
              </>
            )}
            {callout.arrow === "right" && (
              <span
                className={`${arrowBase} right-[-20px] top-[-9px] border-y-[11px] border-l-[22px] border-y-transparent`}
                style={{ borderLeftColor: reg.cor }}
              />
            )}
            {callout.arrow === "left" && (
              <span
                className={`${arrowBase} left-[-20px] top-[-9px] border-y-[11px] border-r-[22px] border-y-transparent`}
                style={{ borderRightColor: reg.cor }}
              />
            )}
          </span>
        </span>
      </button>
    );
  };

  return (
    <section className="relative mx-auto w-full max-w-[1536px] overflow-hidden bg-white px-4 pb-10 pt-5 md:px-[92px] md:pt-4">
      {/* Header: title + dropdown */}
      <header className="relative z-20 mb-0 flex flex-col items-center text-center">
        <h1 className="text-[34px] font-black leading-tight tracking-normal text-[#06144e] md:text-[46px]">
          Distribuição por Região
        </h1>
        <p className="mt-1 text-[18px] font-medium text-[#414455] md:text-[23px]">
          Ativações SmartVoz por região
        </p>

        <div ref={dropdownRef} className="relative mt-5 w-[288px] max-w-full md:w-[294px]">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-haspopup="listbox"
            aria-expanded={open}
            className="flex h-[58px] w-full items-center justify-between rounded-[10px] border border-[#bfc5cf] bg-white px-6 text-left text-[25px] font-medium text-black shadow-[0_1px_4px_rgba(15,23,42,0.06)] transition hover:border-[#8e96a3]"
          >
            <span>{selected ?? "Todas"}</span>
            <ChevronDown className={`h-6 w-6 text-black transition-transform ${open ? "rotate-180" : ""}`} />
          </button>
          {open && (
            <ul
              role="listbox"
              className="absolute left-0 right-0 z-30 mt-1 overflow-hidden rounded-[10px] border border-[#bfc5cf] bg-white shadow-xl"
            >
              {REGIAO_ORDER.map((r) => {
                const cor = regionByName.get(r)?.cor ?? "#140044";
                const active = r === selected;
                return (
                  <li key={r}>
                    <button
                      type="button"
                      role="option"
                      aria-selected={active}
                      onClick={() => {
                        setSelected(r);
                        setOpen(false);
                      }}
                      className={`flex w-full items-center gap-3 px-5 py-3 text-left text-[18px] transition ${
                        active ? "bg-gray-100" : "hover:bg-gray-50"
                      }`}
                    >
                      <span
                        className="inline-block h-3 w-3 rounded-full"
                        style={{ backgroundColor: cor }}
                      />
                      <span className="font-semibold" style={{ color: cor }}>
                        {r}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </header>

      <div className="relative mx-auto mt-0 min-h-[645px] max-w-[1320px] md:mt-0">
        {REGIAO_ORDER.map(renderCallout)}

        <div className="relative z-0 mx-auto flex w-full max-w-[720px] items-center justify-center pt-16 md:pt-16">
          <Donut3DChart
            regioes={donutRegioes}
            size={760}
            selectedName={selected}
            onSelect={(nome) => setSelected(nome as RegionKey)}
          />
        </div>
      </div>

      {/* Total counter */}
      <div className="relative z-20 mx-auto -mt-[52px] flex h-[73px] w-full max-w-[438px] items-center justify-center gap-5 rounded-[9px] border border-[#c7cfda] bg-white px-6 shadow-[0_1px_5px_rgba(15,23,42,0.08)]">
        <BarChart3 className="h-9 w-9 fill-[#5517ea] text-[#5517ea]" strokeWidth={3} />
        <span className="text-[24px] font-medium leading-none text-[#4f5060]">
          Total de ativações
        </span>
        <CountUp
          value={totalGeral}
          className="text-[30px] font-black leading-none text-[#5517ea]"
          format={(n) => fmt(n)}
        />
      </div>

      <div className="mt-7 grid gap-3 md:hidden">
        {REGIAO_ORDER.map((r) => {
          const reg = regionByName.get(r);
          if (!reg) return null;
          return (
            <button
              key={r}
              type="button"
              onClick={() => setSelected(r)}
              className="rounded-lg border border-[#d9dee7] bg-white p-3 text-left"
            >
              <span className="text-lg font-black" style={{ color: reg.cor }}>
                {CALLOUTS[r].label}
              </span>
              <span className="ml-3 text-sm font-black text-black">
                {reg.percentual.toFixed(0)}% · {fmt(reg.total)}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}