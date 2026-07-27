import Link from "next/link";
import { redirect } from "next/navigation";
import { FileText, Printer } from "lucide-react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/app/page-header";
import { Badge } from "@/components/ui/badge";

export const metadata = { title: "PDF Library" };

interface PrintItem {
  title: string;
  subtitle: string;
  levelCode: string;
  href: string;
}

function Section({ title, emoji, items }: { title: string; emoji: string; items: PrintItem[] }) {
  if (items.length === 0) return null;
  return (
    <section>
      <div className="section-label mb-2.5">
        {emoji} {title}
        <Badge variant="secondary" className="ml-2 text-[10px]">
          {items.length}
        </Badge>
      </div>
      <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <Link key={item.href} href={item.href} target="_blank" className="group">
            <div className="card-hover flex items-center gap-3 rounded-xl border bg-card p-3.5">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary">
                <FileText className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-medium">{item.title}</div>
                <div className="truncate text-xs text-muted-foreground">{item.subtitle}</div>
              </div>
              <Badge variant="secondary" className="shrink-0 text-[10px]">
                {item.levelCode}
              </Badge>
              <Printer className="h-4 w-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default async function LibraryPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const [lessons, grammar, vocabTopics, readings, exams] = await Promise.all([
    prisma.lesson.findMany({
      where: { published: true },
      orderBy: [{ module: { level: { order: "asc" } } }, { module: { order: "asc" } }, { order: "asc" }],
      select: { slug: true, title: true, module: { select: { title: true, levelCode: true } } },
    }),
    prisma.grammarTopic.findMany({
      orderBy: [{ level: { order: "asc" } }, { order: "asc" }],
      select: { slug: true, title: true, category: true, levelCode: true },
    }),
    prisma.vocabTopic.findMany({
      orderBy: [{ level: { order: "asc" } }, { order: "asc" }],
      select: { slug: true, title: true, levelCode: true, _count: { select: { words: true } } },
    }),
    prisma.readingText.findMany({
      orderBy: [{ level: { order: "asc" } }, { order: "asc" }],
      select: { slug: true, title: true, levelCode: true, wordCount: true },
    }),
    prisma.mockExam.findMany({
      orderBy: { level: { order: "asc" } },
      select: { slug: true, title: true, provider: true, levelCode: true },
    }),
  ]);

  return (
    <div>
      <PageHeader
        title="PDF Library"
        description="Every lesson, grammar sheet, vocabulary list, reading and mock exam as a professionally formatted printable. Open → your browser's 'Save as PDF' does the rest."
      />

      <div className="space-y-10">
        <Section
          title="Lesson PDFs"
          emoji="🎓"
          items={lessons.map((l) => ({
            title: l.title,
            subtitle: l.module.title,
            levelCode: l.module.levelCode,
            href: `/print/lesson/${l.slug}`,
          }))}
        />
        <Section
          title="Grammar sheets"
          emoji="📖"
          items={grammar.map((g) => ({
            title: g.title,
            subtitle: g.category,
            levelCode: g.levelCode,
            href: `/print/grammar/${g.slug}`,
          }))}
        />
        <Section
          title="Vocabulary lists"
          emoji="📚"
          items={vocabTopics.map((t) => ({
            title: t.title,
            subtitle: `${t._count.words} words with articles & examples`,
            levelCode: t.levelCode,
            href: `/print/vocab/${t.slug}`,
          }))}
        />
        <Section
          title="Reading worksheets"
          emoji="📰"
          items={readings.map((r) => ({
            title: r.title,
            subtitle: `${r.wordCount} words + questions & solutions`,
            levelCode: r.levelCode,
            href: `/print/reading/${r.slug}`,
          }))}
        />
        <Section
          title="Mock exam papers"
          emoji="📋"
          items={exams.map((e) => ({
            title: e.title,
            subtitle: `${e.provider} format + answer key`,
            levelCode: e.levelCode,
            href: `/print/exam/${e.slug}`,
          }))}
        />
      </div>
    </div>
  );
}
