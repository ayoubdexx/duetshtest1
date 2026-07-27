import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { levelMeta } from "@/lib/levels";
import type { DialogueLine, PhraseGroup } from "@/types/content";
import { Badge } from "@/components/ui/badge";
import { BookmarkButton } from "@/components/content/bookmark-button";
import { SpeakButton } from "@/components/content/speak-button";
import { MiniMd } from "@/lib/mini-md";
import { Roleplay } from "@/components/speaking/roleplay";
import { Recorder, MarkPracticedButton } from "@/components/speaking/recorder";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const a = await prisma.speakingActivity.findUnique({ where: { slug }, select: { title: true } });
  return { title: a?.title ?? "Speaking" };
}

export default async function SpeakingDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  const userId = session.user.id;

  const { slug } = await params;
  const activity = await prisma.speakingActivity.findUnique({ where: { slug } });
  if (!activity) notFound();

  const bookmark = await prisma.bookmark.findUnique({
    where: { userId_type_refId: { userId, type: "SPEAKING", refId: activity.id } },
  });

  const meta = levelMeta(activity.levelCode);
  const dialogue = (activity.dialogue as DialogueLine[] | null) ?? null;
  const phrases = (activity.phrases as PhraseGroup[] | null) ?? [];
  const tips = (activity.tips as string[] | null) ?? [];

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <div className="mb-2 text-sm text-muted-foreground">
            <Link href="/speaking" className="hover:text-foreground">
              Speaking
            </Link>{" "}
            / <span className="capitalize text-foreground">{activity.type.toLowerCase()}</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{activity.title}</h1>
          {activity.description && <p className="mt-1.5 text-muted-foreground">{activity.description}</p>}
          <div className="mt-3 flex items-center gap-2">
            <Badge className={`${meta.color} border-transparent text-white`}>{activity.levelCode}</Badge>
            <Badge variant="secondary" className="capitalize">
              {activity.type.toLowerCase()}
            </Badge>
          </div>
        </div>
        <BookmarkButton
          type="SPEAKING"
          refId={activity.id}
          title={activity.title}
          href={`/speaking/${activity.slug}`}
          initialBookmarked={!!bookmark}
        />
      </div>

      {/* Task */}
      <div className="rounded-2xl border bg-card p-5 shadow-card sm:p-6">
        <div className="section-label mb-2">Deine Aufgabe · Your task</div>
        <MiniMd text={activity.prompt} className="text-foreground/90" />
      </div>

      {/* Dialogue roleplay */}
      {dialogue && dialogue.length > 0 && (
        <div className="mt-6">
          <Roleplay lines={dialogue} />
        </div>
      )}

      {/* Useful phrases */}
      {phrases.length > 0 && (
        <div className="mt-6 rounded-2xl border bg-card p-5 shadow-card">
          <div className="section-label mb-3">Redemittel · Useful phrases</div>
          <div className="space-y-4">
            {phrases.map((group, i) => (
              <div key={i}>
                <div className="mb-1.5 text-sm font-semibold">{group.label}</div>
                <div className="space-y-1">
                  {group.items.map((p, j) => (
                    <div key={j} className="flex items-center gap-1.5 text-sm">
                      <SpeakButton text={p} />
                      <span>{p}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tips */}
      {tips.length > 0 && (
        <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50/60 p-5 dark:border-emerald-900 dark:bg-emerald-950/40">
          <div className="mb-2 text-sm font-bold">💡 Tipps</div>
          <ul className="space-y-1.5">
            {tips.map((t, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-foreground/85">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
                {t}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Recorder + mark done */}
      <div className="mt-6 space-y-4">
        <Recorder />
        <MarkPracticedButton refId={activity.id} />
      </div>
    </div>
  );
}
