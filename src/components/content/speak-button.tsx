"use client";

import { useCallback, useState } from "react";
import { Volume2 } from "lucide-react";
import { cn } from "@/lib/utils";

let cachedVoice: SpeechSynthesisVoice | null = null;

function getGermanVoice(): SpeechSynthesisVoice | null {
  if (cachedVoice) return cachedVoice;
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return null;
  const voices = window.speechSynthesis.getVoices();
  cachedVoice =
    voices.find((v) => v.lang === "de-DE" && v.localService) ??
    voices.find((v) => v.lang === "de-DE") ??
    voices.find((v) => v.lang.startsWith("de")) ??
    null;
  return cachedVoice;
}

export function speakGerman(text: string, rate = 0.92) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "de-DE";
  utterance.rate = rate;
  const voice = getGermanVoice();
  if (voice) utterance.voice = voice;
  window.speechSynthesis.speak(utterance);
}

interface SpeakButtonProps {
  text: string;
  rate?: number;
  className?: string;
  size?: "sm" | "md";
}

export function SpeakButton({ text, rate, className, size = "sm" }: SpeakButtonProps) {
  const [speaking, setSpeaking] = useState(false);

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      speakGerman(text, rate);
      setSpeaking(true);
      setTimeout(() => setSpeaking(false), Math.min(4000, 400 + text.length * 60));
    },
    [text, rate]
  );

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={`Listen: ${text}`}
      title="Listen"
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-brand-600 dark:hover:text-brand-400",
        speaking && "text-brand-600 dark:text-brand-400",
        size === "sm" ? "h-7 w-7" : "h-9 w-9",
        className
      )}
    >
      <Volume2 className={size === "sm" ? "h-3.5 w-3.5" : "h-4.5 w-4.5"} />
    </button>
  );
}
