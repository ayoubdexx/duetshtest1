import Link from "next/link";
import { redirect } from "next/navigation";
import { Mail, FileText, MessageSquare, ScrollText, GraduationCap } from "lucide-react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { levelMeta, LEVELS } from "@/lib/levels";
import { PageHeader } from "@/components/app/page-header";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export const metadata = { title: "Writing" };

const TYPE_META: Record<string, { label: string; icon: typeof Mail; color: string }> = {
  EMAIL: { label: "E-Mail", icon: Mail, color: "bg-sky-100 text-sky-600 dark:bg-sky-900/40 dark:text-sky-400" },
  LETTER: { label: "Brief", icon: ScrollText, color: "bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400" },
  MESSAGE: { label: "Nachricht", icon: MessageSquare, color: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400" },
  ESSAY: { label: "Aufsatz", icon: FileText, color: "bg-violet-100 text-violet-600 dark:bg-violet-900/40 dark:text-violet-400" },
  EXAM_TASK: { label: "Prüfungsaufgabe", icon: GraduationCap, color: "bg-rose-100 text-rose-600 dark:bg-rose-900/40 dark:text-rose-400" },
};

export default async function WritingPage({ searchParams }: { searchParams: Promise<{ level?: string }> }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  const userId = session.user.id;

  const { level } = await searchParams;
  const activeLevel = level && LEVELS.includes(level.toUpperCase() as (typeof LEVELS)[number]) ? level.toUpperCase() : null;

  const [tasks, submissions] = await Promise.all([
    prisma.writingTask.findMany({
      where: activeLevel ? { levelCode: activeLevel } : undefined,
      orderBy: [{ level: { order: "asc" } }, { order: "asc" }],
      select: { slug: true, title: true, type: true, levelCode: true, minWords: true, id: true },
    }),
    prisma.writingSubmission.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      select: { taskId: true, score: true },
    }),
  ]);

  const bestByTask = new Map<string, number>();
  for (const s of submissions) {
    if (s.score !== null && (!bestByTask.has(s.taskId) || bestByTask.get(s.taskId)! < s.score)) {
      bestByTask.set(s.taskId, s.score);
    }
  }

  return (
    <div>
      <PageHeader
        title="Writing"
        description="Emails, letters, messages and essays — with automatic corrections, grammar feedback, vocabulary suggestions and native sample answers."
      />

      <div className="mb-8 flex flex-wrap gap-2">
        <Link href="/writing">
          <Badge variant={activeLevel === null ? "default" : "secondary"} className="cursor-pointer px-3 py-1.5 text-xs">
            All levels
          </Badge>
        </Link>
        {LEVELS.map((code) => (
          <Link key={code} href={`/writing?level=${code.toLowerCase()}`}>
            <Badge
              variant="secondary"
              className={cn("cursor-pointer px-3 py-1.5 text-xs", activeLevel === code && `${levelMeta(code).color} border-transparent text-white`)}
            >
              {code}
            </Badge>
          </Link>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tasks.map((task) => {
          const meta = levelMeta(task.levelCode);
          const typeMeta = TYPE_META[task.type] ?? TYPE_META.MESSAGE;
          const Icon = typeMeta.icon;
          const best = bestByTask.get(task.id);
          return (
            <Link key={task.slug} href={`/writing/${task.slug}`} className="group">
              <div className="card-hover flex h-full flex-col rounded-2xl border bg-card p-5 shadow-card">
                <div className="flex items-center justify-between">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${typeMeta.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  {best !== undefined ? (
                    <Badge variant={best >= 75 ? "success" : "secondary"} className="text-[10px]">
                      Best: {best}
                    </Badge>
                  ) : (
                    <Badge className={`${meta.color} border-transparent text-white`}>{task.levelCode}</Badge>
                  )}
                </div>
                <h3 className="mt-3 font-semibold leading-snug">{task.title}</h3>
                <div className="mt-auto flex items-center gap-2 pt-3 text-xs text-muted-foreground">
                  <Badge variant="secondary" className="text-[10px]">
                    {typeMeta.label}
                  </Badge>
                  <span>min. {task.minWords} words</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
      {tasks.length === 0 && (
        <div className="rounded-2xl border p-10 text-center text-muted-foreground">No writing tasks for this filter yet.</div>
      )}
    </div>
  );
}
