"use client";

import { useState } from "react";
import { Star, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { SpeakButton } from "@/components/content/speak-button";

export interface BrowserCard {
  id: string;
  front: string;
  back: string;
  deck: string;
  isFavorite: boolean;
  intervalDays: number;
  dueAt: string;
  repetitions: number;
}

export function CardsBrowser({ initialCards }: { initialCards: BrowserCard[] }) {
  const [cards, setCards] = useState(initialCards);
  const [query, setQuery] = useState("");
  const [deckFilter, setDeckFilter] = useState<string | null>(null);
  const [favOnly, setFavOnly] = useState(false);

  const decks = [...new Set(cards.map((c) => c.deck))].sort();

  const filtered = cards.filter((c) => {
    if (favOnly && !c.isFavorite) return false;
    if (deckFilter && c.deck !== deckFilter) return false;
    if (query && !`${c.front} ${c.back}`.toLowerCase().includes(query.toLowerCase())) return false;
    return true;
  });

  async function toggleFavorite(card: BrowserCard) {
    setCards((cs) => cs.map((c) => (c.id === card.id ? { ...c, isFavorite: !c.isFavorite } : c)));
    const res = await fetch("/api/flashcards", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: card.id, isFavorite: !card.isFavorite }),
    });
    if (!res.ok) {
      setCards((cs) => cs.map((c) => (c.id === card.id ? { ...c, isFavorite: card.isFavorite } : c)));
      toast.error("Could not update the card");
    }
  }

  async function remove(card: BrowserCard) {
    if (!confirm(`Delete the card "${card.front}"?`)) return;
    const prev = cards;
    setCards((cs) => cs.filter((c) => c.id !== card.id));
    const res = await fetch(`/api/flashcards?id=${card.id}`, { method: "DELETE" });
    if (!res.ok) {
      setCards(prev);
      toast.error("Could not delete the card");
    } else {
      toast.success("Card deleted");
    }
  }

  function dueLabel(c: BrowserCard): { text: string; due: boolean } {
    const due = new Date(c.dueAt) <= new Date();
    if (due) return { text: "due now", due: true };
    const days = Math.ceil((new Date(c.dueAt).getTime() - Date.now()) / 86400000);
    return { text: `in ${days}d`, due: false };
  }

  return (
    <div>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search cards…"
          className="sm:max-w-xs"
        />
        <div className="flex flex-wrap items-center gap-1.5">
          <button onClick={() => setDeckFilter(null)}>
            <Badge variant={deckFilter === null ? "default" : "secondary"} className="cursor-pointer">
              All decks
            </Badge>
          </button>
          {decks.map((d) => (
            <button key={d} onClick={() => setDeckFilter(deckFilter === d ? null : d)}>
              <Badge variant={deckFilter === d ? "default" : "secondary"} className="cursor-pointer">
                {d}
              </Badge>
            </button>
          ))}
          <button onClick={() => setFavOnly((v) => !v)}>
            <Badge variant={favOnly ? "brand" : "secondary"} className="cursor-pointer gap-1">
              <Star className={cn("h-3 w-3", favOnly && "fill-current")} /> Favorites
            </Badge>
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border">
        {filtered.length === 0 ? (
          <div className="p-10 text-center text-sm text-muted-foreground">No cards match your filters.</div>
        ) : (
          <div className="divide-y">
            {filtered.map((card) => {
              const due = dueLabel(card);
              return (
                <div key={card.id} className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-accent/50">
                  <SpeakButton text={card.front} />
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-medium">{card.front}</div>
                    <div className="truncate text-sm text-muted-foreground">{card.back}</div>
                  </div>
                  <Badge variant="secondary" className="hidden text-[10px] sm:inline-flex">
                    {card.deck}
                  </Badge>
                  <span className={cn("hidden w-16 text-right text-xs sm:block", due.due ? "font-semibold text-brand-600 dark:text-brand-400" : "text-muted-foreground")}>
                    {due.text}
                  </span>
                  <button
                    onClick={() => toggleFavorite(card)}
                    className="rounded-lg p-1.5 text-muted-foreground hover:bg-accent"
                    aria-label={card.isFavorite ? "Unfavorite" : "Favorite"}
                  >
                    <Star className={cn("h-4 w-4", card.isFavorite && "fill-brand-400 text-brand-400")} />
                  </button>
                  <button
                    onClick={() => remove(card)}
                    className="rounded-lg p-1.5 text-muted-foreground hover:bg-accent hover:text-destructive"
                    aria-label="Delete card"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
