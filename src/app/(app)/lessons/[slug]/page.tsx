import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ChevronLeft, ChevronRight, Clock, Printer, Sparkles, Target } from "lucide-react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { levelMeta } from "@/lib/levels";
import type { LessonBlock, Homework } from "@/types/content";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BlockRenderer } from "@/components/content/block-renderer";
import { BookmarkButton } from "@/components/content/bookmark-button";
import { LessonAutosave, CompleteLessonButton } from "@/components/app/lesson-tracker";
import type { ExerciseDTO } from "@/components/exercises/exercise-player";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const lesson = await prisma.lesson.findUnique({ where: { slug }, select: { title: true } });
  return { title: lesson?.title ?? "Lesson" };
}

export default async function LessonPage({ params }: { params: Promise<{ slug: string }> }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  const userId = session.user.id;

  const { slug } = await params;
  const lesson = await prisma.lesson.findUnique({
    where: { slug },
    include: { module: true },
  });
  if (!lesson || !lesson.published) notFound();

  const blocks = lesson.blocks as unknown as LessonBlock[];
  const exerciseSlugs = blocks.filter((b) => b.type === "exercise").map((b) => (b as { slug: string }).slug);

  const [exercises, progress, bookmark, siblings] = await Promise.all([
    prisma.exercise.findMany({
      where: { OR: [{ slug: { in: exerciseSlugs } }, { lessonId: lesson.id }] },
    }),
    prisma.lessonProgress.findUnique({ where: { userId_lessonId: { userId, lessonId: lesson.id } } }),
    prisma.bookmark.findUnique({
      where: { userId_type_refId: { userId, type: "LESSON", refId: lesson.id } },
    }),
    prisma.lesson.findMany({
      where: { moduleId: lesson.moduleId, published: true },
      orderBy: { order: "asc" },
      select: { slug: true, title: true, order: true },
    }),
  ]);

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

  const idx = siblings.findIndex((s) => s.slug === lesson.slug);
  const prev = idx > 0 ? siblings[idx - 1] : null;
  const next = idx >= 0 && idx < siblings.length - 1 ? siblings[idx + 1] : null;

  const meta = levelMeta(lesson.module.levelCode);
  const objectives = (lesson.objectives as string[] | null) ?? [];
  const homework = lesson.homework as Homework | null;
  const completed = progress?.status === "COMPLETED";

  return (
    <div className="mx-auto max-w-3xl">
      <LessonAutosave lessonId={lesson.id} alreadyCompleted={completed} />

      {/* Breadcrumb + actions */}
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <div className="mb-2 text-sm text-muted-foreground">
            <Link href="/courses" className="hover:text-foreground">
              Courses
            </Link>{" "}
            /{" "}
            <Link href={`/courses/${lesson.module.levelCode.toLowerCase()}`} className="hover:text-foreground">
              {lesson.module.levelCode}
            </Link>{" "}
            / <span className="text-foreground">{lesson.module.title}</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{lesson.title}</h1>
          {lesson.subtitle && <p className="mt-1.5 text-muted-foreground">{lesson.subtitle}</p>}
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Badge className={`${meta.color} border-transparent text-white`}>{lesson.module.levelCode}</Badge>
            <Badge variant="secondary" className="gap-1">
              <Clock className="h-3 w-3" /> {lesson.durationMin} min
            </Badge>
            <Badge variant="secondary" className="gap-1">
              <Sparkles className="h-3 w-3 text-brand-500" /> {lesson.xpReward} XP
            </Badge>
            {completed && <Badge variant="success">Completed ✓</Badge>}
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <BookmarkButton
            type="LESSON"
            refId={lesson.id}
            title={lesson.title}
            href={`/lessons/${lesson.slug}`}
            initialBookmarked={!!bookmark}
          />
          <Link href={`/print/lesson/${lesson.slug}`} target="_blank">
            <Button variant="outline" size="icon" aria-label="Print / PDF">
              <Printer className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Objectives */}
      {objectives.length > 0 && (
        <div className="mb-8 rounded-2xl border bg-card p-5 shadow-card">
          <div className="mb-2.5 flex items-center gap-2 text-sm font-bold">
            <Target className="h-4 w-4 text-brand-500" /> In dieser Lektion lernst du
          </div>
          <ul className="grid gap-1.5 sm:grid-cols-2">
            {objectives.map((o, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-400" />
                {o}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Content */}
      <BlockRenderer blocks={blocks} exercises={exerciseMap} />

      {/* Homework */}
      {homework && homework.tasks.length > 0 && (
        <div className="mt-10 rounded-2xl border border-brand-200 bg-brand-50/50 p-5 dark:border-brand-900 dark:bg-brand-950/30">
          <div className="mb-2.5 text-sm font-bold">📝 {homework.title ?? "Hausaufgaben · Homework"}</div>
          <ol className="list-decimal space-y-1.5 pl-5 text-sm text-foreground/85">
            {homework.tasks.map((t, i) => (
              <li key={i}>{t}</li>
            ))}
          </ol>
        </div>
      )}

      {/* Complete */}
      <div className="mt-10">
        <CompleteLessonButton
          lessonId={lesson.id}
          xpReward={lesson.xpReward}
          initialCompleted={completed}
          nextHref={next ? `/lessons/${next.slug}` : `/courses/${lesson.module.levelCode.toLowerCase()}`}
          nextTitle={next?.title ?? "Back to course"}
        />
      </div>

      {/* Prev / Next */}
      <div className="mt-6 flex items-center justify-between gap-3 border-t pt-6">
        {prev ? (
          <Link href={`/lessons/${prev.slug}`} className="group flex min-w-0 items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ChevronLeft className="h-4 w-4 shrink-0 transition-transform group-hover:-translate-x-0.5" />
            <span className="truncate">{prev.title}</span>
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link href={`/lessons/${next.slug}`} className="group flex min-w-0 items-center gap-2 text-right text-sm text-muted-foreground hover:text-foreground">
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
