import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const schema = z
  .object({
    code: z.string().min(4).max(12).optional(),
    groupId: z.string().optional(),
  })
  .refine((d) => d.code || d.groupId, { message: "code or groupId required" });

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = session.user.id;

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  const group = parsed.data.code
    ? await prisma.studyGroup.findUnique({ where: { code: parsed.data.code.toUpperCase() } })
    : await prisma.studyGroup.findUnique({ where: { id: parsed.data.groupId! } });

  if (!group) return NextResponse.json({ error: "Group not found — check the code." }, { status: 404 });
  if (group.isPrivate && !parsed.data.code) {
    return NextResponse.json({ error: "This group is private — you need the invite code." }, { status: 403 });
  }

  await prisma.groupMember.upsert({
    where: { groupId_userId: { groupId: group.id, userId } },
    create: { groupId: group.id, userId },
    update: {},
  });

  return NextResponse.json({ ok: true, groupId: group.id });
}
