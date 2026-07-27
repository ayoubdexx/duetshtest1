"use client";

import { useEffect, useRef, useState } from "react";
import { Mic, Square, Play, Trash2, Check, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function Recorder() {
  const [state, setState] = useState<"idle" | "recording" | "recorded" | "unsupported">("idle");
  const [seconds, setSeconds] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && (!navigator.mediaDevices || typeof MediaRecorder === "undefined")) {
      setState("unsupported");
    }
    return () => {
      if (timer.current) clearInterval(timer.current);
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function start() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      chunks.current = [];
      recorder.ondataavailable = (e) => chunks.current.push(e.data);
      recorder.onstop = () => {
        const blob = new Blob(chunks.current, { type: recorder.mimeType || "audio/webm" });
        setAudioUrl(URL.createObjectURL(blob));
        stream.getTracks().forEach((t) => t.stop());
      };
      recorder.start();
      mediaRecorder.current = recorder;
      setSeconds(0);
      setState("recording");
      timer.current = setInterval(() => setSeconds((s) => s + 1), 1000);
    } catch {
      toast.error("Microphone access denied — check your browser permissions.");
    }
  }

  function stop() {
    mediaRecorder.current?.stop();
    if (timer.current) clearInterval(timer.current);
    setState("recorded");
  }

  function discard() {
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioUrl(null);
    setSeconds(0);
    setState("idle");
  }

  if (state === "unsupported") {
    return (
      <div className="rounded-2xl border border-dashed p-5 text-center text-sm text-muted-foreground">
        Recording isn't supported in this browser — practice out loud anyway! 🎤
      </div>
    );
  }

  return (
    <div className="rounded-2xl border bg-card p-5 shadow-card">
      <div className="mb-3 text-sm font-bold">🎤 Record yourself</div>
      <p className="mb-4 text-sm text-muted-foreground">
        Speaking out loud — even alone — builds fluency faster than silent practice. Record, listen back, repeat.
      </p>
      <div className="flex flex-wrap items-center gap-3">
        {state === "idle" && (
          <Button onClick={start}>
            <Mic className="h-4 w-4" /> Start recording
          </Button>
        )}
        {state === "recording" && (
          <>
            <Button variant="destructive" onClick={stop}>
              <Square className="h-4 w-4" /> Stop
            </Button>
            <span className="flex items-center gap-2 text-sm font-medium">
              <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-rose-500" />
              {Math.floor(seconds / 60)}:{(seconds % 60).toString().padStart(2, "0")}
            </span>
          </>
        )}
        {state === "recorded" && audioUrl && (
          <>
            <audio src={audioUrl} controls className="h-10 max-w-full" />
            <Button variant="outline" size="icon" onClick={discard} aria-label="Discard recording">
              <Trash2 className="h-4 w-4" />
            </Button>
            <Button variant="outline" onClick={start}>
              <Mic className="h-4 w-4" /> Re-record
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

export function MarkPracticedButton({ refId, minutes = 5 }: { refId: string; minutes?: number }) {
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);

  async function mark() {
    if (done || busy) return;
    setBusy(true);
    try {
      const res = await fetch("/api/activity", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind: "SPEAKING", refId, minutes }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error();
      setDone(true);
      toast.success(`Sehr gut! +${json.xpEarned ?? 10} XP`, { icon: "🎉" });
    } catch {
      toast.error("Could not save — try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Button size="lg" className="w-full" onClick={mark} disabled={done || busy} variant={done ? "secondary" : "default"}>
      {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
      {done ? "Practiced today ✓" : "I practiced this out loud"}
    </Button>
  );
}
