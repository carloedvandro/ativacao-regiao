import Donut3DChart from "@/components/Donut3DChart";
import RegionCards from "@/components/RegionCards";
import ProductionTable from "@/components/ProductionTable";
import RealtimeBadge from "@/components/RealtimeBadge";
import { regioes } from "@/data/regioes";

export default function DashboardRegioes() {
  const order = ["Norte", "Centro-Oeste", "Nordeste"];
  const left = order
    .map((n) => regioes.find((r) => r.nome === n)!)
    .filter(Boolean);
  const right = ["Sudeste", "Sul"]
    .map((n) => regioes.find((r) => r.nome === n)!)
    .filter(Boolean);
  const totalAtivacoes = 46782;

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-100 text-2xl">
              🥧
            </div>
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
                Distribuição por Região
              </h1>
              <p className="text-sm text-slate-500">Ativações SmartVoz por região</p>
            </div>
          </div>
          <RealtimeBadge />
        </div>

        {/* Chart card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex justify-center">
            <button className="flex items-center gap-2 rounded-xl border-2 border-violet-300 bg-white px-5 py-2.5 text-violet-700 shadow-sm">
              <span>🥧</span>
              <span className="font-semibold">Distribuição por Região</span>
              <span>▾</span>
            </button>
          </div>

          <div className="grid grid-cols-12 items-center gap-4">
            {/* Left labels */}
            <div className="col-span-12 space-y-8 md:col-span-3">
              {left.map((r) => (
                <RegionLabel key={r.nome} r={r} align="left" />
              ))}
            </div>

            {/* Donut */}
            <div className="col-span-12 md:col-span-6">
              <Donut3DChart regioes={regioes} />
              <div className="mx-auto mt-4 flex max-w-md items-center justify-between rounded-xl border border-slate-200 bg-white px-5 py-3 shadow-sm">
                <div className="flex items-center gap-2 text-slate-700">
                  <span className="text-violet-600">📊</span>
                  <span className="font-medium">Total de ativações</span>
                </div>
                <div className="text-xl font-bold text-slate-900">
                  {totalAtivacoes.toLocaleString("pt-BR")}
                </div>
              </div>
              <div className="mt-2 flex items-center justify-center gap-2 text-xs text-slate-500">
                <span>↻</span> Atualizado agora há poucos segundos
              </div>
            </div>

            {/* Right labels */}
            <div className="col-span-12 space-y-10 md:col-span-3">
              {right.map((r) => (
                <RegionLabel key={r.nome} r={r} align="right" />
              ))}
            </div>
          </div>
        </div>

        <RegionCards regioes={regioes} />
        <ProductionTable regioes={regioes} />
      </div>
    </div>
  );
}

function RegionLabel({
  r,
  align,
}: {
  r: { nome: string; cor: string; total: number };
  align: "left" | "right";
}) {
  return (
    <div className={align === "right" ? "text-left" : "text-left"}>
      <div className="text-base font-bold" style={{ color: r.cor }}>
        {r.nome}
      </div>
      <p className="mt-1 text-xs leading-relaxed text-slate-500">
        Total de ativações realizadas na região {r.nome} no período selecionado.
      </p>
      <div
        className="mt-2 inline-flex rounded-md border px-3 py-1 text-sm font-semibold tabular-nums"
        style={{ color: r.cor, borderColor: r.cor + "55" }}
      >
        {r.total.toLocaleString("pt-BR")}
      </div>
    </div>
  );
}