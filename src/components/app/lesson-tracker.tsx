"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CheckCircle2, ArrowRight, Loader2, PartyPopper } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

/** Invisible helper: marks the lesson in-progress on mount and autosaves the furthest block reached while scrolling. */
export function LessonAutosave({ lessonId, alreadyCompleted }: { lessonId: string; alreadyCompleted: boolean }) {
  const maxIdx = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (alreadyCompleted) return;

    fetch("/api/progress/lesson", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lessonId, action: "progress", blockIndex: 0 }),
    }).catch(() => {});

    function flush() {
      timer.current = null;
      fetch("/api/progress/lesson", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lessonId, action: "progress", blockIndex: maxIdx.current }),
      }).catch(() => {});
    }

    function onScroll() {
      const blocks = document.querySelectorAll<HTMLElement>("[data-block-index]");
      let idx = 0;
      blocks.forEach((el) => {
        if (el.getBoundingClientRect().top < window.innerHeight * 0.6) {
          idx = Math.max(idx, Number(el.dataset.blockIndex ?? 0));
        }
      });
      if (idx > maxIdx.current) {
        maxIdx.current = idx;
        if (!timer.current) timer.current = setTimeout(flush, 6000);
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (timer.current) {
        clearTimeout(timer.current);
        flush();
      }
    };
  }, [lessonId, alreadyCompleted]);

  return null;
}

export function CompleteLessonButton({
  lessonId,
  xpReward,
  initialCompleted,
  nextHref,
  nextTitle,
}: {
  lessonId: string;
  xpReward: number;
  initialCompleted: boolean;
  nextHref?: string;
  nextTitle?: string;
}) {
  const router = useRouter();
  const [completed, setCompleted] = useState(initialCompleted);
  const [busy, setBusy] = useState(false);

  async function complete() {
    setBusy(true);
    try {
      const res = await fetch("/api/progress/lesson", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lessonId, action: "complete" }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error();
      setCompleted(true);
      if (json.xpEarned > 0) {
        toast.success(`Lektion geschafft! +${json.xpEarned} XP`, { icon: "🎉" });
      }
      router.refresh();
    } catch {
      toast.error("Could not save progress — please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="rounded-2xl border bg-gradient-to-br from-secondary/80 to-secondary/30 p-6 text-center">
      {completed ? (
        <>
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/50">
            <CheckCircle2 className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h3 className="text-lg font-bold">Lektion abgeschlossen!</h3>
          <p className="mt-1 text-sm text-muted-foreground">This lesson is marked as completed.</p>
          {nextHref && (
            <Link href={nextHref} className="mt-4 inline-block">
              <Button size="lg">
                Next: {nextTitle ?? "Continue"} <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          )}
        </>
      ) : (
        <>
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-brand-100 dark:bg-brand-900/50">
            <PartyPopper className="h-6 w-6 text-brand-600 dark:text-brand-400" />
          </div>
          <h3 className="text-lg font-bold">Fertig mit dieser Lektion?</h3>
          <p className="mt-1 text-sm text-muted-foreground">Mark it complete to earn {xpReward} XP and keep your streak alive.</p>
          <Button size="lg" className="mt-4" onClick={complete} disabled={busy}>
            {busy && <Loader2 className="h-4 w-4 animate-spin" />}
            Mark lesson complete
          </Button>
        </>
      )}
    </div>
  );
}
