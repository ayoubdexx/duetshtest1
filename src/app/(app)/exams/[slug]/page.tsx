import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { AlarmClock, ArrowRight, CheckCircle2, XCircle } from "lucide-react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { levelMeta } from "@/lib/levels";
import type { ExamSection } from "@/types/content";
import { PageHeader } from "@/components/app/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookmarkButton } from "@/components/content/bookmark-button";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const exam = await prisma.mockExam.findUnique({ where: { slug }, select: { title: true } });
  return { title: exam?.title ?? "Mock Exam" };
}

const SKILL_EMOJI: Record<string, string> = {
  READING: "📖",
  LISTENING: "🎧",
  WRITING: "✍️",
  SPEAKING: "🗣",
  LANGUAGE: "🧩",
};

export default async function ExamOverviewPage({ params }: { params: Promise<{ slug: string }> }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  const userId = session.user.id;

  const { slug } = await params;
  const exam = await prisma.mockExam.findUnique({ where: { slug } });
  if (!exam) notFound();

  const [attempts, bookmark] = await Promise.all([
    prisma.examAttempt.findMany({
      where: { userId, examId: exam.id, finishedAt: { not: null } },
      orderBy: { finishedAt: "desc" },
      take: 8,
    }),
    prisma.bookmark.findUnique({ where: { userId_type_refId: { userId, type: "EXAM", refId: exam.id } } }),
  ]);

  const meta = levelMeta(exam.levelCode);
  const sections = exam.sections as unknown as ExamSection[];

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-2 text-sm text-muted-foreground">
        <Link href="/exams" className="hover:text-foreground">
          Mock Exams
        </Link>{" "}
        / <span className="text-foreground">{exam.provider}</span>
      </div>

      <PageHeader title={exam.title} description={exam.description ?? undefined}>
        <BookmarkButton
          type="EXAM"
          refId={exam.id}
          title={exam.title}
          href={`/exams/${exam.slug}`}
          initialBookmarked={!!bookmark}
        />
        <Link href={`/exams/${exam.slug}/take`}>
          <Button size="lg">
            Start exam <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </PageHeader>

      <div className="mb-6 flex flex-wrap items-center gap-2">
        <Badge className={`${meta.color} border-transparent text-white`}>{exam.levelCode}</Badge>
        <Badge variant="secondary">{exam.provider}</Badge>
        <Badge variant="secondary" className="gap-1">
          <AlarmClock className="h-3 w-3" /> {exam.durationMin} minutes total
        </Badge>
        <Badge variant="secondary">Pass mark: {exam.passScore}%</Badge>
      </div>

      {/* Sections */}
      <div className="overflow-hidden rounded-2xl border bg-card shadow-card">
        <div className="border-b bg-secondary/40 px-5 py-3 text-sm font-bold">Exam structure</div>
        <div className="divide-y">
          {sections.map((s, i) => (
            <div key={s.id} className="flex items-center gap-4 px-5 py-4">
              <span className="text-xl">{SKILL_EMOJI[s.skill] ?? "📄"}</span>
              <div className="min-w-0 flex-1">
                <div className="font-semibold">
                  {i + 1}. {s.title}
                </div>
                <div className="text-sm text-muted-foreground">
                  {s.parts.length} part{s.parts.length === 1 ? "" : "s"}
                  {s.intro ? ` · ${s.intro.slice(0, 80)}${s.intro.length > 80 ? "…" : ""}` : ""}
                </div>
              </div>
              <Badge variant="secondary" className="shrink-0">
                {s.durationMin} min
              </Badge>
            </div>
          ))}
        </div>
      </div>

      {/* Tips */}
      <div className="mt-6 rounded-2xl border border-brand-200 bg-brand-50/50 p-5 dark:border-brand-900 dark:bg-brand-950/30">
        <div className="mb-2 text-sm font-bold">📌 Before you start</div>
        <ul className="space-y-1.5 text-sm text-foreground/85">
          <li>• Block {exam.durationMin} minutes of quiet time — the timer runs continuously and auto-submits.</li>
          <li>• Answer every question; there's no penalty for guessing.</li>
          <li>• Writing tasks are auto-graded here — in the real exam, human examiners apply the official criteria.</li>
          <li>• Use headphones for the listening section.</li>
        </ul>
      </div>

      {/* Attempts */}
      {attempts.length > 0 && (
        <div className="mt-6 overflow-hidden rounded-2xl border bg-card shadow-card">
          <div className="border-b bg-secondary/40 px-5 py-3 text-sm font-bold">Your attempts</div>
          <div className="divide-y">
            {attempts.map((a) => {
              const pct = a.score !== null && a.maxScore ? Math.round((a.score / a.maxScore) * 100) : 0;
              return (
                <div key={a.id} className="flex items-center gap-3 px-5 py-3.5 text-sm">
                  {a.passed ? (
                    <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-rose-400" />
                  )}
                  <span className="flex-1 text-muted-foreground">
                    {a.finishedAt?.toLocaleDateString("en", { dateStyle: "medium" })}
                  </span>
                  <span className="font-semibold">{pct}%</span>
                  <Badge variant={a.passed ? "success" : "secondary"}>{a.passed ? "Passed" : "Not passed"}</Badge>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
