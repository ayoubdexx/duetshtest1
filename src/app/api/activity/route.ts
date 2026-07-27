import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { recordActivity, updateSkillScore } from "@/lib/activity";
import type { SkillArea } from "@prisma/client";

const schema = z.object({
  kind: z.enum(["READING", "LISTENING", "SPEAKING", "PRONUNCIATION", "GRAMMAR", "VOCABULARY", "WRITING", "EXAM"]),
  refId: z.string().min(1),
  correct: z.number().int().min(0).optional(),
  total: z.number().int().min(1).optional(),
  minutes: z.number().int().min(0).max(180).optional(),
});

/** Generic activity recording for content that isn't a stored Exercise (reading/listening questions, speaking sessions, …) */
export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = session.user.id;

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  const { kind, correct, total, minutes } = parsed.data;

  let xpEarned = 10;
  if (correct !== undefined && total !== undefined && total > 0) {
    const pct = Math.min(1, correct / total);
    xpEarned = Math.round(20 * pct);
    await updateSkillScore(userId, kind as SkillArea, pct * 100);
  }

  await recordActivity(userId, {
    xp: xpEarned,
    exercises: 1,
    minutes: minutes ?? 5,
  });

  return NextResponse.json({ ok: true, xpEarned });
}
