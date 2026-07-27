import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ChevronLeft, ChevronRight, Printer, Zap } from "lucide-react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { levelMeta } from "@/lib/levels";
import type { LessonBlock, CheatSheet } from "@/types/content";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BlockRenderer } from "@/components/content/block-renderer";
import { BookmarkButton } from "@/components/content/bookmark-button";
import { ExercisePlayer, type ExerciseDTO } from "@/components/exercises/exercise-player";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const topic = await prisma.grammarTopic.findUnique({ where: { slug }, select: { title: true } });
  return { title: topic?.title ?? "Grammar" };
}

export default async function GrammarTopicPage({ params }: { params: Promise<{ slug: string }> }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  const userId = session.user.id;

  const { slug } = await params;
  const topic = await prisma.grammarTopic.findUnique({ where: { slug } });
  if (!topic) notFound();

  const [exercises, bookmark, siblings] = await Promise.all([
    prisma.exercise.findMany({ where: { grammarTopicId: topic.id } }),
    prisma.bookmark.findUnique({
      where: { userId_type_refId: { userId, type: "GRAMMAR", refId: topic.id } },
    }),
    prisma.grammarTopic.findMany({
      where: { levelCode: topic.levelCode },
      orderBy: { order: "asc" },
      select: { slug: true, title: true },
    }),
  ]);

  const meta = levelMeta(topic.levelCode);
  const blocks = topic.blocks as unknown as LessonBlock[];
  const cheatSheet = topic.cheatSheet as CheatSheet | null;
  const idx = siblings.findIndex((s) => s.slug === topic.slug);
  const prev = idx > 0 ? siblings[idx - 1] : null;
  const next = idx >= 0 && idx < siblings.length - 1 ? siblings[idx + 1] : null;

  const exerciseDTOs: ExerciseDTO[] = exercises.map((ex) => ({
    id: ex.id,
    slug: ex.slug,
    title: ex.title,
    type: ex.type,
    skill: ex.skill,
    instructions: ex.instructions,
    xpReward: ex.xpReward,
    questions: ex.questions,
  }));

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <div className="mb-2 text-sm text-muted-foreground">
            <Link href="/grammar" className="hover:text-foreground">
              Grammar
            </Link>{" "}
            / <span className="text-foreground">{topic.category}</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{topic.title}</h1>
          <p className="mt-2 text-muted-foreground">{topic.summary}</p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Badge className={`${meta.color} border-transparent text-white`}>{topic.levelCode}</Badge>
            <Badge variant="secondary">{topic.category}</Badge>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <BookmarkButton
            type="GRAMMAR"
            refId={topic.id}
            title={topic.title}
            href={`/grammar/${topic.slug}`}
            initialBookmarked={!!bookmark}
          />
          <Link href={`/print/grammar/${topic.slug}`} target="_blank">
            <Button variant="outline" size="icon" aria-label="Print / PDF">
              <Printer className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>

      <BlockRenderer blocks={blocks} />

      {/* Cheat sheet */}
      {cheatSheet && (
        <div className="mt-10 overflow-hidden rounded-2xl border-2 border-brand-300 dark:border-brand-800">
          <div className="flex items-center gap-2 bg-brand-100/70 px-5 py-3 dark:bg-brand-950/60">
            <Zap className="h-4 w-4 text-brand-600 dark:text-brand-400" />
            <span className="text-sm font-bold">{cheatSheet.title}</span>
            <Badge variant="brand" className="ml-auto text-[10px]">
              Cheat Sheet
            </Badge>
          </div>
          <div className="space-y-3 p-5">
            <ul className="space-y-2">
              {cheatSheet.points.map((p, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-100 text-[10px] font-bold text-brand-700 dark:bg-brand-900/60 dark:text-brand-300">
                    {i + 1}
                  </span>
                  {p}
                </li>
              ))}
            </ul>
            {cheatSheet.table && (
              <div className="overflow-x-auto rounded-xl border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-secondary/70">
                      {cheatSheet.table.headers.map((h, i) => (
                        <th key={i} className="px-3 py-2 text-left font-semibold">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {cheatSheet.table.rows.map((row, ri) => (
                      <tr key={ri} className="border-t even:bg-secondary/30">
                        {row.map((cell, ci) => (
                          <td key={ci} className={ci === 0 ? "px-3 py-2 font-medium" : "px-3 py-2"}>
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Practice */}
      {exerciseDTOs.length > 0 && (
        <div className="mt-10 space-y-5">
          <h2 className="text-xl font-bold tracking-tight">Übung macht den Meister · Practice</h2>
          {exerciseDTOs.map((ex) => (
            <ExercisePlayer key={ex.id} exercise={ex} />
          ))}
        </div>
      )}

      {/* Prev / Next */}
      <div className="mt-10 flex items-center justify-between gap-3 border-t pt-6">
        {prev ? (
          <Link href={`/grammar/${prev.slug}`} className="group flex min-w-0 items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ChevronLeft className="h-4 w-4 shrink-0 transition-transform group-hover:-translate-x-0.5" />
            <span className="truncate">{prev.title}</span>
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link href={`/grammar/${next.slug}`} className="group flex min-w-0 items-center gap-2 text-right text-sm text-muted-foreground hover:text-foreground">
            <span className="truncate">{next.title}</span>
            <ChevronRight className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-0.5" />
          </Link>
        ) : (
          <span />
        )}
      </div>
    </div>
  );
}
