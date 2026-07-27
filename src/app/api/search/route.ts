import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

interface SearchResult {
  type: string;
  title: string;
  subtitle?: string;
  href: string;
}

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const url = new URL(req.url);
  const q = (url.searchParams.get("q") ?? "").trim().slice(0, 80);
  if (q.length < 2) return NextResponse.json({ results: [] });

  const contains = { contains: q, mode: "insensitive" as const };

  const [lessons, grammar, words, readings, listenings, speakings, writings, verbs, exams, exercises] =
    await Promise.all([
      prisma.lesson.findMany({
        where: { published: true, OR: [{ title: contains }, { subtitle: contains }] },
        select: { title: true, slug: true, module: { select: { title: true, levelCode: true } } },
        take: 5,
      }),
      prisma.grammarTopic.findMany({
        where: { OR: [{ title: contains }, { category: contains }, { summary: contains }] },
        select: { title: true, slug: true, levelCode: true, category: true },
        take: 5,
      }),
      prisma.vocabWord.findMany({
        where: { OR: [{ german: contains }, { meaning: contains }] },
        select: { german: true, article: true, meaning: true },
        take: 6,
      }),
      prisma.readingText.findMany({
        where: { OR: [{ title: contains }, { topic: contains }] },
        select: { title: true, slug: true, levelCode: true },
        take: 4,
      }),
      prisma.listeningExercise.findMany({
        where: { title: contains },
        select: { title: true, slug: true, levelCode: true },
        take: 4,
      }),
      prisma.speakingActivity.findMany({
        where: { title: contains },
        select: { title: true, slug: true, levelCode: true },
        take: 4,
      }),
      prisma.writingTask.findMany({
        where: { title: contains },
        select: { title: true, slug: true, levelCode: true },
        take: 4,
      }),
      prisma.verb.findMany({
        where: { OR: [{ infinitive: contains }, { english: contains }] },
        select: { infinitive: true, english: true },
        take: 5,
      }),
      prisma.mockExam.findMany({
        where: { title: contains },
        select: { title: true, slug: true, provider: true, levelCode: true },
        take: 4,
      }),
      prisma.exercise.findMany({
        where: { title: contains },
        select: { title: true, slug: true, levelCode: true, skill: true },
        take: 4,
      }),
    ]);

  const results: SearchResult[] = [
    ...lessons.map((l) => ({
      type: "lesson",
      title: l.title,
      subtitle: `${l.module.levelCode} · ${l.module.title}`,
      href: `/lessons/${l.slug}`,
    })),
    ...grammar.map((g) => ({
      type: "grammar",
      title: g.title,
      subtitle: `${g.levelCode} · ${g.category}`,
      href: `/grammar/${g.slug}`,
    })),
    ...words.map((w) => ({
      type: "word",
      title: w.article ? `${w.article} ${w.german}` : w.german,
      subtitle: w.meaning,
      href: `/dictionary?q=${encodeURIComponent(w.german)}`,
    })),
    ...readings.map((r) => ({ type: "reading", title: r.title, subtitle: r.levelCode, href: `/reading/${r.slug}` })),
    ...listenings.map((l) => ({ type: "listening", title: l.title, subtitle: l.levelCode, href: `/listening/${l.slug}` })),
    ...speakings.map((s) => ({ type: "speaking", title: s.title, subtitle: s.levelCode, href: `/speaking/${s.slug}` })),
    ...writings.map((w) => ({ type: "writing", title: w.title, subtitle: w.levelCode, href: `/writing/${w.slug}` })),
    ...verbs.map((v) => ({ type: "verb", title: v.infinitive, subtitle: v.english, href: `/verbs/${v.infinitive}` })),
    ...exams.map((e) => ({
      type: "exam",
      title: e.title,
      subtitle: `${e.provider} · ${e.levelCode}`,
      href: `/exams/${e.slug}`,
    })),
    ...exercises.map((e) => ({
      type: "exercise",
      title: e.title,
      subtitle: `${e.levelCode} · ${e.skill.toLowerCase()}`,
      href: `/exercises/${e.slug}`,
    })),
  ];

  return NextResponse.json({ results: results.slice(0, 30) });
}
