import { regioesBase } from "@/data/dados";

const CX = 380;
const CY = 215;
const RX = 250;
const RY = 145;
const IRX = 130;
const IRY = 75;
const DEPTH = 35;

function pt(cx: number, cy: number, rx: number, ry: number, ang: number) {
  return [cx + rx * Math.cos(ang), cy + ry * Math.sin(ang)];
}

function slicePath(start: number, end: number, dy = 0) {
  const [x1, y1] = pt(CX, CY + dy, RX, RY, start);
  const [x2, y2] = pt(CX, CY + dy, RX, RY, end);
  const [x3, y3] = pt(CX, CY + dy, IRX, IRY, end);
  const [x4, y4] = pt(CX, CY + dy, IRX, IRY, start);
  const large = end - start > Math.PI ? 1 : 0;
  return `M ${x1} ${y1} A ${RX} ${RY} 0 ${large} 1 ${x2} ${y2} L ${x3} ${y3} A ${IRX} ${IRY} 0 ${large} 0 ${x4} ${y4} Z`;
}

function sideWall(start: number, end: number) {
  const [x1, y1] = pt(CX, CY, RX, RY, start);
  const [x2, y2] = pt(CX, CY, RX, RY, end);
  const [x3, y3] = pt(CX, CY + DEPTH, RX, RY, end);
  const [x4, y4] = pt(CX, CY + DEPTH, RX, RY, start);
  const large = end - start > Math.PI ? 1 : 0;
  return `M ${x1} ${y1} A ${RX} ${RY} 0 ${large} 1 ${x2} ${y2} L ${x3} ${y3} A ${RX} ${RY} 0 ${large} 0 ${x4} ${y4} Z`;
}

function darken(hex: string, f = 0.55) {
  const n = parseInt(hex.slice(1), 16);
  const r = Math.round(((n >> 16) & 255) * f);
  const g = Math.round(((n >> 8) & 255) * f);
  const b = Math.round((n & 255) * f);
  return `rgb(${r},${g},${b})`;
}

export default function Grafico3D() {
  const total = regioesBase.reduce((s, r) => s + r.percentual, 0);
  let acc = -Math.PI / 2;
  const slices = regioesBase.map((r) => {
    const frac = r.percentual / total;
    const start = acc;
    const end = acc + frac * Math.PI * 2;
    acc = end;
    const mid = (start + end) / 2;
    const [lx, ly] = pt(CX, CY, (RX + IRX) / 2, (RY + IRY) / 2, mid);
    return { ...r, start, end, mid, lx, ly };
  });

  // visible side walls: bottom half (where sin(mid) > 0)
  const walls = slices.filter((s) => Math.sin(s.mid) > -0.1);

  return (
    <div className="relative mx-auto mt-2 w-full max-w-[820px] h-[430px] flex items-center justify-center">
      <div className="absolute bottom-[30px] w-[560px] h-[90px] bg-black/35 blur-2xl rounded-full" />
      <svg viewBox="0 0 760 430" className="relative w-full h-full drop-shadow-2xl">
        <defs>
          <radialGradient id="topShine" cx="50%" cy="35%" r="60%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* side walls */}
        {walls.map((s) => (
          <path key={`w-${s.nome}`} d={sideWall(s.start, s.end)} fill={darken(s.cor)} />
        ))}

        {/* top slices */}
        {slices.map((s) => (
          <path
            key={`t-${s.nome}`}
            d={slicePath(s.start, s.end)}
            fill={s.cor}
            stroke="#fff"
            strokeWidth="1"
          />
        ))}

        {/* shine */}
        <ellipse cx={CX} cy={CY - 10} rx={RX - 10} ry={RY - 10} fill="url(#topShine)" pointerEvents="none" />

        {/* labels */}
        {slices.map((s) => (
          <text
            key={`l-${s.nome}`}
            x={s.lx}
            y={s.ly + 6}
            textAnchor="middle"
            fontSize="22"
            fontWeight="900"
            fill="white"
            style={{ paintOrder: "stroke", stroke: "rgba(0,0,0,0.35)", strokeWidth: 2 }}
          >
            {s.percentual.toFixed(1).replace(".", ",")}%
          </text>
        ))}
      </svg>
    </div>
  );
}
