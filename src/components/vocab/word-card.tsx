"use client";

import { useState } from "react";
import { ChevronDown, Layers, Check, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SpeakButton } from "@/components/content/speak-button";

export interface WordDTO {
  id: string;
  german: string;
  article?: string | null;
  plural?: string | null;
  pos: string;
  ipa?: string | null;
  meaning: string;
  exampleDe: string;
  exampleEn?: string | null;
  synonyms?: string[] | null;
  opposites?: string[] | null;
  expressions?: { de: string; en: string }[] | null;
  memoryTip?: string | null;
  difficulty: number;
}

const ARTICLE_COLORS: Record<string, string> = {
  der: "text-sky-600 dark:text-sky-400",
  die: "text-rose-600 dark:text-rose-400",
  das: "text-emerald-600 dark:text-emerald-400",
};

export function WordRow({ word, initialInDeck }: { word: WordDTO; initialInDeck: boolean }) {
  const [open, setOpen] = useState(false);
  const [inDeck, setInDeck] = useState(initialInDeck);
  const [busy, setBusy] = useState(false);

  async function addToDeck(e: React.MouseEvent) {
    e.stopPropagation();
    if (inDeck || busy) return;
    setBusy(true);
    try {
      const res = await fetch("/api/flashcards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ wordIds: [word.id] }),
      });
      if (!res.ok) throw new Error();
      setInDeck(true);
      toast.success(`"${word.german}" added to your flashcards`);
    } catch {
      toast.error("Could not add the card");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="overflow-hidden rounded-2xl border bg-card transition-shadow hover:shadow-card">
      <button type="button" onClick={() => setOpen((v) => !v)} className="flex w-full items-center gap-3 p-4 text-left">
        <SpeakButton text={word.article ? `${word.article} ${word.german}` : word.german} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline gap-x-2">
            {word.article && <span className={cn("font-semibold", ARTICLE_COLORS[word.article] ?? "")}>{word.article}</span>}
            <span className="text-[17px] font-semibold tracking-tight">{word.german}</span>
            {word.plural && <span className="text-sm text-muted-foreground">pl. {word.plural}</span>}
            {word.ipa && <span className="font-mono text-xs text-muted-foreground">[{word.ipa}]</span>}
          </div>
          <div className="mt-0.5 truncate text-sm text-muted-foreground">{word.meaning}</div>
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          <span className="hidden items-center gap-0.5 sm:flex" title={`Difficulty ${word.difficulty}/3`}>
            {[1, 2, 3].map((d) => (
              <span key={d} className={cn("h-1.5 w-1.5 rounded-full", d <= word.difficulty ? "bg-brand-400" : "bg-border")} />
            ))}
          </span>
          <Button
            variant={inDeck ? "secondary" : "outline"}
            size="sm"
            onClick={addToDeck}
            disabled={inDeck || busy}
            className="h-8"
          >
            {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : inDeck ? <Check className="h-3.5 w-3.5" /> : <Layers className="h-3.5 w-3.5" />}
            <span className="hidden sm:inline">{inDeck ? "In deck" : "Add"}</span>
          </Button>
          <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform", open && "rotate-180")} />
        </div>
      </button>

      {open && (
        <div className="space-y-3 border-t bg-secondary/30 px-4 py-4 sm:px-14">
          <div>
            <div className="text-sm font-medium">„{word.exampleDe}"</div>
            {word.exampleEn && <div className="text-sm text-muted-foreground">{word.exampleEn}</div>}
          </div>

          {(word.synonyms?.length || word.opposites?.length) ? (
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              {word.synonyms && word.synonyms.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-xs font-semibold text-muted-foreground">≈</span>
                  {word.synonyms.map((s) => (
                    <Badge key={s} variant="secondary" className="font-normal">
                      {s}
                    </Badge>
                  ))}
                </div>
              )}
              {word.opposites && word.opposites.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-xs font-semibold text-muted-foreground">≠</span>
                  {word.opposites.map((s) => (
                    <Badge key={s} variant="outline" className="font-normal">
                      {s}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          ) : null}

          {word.expressions && word.expressions.length > 0 && (
            <div className="space-y-1">
              {word.expressions.map((ex, i) => (
                <div key={i} className="text-sm">
                  <span className="font-medium">{ex.de}</span>
                  <span className="text-muted-foreground"> — {ex.en}</span>
                </div>
              ))}
            </div>
          )}

          {word.memoryTip && (
            <div className="rounded-xl bg-brand-50 px-3.5 py-2.5 text-sm dark:bg-brand-950/40">
              <span className="font-semibold">🧠 Merkhilfe: </span>
              {word.memoryTip}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function AddAllToFlashcards({ wordIds }: { wordIds: string[] }) {
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  async function addAll() {
    if (busy || done) return;
    setBusy(true);
    try {
      const res = await fetch("/api/flashcards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ wordIds }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error();
      setDone(true);
      toast.success(
        json.created > 0 ? `${json.created} new card${json.created === 1 ? "" : "s"} added to your deck` : "All words are already in your deck"
      );
    } catch {
      toast.error("Could not add the cards");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Button onClick={addAll} disabled={busy || done} variant={done ? "secondary" : "default"}>
      {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : done ? <Check className="h-4 w-4" /> : <Layers className="h-4 w-4" />}
      {done ? "Added to deck" : "Add all to flashcards"}
    </Button>
  );
}
