import React, { useEffect, useMemo, useState } from "react";
import { BarChart3, ChevronDown, Filter, Grid3X3, PieChart, RefreshCw } from "lucide-react";

const regioesBase = [
  {
    nome: "Sudeste",
    cor: "#ec1677",
    total: 14142,
    percentual: 30.4,
    hoje: 12,
    estados: [
      {
        nome: "São Paulo",
        cidades: [
          { nome: "São Paulo", gb50: 1842, gb80: 2156, gb100: 2394 },
          { nome: "Campinas", gb50: 612, gb80: 724, gb100: 812 },
          { nome: "Ribeirão Preto", gb50: 312, gb80: 356, gb100: 398 },
        ],
      },
    ],
  },
  {
    nome: "Sul",
    cor: "#049b16",
    total: 13048,
    percentual: 28.1,
    hoje: 9,
    estados: [
      {
        nome: "Paraná",
        cidades: [
          { nome: "Curitiba", gb50: 1532, gb80: 1842, gb100: 2068 },
          { nome: "Londrina", gb50: 468, gb80: 552, gb100: 636 },
          { nome: "Maringá", gb50: 368, gb80: 420, gb100: 492 },
        ],
      },
    ],
  },
  {
    nome: "Nordeste",
    cor: "#8a18f5",
    total: 6598,
    percentual: 14.2,
    hoje: 7,
    estados: [
      {
        nome: "Bahia",
        cidades: [
          { nome: "Salvador", gb50: 1204, gb80: 1468, gb100: 1628 },
          { nome: "Feira de Santana", gb50: 392, gb80: 468, gb100: 520 },
        ],
      },
    ],
  },
  {
    nome: "Centro-Oeste",
    cor: "#098da8",
    total: 4655,
    percentual: 10.0,
    hoje: 4,
    estados: [
      {
        nome: "Goiás",
        cidades: [
          { nome: "Goiânia", gb50: 876, gb80: 1052, gb100: 1156 },
          { nome: "Aparecida de Goiânia", gb50: 324, gb80: 384, gb100: 428 },
        ],
      },
    ],
  },
  {
    nome: "Norte",
    cor: "#4b13d6",
    total: 3597,
    percentual: 7.7,
    hoje: 3,
    estados: [
      {
        nome: "Pará",
        cidades: [
          { nome: "Belém", gb50: 652, gb80: 796, gb100: 872 },
          { nome: "Ananindeua", gb50: 212, gb80: 248, gb100: 276 },
        ],
      },
    ],
  },
];

function fmt(n: number) {
  return n.toLocaleString("pt-BR");
}

function MiniSignal() {
  return (
    <div className="flex items-end gap-[3px] h-5 justify-end">
      <span className="w-[4px] h-2 rounded bg-green-500 animate-pulse" />
      <span className="w-[4px] h-3 rounded bg-green-500 animate-pulse delay-75" />
      <span className="w-[4px] h-4 rounded bg-green-500 animate-pulse delay-150" />
      <span className="w-[4px] h-5 rounded bg-green-500 animate-pulse delay-300" />
    </div>
  );
}

