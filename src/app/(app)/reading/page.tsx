import Link from "next/link";
import { redirect } from "next/navigation";
import { BookOpenText, Clock } from "lucide-react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { levelMeta, LEVELS } from "@/lib/levels";
import { PageHeader } from "@/components/app/page-header";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export const metadata = { title: "Reading" };

export default async function ReadingPage({ searchParams }: { searchParams: Promise<{ level?: string }> }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const { level } = await searchParams;
  const activeLevel = level && LEVELS.includes(level.toUpperCase() as (typeof LEVELS)[number]) ? level.toUpperCase() : null;

  const readings = await prisma.readingText.findMany({
    where: activeLevel ? { levelCode: activeLevel } : undefined,
    orderBy: [{ level: { order: "asc" } }, { order: "asc" }],
    select: { slug: true, title: true, topic: true, levelCode: true, wordCount: true, intro: true },
  });

  return (
    <div>
      <PageHeader
        title="Reading Library"
        description="Texts written for your level — with glossaries, grammar highlights and comprehension questions."
      />

      <div className="mb-8 flex flex-wrap gap-2">
        <Link href="/reading">
          <Badge variant={activeLevel === null ? "default" : "secondary"} className="cursor-pointer px-3 py-1.5 text-xs">
            All levels
          </Badge>
        </Link>
        {LEVELS.map((code) => (
          <Link key={code} href={`/reading?level=${code.toLowerCase()}`}>
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
        {readings.map((r) => {
          const meta = levelMeta(r.levelCode);
          const minutes = Math.max(1, Math.round(r.wordCount / 120));
          return (
            <Link key={r.slug} href={`/reading/${r.slug}`} className="group">
              <div className="card-hover flex h-full flex-col rounded-2xl border bg-card p-5 shadow-card">
                <div className="flex items-center justify-between">
                  <Badge className={`${meta.color} border-transparent text-white`}>{r.levelCode}</Badge>
                  {r.topic && (
                    <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{r.topic}</span>
                  )}
                </div>
                <h3 className="mt-3 text-lg font-bold leading-snug tracking-tight">{r.title}</h3>
                {r.intro && <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">{r.intro}</p>}
                <div className="mt-auto flex items-center gap-3 pt-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <BookOpenText className="h-3.5 w-3.5" /> {r.wordCount} words
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" /> ~{minutes} min
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
      {readings.length === 0 && (
        <div className="rounded-2xl border p-10 text-center text-muted-foreground">No texts for this filter yet.</div>
      )}
    </div>
  );
}
