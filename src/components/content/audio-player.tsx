"use client";

import { useEffect, useRef, useState } from "react";
import { Play, Pause, RotateCcw, RotateCw, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const SPEEDS = [0.5, 0.75, 1, 1.25, 1.5];

function fmt(sec: number): string {
  if (!isFinite(sec)) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

interface AudioPlayerProps {
  src: string;
  title?: string;
  transcript?: string;
  className?: string;
  compact?: boolean;
}

export function AudioPlayer({ src, title, transcript, className, compact }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [showTranscript, setShowTranscript] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onTime = () => setCurrent(audio.currentTime);
    const onMeta = () => setDuration(audio.duration);
    const onEnd = () => setPlaying(false);
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("loadedmetadata", onMeta);
    audio.addEventListener("ended", onEnd);
    return () => {
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("loadedmetadata", onMeta);
      audio.removeEventListener("ended", onEnd);
    };
  }, []);

  function toggle() {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      audio.play();
      setPlaying(true);
    }
  }

  function seek(e: React.ChangeEvent<HTMLInputElement>) {
    const audio = audioRef.current;
    if (!audio) return;
    const t = (Number(e.target.value) / 100) * duration;
    audio.currentTime = t;
    setCurrent(t);
  }

  function skip(delta: number) {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = Math.max(0, Math.min(duration, audio.currentTime + delta));
  }

  function changeSpeed(s: number) {
    setSpeed(s);
    if (audioRef.current) audioRef.current.playbackRate = s;
  }

  const pct = duration > 0 ? (current / duration) * 100 : 0;

  return (
    <div className={cn("rounded-2xl border bg-card p-4 shadow-card", className)}>
      <audio ref={audioRef} src={src} preload="metadata" />
      {title && !compact && <div className="mb-3 text-sm font-semibold">{title}</div>}

      <div className="flex items-center gap-3">
        <button
          onClick={toggle}
          aria-label={playing ? "Pause" : "Play"}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm transition-transform hover:scale-105 active:scale-95"
        >
          {playing ? <Pause className="h-5 w-5" /> : <Play className="ml-0.5 h-5 w-5" />}
        </button>

        <button onClick={() => skip(-10)} aria-label="Back 10 seconds" className="hidden h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent sm:flex">
          <RotateCcw className="h-4 w-4" />
        </button>
        <button onClick={() => skip(10)} aria-label="Forward 10 seconds" className="hidden h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent sm:flex">
          <RotateCw className="h-4 w-4" />
        </button>

        <span className="w-10 text-right font-mono text-xs text-muted-foreground">{fmt(current)}</span>
        <input
          type="range"
          min={0}
          max={100}
          value={pct}
          onChange={seek}
          aria-label="Seek"
          className="h-1.5 flex-1 cursor-pointer appearance-none rounded-full bg-secondary accent-brand-500"
        />
        <span className="w-10 font-mono text-xs text-muted-foreground">{fmt(duration)}</span>

        <DropdownMenu>
          <DropdownMenuTrigger className="flex h-8 items-center gap-0.5 rounded-lg border px-2 text-xs font-semibold text-muted-foreground hover:bg-accent">
            {speed}× <ChevronDown className="h-3 w-3" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-[80px]">
            {SPEEDS.map((s) => (
              <DropdownMenuItem key={s} onClick={() => changeSpeed(s)} className={cn(s === speed && "bg-accent font-semibold")}>
                {s}×
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {transcript && (
        <div className="mt-3">
          <button
            onClick={() => setShowTranscript((v) => !v)}
            className="text-xs font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
          >
            {showTranscript ? "Hide transcript" : "Show transcript"}
          </button>
          {showTranscript && (
            <div className="mt-2 whitespace-pre-line rounded-xl bg-secondary/60 p-4 text-sm leading-relaxed">
              {transcript}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
