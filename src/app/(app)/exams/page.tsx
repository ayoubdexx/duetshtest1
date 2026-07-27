import Link from "next/link";
import { redirect } from "next/navigation";
import { AlarmClock, Award, ChevronRight, Medal } from "lucide-react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { levelMeta } from "@/lib/levels";
import { PageHeader } from "@/components/app/page-header";
import { Badge } from "@/components/ui/badge";

export const metadata = { title: "Mock Exams" };

export default async function ExamsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  const userId = session.user.id;

  const [exams, attempts] = await Promise.all([
    prisma.mockExam.findMany({
      orderBy: [{ level: { order: "asc" } }, { provider: "asc" }],
    }),
    prisma.examAttempt.findMany({
      where: { userId, finishedAt: { not: null } },
      orderBy: { finishedAt: "desc" },
      select: { examId: true, score: true, maxScore: true, passed: true },
    }),
  ]);

  const bestByExam = new Map<string, { pct: number; passed: boolean }>();
  for (const a of attempts) {
    if (a.score === null || a.maxScore === null || a.maxScore === 0) continue;
    const pct = Math.round((a.score / a.maxScore) * 100);
    const cur = bestByExam.get(a.examId);
    if (!cur || cur.pct < pct) bestByExam.set(a.examId, { pct, passed: !!a.passed });
  }

  return (
    <div>
      <PageHeader
        title="Mock Exams"
        description="Full-length, timed simulations in the authentic Goethe and TELC formats — with automatic scoring and detailed corrections."
      />

      <div className="grid gap-4 md:grid-cols-2">
        {exams.map((exam) => {
          const meta = levelMeta(exam.levelCode);
          const best = bestByExam.get(exam.id);
          const sectionCount = Array.isArray(exam.sections) ? (exam.sections as unknown[]).length : 0;
          return (
            <Link key={exam.slug} href={`/exams/${exam.slug}`} className="group">
              <div className="card-hover relative h-full overflow-hidden rounded-2xl border bg-card p-6 shadow-card">
                <div className={`absolute inset-x-0 top-0 h-1 ${meta.color}`} />
                <div className="flex items-start justify-between gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary">
                    {exam.provider === "GOETHE" ? <Award className="h-5 w-5" /> : <Medal className="h-5 w-5" />}
                  </div>
                  {best ? (
                    <Badge variant={best.passed ? "success" : "secondary"}>
                      Best: {best.pct}% {best.passed ? "· passed" : ""}
                    </Badge>
                  ) : (
                    <Badge variant="secondary">Not attempted</Badge>
                  )}
                </div>
                <h2 className="mt-4 text-lg font-bold tracking-tight">{exam.title}</h2>
                {exam.description && <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{exam.description}</p>}
                <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  <Badge className={`${meta.color} border-transparent text-white`}>{exam.levelCode}</Badge>
                  <Badge variant="secondary">{exam.provider}</Badge>
                  <span className="flex items-center gap-1">
                    <AlarmClock className="h-3.5 w-3.5" /> {exam.durationMin} min
                  </span>
                  <span>· {sectionCount} sections</span>
                  <span>· pass {exam.passScore}%</span>
                </div>
                <div className="mt-4 flex items-center gap-1 text-sm font-semibold">
                  View exam <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
      {exams.length === 0 && (
        <div className="rounded-2xl border p-10 text-center text-muted-foreground">No mock exams available yet.</div>
      )}
    </div>
  );
}
