import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { regioesBase, fmt } from "@/data/dados";
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
      className="bg-white rounded-[32px] border border-[#E9DDF8] p-6 md:p-8 mt-8"
      style={{ boxShadow: "0 25px 70px rgba(106,13,173,.12)" }}
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-black text-[#3A0068]">
            Distribuição por Região
          </h2>
          <p className="text-slate-500">Visualização 3D e participação por estado</p>
        </div>
        <div className="relative">
          <select
            value={sel}
            onChange={(e) => setSel(e.target.value)}
            className="appearance-none pl-5 pr-12 py-3 rounded-xl font-bold text-white"
            style={{
              background: "linear-gradient(180deg, #8B2BE2, #4A0075)",
              border: "2px solid #F6C756",
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

      <div className="grid lg:grid-cols-[1.3fr_.9fr] gap-8 mt-6">
        <div>
          <MapaBrasil3D destaque={sel} onSelect={setSel} />
        </div>

        <div className="flex flex-col">
          <div
            className="rounded-2xl p-5 mb-4 text-white"
            style={{
              background: "linear-gradient(180deg, #8B2BE2, #4A0075)",
              border: "2px solid #F6C756",
            }}
          >
            <p className="uppercase tracking-widest text-xs opacity-80">
              Região selecionada
            </p>
            <h3 className="text-3xl font-black">{regiao.nome}</h3>
            <p className="text-[#F6C756] text-2xl font-black mt-1">
              {fmt(regiao.total)} ativações · {regiao.percentual.toFixed(1).replace(".", ",")}%
            </p>
          </div>

          <div className="flex flex-col gap-3">
            {estados.map((e) => (
              <div key={e.nome}>
                <Bar3D label={e.sigla} value={e.total} max={max} />
                <p className="text-xs text-slate-500 ml-12 mt-1">
                  {e.nome} · {((e.total / totalReg) * 100).toFixed(1).replace(".", ",")}%
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}