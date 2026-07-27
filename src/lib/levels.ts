export const LEVELS = ["A1", "A2", "B1", "B2"] as const;
export type LevelCode = (typeof LEVELS)[number];

export const LEVEL_META: Record<
  LevelCode,
  { title: string; tagline: string; color: string; text: string; bg: string; ring: string; hex: string }
> = {
  A1: {
    title: "Anfänger",
    tagline: "Erste Schritte — greet, introduce yourself, everyday basics",
    color: "bg-emerald-500",
    text: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-50 dark:bg-emerald-950/40",
    ring: "ring-emerald-500/20",
    hex: "#10b981",
  },
  A2: {
    title: "Grundlagen",
    tagline: "Alltagsdeutsch — routines, shopping, simple past events",
    color: "bg-sky-500",
    text: "text-sky-600 dark:text-sky-400",
    bg: "bg-sky-50 dark:bg-sky-950/40",
    ring: "ring-sky-500/20",
    hex: "#0ea5e9",
  },
  B1: {
    title: "Mittelstufe",
    tagline: "Selbstständig — opinions, work, travel, connected speech",
    color: "bg-violet-500",
    text: "text-violet-600 dark:text-violet-400",
    bg: "bg-violet-50 dark:bg-violet-950/40",
    ring: "ring-violet-500/20",
    hex: "#8b5cf6",
  },
  B2: {
    title: "Fortgeschritten",
    tagline: "Fließend — abstract topics, debate, professional German",
    color: "bg-rose-500",
    text: "text-rose-600 dark:text-rose-400",
    bg: "bg-rose-50 dark:bg-rose-950/40",
    ring: "ring-rose-500/20",
    hex: "#f43f5e",
  },
};

export function levelMeta(code: string) {
  return LEVEL_META[(code as LevelCode) in LEVEL_META ? (code as LevelCode) : "A1"];
}

export function nextLevel(code: string): LevelCode | null {
  const i = LEVELS.indexOf(code as LevelCode);
  return i >= 0 && i < LEVELS.length - 1 ? LEVELS[i + 1] : null;
}
