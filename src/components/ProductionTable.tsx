import { useState } from "react";
import type { Regiao } from "@/types/dashboard";

function Sparkline({ values, color }: { values: number[]; color: string }) {
  const max = Math.max(...values, 1);
  const w = 60;
  const h = 20;
  const barW = w / values.length - 2;
  return (
    <svg width={w} height={h} className="inline-block">
      {values.map((v, i) => {
        const bh = (v / max) * h;
        return (
          <rect
            key={i}
            x={i * (barW + 2)}
            y={h - bh}
            width={barW}
            height={bh}
            fill={color}
            rx={1}
          />
        );
      })}
    </svg>
  );
}

export default function ProductionTable({ regioes }: { regioes: Regiao[] }) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>(
    Object.fromEntries(regioes.map((r) => [r.nome, true])),
  );

  const toggle = (nome: string) =>
    setExpanded((s) => ({ ...s, [nome]: !s[nome] }));

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-lg font-bold text-slate-900">Produção em tempo real</h3>
        <div className="flex flex-wrap items-center gap-2">
          <button className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 hover:bg-slate-50">
            <span>🗂️</span> Todos os estados <span>▾</span>
          </button>
          <button className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 hover:bg-slate-50">
            <span>📤</span> Todos os planos <span>▾</span>
          </button>
          <button className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 hover:bg-slate-50">
            <span>⚙</span> Filtros
          </button>
          <button className="flex items-center gap-2 text-sm font-medium text-violet-600 hover:text-violet-700">
            Ver todas <span>→</span>
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="text-xs uppercase tracking-wide text-slate-500">
              <th className="px-3 py-2 text-left font-medium">Região</th>
              <th className="px-3 py-2 text-left font-medium">Estado</th>
              <th className="px-3 py-2 text-left font-medium">Cidade</th>
              <th colSpan={4} className="px-3 py-2 text-center font-medium">
                Total de ativações
              </th>
              <th className="px-3 py-2 text-right font-medium">Variação (Hoje)</th>
              <th className="px-3 py-2 text-right font-medium">Tendência</th>
            </tr>
            <tr className="text-xs text-slate-500">
              <th />
              <th />
              <th />
              <th className="px-3 py-1 text-right font-medium">50GB</th>
              <th className="px-3 py-1 text-right font-medium">80GB</th>
              <th className="px-3 py-1 text-right font-medium">100GB</th>
              <th className="px-3 py-1 text-right font-medium">Total</th>
              <th />
              <th />
            </tr>
          </thead>
          <tbody>
            {regioes.map((r) => {
              const isOpen = expanded[r.nome];
              const cidades =
                r.estados?.flatMap((e) =>
                  e.cidades.map((c) => ({ estado: e.nome, ...c })),
                ) ?? [];
              return (
                <RegionRows
                  key={r.nome}
                  regiao={r}
                  cidades={cidades}
                  open={isOpen}
                  onToggle={() => toggle(r.nome)}
                  Sparkline={Sparkline}
                />
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-500">
        <span>ⓘ</span>
        Os dados são atualizados automaticamente em tempo real. Última atualização:{" "}
        {new Date().toLocaleString("pt-BR")}
      </div>
    </div>
  );
}

function RegionRows({
  regiao,
  cidades,
  open,
  onToggle,
  Sparkline,
}: {
  regiao: Regiao;
  cidades: Array<{ estado: string; nome: string; planos: { gb50: number; gb80: number; gb100: number }; variacao?: number; tendencia?: number[] }>;
  open: boolean;
  onToggle: () => void;
  Sparkline: (p: { values: number[]; color: string }) => JSX.Element;
}) {
  return (
    <>
      <tr className="border-t border-slate-100">
        <td className="px-3 py-3">
          <button
            onClick={onToggle}
            className="flex items-center gap-2 font-medium text-slate-700"
          >
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: regiao.cor }} />
            {regiao.nome}
            <span className={`text-xs transition ${open ? "rotate-180" : ""}`}>▾</span>
          </button>
        </td>
        <td className="px-3 py-3 text-slate-700">{cidades[0]?.estado ?? "-"}</td>
        <td colSpan={7} />
      </tr>
      {open &&
        cidades.map((c) => {
          const total = c.planos.gb50 + c.planos.gb80 + c.planos.gb100;
          return (
            <tr key={`${regiao.nome}-${c.nome}`} className="border-t border-slate-50">
              <td />
              <td className="px-3 py-2 text-slate-500">{c.estado}</td>
              <td className="px-3 py-2 text-slate-800">{c.nome}</td>
              <td className="px-3 py-2 text-right tabular-nums text-slate-700">
                {c.planos.gb50.toLocaleString("pt-BR")}
              </td>
              <td className="px-3 py-2 text-right tabular-nums text-slate-700">
                {c.planos.gb80.toLocaleString("pt-BR")}
              </td>
              <td className="px-3 py-2 text-right tabular-nums text-slate-700">
                {c.planos.gb100.toLocaleString("pt-BR")}
              </td>
              <td className="px-3 py-2 text-right font-semibold tabular-nums text-slate-900">
                {total.toLocaleString("pt-BR")}
              </td>
              <td className="px-3 py-2 text-right font-medium text-emerald-600">
                +{c.variacao?.toString().replace(".", ",")}%
              </td>
              <td className="px-3 py-2 text-right">
                <Sparkline values={c.tendencia ?? [1, 2, 3, 4, 5, 6, 7]} color="#10b981" />
              </td>
            </tr>
          );
        })}
    </>
  );
}