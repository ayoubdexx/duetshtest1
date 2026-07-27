import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { CheckCircle2, ChevronRight, Circle, CircleDot, Clock, Sparkles } from "lucide-react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { levelMeta, LEVELS, type LevelCode } from "@/lib/levels";
import { iconFor } from "@/lib/icon-map";
import { PageHeader } from "@/components/app/page-header";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn, formatMinutes } from "@/lib/utils";

export async function generateMetadata({ params }: { params: Promise<{ level: string }> }) {
  const { level } = await params;
  return { title: `${level.toUpperCase()} Course` };
}

const TYPE_BADGES: Record<string, { label: string; variant: "secondary" | "brand" | "success" }> = {
  REVISION: { label: "Revision", variant: "secondary" },
  MINI_TEST: { label: "Mini Test", variant: "brand" },
  FINAL_EXAM: { label: "Final Exam", variant: "brand" },
};

export default async function LevelPage({ params }: { params: Promise<{ level: string }> }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  const userId = session.user.id;

  const { level: levelParam } = await params;
  const code = levelParam.toUpperCase();
  if (!LEVELS.includes(code as LevelCode)) notFound();

  const [level, progress] = await Promise.all([
    prisma.level.findUnique({
      where: { code },
      include: {
        modules: {
          orderBy: { order: "asc" },
          include: { lessons: { where: { published: true }, orderBy: { order: "asc" } } },
        },
      },
    }),
    prisma.lessonProgress.findMany({ where: { userId }, select: { lessonId: true, status: true } }),
  ]);
  if (!level) notFound();

  const meta = levelMeta(code);
  const statusMap = new Map(progress.map((p) => [p.lessonId, p.status]));
  const allLessons = level.modules.flatMap((m) => m.lessons);
  const done = allLessons.filter((l) => statusMap.get(l.id) === "COMPLETED").length;
  const pct = allLessons.length > 0 ? Math.round((done / allLessons.length) * 100) : 0;
  const totalMinutes = allLessons.reduce((acc, l) => acc + l.durationMin, 0);

  return (
    <div>
      <div className="mb-3 text-sm text-muted-foreground">
        <Link href="/courses" className="hover:text-foreground">
          Courses
        </Link>{" "}
        / <span className="text-foreground">{code}</span>
      </div>

      <PageHeader title={`${code} — ${level.title}`} description={level.description}>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="gap-1">
            <Clock className="h-3 w-3" /> ~{formatMinutes(totalMinutes)}
          </Badge>
          <Badge variant="secondary" className="gap-1">
            <Sparkles className="h-3 w-3 text-brand-500" /> {allLessons.reduce((a, l) => a + l.xpReward, 0)} XP
          </Badge>
        </div>
      </PageHeader>

      <div className="mb-8 rounded-2xl border bg-card p-5 shadow-card">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="font-semibold">Course progress</span>
          <span className="text-muted-foreground">
            {done}/{allLessons.length} lessons · {pct}%
          </span>
        </div>
        <Progress value={pct} className="h-2.5" indicatorClassName={meta.color} />
      </div>

      <div className="space-y-6">
        {level.modules.map((module, mi) => {
          const Icon = iconFor(module.icon);
          const moduleDone = module.lessons.filter((l) => statusMap.get(l.id) === "COMPLETED").length;
          const modulePct = module.lessons.length > 0 ? Math.round((moduleDone / module.lessons.length) * 100) : 0;

          return (
            <div key={module.id} className="overflow-hidden rounded-2xl border bg-card shadow-card">
              <div className="flex items-center gap-4 border-b bg-secondary/40 p-5">
                <div className={cn("flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-white", meta.color)}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="section-label">Module {mi + 1}</span>
                    {modulePct === 100 && <CheckCircle2 className="h-4 w-4 text-emerald-500" />}
                  </div>
                  <h2 className="truncate text-lg font-bold tracking-tight">{module.title}</h2>
                  <p className="truncate text-sm text-muted-foreground">{module.description}</p>
                </div>
                <div className="hidden w-32 shrink-0 sm:block">
                  <div className="mb-1 text-right text-xs text-muted-foreground">
                    {moduleDone}/{module.lessons.length}
                  </div>
                  <Progress value={modulePct} className="h-1.5" indicatorClassName={meta.color} />
                </div>
              </div>

              <div className="divide-y">
                {module.lessons.map((lesson, li) => {
                  const status = statusMap.get(lesson.id);
                  const typeBadge = TYPE_BADGES[lesson.type];
                  return (
                    <Link
                      key={lesson.id}
                      href={`/lessons/${lesson.slug}`}
                      className="group flex items-center gap-4 px-5 py-4 transition-colors hover:bg-accent/60"
                    >
                      <span className="shrink-0">
                        {status === "COMPLETED" ? (
                          <CheckCircle2 className="h-6 w-6 text-emerald-500" />
                        ) : status === "IN_PROGRESS" ? (
                          <CircleDot className="h-6 w-6 text-brand-500" />
                        ) : (
                          <Circle className="h-6 w-6 text-border" />
                        )}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-xs font-semibold text-muted-foreground">
                            {mi + 1}.{li + 1}
                          </span>
                          <span className="truncate font-medium">{lesson.title}</span>
                          {typeBadge && (
                            <Badge variant={typeBadge.variant} className="text-[10px]">
                              {typeBadge.label}
                            </Badge>
                          )}
                        </div>
                        {lesson.subtitle && <div className="mt-0.5 truncate text-sm text-muted-foreground">{lesson.subtitle}</div>}
                      </div>
                      <div className="hidden shrink-0 items-center gap-3 text-xs text-muted-foreground sm:flex">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" /> {lesson.durationMin} min
                        </span>
                        <span className="flex items-center gap-1">
                          <Sparkles className="h-3 w-3 text-brand-500" /> {lesson.xpReward} XP
                        </span>
                      </div>
                      <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
