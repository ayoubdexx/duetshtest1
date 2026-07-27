import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ArrowRight,
  BookOpen,
  Dumbbell,
  Flame,
  GraduationCap,
  Headphones,
  Layers,
  Mic,
  PenLine,
  Sparkles,
  Target,
  Trophy,
} from "lucide-react";
import { startOfDay, subDays, format } from "date-fns";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { levelMeta } from "@/lib/levels";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Heatmap } from "@/components/app/heatmap";
import { WeeklyChart } from "@/components/app/weekly-chart";

export const metadata = { title: "Dashboard" };

const QUICK_LINKS = [
  { title: "Grammar", href: "/grammar", icon: BookOpen, color: "bg-sky-100 text-sky-600 dark:bg-sky-900/40 dark:text-sky-400" },
  { title: "Flashcards", href: "/flashcards", icon: Layers, color: "bg-violet-100 text-violet-600 dark:bg-violet-900/40 dark:text-violet-400" },
  { title: "Exercises", href: "/exercises", icon: Dumbbell, color: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400" },
  { title: "Listening", href: "/listening", icon: Headphones, color: "bg-rose-100 text-rose-600 dark:bg-rose-900/40 dark:text-rose-400" },
  { title: "Speaking", href: "/speaking", icon: Mic, color: "bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400" },
  { title: "Writing", href: "/writing", icon: PenLine, color: "bg-teal-100 text-teal-600 dark:bg-teal-900/40 dark:text-teal-400" },
];

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  const userId = session.user.id;

  const today = startOfDay(new Date());
  const heatmapStart = subDays(today, 17 * 7);

  const [user, dueCards, inProgress, completedCount, activities, skills, groupCount] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: { name: true, currentLevel: true, xp: true, streak: true, dailyGoalMin: true, examDate: true, examTarget: true },
    }),
    prisma.flashcard.count({ where: { userId, dueAt: { lte: new Date() } } }),
    prisma.lessonProgress.findFirst({
      where: { userId, status: "IN_PROGRESS" },
      orderBy: { updatedAt: "desc" },
      include: { lesson: { include: { module: true } } },
    }),
    prisma.lessonProgress.count({ where: { userId, status: "COMPLETED" } }),
    prisma.studyActivity.findMany({
      where: { userId, date: { gte: heatmapStart } },
      orderBy: { date: "asc" },
    }),
    prisma.skillScore.findMany({ where: { userId }, orderBy: { score: "desc" } }),
    prisma.groupMember.count({ where: { userId } }),
  ]);

  if (!user) redirect("/login");
  const meta = levelMeta(user.currentLevel);

  const announcement = await prisma.announcement.findFirst({
    where: { createdAt: { gte: subDays(new Date(), 14) } },
    orderBy: { createdAt: "desc" },
    include: { author: { select: { name: true } } },
  });

  // Next lesson to continue (resume in-progress, else first not completed in current level)
  let resume: { title: string; subtitle: string; href: string; pct: number } | null = null;
  if (inProgress) {
    const total = Array.isArray(inProgress.lesson.blocks) ? (inProgress.lesson.blocks as unknown[]).length : 1;
    resume = {
      title: inProgress.lesson.title,
      subtitle: `${inProgress.lesson.module.levelCode} · ${inProgress.lesson.module.title}`,
      href: `/lessons/${inProgress.lesson.slug}`,
      pct: Math.min(99, Math.round((inProgress.blockIndex / Math.max(1, total)) * 100)),
    };
  } else {
    const completedIds = (
      await prisma.lessonProgress.findMany({ where: { userId, status: "COMPLETED" }, select: { lessonId: true } })
    ).map((p) => p.lessonId);
    const next = await prisma.lesson.findFirst({
      where: { published: true, module: { levelCode: user.currentLevel }, id: { notIn: completedIds } },
      orderBy: [{ module: { order: "asc" } }, { order: "asc" }],
      include: { module: true },
    });
    if (next) {
      resume = {
        title: next.title,
        subtitle: `${next.module.levelCode} · ${next.module.title}`,
        href: `/lessons/${next.slug}`,
        pct: 0,
      };
    }
  }

  // Today's stats & weekly chart
  const todayKey = format(today, "yyyy-MM-dd");
  const heatmapData: Record<string, number> = {};
  for (const a of activities) heatmapData[format(a.date, "yyyy-MM-dd")] = a.xp;
  const todayMinutes = activities.find((a) => format(a.date, "yyyy-MM-dd") === todayKey)?.minutes ?? 0;
  const goalPct = Math.min(100, Math.round((todayMinutes / Math.max(1, user.dailyGoalMin)) * 100));

  const weekData = Array.from({ length: 7 }, (_, i) => {
    const d = subDays(today, 6 - i);
    const key = format(d, "yyyy-MM-dd");
    const a = activities.find((x) => format(x.date, "yyyy-MM-dd") === key);
    return { day: format(d, "EEE"), minutes: a?.minutes ?? 0, xp: a?.xp ?? 0 };
  });

  const strongest = skills.slice(0, 3);
  const weakest = [...skills].sort((a, b) => a.score - b.score).slice(0, 3);

  const daysToExam = user.examDate
    ? Math.max(0, Math.ceil((user.examDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : null;

  const firstName = user.name.split(" ")[0];
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Guten Morgen" : hour < 18 ? "Guten Tag" : "Guten Abend";

  return (
    <div className="space-y-8">
      {/* Greeting */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{format(new Date(), "EEEE, d MMMM yyyy")}</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
            {greeting}, {firstName}! 👋
          </h1>
        </div>
        <Link href="/daily">
          <Button size="lg">
            <Target className="h-4 w-4" /> Start today's session
          </Button>
        </Link>
      </div>

      {/* Announcement */}
      {announcement && (
        <div className="flex items-start gap-3 rounded-2xl border border-brand-200 bg-brand-50/60 p-4 dark:border-brand-900 dark:bg-brand-950/40">
          <span className="text-xl">📣</span>
          <div>
            <div className="text-sm font-bold">{announcement.title}</div>
            <p className="mt-0.5 text-sm text-foreground/80">{announcement.content}</p>
            <div className="mt-1 text-xs text-muted-foreground">
              {announcement.author.name} · {format(announcement.createdAt, "d MMM")}
            </div>
          </div>
        </div>
      )}

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-100 dark:bg-orange-900/40">
              <Flame className="h-5 w-5 text-orange-500" />
            </div>
            <div>
              <div className="text-2xl font-bold leading-none">{user.streak}</div>
              <div className="mt-1 text-xs text-muted-foreground">day streak</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-100 dark:bg-brand-900/40">
              <Sparkles className="h-5 w-5 text-brand-600 dark:text-brand-400" />
            </div>
            <div>
              <div className="text-2xl font-bold leading-none">{user.xp.toLocaleString()}</div>
              <div className="mt-1 text-xs text-muted-foreground">total XP</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-900/40">
              <GraduationCap className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <div className="text-2xl font-bold leading-none">{completedCount}</div>
              <div className="mt-1 text-xs text-muted-foreground">lessons completed</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-100 dark:bg-violet-900/40">
              <Layers className="h-5 w-5 text-violet-600 dark:text-violet-400" />
            </div>
            <div>
              <div className="text-2xl font-bold leading-none">{dueCards}</div>
              <div className="mt-1 text-xs text-muted-foreground">cards due today</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Continue + goal */}
      <div className="grid gap-5 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle>Continue learning</CardTitle>
              <Badge variant="brand">{user.currentLevel}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            {resume ? (
              <Link href={resume.href} className="group block">
                <div className="flex items-center justify-between gap-4 rounded-2xl border bg-secondary/50 p-5 transition-colors group-hover:bg-secondary">
                  <div className="min-w-0">
                    <div className="text-xs font-medium text-muted-foreground">{resume.subtitle}</div>
                    <div className="mt-1 truncate text-lg font-semibold">{resume.title}</div>
                    <div className="mt-3 flex items-center gap-3">
                      <Progress value={resume.pct} className="h-1.5 w-40" indicatorClassName="bg-brand-500" />
                      <span className="text-xs text-muted-foreground">{resume.pct}%</span>
                    </div>
                  </div>
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform group-hover:translate-x-0.5">
                    <ArrowRight className="h-5 w-5" />
                  </div>
                </div>
              </Link>
            ) : (
              <div className="rounded-2xl border bg-secondary/50 p-5 text-sm text-muted-foreground">
                🎉 You've completed every lesson in {user.currentLevel}! Head to{" "}
                <Link href="/courses" className="font-medium text-foreground underline underline-offset-4">
                  Courses
                </Link>{" "}
                to start the next level.
              </div>
            )}

            {/* Quick links */}
            <div className="mt-5 grid grid-cols-3 gap-3 sm:grid-cols-6">
              {QUICK_LINKS.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="card-hover flex flex-col items-center gap-2 rounded-xl border bg-card p-3 text-center"
                >
                  <span className={`flex h-9 w-9 items-center justify-center rounded-lg ${l.color}`}>
                    <l.icon className="h-4 w-4" />
                  </span>
                  <span className="text-[11px] font-medium">{l.title}</span>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Today's goal</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <div className="relative h-36 w-36">
              <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
                <circle cx="60" cy="60" r="52" fill="none" strokeWidth="10" className="stroke-secondary" />
                <circle
                  cx="60"
                  cy="60"
                  r="52"
                  fill="none"
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={`${(goalPct / 100) * 326.7} 326.7`}
                  className="stroke-brand-500 transition-all duration-700"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold">{todayMinutes}</span>
                <span className="text-xs text-muted-foreground">of {user.dailyGoalMin} min</span>
              </div>
            </div>
            <p className="mt-4 text-center text-sm text-muted-foreground">
              {goalPct >= 100 ? "Tagesziel erreicht! Goal reached 🎉" : `${goalPct}% of your daily goal`}
            </p>
            {daysToExam !== null && (
              <div className="mt-4 w-full rounded-xl border bg-secondary/50 p-3 text-center">
                <div className="text-lg font-bold">{daysToExam} days</div>
                <div className="text-xs text-muted-foreground">until {user.examTarget ?? "your exam"}</div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Activity + skills */}
      <div className="grid gap-5 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle>Your activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <WeeklyChart data={weekData} />
            <Heatmap data={heatmapData} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle>Skills</CardTitle>
              <Link href="/statistics" className="text-xs font-medium text-muted-foreground hover:text-foreground">
                See all →
              </Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            {skills.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Complete a few exercises and your strong & weak areas will appear here.
              </p>
            ) : (
              <>
                <div>
                  <div className="section-label mb-2">Strongest</div>
                  <div className="space-y-2.5">
                    {strongest.map((s) => (
                      <div key={s.skill}>
                        <div className="mb-1 flex justify-between text-xs">
                          <span className="font-medium capitalize">{s.skill.toLowerCase()}</span>
                          <span className="text-muted-foreground">{Math.round(s.score)}%</span>
                        </div>
                        <Progress value={s.score} className="h-1.5" indicatorClassName="bg-emerald-500" />
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="section-label mb-2">Focus areas</div>
                  <div className="space-y-2.5">
                    {weakest.map((s) => (
                      <div key={s.skill}>
                        <div className="mb-1 flex justify-between text-xs">
                          <span className="font-medium capitalize">{s.skill.toLowerCase()}</span>
                          <span className="text-muted-foreground">{Math.round(s.score)}%</span>
                        </div>
                        <Progress value={s.score} className="h-1.5" indicatorClassName="bg-rose-400" />
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
            <Link href="/achievements" className="block">
              <Button variant="outline" className="w-full">
                <Trophy className="h-4 w-4 text-brand-500" /> View achievements
              </Button>
            </Link>
            {groupCount === 0 && (
              <p className="text-center text-xs text-muted-foreground">
                Tip: studying with friends doubles your consistency —{" "}
                <Link href="/community" className="font-medium text-foreground underline underline-offset-2">
                  join a study group
                </Link>
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
