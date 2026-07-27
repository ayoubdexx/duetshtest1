"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Star, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { SpeakButton } from "@/components/content/speak-button";
import { previewIntervals, type SrsState } from "@/lib/srs";

interface ReviewCard extends SrsState {
  id: string;
  front: string;
  back: string;
  notes?: string | null;
  deck: string;
  isFavorite: boolean;
  word: {
    german: string;
    article?: string | null;
    plural?: string | null;
    ipa?: string | null;
    meaning: string;
    exampleDe: string;
    exampleEn?: string | null;
    memoryTip?: string | null;
  } | null;
}

const RATING_BUTTONS: { rating: 0 | 1 | 2 | 3; label: string; className: string; key: string }[] = [
  { rating: 0, label: "Again", className: "border-rose-300 text-rose-600 hover:bg-rose-50 dark:border-rose-800 dark:text-rose-400 dark:hover:bg-rose-950/50", key: "1" },
  { rating: 1, label: "Hard", className: "border-amber-300 text-amber-600 hover:bg-amber-50 dark:border-amber-800 dark:text-amber-400 dark:hover:bg-amber-950/50", key: "2" },
  { rating: 2, label: "Good", className: "border-emerald-300 text-emerald-600 hover:bg-emerald-50 dark:border-emerald-800 dark:text-emerald-400 dark:hover:bg-emerald-950/50", key: "3" },
  { rating: 3, label: "Easy", className: "border-sky-300 text-sky-600 hover:bg-sky-50 dark:border-sky-800 dark:text-sky-400 dark:hover:bg-sky-950/50", key: "4" },
];

