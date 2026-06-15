import { useEffect, useMemo, useState } from "react";
import {
  BarChart3,
  Clock3,
  Download,
  RefreshCw,
  Trophy,
  ChevronDown,
  Check,
} from "lucide-react";
import "./DistribuicaoRegiao.css";

type EstadoItem = {
  uf: string;
  nome: string;
  ativacoes: number;
  variacao: number;
};

type RegiaoItem = {
  id: string;
  nome: string;
  cor: string;
  percentual: number;
  ativacoes: number;
  variacao: number;
  descricao: string;
  sliceClass: string;
  calloutClass: string;
  estados: EstadoItem[];
};

const REGIOES: RegiaoItem[] = [
  {
    id: "sudeste",
    nome: "Sudeste",
    cor: "#079B1E",
    percentual: 30.4,
    ativacoes: 14212,
    variacao: 8.7,
    descricao: "Total de ativações realizadas na região Sudeste no período selecionado.",
    sliceClass: "slice-sudeste",
    calloutClass: "callout-sudeste",
    estados: [
      { uf: "SP", nome: "São Paulo", ativacoes: 7836, variacao: 9.5 },
      { uf: "MG", nome: "Minas Gerais", ativacoes: 3125, variacao: 7.1 },
      { uf: "RJ", nome: "Rio de Janeiro", ativacoes: 2134, variacao: 6.2 },
      { uf: "ES", nome: "Espírito Santo", ativacoes: 1117, variacao: 4.3 },
    ],
  },
  {
    id: "sul",
    nome: "Sul",
    cor: "#F01483",
    percentual: 28.3,
    ativacoes: 13225,
    variacao: 11.3,
    descricao: "Total de ativações realizadas na região Sul no período selecionado.",
    sliceClass: "slice-sul",
    calloutClass: "callout-sul",
    estados: [
      { uf: "RS", nome: "Rio Grande do Sul", ativacoes: 6102, variacao: 10.9 },
      { uf: "PR", nome: "Paraná", ativacoes: 4120, variacao: 8.2 },
      { uf: "SC", nome: "Santa Catarina", ativacoes: 3003, variacao: 6.4 },
    ],
  },
  {
    id: "norte",
    nome: "Norte",
    cor: "#5B18E8",
    percentual: 15.2,
    ativacoes: 7114,
    variacao: 6.1,
    descricao: "Total de ativações realizadas na região Norte no período selecionado.",
    sliceClass: "slice-norte",
    calloutClass: "callout-norte",
    estados: [
      { uf: "AM", nome: "Amazonas", ativacoes: 3120, variacao: 5.8 },
      { uf: "PA", nome: "Pará", ativacoes: 2380, variacao: 4.8 },
      { uf: "RO", nome: "Rondônia", ativacoes: 884, variacao: 3.1 },
      { uf: "TO", nome: "Tocantins", ativacoes: 730, variacao: 2.6 },
    ],
  },
  {
    id: "centro-oeste",
    nome: "Centro-Oeste",
    cor: "#14B8A6",
    percentual: 10.9,
    ativacoes: 5098,
    variacao: 9.4,
    descricao: "Total de ativações realizadas na região Centro-Oeste no período selecionado.",
    sliceClass: "slice-centro",
    calloutClass: "callout-centro-oeste",
    estados: [
      { uf: "GO", nome: "Goiás", ativacoes: 2350, variacao: 8.4 },
      { uf: "DF", nome: "Distrito Federal", ativacoes: 1248, variacao: 6.2 },
      { uf: "MT", nome: "Mato Grosso", ativacoes: 860, variacao: 5.1 },
      { uf: "MS", nome: "Mato Grosso do Sul", ativacoes: 640, variacao: 3.9 },
    ],
  },
  {
    id: "nordeste",
    nome: "Nordeste",
    cor: "#B523F5",
    percentual: 8.7,
    ativacoes: 4058,
    variacao: -2.3,
    descricao: "Total de ativações realizadas na região Nordeste no período selecionado.",
    sliceClass: "slice-nordeste",
    calloutClass: "callout-nordeste",
    estados: [
      { uf: "BA", nome: "Bahia", ativacoes: 1320, variacao: 2.2 },
      { uf: "PE", nome: "Pernambuco", ativacoes: 890, variacao: -1.4 },
      { uf: "CE", nome: "Ceará", ativacoes: 740, variacao: 1.1 },
      { uf: "MA", nome: "Maranhão", ativacoes: 610, variacao: -0.8 },
      { uf: "PB", nome: "Paraíba", ativacoes: 498, variacao: 0.9 },
    ],
  },
  {
    id: "outros",
    nome: "Outros / Exterior",
    cor: "#FF8A00",
    percentual: 6.5,
    ativacoes: 3075,
    variacao: 4.8,
    descricao: "Total de ativações realizadas em Outros / Exterior no período selecionado.",
    sliceClass: "slice-outros",
    calloutClass: "callout-outros",
    estados: [
      { uf: "EXT", nome: "Exterior", ativacoes: 1850, variacao: 3.6 },
      { uf: "OUT", nome: "Outros", ativacoes: 1225, variacao: 2.7 },
    ],
  },
];

