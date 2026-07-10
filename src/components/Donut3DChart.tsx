import { memo, useMemo } from "react";
import type { Regiao } from "@/types/dashboard";

type Props = {
  regioes: Regiao[];
  size?: number;
  innerRatio?: number;
  onSelect?: (nome: string) => void;
  selectedName?: string | null;
  startAngle?: number;
};

function polar(cx: number, cy: number, rx: number, ry: number, angle: number) {
  const a = (angle - 90) * (Math.PI / 180);
  return { x: cx + rx * Math.cos(a), y: cy + ry * Math.sin(a) };
}

function darken(hex: string, amount: number) {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  const f = (c: number) => Math.max(0, Math.round(c * (1 - amount)));
  return `rgb(${f(r)}, ${f(g)}, ${f(b)})`;
}
function lighten(hex: string, amount: number) {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  const f = (c: number) => Math.min(255, Math.round(c + (255 - c) * amount));
  return `rgb(${f(r)}, ${f(g)}, ${f(b)})`;
}

// Ring segment top face at vertical offset `topY` (relative to base cy).
function ringTop(
  cx: number,
  topY: number,
  rx: number,
  ry: number,
  irx: number,
  iry: number,
  a1: number,
  a2: number,
) {
  const large = a2 - a1 > 180 ? 1 : 0;
  const p1 = polar(cx, topY, rx, ry, a1);
  const p2 = polar(cx, topY, rx, ry, a2);
  const q1 = polar(cx, topY, irx, iry, a1);
  const q2 = polar(cx, topY, irx, iry, a2);
  return `M ${p1.x} ${p1.y} A ${rx} ${ry} 0 ${large} 1 ${p2.x} ${p2.y} L ${q2.x} ${q2.y} A ${irx} ${iry} 0 ${large} 0 ${q1.x} ${q1.y} Z`;
}

// Outer wall: from top face (topY) down to baseline (baseY) on outer ellipse arc.
function outerWall(
  cx: number,
  topY: number,
  baseY: number,
  rx: number,
  ry: number,
  a1: number,
  a2: number,
) {
  const large = a2 - a1 > 180 ? 1 : 0;
  const t1 = polar(cx, topY, rx, ry, a1);
  const t2 = polar(cx, topY, rx, ry, a2);
  const b1 = polar(cx, baseY, rx, ry, a1);
  const b2 = polar(cx, baseY, rx, ry, a2);
  return `M ${t1.x} ${t1.y} A ${rx} ${ry} 0 ${large} 1 ${t2.x} ${t2.y} L ${b2.x} ${b2.y} A ${rx} ${ry} 0 ${large} 0 ${b1.x} ${b1.y} Z`;
}

// Inner wall of the hole.
function innerWall(
  cx: number,
  topY: number,
  baseY: number,
  irx: number,
  iry: number,
  a1: number,
  a2: number,
) {
  const large = a2 - a1 > 180 ? 1 : 0;
  const t1 = polar(cx, topY, irx, iry, a1);
  const t2 = polar(cx, topY, irx, iry, a2);
  const b1 = polar(cx, baseY, irx, iry, a1);
  const b2 = polar(cx, baseY, irx, iry, a2);
  return `M ${t1.x} ${t1.y} A ${irx} ${iry} 0 ${large} 1 ${t2.x} ${t2.y} L ${b2.x} ${b2.y} A ${irx} ${iry} 0 ${large} 0 ${b1.x} ${b1.y} Z`;
}

// Radial side wall between two adjacent slices (at angle a) — visible between
// slices when heights differ.
function sideRadialWall(
  cx: number,
  topA: number,
  topB: number,
  baseY: number,
  rx: number,
  ry: number,
  irx: number,
  iry: number,
  a: number,
) {
  const outT = polar(cx, topA, rx, ry, a);
  const inT = polar(cx, topA, irx, iry, a);
  const outB = polar(cx, topB, rx, ry, a);
  const inB = polar(cx, topB, irx, iry, a);
  // Only the vertical strip between the two top levels; if topB above topA (smaller y),
  // that face belongs to the neighbor slice — we still render both, order handles occlusion.
  return `M ${outT.x} ${outT.y} L ${inT.x} ${inT.y} L ${inB.x} ${inB.y} L ${outB.x} ${outB.y} Z`;
}

