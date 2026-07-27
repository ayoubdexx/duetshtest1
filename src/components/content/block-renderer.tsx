import {
  Lightbulb,
  AlertTriangle,
  Info,
  Landmark,
  BookOpen,
  X,
  Check,
} from "lucide-react";
import type { LessonBlock, ExerciseQuestion } from "@/types/content";
import { MiniMd } from "@/lib/mini-md";
import { SpeakButton } from "@/components/content/speak-button";
import { AudioPlayer } from "@/components/content/audio-player";
import { ExercisePlayer, type ExerciseDTO } from "@/components/exercises/exercise-player";
import { cn } from "@/lib/utils";

const CALLOUT_STYLES = {
  tip: {
    icon: Lightbulb,
    box: "border-emerald-200 bg-emerald-50/70 dark:border-emerald-900 dark:bg-emerald-950/40",
    iconColor: "text-emerald-600 dark:text-emerald-400",
    defaultTitle: "Tipp",
  },
  warning: {
    icon: AlertTriangle,
    box: "border-amber-200 bg-amber-50/70 dark:border-amber-900 dark:bg-amber-950/40",
    iconColor: "text-amber-600 dark:text-amber-400",
    defaultTitle: "Achtung",
  },
  info: {
    icon: Info,
    box: "border-sky-200 bg-sky-50/70 dark:border-sky-900 dark:bg-sky-950/40",
    iconColor: "text-sky-600 dark:text-sky-400",
    defaultTitle: "Gut zu wissen",
  },
  culture: {
    icon: Landmark,
    box: "border-violet-200 bg-violet-50/70 dark:border-violet-900 dark:bg-violet-950/40",
    iconColor: "text-violet-600 dark:text-violet-400",
    defaultTitle: "Kultur",
  },
  grammar: {
    icon: BookOpen,
    box: "border-brand-200 bg-brand-50/70 dark:border-brand-900 dark:bg-brand-950/40",
    iconColor: "text-brand-600 dark:text-brand-400",
    defaultTitle: "Grammatik",
  },
} as const;

interface BlockRendererProps {
  blocks: LessonBlock[];
  exercises?: Record<string, ExerciseDTO>;
  /** print mode: hides interactive chrome */
  print?: boolean;
}

export function BlockRenderer({ blocks, exercises = {}, print = false }: BlockRendererProps) {
  return (
    <div className="space-y-6">
      {blocks.map((block, idx) => (
        <div key={idx} data-block-index={idx} className="avoid-break scroll-mt-24">
          <Block block={block} exercises={exercises} print={print} />
        </div>
      ))}
    </div>
  );
}

