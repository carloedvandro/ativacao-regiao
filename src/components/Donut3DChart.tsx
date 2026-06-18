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

function donutArc(
  cx: number,
  cy: number,
  rOuter: number,
  rInner: number,
  startAngle: number,
  endAngle: number,
) {
  const largeArc = endAngle - startAngle > 180 ? 1 : 0;
  const o1 = polar(cx, cy, rOuter, startAngle);
  const o2 = polar(cx, cy, rOuter, endAngle);
  const i2 = polar(cx, cy, rInner, endAngle);
  const i1 = polar(cx, cy, rInner, startAngle);
  return [
    `M ${o1.x} ${o1.y}`,
    `A ${rOuter} ${rOuter} 0 ${largeArc} 1 ${o2.x} ${o2.y}`,
    `L ${i2.x} ${i2.y}`,
    `A ${rInner} ${rInner} 0 ${largeArc} 0 ${i1.x} ${i1.y}`,
    "Z",
  ].join(" ");
}

function darken(hex: string, amount = 0.45) {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  const f = (c: number) => Math.max(0, Math.round(c * (1 - amount)));
  return `rgb(${f(r)}, ${f(g)}, ${f(b)})`;
}

export default function Donut3DChart({ regioes, size = 560 }: Props) {
  const [hover, setHover] = useState<string | null>(null);

  const slices = useMemo(() => {
    const sum = regioes.reduce((s, r) => s + r.total, 0);
    let acc = 0;
    return regioes.map((r) => {
      const sweep = (r.total / sum) * 360;
      const start = acc;
      const end = acc + sweep;
      acc = end;
      const mid = (start + end) / 2;
      return { ...r, start, end, mid };
    });
  }, [regioes]);

  const cx = size / 2;
  const cy = size / 2 - 10;
  const rOuter = size * 0.42;
  const rInner = size * 0.24;
  const depth = 28;

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      width="100%"
      height={size}
      style={{ display: "block", overflow: "visible" }}
    >
      <defs>
        <filter id="donut-shadow" x="-30%" y="-20%" width="160%" height="160%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="14" />
          <feOffset dx="0" dy="22" result="off" />
          <feComponentTransfer>
            <feFuncA type="linear" slope="0.55" />
          </feComponentTransfer>
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        {slices.map((s) => (
          <radialGradient
            key={`g-${s.nome}`}
            id={`grad-${s.nome}`}
            cx="50%"
            cy="30%"
            r="75%"
          >
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.55" />
            <stop offset="35%" stopColor={s.cor} stopOpacity="1" />
            <stop offset="100%" stopColor={darken(s.cor, 0.35)} stopOpacity="1" />
          </radialGradient>
        ))}
        <radialGradient id="top-shine" cx="50%" cy="20%" r="60%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.45" />
          <stop offset="60%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Ground shadow */}
      <ellipse
        cx={cx}
        cy={cy + rOuter + depth + 6}
        rx={rOuter * 0.95}
        ry={depth * 0.55}
        fill="rgba(0,0,0,0.35)"
        filter="url(#donut-shadow)"
      />

      {/* 3D side (darker layer offset down) */}
      <g>
        {slices.map((s) => (
          <path
            key={`side-${s.nome}`}
            d={donutArc(cx, cy + depth, rOuter, rInner, s.start, s.end)}
            fill={darken(s.cor, 0.5)}
          />
        ))}
      </g>

      {/* Connecting walls for stronger depth */}
      <g>
        {slices.map((s) => {
          const steps = 6;
          return Array.from({ length: steps }).map((_, i) => (
            <path
              key={`wall-${s.nome}-${i}`}
              d={donutArc(cx, cy + (i * depth) / steps, rOuter, rInner, s.start, s.end)}
              fill={darken(s.cor, 0.45 - (i / steps) * 0.25)}
              opacity={0.9}
            />
          ));
        })}
      </g>

      {/* Top faces */}
      <g>
        {slices.map((s) => {
          const isHover = hover === s.nome;
          const offset = isHover ? -6 : 0;
          return (
            <path
              key={`top-${s.nome}`}
              d={donutArc(cx, cy + offset, rOuter, rInner, s.start, s.end)}
              fill={`url(#grad-${s.nome})`}
              stroke={darken(s.cor, 0.2)}
              strokeWidth={0.5}
              style={{ cursor: "pointer", transition: "all 0.2s ease" }}
              onMouseEnter={() => setHover(s.nome)}
              onMouseLeave={() => setHover(null)}
            />
          );
        })}
      </g>

      {/* Top shine overlay (donut-shaped) */}
      <path
        d={`M ${cx - rOuter} ${cy} A ${rOuter} ${rOuter} 0 1 1 ${cx + rOuter} ${cy} A ${rOuter} ${rOuter} 0 1 1 ${cx - rOuter} ${cy} Z
            M ${cx - rInner} ${cy} A ${rInner} ${rInner} 0 1 0 ${cx + rInner} ${cy} A ${rInner} ${rInner} 0 1 0 ${cx - rInner} ${cy} Z`}
        fill="url(#top-shine)"
        fillRule="evenodd"
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
              fontSize={size * 0.045}
              fontWeight={700}
              style={{ textShadow: "0 2px 6px rgba(0,0,0,0.5)" }}
            >
              {s.percentual.toString().replace(".", ",")}%
            </text>
          );
        })}
      </g>
    </svg>
  );
}