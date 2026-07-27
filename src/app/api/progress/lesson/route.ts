import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { recordActivity } from "@/lib/activity";

const schema = z.object({
  lessonId: z.string().min(1),
  action: z.enum(["progress", "complete"]),
  blockIndex: z.number().int().min(0).optional(),
  score: z.number().min(0).max(100).optional(),
});

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = session.user.id;

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  const { lessonId, action, blockIndex, score } = parsed.data;

  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    select: { id: true, xpReward: true, durationMin: true },
  });
  if (!lesson) return NextResponse.json({ error: "Lesson not found" }, { status: 404 });

  const existing = await prisma.lessonProgress.findUnique({
    where: { userId_lessonId: { userId, lessonId } },
  });

  if (action === "progress") {
    if (existing?.status === "COMPLETED") {
      return NextResponse.json({ ok: true, status: "COMPLETED" });
    }
    const nextIndex = Math.max(existing?.blockIndex ?? 0, blockIndex ?? 0);
    await prisma.lessonProgress.upsert({
      where: { userId_lessonId: { userId, lessonId } },
      create: { userId, lessonId, status: "IN_PROGRESS", blockIndex: nextIndex },
      update: { blockIndex: nextIndex },
    });
    return NextResponse.json({ ok: true, status: "IN_PROGRESS" });
  }

  // action === "complete"
  const alreadyCompleted = existing?.status === "COMPLETED";
  await prisma.lessonProgress.upsert({
    where: { userId_lessonId: { userId, lessonId } },
    create: { userId, lessonId, status: "COMPLETED", completedAt: new Date(), score },
    update: { status: "COMPLETED", completedAt: existing?.completedAt ?? new Date(), score: score ?? existing?.score },
  });

  let xpEarned = 0;
  if (!alreadyCompleted) {
    xpEarned = lesson.xpReward;
    await recordActivity(userId, { xp: xpEarned, lessons: 1, minutes: lesson.durationMin });
  }

  return NextResponse.json({ ok: true, status: "COMPLETED", xpEarned });
}
