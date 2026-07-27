import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight, BookOpen, CheckCircle2 } from "lucide-react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { levelMeta } from "@/lib/levels";
import { PageHeader } from "@/components/app/page-header";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

export const metadata = { title: "Courses" };

export default async function CoursesPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  const userId = session.user.id;

  const [levels, completed] = await Promise.all([
    prisma.level.findMany({
      orderBy: { order: "asc" },
      include: {
        modules: {
          orderBy: { order: "asc" },
          include: { lessons: { where: { published: true }, select: { id: true } } },
        },
      },
    }),
    prisma.lessonProgress.findMany({
      where: { userId, status: "COMPLETED" },
      select: { lessonId: true },
    }),
  ]);

  const completedSet = new Set(completed.map((c) => c.lessonId));

  return (
    <div>
      <PageHeader
        title="Courses"
        description="Four complete CEFR levels. Each one takes you through modules, lessons, revision and a final exam."
      />

      <div className="grid gap-5 md:grid-cols-2">
        {levels.map((level) => {
          const meta = levelMeta(level.code);
          const lessonIds = level.modules.flatMap((m) => m.lessons.map((l) => l.id));
          const total = lessonIds.length;
          const done = lessonIds.filter((id) => completedSet.has(id)).length;
          const pct = total > 0 ? Math.round((done / total) * 100) : 0;
          const isComplete = total > 0 && done === total;

          return (
            <Link key={level.code} href={`/courses/${level.code.toLowerCase()}`} className="group">
              <div className="card-hover relative h-full overflow-hidden rounded-2xl border bg-card p-6 shadow-card">
                <div className={`absolute inset-x-0 top-0 h-1.5 ${meta.color}`} />
                <div className="flex items-start justify-between gap-4">
                  <div className={`flex h-14 w-14 items-center justify-center rounded-2xl text-xl font-bold text-white ${meta.color}`}>
                    {level.code}
                  </div>
                  {isComplete ? (
                    <Badge variant="success" className="gap-1">
                      <CheckCircle2 className="h-3 w-3" /> Completed
                    </Badge>
                  ) : (
                    <Badge variant="secondary">
                      {level.modules.length} modules · {total} lessons
                    </Badge>
                  )}
                </div>

                <h2 className="mt-4 text-xl font-bold tracking-tight">{level.title}</h2>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{level.tagline}</p>
                <p className="mt-3 line-clamp-2 text-sm text-muted-foreground/80">{level.description}</p>

                <div className="mt-5">
                  <div className="mb-1.5 flex items-center justify-between text-xs">
                    <span className="font-medium text-muted-foreground">
                      {done}/{total} lessons
                    </span>
                    <span className="font-semibold">{pct}%</span>
                  </div>
                  <Progress value={pct} className="h-2" indicatorClassName={meta.color} />
                </div>

                <div className="mt-5 flex items-center gap-1.5 text-sm font-semibold text-foreground">
                  <BookOpen className="h-4 w-4" />
                  {done === 0 ? "Start course" : isComplete ? "Review course" : "Continue course"}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
