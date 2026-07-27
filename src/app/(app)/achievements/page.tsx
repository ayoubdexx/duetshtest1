import Link from "next/link";
import { redirect } from "next/navigation";
import { Award, Printer } from "lucide-react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ACHIEVEMENT_DEFS, type AchievementMetric } from "@/lib/achievement-defs";
import { levelMeta } from "@/lib/levels";
import { PageHeader } from "@/components/app/page-header";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

export const metadata = { title: "Achievements" };

export default async function AchievementsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  const userId = session.user.id;

  const [user, lessons, reviews, deck, exercises, examsPassed, writings, groups, notes, certificates, unlockedRows, dbAchievements] =
    await Promise.all([
      prisma.user.findUnique({ where: { id: userId }, select: { xp: true, streak: true, longestStreak: true } }),
      prisma.lessonProgress.count({ where: { userId, status: "COMPLETED" } }),
      prisma.reviewLog.count({ where: { userId } }),
      prisma.flashcard.count({ where: { userId } }),
      prisma.exerciseAttempt.count({ where: { userId } }),
      prisma.examAttempt.count({ where: { userId, passed: true } }),
      prisma.writingSubmission.count({ where: { userId } }),
      prisma.groupMember.count({ where: { userId } }),
      prisma.note.count({ where: { userId } }),
      prisma.certificate.findMany({ where: { userId }, orderBy: { issuedAt: "desc" } }),
      prisma.userAchievement.findMany({ where: { userId } }),
      prisma.achievement.findMany(),
    ]);

  const metrics: Record<AchievementMetric, number> = {
    lessons,
    streak: Math.max(user?.streak ?? 0, user?.longestStreak ?? 0),
    xp: user?.xp ?? 0,
    reviews,
    deck,
    exercises,
    examsPassed,
    writings,
    groups,
    notes,
    certificates: certificates.length,
  };

  // Award any newly-qualified achievements (idempotent)
  const byCode = new Map(dbAchievements.map((a) => [a.code, a]));
  const unlockedIds = new Set(unlockedRows.map((u) => u.achievementId));
  const toAward = ACHIEVEMENT_DEFS.filter((def) => {
    const row = byCode.get(def.code);
    return row && !unlockedIds.has(row.id) && metrics[def.metric] >= def.threshold;
  });
  if (toAward.length > 0) {
    await prisma.userAchievement.createMany({
      data: toAward.map((def) => ({ userId, achievementId: byCode.get(def.code)!.id })),
      skipDuplicates: true,
    });
    for (const def of toAward) unlockedIds.add(byCode.get(def.code)!.id);
  }

  const unlockedCount = ACHIEVEMENT_DEFS.filter((def) => {
    const row = byCode.get(def.code);
    return row && unlockedIds.has(row.id);
  }).length;

  return (
    <div>
      <PageHeader
        title="Achievements"
        description={`${unlockedCount} of ${ACHIEVEMENT_DEFS.length} unlocked — every badge is earned, never given.`}
      />

      {/* Certificates */}
      {certificates.length > 0 && (
        <div className="mb-10">
          <div className="section-label mb-3">Zertifikate · Your certificates</div>
          <div className="grid gap-4 sm:grid-cols-2">
            {certificates.map((cert) => {
              const meta = levelMeta(cert.levelCode);
              return (
                <div key={cert.id} className="relative overflow-hidden rounded-2xl border-2 border-brand-300 bg-card p-5 shadow-card dark:border-brand-800">
                  <div className={`absolute inset-x-0 top-0 h-1.5 ${meta.color}`} />
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-100 dark:bg-brand-900/50">
                      <Award className="h-6 w-6 text-brand-600 dark:text-brand-400" />
                    </div>
                    <div className="flex-1">
                      <div className="font-bold">Deutschwerk Certificate — {cert.levelCode}</div>
                      <div className="mt-0.5 text-sm text-muted-foreground">
                        Score {Math.round(cert.score)}% · {cert.issuedAt.toLocaleDateString("en", { dateStyle: "long" })}
                      </div>
                      <div className="mt-1 font-mono text-xs text-muted-foreground">{cert.serial}</div>
                    </div>
                    <Link
                      href={`/print/certificate/${cert.serial}`}
                      target="_blank"
                      className="rounded-lg border p-2 text-muted-foreground hover:bg-accent"
                      aria-label="Print certificate"
                    >
                      <Printer className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Achievement grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {ACHIEVEMENT_DEFS.map((def) => {
          const row = byCode.get(def.code);
          const unlocked = row ? unlockedIds.has(row.id) : false;
          const current = metrics[def.metric];
          const pct = Math.min(100, Math.round((current / def.threshold) * 100));
          return (
            <div
              key={def.code}
              className={cn(
                "rounded-2xl border bg-card p-5 shadow-card transition-all",
                unlocked ? "border-brand-300 dark:border-brand-800" : "opacity-80"
              )}
            >
              <div className="flex items-start justify-between">
                <span className={cn("text-3xl", !unlocked && "grayscale opacity-50")}>{def.icon}</span>
                {unlocked ? (
                  <Badge variant="brand" className="text-[10px]">
                    +{def.xp} XP
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="text-[10px]">
                    Tier {def.tier}
                  </Badge>
                )}
              </div>
              <div className="mt-2.5 font-bold">{def.title}</div>
              <div className="text-sm text-muted-foreground">{def.description}</div>
              {!unlocked && (
                <div className="mt-3">
                  <Progress value={pct} className="h-1.5" />
                  <div className="mt-1 text-xs text-muted-foreground">
                    {Math.min(current, def.threshold).toLocaleString()} / {def.threshold.toLocaleString()}
                  </div>
                </div>
              )}
              {unlocked && <div className="mt-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400">Unlocked ✓</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
