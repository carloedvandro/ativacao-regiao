import { Filter } from "lucide-react";
import { regioesBase, fmt } from "@/data/dados";

function MiniSignal({ active = 3, color = "#3f3860" }: { active?: number; color?: string }) {
  const bars = 7;
  return (
    <div className="flex items-end gap-[2px] h-[18px] justify-end">
      {Array.from({ length: bars }).map((_, i) => {
        const h = 5 + i * 2; // ascending heights: 5,7,9,11,13,15,17
        const on = i < active;
        return (
          <span
            key={i}
            className="w-[2.5px] rounded-[1px]"
            style={{
              height: `${h}px`,
              background: on ? color : "#d1d5db",
              opacity: on ? 0.3 + i * 0.1 : 1,
            }}
          />
        );
      })}
    </div>
  );
}

export default function TabelaTempoReal() {
  const linhas = regioesBase.flatMap((regiao) =>
    regiao.estados.flatMap((estado) =>
      estado.cidades.map((cidade) => ({
        regiao: regiao.nome,
        cor: regiao.cor,
        estado: estado.nome,
        cidade: cidade.nome,
        ...cidade,
        total: cidade.gb50 + cidade.gb80 + cidade.gb100,
      })),
    ),
  );

  return (
    <section className="mt-6 rounded-2xl border border-gray-200/80 bg-white p-5 shadow-[0_2px_8px_rgba(0,0,0,0.04)] overflow-x-auto">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <h2 className="text-2xl font-black text-[#140044]">Produção em tempo real</h2>
        <div className="flex flex-wrap items-center gap-2">
          <button className="inline-flex h-10 items-center gap-2 rounded-xl border border-gray-200 bg-white px-3.5 text-sm font-bold text-[#6A0DAD] shadow-sm transition hover:border-gray-300">
            Todos os estados
          </button>
          <button className="inline-flex h-10 items-center gap-2 rounded-xl border border-gray-200 bg-white px-3.5 text-sm font-bold text-[#6A0DAD] shadow-sm transition hover:border-gray-300">
            Todos os planos
          </button>
          <button className="inline-flex h-10 items-center gap-2 rounded-xl border border-gray-200 bg-white px-3.5 text-sm font-bold text-[#6A0DAD] shadow-sm transition hover:border-gray-300">
            <Filter size={16} /> Filtros
          </button>
        </div>
      </div>
      <table className="w-full mt-6 text-sm">
        <thead>
          <tr className="border-b border-gray-100 bg-gray-50/60 text-left text-[11px] font-black uppercase tracking-wider text-[#8b86a0]">
            <th className="py-3.5 pl-5 pr-3">Região</th>
            <th className="py-3.5 pr-3">Estado</th>
            <th className="py-3.5 pr-3">Cidade</th>
            <th className="py-3.5 pr-3 text-center">50GB</th>
            <th className="py-3.5 pr-3 text-center">80GB</th>
            <th className="py-3.5 pr-3 text-center">100GB</th>
            <th className="py-3.5 pr-3 text-center">Total</th>
            <th className="py-3.5 pr-3 text-center">Variação hoje</th>
            <th className="py-3.5 pr-5 text-center">Tendência</th>
          </tr>
        </thead>
        <tbody>
          {linhas.map((l, i) => (
            <tr key={`${l.regiao}-${l.estado}-${l.cidade}`} className="border-b border-gray-100/80 hover:bg-gray-50/60 transition">
              <td className="py-3.5 pl-5">
                <span className="flex items-center gap-3 font-bold text-[#140044]">
                  <span className="inline-block h-2 w-2 rounded-full" style={{ background: l.cor }} />
                  {l.regiao}
                </span>
              </td>
              <td className="py-3.5 text-[#3f3860]">{l.estado}</td>
              <td className="py-3.5 text-[#3f3860]">{l.cidade}</td>
              <td className="py-3.5 text-center tabular-nums text-[#3f3860]">{fmt(l.gb50)}</td>
              <td className="py-3.5 text-center tabular-nums text-[#3f3860]">{fmt(l.gb80)}</td>
              <td className="py-3.5 text-center tabular-nums text-[#3f3860]">{fmt(l.gb100)}</td>
              <td className="py-3.5 text-center font-black tabular-nums text-[#140044]">{fmt(l.total)}</td>
              <td className="py-3.5 text-center text-[13px] font-bold text-emerald-600">
                +{(6 + i * 0.7).toFixed(1).replace(".", ",")}%
              </td>
              <td className="py-3.5 pr-5">
                <div className="flex justify-center">
                  <MiniSignal active={2 + (i % 3)} color={l.cor} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