export default function ReviewPage() {
  const [loading, setLoading] = useState(true);
  const [queue, setQueue] = useState<ReviewCard[]>([]);
  const [revealed, setRevealed] = useState(false);
  const [stats, setStats] = useState({ reviewed: 0, again: 0, total: 0 });

  useEffect(() => {
    fetch("/api/flashcards/review?limit=40")
      .then((r) => r.json())
      .then((json) => {
        setQueue(json.cards ?? []);
        setStats((s) => ({ ...s, total: (json.cards ?? []).length }));
      })
      .catch(() => toast.error("Could not load your review queue"))
      .finally(() => setLoading(false));
  }, []);

  const current = queue[0] ?? null;

  const rate = useCallback(
    async (rating: 0 | 1 | 2 | 3) => {
      if (!current) return;
      const card = current;
      setRevealed(false);
      setQueue((q) => {
        const rest = q.slice(1);
        return rating === 0 ? [...rest, card] : rest;
      });
      setStats((s) => ({
        ...s,
        reviewed: s.reviewed + 1,
        again: s.again + (rating === 0 ? 1 : 0),
      }));
      fetch("/api/flashcards/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cardId: card.id, rating }),
      }).catch(() => {});
    },
    [current]
  );

  // Keyboard shortcuts
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.code === "Space") {
        e.preventDefault();
        if (!revealed) setRevealed(true);
        return;
      }
      if (revealed) {
        const btn = RATING_BUTTONS.find((b) => b.key === e.key);
        if (btn) rate(btn.rating);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [revealed, rate]);

  async function toggleFavorite() {
    if (!current) return;
    const nextVal = !current.isFavorite;
    setQueue((q) => q.map((c) => (c.id === current.id ? { ...c, isFavorite: nextVal } : c)));
    await fetch("/api/flashcards", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: current.id, isFavorite: nextVal }),
    });
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // Session finished
  if (!current) {
    const accuracy = stats.reviewed > 0 ? Math.round(((stats.reviewed - stats.again) / stats.reviewed) * 100) : 0;
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center text-center">
        <div className="text-5xl">{stats.reviewed > 0 ? "🎉" : "✨"}</div>
        <h1 className="mt-4 text-2xl font-bold tracking-tight">
          {stats.reviewed > 0 ? "Session complete!" : "Nothing due right now"}
        </h1>
        <p className="mt-2 text-muted-foreground">
          {stats.reviewed > 0
            ? `You reviewed ${stats.reviewed} card${stats.reviewed === 1 ? "" : "s"} with ${accuracy}% accuracy.`
            : "Your queue is clear. Add more words from the vocabulary section or come back later."}
        </p>
        <div className="mt-6 flex gap-3">
          <Link href="/flashcards">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4" /> Back to deck
            </Button>
          </Link>
          <Link href="/vocabulary">
            <Button>Browse vocabulary</Button>
          </Link>
        </div>
      </div>
    );
  }

  const progressPct = stats.total > 0 ? Math.round((stats.reviewed / (stats.reviewed + queue.length)) * 100) : 0;
  const intervals = previewIntervals(current);
  const displayFront = current.word
    ? current.word.article
      ? `${current.word.article} ${current.word.german}`
      : current.word.german
    : current.front;

  return (
    <div className="mx-auto max-w-xl">
      <div className="mb-6 flex items-center gap-4">
        <Link href="/flashcards" className="text-muted-foreground hover:text-foreground" aria-label="Back">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <Progress value={progressPct} className="h-2 flex-1" indicatorClassName="bg-brand-500" />
        <span className="shrink-0 text-xs font-medium text-muted-foreground">{queue.length} left</span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={current.id + String(stats.reviewed)}
          initial={{ opacity: 0, x: 32 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -32 }}
          transition={{ duration: 0.18 }}
        >
          <div
            className="min-h-[340px] cursor-pointer select-none rounded-3xl border bg-card p-8 shadow-card"
            onClick={() => !revealed && setRevealed(true)}
            role="button"
            tabIndex={0}
            aria-label={revealed ? "Card back" : "Reveal card"}
          >
            <div className="flex items-center justify-between">
              <Badge variant="secondary" className="text-[10px]">
                {current.deck}
              </Badge>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite();
                }}
                className="rounded-lg p-1.5 text-muted-foreground hover:bg-accent"
                aria-label="Toggle favorite"
              >
                <Star className={cn("h-4 w-4", current.isFavorite && "fill-brand-400 text-brand-400")} />
              </button>
            </div>

            <div className="mt-10 text-center">
              <div className="flex items-center justify-center gap-3">
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{displayFront}</h2>
                <SpeakButton text={displayFront} size="md" />
              </div>
              {current.word?.ipa && <div className="mt-2 font-mono text-sm text-muted-foreground">[{current.word.ipa}]</div>}
            </div>

            {!revealed ? (
              <div className="mt-14 text-center text-sm text-muted-foreground">
                Tap or press <kbd className="rounded-md border bg-muted px-1.5 py-0.5 text-[10px] font-semibold">Space</kbd> to reveal
              </div>
            ) : (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-8 space-y-4 border-t pt-6">
                <div className="text-center">
                  <div className="text-xl font-semibold">{current.word?.meaning ?? current.back}</div>
                  {current.word?.plural && (
                    <div className="mt-1 text-sm text-muted-foreground">Plural: die {current.word.plural}</div>
                  )}
                </div>
                {current.word?.exampleDe && (
                  <div className="rounded-xl bg-secondary/60 p-4 text-center">
                    <div className="text-sm font-medium">„{current.word.exampleDe}"</div>
                    {current.word.exampleEn && <div className="mt-0.5 text-xs text-muted-foreground">{current.word.exampleEn}</div>}
                  </div>
                )}
                {current.word?.memoryTip && (
                  <div className="rounded-xl bg-brand-50 p-3 text-center text-sm dark:bg-brand-950/40">🧠 {current.word.memoryTip}</div>
                )}
                {current.notes && <div className="text-center text-sm text-muted-foreground">{current.notes}</div>}
              </motion.div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="mt-6">
        {!revealed ? (
          <Button size="lg" className="w-full" onClick={() => setRevealed(true)}>
            Show answer
          </Button>
        ) : (
          <div className="grid grid-cols-4 gap-2.5">
            {RATING_BUTTONS.map((btn) => (
              <button
                key={btn.rating}
                onClick={() => rate(btn.rating)}
                className={cn(
                  "flex flex-col items-center gap-0.5 rounded-2xl border-2 bg-card px-2 py-3 transition-all active:scale-95",
                  btn.className
                )}
              >
                <span className="text-sm font-bold">{btn.label}</span>
                <span className="text-[10px] opacity-70">{intervals[btn.rating]}</span>
              </button>
            ))}
          </div>
        )}
        <div className="mt-3 hidden justify-center gap-4 text-[10px] text-muted-foreground sm:flex">
          <span>Space — reveal</span>
          <span>1–4 — rate</span>
        </div>
      </div>
    </div>
  );
}
