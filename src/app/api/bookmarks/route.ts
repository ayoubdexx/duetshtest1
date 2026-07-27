import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { BookmarkType } from "@prisma/client";

const toggleSchema = z.object({
  type: z.enum([
    "LESSON",
    "GRAMMAR",
    "VOCAB_TOPIC",
    "WORD",
    "READING",
    "LISTENING",
    "SPEAKING",
    "WRITING",
    "EXERCISE",
    "EXAM",
    "VERB",
  ]),
  refId: z.string().min(1),
  title: z.string().min(1).max(200),
  href: z.string().min(1).max(300).startsWith("/"),
});

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const bookmarks = await prisma.bookmark.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ bookmarks });
}

/** Toggle a bookmark */
export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = toggleSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  const { type, refId, title, href } = parsed.data;
  const userId = session.user.id;

  const existing = await prisma.bookmark.findUnique({
    where: { userId_type_refId: { userId, type: type as BookmarkType, refId } },
  });

  if (existing) {
    await prisma.bookmark.delete({ where: { id: existing.id } });
    return NextResponse.json({ bookmarked: false });
  }

  await prisma.bookmark.create({ data: { userId, type: type as BookmarkType, refId, title, href } });
  return NextResponse.json({ bookmarked: true });
}
