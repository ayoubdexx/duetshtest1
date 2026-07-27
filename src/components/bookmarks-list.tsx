"use client";

import { useState } from "react";
import Link from "next/link";
import { BookmarkX, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

export interface BookmarkDTO {
  id: string;
  type: string;
  refId: string;
  title: string;
  href: string;
  createdAt: string;
}

const TYPE_LABELS: Record<string, { label: string; emoji: string }> = {
  LESSON: { label: "Lessons", emoji: "🎓" },
  GRAMMAR: { label: "Grammar", emoji: "📖" },
  VOCAB_TOPIC: { label: "Vocabulary", emoji: "📚" },
  WORD: { label: "Words", emoji: "🔤" },
  READING: { label: "Reading", emoji: "📰" },
  LISTENING: { label: "Listening", emoji: "🎧" },
  SPEAKING: { label: "Speaking", emoji: "🗣" },
  WRITING: { label: "Writing", emoji: "✍️" },
  EXERCISE: { label: "Exercises", emoji: "✏️" },
  EXAM: { label: "Exams", emoji: "📋" },
  VERB: { label: "Verbs", emoji: "🔁" },
};

export function BookmarksList({ initial }: { initial: BookmarkDTO[] }) {
  const [bookmarks, setBookmarks] = useState(initial);

  async function remove(b: BookmarkDTO) {
    const prev = bookmarks;
    setBookmarks((bs) => bs.filter((x) => x.id !== b.id));
    const res = await fetch("/api/bookmarks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: b.type, refId: b.refId, title: b.title, href: b.href }),
    });
    if (!res.ok) {
      setBookmarks(prev);
      toast.error("Could not remove bookmark");
    }
  }

  if (bookmarks.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed p-12 text-center">
        <div className="text-4xl">🔖</div>
        <h2 className="mt-3 font-bold">No bookmarks yet</h2>
        <p className="mx-auto mt-1 max-w-sm text-sm text-muted-foreground">
          Tap the bookmark icon on any lesson, grammar topic, text or exercise to pin it here.
        </p>
      </div>
    );
  }

  const grouped = bookmarks.reduce<Record<string, BookmarkDTO[]>>((acc, b) => {
    (acc[b.type] ??= []).push(b);
    return acc;
  }, {});

  return (
    <div className="space-y-8">
      {Object.entries(grouped).map(([type, items]) => {
        const meta = TYPE_LABELS[type] ?? { label: type, emoji: "📌" };
        return (
          <section key={type}>
            <div className="section-label mb-2.5">
              {meta.emoji} {meta.label}
              <Badge variant="secondary" className="ml-2 text-[10px]">
                {items.length}
              </Badge>
            </div>
            <div className="overflow-hidden rounded-2xl border">
              <div className="divide-y">
                {items.map((b) => (
                  <div key={b.id} className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-accent/50">
                    <Link href={b.href} className="flex min-w-0 flex-1 items-center gap-2 font-medium">
                      <span className="truncate">{b.title}</span>
                      <ChevronRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                    </Link>
                    <span className="hidden text-xs text-muted-foreground sm:block">
                      {new Date(b.createdAt).toLocaleDateString("en", { month: "short", day: "numeric" })}
                    </span>
                    <button
                      onClick={() => remove(b)}
                      className="rounded-lg p-1.5 text-muted-foreground hover:bg-accent hover:text-destructive"
                      aria-label="Remove bookmark"
                    >
                      <BookmarkX className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
}
