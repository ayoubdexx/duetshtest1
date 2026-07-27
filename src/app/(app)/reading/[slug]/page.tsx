import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Printer } from "lucide-react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { levelMeta } from "@/lib/levels";
import type { ExerciseQuestion, GlossaryEntry, GrammarNote } from "@/types/content";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookmarkButton } from "@/components/content/bookmark-button";
import { SpeakButton } from "@/components/content/speak-button";
import { ExercisePlayer, type ExerciseDTO } from "@/components/exercises/exercise-player";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const text = await prisma.readingText.findUnique({ where: { slug }, select: { title: true } });
  return { title: text?.title ?? "Reading" };
}

export default async function ReadingDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  const userId = session.user.id;

  const { slug } = await params;
  const text = await prisma.readingText.findUnique({ where: { slug } });
  if (!text) notFound();

  const bookmark = await prisma.bookmark.findUnique({
    where: { userId_type_refId: { userId, type: "READING", refId: text.id } },
  });

  const meta = levelMeta(text.levelCode);
  const glossary = (text.glossary as GlossaryEntry[] | null) ?? [];
  const grammarNotes = (text.grammarNotes as GrammarNote[] | null) ?? [];
  const questions = text.questions as unknown as ExerciseQuestion[];
  const paragraphs = text.body.split(/\n\s*\n/);

  const questionsDTO: ExerciseDTO = {
    id: "",
    slug: `reading-${text.slug}`,
    title: "Verständnisfragen · Comprehension",
    type: "MCQ",
    skill: "READING",
    instructions: "Answer based on the text above.",
    xpReward: 20,
    questions,
  };

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <div className="mb-2 text-sm text-muted-foreground">
            <Link href="/reading" className="hover:text-foreground">
              Reading
            </Link>{" "}
            {text.topic && <>/ <span className="text-foreground">{text.topic}</span></>}
          </div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{text.title}</h1>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Badge className={`${meta.color} border-transparent text-white`}>{text.levelCode}</Badge>
            <Badge variant="secondary">{text.wordCount} words</Badge>
            <Badge variant="secondary">~{Math.max(1, Math.round(text.wordCount / 120))} min read</Badge>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <BookmarkButton
            type="READING"
            refId={text.id}
            title={text.title}
            href={`/reading/${text.slug}`}
            initialBookmarked={!!bookmark}
          />
          <Link href={`/print/reading/${text.slug}`} target="_blank">
            <Button variant="outline" size="icon" aria-label="Print / PDF">
              <Printer className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>

      {text.intro && (
        <p className="mb-6 rounded-2xl bg-secondary/50 px-5 py-4 text-sm italic leading-relaxed text-muted-foreground">
          {text.intro}
        </p>
      )}

      {/* The text */}
      <article className="rounded-2xl border bg-card p-6 shadow-card sm:p-8">
        <div className="space-y-5">
          {paragraphs.map((para, i) => (
            <div key={i} className="group relative">
              <p className="text-[17px] leading-8 text-foreground/90">{para}</p>
              <span className="absolute -left-10 top-0 hidden opacity-0 transition-opacity group-hover:opacity-100 lg:block">
                <SpeakButton text={para} />
              </span>
            </div>
          ))}
        </div>
      </article>

      {/* Glossary */}
      {glossary.length > 0 && (
        <div className="mt-6 rounded-2xl border bg-card p-5 shadow-card">
          <div className="section-label mb-3">Wortschatz · Glossary</div>
          <div className="grid gap-2 sm:grid-cols-2">
            {glossary.map((g, i) => (
              <div key={i} className="flex items-center gap-2 rounded-xl bg-secondary/50 px-3 py-2 text-sm">
                <SpeakButton text={g.de} />
                <span className="font-medium">{g.de}</span>
                <span className="text-muted-foreground">— {g.en}</span>
                {g.note && <span className="text-xs italic text-brand-700 dark:text-brand-300">({g.note})</span>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Grammar highlights */}
      {grammarNotes.length > 0 && (
        <div className="mt-6 space-y-3">
          <div className="section-label">Grammatik im Text · Grammar highlights</div>
          {grammarNotes.map((n, i) => (
            <div key={i} className="rounded-2xl border border-brand-200 bg-brand-50/50 p-4 dark:border-brand-900 dark:bg-brand-950/30">
              <div className="text-sm font-medium italic">„{n.quote}"</div>
              <div className="mt-1.5 text-sm">
                <span className="font-semibold text-brand-700 dark:text-brand-300">{n.topic}: </span>
                <span className="text-foreground/85">{n.note}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Questions */}
      {questions.length > 0 && (
        <div className="mt-8">
          <ExercisePlayer exercise={questionsDTO} activity={{ kind: "READING", refId: text.id }} />
        </div>
      )}
    </div>
  );
}
