import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/** POST — leave the group. DELETE — delete the group (owner only). */
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;

  const membership = await prisma.groupMember.findUnique({
    where: { groupId_userId: { groupId: id, userId: session.user.id } },
  });
  if (!membership) return NextResponse.json({ error: "Not a member" }, { status: 404 });
  if (membership.role === "OWNER") {
    return NextResponse.json({ error: "Owners can't leave — delete the group instead." }, { status: 400 });
  }

  await prisma.groupMember.delete({ where: { id: membership.id } });
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;

  const group = await prisma.studyGroup.findUnique({ where: { id } });
  if (!group) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (group.ownerId !== session.user.id && session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Only the owner can delete the group" }, { status: 403 });
  }

  await prisma.studyGroup.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
