import Link from "next/link";
import { AlarmClock, ArrowRight, ClipboardCheck, PenLine, Mic } from "lucide-react";
import type { ExamFormatInfo } from "@/lib/exam-info";
import { EXAM_STRATEGIES } from "@/lib/exam-info";
import { levelMeta, LEVELS } from "@/lib/levels";
import { PageHeader } from "@/components/app/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface ExamLink {
  slug: string;
  title: string;
  levelCode: string;
  durationMin: number;
}

interface Props {
  providerLabel: string;
  title: string;
  description: string;
  info: Record<string, ExamFormatInfo>;
  exams: ExamLink[];
}

export function ExamProviderHub({ providerLabel, title, description, info, exams }: Props) {
  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader title={title} description={description}>
        <Link href="/exams">
          <Button>
            <ClipboardCheck className="h-4 w-4" /> Mock exams
          </Button>
        </Link>
      </PageHeader>

      {/* Format per level */}
      <div className="mb-10">
        <h2 className="mb-4 text-lg font-bold tracking-tight">Prüfungsformat · Exam format by level</h2>
        <Accordion type="single" collapsible className="space-y-3">
          {LEVELS.map((code) => {
            const meta = levelMeta(code);
            const fi = info[code];
            if (!fi) return null;
            return (
              <AccordionItem key={code} value={code} className="overflow-hidden rounded-2xl border bg-card px-5 shadow-card">
                <AccordionTrigger className="hover:no-underline">
                  <span className="flex items-center gap-3">
                    <span className={`flex h-9 w-9 items-center justify-center rounded-lg text-sm font-bold text-white ${meta.color}`}>
                      {code}
                    </span>
                    <span className="text-left">
                      <span className="block font-bold">{fi.name}</span>
                      <span className="block text-xs font-normal text-muted-foreground">Pass: {fi.passing}</span>
                    </span>
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="overflow-hidden rounded-xl border">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-secondary/60 text-left">
                          <th className="px-4 py-2 font-semibold">Teil</th>
                          <th className="hidden px-4 py-2 font-semibold sm:table-cell">Aufgaben</th>
                          <th className="w-20 px-4 py-2 text-right font-semibold">Zeit</th>
                        </tr>
                      </thead>
                      <tbody>
                        {fi.sections.map((s) => (
                          <tr key={s.name} className="border-t align-top">
                            <td className="px-4 py-2.5 font-medium">{s.name}</td>
                            <td className="hidden px-4 py-2.5 text-muted-foreground sm:table-cell">{s.tasks}</td>
                            <td className="px-4 py-2.5 text-right text-muted-foreground">
                              <span className="inline-flex items-center gap-1">
                                <AlarmClock className="h-3 w-3" /> {s.durationMin}′
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {fi.note && <p className="mt-3 text-xs text-muted-foreground">ℹ️ {fi.note}</p>}
                  {(() => {
                    const exam = exams.find((e) => e.levelCode === code);
                    return exam ? (
                      <Link href={`/exams/${exam.slug}`} className="mt-4 inline-block">
                        <Button size="sm">
                          Take the {code} mock exam <ArrowRight className="h-3.5 w-3.5" />
                        </Button>
                      </Link>
                    ) : null;
                  })()}
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </div>

      {/* Strategies */}
      <div className="mb-10">
        <h2 className="mb-4 text-lg font-bold tracking-tight">Prüfungsstrategien · Strategies that win points</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {EXAM_STRATEGIES.map((s) => (
            <div key={s.skill} className="rounded-2xl border bg-card p-5 shadow-card">
              <div className="mb-2.5 text-sm font-bold">
                {s.emoji} {s.title}
              </div>
              <ul className="space-y-1.5">
                {s.tips.map((t, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-foreground/85">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-400" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Next steps */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Link href="/writing" className="group">
          <div className="card-hover flex items-center gap-4 rounded-2xl border bg-card p-5 shadow-card">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-100 text-teal-600 dark:bg-teal-900/40 dark:text-teal-400">
              <PenLine className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <div className="font-semibold">Writing templates & practice</div>
              <div className="text-sm text-muted-foreground">Exam-format tasks with instant feedback</div>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
          </div>
        </Link>
        <Link href="/speaking" className="group">
          <div className="card-hover flex items-center gap-4 rounded-2xl border bg-card p-5 shadow-card">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400">
              <Mic className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <div className="font-semibold">Speaking simulations</div>
              <div className="text-sm text-muted-foreground">Roleplays and presentation practice</div>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
          </div>
        </Link>
      </div>

      <p className="mt-8 text-center text-xs text-muted-foreground">
        {providerLabel} format details are guide values — always confirm with your local exam center.
      </p>
    </div>
  );
}
