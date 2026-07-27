import { NextResponse } from "next/server";
import crypto from "crypto";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const createSchema = z.object({
  name: z.string().min(2).max(60),
  description: z.string().max(300).optional(),
  isPrivate: z.boolean().default(false),
});

function generateCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return Array.from(crypto.randomBytes(6))
    .map((b) => chars[b % chars.length])
    .join("");
}

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const memberships = await prisma.groupMember.findMany({
    where: { userId: session.user.id },
    include: { group: { include: { _count: { select: { members: true } } } } },
  });
  return NextResponse.json({ groups: memberships.map((m) => m.group) });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  let code = generateCode();
  while (await prisma.studyGroup.findUnique({ where: { code } })) code = generateCode();

  const group = await prisma.studyGroup.create({
    data: {
      name: parsed.data.name,
      description: parsed.data.description,
      isPrivate: parsed.data.isPrivate,
      code,
      ownerId: session.user.id,
      members: { create: { userId: session.user.id, role: "OWNER" } },
    },
  });

  return NextResponse.json({ group });
}
