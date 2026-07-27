import { redirect } from "next/navigation";
import { format, startOfDay, subDays } from "date-fns";
import { BookOpen, Clock, Dumbbell, Flame, Layers, Sparkles } from "lucide-react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatMinutes } from "@/lib/utils";
import { PageHeader } from "@/components/app/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heatmap } from "@/components/app/heatmap";
import { SkillRadar, MinutesBarChart } from "@/components/app/stats-charts";

export const metadata = { title: "Statistics" };

const ALL_SKILLS = ["GRAMMAR", "VOCABULARY", "READING", "LISTENING", "WRITING", "SPEAKING", "PRONUNCIATION", "EXAM"];

export default async function StatisticsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  const userId = session.user.id;

  const today = startOfDay(new Date());
  const [user, minutesAgg, lessons, reviews, exercises, examAttempts, skills, activities, deckCount, retentionLogs] =
    await Promise.all([
      prisma.user.findUnique({
        where: { id: userId },
        select: { xp: true, streak: true, longestStreak: true, currentLevel: true, createdAt: true },
      }),
      prisma.studyActivity.aggregate({ where: { userId }, _sum: { minutes: true } }),
      prisma.lessonProgress.count({ where: { userId, status: "COMPLETED" } }),
      prisma.reviewLog.count({ where: { userId } }),
      prisma.exerciseAttempt.count({ where: { userId } }),
      prisma.examAttempt.findMany({
        where: { userId, finishedAt: { not: null } },
        orderBy: { finishedAt: "desc" },
        take: 6,
        include: { exam: { select: { title: true, levelCode: true } } },
      }),
      prisma.skillScore.findMany({ where: { userId } }),
      prisma.studyActivity.findMany({
        where: { userId, date: { gte: subDays(today, 26 * 7) } },
        orderBy: { date: "asc" },
      }),
      prisma.flashcard.count({ where: { userId } }),
      prisma.reviewLog.findMany({
        where: { userId, reviewedAt: { gte: subDays(new Date(), 30) } },
        select: { rating: true },
      }),
    ]);

  const totalMinutes = minutesAgg._sum.minutes ?? 0;
  const retention =
    retentionLogs.length > 0
      ? Math.round((retentionLogs.filter((l) => l.rating >= 2).length / retentionLogs.length) * 100)
      : null;

  const skillMap = new Map(skills.map((s) => [s.skill as string, s.score]));
  const radarData = ALL_SKILLS.map((s) => ({
    skill: s.charAt(0) + s.slice(1).toLowerCase(),
    score: Math.round(skillMap.get(s) ?? 0),
  }));

  const heatmapData: Record<string, number> = {};
  for (const a of activities) heatmapData[format(a.date, "yyyy-MM-dd")] = a.xp;

  const barData = Array.from({ length: 14 }, (_, i) => {
    const d = subDays(today, 13 - i);
    const key = format(d, "yyyy-MM-dd");
    const a = activities.find((x) => format(x.date, "yyyy-MM-dd") === key);
    return { label: format(d, "d.M."), minutes: a?.minutes ?? 0 };
  });

  const stats = [
    { icon: Clock, label: "Total study time", value: formatMinutes(totalMinutes), color: "text-sky-500" },
    { icon: Sparkles, label: "Total XP", value: (user?.xp ?? 0).toLocaleString(), color: "text-brand-500" },
    { icon: BookOpen, label: "Lessons completed", value: String(lessons), color: "text-emerald-500" },
    { icon: Layers, label: "Card reviews", value: reviews.toLocaleString(), color: "text-violet-500" },
    { icon: Dumbbell, label: "Exercises done", value: String(exercises), color: "text-rose-500" },
    { icon: Flame, label: "Longest streak", value: `${user?.longestStreak ?? 0} days`, color: "text-orange-500" },
  ];

  return (
    <div>
      <PageHeader
        title="Statistics"
        description={`Learning since ${user?.createdAt.toLocaleDateString("en", { month: "long", year: "numeric" })} — here's the full picture.`}
      />

      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardContent className="p-4">
              <s.icon className={`h-4 w-4 ${s.color}`} />
              <div className="mt-2 text-xl font-bold leading-none tracking-tight">{s.value}</div>
              <div className="mt-1 text-xs text-muted-foreground">{s.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Skill profile</CardTitle>
          </CardHeader>
          <CardContent>
            <SkillRadar data={radarData} />
            <p className="text-center text-xs text-muted-foreground">
              Average scores from your exercises, readings, listening and writing feedback.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Last 14 days</CardTitle>
          </CardHeader>
          <CardContent>
            <MinutesBarChart data={barData} />
            <div className="mt-4 flex items-center justify-between rounded-xl bg-secondary/50 px-4 py-2.5 text-sm">
              <span className="text-muted-foreground">Flashcard retention (30d)</span>
              <span className="font-bold">{retention !== null ? `${retention}%` : "—"}</span>
            </div>
            <div className="mt-2 flex items-center justify-between rounded-xl bg-secondary/50 px-4 py-2.5 text-sm">
              <span className="text-muted-foreground">Deck size</span>
              <span className="font-bold">{deckCount} cards</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-5">
        <CardHeader className="pb-2">
          <CardTitle>Half-year activity</CardTitle>
        </CardHeader>
        <CardContent>
          <Heatmap data={heatmapData} weeks={26} />
        </CardContent>
      </Card>

      {examAttempts.length > 0 && (
        <Card className="mt-5">
          <CardHeader className="pb-2">
            <CardTitle>Mock exam history</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="divide-y">
              {examAttempts.map((a) => {
                const pct = a.score !== null && a.maxScore ? Math.round((a.score / a.maxScore) * 100) : 0;
                return (
                  <div key={a.id} className="flex items-center gap-3 py-3 text-sm">
                    <Badge variant="secondary">{a.exam.levelCode}</Badge>
                    <span className="min-w-0 flex-1 truncate font-medium">{a.exam.title}</span>
                    <span className="hidden text-muted-foreground sm:block">
                      {a.finishedAt?.toLocaleDateString("en", { month: "short", day: "numeric" })}
                    </span>
                    <span className="font-bold">{pct}%</span>
                    <Badge variant={a.passed ? "success" : "secondary"}>{a.passed ? "Passed" : "Failed"}</Badge>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
