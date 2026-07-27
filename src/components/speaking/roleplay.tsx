"use client";

import { useState } from "react";
import { Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { SpeakButton } from "@/components/content/speak-button";
import type { DialogueLine } from "@/types/content";

type Mode = "listen" | "a" | "b";

export function Roleplay({ lines }: { lines: DialogueLine[] }) {
  const [mode, setMode] = useState<Mode>("listen");
  const [revealed, setRevealed] = useState<Set<number>>(new Set());

  const speakers = [...new Set(lines.map((l) => l.speaker))];
  const speakerA = speakers[0];
  const speakerB = speakers[1] ?? speakers[0];

  function isMine(line: DialogueLine): boolean {
    if (mode === "listen") return false;
    return mode === "a" ? line.speaker === speakerA : line.speaker === speakerB;
  }

  function switchMode(m: Mode) {
    setMode(m);
    setRevealed(new Set());
  }

  return (
    <div className="rounded-2xl border bg-card p-5 shadow-card">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="text-sm font-bold">🎭 Rollenspiel · Roleplay</div>
        <div className="flex gap-1.5">
          <button onClick={() => switchMode("listen")}>
            <Badge variant={mode === "listen" ? "default" : "secondary"} className="cursor-pointer">
              Listen
            </Badge>
          </button>
          <button onClick={() => switchMode("a")}>
            <Badge variant={mode === "a" ? "default" : "secondary"} className="cursor-pointer">
              Play {speakerA}
            </Badge>
          </button>
          {speakerB !== speakerA && (
            <button onClick={() => switchMode("b")}>
              <Badge variant={mode === "b" ? "default" : "secondary"} className="cursor-pointer">
                Play {speakerB}
              </Badge>
            </button>
          )}
        </div>
      </div>

      {mode !== "listen" && (
        <p className="mb-4 rounded-xl bg-brand-50 px-3.5 py-2.5 text-xs text-brand-900 dark:bg-brand-950/40 dark:text-brand-200">
          Your lines are hidden — say them out loud from memory (or improvise!), then tap to check.
        </p>
      )}

      <div className="space-y-3">
        {lines.map((line, i) => {
          const mine = isMine(line);
          const hidden = mine && !revealed.has(i);
          const isA = line.speaker === speakerA;
          return (
            <div key={i} className={cn("flex gap-3", !isA && "flex-row-reverse")}>
              <div
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                  isA
                    ? "bg-brand-100 text-brand-700 dark:bg-brand-900/50 dark:text-brand-300"
                    : "bg-sky-100 text-sky-700 dark:bg-sky-900/50 dark:text-sky-300"
                )}
              >
                {line.speaker.slice(0, 1)}
              </div>
              <div
                className={cn(
                  "max-w-[85%] rounded-2xl px-4 py-2.5",
                  isA ? "rounded-tl-md bg-secondary" : "rounded-tr-md bg-sky-50 dark:bg-sky-950/40",
                  mine && "ring-1 ring-brand-300 dark:ring-brand-800"
                )}
              >
                <div className="mb-0.5 flex items-center gap-1 text-[11px] font-semibold text-muted-foreground">
                  {line.speaker}
                  {mine && <Badge variant="brand" className="ml-1 px-1.5 py-0 text-[9px]">you</Badge>}
                  {!hidden && <SpeakButton text={line.de} className="h-5 w-5" />}
                </div>
                {hidden ? (
                  <button
                    onClick={() => setRevealed((r) => new Set(r).add(i))}
                    className="flex items-center gap-2 py-1 text-sm font-medium text-muted-foreground hover:text-foreground"
                  >
                    <Eye className="h-4 w-4" /> Say it, then reveal
                  </button>
                ) : (
                  <>
                    <div className="text-[15px] font-medium leading-relaxed">{line.de}</div>
                    {line.en && <div className="mt-0.5 text-xs text-muted-foreground">{line.en}</div>}
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
