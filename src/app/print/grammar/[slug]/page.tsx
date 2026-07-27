import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { LessonBlock, CheatSheet } from "@/types/content";
import { BlockRenderer, PrintExercise } from "@/components/content/block-renderer";
import type { ExerciseDTO } from "@/components/exercises/exercise-player";
import { PrintHeader, PrintFooter } from "@/components/print/print-parts";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const topic = await prisma.grammarTopic.findUnique({ where: { slug }, select: { title: true } });
  return { title: topic?.title ?? "Grammar" };
}

export default async function PrintGrammarPage({ params }: { params: Promise<{ slug: string }> }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const { slug } = await params;
  const topic = await prisma.grammarTopic.findUnique({ where: { slug } });
  if (!topic) notFound();

  const exercises = await prisma.exercise.findMany({ where: { grammarTopicId: topic.id } });
  const blocks = topic.blocks as unknown as LessonBlock[];
  const cheatSheet = topic.cheatSheet as CheatSheet | null;

  const dtos: ExerciseDTO[] = exercises.map((ex) => ({
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
    <div>
      <PrintHeader eyebrow={`Grammatik · ${topic.category}`} title={topic.title} subtitle={topic.summary} badge={topic.levelCode} />

      <BlockRenderer blocks={blocks} print />

      {cheatSheet && (
        <div className="avoid-break mt-10 rounded-2xl border-2 border-amber-600/60 p-5">
          <div className="mb-3 text-sm font-bold">⚡ {cheatSheet.title}</div>
          <ol className="list-decimal space-y-1.5 pl-5 text-sm">
            {cheatSheet.points.map((p, i) => (
              <li key={i}>{p}</li>
            ))}
          </ol>
          {cheatSheet.table && (
            <table className="mt-4 w-full border-collapse text-sm">
              <thead>
                <tr>
                  {cheatSheet.table.headers.map((h, i) => (
                    <th key={i} className="border border-zinc-300 bg-zinc-100 px-3 py-1.5 text-left font-semibold">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {cheatSheet.table.rows.map((row, ri) => (
                  <tr key={ri}>
                    {row.map((cell, ci) => (
                      <td key={ci} className="border border-zinc-300 px-3 py-1.5">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {dtos.length > 0 && (
        <>
          <div className="mt-10">
            <h2 className="mb-4 border-b-2 border-zinc-900 pb-2 text-xl font-bold">Übungen · Practice</h2>
            <div className="space-y-5">
              {dtos.map((ex) => (
                <PrintExercise key={ex.slug} exercise={ex} />
              ))}
            </div>
          </div>
          <div className="print-page mt-10">
            <h2 className="mb-4 border-b-2 border-zinc-900 pb-2 text-xl font-bold">Lösungen · Solutions</h2>
            <div className="space-y-5">
              {dtos.map((ex) => (
                <PrintExercise key={ex.slug} exercise={ex} showSolutions />
              ))}
            </div>
          </div>
        </>
      )}

      <PrintFooter />
    </div>
  );
}
