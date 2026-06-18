import { useMemo, useState } from "react";
import type { Regiao } from "@/types/dashboard";

type Props = {
  regioes: Regiao[];
  size?: number;
};

function polar(cx: number, cy: number, r: number, angle: number) {
  const a = (angle - 90) * (Math.PI / 180);
  return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
}

function donutTop(
  cx: number,
  cy: number,
  rOuter: number,
  rInner: number,
  a1: number,
  a2: number,
) {
  const large = a2 - a1 > 180 ? 1 : 0;
  const o1 = polar(cx, cy, rOuter, a1);
  const o2 = polar(cx, cy, rOuter, a2);
  const i2 = polar(cx, cy, rInner, a2);
  const i1 = polar(cx, cy, rInner, a1);
  return `M ${o1.x} ${o1.y} A ${rOuter} ${rOuter} 0 ${large} 1 ${o2.x} ${o2.y} L ${i2.x} ${i2.y} A ${rInner} ${rInner} 0 ${large} 0 ${i1.x} ${i1.y} Z`;
}

// Outer wall ribbon (visible only on bottom half / where outer arc faces viewer)
function outerWall(cx: number, cy: number, r: number, depth: number, a1: number, a2: number) {
  const large = a2 - a1 > 180 ? 1 : 0;
  const p1 = polar(cx, cy, r, a1);
  const p2 = polar(cx, cy, r, a2);
  return `M ${p1.x} ${p1.y} A ${r} ${r} 0 ${large} 1 ${p2.x} ${p2.y} L ${p2.x} ${p2.y + depth} A ${r} ${r} 0 ${large} 0 ${p1.x} ${p1.y + depth} Z`;
}

// Inner wall ribbon (visible on top half / where inner arc faces viewer-down)
function innerWall(cx: number, cy: number, r: number, depth: number, a1: number, a2: number) {
  const large = a2 - a1 > 180 ? 1 : 0;
  const p1 = polar(cx, cy, r, a1);
  const p2 = polar(cx, cy, r, a2);
  return `M ${p1.x} ${p1.y} A ${r} ${r} 0 ${large} 1 ${p2.x} ${p2.y} L ${p2.x} ${p2.y + depth} A ${r} ${r} 0 ${large} 0 ${p1.x} ${p1.y + depth} Z`;
}

// Radial side wall at a given angle (the cut edge of a slice) — a quad
function radialSideWall(
  cx: number,
  cy: number,
  rOuter: number,
  rInner: number,
  depth: number,
  angle: number,
) {
  const outerT = polar(cx, cy, rOuter, angle);
  const innerT = polar(cx, cy, rInner, angle);
  const outerB = { x: outerT.x, y: outerT.y + depth };
  const innerB = { x: innerT.x, y: innerT.y + depth };
  return `M ${outerT.x} ${outerT.y} L ${innerT.x} ${innerT.y} L ${innerB.x} ${innerB.y} L ${outerB.x} ${outerB.y} Z`;
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

export default function Donut3DChart({ regioes, size = 620 }: Props) {
  const [hover, setHover] = useState<string | null>(null);

  const slices = useMemo(() => {
    const sum = regioes.reduce((s, r) => s + r.total, 0);
    const gap = 1.2; // degrees between slices
    let acc = -90; // start at top
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
  const cy = size / 2 - 18;
  const rOuter = size * 0.4;
  const rInner = size * 0.22;
  const depth = 46;

  return (
    <svg
      viewBox={`0 0 ${size} ${size + 20}`}
      width="100%"
      height="auto"
      style={{ display: "block", overflow: "visible" }}
    >
      <defs>
        <clipPath id="outer-clip">
          <rect x={0} y={cy} width={size} height={size} />
        </clipPath>
        <clipPath id="inner-clip">
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
            <stop offset="100%" stopColor={darken(s.cor, 0.15)} />
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
            <stop offset="0%" stopColor={darken(s.cor, 0.25)} />
            <stop offset="100%" stopColor={darken(s.cor, 0.65)} />
          </linearGradient>
        ))}
        <radialGradient id="ground" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(0,0,0,0.55)" />
          <stop offset="70%" stopColor="rgba(0,0,0,0.15)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0)" />
        </radialGradient>
        <radialGradient id="topshine" cx="50%" cy="15%" r="65%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.55" />
          <stop offset="55%" stopColor="#ffffff" stopOpacity="0.05" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Ground shadow */}
      <ellipse
        cx={cx}
        cy={cy + rOuter + depth + 14}
        rx={rOuter * 1.05}
        ry={depth * 0.55}
        fill="url(#ground)"
      />

      {/* Side walls per slice (drawn before top) */}
      <g>
        {slices.map((s) => {
          const isHover = hover === s.nome;
          const yOffset = isHover ? -8 : 0;
          return (
            <g key={`walls-${s.nome}`} style={{ transition: "transform 0.2s" }} transform={`translate(0 ${yOffset})`}>
              <g clipPath="url(#outer-clip)">
                <path
                  d={outerWall(cx, cy, rOuter, depth, s.start, s.end)}
                  fill={`url(#side-${s.nome})`}
                />
              </g>
              <g clipPath="url(#inner-clip)">
                <path
                  d={innerWall(cx, cy, rInner, depth, s.start, s.end)}
                  fill={darken(s.cor, 0.55)}
                />
              </g>
              <path
                d={radialSideWall(cx, cy, rOuter, rInner, depth, s.start)}
                fill={darken(s.cor, 0.45)}
              />
              <path
                d={radialSideWall(cx, cy, rOuter, rInner, depth, s.end)}
                fill={darken(s.cor, 0.35)}
              />
            </g>
          );
        })}
      </g>

      {/* Top faces */}
      <g>
        {slices.map((s) => {
          const isHover = hover === s.nome;
          const yOffset = isHover ? -8 : 0;
          return (
            <path
              key={`top-face-${s.nome}`}
              d={donutTop(cx, cy + yOffset, rOuter, rInner, s.start, s.end)}
              fill={`url(#top-${s.nome})`}
              stroke={darken(s.cor, 0.3)}
              strokeWidth={0.5}
              style={{ cursor: "pointer", transition: "all 0.2s ease" }}
              onMouseEnter={() => setHover(s.nome)}
              onMouseLeave={() => setHover(null)}
            />
          );
        })}
      </g>

      {/* Top highlight ring */}
      <ellipse
        cx={cx}
        cy={cy - rOuter * 0.05}
        rx={rOuter}
        ry={rOuter}
        fill="url(#topshine)"
        pointerEvents="none"
      />

      {/* Percent labels */}
      <g pointerEvents="none">
        {slices.map((s) => {
          const rMid = (rOuter + rInner) / 2;
          const p = polar(cx, cy, rMid, s.mid);
          return (
            <text
              key={`lbl-${s.nome}`}
              x={p.x}
              y={p.y}
              textAnchor="middle"
              dominantBaseline="central"
              fill="#fff"
              fontSize={size * 0.05}
              fontWeight={800}
              style={{ textShadow: "0 2px 6px rgba(0,0,0,0.55)" }}
            >
              {s.percentual.toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%
            </text>
          );
        })}
      </g>
    </svg>
  );
}