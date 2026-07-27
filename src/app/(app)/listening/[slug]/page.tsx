import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { levelMeta } from "@/lib/levels";
import type { ExerciseQuestion, GlossaryEntry } from "@/types/content";
import { Badge } from "@/components/ui/badge";
import { BookmarkButton } from "@/components/content/bookmark-button";
import { SpeakButton } from "@/components/content/speak-button";
import { AudioPlayer } from "@/components/content/audio-player";
import { ExercisePlayer, type ExerciseDTO } from "@/components/exercises/exercise-player";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = await prisma.listeningExercise.findUnique({ where: { slug }, select: { title: true } });
  return { title: item?.title ?? "Listening" };
}

export default async function ListeningDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  const userId = session.user.id;

  const { slug } = await params;
  const item = await prisma.listeningExercise.findUnique({ where: { slug } });
  if (!item) notFound();

  const bookmark = await prisma.bookmark.findUnique({
    where: { userId_type_refId: { userId, type: "LISTENING", refId: item.id } },
  });

  const meta = levelMeta(item.levelCode);
  const vocabulary = (item.vocabulary as GlossaryEntry[] | null) ?? [];
  const questions = item.questions as unknown as ExerciseQuestion[];

  const questionsDTO: ExerciseDTO = {
    id: "",
    slug: `listening-${item.slug}`,
    title: "Hörverstehen · Comprehension",
    type: "MCQ",
    skill: "LISTENING",
    instructions: "Listen first — then answer. You can replay as often as you like.",
    xpReward: 20,
    questions,
  };

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <div className="mb-2 text-sm text-muted-foreground">
            <Link href="/listening" className="hover:text-foreground">
              Listening
            </Link>
          </div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{item.title}</h1>
          {item.description && <p className="mt-1.5 text-muted-foreground">{item.description}</p>}
          <div className="mt-3">
            <Badge className={`${meta.color} border-transparent text-white`}>{item.levelCode}</Badge>
          </div>
        </div>
        <BookmarkButton
          type="LISTENING"
          refId={item.id}
          title={item.title}
          href={`/listening/${item.slug}`}
          initialBookmarked={!!bookmark}
        />
      </div>

      <div className="mb-6 rounded-2xl border border-sky-200 bg-sky-50/60 px-4 py-3 text-sm text-sky-900 dark:border-sky-900 dark:bg-sky-950/40 dark:text-sky-200">
        🎧 <strong>Tipp:</strong> Listen once without the transcript. Then listen again while reading along — and slow the
        speed down if it's too fast.
      </div>

      <AudioPlayer src={item.audioUrl} title={item.title} transcript={item.transcript} />

      {vocabulary.length > 0 && (
        <div className="mt-6 rounded-2xl border bg-card p-5 shadow-card">
          <div className="section-label mb-3">Wichtige Wörter · Key vocabulary</div>
          <div className="grid gap-2 sm:grid-cols-2">
            {vocabulary.map((v, i) => (
              <div key={i} className="flex items-center gap-2 rounded-xl bg-secondary/50 px-3 py-2 text-sm">
                <SpeakButton text={v.de} />
                <span className="font-medium">{v.de}</span>
                <span className="text-muted-foreground">— {v.en}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {questions.length > 0 && (
        <div className="mt-8">
          <ExercisePlayer exercise={questionsDTO} activity={{ kind: "LISTENING", refId: item.id }} />
        </div>
      )}
    </div>
  );
}
