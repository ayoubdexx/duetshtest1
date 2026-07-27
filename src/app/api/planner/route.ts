import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const createSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  title: z.string().min(1).max(160),
  type: z.enum(["LESSON", "REVIEW", "EXERCISE", "EXAM", "CUSTOM"]).default("CUSTOM"),
  href: z.string().max(300).optional(),
  notes: z.string().max(500).optional(),
});

const updateSchema = z.object({
  id: z.string().min(1),
  done: z.boolean().optional(),
  title: z.string().min(1).max(160).optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
});

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const url = new URL(req.url);
  const from = url.searchParams.get("from");
  const to = url.searchParams.get("to");
  if (!from || !to) return NextResponse.json({ error: "Missing range" }, { status: 400 });

  const items = await prisma.plannerItem.findMany({
    where: {
      userId: session.user.id,
      date: { gte: new Date(from), lte: new Date(to) },
    },
    orderBy: { date: "asc" },
  });
  return NextResponse.json({ items });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  const item = await prisma.plannerItem.create({
    data: {
      userId: session.user.id,
      date: new Date(parsed.data.date),
      title: parsed.data.title,
      type: parsed.data.type,
      href: parsed.data.href,
      notes: parsed.data.notes,
    },
  });
  return NextResponse.json({ item });
}

export async function PATCH(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  const item = await prisma.plannerItem.findUnique({ where: { id: parsed.data.id } });
  if (!item || item.userId !== session.user.id) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const updated = await prisma.plannerItem.update({
    where: { id: item.id },
    data: {
      done: parsed.data.done,
      title: parsed.data.title,
      date: parsed.data.date ? new Date(parsed.data.date) : undefined,
    },
  });
  return NextResponse.json({ item: updated });
}

export async function DELETE(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const item = await prisma.plannerItem.findUnique({ where: { id } });
  if (!item || item.userId !== session.user.id) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await prisma.plannerItem.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
