import { memo, useMemo, useState } from "react";
import type { Regiao } from "@/types/dashboard";

type Props = {
  regioes: Regiao[];
  size?: number;
  innerRatio?: number;
};

// Isometric tilted pie: top face is an ellipse (rx > ry), with a vertical
// extrusion (depth) that forms the visible "crust" on the front half.
function polar(cx: number, cy: number, rx: number, ry: number, angle: number) {
  const a = (angle - 90) * (Math.PI / 180);
  return { x: cx + rx * Math.cos(a), y: cy + ry * Math.sin(a) };
}

// Top slice: either a filled pie slice (no hole) or a ring segment (donut).
function pieTop(
  cx: number,
  cy: number,
  rx: number,
  ry: number,
  a1: number,
  a2: number,
  innerRatio = 0,
) {
  const large = a2 - a1 > 180 ? 1 : 0;
  const p1 = polar(cx, cy, rx, ry, a1);
  const p2 = polar(cx, cy, rx, ry, a2);
  if (innerRatio > 0) {
    const irx = rx * innerRatio;
    const iry = ry * innerRatio;
    const q1 = polar(cx, cy, irx, iry, a1);
    const q2 = polar(cx, cy, irx, iry, a2);
    return `M ${p1.x} ${p1.y} A ${rx} ${ry} 0 ${large} 1 ${p2.x} ${p2.y} L ${q2.x} ${q2.y} A ${irx} ${iry} 0 ${large} 0 ${q1.x} ${q1.y} Z`;
  }
  return `M ${cx} ${cy} L ${p1.x} ${p1.y} A ${rx} ${ry} 0 ${large} 1 ${p2.x} ${p2.y} Z`;
}

