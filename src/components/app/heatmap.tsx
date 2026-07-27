"use client";

import { useMemo } from "react";
import { cn } from "@/lib/utils";

interface HeatmapProps {
  /** date (yyyy-MM-dd) → xp earned */
  data: Record<string, number>;
  weeks?: number;
}

function intensity(xp: number): string {
  if (xp <= 0) return "bg-secondary";
  if (xp < 30) return "bg-brand-200 dark:bg-brand-900";
  if (xp < 80) return "bg-brand-400 dark:bg-brand-700";
  if (xp < 150) return "bg-brand-500 dark:bg-brand-600";
  return "bg-brand-600 dark:bg-brand-500";
}

export function Heatmap({ data, weeks = 17 }: HeatmapProps) {
  const grid = useMemo(() => {
    const days = weeks * 7;
    const today = new Date();
    const cells: { key: string; xp: number; label: string }[] = [];
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      const xp = data[key] ?? 0;
      cells.push({
        key,
        xp,
        label: `${d.toLocaleDateString("en", { month: "short", day: "numeric" })} — ${xp} XP`,
      });
    }
    return cells;
  }, [data, weeks]);

  return (
    <div>
      <div className="grid grid-flow-col gap-[3px]" style={{ gridTemplateRows: "repeat(7, minmax(0, 1fr))" }}>
        {grid.map((cell) => (
          <div
            key={cell.key}
            title={cell.label}
            className={cn("aspect-square w-full min-w-[8px] rounded-[3px]", intensity(cell.xp))}
          />
        ))}
      </div>
      <div className="mt-3 flex items-center justify-end gap-1.5 text-[10px] text-muted-foreground">
        Less
        {["bg-secondary", "bg-brand-200 dark:bg-brand-900", "bg-brand-400 dark:bg-brand-700", "bg-brand-600 dark:bg-brand-500"].map(
          (c) => (
            <span key={c} className={cn("h-2.5 w-2.5 rounded-[3px]", c)} />
          )
        )}
        More
      </div>
    </div>
  );
}
