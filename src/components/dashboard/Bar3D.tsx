type Props = {
  label: string;
  value: number;
  max: number;
  highlight?: boolean;
  onClick?: () => void;
};

export default function Bar3D({ label, value, max, highlight, onClick }: Props) {
  const pct = Math.max(6, (value / max) * 100);
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full flex items-center gap-3 group"
    >
      <span className="w-10 text-right font-black text-[#3A0068]">{label}</span>
      <span className="flex-1 h-7 rounded-full bg-[#F4ECFB] overflow-hidden relative">
        <span
          className="absolute inset-y-0 left-0 rounded-full transition-[width] duration-500"
          style={{
            width: `${pct}%`,
            background:
              "linear-gradient(180deg, #C95BFF 0%, #7E1DFF 45%, #3A0068 100%)",
            border: highlight ? "2px solid #F6C756" : "2px solid transparent",
            boxShadow:
              "0 8px 18px rgba(106,13,173,.35), inset 0 2px 4px rgba(255,255,255,.25)",
          }}
        />
      </span>
      <span className="w-10 text-left font-black text-[#3A0068]">
        {value.toString().padStart(2, "0")}
      </span>
    </button>
  );
}