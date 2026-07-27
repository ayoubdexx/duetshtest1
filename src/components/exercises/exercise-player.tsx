"use client";

import { useMemo, useState } from "react";
import { Check, X, RefreshCw, Sparkles, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { cn, seededShuffle } from "@/lib/utils";
import { isCorrect, correctAnswerLabel } from "@/lib/questions";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { ExerciseQuestion, McqQuestion, GapQuestion, OrderQuestion, MatchQuestion } from "@/types/content";

export interface ExerciseDTO {
  id: string;
  slug: string;
  title: string;
  type: string;
  skill: string;
  instructions?: string | null;
  xpReward: number;
  questions: unknown;
}

type AnswerState = Record<string, unknown>;

export interface ActivityMeta {
  kind: "READING" | "LISTENING" | "SPEAKING" | "PRONUNCIATION" | "GRAMMAR" | "VOCABULARY" | "EXAM";
  refId: string;
}

export function ExercisePlayer({
  exercise,
  embedded = false,
  onComplete,
  activity,
}: {
  exercise: ExerciseDTO;
  embedded?: boolean;
  onComplete?: (pct: number) => void;
  /** When the questions are not a stored Exercise (reading/listening comprehension), score via the generic activity API */
  activity?: ActivityMeta;
}) {
  const questions = exercise.questions as ExerciseQuestion[];
  const [answers, setAnswers] = useState<AnswerState>({});
  const [submitted, setSubmitted] = useState(false);
  const [xpEarned, setXpEarned] = useState<number | null>(null);

  const results = useMemo(() => {
    if (!submitted) return {};
    const r: Record<string, boolean> = {};
    for (const q of questions) r[q.id] = isCorrect(q, answers[q.id]);
    return r;
  }, [submitted, questions, answers]);

  const correct = Object.values(results).filter(Boolean).length;
  const total = questions.length;
  const answeredCount = questions.filter((q) => {
    const a = answers[q.id];
    if (a === undefined || a === null) return false;
    if (q.type === "gap") return typeof a === "string" && a.trim().length > 0;
    if (q.type === "order") return Array.isArray(a) && a.length === q.fragments.length;
    if (q.type === "match") return typeof a === "object" && Object.keys(a as object).length === q.pairs.length;
    return true;
  }).length;

  async function submit() {
    setSubmitted(true);
    const correctNow = questions.filter((q) => isCorrect(q, answers[q.id])).length;
    const pct = total > 0 ? correctNow / total : 0;
    onComplete?.(pct * 100);
    try {
      const res = exercise.id
        ? await fetch("/api/attempts", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ exerciseId: exercise.id, correct: correctNow, total }),
          })
        : activity
          ? await fetch("/api/activity", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ kind: activity.kind, refId: activity.refId, correct: correctNow, total }),
            })
          : null;
      if (res?.ok) {
        const json = await res.json();
        setXpEarned(json.xpEarned ?? 0);
        if (json.xpEarned > 0) toast.success(`+${json.xpEarned} XP`, { icon: "✨" });
      }
    } catch {
      /* attempt recording is best-effort */
    }
  }

  function reset() {
    setAnswers({});
    setSubmitted(false);
    setXpEarned(null);
  }

  const pct = total > 0 ? Math.round((correct / total) * 100) : 0;

  return (
    <div className={cn("overflow-hidden rounded-2xl border bg-card", !embedded && "shadow-card")}>
      <div className="flex items-center justify-between gap-3 border-b bg-secondary/50 px-5 py-3.5">
        <div className="flex items-center gap-2.5">
          <span className="text-lg">✏️</span>
          <div>
            <div className="text-sm font-bold">{exercise.title}</div>
            {exercise.instructions && <div className="text-xs text-muted-foreground">{exercise.instructions}</div>}
          </div>
        </div>
        <Badge variant="secondary" className="shrink-0">
          {answeredCount}/{total}
        </Badge>
      </div>

      <div className="divide-y">
        {questions.map((q, qi) => (
          <div key={q.id} className="p-5">
            <div className="mb-3 flex items-start gap-2.5">
              <span
                className={cn(
                  "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                  submitted
                    ? results[q.id]
                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300"
                      : "bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-300"
                    : "bg-secondary text-muted-foreground"
                )}
              >
                {submitted ? (results[q.id] ? <Check className="h-3.5 w-3.5" /> : <X className="h-3.5 w-3.5" />) : qi + 1}
              </span>
              {q.type !== "gap" && <p className="pt-0.5 text-[15px] font-medium leading-relaxed">{q.prompt}</p>}
              {q.type === "gap" && (
                <GapPrompt
                  q={q}
                  value={(answers[q.id] as string) ?? ""}
                  disabled={submitted}
                  onChange={(v) => setAnswers((a) => ({ ...a, [q.id]: v }))}
                  correct={submitted ? results[q.id] : undefined}
                />
              )}
            </div>

            <div className="pl-9">
              {q.type === "mcq" && (
                <McqOptions
                  q={q}
                  selected={answers[q.id] as number | undefined}
                  submitted={submitted}
                  onSelect={(i) => setAnswers((a) => ({ ...a, [q.id]: i }))}
                />
              )}
              {q.type === "order" && (
                <OrderBuilder
                  q={q}
                  value={(answers[q.id] as string[]) ?? []}
                  submitted={submitted}
                  onChange={(v) => setAnswers((a) => ({ ...a, [q.id]: v }))}
                />
              )}
              {q.type === "match" && (
                <MatchGrid
                  q={q}
                  value={(answers[q.id] as Record<string, string>) ?? {}}
                  submitted={submitted}
                  onChange={(v) => setAnswers((a) => ({ ...a, [q.id]: v }))}
                />
              )}

              {submitted && !results[q.id] && (
                <div className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50/70 px-3.5 py-2.5 text-sm dark:border-emerald-900 dark:bg-emerald-950/40">
                  <span className="font-semibold text-emerald-700 dark:text-emerald-300">Richtig: </span>
                  {correctAnswerLabel(q)}
                </div>
              )}
              {submitted && q.explanation && (
                <div className="mt-2 rounded-xl bg-secondary/60 px-3.5 py-2.5 text-sm text-muted-foreground">
                  💡 {q.explanation}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="border-t bg-secondary/30 px-5 py-4">
        {!submitted ? (
          <div className="flex items-center justify-between gap-3">
            <span className="text-xs text-muted-foreground">
              {answeredCount < total ? `${total - answeredCount} question${total - answeredCount === 1 ? "" : "s"} left` : "All answered — check your work!"}
            </span>
            <Button onClick={submit} disabled={answeredCount < total}>
              Check answers <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{pct === 100 ? "🎉" : pct >= 70 ? "💪" : pct >= 40 ? "🙂" : "📚"}</span>
              <div>
                <div className="font-bold">
                  {correct}/{total} correct · {pct}%
                </div>
                <div className="text-xs text-muted-foreground">
                  {pct === 100 ? "Perfekt! Flawless round." : pct >= 70 ? "Sehr gut! Almost there." : "Weiter so — review and try again."}
                  {xpEarned !== null && xpEarned > 0 && (
                    <span className="ml-1.5 font-semibold text-brand-600 dark:text-brand-400">
                      <Sparkles className="mb-0.5 inline h-3 w-3" /> +{xpEarned} XP
                    </span>
                  )}
                </div>
              </div>
            </div>
            <Button variant="outline" onClick={reset}>
              <RefreshCw className="h-4 w-4" /> Try again
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Question type components ── */

function McqOptions({
  q,
  selected,
  submitted,
  onSelect,
}: {
  q: McqQuestion;
  selected?: number;
  submitted: boolean;
  onSelect: (i: number) => void;
}) {
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {q.options.map((opt, i) => {
        const isSelected = selected === i;
        const isAnswer = i === q.answerIndex;
        return (
          <button
            key={i}
            type="button"
            disabled={submitted}
            onClick={() => onSelect(i)}
            className={cn(
              "rounded-xl border px-3.5 py-2.5 text-left text-sm font-medium transition-all",
              !submitted && isSelected && "border-primary bg-primary text-primary-foreground shadow-sm",
              !submitted && !isSelected && "hover:border-primary/40 hover:bg-accent",
              submitted && isAnswer && "border-emerald-400 bg-emerald-50 text-emerald-900 dark:border-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-200",
              submitted && isSelected && !isAnswer && "border-rose-400 bg-rose-50 text-rose-900 dark:border-rose-700 dark:bg-rose-950/50 dark:text-rose-200",
              submitted && !isSelected && !isAnswer && "opacity-50"
            )}
          >
            <span className="mr-2 text-xs font-bold text-muted-foreground">{String.fromCharCode(65 + i)}</span>
            {opt}
          </button>
        );
      })}
    </div>
  );
}

function GapPrompt({
  q,
  value,
  disabled,
  onChange,
  correct,
}: {
  q: GapQuestion;
  value: string;
  disabled: boolean;
  onChange: (v: string) => void;
  correct?: boolean;
}) {
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
              disabled={disabled}
              onChange={(e) => onChange(e.target.value)}
              placeholder={q.hint ?? "…"}
              size={Math.max(6, (q.answers[0]?.length ?? 8) + 2)}
              className={cn(
                "mx-1 inline-block rounded-lg border-b-2 border-dashed bg-secondary/50 px-2.5 py-0.5 text-center font-semibold outline-none transition-colors focus:border-solid focus:border-brand-500",
                correct === true && "border-solid border-emerald-500 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-200",
                correct === false && "border-solid border-rose-500 bg-rose-50 text-rose-800 dark:bg-rose-950/50 dark:text-rose-200"
              )}
            />
          )}
        </span>
      ))}
    </div>
  );
}

function OrderBuilder({
  q,
  value,
  submitted,
  onChange,
}: {
  q: OrderQuestion;
  value: string[];
  submitted: boolean;
  onChange: (v: string[]) => void;
}) {
  const shuffled = useMemo(() => seededShuffle(q.fragments, q.id), [q]);
  const remaining = shuffled.filter((f) => {
    const usedCount = value.filter((v) => v === f).length;
    const totalCount = shuffled.filter((s) => s === f).length;
    const shownBefore = shuffled.slice(0, shuffled.indexOf(f)).filter((s) => s === f).length;
    return usedCount <= shownBefore && usedCount < totalCount;
  });

  return (
    <div className="space-y-3">
      <div
        className={cn(
          "flex min-h-[52px] flex-wrap items-center gap-2 rounded-xl border-2 border-dashed p-2.5",
          value.length === 0 && "justify-center text-xs text-muted-foreground"
        )}
      >
        {value.length === 0 && !submitted && "Tap the words below in the correct order"}
        {value.map((frag, i) => (
          <button
            key={`${frag}-${i}`}
            type="button"
            disabled={submitted}
            onClick={() => onChange(value.filter((_, idx) => idx !== i))}
            className="rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground shadow-sm transition-transform hover:scale-[1.03] active:scale-95"
          >
            {frag}
          </button>
        ))}
      </div>
      {!submitted && (
        <div className="flex flex-wrap gap-2">
          {remaining.map((frag, i) => (
            <button
              key={`${frag}-${i}`}
              type="button"
              onClick={() => onChange([...value, frag])}
              className="rounded-lg border bg-card px-3 py-1.5 text-sm font-medium shadow-sm transition-all hover:border-primary/40 hover:bg-accent active:scale-95"
            >
              {frag}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function MatchGrid({
  q,
  value,
  submitted,
  onChange,
}: {
  q: MatchQuestion;
  value: Record<string, string>;
  submitted: boolean;
  onChange: (v: Record<string, string>) => void;
}) {
  const rights = useMemo(() => seededShuffle(q.pairs.map((p) => p.right), q.id), [q]);

  return (
    <div className="space-y-2">
      {q.pairs.map((pair) => {
        const chosen = value[pair.left];
        const ok = submitted ? chosen === pair.right : undefined;
        return (
          <div key={pair.left} className="flex items-center gap-3">
            <span className="w-2/5 truncate rounded-xl bg-secondary/70 px-3.5 py-2 text-sm font-medium">{pair.left}</span>
            <span className="text-muted-foreground">→</span>
            <select
              value={chosen ?? ""}
              disabled={submitted}
              onChange={(e) => onChange({ ...value, [pair.left]: e.target.value })}
              className={cn(
                "h-10 flex-1 rounded-xl border bg-background px-3 text-sm font-medium shadow-sm outline-none focus:ring-2 focus:ring-ring",
                ok === true && "border-emerald-400 bg-emerald-50 dark:bg-emerald-950/50",
                ok === false && "border-rose-400 bg-rose-50 dark:bg-rose-950/50"
              )}
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
        );
      })}
    </div>
  );
}
