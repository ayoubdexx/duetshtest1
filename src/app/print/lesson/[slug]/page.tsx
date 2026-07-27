import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { LessonBlock, Homework } from "@/types/content";
import { BlockRenderer, PrintExercise } from "@/components/content/block-renderer";
import type { ExerciseDTO } from "@/components/exercises/exercise-player";
import { PrintHeader, PrintFooter } from "@/components/print/print-parts";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const lesson = await prisma.lesson.findUnique({ where: { slug }, select: { title: true } });
  return { title: lesson?.title ?? "Lesson" };
}

export default async function PrintLessonPage({ params }: { params: Promise<{ slug: string }> }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const { slug } = await params;
  const lesson = await prisma.lesson.findUnique({ where: { slug }, include: { module: true } });
  if (!lesson) notFound();

  const blocks = lesson.blocks as unknown as LessonBlock[];
  const exerciseSlugs = blocks.filter((b) => b.type === "exercise").map((b) => (b as { slug: string }).slug);
  const exercises = await prisma.exercise.findMany({
    where: { OR: [{ slug: { in: exerciseSlugs } }, { lessonId: lesson.id }] },
  });

  const exerciseMap: Record<string, ExerciseDTO> = {};
  for (const ex of exercises) {
    exerciseMap[ex.slug] = {
      id: ex.id,
      slug: ex.slug,
      title: ex.title,
      type: ex.type,
      skill: ex.skill,
      instructions: ex.instructions,
      xpReward: ex.xpReward,
      questions: ex.questions,
    };
  }

  const objectives = (lesson.objectives as string[] | null) ?? [];
  const homework = lesson.homework as Homework | null;
  const headings = blocks.filter((b) => b.type === "heading") as { type: "heading"; text: string }[];
  const usedExercises = exerciseSlugs.map((s) => exerciseMap[s]).filter(Boolean);

  return (
    <div>
      <PrintHeader
        eyebrow={`${lesson.module.levelCode} · ${lesson.module.title}`}
        title={lesson.title}
        subtitle={lesson.subtitle ?? undefined}
        badge={lesson.module.levelCode}
      />

      {/* Table of contents */}
      {headings.length > 1 && (
        <div className="avoid-break mb-8 rounded-2xl border p-5">
          <div className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-zinc-500">Inhalt · Contents</div>
          <ol className="list-decimal space-y-1 pl-5 text-sm">
            {headings.map((h, i) => (
              <li key={i}>{h.text}</li>
            ))}
            {usedExercises.length > 0 && <li>Lösungen · Solutions</li>}
            {homework && <li>Hausaufgaben · Homework</li>}
          </ol>
        </div>
      )}

      {/* Objectives */}
      {objectives.length > 0 && (
        <div className="avoid-break mb-8 rounded-2xl border-2 border-amber-600/60 bg-amber-50 p-5">
          <div className="mb-2 text-sm font-bold">🎯 Lernziele · In this lesson you learn</div>
          <ul className="space-y-1 text-sm">
            {objectives.map((o, i) => (
              <li key={i}>☐ {o}</li>
            ))}
          </ul>
        </div>
      )}

      <BlockRenderer blocks={blocks} exercises={exerciseMap} print />

      {/* Homework */}
      {homework && homework.tasks.length > 0 && (
        <div className="avoid-break mt-10 rounded-2xl border p-5">
          <div className="mb-2 text-sm font-bold">📝 {homework.title ?? "Hausaufgaben · Homework"}</div>
          <ol className="list-decimal space-y-1.5 pl-5 text-sm">
            {homework.tasks.map((t, i) => (
              <li key={i}>{t}</li>
            ))}
          </ol>
        </div>
      )}

      {/* Solutions */}
      {usedExercises.length > 0 && (
        <div className="print-page mt-10">
          <h2 className="mb-4 border-b-2 border-zinc-900 pb-2 text-xl font-bold">Lösungen · Solutions</h2>
          <div className="space-y-5">
            {usedExercises.map((ex) => (
              <PrintExercise key={ex.slug} exercise={ex} showSolutions />
            ))}
          </div>
        </div>
      )}

      {/* Revision summary */}
      <div className="avoid-break mt-10 rounded-2xl bg-zinc-100 p-5">
        <div className="mb-2 text-sm font-bold">🔁 Wiederholung · Revision checklist</div>
        <ul className="space-y-1 text-sm text-zinc-700">
          {objectives.length > 0 ? (
            objectives.map((o, i) => <li key={i}>☐ Can you… {o.toLowerCase().replace(/\.$/, "")}?</li>)
          ) : (
            <li>☐ Re-read the dialogue out loud and translate three sentences from memory.</li>
          )}
          <li>☐ Review this lesson's words in your flashcard deck.</li>
          <li>☐ Redo the exercises tomorrow — without looking at the solutions.</li>
        </ul>
      </div>

      <PrintFooter />
    </div>
  );
}
