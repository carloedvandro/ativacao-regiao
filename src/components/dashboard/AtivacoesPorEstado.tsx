import { useMemo, useState } from "react";
import { BarChart3, Signal } from "lucide-react";
import { regioesBase, siglaDe } from "@/data/dados";
import Bar3D from "./Bar3D";
import DashboardStatusBar from "./DashboardHeader";

export default function AtivacoesPorEstado() {
  const estados = useMemo(() => {
    return regioesBase.flatMap((r) =>
      r.estados.map((e) => {
        const total = e.cidades.reduce((s, c) => s + c.gb50 + c.gb80 + c.gb100, 0);
        return {
          nome: e.nome,
          sigla: siglaDe(e.nome),
          regiao: r.nome,
          regiaoCor: r.cor,
          hoje: Math.max(2, Math.round(total / 600)),
          total,
        };
      }),
    ).sort((a, b) => b.hoje - a.hoje);
  }, []);

  const [sel, setSel] = useState(estados[0]?.sigla);
  const selected = estados.find((e) => e.sigla === sel) ?? estados[0];
  const max = Math.max(...estados.map((e) => e.hoje));

  return (
    <section className="grid lg:grid-cols-[1.4fr_1fr] gap-6 mt-2">
      {/* Left: ranking */}
      <div
        className="rounded-[28px] p-6 md:p-7"
        style={{
          background: "linear-gradient(180deg, #FFFFFF, #F6EFFB)",
          border: "1.5px solid #F6C756",
          boxShadow: "0 20px 50px rgba(106,13,173,.12)",
        }}
      >
        <div className="flex items-start gap-4 mb-6">
          <div
            className="shrink-0 w-14 h-14 rounded-full grid place-items-center"
            style={{
              background: "linear-gradient(180deg, #6A0DAD, #2A0050)",
              border: "2px solid #F6C756",
              boxShadow: "0 8px 18px rgba(74,0,117,.35), inset 0 2px 3px rgba(255,255,255,.2)",
            }}
          >
            <BarChart3 className="w-6 h-6 text-[#F6C756]" />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-xl md:text-2xl font-black tracking-wide text-[#3A0068] uppercase">
              Ativações por Estado
            </h2>
            <p className="text-slate-500 text-sm">Produção em tempo real</p>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {estados.slice(0, 6).map((e, i) => (
            <Bar3D
              key={e.sigla}
              rank={i + 1}
              label={e.sigla}
              value={e.hoje}
              max={max}
              onClick={() => setSel(e.sigla)}
            />
          ))}
        </div>
      </div>

      {/* Right: state podium card */}
      <div
        className="rounded-[28px] p-6 md:p-7 flex flex-col gap-4"
        style={{
          background: "linear-gradient(180deg, #FFFFFF, #F6EFFB)",
          border: "1.5px solid #F6C756",
          boxShadow: "0 20px 50px rgba(106,13,173,.12)",
        }}
      >
        <div className="flex justify-end">
          <DashboardStatusBar />
        </div>
        <div className="grid grid-cols-[auto_minmax(0,1fr)] gap-6 items-center">
          {/* Podium */}
          <div className="relative w-[140px] h-[150px] shrink-0">
            <div
              className="absolute left-1/2 -translate-x-1/2 top-0 w-[120px] h-[120px] rounded-full grid place-items-center"
              style={{
                background:
                  "radial-gradient(circle at 35% 30%, #F8E08E, #C9A24C 60%, #6E4E14)",
                boxShadow: "0 14px 30px rgba(74,0,117,.45)",
              }}
            >
              <div
                className="w-[90px] h-[90px] rounded-full grid place-items-center"
                style={{
                  background:
                    "radial-gradient(circle at 50% 35%, #5A0BA0, #2A0050 70%, #150028)",
                  border: "3px solid #F6C756",
                }}
              >
                <span className="text-[#F6C756] text-3xl font-black">
                  {selected?.sigla}
                </span>
              </div>
            </div>
            <div
              className="absolute left-1/2 -translate-x-1/2 bottom-0 w-[130px] h-[26px] rounded-[14px]"
              style={{
                background:
                  "linear-gradient(180deg, #6A0DAD, #2A0050)",
                border: "2px solid #F6C756",
              }}
            />
          </div>

          <div className="min-w-0">
            <h3 className="text-2xl md:text-3xl font-black text-[#3A0068] truncate">
              {selected?.nome}
            </h3>
            <p className="text-slate-600 text-lg">
              {selected?.hoje} ativações
            </p>
            <div className="h-px bg-[#E9DDF8] my-3" />
            <p className="text-xs uppercase tracking-widest text-slate-500">
              Plano predominante
            </p>
            <p className="text-xl font-black text-[#3A0068]">
              Smart<span className="text-[#6A0DAD]">Voz</span> 50GB
            </p>
            <div className="h-px bg-[#E9DDF8] my-3" />
            <p className="text-xs uppercase tracking-widest text-slate-500">Crescimento</p>
            <p className="text-2xl font-black text-green-600 flex items-center gap-1">
              <Signal className="w-5 h-5" /> +5,8%
            </p>
            <p className="text-xs text-slate-500">em relação ao período anterior</p>
          </div>
        </div>
      </div>
    </section>
  );
}