"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  AlarmClock,
  ArrowLeft,
  ArrowRight,
  Award,
  CheckCircle2,
  ChevronDown,
  Loader2,
  Send,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import { cn, seededShuffle } from "@/lib/utils";
import { isCorrect, correctAnswerLabel } from "@/lib/questions";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AudioPlayer } from "@/components/content/audio-player";
import { Recorder } from "@/components/speaking/recorder";
import type { ExamSection, ExerciseQuestion, McqQuestion, MatchQuestion, OrderQuestion } from "@/types/content";

export interface ExamDTO {
  id: string;
  slug: string;
  title: string;
  provider: string;
  levelCode: string;
  durationMin: number;
  passScore: number;
  sections: ExamSection[];
}

interface SubmitResult {
  attemptId: string;
  total: number;
  max: number;
  pct: number;
  passed: boolean;
  passScore: number;
  sectionScores: { id: string; title: string; skill: string; score: number; max: number }[];
  questionResults: Record<string, boolean>;
  writingEstimates: { partId: string; score: number; max: number; words: number; minWords: number; source: string }[];
  certificateSerial?: string | null;
}

type Phase = "intro" | "running" | "results";

function fmtTime(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function ExamRunner({ exam }: { exam: ExamDTO }) {
  const [phase, setPhase] = useState<Phase>("intro");
  const [sectionIdx, setSectionIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, unknown>>({});
  const [writing, setWriting] = useState<Record<string, string>>({});
  const [speaking, setSpeaking] = useState<Record<string, number>>({});
  const [secondsLeft, setSecondsLeft] = useState(exam.durationMin * 60);
  const [submitting, setSubmitting] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [result, setResult] = useState<SubmitResult | null>(null);
  const startRef = useRef<number>(0);

  const allQuestions = useMemo(
    () => exam.sections.flatMap((s) => s.parts.flatMap((p) => (p.questions ?? []) as ExerciseQuestion[])),
    [exam]
  );
  const writingParts = useMemo(
    () => exam.sections.flatMap((s) => s.parts.filter((p) => p.writing)),
    [exam]
  );
  const answeredCount =
    allQuestions.filter((q) => answers[q.id] !== undefined && answers[q.id] !== "").length +
    writingParts.filter((p) => (writing[p.id] ?? "").trim().length > 0).length;
  const totalItems = allQuestions.length + writingParts.length;

  const submit = useCallback(
    async (auto = false) => {
      if (submitting) return;
      setSubmitting(true);
      setConfirmOpen(false);
      if (auto) toast.warning("Zeit ist um! Your exam was submitted automatically.");
      try {
        const res = await fetch("/api/exams/attempt", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            examId: exam.id,
            answers,
            writing,
            speaking,
            durationUsedSec: Math.round((Date.now() - startRef.current) / 1000),
          }),
        });
        const json = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(json.error);
        setResult(json);
        setPhase("results");
        window.scrollTo({ top: 0 });
      } catch {
        toast.error("Could not submit — please try again.");
      } finally {
        setSubmitting(false);
      }
    },
    [answers, writing, speaking, exam.id, submitting]
  );

  // Countdown
  useEffect(() => {
    if (phase !== "running") return;
    const t = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(t);
          submit(true);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [phase, submit]);

  /* ─── Intro ─── */
  if (phase === "intro") {
    return (
      <div className="mx-auto max-w-2xl">
        <div className="rounded-3xl border bg-card p-8 text-center shadow-card">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-100 dark:bg-brand-900/50">
            <AlarmClock className="h-7 w-7 text-brand-600 dark:text-brand-400" />
          </div>
          <h1 className="mt-4 text-2xl font-bold tracking-tight">{exam.title}</h1>
          <p className="mt-2 text-muted-foreground">
            {exam.durationMin} minutes · {exam.sections.length} sections · pass mark {exam.passScore}%
          </p>

          <div className="mt-6 space-y-2 text-left">
            {exam.sections.map((s, i) => (
              <div key={s.id} className="flex items-center justify-between rounded-xl bg-secondary/50 px-4 py-2.5 text-sm">
                <span className="font-medium">
                  {i + 1}. {s.title}
                </span>
                <span className="text-xs text-muted-foreground">{s.durationMin} min</span>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50/70 p-4 text-left text-sm dark:border-amber-900 dark:bg-amber-950/40">
            <strong>Wie in der echten Prüfung:</strong> the timer runs across all sections and the exam auto-submits
            when time is up. Have paper ready for notes — and don't use a dictionary. Viel Erfolg! 🍀
          </div>

          <Button
            size="lg"
            className="mt-6 h-12 w-full text-base"
            onClick={() => {
              startRef.current = Date.now();
              setPhase("running");
            }}
          >
            Start exam
          </Button>
        </div>
      </div>
    );
  }

  /* ─── Results ─── */
  if (phase === "results" && result) {
    return <ExamResults exam={exam} result={result} answers={answers} writing={writing} />;
  }

  /* ─── Running ─── */
  const section = exam.sections[sectionIdx];
  const low = secondsLeft < 300;

  return (
    <div className="mx-auto max-w-3xl">
      {/* Sticky exam bar */}
      <div className="glass sticky top-16 z-10 -mx-4 mb-6 flex items-center gap-3 border-b px-4 py-3 sm:-mx-6 sm:px-6 lg:-mx-10 lg:px-10">
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-bold">{exam.title}</div>
          <div className="text-xs text-muted-foreground">
            {answeredCount}/{totalItems} answered
          </div>
        </div>
        <div
          className={cn(
            "flex items-center gap-1.5 rounded-xl border px-3 py-1.5 font-mono text-sm font-bold",
            low ? "animate-pulse border-rose-300 text-rose-600 dark:border-rose-800 dark:text-rose-400" : ""
          )}
        >
          <AlarmClock className="h-4 w-4" />
          {fmtTime(secondsLeft)}
        </div>
        <Button size="sm" onClick={() => setConfirmOpen(true)} disabled={submitting}>
          {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          Submit
        </Button>
      </div>

      {/* Section tabs */}
      <div className="mb-6 flex flex-wrap gap-2">
        {exam.sections.map((s, i) => (
          <button
            key={s.id}
            onClick={() => setSectionIdx(i)}
            className={cn(
              "rounded-xl border px-3.5 py-2 text-xs font-semibold transition-colors",
              i === sectionIdx ? "border-primary bg-primary text-primary-foreground" : "hover:bg-accent"
            )}
          >
            {i + 1}. {s.title}
          </button>
        ))}
      </div>

      <motion.div key={section.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        {section.intro && (
          <div className="rounded-2xl bg-secondary/50 px-5 py-4 text-sm leading-relaxed text-muted-foreground">
            {section.intro}
          </div>
        )}

        {section.parts.map((part) => (
          <div key={part.id} className="overflow-hidden rounded-2xl border bg-card shadow-card">
            <div className="border-b bg-secondary/40 px-5 py-3">
              <div className="text-sm font-bold">{part.title}</div>
              <div className="mt-0.5 text-xs text-muted-foreground">{part.instructions}</div>
            </div>
            <div className="space-y-5 p-5">
              {part.audioUrl && <AudioPlayer src={part.audioUrl} compact />}
              {part.passage && (
                <div className="max-h-80 overflow-y-auto whitespace-pre-line rounded-xl border bg-secondary/30 p-4 text-[15px] leading-7">
                  {part.passage}
                </div>
              )}

              {(part.questions as ExerciseQuestion[] | undefined)?.map((q, qi) => (
                <ExamQuestion
                  key={q.id}
                  q={q}
                  index={qi + 1}
                  value={answers[q.id]}
                  onChange={(v) => setAnswers((a) => ({ ...a, [q.id]: v }))}
                />
              ))}

              {part.writing && (
                <div>
                  <div className="mb-2 whitespace-pre-line rounded-xl border border-brand-200 bg-brand-50/50 p-4 text-sm dark:border-brand-900 dark:bg-brand-950/30">
                    {part.writing.prompt}
                  </div>
                  <Textarea
                    value={writing[part.id] ?? ""}
                    onChange={(e) => setWriting((w) => ({ ...w, [part.id]: e.target.value }))}
                    placeholder="Schreib deinen Text hier…"
                    className="min-h-[200px]"
                  />
                  <div className="mt-1.5 text-xs text-muted-foreground">
                    {(writing[part.id] ?? "").split(/\s+/).filter(Boolean).length} words · minimum{" "}
                    {part.writing.minWords} · {part.writing.points} points
                  </div>
                </div>
              )}

              {part.speaking && (
                <div className="space-y-4">
                  <div className="whitespace-pre-line rounded-xl border border-violet-200 bg-violet-50/50 p-4 text-sm dark:border-violet-900 dark:bg-violet-950/30">
                    {part.speaking.prompt}
                    {(part.speaking.prepMin || part.speaking.talkMin) && (
                      <div className="mt-2 text-xs text-muted-foreground">
                        {part.speaking.prepMin ? `Preparation: ${part.speaking.prepMin} min · ` : ""}
                        {part.speaking.talkMin ? `Speaking time: ${part.speaking.talkMin} min` : ""}
                      </div>
                    )}
                  </div>
                  <Recorder />
                  <div>
                    <div className="mb-1.5 text-xs font-semibold text-muted-foreground">
                      Self-assessment: how well did you handle this task? ({speaking[part.id] ?? 0}%)
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      step={5}
                      value={speaking[part.id] ?? 0}
                      onChange={(e) => setSpeaking((s) => ({ ...s, [part.id]: Number(e.target.value) }))}
                      className="w-full accent-brand-500"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={() => setSectionIdx((i) => Math.max(0, i - 1))} disabled={sectionIdx === 0}>
            <ArrowLeft className="h-4 w-4" /> Previous
          </Button>
          {sectionIdx < exam.sections.length - 1 ? (
            <Button onClick={() => setSectionIdx((i) => i + 1)}>
              Next section <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={() => setConfirmOpen(true)}>
              <Send className="h-4 w-4" /> Finish exam
            </Button>
          )}
        </div>
      </motion.div>

      {/* Confirm dialog */}
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Submit your exam?</DialogTitle>
            <DialogDescription>
              You've answered {answeredCount} of {totalItems} items
              {answeredCount < totalItems ? ` — ${totalItems - answeredCount} still open.` : "."} Once submitted, the
              exam is scored immediately.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>
              Keep working
            </Button>
            <Button onClick={() => submit()} disabled={submitting}>
              {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
              Submit now
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* ─── Question renderers (exam mode: no instant feedback) ─── */

function ExamQuestion({
  q,
  index,
  value,
  onChange,
}: {
  q: ExerciseQuestion;
  index: number;
  value: unknown;
  onChange: (v: unknown) => void;
}) {
  return (
    <div>
      <div className="mb-2 flex items-start gap-2.5">
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-bold text-muted-foreground">
          {index}
        </span>
        {q.type !== "gap" ? (
          <p className="pt-0.5 text-[15px] font-medium leading-relaxed">{q.prompt}</p>
        ) : (
          <GapInline q={q} value={(value as string) ?? ""} onChange={onChange} />
        )}
      </div>
      <div className="pl-9">
        {q.type === "mcq" && <McqInline q={q} selected={value as number | undefined} onSelect={onChange} />}
        {q.type === "order" && <OrderInline q={q} value={(value as string[]) ?? []} onChange={onChange} />}
        {q.type === "match" && <MatchInline q={q} value={(value as Record<string, string>) ?? {}} onChange={onChange} />}
      </div>
    </div>
  );
}

function McqInline({ q, selected, onSelect }: { q: McqQuestion; selected?: number; onSelect: (v: number) => void }) {
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {q.options.map((opt, i) => (
        <button
          key={i}
          type="button"
          onClick={() => onSelect(i)}
          className={cn(
            "rounded-xl border px-3.5 py-2.5 text-left text-sm font-medium transition-all",
            selected === i ? "border-primary bg-primary text-primary-foreground shadow-sm" : "hover:border-primary/40 hover:bg-accent"
          )}
        >
          <span className="mr-2 text-xs font-bold opacity-60">{String.fromCharCode(65 + i)}</span>
          {opt}
        </button>
      ))}
    </div>
  );
}

function GapInline({ q, value, onChange }: { q: ExerciseQuestion & { type: "gap" }; value: string; onChange: (v: string) => void }) {
  const parts = q.prompt.split("___");
  return (
    <div className="flex-1 pt-0.5 text-[15px] font-medium leading-loose">
      {parts.map((part, i) => (
        <span key={i}>
          {part}
          {i < parts.length - 1 && (
            <input
              type="text"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              size={Math.max(6, (q.answers[0]?.length ?? 8) + 2)}
              className="mx-1 inline-block rounded-lg border-b-2 border-dashed bg-secondary/50 px-2.5 py-0.5 text-center font-semibold outline-none focus:border-solid focus:border-brand-500"
            />
          )}
        </span>
      ))}
    </div>
  );
}

function OrderInline({ q, value, onChange }: { q: OrderQuestion; value: string[]; onChange: (v: string[]) => void }) {
  const shuffled = useMemo(() => seededShuffle(q.fragments, q.id), [q]);
  const used = new Map<string, number>();
  for (const v of value) used.set(v, (used.get(v) ?? 0) + 1);
  const seen = new Map<string, number>();
  const remaining = shuffled.filter((f) => {
    const idx = seen.get(f) ?? 0;
    seen.set(f, idx + 1);
    return idx >= (used.get(f) ?? 0);
  });
  return (
    <div className="space-y-2.5">
      <div className="flex min-h-[48px] flex-wrap items-center gap-2 rounded-xl border-2 border-dashed p-2.5">
        {value.map((frag, i) => (
          <button
            key={`${frag}-${i}`}
            type="button"
            onClick={() => onChange(value.filter((_, idx) => idx !== i))}
            className="rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground"
          >
            {frag}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        {remaining.map((frag, i) => (
          <button
            key={`${frag}-${i}`}
            type="button"
            onClick={() => onChange([...value, frag])}
            className="rounded-lg border bg-card px-3 py-1.5 text-sm font-medium shadow-sm hover:bg-accent"
          >
            {frag}
          </button>
        ))}
      </div>
    </div>
  );
}

function MatchInline({ q, value, onChange }: { q: MatchQuestion; value: Record<string, string>; onChange: (v: Record<string, string>) => void }) {
  const rights = useMemo(() => seededShuffle(q.pairs.map((p) => p.right), q.id), [q]);
  return (
    <div className="space-y-2">
      {q.pairs.map((pair) => (
        <div key={pair.left} className="flex items-center gap-3">
          <span className="w-2/5 truncate rounded-xl bg-secondary/70 px-3.5 py-2 text-sm font-medium">{pair.left}</span>
          <span className="text-muted-foreground">→</span>
          <select
            value={value[pair.left] ?? ""}
            onChange={(e) => onChange({ ...value, [pair.left]: e.target.value })}
            className="h-10 flex-1 rounded-xl border bg-background px-3 text-sm font-medium shadow-sm outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="" disabled>
              Choose…
            </option>
            {rights.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>
      ))}
    </div>
  );
}

/* ─── Results view ─── */

function ExamResults({
  exam,
  result,
  answers,
  writing,
}: {
  exam: ExamDTO;
  result: SubmitResult;
  answers: Record<string, unknown>;
  writing: Record<string, string>;
}) {
  const [reviewOpen, setReviewOpen] = useState<string | null>(null);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Score card */}
      <div className="rounded-3xl border bg-card p-8 text-center shadow-card">
        <div
          className={cn(
            "mx-auto flex h-24 w-24 items-center justify-center rounded-full text-2xl font-bold text-white",
            result.passed ? "bg-emerald-500" : "bg-rose-500"
          )}
        >
          {result.pct}%
        </div>
        <h1 className="mt-4 text-2xl font-bold tracking-tight">
          {result.passed ? "Bestanden! You passed! 🎉" : "Noch nicht bestanden"}
        </h1>
        <p className="mt-1.5 text-muted-foreground">
          {result.total}/{result.max} points · pass mark {result.passScore}% ·{" "}
          {result.passed
            ? "You're ready for the real thing."
            : "Review your answers below — every mistake here is one you won't make in the real exam."}
        </p>
        {result.certificateSerial && (
          <div className="mx-auto mt-4 flex max-w-sm items-center gap-3 rounded-2xl border border-brand-300 bg-brand-50 p-4 text-left dark:border-brand-800 dark:bg-brand-950/50">
            <Award className="h-8 w-8 shrink-0 text-brand-600 dark:text-brand-400" />
            <div>
              <div className="text-sm font-bold">Level certificate earned!</div>
              <div className="text-xs text-muted-foreground">
                {exam.levelCode} · Serial {result.certificateSerial} — view it under Achievements.
              </div>
            </div>
          </div>
        )}
        <div className="mt-6 flex justify-center gap-3">
          <Link href={`/exams/${exam.slug}`}>
            <Button variant="outline">Exam overview</Button>
          </Link>
          <Link href="/exams">
            <Button>All mock exams</Button>
          </Link>
        </div>
      </div>

      {/* Section breakdown */}
      <div className="rounded-2xl border bg-card p-5 shadow-card">
        <div className="section-label mb-4">Section results</div>
        <div className="space-y-4">
          {result.sectionScores.map((s) => {
            const pct = s.max > 0 ? Math.round((s.score / s.max) * 100) : 0;
            return (
              <div key={s.id}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="font-medium">{s.title}</span>
                  <span className="text-muted-foreground">
                    {s.score}/{s.max} ({pct}%)
                  </span>
                </div>
                <Progress value={pct} className="h-2" indicatorClassName={pct >= exam.passScore ? "bg-emerald-500" : "bg-rose-400"} />
              </div>
            );
          })}
        </div>
        {result.writingEstimates.length > 0 && (
          <p className="mt-4 text-xs text-muted-foreground">
            ✍️ Writing scores are {result.writingEstimates.some((w) => w.source === "ai") ? "AI-graded" : "estimated from length, structure and connectors"} — in the real exam, trained
            examiners grade against the official criteria.
          </p>
        )}
      </div>

      {/* Detailed review */}
      <div className="space-y-3">
        <div className="section-label">Review your answers</div>
        {exam.sections.map((section) => (
          <div key={section.id} className="overflow-hidden rounded-2xl border bg-card shadow-card">
            <button
              onClick={() => setReviewOpen(reviewOpen === section.id ? null : section.id)}
              className="flex w-full items-center justify-between px-5 py-3.5 text-sm font-bold"
            >
              {section.title}
              <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform", reviewOpen === section.id && "rotate-180")} />
            </button>
            {reviewOpen === section.id && (
              <div className="divide-y border-t">
                {section.parts.map((part) => (
                  <div key={part.id} className="space-y-4 p-5">
                    <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{part.title}</div>
                    {(part.questions as ExerciseQuestion[] | undefined)?.map((q, qi) => {
                      const ok = result.questionResults[q.id];
                      return (
                        <div key={q.id} className="text-sm">
                          <div className="flex items-start gap-2">
                            {ok ? (
                              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                            ) : (
                              <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-500" />
                            )}
                            <div>
                              <span className="font-medium">
                                {qi + 1}. {q.prompt}
                              </span>
                              {!ok && (
                                <div className="mt-1 text-emerald-700 dark:text-emerald-400">
                                  Richtig: {correctAnswerLabel(q)}
                                </div>
                              )}
                              {q.explanation && <div className="mt-1 text-xs text-muted-foreground">💡 {q.explanation}</div>}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    {part.writing && (
                      <div className="text-sm">
                        {(() => {
                          const est = result.writingEstimates.find((w) => w.partId === part.id);
                          return (
                            <div className="rounded-xl bg-secondary/40 p-4">
                              <div className="flex items-center justify-between">
                                <span className="font-semibold">Your text ({est?.words ?? 0} words)</span>
                                {est && (
                                  <Badge variant={est.score / est.max >= 0.6 ? "success" : "secondary"}>
                                    {est.score}/{est.max} points
                                  </Badge>
                                )}
                              </div>
                              <p className="mt-2 line-clamp-4 whitespace-pre-line text-muted-foreground">
                                {writing[part.id] || "(empty)"}
                              </p>
                              {part.writing.sample && (
                                <div className="mt-3 border-t pt-3">
                                  <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                    Musterlösung
                                  </div>
                                  <p className="mt-1 whitespace-pre-line text-foreground/85">{part.writing.sample}</p>
                                </div>
                              )}
                            </div>
                          );
                        })()}
                      </div>
                    )}
                    {part.speaking?.sample && (
                      <div className="rounded-xl bg-secondary/40 p-4 text-sm">
                        <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                          Beispielantwort · Model answer
                        </div>
                        <p className="mt-1 whitespace-pre-line text-foreground/85">{part.speaking.sample}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
