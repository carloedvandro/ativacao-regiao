import { ChevronDown, Clock } from "lucide-react";
import { useNow } from "@/hooks/useNow";

export default function DashboardStatusBar() {
  const now = useNow();
  const hora = now.toLocaleTimeString("pt-BR", { hour12: false });
  return (
    <div className="flex items-center gap-3 flex-wrap">
      <div
        className="flex items-center gap-2 px-4 py-2 rounded-full bg-white"
        style={{ border: "1.5px solid #F6C756", boxShadow: "0 4px 12px rgba(106,13,173,.10)" }}
      >
        <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
        <span className="font-black text-green-600 text-sm tracking-wide">ONLINE</span>
      </div>
      <div className="flex items-center gap-2 text-[#3A0068]">
        <Clock className="w-5 h-5 text-[#6A0DAD]" />
        <div className="leading-tight">
          <p className="text-xs text-slate-500">Atualizado agora</p>
          <p className="font-black tabular-nums">{hora}</p>
        </div>
      </div>
      <button
        className="flex items-center gap-2 px-4 py-2 rounded-xl text-white font-bold"
        style={{
          background: "linear-gradient(180deg, #8B2BE2, #4A0075)",
          border: "1.5px solid #F6C756",
          boxShadow: "0 8px 18px rgba(106,13,173,.35)",
        }}
      >
        Hoje <ChevronDown className="w-4 h-4 text-[#F6C756]" />
      </button>
    </div>
  );
}