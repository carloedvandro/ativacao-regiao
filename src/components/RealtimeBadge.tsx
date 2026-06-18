export default function RealtimeBadge() {
  return (
    <div className="flex flex-col items-end gap-1 rounded-xl border border-slate-200 bg-white px-4 py-2 shadow-sm">
      <div className="flex items-center gap-2">
        <span className="relative flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
        </span>
        <span className="text-sm font-semibold text-slate-800">Em tempo real</span>
      </div>
      <span className="text-xs text-slate-500">Atualizando a cada 3s</span>
    </div>
  );
}