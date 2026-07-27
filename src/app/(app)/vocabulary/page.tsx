import Link from "next/link";
import { redirect } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { levelMeta } from "@/lib/levels";
import { iconFor } from "@/lib/icon-map";
import { PageHeader } from "@/components/app/page-header";
import { Badge } from "@/components/ui/badge";

export const metadata = { title: "Vocabulary" };

export default async function VocabularyPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  const userId = session.user.id;

  const [topics, deckWordIds] = await Promise.all([
    prisma.vocabTopic.findMany({
      orderBy: [{ level: { order: "asc" } }, { order: "asc" }],
      include: { words: { select: { id: true } }, level: { select: { order: true } } },
    }),
    prisma.flashcard.findMany({
      where: { userId, wordId: { not: null } },
      select: { wordId: true },
    }),
  ]);

  const deckSet = new Set(deckWordIds.map((f) => f.wordId));
  const byLevel = new Map<string, typeof topics>();
  for (const t of topics) {
    if (!byLevel.has(t.levelCode)) byLevel.set(t.levelCode, []);
    byLevel.get(t.levelCode)!.push(t);
  }

  const totalWords = topics.reduce((a, t) => a + t.words.length, 0);

  return (
    <div>
      <PageHeader
        title="Vocabulary"
        description={`${totalWords.toLocaleString()} words organized by topic — with articles, plurals, IPA, examples and memory tips. Add any word to your flashcard deck.`}
      />

      <div className="space-y-10">
        {[...byLevel.entries()].map(([levelCode, levelTopics]) => {
          const meta = levelMeta(levelCode);
          return (
            <section key={levelCode}>
              <div className="mb-4 flex items-center gap-3">
                <span className={`flex h-9 w-9 items-center justify-center rounded-lg text-sm font-bold text-white ${meta.color}`}>
                  {levelCode}
                </span>
                <h2 className="text-lg font-bold tracking-tight">{meta.title}</h2>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {levelTopics.map((topic) => {
                  const Icon = iconFor(topic.icon);
                  const inDeck = topic.words.filter((w) => deckSet.has(w.id)).length;
                  return (
                    <Link key={topic.slug} href={`/vocabulary/${topic.slug}`} className="group">
                      <div className="card-hover flex h-full items-center gap-4 rounded-2xl border bg-card p-5 shadow-card">
                        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${meta.bg}`}>
                          <Icon className={`h-5 w-5 ${meta.text}`} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="truncate font-semibold">{topic.title}</h3>
                          <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                            <span>{topic.words.length} words</span>
                            {inDeck > 0 && (
                              <Badge variant="secondary" className="text-[10px]">
                                {inDeck} in deck
                              </Badge>
                            )}
                          </div>
                        </div>
                        <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
