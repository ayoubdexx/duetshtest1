import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { levelMeta } from "@/lib/levels";
import { Badge } from "@/components/ui/badge";
import { BookmarkButton } from "@/components/content/bookmark-button";
import { ExercisePlayer, type ExerciseDTO } from "@/components/exercises/exercise-player";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const ex = await prisma.exercise.findUnique({ where: { slug }, select: { title: true } });
  return { title: ex?.title ?? "Exercise" };
}

export default async function ExercisePage({ params }: { params: Promise<{ slug: string }> }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  const userId = session.user.id;

  const { slug } = await params;
  const ex = await prisma.exercise.findUnique({
    where: { slug },
    include: { grammarTopic: { select: { slug: true, title: true } } },
  });
  if (!ex) notFound();

  const [bookmark, related, attempts] = await Promise.all([
    prisma.bookmark.findUnique({ where: { userId_type_refId: { userId, type: "EXERCISE", refId: ex.id } } }),
    prisma.exercise.findMany({
      where: { skill: ex.skill, levelCode: ex.levelCode, id: { not: ex.id } },
      take: 3,
      select: { slug: true, title: true, type: true },
    }),
    prisma.exerciseAttempt.findMany({
      where: { userId, exerciseId: ex.id },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
  ]);

  const meta = levelMeta(ex.levelCode);
  const dto: ExerciseDTO = {
    id: ex.id,
    slug: ex.slug,
    title: ex.title,
    type: ex.type,
    skill: ex.skill,
    instructions: ex.instructions,
    xpReward: ex.xpReward,
    questions: ex.questions,
  };

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <div className="mb-2 text-sm text-muted-foreground">
            <Link href="/exercises" className="hover:text-foreground">
              Exercises
            </Link>{" "}
            / <span className="capitalize text-foreground">{ex.skill.toLowerCase()}</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{ex.title}</h1>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Badge className={`${meta.color} border-transparent text-white`}>{ex.levelCode}</Badge>
            <Badge variant="secondary" className="capitalize">
              {ex.skill.toLowerCase()}
            </Badge>
            {ex.grammarTopic && (
              <Link href={`/grammar/${ex.grammarTopic.slug}`}>
                <Badge variant="brand" className="cursor-pointer">
                  📖 {ex.grammarTopic.title}
                </Badge>
              </Link>
            )}
          </div>
        </div>
        <BookmarkButton
          type="EXERCISE"
          refId={ex.id}
          title={ex.title}
          href={`/exercises/${ex.slug}`}
          initialBookmarked={!!bookmark}
        />
      </div>

      <ExercisePlayer exercise={dto} />

      {attempts.length > 0 && (
        <div className="mt-8 rounded-2xl border bg-card p-5 shadow-card">
          <div className="section-label mb-3">Recent attempts</div>
          <div className="space-y-2">
            {attempts.map((a) => {
              const pct = Math.round((a.correct / a.total) * 100);
              return (
                <div key={a.id} className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    {a.createdAt.toLocaleDateString("en", { month: "short", day: "numeric" })} ·{" "}
                    {a.createdAt.toLocaleTimeString("en", { hour: "2-digit", minute: "2-digit" })}
                  </span>
                  <span className={pct >= 80 ? "font-semibold text-emerald-600 dark:text-emerald-400" : "font-medium"}>
                    {a.correct}/{a.total} ({pct}%)
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {related.length > 0 && (
        <div className="mt-8">
          <div className="section-label mb-3">More {ex.skill.toLowerCase()} practice</div>
          <div className="grid gap-3 sm:grid-cols-3">
            {related.map((r) => (
              <Link key={r.slug} href={`/exercises/${r.slug}`} className="group">
                <div className="card-hover flex h-full items-center justify-between gap-2 rounded-xl border bg-card p-4">
                  <span className="text-sm font-medium leading-snug">{r.title}</span>
                  <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
