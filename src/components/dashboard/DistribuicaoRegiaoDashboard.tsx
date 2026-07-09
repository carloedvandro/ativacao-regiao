import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
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

// Left column: Norte, Centro-Oeste, Nordeste. Right column: Sudeste, Sul, Outros/Exterior.
const LEFT_CARDS: RegionKey[] = ["Norte", "Centro-Oeste", "Nordeste"];
const RIGHT_CARDS: RegionKey[] = ["Sudeste", "Sul", "Outros/Exterior"];

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

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (!dropdownRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  const sel = selected ? regionByName.get(selected) : undefined;

  const renderCard = (r: RegionKey) => {
    const reg = regionByName.get(r);
    if (!reg) return null;
    const active = selected === r;
    return (
      <button
        key={r}
        type="button"
        onClick={() => setSelected(active ? null : r)}
        className={`group relative w-full rounded-2xl border bg-white p-4 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md ${
          active ? "ring-2" : "border-gray-200"
        }`}
        style={
          active
            ? { borderColor: reg.cor, boxShadow: `0 8px 24px -8px ${reg.cor}66` }
            : undefined
        }
      >
        <div className="flex items-center gap-2">
          <span
            className="inline-block h-3 w-3 rounded-full"
            style={{ backgroundColor: reg.cor }}
          />
          <span className="text-sm font-bold" style={{ color: reg.cor }}>
            {reg.nome}
          </span>
          <span
            className="ml-auto rounded-full px-2 py-0.5 text-[11px] font-black text-white"
            style={{ backgroundColor: reg.cor }}
          >
            {reg.percentual.toFixed(0)}%
          </span>
        </div>
        <div className="mt-2 text-2xl font-black text-[#140044]">
          {fmt(reg.total)}
        </div>
        <div className="mt-1 flex items-center justify-between text-xs text-gray-500">
          <span>{reg.estados.length} estados</span>
          <span className="font-bold text-emerald-600">+{reg.hoje} hoje</span>
        </div>
      </button>
    );
  };

  return (
    <section className="relative mx-auto w-full max-w-[1184px] rounded-3xl bg-white p-6 md:p-8">
      {/* Header: title + dropdown */}
      <header className="mb-6 flex flex-col items-center gap-3 text-center">
        <h1 className="text-3xl font-black tracking-tight text-[#140044] md:text-4xl">
          Distribuição por Região
        </h1>
        <p className="text-sm text-gray-500">
          Selecione uma região para ver os detalhes
        </p>

        <div
          ref={dropdownRef}
          className="relative mt-1 w-full max-w-xs"
        >
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-haspopup="listbox"
            aria-expanded={open}
            className="flex w-full items-center justify-between rounded-lg border border-gray-300 bg-white px-4 py-2 text-left text-[15px] font-semibold shadow-sm transition hover:border-gray-400"
            style={{ color: sel?.cor ?? "#140044" }}
          >
            <span className="flex items-center gap-2">
              {sel && (
                <span
                  className="inline-block h-3 w-3 rounded-full"
                  style={{ backgroundColor: sel.cor }}
                />
              )}
              {selected ?? "Todas as regiões"}
            </span>
            <ChevronDown
              className={`h-4 w-4 text-gray-500 transition-transform ${open ? "rotate-180" : ""}`}
            />
          </button>
          {open && (
            <ul
              role="listbox"
              className="absolute left-0 right-0 z-30 mt-1 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-xl"
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
                      className={`flex w-full items-center gap-3 px-4 py-2 text-left text-sm transition ${
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

      {/* Grid: left cards | donut | right cards */}
      <div className="grid grid-cols-1 items-center gap-6 md:grid-cols-[minmax(180px,1fr)_minmax(320px,2fr)_minmax(180px,1fr)]">
        <div className="flex flex-col gap-4">{LEFT_CARDS.map(renderCard)}</div>

        <div className="relative flex items-center justify-center">
          <Donut3DChart regioes={regioesBase} />
          {sel && (
            <div
              className="pointer-events-none absolute inset-0 flex items-center justify-center"
              aria-hidden
            >
              <div
                className="rounded-full"
                style={{
                  width: "58%",
                  aspectRatio: "1 / 1",
                  boxShadow: `0 0 0 3px ${sel.cor}, 0 0 40px 6px ${sel.cor}55`,
                  animation: "pulseRing 1.8s ease-in-out infinite",
                }}
              />
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4">{RIGHT_CARDS.map(renderCard)}</div>
      </div>

      {/* Total counter */}
      <div className="mt-8 flex flex-col items-center gap-1">
        <span className="text-xs font-semibold uppercase tracking-widest text-gray-500">
          Total de ativações
        </span>
        <CountUp
          value={totalGeral}
          className="text-4xl font-black text-[#140044] md:text-5xl"
          format={(n) => fmt(n)}
        />
      </div>

      {/* Detail panel for the selected region */}
      {sel && (
        <div className="mx-auto mt-8 flex w-full max-w-[720px] flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span
                className="inline-block h-4 w-4 rounded-full"
                style={{ backgroundColor: sel.cor }}
              />
              <h3 className="text-xl font-black" style={{ color: sel.cor }}>
                {sel.nome}
              </h3>
            </div>
            <span
              className="rounded-full px-3 py-1 text-sm font-bold text-white"
              style={{ backgroundColor: sel.cor }}
            >
              {sel.percentual.toFixed(0)}%
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
            <div className="rounded-xl bg-gray-50 p-3">
              <div className="text-xs uppercase tracking-wide text-gray-500">Total</div>
              <div className="text-lg font-black text-[#140044]">{fmt(sel.total)}</div>
            </div>
            <div className="rounded-xl bg-gray-50 p-3">
              <div className="text-xs uppercase tracking-wide text-gray-500">Hoje</div>
              <div className="text-lg font-black text-[#140044]">+{sel.hoje}</div>
            </div>
            <div className="rounded-xl bg-gray-50 p-3">
              <div className="text-xs uppercase tracking-wide text-gray-500">Estados</div>
              <div className="text-lg font-black text-[#140044]">{sel.estados.length}</div>
            </div>
          </div>
          <div>
            <div className="mb-2 text-sm font-semibold text-gray-600">
              Estados da região
            </div>
            <ul className="divide-y divide-gray-100">
              {sel.estados.map((e) => {
                const total = e.cidades.reduce(
                  (s, c) => s + c.gb50 + c.gb80 + c.gb100,
                  0,
                );
                return (
                  <li key={e.nome} className="flex items-center justify-between py-2">
                    <span className="text-sm font-medium text-[#140044]">{e.nome}</span>
                    <span className="text-sm font-black" style={{ color: sel.cor }}>
                      {fmt(total)}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}

      <style>{`
        @keyframes pulseRing {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.04); opacity: 0.85; }
        }
      `}</style>
    </section>
  );
}