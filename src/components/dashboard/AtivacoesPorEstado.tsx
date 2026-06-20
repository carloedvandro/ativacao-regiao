import { useMemo, useState } from "react";
import { regioesBase, fmt } from "@/data/dados";
import Bar3D from "./Bar3D";

const SIGLAS: Record<string, string> = {
  "São Paulo": "SP",
  "Minas Gerais": "MG",
  "Rio de Janeiro": "RJ",
  "Espírito Santo": "ES",
  "Paraná": "PR",
  "Bahia": "BA",
  "Goiás": "GO",
  "Pará": "PA",
  "Exterior": "EX",
};

export default function AtivacoesPorEstado() {
  const estados = useMemo(() => {
    return regioesBase.flatMap((r) =>
      r.estados.map((e) => {
        const total = e.cidades.reduce((s, c) => s + c.gb50 + c.gb80 + c.gb100, 0);
        return {
          nome: e.nome,
          sigla: SIGLAS[e.nome] ?? e.nome.slice(0, 2).toUpperCase(),
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
    <section
      className="bg-white rounded-[32px] border border-[#E9DDF8] p-6 md:p-8"
      style={{ boxShadow: "0 25px 70px rgba(106,13,173,.12)" }}
    >
      <h2 className="text-2xl md:text-3xl font-black text-[#3A0068]">
        Ativações por Estado
      </h2>
      <p className="text-slate-500 mb-6">Ranking de ativações no dia</p>

      <div className="grid lg:grid-cols-[1.3fr_.9fr] gap-8">
        <div className="flex flex-col gap-3">
          {estados.slice(0, 8).map((e) => (
            <Bar3D
              key={e.sigla}
              label={e.sigla}
              value={e.hoje}
              max={max}
              highlight={e.sigla === sel}
              onClick={() => setSel(e.sigla)}
            />
          ))}
        </div>

        <div
          className="rounded-[28px] p-6 text-white flex flex-col justify-between min-h-[260px]"
          style={{
            background: "linear-gradient(180deg, #8B2BE2, #4A0075)",
            border: "2px solid #F6C756",
            boxShadow: "0 18px 40px rgba(74,0,117,.35)",
          }}
        >
          <div>
            <p className="uppercase tracking-widest text-xs opacity-80">
              Estado selecionado
            </p>
            <h3 className="text-4xl font-black mt-1">{selected?.nome}</h3>
            <p className="opacity-80 mt-1">Região {selected?.regiao}</p>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="rounded-2xl bg-white/10 p-4 border border-[#F6C756]/40">
              <p className="text-xs opacity-80">Ativações hoje</p>
              <p className="text-3xl font-black text-[#F6C756]">
                {selected?.hoje.toString().padStart(2, "0")}
              </p>
            </div>
            <div className="rounded-2xl bg-white/10 p-4 border border-[#F6C756]/40">
              <p className="text-xs opacity-80">Total acumulado</p>
              <p className="text-3xl font-black">{fmt(selected?.total ?? 0)}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}