import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { levelMeta } from "@/lib/levels";
import type { WritingTemplate } from "@/types/content";
import { Badge } from "@/components/ui/badge";
import { BookmarkButton } from "@/components/content/bookmark-button";
import { MiniMd } from "@/lib/mini-md";
import { WritingWorkspace } from "@/components/writing/writing-workspace";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const task = await prisma.writingTask.findUnique({ where: { slug }, select: { title: true } });
  return { title: task?.title ?? "Writing" };
}

const TYPE_LABELS: Record<string, string> = {
  EMAIL: "E-Mail",
  LETTER: "Brief",
  MESSAGE: "Nachricht",
  ESSAY: "Aufsatz",
  EXAM_TASK: "Prüfungsaufgabe",
};

export default async function WritingTaskPage({ params }: { params: Promise<{ slug: string }> }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  const userId = session.user.id;

  const { slug } = await params;
  const task = await prisma.writingTask.findUnique({ where: { slug } });
  if (!task) notFound();

  const [bookmark, submissions] = await Promise.all([
    prisma.bookmark.findUnique({
      where: { userId_type_refId: { userId, type: "WRITING", refId: task.id } },
    }),
    prisma.writingSubmission.findMany({
      where: { userId, taskId: task.id },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: { id: true, content: true, score: true, createdAt: true },
    }),
  ]);

  const meta = levelMeta(task.levelCode);

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <div className="mb-2 text-sm text-muted-foreground">
            <Link href="/writing" className="hover:text-foreground">
              Writing
            </Link>{" "}
            / <span className="text-foreground">{TYPE_LABELS[task.type] ?? task.type}</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{task.title}</h1>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Badge className={`${meta.color} border-transparent text-white`}>{task.levelCode}</Badge>
            <Badge variant="secondary">{TYPE_LABELS[task.type] ?? task.type}</Badge>
            <Badge variant="secondary">min. {task.minWords} words</Badge>
          </div>
        </div>
        <BookmarkButton
          type="WRITING"
          refId={task.id}
          title={task.title}
          href={`/writing/${task.slug}`}
          initialBookmarked={!!bookmark}
        />
      </div>

      <div className="mb-6 rounded-2xl border bg-card p-5 shadow-card sm:p-6">
        <div className="section-label mb-2">Aufgabe · Task</div>
        <MiniMd text={task.prompt} className="text-foreground/90" />
      </div>

      <WritingWorkspace
        taskId={task.id}
        minWords={task.minWords}
        template={(task.template as unknown as WritingTemplate) ?? null}
        sampleAnswer={task.sampleAnswer}
        tips={(task.tips as string[] | null) ?? []}
        pastSubmissions={submissions.map((s) => ({
          id: s.id,
          content: s.content,
          score: s.score,
          createdAt: s.createdAt.toISOString(),
        }))}
      />
    </div>
  );
}
