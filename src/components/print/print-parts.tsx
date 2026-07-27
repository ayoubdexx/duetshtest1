export function PrintHeader({
  eyebrow,
  title,
  subtitle,
  badge,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  badge?: string;
}) {
  return (
    <header className="mb-8 border-b-2 border-zinc-900 pb-5">
      <div className="flex items-center justify-between">
        <div className="text-lg font-bold tracking-tight">
          Deutsch<span className="text-amber-600">werk</span>
        </div>
        {badge && <span className="rounded-lg border-2 border-zinc-900 px-2.5 py-1 text-sm font-bold">{badge}</span>}
      </div>
      <div className="mt-4 text-[11px] font-bold uppercase tracking-[0.18em] text-zinc-500">{eyebrow}</div>
      <h1 className="mt-1 text-3xl font-bold tracking-tight">{title}</h1>
      {subtitle && <p className="mt-1.5 text-sm text-zinc-600">{subtitle}</p>}
    </header>
  );
}

export function PrintFooter() {
  return (
    <footer className="mt-12 border-t pt-4 text-center text-[10px] text-zinc-400">
      Deutschwerk · Dein Weg von A1 bis B2 · Printed learning material — for personal study use
    </footer>
  );
}
