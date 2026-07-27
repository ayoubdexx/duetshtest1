import { prisma } from "@/lib/prisma";
import type { SkillArea } from "@prisma/client";
import { startOfDay, subDays, isSameDay } from "date-fns";

export interface ActivityDelta {
  minutes?: number;
  xp?: number;
  lessons?: number;
  cards?: number;
  exercises?: number;
}

/**
 * Records study activity for today, increments XP and maintains the streak.
 * Called from every progress-producing API route.
 */
export async function recordActivity(userId: string, delta: ActivityDelta) {
  const now = new Date();
  const today = startOfDay(now);

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { streak: true, longestStreak: true, lastActiveAt: true },
  });
  if (!user) return;

  let streak = user.streak;
  if (!user.lastActiveAt) {
    streak = 1;
  } else if (isSameDay(user.lastActiveAt, now)) {
    streak = Math.max(1, streak);
  } else if (isSameDay(user.lastActiveAt, subDays(now, 1))) {
    streak += 1;
  } else {
    streak = 1;
  }
  const longestStreak = Math.max(user.longestStreak, streak);

  await prisma.$transaction([
    prisma.studyActivity.upsert({
      where: { userId_date: { userId, date: today } },
      create: {
        userId,
        date: today,
        minutes: delta.minutes ?? 0,
        xp: delta.xp ?? 0,
        lessons: delta.lessons ?? 0,
        cards: delta.cards ?? 0,
        exercises: delta.exercises ?? 0,
      },
      update: {
        minutes: { increment: delta.minutes ?? 0 },
        xp: { increment: delta.xp ?? 0 },
        lessons: { increment: delta.lessons ?? 0 },
        cards: { increment: delta.cards ?? 0 },
        exercises: { increment: delta.exercises ?? 0 },
      },
    }),
    prisma.user.update({
      where: { id: userId },
      data: {
        xp: { increment: delta.xp ?? 0 },
        streak,
        longestStreak,
        lastActiveAt: now,
      },
    }),
  ]);
}

/** Update the running average score (0–100) for a skill area */
export async function updateSkillScore(userId: string, skill: SkillArea, pct: number) {
  const existing = await prisma.skillScore.findUnique({
    where: { userId_skill: { userId, skill } },
  });
  if (!existing) {
    await prisma.skillScore.create({ data: { userId, skill, score: pct, samples: 1 } });
    return;
  }
  const score = (existing.score * existing.samples + pct) / (existing.samples + 1);
  await prisma.skillScore.update({
    where: { userId_skill: { userId, skill } },
    data: { score: Math.round(score * 10) / 10, samples: existing.samples + 1 },
  });
}
