import DashboardHeader from "@/components/dashboard/DashboardHeader";
import AtivacoesPorEstado from "@/components/dashboard/AtivacoesPorEstado";
import DistribuicaoPorRegiao from "@/components/dashboard/DistribuicaoPorRegiao";
import ResumoTempoReal from "@/components/dashboard/ResumoTempoReal";

export default function DashboardRegioes() {
  return (
    <div className="min-h-screen bg-[#FAF7FF] text-[#140044]">
      <main className="w-full max-w-[1800px] mx-auto px-4 md:px-6 lg:px-10 py-6 md:py-10">
        <DashboardHeader />
        <AtivacoesPorEstado />
        <DistribuicaoPorRegiao />
        <ResumoTempoReal />
      </main>
    </div>
  );
}
