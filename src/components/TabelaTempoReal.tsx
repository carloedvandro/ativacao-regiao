import { Filter } from "lucide-react";
import { regioesBase, fmt } from "@/data/dados";

function MiniSignal({ active = 3 }: { active?: number }) {
  const bars = 4;
  return (
    <div className="flex items-end gap-[3px] h-5 justify-end">
      {Array.from({ length: bars }).map((_, i) => {
        const h = 8 + i * 4; // ascending heights: 8,12,16,20
        const on = i < active;
        return (
          <span
            key={i}
            className="w-[5px] rounded-[1px]"
            style={{
              height: `${h}px`,
              background: on ? "#3f3860" : "#d1d5db",
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
    <section className="mt-6 border rounded-2xl p-5 shadow-sm overflow-x-auto">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <h2 className="text-2xl font-black">Produção em tempo real</h2>
        <div className="flex gap-3">
          <button className="border rounded-lg px-4 py-2 text-purple-700 font-bold">Todos os estados</button>
          <button className="border rounded-lg px-4 py-2 text-purple-700 font-bold">Todos os planos</button>
          <button className="border rounded-lg px-4 py-2 text-purple-700 font-bold flex items-center gap-2">
            <Filter size={16} /> Filtros
          </button>
        </div>
      </div>
      <table className="w-full mt-6 text-sm">
        <thead>
          <tr className="text-slate-500 border-b">
            <th className="text-left py-3">Região</th>
            <th className="text-left py-3">Estado</th>
            <th className="text-left py-3">Cidade</th>
            <th className="py-3">50GB</th>
            <th className="py-3">80GB</th>
            <th className="py-3">100GB</th>
            <th className="py-3">Total</th>
            <th className="py-3">Variação hoje</th>
            <th className="py-3">Tendência</th>
          </tr>
        </thead>
        <tbody>
          {linhas.map((l, i) => (
            <tr key={`${l.regiao}-${l.estado}-${l.cidade}`} className="border-b hover:bg-purple-50/50 transition">
              <td className="py-3">
                <span className="inline-block w-3 h-3 rounded-full mr-2" style={{ background: l.cor }} />
                {l.regiao}
              </td>
              <td>{l.estado}</td>
              <td>{l.cidade}</td>
              <td className="text-center">{fmt(l.gb50)}</td>
              <td className="text-center">{fmt(l.gb80)}</td>
              <td className="text-center">{fmt(l.gb100)}</td>
              <td className="text-center font-black">{fmt(l.total)}</td>
              <td className="text-center text-green-600 font-bold">
                +{(6 + i * 0.7).toFixed(1).replace(".", ",")}%
              </td>
              <td>
                <MiniSignal active={2 + (i % 3)} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
