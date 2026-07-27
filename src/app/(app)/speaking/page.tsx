import Link from "next/link";
import { redirect } from "next/navigation";
import { Drama, MessageCircle, UserRound, AudioLines, Flame } from "lucide-react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { levelMeta, LEVELS } from "@/lib/levels";
import { PageHeader } from "@/components/app/page-header";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export const metadata = { title: "Speaking" };

const TYPE_META: Record<string, { label: string; icon: typeof Drama; color: string }> = {
  ROLEPLAY: { label: "Roleplay", icon: Drama, color: "bg-violet-100 text-violet-600 dark:bg-violet-900/40 dark:text-violet-400" },
  CONVERSATION: { label: "Conversation", icon: MessageCircle, color: "bg-sky-100 text-sky-600 dark:bg-sky-900/40 dark:text-sky-400" },
  INTERVIEW: { label: "Interview", icon: UserRound, color: "bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400" },
  PRONUNCIATION: { label: "Pronunciation", icon: AudioLines, color: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400" },
  CHALLENGE: { label: "Challenge", icon: Flame, color: "bg-rose-100 text-rose-600 dark:bg-rose-900/40 dark:text-rose-400" },
};

export default async function SpeakingPage({ searchParams }: { searchParams: Promise<{ level?: string }> }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const { level } = await searchParams;
  const activeLevel = level && LEVELS.includes(level.toUpperCase() as (typeof LEVELS)[number]) ? level.toUpperCase() : null;

  const activities = await prisma.speakingActivity.findMany({
    where: activeLevel ? { levelCode: activeLevel } : undefined,
    orderBy: [{ level: { order: "asc" } }, { order: "asc" }],
    select: { slug: true, title: true, type: true, description: true, levelCode: true },
  });

  return (
    <div>
      <PageHeader
        title="Speaking"
        description="Daily speaking practice: roleplays, conversations, interview training and challenges — with recording and self-check."
      />

      <div className="mb-8 flex flex-wrap gap-2">
        <Link href="/speaking">
          <Badge variant={activeLevel === null ? "default" : "secondary"} className="cursor-pointer px-3 py-1.5 text-xs">
            All levels
          </Badge>
        </Link>
        {LEVELS.map((code) => (
          <Link key={code} href={`/speaking?level=${code.toLowerCase()}`}>
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
        {activities.map((a) => {
          const meta = levelMeta(a.levelCode);
          const typeMeta = TYPE_META[a.type] ?? TYPE_META.CONVERSATION;
          const Icon = typeMeta.icon;
          return (
            <Link key={a.slug} href={`/speaking/${a.slug}`} className="group">
              <div className="card-hover flex h-full flex-col rounded-2xl border bg-card p-5 shadow-card">
                <div className="flex items-center justify-between">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${typeMeta.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <Badge className={`${meta.color} border-transparent text-white`}>{a.levelCode}</Badge>
                </div>
                <h3 className="mt-3 font-semibold leading-snug">{a.title}</h3>
                {a.description && <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{a.description}</p>}
                <div className="mt-auto pt-3">
                  <Badge variant="secondary" className="text-[10px]">
                    {typeMeta.label}
                  </Badge>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
      {activities.length === 0 && (
        <div className="rounded-2xl border p-10 text-center text-muted-foreground">No speaking activities for this filter yet.</div>
      )}
    </div>
  );
}
