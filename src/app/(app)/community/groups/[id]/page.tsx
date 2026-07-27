import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { subDays } from "date-fns";
import { Crown, Flame, Lock, Sparkles } from "lucide-react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { GroupChat } from "@/components/community/group-chat";
import { CopyCodeButton, LeaveGroupButton, NewChallengeDialog } from "@/components/community/group-actions";
import { cn } from "@/lib/utils";

export const metadata = { title: "Study Group" };

function initials(name: string) {
  return name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();
}

export default async function GroupPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  const userId = session.user.id;
  const { id } = await params;

  const group = await prisma.studyGroup.findUnique({
    where: { id },
    include: {
      members: { include: { user: { select: { id: true, name: true, avatarUrl: true, xp: true, streak: true, currentLevel: true } } } },
      challenges: { orderBy: { endsAt: "desc" }, take: 5 },
    },
  });
  if (!group) notFound();

  const myMembership = group.members.find((m) => m.userId === userId);
  if (!myMembership) redirect("/community");

  const memberIds = group.members.map((m) => m.userId);
  const weekAgo = subDays(new Date(), 7);

  const [weeklyActivity, lessonCounts] = await Promise.all([
    prisma.studyActivity.groupBy({
      by: ["userId"],
      where: { userId: { in: memberIds }, date: { gte: weekAgo } },
      _sum: { xp: true, minutes: true, lessons: true, cards: true },
    }),
    prisma.lessonProgress.groupBy({
      by: ["userId"],
      where: { userId: { in: memberIds }, status: "COMPLETED" },
      _count: true,
    }),
  ]);

  const weeklyMap = new Map(weeklyActivity.map((w) => [w.userId, w._sum]));
  const lessonsMap = new Map(lessonCounts.map((l) => [l.userId, l._count]));

  const memberRows = group.members
    .map((m) => ({
      ...m,
      weekXp: weeklyMap.get(m.userId)?.xp ?? 0,
      weekMinutes: weeklyMap.get(m.userId)?.minutes ?? 0,
      lessons: lessonsMap.get(m.userId) ?? 0,
    }))
    .sort((a, b) => b.weekXp - a.weekXp);

  // Challenge progress
  const now = new Date();
  const challengeData = await Promise.all(
    group.challenges.map(async (c) => {
      const sums = await prisma.studyActivity.groupBy({
        by: ["userId"],
        where: { userId: { in: memberIds }, date: { gte: c.startsAt, lte: c.endsAt } },
        _sum: { xp: true, minutes: true, lessons: true, cards: true },
      });
      const metricKey = c.metric as "xp" | "minutes" | "lessons" | "cards";
      const progress = memberRows.map((m) => ({
        name: m.user.name,
        userId: m.userId,
        value: (sums.find((s) => s.userId === m.userId)?._sum[metricKey] as number | null) ?? 0,
      }));
      progress.sort((a, b) => b.value - a.value);
      return { challenge: c, progress, active: c.endsAt > now };
    })
  );

  return (
    <div className="mx-auto max-w-5xl">
      {/* Header */}
      <div className="mb-2 text-sm text-muted-foreground">
        <Link href="/community" className="hover:text-foreground">
          Community
        </Link>{" "}
        / <span className="text-foreground">{group.name}</span>
      </div>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-400 to-brand-600 text-xl font-bold text-white">
            {group.name.slice(0, 1).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight">{group.name}</h1>
              {group.isPrivate && <Lock className="h-4 w-4 text-muted-foreground" />}
            </div>
            {group.description && <p className="mt-1 text-muted-foreground">{group.description}</p>}
            <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              <span>{group.members.length} members</span>
              <span>· Invite code:</span>
              <CopyCodeButton code={group.code} />
            </div>
          </div>
        </div>
        <div className="flex shrink-0 gap-2">
          <NewChallengeDialog groupId={group.id} />
          <LeaveGroupButton groupId={group.id} isOwner={myMembership.role === "OWNER"} />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Members comparison */}
        <div className="overflow-hidden rounded-2xl border bg-card shadow-card">
          <div className="border-b bg-secondary/40 px-5 py-3 text-sm font-bold">📊 This week's progress</div>
          <div className="divide-y">
            {memberRows.map((m, i) => (
              <div key={m.id} className={cn("flex items-center gap-3 px-5 py-3", m.userId === userId && "bg-brand-50/60 dark:bg-brand-950/30")}>
                <span className="w-5 text-center text-sm font-bold text-muted-foreground">{i + 1}</span>
                <Avatar className="h-9 w-9">
                  {m.user.avatarUrl ? <AvatarImage src={m.user.avatarUrl} alt={m.user.name} /> : null}
                  <AvatarFallback className="text-xs">{initials(m.user.name)}</AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 text-sm font-medium">
                    <span className="truncate">{m.user.name}</span>
                    {m.role === "OWNER" && <Crown className="h-3.5 w-3.5 shrink-0 text-brand-500" />}
                    {m.userId === userId && <span className="text-xs text-muted-foreground">(you)</span>}
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-muted-foreground">
                    <Badge variant="secondary" className="px-1.5 py-0 text-[9px]">
                      {m.user.currentLevel}
                    </Badge>
                    <span className="flex items-center gap-0.5">
                      <Flame className="h-3 w-3 text-orange-500" /> {m.user.streak}
                    </span>
                    <span>{m.lessons} lessons</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-sm font-bold">
                    <Sparkles className="h-3.5 w-3.5 text-brand-500" />
                    {m.weekXp}
                  </div>
                  <div className="text-[10px] text-muted-foreground">{m.weekMinutes} min</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat */}
        <GroupChat groupId={group.id} currentUserId={userId} />
      </div>

      {/* Challenges */}
      <div className="mt-8">
        <div className="section-label mb-3">🏁 Challenges</div>
        {challengeData.length === 0 ? (
          <div className="rounded-2xl border border-dashed p-8 text-center text-sm text-muted-foreground">
            No challenges yet — start one and race your friends to the target!
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {challengeData.map(({ challenge, progress, active }) => {
              const daysLeft = Math.max(0, Math.ceil((challenge.endsAt.getTime() - Date.now()) / 86400000));
              return (
                <div key={challenge.id} className="rounded-2xl border bg-card p-5 shadow-card">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="font-bold">{challenge.title}</div>
                      <div className="text-xs text-muted-foreground">
                        Target: {challenge.target.toLocaleString()} {challenge.metric}
                        {active ? ` · ${daysLeft} day${daysLeft === 1 ? "" : "s"} left` : " · ended"}
                      </div>
                    </div>
                    <Badge variant={active ? "brand" : "secondary"}>{active ? "Active" : "Ended"}</Badge>
                  </div>
                  <div className="mt-4 space-y-2.5">
                    {progress.slice(0, 5).map((p, i) => {
                      const pct = Math.min(100, Math.round((p.value / Math.max(1, challenge.target)) * 100));
                      return (
                        <div key={p.userId}>
                          <div className="mb-0.5 flex justify-between text-xs">
                            <span className={cn("font-medium", p.userId === userId && "text-brand-700 dark:text-brand-300")}>
                              {i === 0 && p.value > 0 ? "🏆 " : ""}
                              {p.name}
                            </span>
                            <span className="text-muted-foreground">
                              {p.value.toLocaleString()} / {challenge.target.toLocaleString()}
                            </span>
                          </div>
                          <Progress value={pct} className="h-1.5" indicatorClassName={pct >= 100 ? "bg-emerald-500" : "bg-brand-500"} />
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