// Outer front wall (crust) for the portion of the slice arc that is on the
// front (lower) half of the ellipse. Clipped in SVG to y > cy.
function outerWall(
  cx: number,
  cy: number,
  rx: number,
  ry: number,
  depth: number,
  a1: number,
  a2: number,
) {
  const large = a2 - a1 > 180 ? 1 : 0;
  const p1 = polar(cx, cy, rx, ry, a1);
  const p2 = polar(cx, cy, rx, ry, a2);
  return `M ${p1.x} ${p1.y} A ${rx} ${ry} 0 ${large} 1 ${p2.x} ${p2.y} L ${p2.x} ${p2.y + depth} A ${rx} ${ry} 0 ${large} 0 ${p1.x} ${p1.y + depth} Z`;
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

function Donut3DChart({ regioes, size = 620, innerRatio = 0.5 }: Props) {
  const [hover, setHover] = useState<string | null>(null);

  const slices = useMemo(() => {
    const sum = regioes.reduce((s, r) => s + r.total, 0);
    const gap = 0.6;
    let acc = -90;
    return regioes.map((r) => {
      const sweep = (r.total / sum) * 360;
      const start = acc + gap / 2;
      const end = acc + sweep - gap / 2;
      acc += sweep;
      const mid = (start + end) / 2;
      return { ...r, start, end, mid };
    });
  }, [regioes]);

  const cx = size / 2;
  const cy = size / 2 - 30;
  const rx = size * 0.44;
  const ry = size * 0.24; // squashed => isometric tilt
  const depth = 70;
  const irx = rx * innerRatio;
  const iry = ry * innerRatio;

  return (
    <svg
      viewBox={`0 0 ${size} ${size * 0.75}`}
      width="100%"
      style={{ display: "block", overflow: "visible", height: "auto" }}
    >
      <defs>
        <clipPath id="front-clip">
          <rect x={0} y={cy} width={size} height={size} />
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
            <stop offset="0%" stopColor={lighten(s.cor, 0.45)} />
            <stop offset="45%" stopColor={lighten(s.cor, 0.1)} />
            <stop offset="100%" stopColor={darken(s.cor, 0.1)} />
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
            <stop offset="0%" stopColor={darken(s.cor, 0.15)} />
            <stop offset="55%" stopColor={darken(s.cor, 0.45)} />
            <stop offset="100%" stopColor={darken(s.cor, 0.7)} />
          </linearGradient>
        ))}
        <radialGradient id="ground" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(20,0,68,0.55)" />
          <stop offset="70%" stopColor="rgba(20,0,68,0.12)" />
          <stop offset="100%" stopColor="rgba(20,0,68,0)" />
        </radialGradient>
        <radialGradient id="topshine" cx="35%" cy="10%" r="75%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.75" />
          <stop offset="45%" stopColor="#ffffff" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="rimshade" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="rgba(0,0,0,0)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0.35)" />
        </linearGradient>
      </defs>

      {/* Ground shadow */}
      <ellipse
        cx={cx}
        cy={cy + depth + ry + 10}
        rx={rx * 1.05}
        ry={ry * 0.55}
        fill="url(#ground)"
      />

      {/* Base ellipse (bottom of the pie, fully dark) */}
      <ellipse
        cx={cx}
        cy={cy + depth}
        rx={rx}
        ry={ry}
        fill="#1a0033"
        opacity={0.35}
      />

      {/* Front crust (walls) — only the visible front half of each slice */}
      <g clipPath="url(#front-clip)">
        {slices.map((s) => (
          <path
            key={`wall-${s.nome}`}
            d={outerWall(cx, cy, rx, ry, depth, s.start, s.end)}
            fill={`url(#side-${s.nome})`}
            stroke={darken(s.cor, 0.55)}
            strokeWidth={0.6}
          />
        ))}
        {/* subtle bottom shade on the crust */}
        <path
          d={`M ${cx - rx} ${cy} A ${rx} ${ry} 0 0 0 ${cx + rx} ${cy} L ${cx + rx} ${cy + depth} A ${rx} ${ry} 0 0 1 ${cx - rx} ${cy + depth} Z`}
          fill="url(#rimshade)"
          pointerEvents="none"
        />
      </g>

      {/* Top faces */}
      <g>
        {slices.map((s) => {
          const isHover = hover === s.nome;
          const mid = polar(cx, cy, 1, 1, s.mid);
          const dx = isHover ? mid.x - cx : 0;
          const dy = isHover ? mid.y - cy : 0;
          const k = isHover ? 0.08 : 0;
          return (
            <path
              key={`top-${s.nome}`}
              d={pieTop(cx + dx * k * rx, cy + dy * k * ry, rx, ry, s.start, s.end, innerRatio)}
              fill={`url(#top-${s.nome})`}
              stroke={darken(s.cor, 0.35)}
              strokeWidth={0.75}
              style={{ cursor: "pointer", transition: "d 0.2s ease" }}
              onMouseEnter={() => setHover(s.nome)}
              onMouseLeave={() => setHover(null)}
            />
          );
        })}
      </g>

      {/* Inner hole — page bg + subtle inner shading */}
      {innerRatio > 0 && (
        <g pointerEvents="none">
          <ellipse cx={cx} cy={cy} rx={irx} ry={iry} fill="#F7F5FB" />
          {/* subtle darker crescent at the back of the hole for depth */}
          <path
            d={`M ${cx - irx} ${cy} A ${irx} ${iry} 0 0 1 ${cx + irx} ${cy} A ${irx * 0.95} ${iry * 0.85} 0 0 0 ${cx - irx} ${cy} Z`}
            fill="rgba(20,0,68,0.08)"
          />
        </g>
      )}

      {/* Glossy top highlight */}
      <ellipse
        cx={cx}
        cy={cy}
        rx={rx}
        ry={ry}
        fill="url(#topshine)"
        pointerEvents="none"
        style={{ mixBlendMode: "screen" }}
      />

      {/* Percent labels — pill on big slices, leader line on small ones */}
      <g pointerEvents="none" fontFamily="inherit">
        {slices.map((s) => {
          const txt = `${s.percentual.toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%`;
          const fontSize = Math.max(13, size * 0.032);
          // Ring-centered label on top face
          const mid = (innerRatio + 1) / 2;
          const p = polar(cx, cy, rx * mid, ry * mid, s.mid);
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
              style={{ paintOrder: "stroke", stroke: "rgba(0,0,0,0.35)", strokeWidth: 2 }}
            >
              {txt}
            </text>
          );
        })}
      </g>
    </svg>
  );
}

export default memo(Donut3DChart, (prev, next) => {
  if (prev.size !== next.size) return false;
  if (prev.regioes.length !== next.regioes.length) return false;
  for (let i = 0; i < prev.regioes.length; i++) {
    const a = prev.regioes[i];
    const b = next.regioes[i];
    if (a.nome !== b.nome || a.total !== b.total || a.cor !== b.cor) return false;
  }
  return true;
});