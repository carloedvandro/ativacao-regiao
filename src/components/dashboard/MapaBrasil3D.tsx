import { regioesBase } from "@/data/dados";

const REGION_PATHS: Record<string, string> = {
  Norte: "M70 60 L210 50 L260 120 L230 200 L120 210 L60 150 Z",
  Nordeste: "M260 120 L340 90 L380 200 L300 260 L230 220 Z",
  "Centro-Oeste": "M150 200 L260 200 L290 280 L180 300 Z",
  Sudeste: "M260 220 L340 230 L350 310 L260 320 L240 270 Z",
  Sul: "M200 300 L300 310 L290 380 L200 370 Z",
  "Outros/Exterior": "M40 320 L120 320 L120 380 L40 380 Z",
};

export default function MapaBrasil3D({
  destaque,
  onSelect,
}: {
  destaque: string;
  onSelect?: (nome: string) => void;
}) {
  return (
    <div className="relative w-full max-w-[460px] mx-auto">
      <svg viewBox="0 0 400 420" className="w-full h-auto drop-shadow-2xl">
        <defs>
          <radialGradient id="map-shine" cx="50%" cy="20%" r="70%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>
        </defs>
        {/* depth shadow */}
        <g transform="translate(0,10)">
          {regioesBase.map((r) => (
            <path
              key={`s-${r.nome}`}
              d={REGION_PATHS[r.nome] ?? ""}
              fill="#2A004F"
              opacity={0.55}
            />
          ))}
        </g>
        {regioesBase.map((r) => {
          const isOn = r.nome === destaque;
          return (
            <path
              key={r.nome}
              d={REGION_PATHS[r.nome] ?? ""}
              fill={isOn ? "#F6C756" : r.cor}
              stroke={isOn ? "#F6C756" : "#FFFFFF"}
              strokeWidth={isOn ? 3 : 1.5}
              style={{ cursor: "pointer", transition: "all .25s" }}
              onClick={() => onSelect?.(r.nome)}
            />
          );
        })}
        <path
          d="M70 60 L210 50 L260 120 L230 200 L120 210 L60 150 Z"
          fill="url(#map-shine)"
          pointerEvents="none"
        />
      </svg>
    </div>
  );
}