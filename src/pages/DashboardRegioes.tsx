import { useEffect, useMemo, useState } from "react";
import { BarChart3, ChevronDown, PieChart, RefreshCw } from "lucide-react";
import Grafico3D from "@/components/Grafico3D";
import EstadosPorRegiao from "@/components/EstadosPorRegiao";
import EstadosDaRegiao from "@/components/EstadosDaRegiao";
import TabelaTempoReal from "@/components/TabelaTempoReal";
import { regioesBase, fmt } from "@/data/dados";

export default function DashboardRegioes() {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setTick((v) => v + 1), 3000);
    return () => clearInterval(timer);
  }, []);

  const total = useMemo(() => regioesBase.reduce((s, r) => s + r.total, 0), [tick]);

  return (
    <div className="min-h-screen bg-[#faf7ff] p-4 md:p-8 text-[#140044]">
      <div className="max-w-[1240px] mx-auto bg-white rounded-[24px] border border-purple-100 shadow-xl p-5 md:p-8">
        <div className="flex justify-between items-start gap-4">
          <div className="flex gap-4 items-start">
            <PieChart className="w-10 h-10 text-purple-700 fill-purple-700" />
            <div>
              <h1 className="text-3xl md:text-5xl font-black">Distribuição por Região</h1>
              <p className="text-slate-500 mt-2 text-lg">Ativações SmartVoz por região</p>
            </div>
          </div>
          <div className="border rounded-xl px-5 py-3 shadow-sm">
            <div className="flex items-center gap-2 font-bold">
              <span className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
              Em tempo real
            </div>
            <p className="text-slate-500 text-sm">Atualizando a cada 3s</p>
          </div>
        </div>

        <div className="flex justify-center mt-6">
          <button className="px-8 py-4 border-2 border-purple-600 rounded-xl text-purple-700 font-bold flex items-center gap-3 shadow-sm">
            <PieChart className="w-6 h-6 fill-purple-700" />
            Distribuição por Região
            <ChevronDown className="w-5 h-5" />
          </button>
        </div>

        <Grafico3D />

        <div className="mx-auto w-fit px-8 py-4 rounded-xl border shadow-sm flex items-center gap-5">
          <BarChart3 className="text-purple-700 fill-purple-700" />
          <span className="text-slate-500">Total de ativações</span>
          <strong className="text-3xl text-purple-700">{fmt(total)}</strong>
        </div>

        <div className="text-center text-slate-500 mt-4 flex items-center justify-center gap-2">
          <RefreshCw className="w-4 h-4 animate-spin" />
          Atualizado agora há poucos segundos
        </div>

        <EstadosPorRegiao />
        <EstadosDaRegiao regiaoNome="Sudeste" />
        <TabelaTempoReal />

        <p className="text-center text-slate-500 mt-4">
          ⓘ Os dados são atualizados automaticamente em tempo real. Última atualização: 11/06/2026 às 11:57:36
        </p>
      </div>
    </div>
  );
}
