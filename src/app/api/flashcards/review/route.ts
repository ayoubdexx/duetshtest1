import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { scheduleCard, type SrsRating } from "@/lib/srs";
import { recordActivity } from "@/lib/activity";

const ratingSchema = z.object({
  cardId: z.string().min(1),
  rating: z.number().int().min(0).max(3),
});

/** GET — the due review queue */
export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const url = new URL(req.url);
  const limit = Math.min(100, Number(url.searchParams.get("limit") ?? 30));
  const deck = url.searchParams.get("deck");

  const cards = await prisma.flashcard.findMany({
    where: {
      userId: session.user.id,
      dueAt: { lte: new Date() },
      ...(deck ? { deck } : {}),
    },
    orderBy: { dueAt: "asc" },
    take: limit,
    include: { word: true },
  });

  return NextResponse.json({
    cards: cards.map((c) => ({
      id: c.id,
      front: c.front,
      back: c.back,
      notes: c.notes,
      deck: c.deck,
      isFavorite: c.isFavorite,
      easeFactor: c.easeFactor,
      intervalDays: c.intervalDays,
      repetitions: c.repetitions,
      lapses: c.lapses,
      word: c.word
        ? {
            german: c.word.german,
            article: c.word.article,
            plural: c.word.plural,
            ipa: c.word.ipa,
            meaning: c.word.meaning,
            exampleDe: c.word.exampleDe,
            exampleEn: c.word.exampleEn,
            memoryTip: c.word.memoryTip,
          }
        : null,
    })),
  });
}

/** POST — rate a card */
export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = session.user.id;

  const body = await req.json().catch(() => null);
  const parsed = ratingSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  const card = await prisma.flashcard.findUnique({ where: { id: parsed.data.cardId } });
  if (!card || card.userId !== userId) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const rating = parsed.data.rating as SrsRating;
  const next = scheduleCard(
    {
      easeFactor: card.easeFactor,
      intervalDays: card.intervalDays,
      repetitions: card.repetitions,
      lapses: card.lapses,
    },
    rating
  );

  await prisma.$transaction([
    prisma.flashcard.update({
      where: { id: card.id },
      data: {
        easeFactor: next.easeFactor,
        intervalDays: next.intervalDays,
        repetitions: next.repetitions,
        lapses: next.lapses,
        dueAt: next.dueAt,
        lastReviewedAt: new Date(),
      },
    }),
    prisma.reviewLog.create({
      data: { userId, cardId: card.id, rating, intervalDays: next.intervalDays },
    }),
  ]);

  await recordActivity(userId, { cards: 1, xp: rating >= 2 ? 2 : 1, minutes: 0 });

  return NextResponse.json({ ok: true, dueAt: next.dueAt, intervalDays: next.intervalDays });
}
