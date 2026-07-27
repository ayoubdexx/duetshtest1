import Link from "next/link";
import { redirect } from "next/navigation";
import { Headphones, Play } from "lucide-react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { levelMeta, LEVELS } from "@/lib/levels";
import { PageHeader } from "@/components/app/page-header";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export const metadata = { title: "Listening" };

export default async function ListeningPage({ searchParams }: { searchParams: Promise<{ level?: string }> }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const { level } = await searchParams;
  const activeLevel = level && LEVELS.includes(level.toUpperCase() as (typeof LEVELS)[number]) ? level.toUpperCase() : null;

  const items = await prisma.listeningExercise.findMany({
    where: activeLevel ? { levelCode: activeLevel } : undefined,
    orderBy: [{ level: { order: "asc" } }, { order: "asc" }],
    select: { slug: true, title: true, description: true, levelCode: true, durationSec: true },
  });

  return (
    <div>
      <PageHeader
        title="Listening Studio"
        description="Real dialogues and announcements with transcripts, adjustable playback speed and comprehension questions."
      />

      <div className="mb-8 flex flex-wrap gap-2">
        <Link href="/listening">
          <Badge variant={activeLevel === null ? "default" : "secondary"} className="cursor-pointer px-3 py-1.5 text-xs">
            All levels
          </Badge>
        </Link>
        {LEVELS.map((code) => (
          <Link key={code} href={`/listening?level=${code.toLowerCase()}`}>
            <Badge
              variant="secondary"
              className={cn("cursor-pointer px-3 py-1.5 text-xs", activeLevel === code && `${levelMeta(code).color} border-transparent text-white`)}
            >
              {code}
            </Badge>
          </Link>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {items.map((item) => {
          const meta = levelMeta(item.levelCode);
          const min = Math.floor(item.durationSec / 60);
          const sec = item.durationSec % 60;
          return (
            <Link key={item.slug} href={`/listening/${item.slug}`} className="group">
              <div className="card-hover flex h-full items-center gap-4 rounded-2xl border bg-card p-5 shadow-card">
                <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                  <Headphones className="h-6 w-6 transition-opacity group-hover:opacity-0" />
                  <Play className="absolute h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="truncate font-semibold">{item.title}</h3>
                  {item.description && <p className="mt-0.5 line-clamp-1 text-sm text-muted-foreground">{item.description}</p>}
                  <div className="mt-2 flex items-center gap-2">
                    <Badge className={`${meta.color} border-transparent text-white`}>{item.levelCode}</Badge>
                    {item.durationSec > 0 && (
                      <span className="text-xs text-muted-foreground">
                        {min}:{sec.toString().padStart(2, "0")}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
      {items.length === 0 && (
        <div className="rounded-2xl border p-10 text-center text-muted-foreground">No listening exercises for this filter yet.</div>
      )}
    </div>
  );
}
