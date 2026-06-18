import type { Regiao } from "@/types/dashboard";

export default function RegionCards({ regioes }: { regioes: Regiao[] }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center justify-between">
        <h3 className="text-lg font-bold text-slate-900">
          Detalhamento por Região{" "}
          <span className="text-sm font-normal text-slate-500">(em tempo real)</span>
        </h3>
        <button className="flex items-center gap-2 text-sm font-medium text-violet-600 hover:text-violet-700">
          Ver tabela completa
          <span className="text-base">▦</span>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {regioes.map((r) => (
          <div
            key={r.nome}
            className="rounded-xl border border-slate-100 bg-white p-4 transition hover:shadow-md"
          >
            <div className="text-sm font-semibold" style={{ color: r.cor }}>
              {r.nome}
            </div>
            <div className="mt-2 text-2xl font-bold text-slate-900">
              {r.total.toLocaleString("pt-BR")}
            </div>
            <div className="text-base font-semibold" style={{ color: r.cor }}>
              {r.percentual.toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%
            </div>
            <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${Math.min(100, r.percentual * 2.5)}%`,
                  backgroundColor: r.cor,
                }}
              />
            </div>
            <div className="mt-3 flex items-center gap-1 text-sm font-medium text-emerald-600">
              <span>↑</span>
              <span>{r.hoje} hoje</span>
            </div>
            <div className="mt-1 text-xs text-slate-400">Atualizado agora</div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-500">
        <span className="h-2 w-2 rounded-full bg-emerald-500" />
        Dados atualizados automaticamente a cada 3 segundos
      </div>
    </div>
  );
}