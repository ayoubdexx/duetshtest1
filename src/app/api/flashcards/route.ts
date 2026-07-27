import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const createSchema = z.object({
  wordIds: z.array(z.string()).max(500).optional(),
  custom: z
    .object({
      front: z.string().min(1).max(300),
      back: z.string().min(1).max(500),
      notes: z.string().max(500).optional(),
      deck: z.string().max(60).optional(),
    })
    .optional(),
});

const updateSchema = z.object({
  id: z.string().min(1),
  isFavorite: z.boolean().optional(),
  notes: z.string().max(500).optional(),
  deck: z.string().max(60).optional(),
});

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const url = new URL(req.url);
  const filter = url.searchParams.get("filter"); // all | due | favorites
  const userId = session.user.id;

  const where =
    filter === "due"
      ? { userId, dueAt: { lte: new Date() } }
      : filter === "favorites"
        ? { userId, isFavorite: true }
        : { userId };

  const cards = await prisma.flashcard.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: 500,
    include: { word: { include: { topic: { select: { title: true } } } } },
  });

  return NextResponse.json({ cards });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = session.user.id;

  const body = await req.json().catch(() => null);
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  let created = 0;

  if (parsed.data.custom) {
    const { front, back, notes, deck } = parsed.data.custom;
    await prisma.flashcard.create({ data: { userId, front, back, notes, deck: deck ?? "Eigene Karten" } });
    created += 1;
  }

  if (parsed.data.wordIds && parsed.data.wordIds.length > 0) {
    const words = await prisma.vocabWord.findMany({
      where: { id: { in: parsed.data.wordIds } },
      include: { topic: { select: { title: true } } },
    });
    const existing = await prisma.flashcard.findMany({
      where: { userId, wordId: { in: words.map((w) => w.id) } },
      select: { wordId: true },
    });
    const existingSet = new Set(existing.map((e) => e.wordId));
    const toCreate = words.filter((w) => !existingSet.has(w.id));

    if (toCreate.length > 0) {
      await prisma.flashcard.createMany({
        data: toCreate.map((w) => ({
          userId,
          wordId: w.id,
          front: w.article ? `${w.article} ${w.german}` : w.german,
          back: w.meaning,
          deck: w.topic.title,
        })),
      });
      created += toCreate.length;
    }
  }

  return NextResponse.json({ ok: true, created });
}

export async function PATCH(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  const card = await prisma.flashcard.findUnique({ where: { id: parsed.data.id } });
  if (!card || card.userId !== session.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const updated = await prisma.flashcard.update({
    where: { id: card.id },
    data: {
      isFavorite: parsed.data.isFavorite,
      notes: parsed.data.notes,
      deck: parsed.data.deck,
    },
  });

  return NextResponse.json({ ok: true, card: updated });
}

export async function DELETE(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const card = await prisma.flashcard.findUnique({ where: { id } });
  if (!card || card.userId !== session.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.flashcard.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
