import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { recordActivity, updateSkillScore } from "@/lib/activity";

const schema = z.object({
  exerciseId: z.string().min(1),
  correct: z.number().int().min(0),
  total: z.number().int().min(1),
  answers: z.unknown().optional(),
});

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = session.user.id;

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  const { exerciseId, total } = parsed.data;
  const correct = Math.min(parsed.data.correct, total);

  const exercise = await prisma.exercise.findUnique({ where: { id: exerciseId } });
  if (!exercise) return NextResponse.json({ error: "Exercise not found" }, { status: 404 });

  const pct = correct / total;
  const xpEarned = Math.round(exercise.xpReward * pct);

  await prisma.exerciseAttempt.create({
    data: {
      userId,
      exerciseId,
      correct,
      total,
      answers: parsed.data.answers === undefined ? undefined : (parsed.data.answers as object),
    },
  });

  await recordActivity(userId, {
    xp: xpEarned,
    exercises: 1,
    minutes: Math.max(1, Math.round(total * 0.5)),
  });
  await updateSkillScore(userId, exercise.skill, pct * 100);

  return NextResponse.json({ ok: true, xpEarned });
}
