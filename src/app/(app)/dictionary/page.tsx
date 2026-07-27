import Link from "next/link";
import { redirect } from "next/navigation";
import { Search, Repeat, ChevronRight } from "lucide-react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/app/page-header";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { WordRow, type WordDTO } from "@/components/vocab/word-card";

export const metadata = { title: "Dictionary" };

const POPULAR = ["Haus", "gehen", "schön", "Arbeit", "Zeit", "lernen", "Freund", "essen"];

export default async function DictionaryPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  const userId = session.user.id;

  const { q } = await searchParams;
  const query = (q ?? "").trim().slice(0, 60);

  let words: WordDTO[] = [];
  let verbs: { infinitive: string; english: string; levelCode: string }[] = [];
  let deckSet = new Set<string | null>();

  if (query.length >= 2) {
    const contains = { contains: query, mode: "insensitive" as const };
    const [wordRows, verbRows] = await Promise.all([
      prisma.vocabWord.findMany({
        where: { OR: [{ german: contains }, { meaning: contains }, { plural: contains }] },
        orderBy: { german: "asc" },
        take: 30,
      }),
      prisma.verb.findMany({
        where: { OR: [{ infinitive: contains }, { english: contains }] },
        take: 8,
        select: { infinitive: true, english: true, levelCode: true },
      }),
    ]);

    const deckCards = await prisma.flashcard.findMany({
      where: { userId, wordId: { in: wordRows.map((w) => w.id) } },
      select: { wordId: true },
    });
    deckSet = new Set(deckCards.map((c) => c.wordId));

    words = wordRows.map((w) => ({
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
    verbs = verbRows;
  }

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        title="Dictionary"
        description="Search the complete Deutschwerk word base — German or English, with articles, plurals, examples and expressions."
      />

      <form action="/dictionary" method="GET" className="mb-6 flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            name="q"
            defaultValue={query}
            placeholder="Search German or English… e.g. Wohnung, to work, schön"
            className="h-12 pl-10 text-base"
            autoFocus
          />
        </div>
        <Button type="submit" size="lg" className="h-12">
          Search
        </Button>
      </form>

      {query.length < 2 ? (
        <div className="rounded-2xl border border-dashed p-10 text-center">
          <div className="text-4xl">📖</div>
          <h2 className="mt-3 font-bold">Look anything up</h2>
          <p className="mx-auto mt-1 max-w-sm text-sm text-muted-foreground">
            Try one of these to get started:
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {POPULAR.map((p) => (
              <Link key={p} href={`/dictionary?q=${encodeURIComponent(p)}`}>
                <Badge variant="secondary" className="cursor-pointer px-3 py-1.5">
                  {p}
                </Badge>
              </Link>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {verbs.length > 0 && (
            <div>
              <div className="section-label mb-2.5">Verbs — full conjugation available</div>
              <div className="grid gap-2 sm:grid-cols-2">
                {verbs.map((v) => (
                  <Link key={v.infinitive} href={`/verbs/${encodeURIComponent(v.infinitive)}`} className="group">
                    <div className="card-hover flex items-center gap-3 rounded-xl border bg-card px-4 py-3">
                      <Repeat className="h-4 w-4 text-brand-500" />
                      <div className="min-w-0 flex-1">
                        <span className="font-semibold">{v.infinitive}</span>
                        <span className="ml-2 text-sm text-muted-foreground">{v.english}</span>
                      </div>
                      <Badge variant="secondary" className="text-[10px]">
                        {v.levelCode}
                      </Badge>
                      <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {words.length > 0 ? (
            <div>
              <div className="section-label mb-2.5">
                {words.length} result{words.length === 1 ? "" : "s"} for „{query}"
              </div>
              <div className="space-y-2.5">
                {words.map((word) => (
                  <WordRow key={word.id} word={word} initialInDeck={deckSet.has(word.id)} />
                ))}
              </div>
            </div>
          ) : (
            verbs.length === 0 && (
              <div className="rounded-2xl border p-10 text-center text-muted-foreground">
                No results for „{query}". Try a different spelling — or search in English.
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}
