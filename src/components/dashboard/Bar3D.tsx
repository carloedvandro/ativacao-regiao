type Props = {
  rank?: number;
  label: string;
  value: number;
  max: number;
  trailing?: string;
  onClick?: () => void;
};

export default function Bar3D({ rank, label, value, max, trailing, onClick }: Props) {
  const pct = Math.max(4, (value / max) * 100);
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full flex items-center gap-3"
    >
      {rank !== undefined && (
        <span
          className="shrink-0 w-7 h-7 rounded-full grid place-items-center text-xs font-black text-[#3A0068]"
          style={{
            background:
              "radial-gradient(circle at 30% 30%, #F8E08E, #C9A24C 70%, #8A6A26)",
            border: "1px solid #8A6A26",
          }}
        >
          {rank}
        </span>
      )}
      <span
        className="shrink-0 w-12 h-9 rounded-lg grid place-items-center font-black text-[#F6C756] text-sm"
        style={{
          background: "linear-gradient(180deg, #4A0075, #1F0033)",
          border: "1.5px solid #F6C756",
          boxShadow: "inset 0 1px 2px rgba(255,255,255,.15)",
        }}
      >
        {label}
      </span>
      <span
        className="flex-1 h-7 rounded-full relative overflow-hidden"
        style={{
          background: "rgba(255,255,255,.55)",
          border: "1px solid #E9DDF8",
          boxShadow: "inset 0 1px 3px rgba(0,0,0,.08)",
        }}
      >
        <span
          className="absolute inset-y-0 left-0 rounded-full transition-[width] duration-500"
          style={{
            width: `${pct}%`,
            background:
              "linear-gradient(180deg, #B14CF0 0%, #6A0DAD 45%, #2A0050 100%)",
            border: "1.5px solid #F6C756",
            boxShadow:
              "0 4px 10px rgba(74,0,117,.45), inset 0 2px 3px rgba(255,255,255,.25)",
          }}
        />
      </span>
      <span className="w-10 text-right font-black text-[#3A0068]">
        {value.toString().padStart(2, "0")}
      </span>
      {trailing && (
        <span className="shrink-0 min-w-[52px] text-center text-xs font-bold text-[#3A0068] rounded-md border border-[#E9DDF8] py-1 px-2 bg-white">
          {trailing}
        </span>
      )}
    </button>
  );
}