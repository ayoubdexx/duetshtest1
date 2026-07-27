import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function requireMembership(groupId: string, userId: string) {
  return prisma.groupMember.findUnique({
    where: { groupId_userId: { groupId, userId } },
  });
}

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;

  const member = await requireMembership(id, session.user.id);
  if (!member) return NextResponse.json({ error: "Not a member" }, { status: 403 });

  const messages = await prisma.groupMessage.findMany({
    where: { groupId: id },
    orderBy: { createdAt: "desc" },
    take: 60,
    include: { user: { select: { id: true, name: true, avatarUrl: true } } },
  });

  return NextResponse.json({
    messages: messages.reverse().map((m) => ({
      id: m.id,
      content: m.content,
      createdAt: m.createdAt.toISOString(),
      user: m.user,
    })),
  });
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;

  const member = await requireMembership(id, session.user.id);
  if (!member) return NextResponse.json({ error: "Not a member" }, { status: 403 });

  const body = await req.json().catch(() => null);
  const parsed = z.object({ content: z.string().min(1).max(1000) }).safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  const message = await prisma.groupMessage.create({
    data: { groupId: id, userId: session.user.id, content: parsed.data.content.trim() },
    include: { user: { select: { id: true, name: true, avatarUrl: true } } },
  });

  return NextResponse.json({
    message: { id: message.id, content: message.content, createdAt: message.createdAt.toISOString(), user: message.user },
  });
}