function Donut3DChart({
  regioes,
  size = 620,
  innerRatio = 0.5,
  onSelect,
  selectedName,
  startAngle = -90,
}: Props) {
  const slices = useMemo(() => {
    const sum = regioes.reduce((s, r) => s + r.total, 0);
    const gap = 0.18;
    let acc = startAngle;
    const sl = regioes.map((r) => {
      const sweep = (r.total / sum) * 360;
      const start = acc + gap / 2;
      const end = acc + sweep - gap / 2;
      acc += sweep;
      const mid = (start + end) / 2;
      return { ...r, start, end, mid };
    });
    return sl;
  }, [regioes, startAngle]);

  const cx = size / 2;
  const cy = size * 0.56; // baseline (top of plate)
  const rx = size * 0.34;
  const ry = size * 0.2;
  const irx = rx * innerRatio;
  const iry = ry * innerRatio;

  const heightByName: Record<string, number> = {
    Sudeste: size * 0.245,
    Sul: size * 0.255,
    "Outros/Exterior": size * 0.14,
    Nordeste: size * 0.125,
    "Centro-Oeste": size * 0.165,
    Norte: size * 0.19,
  };
  const heightFor = (nome: string, pct: number) =>
    heightByName[nome] ?? size * (0.09 + pct / 260);

  // Painter's order for top faces + walls: back-to-front by mid-angle sin.
  // Back slices (mid closer to top / y<cy) drawn first.
  const drawOrder = useMemo(
    () =>
      [...slices.map((s, i) => ({ s, i }))].sort((a, b) => {
        const pa = polar(0, 0, 1, 1, a.s.mid).y;
        const pb = polar(0, 0, 1, 1, b.s.mid).y;
        return pa - pb; // negative (back) first
      }),
    [slices],
  );

  // Plate dimensions (flat base ring/oval under the donut)
  const plateRx = rx * 1.35;
  const plateRy = ry * 1.36;
  const plateY = cy + 6;

  return (
    <svg
      viewBox={`0 0 ${size} ${size * 0.82}`}
      width="100%"
      style={{ display: "block", overflow: "visible", height: "auto" }}
    >
      <defs>
        <clipPath id="front-clip-outer">
          <rect x={0} y={cy} width={size} height={size} />
        </clipPath>
        <clipPath id="back-clip-inner">
          <rect x={0} y={0} width={size} height={cy} />
        </clipPath>
        {slices.map((s) => (
          <linearGradient
            key={`top-${s.nome}`}
            id={`top-${s.nome}`}
            x1="0%"
            y1="0%"
            x2="0%"
            y2="100%"
          >
            <stop offset="0%" stopColor={lighten(s.cor, 0.35)} />
            <stop offset="55%" stopColor={s.cor} />
            <stop offset="100%" stopColor={darken(s.cor, 0.12)} />
          </linearGradient>
        ))}
        {slices.map((s) => (
          <linearGradient
            key={`side-${s.nome}`}
            id={`side-${s.nome}`}
            x1="0%"
            y1="0%"
            x2="0%"
            y2="100%"
          >
            <stop offset="0%" stopColor={s.cor} />
            <stop offset="60%" stopColor={darken(s.cor, 0.28)} />
            <stop offset="100%" stopColor={darken(s.cor, 0.55)} />
          </linearGradient>
        ))}
        {slices.map((s) => (
          <linearGradient
            key={`inner-${s.nome}`}
            id={`inner-${s.nome}`}
            x1="0%"
            y1="0%"
            x2="0%"
            y2="100%"
          >
            <stop offset="0%" stopColor={darken(s.cor, 0.45)} />
            <stop offset="100%" stopColor={darken(s.cor, 0.15)} />
          </linearGradient>
        ))}
        <radialGradient id="ground-shadow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(20,0,68,0.35)" />
          <stop offset="70%" stopColor="rgba(20,0,68,0.1)" />
          <stop offset="100%" stopColor="rgba(20,0,68,0)" />
        </radialGradient>
        <radialGradient id="plate-fill" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#f1eef5" />
          <stop offset="100%" stopColor="#d9d4e0" />
        </radialGradient>
        <filter id="label-pop" x="-40%" y="-40%" width="180%" height="180%">
          <feDropShadow dx="-7" dy="7" stdDeviation="0" floodColor="#06020b" floodOpacity="0.98" />
          <feDropShadow dx="1" dy="2" stdDeviation="1.2" floodColor="#000" floodOpacity="0.4" />
        </filter>
      </defs>

      {/* Ground shadow */}
      <ellipse
        cx={cx}
        cy={plateY + plateRy + 8}
        rx={plateRx * 1.05}
        ry={plateRy * 0.55}
        fill="url(#ground-shadow)"
      />

      {/* Plate (flat base ring under the donut) */}
      <ellipse cx={cx} cy={plateY + 4} rx={plateRx} ry={plateRy} fill="rgba(20,0,68,0.12)" />
      <ellipse cx={cx} cy={plateY} rx={plateRx} ry={plateRy} fill="url(#plate-fill)" />

      {/* Draw slices back-to-front */}
      {drawOrder.map(({ s }) => {
        const h = heightFor(s.nome, s.percentual);
        const topY = cy - h;
        const tY = topY;
        const isSelected = selectedName === s.nome;

        return (
          <g
            key={`slice-${s.nome}`}
            role={onSelect ? "button" : undefined}
            aria-label={onSelect ? `Selecionar ${s.nome}` : undefined}
            tabIndex={onSelect ? 0 : undefined}
            onClick={onSelect ? () => onSelect(s.nome) : undefined}
            onKeyDown={
              onSelect
                ? (event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      onSelect(s.nome);
                    }
                  }
                : undefined
            }
            style={{
              cursor: onSelect ? "pointer" : "default",
              filter: isSelected ? `drop-shadow(0 0 11px ${s.cor}88)` : undefined,
            }}
          >
            {/* Inner wall visible through the hole — back half of inner ellipse */}
            <g clipPath="url(#back-clip-inner)">
              <path
                d={innerWall(cx, tY, cy, irx, iry, s.start, s.end)}
                fill={`url(#inner-${s.nome})`}
                stroke={darken(s.cor, 0.5)}
                strokeWidth={0.5}
              />
            </g>

            {/* Outer wall — front half */}
            <g clipPath="url(#front-clip-outer)">
              <path
                d={outerWall(cx, tY, cy, rx, ry, s.start, s.end)}
                fill={`url(#side-${s.nome})`}
                stroke={darken(s.cor, 0.5)}
                strokeWidth={0.6}
              />
            </g>

            {/* Radial side walls (visible where neighbor is shorter) */}
            {/* start edge */}
            <path
              d={`M ${polar(cx, tY, rx, ry, s.start).x} ${polar(cx, tY, rx, ry, s.start).y} L ${polar(cx, tY, irx, iry, s.start).x} ${polar(cx, tY, irx, iry, s.start).y} L ${polar(cx, cy, irx, iry, s.start).x} ${polar(cx, cy, irx, iry, s.start).y} L ${polar(cx, cy, rx, ry, s.start).x} ${polar(cx, cy, rx, ry, s.start).y} Z`}
              fill={darken(s.cor, 0.22)}
              opacity={0.9}
            />
            {/* end edge */}
            <path
              d={`M ${polar(cx, tY, rx, ry, s.end).x} ${polar(cx, tY, rx, ry, s.end).y} L ${polar(cx, tY, irx, iry, s.end).x} ${polar(cx, tY, irx, iry, s.end).y} L ${polar(cx, cy, irx, iry, s.end).x} ${polar(cx, cy, irx, iry, s.end).y} L ${polar(cx, cy, rx, ry, s.end).x} ${polar(cx, cy, rx, ry, s.end).y} Z`}
              fill={darken(s.cor, 0.35)}
              opacity={0.9}
            />

            {/* Top face */}
            <path
              d={ringTop(cx, tY, rx, ry, irx, iry, s.start, s.end)}
              fill={`url(#top-${s.nome})`}
              stroke={darken(s.cor, 0.35)}
              strokeWidth={isSelected ? 1.8 : 0.75}
            />
          </g>
        );
      })}

      {/* Percent labels on top of each slice */}
      <g pointerEvents="none" fontFamily="inherit">
        {slices.map((s) => {
          const h = heightFor(s.nome, s.percentual);
          const topY = cy - h;
          const mid = (innerRatio + 1) / 2;
          const p = polar(cx, topY, rx * mid, ry * mid, s.mid);
          const txt = `${Math.round(s.percentual)}%`;
          const fontSize = Math.max(17, size * 0.044);
          return (
            <text
              key={`lbl-${s.nome}`}
              x={p.x}
              y={p.y}
              textAnchor="middle"
              dominantBaseline="central"
              fill="#fff"
              fontSize={fontSize}
              fontWeight={900}
              filter="url(#label-pop)"
              transform={`rotate(-12 ${p.x} ${p.y})`}
              style={{
                paintOrder: "stroke",
                stroke: "rgba(0,0,0,0.18)",
                strokeWidth: 1.1,
              }}
            >
              ✓{txt}
            </text>
          );
        })}
      </g>
    </svg>
  );
}

export default memo(Donut3DChart, (prev, next) => {
  if (prev.size !== next.size) return false;
  if ((prev.innerRatio ?? 0.5) !== (next.innerRatio ?? 0.5)) return false;
  if ((prev.startAngle ?? -90) !== (next.startAngle ?? -90)) return false;
  if (prev.selectedName !== next.selectedName) return false;
  if (prev.onSelect !== next.onSelect) return false;
  if (prev.regioes.length !== next.regioes.length) return false;
  for (let i = 0; i < prev.regioes.length; i++) {
    const a = prev.regioes[i];
    const b = next.regioes[i];
    if (a.nome !== b.nome || a.total !== b.total || a.cor !== b.cor) return false;
  }
  return true;
});