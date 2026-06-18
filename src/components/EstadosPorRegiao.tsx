import { Grid3X3 } from "lucide-react";
import { regioesBase, fmt } from "@/data/dados";

export default function EstadosPorRegiao() {
  return (
    <section className="mt-8 border rounded-2xl p-5 shadow-sm">
      <div className="flex justify-between">
        <h2 className="text-2xl font-black">
          Detalhamento por Região <span className="text-base font-normal">(em tempo real)</span>
        </h2>
        <span className="text-purple-700 font-bold flex gap-2 items-center">
          Ver tabela completa <Grid3X3 size={18} />
        </span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-5 mt-6">
        {regioesBase.map((r) => (
          <div key={r.nome} className="rounded-xl border p-5 shadow-sm">
            <strong style={{ color: r.cor }}>{r.nome}</strong>
            <h3 className="text-3xl font-black mt-3">{fmt(r.total)}</h3>
            <p className="text-2xl font-black mt-2" style={{ color: r.cor }}>
              {r.percentual.toFixed(1).replace(".", ",")}%
            </p>
            <div className="h-1.5 bg-slate-100 rounded mt-4">
              <div
                className="h-1.5 rounded"
                style={{ width: `${r.percentual * 2}%`, background: r.cor }}
              />
            </div>
            <p className="text-green-600 mt-4">↗ {r.hoje} hoje</p>
            <p className="text-slate-500 text-sm mt-3">Atualizado agora</p>
          </div>
        ))}
      </div>
      <p className="text-center mt-6 text-slate-500">
        <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-2 animate-pulse" />
        Dados atualizados automaticamente a cada 3 segundos
      </p>
    </section>
  );
}
