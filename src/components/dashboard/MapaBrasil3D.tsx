import { regioesBase } from "@/data/dados";

// Stylized Brazil regions on a 400x460 viewBox
// Stylized Brazil regions on a 400x460 viewBox.
// Paths are simplified silhouettes that together compose a recognizable Brazil shape.
const REGION_PATHS: Record<string, string> = {
  Norte:
    "M 45 75 C 70 45, 160 35, 235 55 L 285 90 L 300 145 L 285 175 L 245 195 L 165 205 L 95 185 L 55 145 Z",
  Nordeste:
    "M 235 55 C 290 60, 340 95, 360 140 L 365 200 L 340 240 L 295 250 L 270 220 L 255 195 L 245 195 L 285 175 L 300 145 L 285 90 Z",
  "Centro-Oeste":
    "M 165 205 L 245 195 L 255 195 L 270 220 L 280 275 L 240 305 L 165 305 L 130 265 L 130 220 Z",
  Sudeste:
    "M 270 220 L 295 250 L 335 270 L 350 315 L 320 345 L 270 345 L 240 320 L 240 305 L 280 275 Z",
  Sul:
    "M 165 305 L 240 305 L 240 320 L 235 360 L 200 405 L 150 385 L 125 345 L 130 320 Z",
  "Outros/Exterior": "",
};

export default function MapaBrasil3D({
  destaque,
  onSelect,
}: {
  destaque: string;
  onSelect?: (nome: string) => void;
}) {
  const regs = regioesBase.filter((r) => REGION_PATHS[r.nome]);
  return (
    <div className="relative w-full max-w-[380px] mx-auto">
      <svg viewBox="0 0 400 460" className="w-full h-auto">
        <defs>
          <linearGradient id="purpleFill" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#8A2BE2" />
            <stop offset="100%" stopColor="#4A0075" />
          </linearGradient>
          <linearGradient id="goldFill" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#F8E08E" />
            <stop offset="100%" stopColor="#C9A24C" />
          </linearGradient>
          <radialGradient id="mapShine" cx="40%" cy="20%" r="70%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* 3D depth shadow */}
        <g transform="translate(6 10)" opacity="0.7">
          {regs.map((r) => (
            <path
              key={`s-${r.nome}`}
              d={REGION_PATHS[r.nome]}
              fill="#0E0020"
            />
          ))}
        </g>

        {/* Region fills */}
        {regs.map((r) => {
          const isOn = r.nome === destaque;
          return (
            <path
              key={r.nome}
              d={REGION_PATHS[r.nome]}
              fill={isOn ? "url(#goldFill)" : "url(#purpleFill)"}
              stroke={isOn ? "#FFE89B" : "#B57AE8"}
              strokeWidth={isOn ? 2 : 1}
              strokeLinejoin="round"
              style={{ cursor: "pointer", transition: "all .25s" }}
              onClick={() => onSelect?.(r.nome)}
            />
          );
        })}

        {/* top shine on all regions */}
        {regs.map((r) => (
          <path
            key={`sh-${r.nome}`}
            d={REGION_PATHS[r.nome]}
            fill="url(#mapShine)"
            pointerEvents="none"
          />
        ))}
      </svg>
    </div>
  );
}