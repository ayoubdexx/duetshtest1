import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Printer } from "lucide-react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { levelMeta } from "@/lib/levels";
import { iconFor } from "@/lib/icon-map";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookmarkButton } from "@/components/content/bookmark-button";
import { WordRow, AddAllToFlashcards, type WordDTO } from "@/components/vocab/word-card";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const topic = await prisma.vocabTopic.findUnique({ where: { slug }, select: { title: true } });
  return { title: topic ? `${topic.title} · Vocabulary` : "Vocabulary" };
}

export default async function VocabTopicPage({ params }: { params: Promise<{ slug: string }> }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  const userId = session.user.id;

  const { slug } = await params;
  const topic = await prisma.vocabTopic.findUnique({
    where: { slug },
    include: { words: { orderBy: { german: "asc" } } },
  });
  if (!topic) notFound();

  const [deckCards, bookmark] = await Promise.all([
    prisma.flashcard.findMany({
      where: { userId, wordId: { in: topic.words.map((w) => w.id) } },
      select: { wordId: true },
    }),
    prisma.bookmark.findUnique({
      where: { userId_type_refId: { userId, type: "VOCAB_TOPIC", refId: topic.id } },
    }),
  ]);

  const deckSet = new Set(deckCards.map((c) => c.wordId));
  const meta = levelMeta(topic.levelCode);
  const Icon = iconFor(topic.icon);

  const words: WordDTO[] = topic.words.map((w) => ({
    id: w.id,
    german: w.german,
    article: w.article,
    plural: w.plural,
    pos: w.pos,
    ipa: w.ipa,
    meaning: w.meaning,
    exampleDe: w.exampleDe,
    exampleEn: w.exampleEn,
    synonyms: (w.synonyms as string[] | null) ?? null,
    opposites: (w.opposites as string[] | null) ?? null,
    expressions: (w.expressions as { de: string; en: string }[] | null) ?? null,
    memoryTip: w.memoryTip,
    difficulty: w.difficulty,
  }));

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-2 text-sm text-muted-foreground">
        <Link href="/vocabulary" className="hover:text-foreground">
          Vocabulary
        </Link>{" "}
        / <span className="text-foreground">{topic.title}</span>
      </div>

      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-4">
          <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${meta.bg}`}>
            <Icon className={`h-6 w-6 ${meta.text}`} />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{topic.title}</h1>
            {topic.description && <p className="mt-1 text-muted-foreground">{topic.description}</p>}
            <div className="mt-2.5 flex flex-wrap items-center gap-2">
              <Badge className={`${meta.color} border-transparent text-white`}>{topic.levelCode}</Badge>
              <Badge variant="secondary">{words.length} words</Badge>
              <Badge variant="secondary">{deckSet.size} in your deck</Badge>
            </div>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <BookmarkButton
            type="VOCAB_TOPIC"
            refId={topic.id}
            title={topic.title}
            href={`/vocabulary/${topic.slug}`}
            initialBookmarked={!!bookmark}
          />
          <Link href={`/print/vocab/${topic.slug}`} target="_blank">
            <Button variant="outline" size="icon" aria-label="Print / PDF">
              <Printer className="h-4 w-4" />
            </Button>
          </Link>
          <AddAllToFlashcards wordIds={words.map((w) => w.id)} />
        </div>
      </div>

      <div className="mb-4 flex items-center gap-4 rounded-xl bg-secondary/50 px-4 py-2.5 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-sky-500" /> der
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-rose-500" /> die
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-emerald-500" /> das
        </span>
        <span className="ml-auto hidden sm:block">Tap a word for examples, synonyms & memory tips</span>
      </div>

      <div className="space-y-2.5">
        {words.map((word) => (
          <WordRow key={word.id} word={word} initialInDeck={deckSet.has(word.id)} />
        ))}
      </div>
    </div>
  );
}
