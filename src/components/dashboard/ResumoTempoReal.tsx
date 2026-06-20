import { Rocket, TrendingUp, Clock, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { regioesBase, fmt } from "@/data/dados";

function Card({
  icon: Icon,
  titulo,
  valor,
  sub,
  highlight,
}: {
  icon: typeof Rocket;
  titulo: string;
  valor: React.ReactNode;
  sub: string;
  highlight?: "gold" | "green";
}) {
  const valorColor = highlight === "green" ? "#22c55e" : "#F6C756";
  return (
    <div
      className="rounded-[22px] p-5 flex gap-4 items-center"
      style={{
        background: "linear-gradient(160deg, #3A0068 0%, #1A0033 100%)",
        border: "1.5px solid #F6C756",
        boxShadow: "0 14px 30px rgba(26,0,51,.35)",
      }}
    >
      <div
        className="shrink-0 w-14 h-14 rounded-2xl grid place-items-center"
        style={{
          background: "radial-gradient(circle at 30% 30%, #F8E08E, #C9A24C 70%, #6E4E14)",
          boxShadow: "0 6px 14px rgba(0,0,0,.35), inset 0 2px 3px rgba(255,255,255,.3)",
        }}
      >
        <Icon className="w-7 h-7 text-[#3A0068]" strokeWidth={2.5} />
      </div>
      <div className="min-w-0">
        <p className="uppercase tracking-widest text-xs text-white/70">{titulo}</p>
        <p className="text-3xl font-black truncate" style={{ color: valorColor }}>
          {valor}
        </p>
        <p className="text-white/70 text-xs">{sub}</p>
      </div>
    </div>
  );
}

export default function ResumoTempoReal() {
  const total = regioesBase.reduce((s, r) => s + r.total, 0);
  const hoje = regioesBase.reduce((s, r) => s + r.hoje, 0);
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  const hora = now.toLocaleTimeString("pt-BR", { hour12: false });

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-6">
      <Card icon={Rocket} titulo="Total de ativações" valor={hoje} sub="Hoje" />
      <Card
        icon={TrendingUp}
        titulo="Crescimento (24h)"
        valor="+18,6%"
        sub="em relação a ontem"
        highlight="green"
      />
      <Card icon={Clock} titulo="Tempo real" valor={hora} sub="Atualizado agora" />
      <Card icon={Users} titulo="Clientes ativos" valor={fmt(Math.round(total * 0.082))} sub="Total" />
    </section>
  );
}