function Donut3D() {
  return (
    <div className="relative mx-auto mt-2 w-full max-w-[760px] h-[430px] flex items-center justify-center">
      <div className="absolute bottom-[38px] w-[520px] h-[90px] bg-black/35 blur-2xl rounded-full" />
      <svg viewBox="0 0 760 430" className="relative w-full h-full drop-shadow-2xl">
        <defs>
          <filter id="shadow">
            <feDropShadow dx="0" dy="10" stdDeviation="7" floodOpacity="0.35" />
          </filter>
          <linearGradient id="pink" x1="0" x2="1">
            <stop offset="0%" stopColor="#ff2b91" />
            <stop offset="100%" stopColor="#b90052" />
          </linearGradient>
          <linearGradient id="green" x1="0" x2="1">
            <stop offset="0%" stopColor="#08c324" />
            <stop offset="100%" stopColor="#006c10" />
          </linearGradient>
          <linearGradient id="purple" x1="0" x2="1">
            <stop offset="0%" stopColor="#a929ff" />
            <stop offset="100%" stopColor="#4b008e" />
          </linearGradient>
          <linearGradient id="cyan" x1="0" x2="1">
            <stop offset="0%" stopColor="#16bfd1" />
            <stop offset="100%" stopColor="#056e83" />
          </linearGradient>
          <linearGradient id="blue" x1="0" x2="1">
            <stop offset="0%" stopColor="#5c22ff" />
            <stop offset="100%" stopColor="#21006e" />
          </linearGradient>
        </defs>
        <ellipse cx="380" cy="250" rx="250" ry="145" fill="#000" opacity="0.13" />
        <path d="M380 65 A250 145 0 0 1 610 180 L500 220 A130 75 0 0 0 380 145 Z" fill="url(#pink)" filter="url(#shadow)" />
        <path d="M610 180 A250 145 0 0 1 505 350 L450 265 A130 75 0 0 0 500 220 Z" fill="url(#green)" filter="url(#shadow)" />
        <path d="M505 350 A250 145 0 0 1 205 330 L300 255 A130 75 0 0 0 450 265 Z" fill="url(#purple)" filter="url(#shadow)" />
        <path d="M205 330 A250 145 0 0 1 165 165 L280 210 A130 75 0 0 0 300 255 Z" fill="url(#cyan)" filter="url(#shadow)" />
        <path d="M165 165 A250 145 0 0 1 380 65 L380 145 A130 75 0 0 0 280 210 Z" fill="url(#blue)" filter="url(#shadow)" />
        <ellipse cx="380" cy="220" rx="135" ry="76" fill="white" />
        <ellipse cx="380" cy="225" rx="120" ry="62" fill="#f7f7f7" opacity="0.9" />
        <text x="380" y="126" textAnchor="middle" fontSize="33" fontWeight="900" fill="white">30,4%</text>
        <text x="545" y="230" textAnchor="middle" fontSize="31" fontWeight="900" fill="white">28,1%</text>
        <text x="330" y="315" textAnchor="middle" fontSize="31" fontWeight="900" fill="white">14,2%</text>
        <text x="220" y="225" textAnchor="middle" fontSize="31" fontWeight="900" fill="white">10,0%</text>
        <text x="270" y="145" textAnchor="middle" fontSize="30" fontWeight="900" fill="white">7,7%</text>
      </svg>
    </div>
  );
}

export default function DashboardRegioes() {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setTick((v) => v + 1), 3000);
    return () => clearInterval(timer);
  }, []);

  const total = useMemo(() => regioesBase.reduce((s, r) => s + r.total, 0), [tick]);

  const linhas = regioesBase.flatMap((regiao) =>
    regiao.estados.flatMap((estado) =>
      estado.cidades.map((cidade) => ({
        regiao: regiao.nome,
        cor: regiao.cor,
        estado: estado.nome,
        cidade: cidade.nome,
        ...cidade,
        total: cidade.gb50 + cidade.gb80 + cidade.gb100,
      }))
    )
  );

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

        <div className="relative">
          <Donut3D />
        </div>

        <div className="mx-auto w-fit px-8 py-4 rounded-xl border shadow-sm flex items-center gap-5">
          <BarChart3 className="text-purple-700 fill-purple-700" />
          <span className="text-slate-500">Total de ativações</span>
          <strong className="text-3xl text-purple-700">{fmt(total)}</strong>
        </div>

        <div className="text-center text-slate-500 mt-4 flex items-center justify-center gap-2">
          <RefreshCw className="w-4 h-4 animate-spin" />
          Atualizado agora há poucos segundos
        </div>

        <section className="mt-8 border rounded-2xl p-5 shadow-sm">
          <div className="flex justify-between">
            <h2 className="text-2xl font-black">Detalhamento por Região <span className="text-base font-normal">(em tempo real)</span></h2>
            <span className="text-purple-700 font-bold flex gap-2 items-center">Ver tabela completa <Grid3X3 size={18} /></span>
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
                  <div className="h-1.5 rounded" style={{ width: `${r.percentual * 2}%`, background: r.cor }} />
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

        <section className="mt-6 border rounded-2xl p-5 shadow-sm overflow-x-auto">
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <h2 className="text-2xl font-black">Produção em tempo real</h2>
            <div className="flex gap-3">
              <button className="border rounded-lg px-4 py-2 text-purple-700 font-bold">Todos os estados</button>
              <button className="border rounded-lg px-4 py-2 text-purple-700 font-bold">Todos os planos</button>
              <button className="border rounded-lg px-4 py-2 text-purple-700 font-bold flex items-center gap-2"><Filter size={16} /> Filtros</button>
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
                  <td className="text-center text-green-600 font-bold">+{(6 + i * 0.7).toFixed(1).replace(".", ",")}%</td>
                  <td><MiniSignal /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <p className="text-center text-slate-500 mt-4">
          ⓘ Os dados são atualizados automaticamente em tempo real. Última atualização: 11/06/2026 às 11:57:36
        </p>
      </div>
    </div>
  );
}
