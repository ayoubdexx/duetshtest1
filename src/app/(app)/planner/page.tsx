import { redirect } from "next/navigation";
import { format, startOfMonth, endOfMonth } from "date-fns";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/app/page-header";
import { PlannerApp } from "@/components/planner/planner-app";

export const metadata = { title: "Study Planner" };

export default async function PlannerPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  const userId = session.user.id;

  const now = new Date();
  const [user, items, goals, lessonsDone, cardsReviewed, minutesAgg] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId }, select: { examDate: true, examTarget: true, xp: true } }),
    prisma.plannerItem.findMany({
      where: { userId, date: { gte: startOfMonth(now), lte: endOfMonth(now) } },
      orderBy: { date: "asc" },
    }),
    prisma.goal.findMany({ where: { userId }, orderBy: { createdAt: "asc" } }),
    prisma.lessonProgress.count({ where: { userId, status: "COMPLETED" } }),
    prisma.reviewLog.count({ where: { userId } }),
    prisma.studyActivity.aggregate({ where: { userId }, _sum: { minutes: true } }),
  ]);

  const currentByMetric: Record<string, number> = {
    xp: user?.xp ?? 0,
    minutes: minutesAgg._sum.minutes ?? 0,
    lessons: lessonsDone,
    cards: cardsReviewed,
  };

  return (
    <div>
      <PageHeader
        title="Study Planner"
        description="Plan your week, set goals and count down to your exam — consistency is the whole secret."
      />
      <PlannerApp
        initialItems={items.map((i) => ({
          id: i.id,
          date: format(i.date, "yyyy-MM-dd"),
          title: i.title,
          type: i.type,
          href: i.href,
          done: i.done,
        }))}
        goals={goals.map((g) => ({
          id: g.id,
          title: g.title,
          metric: g.metric,
          target: g.target,
          current: currentByMetric[g.metric] ?? 0,
          deadline: g.deadline?.toISOString() ?? null,
          done: g.done,
        }))}
        examDate={user?.examDate?.toISOString() ?? null}
        examTarget={user?.examTarget ?? null}
      />
    </div>
  );
}
