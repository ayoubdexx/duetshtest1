import Link from "next/link";
import { redirect } from "next/navigation";
import { subDays } from "date-fns";
import { Play, Layers, Star, TrendingUp } from "lucide-react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/app/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CustomCardDialog } from "@/components/flashcards/custom-card-dialog";
import { CardsBrowser, type BrowserCard } from "@/components/flashcards/cards-browser";

export const metadata = { title: "Flashcards" };

export default async function FlashcardsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  const userId = session.user.id;

  const [dueCount, totalCount, favCount, cards, recentLogs] = await Promise.all([
    prisma.flashcard.count({ where: { userId, dueAt: { lte: new Date() } } }),
    prisma.flashcard.count({ where: { userId } }),
    prisma.flashcard.count({ where: { userId, isFavorite: true } }),
    prisma.flashcard.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 300,
      select: {
        id: true,
        front: true,
        back: true,
        deck: true,
        isFavorite: true,
        intervalDays: true,
        dueAt: true,
        repetitions: true,
      },
    }),
    prisma.reviewLog.findMany({
      where: { userId, reviewedAt: { gte: subDays(new Date(), 30) } },
      select: { rating: true },
    }),
  ]);

  const retention =
    recentLogs.length > 0 ? Math.round((recentLogs.filter((l) => l.rating >= 2).length / recentLogs.length) * 100) : null;

  const browserCards: BrowserCard[] = cards.map((c) => ({
    id: c.id,
    front: c.front,
    back: c.back,
    deck: c.deck,
    isFavorite: c.isFavorite,
    intervalDays: c.intervalDays,
    dueAt: c.dueAt.toISOString(),
    repetitions: c.repetitions,
  }));

  return (
    <div>
      <PageHeader
        title="Flashcards"
        description="Spaced repetition schedules every card at the moment you're about to forget it. Clear your queue daily."
      >
        <CustomCardDialog />
        <Link href="/flashcards/review">
          <Button size="lg" disabled={dueCount === 0}>
            <Play className="h-4 w-4" /> Review {dueCount > 0 ? `(${dueCount})` : ""}
          </Button>
        </Link>
      </PageHeader>

      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
              <Play className="h-3.5 w-3.5" /> Due now
            </div>
            <div className="mt-2 text-3xl font-bold tracking-tight">{dueCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
              <Layers className="h-3.5 w-3.5" /> Total cards
            </div>
            <div className="mt-2 text-3xl font-bold tracking-tight">{totalCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
              <Star className="h-3.5 w-3.5" /> Favorites
            </div>
            <div className="mt-2 text-3xl font-bold tracking-tight">{favCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
              <TrendingUp className="h-3.5 w-3.5" /> Retention (30d)
            </div>
            <div className="mt-2 text-3xl font-bold tracking-tight">{retention !== null ? `${retention}%` : "—"}</div>
          </CardContent>
        </Card>
      </div>

      {totalCount === 0 ? (
        <div className="rounded-2xl border border-dashed p-12 text-center">
          <div className="text-4xl">🃏</div>
          <h2 className="mt-3 text-lg font-bold">Your deck is empty</h2>
          <p className="mx-auto mt-1 max-w-sm text-sm text-muted-foreground">
            Add words from the vocabulary section — every word comes with article, plural, IPA and examples.
          </p>
          <Link href="/vocabulary" className="mt-5 inline-block">
            <Button>Browse vocabulary</Button>
          </Link>
        </div>
      ) : (
        <CardsBrowser initialCards={browserCards} />
      )}
    </div>
  );
}
