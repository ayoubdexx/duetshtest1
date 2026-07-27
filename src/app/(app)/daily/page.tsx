import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight, BookOpen, Layers, Mic, PenLine, Dumbbell } from "lucide-react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/app/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SpeakButton } from "@/components/content/speak-button";

export const metadata = { title: "Daily Lesson" };

function dayIndex(): number {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  return Math.floor((now.getTime() - start.getTime()) / 86400000);
}

export default async function DailyPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  const userId = session.user.id;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { currentLevel: true, dailyGoalMin: true },
  });
  if (!user) redirect("/login");
  const level = user.currentLevel;

  const completedIds = (
    await prisma.lessonProgress.findMany({ where: { userId, status: "COMPLETED" }, select: { lessonId: true } })
  ).map((p) => p.lessonId);

  const [dueCards, nextLesson, exercises, speakings, writings, words] = await Promise.all([
    prisma.flashcard.count({ where: { userId, dueAt: { lte: new Date() } } }),
    prisma.lesson.findFirst({
      where: { published: true, module: { levelCode: level }, id: { notIn: completedIds } },
      orderBy: [{ module: { order: "asc" } }, { order: "asc" }],
      include: { module: true },
    }),
    prisma.exercise.findMany({ where: { levelCode: level }, select: { slug: true, title: true, skill: true } }),
    prisma.speakingActivity.findMany({ where: { levelCode: level }, select: { slug: true, title: true, type: true } }),
    prisma.writingTask.findMany({ where: { levelCode: level }, select: { slug: true, title: true, type: true } }),
    prisma.vocabWord.findMany({
      where: { topic: { levelCode: level } },
      select: { german: true, article: true, meaning: true, exampleDe: true, ipa: true },
    }),
  ]);

  const di = dayIndex();
  const exercise = exercises.length > 0 ? exercises[di % exercises.length] : null;
  const speaking = speakings.length > 0 ? speakings[di % speakings.length] : null;
  const writing = writings.length > 0 ? writings[di % writings.length] : null;
  const word = words.length > 0 ? words[di % words.length] : null;

  const steps = [
    dueCards > 0
      ? {
          icon: Layers,
          color: "bg-violet-100 text-violet-600 dark:bg-violet-900/40 dark:text-violet-400",
          title: `Review ${dueCards} flashcard${dueCards === 1 ? "" : "s"}`,
          desc: "Spaced repetition works best when you clear your queue daily.",
          href: "/flashcards/review",
          cta: "Start review",
          minutes: Math.min(15, Math.max(3, Math.round(dueCards * 0.4))),
        }
      : null,
    nextLesson
      ? {
          icon: BookOpen,
          color: "bg-brand-100 text-brand-600 dark:bg-brand-900/40 dark:text-brand-400",
          title: nextLesson.title,
          desc: `${nextLesson.module.levelCode} · ${nextLesson.module.title}`,
          href: `/lessons/${nextLesson.slug}`,
          cta: "Open lesson",
          minutes: nextLesson.durationMin,
        }
      : null,
    exercise
      ? {
          icon: Dumbbell,
          color: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400",
          title: exercise.title,
          desc: `Quick ${exercise.skill.toLowerCase()} drill for ${level}`,
          href: `/exercises/${exercise.slug}`,
          cta: "Practice",
          minutes: 5,
        }
      : null,
    speaking
      ? {
          icon: Mic,
          color: "bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400",
          title: speaking.title,
          desc: "Say it out loud — speaking a little every day beats a lot once a week.",
          href: `/speaking/${speaking.slug}`,
          cta: "Speak",
          minutes: 5,
        }
      : null,
    writing
      ? {
          icon: PenLine,
          color: "bg-teal-100 text-teal-600 dark:bg-teal-900/40 dark:text-teal-400",
          title: writing.title,
          desc: "Optional bonus: write a few sentences and get instant feedback.",
          href: `/writing/${writing.slug}`,
          cta: "Write",
          minutes: 10,
        }
      : null,
  ].filter(Boolean) as {
    icon: typeof BookOpen;
    color: string;
    title: string;
    desc: string;
    href: string;
    cta: string;
    minutes: number;
  }[];

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        title="Today's session"
        description={`Your personalized plan for today — about ${steps.reduce((a, s) => a + s.minutes, 0)} minutes, tuned to level ${level}.`}
      />

      {word && (
        <Card className="mb-6 overflow-hidden">
          <div className="border-b bg-secondary/50 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Wort des Tages · Word of the day
          </div>
          <CardContent className="flex items-center gap-4 p-5">
            <SpeakButton text={word.german} size="md" />
            <div className="min-w-0 flex-1">
              <div className="text-xl font-bold tracking-tight">
                {word.article ? `${word.article} ` : ""}
                {word.german}
                {word.ipa && <span className="ml-2 font-mono text-sm font-normal text-muted-foreground">[{word.ipa}]</span>}
              </div>
              <div className="text-sm text-muted-foreground">{word.meaning}</div>
              <div className="mt-1 text-sm italic text-foreground/70">„{word.exampleDe}"</div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {steps.map((step, i) => (
          <Card key={i} className="card-hover">
            <CardContent className="flex items-center gap-4 p-5">
              <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${step.color}`}>
                <step.icon className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="section-label">Step {i + 1}</span>
                  <Badge variant="secondary" className="text-[10px]">
                    ~{step.minutes} min
                  </Badge>
                </div>
                <div className="mt-0.5 truncate font-semibold">{step.title}</div>
                <div className="truncate text-sm text-muted-foreground">{step.desc}</div>
              </div>
              <Link href={step.href} className="shrink-0">
                <Button>
                  {step.cta} <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
        {steps.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center text-muted-foreground">
              🎉 Nothing due today — explore the <Link href="/courses" className="font-medium text-foreground underline">courses</Link> or review your <Link href="/flashcards" className="font-medium text-foreground underline">flashcards</Link>.
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
