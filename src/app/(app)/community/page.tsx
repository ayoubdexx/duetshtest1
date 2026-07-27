import Link from "next/link";
import { redirect } from "next/navigation";
import { subDays } from "date-fns";
import { ChevronRight, Crown, Users, Lock } from "lucide-react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/app/page-header";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CreateGroupDialog, JoinGroupDialog, JoinPublicButton } from "@/components/community/group-dialogs";
import { cn } from "@/lib/utils";

export const metadata = { title: "Community" };

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default async function CommunityPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  const userId = session.user.id;

  const weekAgo = subDays(new Date(), 7);

  const [myMemberships, publicGroups, weeklyTop, allTimeTop] = await Promise.all([
    prisma.groupMember.findMany({
      where: { userId },
      include: { group: { include: { _count: { select: { members: true, challenges: true } } } } },
    }),
    prisma.studyGroup.findMany({
      where: { isPrivate: false, members: { none: { userId } } },
      include: { _count: { select: { members: true } } },
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
    prisma.studyActivity.groupBy({
      by: ["userId"],
      where: { date: { gte: weekAgo } },
      _sum: { xp: true },
      orderBy: { _sum: { xp: "desc" } },
      take: 20,
    }),
    prisma.user.findMany({
      orderBy: { xp: "desc" },
      take: 20,
      select: { id: true, name: true, avatarUrl: true, xp: true, currentLevel: true, streak: true },
    }),
  ]);

  const weeklyUsers = await prisma.user.findMany({
    where: { id: { in: weeklyTop.map((w) => w.userId) } },
    select: { id: true, name: true, avatarUrl: true, currentLevel: true, streak: true },
  });
  const weeklyRows = weeklyTop
    .map((w) => ({ user: weeklyUsers.find((u) => u.id === w.userId), xp: w._sum.xp ?? 0 }))
    .filter((r) => r.user);

  return (
    <div>
      <PageHeader
        title="Community"
        description="Study groups, challenges and leaderboards — learning German together beats learning alone."
      >
        <JoinGroupDialog />
        <CreateGroupDialog />
      </PageHeader>

      <Tabs defaultValue="groups">
        <TabsList>
          <TabsTrigger value="groups">
            <Users className="h-3.5 w-3.5" /> My groups
          </TabsTrigger>
          <TabsTrigger value="discover">Discover</TabsTrigger>
          <TabsTrigger value="leaderboard">
            <Crown className="h-3.5 w-3.5" /> Leaderboard
          </TabsTrigger>
        </TabsList>

        {/* My groups */}
        <TabsContent value="groups">
          {myMemberships.length === 0 ? (
            <div className="rounded-2xl border border-dashed p-12 text-center">
              <div className="text-4xl">🤝</div>
              <h2 className="mt-3 font-bold">No groups yet</h2>
              <p className="mx-auto mt-1 max-w-sm text-sm text-muted-foreground">
                Create a group and share the invite code with friends — or discover a public one.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {myMemberships.map((m) => (
                <Link key={m.group.id} href={`/community/groups/${m.group.id}`} className="group">
                  <div className="card-hover flex h-full items-center gap-4 rounded-2xl border bg-card p-5 shadow-card">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-400 to-brand-600 text-lg font-bold text-white">
                      {m.group.name.slice(0, 1).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="truncate font-semibold">{m.group.name}</h3>
                        {m.group.isPrivate && <Lock className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />}
                        {m.role === "OWNER" && <Badge variant="brand" className="text-[9px]">Owner</Badge>}
                      </div>
                      <div className="mt-0.5 text-sm text-muted-foreground">
                        {m.group._count.members} member{m.group._count.members === 1 ? "" : "s"}
                        {m.group._count.challenges > 0 && ` · ${m.group._count.challenges} challenge${m.group._count.challenges === 1 ? "" : "s"}`}
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Discover */}
        <TabsContent value="discover">
          {publicGroups.length === 0 ? (
            <div className="rounded-2xl border border-dashed p-10 text-center text-sm text-muted-foreground">
              No public groups to discover right now — create the first one!
            </div>
          ) : (
            <div className="overflow-hidden rounded-2xl border">
              <div className="divide-y">
                {publicGroups.map((g) => (
                  <div key={g.id} className="flex items-center gap-4 px-5 py-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-sm font-bold">
                      {g.name.slice(0, 1).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate font-medium">{g.name}</div>
                      {g.description && <div className="truncate text-sm text-muted-foreground">{g.description}</div>}
                    </div>
                    <Badge variant="secondary" className="shrink-0">
                      {g._count.members} 👤
                    </Badge>
                    <JoinPublicButton groupId={g.id} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </TabsContent>

        {/* Leaderboard */}
        <TabsContent value="leaderboard">
          <div className="grid gap-5 lg:grid-cols-2">
            <LeaderboardCard
              title="🔥 This week"
              rows={weeklyRows.map((r) => ({
                id: r.user!.id,
                name: r.user!.name,
                avatarUrl: r.user!.avatarUrl,
                level: r.user!.currentLevel,
                value: `${r.xp.toLocaleString()} XP`,
              }))}
              currentUserId={userId}
            />
            <LeaderboardCard
              title="👑 All time"
              rows={allTimeTop.map((u) => ({
                id: u.id,
                name: u.name,
                avatarUrl: u.avatarUrl,
                level: u.currentLevel,
                value: `${u.xp.toLocaleString()} XP`,
              }))}
              currentUserId={userId}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function LeaderboardCard({
  title,
  rows,
  currentUserId,
}: {
  title: string;
  rows: { id: string; name: string; avatarUrl: string | null; level: string; value: string }[];
  currentUserId: string;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border bg-card shadow-card">
      <div className="border-b bg-secondary/40 px-5 py-3 text-sm font-bold">{title}</div>
      <div className="divide-y">
        {rows.length === 0 && <div className="p-8 text-center text-sm text-muted-foreground">No activity yet this week.</div>}
        {rows.map((row, i) => (
          <div
            key={row.id}
            className={cn("flex items-center gap-3 px-5 py-3", row.id === currentUserId && "bg-brand-50/60 dark:bg-brand-950/30")}
          >
            <span className={cn("w-6 text-center text-sm font-bold", i < 3 ? "text-brand-500" : "text-muted-foreground")}>
              {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : i + 1}
            </span>
            <Avatar className="h-8 w-8">
              {row.avatarUrl ? <AvatarImage src={row.avatarUrl} alt={row.name} /> : null}
              <AvatarFallback className="text-xs">{initials(row.name)}</AvatarFallback>
            </Avatar>
            <span className="min-w-0 flex-1 truncate text-sm font-medium">
              {row.name}
              {row.id === currentUserId && <span className="ml-1.5 text-xs text-muted-foreground">(you)</span>}
            </span>
            <Badge variant="secondary" className="text-[10px]">
              {row.level}
            </Badge>
            <span className="text-sm font-semibold">{row.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