const TOTAL_ATIVACOES = REGIOES.reduce((sum, item) => sum + item.ativacoes, 0);

function formatNumber(value: number) {
  return new Intl.NumberFormat("pt-BR").format(value);
}

function formatPercent(value: number) {
  return `${value.toFixed(1).replace(".", ",")}%`;
}

function Variation({ value }: { value: number }) {
  const positive = value >= 0;
  return (
    <em className={`variation ${positive ? "up" : "down"}`}>
      {positive ? "▲" : "▼"} {formatPercent(Math.abs(value))}
    </em>
  );
}

export default function DistribuicaoRegiao() {
  const [selectedId, setSelectedId] = useState<string>("all");
  const [open, setOpen] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [pulse, setPulse] = useState(false);
  const [sortRegions, setSortRegions] = useState<"participacao" | "ativacoes">("participacao");
  const [sortStates, setSortStates] = useState<"ativacoes" | "variacao">("ativacoes");

  useEffect(() => {
    const interval = window.setInterval(() => {
      setLastUpdate(new Date());
      setPulse(true);
      window.setTimeout(() => setPulse(false), 750);
    }, 10000);
    return () => window.clearInterval(interval);
  }, []);

  const selectedRegion = useMemo(
    () => REGIOES.find((item) => item.id === selectedId) ?? null,
    [selectedId]
  );

  const leader = useMemo(
    () => [...REGIOES].sort((a, b) => b.ativacoes - a.ativacoes)[0],
    []
  );

  const sortedRegions = useMemo(() => {
    return [...REGIOES].sort((a, b) =>
      sortRegions === "participacao"
        ? b.percentual - a.percentual
        : b.ativacoes - a.ativacoes
    );
  }, [sortRegions]);

  const tableRegion = selectedRegion ?? leader;

  const statesToShow = useMemo(() => {
    const list = tableRegion.estados;
    return [...list].sort((a, b) =>
      sortStates === "ativacoes" ? b.ativacoes - a.ativacoes : b.variacao - a.variacao
    );
  }, [tableRegion, sortStates]);

  const selectLabel = selectedRegion?.nome ?? "Todas as regiões";

  function selectRegion(id: string) {
    setSelectedId(id);
    setOpen(false);
    setPulse(true);
    window.setTimeout(() => setPulse(false), 750);
  }

  function exportCSV() {
    const rows = [
      ["Região", "Ativações", "Participação", "Variação"],
      ...REGIOES.map((item) => [
        item.nome,
        String(item.ativacoes),
        formatPercent(item.percentual),
        formatPercent(item.variacao),
      ]),
    ];
    const csv = rows.map((row) => row.join(";")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "distribuicao-regiao-smartvoz.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="smartvoz-region-page">
      <div className="smartvoz-region-card">
        <div className="realtime-badge">
          <span className="live-dot" />
          Atualização em tempo real
        </div>

        <header className="region-header">
          <h1>Distribuição por Região</h1>
          <p>Ativações SmartVoz por região</p>

          <div className="region-select">
            <button
              type="button"
              className="region-select-button"
              onClick={() => setOpen((v) => !v)}
            >
              <BarChart3 size={22} color="#6a0dad" />
              <span>{selectLabel}</span>
              <ChevronDown size={20} className={open ? "rotate" : ""} />
            </button>

            {open && (
              <div className="region-menu" role="listbox">
                <button
                  type="button"
                  className={selectedId === "all" ? "active" : ""}
                  onClick={() => selectRegion("all")}
                >
                  <BarChart3 size={18} color="#6a0dad" />
                  <span>Todas as regiões</span>
                  {selectedId === "all" && <Check size={18} />}
                </button>
                {REGIOES.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className={selectedId === item.id ? "active" : ""}
                    onClick={() => selectRegion(item.id)}
                  >
                    <i className="menu-color" style={{ background: item.cor }} />
                    <span>{item.nome}</span>
                    {selectedId === item.id && <Check size={18} />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </header>

        <div className="chart-zone">
          <div className={`donut-3d ${pulse ? "pulse" : ""}`}>
            <div className="slice slice-norte"><span>15,2%</span></div>
            <div className="slice slice-sul"><span>28,3%</span></div>
            <div className="slice slice-sudeste"><span>30,4%</span></div>
            <div className="slice slice-outros"><span>6,5%</span></div>
            <div className="slice slice-nordeste"><span>8,7%</span></div>
            <div className="slice slice-centro"><span>10,9%</span></div>
            <div className="donut-hole" />
          </div>

          {REGIOES.map((region) => (
            <button
              key={region.id}
              type="button"
              className={`callout ${region.calloutClass} ${
                selectedId === region.id ? "selected" : ""
              }`}
              onClick={() => selectRegion(region.id)}
              style={{ color: region.cor }}
            >
              <strong>{region.nome}</strong>
              <span>{region.descricao}</span>
            </button>
          ))}

          <div className="total-pill">
            <BarChart3 size={20} color="#6a0dad" />
            <span>Total de ativações</span>
            <strong>{formatNumber(TOTAL_ATIVACOES)}</strong>
          </div>
        </div>

        <div className="summary-grid">
          <div className="summary-card">
            <div className="summary-icon"><BarChart3 size={28} /></div>
            <div>
              <span>Total de ativações</span>
              <strong>{formatNumber(TOTAL_ATIVACOES)}</strong>
              <small>Período selecionado</small>
              <em>▲ 12,5% <span style={{ color: "#667085", fontWeight: 600 }}>vs período anterior</span></em>
            </div>
          </div>

          <div className="summary-card">
            <div className="summary-icon" style={{ background: "#e8f7ec", color: "#079b1e" }}>
              <Trophy size={28} />
            </div>
            <div>
              <span>Região líder</span>
              <strong>{leader.nome}</strong>
              <small>{formatNumber(leader.ativacoes)} ativações</small>
              <em>{formatPercent(leader.percentual)} do total</em>
            </div>
          </div>

          <div className="summary-card">
            <div className="summary-icon" style={{ background: "#e8f1ff", color: "#1f6feb" }}>
              <Clock3 size={28} />
            </div>
            <div>
              <span>Atualização</span>
              <strong>Em tempo real</strong>
              <small>Dados atualizados</small>
              <em className="now" style={{ background: "transparent", color: "#008c4a", padding: 0 }}>
                Agora mesmo
              </em>
            </div>
          </div>
        </div>

        <div className="tables-grid">
          <div className="data-table-card">
            <div className="table-head">
              <h2><strong>Regiões</strong></h2>
              <label>
                Ordenar por
                <select
                  value={sortRegions}
                  onChange={(e) => setSortRegions(e.target.value as "participacao" | "ativacoes")}
                >
                  <option value="participacao">Participação</option>
                  <option value="ativacoes">Ativações</option>
                </select>
              </label>
            </div>

            <div className="table-row head">
              <span>Região</span>
              <span>Ativações</span>
              <span>Participação</span>
              <span>Variação</span>
            </div>

            {sortedRegions.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`table-row ${selectedId === item.id ? "selected" : ""}`}
                onClick={() => selectRegion(item.id)}
              >
                <span className="region-name">
                  <i style={{ background: item.cor }} />
                  {item.nome}
                </span>
                <span>{formatNumber(item.ativacoes)}</span>
                <span>
                  <b>{formatPercent(item.percentual)}</b>
                  <em className="bar-track">
                    <i className="bar-fill" style={{ width: `${item.percentual * 2.5}%`, background: item.cor }} />
                  </em>
                </span>
                <Variation value={item.variacao} />
              </button>
            ))}

            <p className="table-footer">Exibindo 1 a 6 de 6 regiões</p>
          </div>

          <div className="data-table-card">
            <div className="table-head">
              <h2>Estados da região <strong>{tableRegion.nome}</strong></h2>
              <label>
                Ordenar por
                <select
                  value={sortStates}
                  onChange={(e) => setSortStates(e.target.value as "ativacoes" | "variacao")}
                >
                  <option value="ativacoes">Ativações</option>
                  <option value="variacao">Variação</option>
                </select>
              </label>
            </div>

            <div className="table-row head">
              <span>Estado</span>
              <span>Ativações</span>
              <span>Participação</span>
              <span>Variação</span>
            </div>

            {statesToShow.map((item) => {
              const percent = (item.ativacoes / tableRegion.ativacoes) * 100;
              return (
                <div className="table-row" key={item.uf}>
                  <span className="region-name">
                    <i style={{ background: tableRegion.cor }} />
                    {item.uf}
                  </span>
                  <span>{formatNumber(item.ativacoes)}</span>
                  <span>
                    <b>{formatPercent(percent)}</b>
                    <em className="bar-track">
                      <i className="bar-fill" style={{ width: `${percent}%`, background: tableRegion.cor }} />
                    </em>
                  </span>
                  <Variation value={item.variacao} />
                </div>
              );
            })}

            <div className="table-row total">
              <span>Total {tableRegion.nome}</span>
              <span>{formatNumber(tableRegion.ativacoes)}</span>
              <span>100%</span>
              <Variation value={tableRegion.variacao} />
            </div>
          </div>
        </div>

        <div className="dashboard-footer">
          <span>
            <RefreshCw size={16} />
            Sincronizado automaticamente a cada 10 segundos
          </span>
          <span className="sep">|</span>
          <span>Última atualização: {lastUpdate.toLocaleTimeString("pt-BR")}</span>
          <button type="button" onClick={exportCSV}>
            <Download size={16} />
            Exportar dados
          </button>
        </div>
      </div>
    </div>
  );
}
