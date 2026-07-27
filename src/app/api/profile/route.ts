import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const patchSchema = z.object({
  name: z.string().min(2).max(60).optional(),
  bio: z.string().max(300).nullable().optional(),
  nativeLanguage: z.string().max(40).nullable().optional(),
  currentLevel: z.enum(["A1", "A2", "B1", "B2"]).optional(),
  dailyGoalMin: z.number().int().min(5).max(240).optional(),
  examDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable().optional(),
  examTarget: z.string().max(60).nullable().optional(),
  avatarDataUrl: z
    .string()
    .regex(/^data:image\/(jpeg|png|webp);base64,/)
    .max(300_000, "Avatar image too large")
    .nullable()
    .optional(),
});

export async function PATCH(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 400 });
  }

  const d = parsed.data;
  const user = await prisma.user.update({
    where: { id: session.user.id },
    data: {
      name: d.name,
      bio: d.bio,
      nativeLanguage: d.nativeLanguage,
      currentLevel: d.currentLevel,
      dailyGoalMin: d.dailyGoalMin,
      examDate: d.examDate === undefined ? undefined : d.examDate ? new Date(d.examDate) : null,
      examTarget: d.examTarget,
      avatarUrl: d.avatarDataUrl === undefined ? undefined : d.avatarDataUrl,
    },
    select: { name: true, avatarUrl: true, currentLevel: true },
  });

  return NextResponse.json({ ok: true, user });
}

export async function DELETE() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await prisma.user.delete({ where: { id: session.user.id } });
  return NextResponse.json({ ok: true });
}