function Block({ block, exercises, print }: { block: LessonBlock; exercises: Record<string, ExerciseDTO>; print: boolean }) {
  switch (block.type) {
    case "heading":
      return (
        <h2 id={block.id} className="mt-10 border-b pb-2.5 text-xl font-bold tracking-tight first:mt-0">
          {block.text}
        </h2>
      );

    case "text":
      return <MiniMd text={block.md} className="text-foreground/90" />;

    case "callout": {
      const style = CALLOUT_STYLES[block.variant] ?? CALLOUT_STYLES.info;
      const Icon = style.icon;
      return (
        <div className={cn("rounded-2xl border p-4 sm:p-5", style.box)}>
          <div className="mb-1.5 flex items-center gap-2">
            <Icon className={cn("h-4 w-4", style.iconColor)} />
            <span className="text-sm font-bold">{block.title ?? style.defaultTitle}</span>
          </div>
          <MiniMd text={block.md} className="text-sm text-foreground/85 [&_p]:my-1.5" />
        </div>
      );
    }

    case "examples":
      return (
        <div className="overflow-hidden rounded-2xl border">
          {block.title && <div className="border-b bg-secondary/60 px-4 py-2.5 text-sm font-semibold">{block.title}</div>}
          <div className="divide-y">
            {block.items.map((ex, i) => (
              <div key={i} className="flex items-start gap-2 px-4 py-3">
                {!print && <SpeakButton text={ex.de} className="mt-0.5" />}
                <div className="min-w-0">
                  <div className="font-medium leading-relaxed">{ex.de}</div>
                  <div className="text-sm text-muted-foreground">{ex.en}</div>
                  {ex.note && <div className="mt-0.5 text-xs italic text-brand-700 dark:text-brand-300">{ex.note}</div>}
                </div>
              </div>
            ))}
          </div>
        </div>
      );

    case "table":
      return (
        <div>
          {block.title && <div className="mb-2 text-sm font-semibold">{block.title}</div>}
          <div className="overflow-x-auto rounded-2xl border">
            <table className="w-full min-w-[420px] border-collapse text-sm">
              <thead>
                <tr className="bg-secondary/70">
                  {block.headers.map((h, i) => (
                    <th key={i} className="whitespace-nowrap px-4 py-2.5 text-left font-semibold">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {block.rows.map((row, ri) => (
                  <tr key={ri} className="border-t even:bg-secondary/30">
                    {row.map((cell, ci) => (
                      <td key={ci} className={cn("px-4 py-2.5", ci === 0 && "font-medium")}>
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {block.caption && <div className="mt-1.5 text-xs text-muted-foreground">{block.caption}</div>}
        </div>
      );

    case "dialogue":
      return (
        <div className="rounded-2xl border p-4 sm:p-5">
          {block.title && <div className="mb-3 text-sm font-semibold">{block.title}</div>}
          {block.audioUrl && !print && <AudioPlayer src={block.audioUrl} compact className="mb-4 border-0 p-0 shadow-none" />}
          <div className="space-y-3">
            {block.lines.map((line, i) => {
              const isA = i % 2 === 0;
              return (
                <div key={i} className={cn("flex gap-3", !isA && "flex-row-reverse")}>
                  <div
                    className={cn(
                      "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                      isA ? "bg-brand-100 text-brand-700 dark:bg-brand-900/50 dark:text-brand-300" : "bg-sky-100 text-sky-700 dark:bg-sky-900/50 dark:text-sky-300"
                    )}
                  >
                    {line.speaker.slice(0, 1)}
                  </div>
                  <div className={cn("max-w-[85%] rounded-2xl px-4 py-2.5", isA ? "rounded-tl-md bg-secondary" : "rounded-tr-md bg-brand-50 dark:bg-brand-950/50")}>
                    <div className="mb-0.5 flex items-center gap-1 text-[11px] font-semibold text-muted-foreground">
                      {line.speaker}
                      {!print && <SpeakButton text={line.de} className="h-5 w-5" />}
                    </div>
                    <div className="text-[15px] font-medium leading-relaxed">{line.de}</div>
                    {line.en && <div className="mt-0.5 text-xs text-muted-foreground">{line.en}</div>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );

    case "vocab":
      return (
        <div className="rounded-2xl border p-4 sm:p-5">
          {block.title && <div className="mb-3 text-sm font-semibold">{block.title}</div>}
          <div className="grid gap-2 sm:grid-cols-2">
            {block.words.map((w, i) => (
              <div key={i} className="flex items-center gap-2 rounded-xl bg-secondary/50 px-3 py-2">
                {!print && <SpeakButton text={w.de} />}
                <div className="min-w-0">
                  <span className="font-medium">{w.de}</span>
                  <span className="text-muted-foreground"> — {w.en}</span>
                  {w.note && <span className="ml-1 text-xs italic text-brand-700 dark:text-brand-300">({w.note})</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      );

    case "mistakes":
      return (
        <div className="overflow-hidden rounded-2xl border">
          <div className="border-b bg-secondary/60 px-4 py-2.5 text-sm font-semibold">
            {block.title ?? "Typische Fehler · Common mistakes"}
          </div>
          <div className="divide-y">
            {block.items.map((m, i) => (
              <div key={i} className="px-4 py-3.5">
                <div className="flex items-start gap-2 text-sm">
                  <X className="mt-0.5 h-4 w-4 shrink-0 text-rose-500" />
                  <span className="text-muted-foreground line-through decoration-rose-400/60">{m.wrong}</span>
                </div>
                <div className="mt-1 flex items-start gap-2 text-sm">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                  <span className="font-medium">{m.right}</span>
                </div>
                <div className="mt-1.5 pl-6 text-xs text-muted-foreground">{m.why}</div>
              </div>
            ))}
          </div>
        </div>
      );

    case "exercise": {
      const ex = exercises[block.slug];
      if (!ex) return null;
      if (print) {
        return <PrintExercise exercise={ex} />;
      }
      return <ExercisePlayer exercise={ex} embedded />;
    }

    case "audio":
      if (print) return block.transcript ? <div className="rounded-2xl border p-4 text-sm italic">{block.transcript}</div> : null;
      return <AudioPlayer src={block.audioUrl} title={block.title} transcript={block.transcript} />;

    case "divider":
      return <hr className="border-dashed" />;

    default:
      return null;
  }
}

/** Static rendering of an exercise for printable PDFs (questions + solutions section handled by print page) */
export function PrintExercise({ exercise, showSolutions = false }: { exercise: ExerciseDTO; showSolutions?: boolean }) {
  const questions = exercise.questions as ExerciseQuestion[];
  return (
    <div className="avoid-break rounded-2xl border p-5">
      <div className="mb-3 text-sm font-bold">✏️ {exercise.title}</div>
      {exercise.instructions && <div className="mb-3 text-sm text-muted-foreground">{exercise.instructions}</div>}
      <ol className="space-y-3 pl-5 text-sm" style={{ listStyleType: "decimal" }}>
        {questions.map((q) => (
          <li key={q.id}>
            <span>{q.prompt}</span>
            {q.type === "mcq" && (
              <span className="mt-1 block text-muted-foreground">
                {q.options.map((o, i) => `${String.fromCharCode(97 + i)}) ${o}`).join("   ")}
              </span>
            )}
            {q.type === "order" && (
              <span className="mt-1 block text-muted-foreground">[ {[...q.fragments].sort().join(" | ")} ]</span>
            )}
            {q.type === "match" && (
              <span className="mt-1 block text-muted-foreground">
                {q.pairs.map((p) => p.left).join(", ")} ⟷ {[...q.pairs.map((p) => p.right)].sort().join(", ")}
              </span>
            )}
            {showSolutions && (
              <span className="mt-1 block font-medium text-emerald-700">
                ✓{" "}
                {q.type === "mcq"
                  ? q.options[q.answerIndex]
                  : q.type === "gap"
                    ? q.answers[0]
                    : q.type === "order"
                      ? q.fragments.join(" ")
                      : q.pairs.map((p) => `${p.left} → ${p.right}`).join(", ")}
              </span>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}
