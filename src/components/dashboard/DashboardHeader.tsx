import { PieChart } from "lucide-react";

export default function DashboardHeader() {
  return (
    <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 mb-6">
      <div className="flex min-w-0 items-center gap-4">
        <div
          className="shrink-0 w-14 h-14 rounded-2xl grid place-items-center"
          style={{
            background: "linear-gradient(180deg, #8B2BE2, #4A0075)",
            border: "2px solid #F6C756",
            boxShadow: "0 8px 18px rgba(106,13,173,.35)",
          }}
        >
          <PieChart className="w-7 h-7 text-white" />
        </div>
        <div className="min-w-0">
          <h1 className="truncate text-2xl md:text-4xl font-black text-[#3A0068]">
            Painel de Ativações SmartVoz
          </h1>
          <p className="text-slate-500 text-sm md:text-base">
            Acompanhamento em tempo real por estado e região
          </p>
        </div>
      </div>
      <div className="rounded-xl border border-[#E9DDF8] px-4 py-2 shadow-sm bg-white">
        <div className="flex items-center gap-2 font-bold text-[#3A0068]">
          <span className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
          Em tempo real
        </div>
        <p className="text-slate-500 text-xs">Atualizando a cada 3s</p>
      </div>
    </header>
  );
}