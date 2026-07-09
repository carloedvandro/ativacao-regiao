import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import referenciaPizzaRegioes from "@/assets/referencia-pizza-regioes.png";
import { regioesBase, fmt } from "@/data/dados";

type RegionKey =
  | "Sudeste"
  | "Sul"
  | "Outros/Exterior"
  | "Nordeste"
  | "Centro-Oeste"
  | "Norte";

// Approximate positions (percent of image box) of each slice center and
// each side-callout card, taken from the reference artwork.
const REGION_MAP: Record<
  RegionKey,
  { slice: { x: number; y: number }; card: { x: number; y: number; w: number; h: number } }
> = {
  Sudeste: { slice: { x: 60, y: 32 }, card: { x: 78, y: 22, w: 22, h: 22 } },
  Sul: { slice: { x: 68, y: 48 }, card: { x: 78, y: 46, w: 22, h: 22 } },
  "Outros/Exterior": { slice: { x: 62, y: 68 }, card: { x: 78, y: 72, w: 22, h: 24 } },
  Nordeste: { slice: { x: 44, y: 68 }, card: { x: 0, y: 72, w: 22, h: 24 } },
  "Centro-Oeste": { slice: { x: 32, y: 52 }, card: { x: 0, y: 46, w: 22, h: 22 } },
  Norte: { slice: { x: 38, y: 34 }, card: { x: 0, y: 22, w: 22, h: 22 } },
};

const REGIAO_ORDER: RegionKey[] = [
  "Sudeste",
  "Sul",
  "Outros/Exterior",
  "Nordeste",
  "Centro-Oeste",
  "Norte",
];

export default function DistribuicaoRegiaoDashboard() {
  const [selected, setSelected] = useState<RegionKey>("Sudeste");
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const regionByName = useMemo(() => {
    const m = new Map<string, (typeof regioesBase)[number]>();
    regioesBase.forEach((r) => m.set(r.nome, r));
    return m;
  }, []);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (!dropdownRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  const sel = regionByName.get(selected);
  const pos = REGION_MAP[selected];

  return (
    <section className="relative mx-auto w-full max-w-[1184px] overflow-hidden bg-white">
      <div className="relative">
        <img
          src={referenciaPizzaRegioes}
          alt="Distribuição por Região com gráfico donut 3D e chamadas laterais"
          className="block h-auto w-full select-none"
          draggable={false}
        />

        {/* Real dropdown overlaid on top of the image dropdown */}
        <div
          ref={dropdownRef}
          className="absolute z-20"
          style={{ left: "38%", top: "13.5%", width: "24%" }}
        >
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-haspopup="listbox"
            aria-expanded={open}
            className="flex w-full items-center justify-between rounded-lg border border-gray-300 bg-white px-4 py-2 text-left text-[15px] font-medium text-[#140044] shadow-sm transition hover:border-gray-400"
            style={{ color: sel?.cor }}
          >
            <span>{selected}</span>
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
                      <span className="font-medium" style={{ color: cor }}>
                        {r}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Clickable hotspots over each slice */}
        {REGIAO_ORDER.map((r) => {
          const p = REGION_MAP[r].slice;
          return (
            <button
              key={`slice-${r}`}
              type="button"
              aria-label={`Selecionar ${r}`}
              onClick={() => setSelected(r)}
              className="absolute z-10 -translate-x-1/2 -translate-y-1/2 cursor-pointer rounded-full"
              style={{
                left: `${p.x}%`,
                top: `${p.y}%`,
                width: "11%",
                height: "18%",
              }}
            />
          );
        })}

        {/* Clickable hotspots over each side callout card */}
        {REGIAO_ORDER.map((r) => {
          const c = REGION_MAP[r].card;
          return (
            <button
              key={`card-${r}`}
              type="button"
              aria-label={`Selecionar ${r}`}
              onClick={() => setSelected(r)}
              className="absolute z-10 cursor-pointer rounded-lg transition hover:bg-black/[0.03]"
              style={{
                left: `${c.x}%`,
                top: `${c.y}%`,
                width: `${c.w}%`,
                height: `${c.h}%`,
              }}
            />
          );
        })}

        {/* Highlight ring on the selected slice */}
        {sel && (
          <div
            className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              left: `${pos.slice.x}%`,
              top: `${pos.slice.y}%`,
              width: "13%",
              aspectRatio: "1 / 1",
              border: `3px solid ${sel.cor}`,
              boxShadow: `0 0 0 6px ${sel.cor}22, 0 0 28px 6px ${sel.cor}66`,
              animation: "pulseRing 1.6s ease-in-out infinite",
            }}
          />
        )}
      </div>

      {/* Detail card for the selected region */}
      {sel && (
        <div className="mx-auto mt-4 flex w-full max-w-[720px] flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
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
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
          50% { transform: translate(-50%, -50%) scale(1.06); opacity: 0.85; }
        }
      `}</style>
    </section>
  );
}