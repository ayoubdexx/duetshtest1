import Link from "next/link";
import { redirect } from "next/navigation";
import { Download, FileText, Layers, Printer } from "lucide-react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/app/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const metadata = { title: "Downloads" };

export default async function DownloadsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const [cardCount, grammarCount, vocabTopics, examCount] = await Promise.all([
    prisma.flashcard.count({ where: { userId: session.user.id } }),
    prisma.grammarTopic.count(),
    prisma.vocabTopic.count(),
    prisma.mockExam.count(),
  ]);

  const printCollections = [
    {
      emoji: "📖",
      title: "Grammar cheat sheets",
      desc: `${grammarCount} printable grammar topics with tables, rules and practice`,
      href: "/library",
      badge: "PDF Library",
    },
    {
      emoji: "📚",
      title: "Vocabulary lists",
      desc: `${vocabTopics} topic word lists with articles, plurals and examples`,
      href: "/library",
      badge: "PDF Library",
    },
    {
      emoji: "📋",
      title: "Practice tests & mock exams",
      desc: `${examCount} full exam papers in Goethe/TELC format with answer keys`,
      href: "/library",
      badge: "PDF Library",
    },
    {
      emoji: "🎓",
      title: "Complete lesson worksheets",
      desc: "Every lesson as a study guide: content, exercises, solutions and homework",
      href: "/library",
      badge: "PDF Library",
    },
  ];

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        title="Download Center"
        description="Take your learning offline — printable study materials and personal data exports."
      />

      {/* Personal exports */}
      <div className="section-label mb-2.5">Your data</div>
      <div className="mb-8 grid gap-4 sm:grid-cols-2">
        <Card>
          <CardContent className="p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 dark:bg-violet-900/40">
              <Layers className="h-5 w-5 text-violet-600 dark:text-violet-400" />
            </div>
            <div className="mt-3 font-semibold">Flashcards export</div>
            <p className="mt-1 text-sm text-muted-foreground">
              {cardCount} cards as CSV — import directly into Anki or Excel.
            </p>
            <a href="/api/export/flashcards" download className="mt-4 inline-block">
              <Button variant="outline" size="sm" disabled={cardCount === 0}>
                <Download className="h-3.5 w-3.5" /> Download CSV
              </Button>
            </a>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-100 dark:bg-sky-900/40">
              <FileText className="h-5 w-5 text-sky-600 dark:text-sky-400" />
            </div>
            <div className="mt-3 font-semibold">Study materials</div>
            <p className="mt-1 text-sm text-muted-foreground">
              All printables are in the PDF Library — open any item and "Save as PDF".
            </p>
            <Link href="/library" className="mt-4 inline-block">
              <Button variant="outline" size="sm">
                <Printer className="h-3.5 w-3.5" /> Open PDF Library
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Collections */}
      <div className="section-label mb-2.5">Printable collections</div>
      <div className="space-y-3">
        {printCollections.map((c) => (
          <Link key={c.title} href={c.href} className="group block">
            <div className="card-hover flex items-center gap-4 rounded-2xl border bg-card p-5 shadow-card">
              <span className="text-2xl">{c.emoji}</span>
              <div className="min-w-0 flex-1">
                <div className="font-semibold">{c.title}</div>
                <div className="text-sm text-muted-foreground">{c.desc}</div>
              </div>
              <Badge variant="secondary" className="shrink-0">
                {c.badge}
              </Badge>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-8 rounded-2xl border border-brand-200 bg-brand-50/50 p-4 text-sm leading-relaxed dark:border-brand-900 dark:bg-brand-950/30">
        🖨 <strong>Print tip:</strong> in the print dialog choose "Save as PDF", enable background graphics and set
        margins to "Default" for the best-looking documents.
      </div>
    </div>
  );
}
