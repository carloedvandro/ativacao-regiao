import { regioesBase } from "@/data/dados";

// Stylized Brazil regions on a 400x460 viewBox
const REGION_PATHS: Record<string, string> = {
  Norte:
    "M40 70 L120 50 L220 45 L260 95 L295 160 L255 205 L155 215 L75 175 L45 125 Z",
  Nordeste:
    "M220 45 L300 60 L355 110 L370 175 L355 235 L305 255 L270 215 L255 205 L295 160 L260 95 Z",
  "Centro-Oeste":
    "M120 200 L255 205 L270 215 L280 275 L235 315 L150 310 L110 260 Z",
  Sudeste:
    "M270 215 L305 255 L340 280 L355 325 L305 345 L255 330 L235 315 L280 275 Z",
  Sul:
    "M150 310 L235 315 L255 330 L240 380 L185 415 L130 385 L115 345 Z",
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