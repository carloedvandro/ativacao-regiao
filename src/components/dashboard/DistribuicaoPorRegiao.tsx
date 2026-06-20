import { useState } from "react";
import { ChevronDown, Globe } from "lucide-react";
import { regioesBase } from "@/data/dados";
import MapaBrasil3D from "./MapaBrasil3D";
import Bar3D from "./Bar3D";

export default function DistribuicaoPorRegiao() {
  const [sel, setSel] = useState("Sul");
  const regiao = regioesBase.find((r) => r.nome === sel) ?? regioesBase[0];

  const estados = regiao.estados.map((e) => ({
    nome: e.nome,
    sigla: e.nome.slice(0, 2).toUpperCase(),
    total: e.cidades.reduce((s, c) => s + c.gb50 + c.gb80 + c.gb100, 0),
  }));
  const totalReg = estados.reduce((s, e) => s + e.total, 0) || 1;
  const max = Math.max(...estados.map((e) => e.total));

  return (
    <section
      className="rounded-[28px] p-6 md:p-7 mt-6"
      style={{
        background: "linear-gradient(180deg, #FFFFFF, #F6EFFB)",
        border: "1.5px solid #F6C756",
        boxShadow: "0 20px 50px rgba(106,13,173,.12)",
      }}
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <div
            className="shrink-0 w-14 h-14 rounded-full grid place-items-center"
            style={{
              background: "linear-gradient(180deg, #6A0DAD, #2A0050)",
              border: "2px solid #F6C756",
              boxShadow: "0 8px 18px rgba(74,0,117,.35)",
            }}
          >
            <Globe className="w-6 h-6 text-[#F6C756]" />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-black tracking-wide text-[#3A0068] uppercase">
              Distribuição por Região
            </h2>
            <p className="text-slate-500 text-sm">Selecione uma região para visualizar</p>
          </div>
        </div>
        <div className="relative">
          <select
            value={sel}
            onChange={(e) => setSel(e.target.value)}
            className="appearance-none pl-5 pr-12 py-2.5 rounded-xl font-bold text-white"
            style={{
              background: "linear-gradient(180deg, #8B2BE2, #4A0075)",
              border: "1.5px solid #F6C756",
              boxShadow: "0 8px 18px rgba(106,13,173,.35)",
            }}
          >
            {regioesBase.map((r) => (
              <option key={r.nome} value={r.nome} className="text-[#3A0068]">
                {r.nome}
              </option>
            ))}
          </select>
          <ChevronDown className="w-5 h-5 text-[#F6C756] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_1.2fr] gap-6 mt-5">
        {/* Map panel (dark purple) */}
        <div
          className="rounded-[24px] p-5 flex items-center gap-4"
          style={{
            background: "linear-gradient(160deg, #3A0068 0%, #1A0033 100%)",
            border: "1.5px solid #F6C756",
            boxShadow: "0 12px 30px rgba(26,0,51,.35)",
          }}
        >
          <div className="flex-1">
            <MapaBrasil3D destaque={sel} onSelect={setSel} />
          </div>
          <div className="text-center min-w-[150px]">
            <p className="text-[#F6C756] text-3xl font-black">{regiao.nome}</p>
            <p className="text-white text-5xl font-black my-1">
              {regiao.hoje.toString().padStart(2, "0")}
            </p>
            <p className="text-white/70 text-sm">ativações registradas</p>
            <div
              className="mt-3 inline-flex items-center gap-2 px-3 py-2 rounded-xl"
              style={{
                background: "rgba(0,0,0,.25)",
                border: "1.5px solid #F6C756",
              }}
            >
              <span className="text-[#F6C756] font-black">
                {regiao.percentual.toFixed(1).replace(".", ",")}%
              </span>
              <span className="text-white/80 text-xs">do total geral</span>
            </div>
          </div>
        </div>

        {/* Estados list */}
        <div className="flex flex-col gap-3">
          {estados.map((e, i) => (
            <div key={e.nome} className="grid grid-cols-[minmax(0,1fr)] gap-1">
              <p className="text-sm text-[#3A0068] font-semibold pl-[88px]">
                {e.nome}
              </p>
              <Bar3D
                rank={i + 1}
                label={e.sigla}
                value={e.total}
                max={max}
                trailing={`${((e.total / totalReg) * 100).toFixed(1).replace(".", ",")}%`}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}