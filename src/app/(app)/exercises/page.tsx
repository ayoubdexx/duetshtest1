import Link from "next/link";
import { redirect } from "next/navigation";
import { ChevronRight, ListChecks, Shuffle, TextCursorInput, GitCompareArrows } from "lucide-react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { levelMeta, LEVELS } from "@/lib/levels";
import { PageHeader } from "@/components/app/page-header";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export const metadata = { title: "Exercises" };

const SKILLS = ["GRAMMAR", "VOCABULARY", "READING", "LISTENING"] as const;

const TYPE_META: Record<string, { label: string; icon: typeof ListChecks }> = {
  MCQ: { label: "Multiple choice", icon: ListChecks },
  GAP_FILL: { label: "Fill in the blanks", icon: TextCursorInput },
  ORDERING: { label: "Sentence ordering", icon: Shuffle },
  MATCHING: { label: "Matching", icon: GitCompareArrows },
};

export default async function ExercisesPage({
  searchParams,
}: {
  searchParams: Promise<{ level?: string; skill?: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  const userId = session.user.id;

  const { level, skill } = await searchParams;
  const activeLevel = level && LEVELS.includes(level.toUpperCase() as (typeof LEVELS)[number]) ? level.toUpperCase() : null;
  const activeSkill = skill && SKILLS.includes(skill.toUpperCase() as (typeof SKILLS)[number]) ? skill.toUpperCase() : null;

  const [exercises, attempts] = await Promise.all([
    prisma.exercise.findMany({
      where: {
        ...(activeLevel ? { levelCode: activeLevel } : {}),
        ...(activeSkill ? { skill: activeSkill as (typeof SKILLS)[number] } : {}),
      },
      orderBy: [{ level: { order: "asc" } }, { title: "asc" }],
    }),
    prisma.exerciseAttempt.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      select: { exerciseId: true, correct: true, total: true },
    }),
  ]);

  // Best score per exercise
  const best = new Map<string, number>();
  for (const a of attempts) {
    const pct = Math.round((a.correct / a.total) * 100);
    if (!best.has(a.exerciseId) || best.get(a.exerciseId)! < pct) best.set(a.exerciseId, pct);
  }

  function filterHref(l: string | null, s: string | null) {
    const params = new URLSearchParams();
    if (l) params.set("level", l.toLowerCase());
    if (s) params.set("skill", s.toLowerCase());
    const qs = params.toString();
    return qs ? `/exercises?${qs}` : "/exercises";
  }

  return (
    <div>
      <PageHeader
        title="Exercises"
        description="Grammar and vocabulary drills with instant feedback and detailed explanations. Every attempt sharpens your skill scores."
      />

      <div className="mb-3 flex flex-wrap gap-2">
        <Link href={filterHref(null, activeSkill)}>
          <Badge variant={activeLevel === null ? "default" : "secondary"} className="cursor-pointer px-3 py-1.5 text-xs">
            All levels
          </Badge>
        </Link>
        {LEVELS.map((code) => (
          <Link key={code} href={filterHref(code, activeSkill)}>
            <Badge
              variant="secondary"
              className={cn("cursor-pointer px-3 py-1.5 text-xs", activeLevel === code && `${levelMeta(code).color} border-transparent text-white`)}
            >
              {code}
            </Badge>
          </Link>
        ))}
      </div>
      <div className="mb-8 flex flex-wrap gap-2">
        <Link href={filterHref(activeLevel, null)}>
          <Badge variant={activeSkill === null ? "default" : "secondary"} className="cursor-pointer px-3 py-1.5 text-xs">
            All skills
          </Badge>
        </Link>
        {SKILLS.map((s) => (
          <Link key={s} href={filterHref(activeLevel, s)}>
            <Badge variant={activeSkill === s ? "default" : "secondary"} className="cursor-pointer px-3 py-1.5 text-xs capitalize">
              {s.toLowerCase()}
            </Badge>
          </Link>
        ))}
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {exercises.map((ex) => {
          const meta = levelMeta(ex.levelCode);
          const typeMeta = TYPE_META[ex.type] ?? TYPE_META.MCQ;
          const TypeIcon = typeMeta.icon;
          const questionCount = Array.isArray(ex.questions) ? (ex.questions as unknown[]).length : 0;
          const bestPct = best.get(ex.id);

          return (
            <Link key={ex.slug} href={`/exercises/${ex.slug}`} className="group">
              <div className="card-hover flex h-full flex-col rounded-2xl border bg-card p-5 shadow-card">
                <div className="flex items-start justify-between gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${meta.bg}`}>
                    <TypeIcon className={`h-4.5 h-5 w-5 ${meta.text}`} />
                  </div>
                  {bestPct !== undefined && (
                    <Badge variant={bestPct >= 80 ? "success" : "secondary"} className="text-[10px]">
                      Best: {bestPct}%
                    </Badge>
                  )}
                </div>
                <h3 className="mt-3 font-semibold leading-snug">{ex.title}</h3>
                <div className="mt-2 flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
                  <Badge variant="secondary" className="text-[10px]">
                    {ex.levelCode}
                  </Badge>
                  <span>{typeMeta.label}</span>
                  <span>·</span>
                  <span>{questionCount} questions</span>
                </div>
                <div className="mt-auto flex items-center gap-1 pt-3 text-sm font-medium text-foreground">
                  Practice
                  <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
      {exercises.length === 0 && (
        <div className="rounded-2xl border p-10 text-center text-muted-foreground">No exercises match these filters.</div>
      )}
    </div>
  );
}
