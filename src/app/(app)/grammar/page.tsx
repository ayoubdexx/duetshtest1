import Link from "next/link";
import { redirect } from "next/navigation";
import { ChevronRight, FileText } from "lucide-react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { levelMeta, LEVELS } from "@/lib/levels";
import { PageHeader } from "@/components/app/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata = { title: "Grammar" };

export default async function GrammarPage({ searchParams }: { searchParams: Promise<{ level?: string }> }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const { level } = await searchParams;
  const activeLevel = level && LEVELS.includes(level.toUpperCase() as (typeof LEVELS)[number]) ? level.toUpperCase() : null;

  const topics = await prisma.grammarTopic.findMany({
    where: activeLevel ? { levelCode: activeLevel } : undefined,
    orderBy: [{ level: { order: "asc" } }, { order: "asc" }],
    select: { slug: true, title: true, levelCode: true, category: true, summary: true },
  });

  // Group by level, then category
  const byLevel = new Map<string, Map<string, typeof topics>>();
  for (const t of topics) {
    if (!byLevel.has(t.levelCode)) byLevel.set(t.levelCode, new Map());
    const cats = byLevel.get(t.levelCode)!;
    if (!cats.has(t.category)) cats.set(t.category, []);
    cats.get(t.category)!.push(t);
  }

  return (
    <div>
      <PageHeader
        title="Grammar"
        description="Every grammar topic from A1 to B2 — clear explanations, tables, examples, common mistakes and practice."
      >
        <Link href="/library?category=Grammar" className="hidden sm:block">
          <Button variant="outline">
            <FileText className="h-4 w-4" /> Cheat sheets
          </Button>
        </Link>
      </PageHeader>

      {/* Level filter */}
      <div className="mb-8 flex flex-wrap gap-2">
        <Link href="/grammar">
          <Badge variant={activeLevel === null ? "default" : "secondary"} className="cursor-pointer px-3 py-1.5 text-xs">
            All levels
          </Badge>
        </Link>
        {LEVELS.map((code) => {
          const meta = levelMeta(code);
          return (
            <Link key={code} href={`/grammar?level=${code.toLowerCase()}`}>
              <Badge
                variant="secondary"
                className={cn(
                  "cursor-pointer px-3 py-1.5 text-xs",
                  activeLevel === code && `${meta.color} border-transparent text-white`
                )}
              >
                {code}
              </Badge>
            </Link>
          );
        })}
      </div>

      <div className="space-y-10">
        {[...byLevel.entries()].map(([levelCode, categories]) => {
          const meta = levelMeta(levelCode);
          return (
            <section key={levelCode}>
              <div className="mb-4 flex items-center gap-3">
                <span className={`flex h-9 w-9 items-center justify-center rounded-lg text-sm font-bold text-white ${meta.color}`}>
                  {levelCode}
                </span>
                <h2 className="text-lg font-bold tracking-tight">{meta.title}</h2>
              </div>

              <div className="space-y-6">
                {[...categories.entries()].map(([category, items]) => (
                  <div key={category}>
                    <div className="section-label mb-2.5">{category}</div>
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {items.map((topic) => (
                        <Link key={topic.slug} href={`/grammar/${topic.slug}`} className="group">
                          <div className="card-hover flex h-full flex-col rounded-2xl border bg-card p-4.5 p-5 shadow-card">
                            <div className="flex items-start justify-between gap-2">
                              <h3 className="font-semibold leading-snug">{topic.title}</h3>
                              <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                            </div>
                            <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">{topic.summary}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          );
        })}
        {topics.length === 0 && (
          <div className="rounded-2xl border p-10 text-center text-muted-foreground">No grammar topics found.</div>
        )}
      </div>
    </div>
  );
}
