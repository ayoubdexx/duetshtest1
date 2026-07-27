import Link from "next/link";
import { redirect } from "next/navigation";
import { Search, ChevronRight } from "lucide-react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { levelMeta, LEVELS } from "@/lib/levels";
import { PageHeader } from "@/components/app/page-header";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export const metadata = { title: "Verb Conjugation" };

export default async function VerbsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; level?: string; filter?: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const { q, level, filter } = await searchParams;
  const query = (q ?? "").trim().slice(0, 40);
  const activeLevel = level && LEVELS.includes(level.toUpperCase() as (typeof LEVELS)[number]) ? level.toUpperCase() : null;
  const activeFilter = filter === "irregular" || filter === "separable" ? filter : null;

  const verbs = await prisma.verb.findMany({
    where: {
      ...(query.length >= 1
        ? { OR: [{ infinitive: { contains: query, mode: "insensitive" } }, { english: { contains: query, mode: "insensitive" } }] }
        : {}),
      ...(activeLevel ? { levelCode: activeLevel } : {}),
      ...(activeFilter === "irregular" ? { isIrregular: true } : {}),
      ...(activeFilter === "separable" ? { isSeparable: true } : {}),
    },
    orderBy: { infinitive: "asc" },
    take: 200,
    select: { infinitive: true, english: true, levelCode: true, isIrregular: true, isSeparable: true, auxiliary: true, partizip2: true },
  });

  function filterHref(l: string | null, f: string | null) {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (l) params.set("level", l.toLowerCase());
    if (f) params.set("filter", f);
    const qs = params.toString();
    return qs ? `/verbs?${qs}` : "/verbs";
  }

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        title="Verb Conjugation"
        description="Complete conjugation tables — Präsens, Perfekt, Präteritum, Futur, Konjunktiv II, Imperativ and Passiv."
      />

      <form action="/verbs" method="GET" className="mb-4 flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input name="q" defaultValue={query} placeholder="Search a verb… e.g. gehen, to eat, anfangen" className="h-11 pl-10" />
        </div>
        <Button type="submit" className="h-11">
          Search
        </Button>
      </form>

      <div className="mb-6 flex flex-wrap gap-2">
        <Link href={filterHref(null, activeFilter)}>
          <Badge variant={activeLevel === null ? "default" : "secondary"} className="cursor-pointer px-3 py-1.5 text-xs">
            All levels
          </Badge>
        </Link>
        {LEVELS.map((code) => (
          <Link key={code} href={filterHref(code, activeFilter)}>
            <Badge
              variant="secondary"
              className={cn("cursor-pointer px-3 py-1.5 text-xs", activeLevel === code && `${levelMeta(code).color} border-transparent text-white`)}
            >
              {code}
            </Badge>
          </Link>
        ))}
        <span className="mx-1 hidden w-px bg-border sm:block" />
        <Link href={filterHref(activeLevel, activeFilter === "irregular" ? null : "irregular")}>
          <Badge variant={activeFilter === "irregular" ? "brand" : "secondary"} className="cursor-pointer px-3 py-1.5 text-xs">
            Irregular
          </Badge>
        </Link>
        <Link href={filterHref(activeLevel, activeFilter === "separable" ? null : "separable")}>
          <Badge variant={activeFilter === "separable" ? "brand" : "secondary"} className="cursor-pointer px-3 py-1.5 text-xs">
            Separable
          </Badge>
        </Link>
      </div>

      <div className="overflow-hidden rounded-2xl border">
        <div className="hidden grid-cols-[1fr_1fr_auto_auto] gap-4 border-b bg-secondary/60 px-4 py-2.5 text-xs font-semibold text-muted-foreground sm:grid">
          <span>Infinitiv</span>
          <span>Partizip II</span>
          <span>Hilfsverb</span>
          <span className="w-16 text-right">Level</span>
        </div>
        <div className="divide-y">
          {verbs.map((v) => (
            <Link
              key={v.infinitive}
              href={`/verbs/${encodeURIComponent(v.infinitive)}`}
              className="group grid grid-cols-1 gap-1 px-4 py-3 transition-colors hover:bg-accent/60 sm:grid-cols-[1fr_1fr_auto_auto] sm:items-center sm:gap-4"
            >
              <div className="flex items-center gap-2">
                <span className="font-semibold">{v.infinitive}</span>
                <span className="text-sm text-muted-foreground">{v.english}</span>
                {v.isIrregular && (
                  <Badge variant="brand" className="px-1.5 py-0 text-[9px]">
                    irr.
                  </Badge>
                )}
                {v.isSeparable && (
                  <Badge variant="outline" className="px-1.5 py-0 text-[9px]">
                    sep.
                  </Badge>
                )}
              </div>
              <span className="hidden text-sm text-muted-foreground sm:block">
                {v.auxiliary === "sein" ? "ist" : "hat"} {v.partizip2}
              </span>
              <span className="hidden text-sm text-muted-foreground sm:block">{v.auxiliary}</span>
              <span className="hidden w-16 items-center justify-end gap-1 sm:flex">
                <Badge variant="secondary" className="text-[10px]">
                  {v.levelCode}
                </Badge>
                <ChevronRight className="h-3.5 w-3.5 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          ))}
        </div>
        {verbs.length === 0 && <div className="p-10 text-center text-sm text-muted-foreground">No verbs found.</div>}
      </div>
    </div>
  );
}
