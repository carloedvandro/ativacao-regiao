import { Rocket, TrendingUp, Clock, Users } from "lucide-react";
import { regioesBase, fmt } from "@/data/dados";

function Card3D({
  icon: Icon,
  titulo,
  valor,
  delta,
}: {
  icon: typeof Rocket;
  titulo: string;
  valor: string;
  delta: string;
}) {
  return (
    <div
      className="bg-white rounded-[24px] border border-[#E9DDF8] p-5 flex gap-4 items-center"
      style={{ boxShadow: "0 18px 40px rgba(106,13,173,.10)" }}
    >
      <div
        className="shrink-0 w-14 h-14 rounded-2xl grid place-items-center"
        style={{
          background: "linear-gradient(180deg, #8B2BE2, #4A0075)",
          border: "2px solid #F6C756",
          boxShadow: "0 8px 18px rgba(106,13,173,.35), inset 0 2px 4px rgba(255,255,255,.25)",
        }}
      >
        <Icon className="w-7 h-7 text-[#F6C756]" />
      </div>
      <div className="min-w-0">
        <p className="text-slate-500 text-sm">{titulo}</p>
        <p className="text-2xl font-black text-[#3A0068] truncate">{valor}</p>
        <p className="text-green-600 text-xs font-bold">{delta}</p>
      </div>
    </div>
  );
}

export default function ResumoTempoReal() {
  const total = regioesBase.reduce((s, r) => s + r.total, 0);
  const hoje = regioesBase.reduce((s, r) => s + r.hoje, 0);

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-8">
      <Card3D icon={Rocket} titulo="Ativações totais" valor={fmt(total)} delta={`+${hoje} hoje`} />
      <Card3D icon={TrendingUp} titulo="Crescimento" valor="+12,4%" delta="vs semana anterior" />
      <Card3D icon={Clock} titulo="Tempo real" valor="3s" delta="intervalo de atualização" />
      <Card3D icon={Users} titulo="Clientes ativos" valor={fmt(Math.round(total * 0.82))} delta="+2,1% no mês" />
    </section>
  );
}