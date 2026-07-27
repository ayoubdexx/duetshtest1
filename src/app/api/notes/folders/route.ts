import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = z.object({ name: z.string().min(1).max(60) }).safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  const folder = await prisma.noteFolder.create({
    data: { userId: session.user.id, name: parsed.data.name },
  });
  return NextResponse.json({ folder });
}

export async function DELETE(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const folder = await prisma.noteFolder.findUnique({ where: { id } });
  if (!folder || folder.userId !== session.user.id) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await prisma.noteFolder.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
