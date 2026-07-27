"use client";

import { useEffect, useMemo, useState } from "react";
import { Loader2, Sparkles, ChevronDown, Bot, Wand2, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import type { WritingFeedback, WritingTemplate } from "@/types/content";

interface PastSubmission {
  id: string;
  content: string;
  score: number | null;
  createdAt: string;
}

interface Props {
  taskId: string;
  minWords: number;
  template: WritingTemplate | null;
  sampleAnswer: string | null;
  tips: string[];
  pastSubmissions: PastSubmission[];
}

export function WritingWorkspace({ taskId, minWords, template, sampleAnswer, tips, pastSubmissions }: Props) {
  const storageKey = `dw-writing-${taskId}`;
  const [content, setContent] = useState("");
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState<WritingFeedback | null>(null);
  const [showSample, setShowSample] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // Autosave draft to localStorage
  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) setContent(saved);
    setHydrated(true);
  }, [storageKey]);

  useEffect(() => {
    if (!hydrated) return;
    const t = setTimeout(() => localStorage.setItem(storageKey, content), 600);
    return () => clearTimeout(t);
  }, [content, storageKey, hydrated]);

  const wordCount = useMemo(() => content.split(/\s+/).filter(Boolean).length, [content]);
  const pctOfMin = Math.min(100, Math.round((wordCount / minWords) * 100));

  async function submit() {
    if (wordCount < 5) {
      toast.error("Write a few sentences first.");
      return;
    }
    setBusy(true);
    setFeedback(null);
    try {
      const res = await fetch("/api/writing/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taskId, content }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error);
      setFeedback(json.feedback);
      toast.success("Feedback ready!");
    } catch (e) {
      toast.error(e instanceof Error && e.message ? e.message : "Could not get feedback — try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Template */}
      {(template || tips.length > 0) && (
        <Accordion type="single" collapsible className="rounded-2xl border bg-card px-5 shadow-card">
          {template && (
            <AccordionItem value="template" className="border-b-0">
              <AccordionTrigger className="text-sm font-bold">📋 Structure & useful phrases</AccordionTrigger>
              <AccordionContent className="space-y-4">
                <div className="space-y-2.5">
                  {template.sections.map((s, i) => (
                    <div key={i} className="rounded-xl bg-secondary/50 px-3.5 py-2.5">
                      <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{s.label}</div>
                      <div className="mt-0.5 text-sm italic">{s.example}</div>
                    </div>
                  ))}
                </div>
                {template.phrases?.map((group, i) => (
                  <div key={i}>
                    <div className="mb-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">{group.label}</div>
                    <ul className="space-y-1">
                      {group.items.map((p, j) => (
                        <li key={j} className="text-sm">
                          • {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </AccordionContent>
            </AccordionItem>
          )}
          {tips.length > 0 && (
            <AccordionItem value="tips" className="border-b-0">
              <AccordionTrigger className="text-sm font-bold">💡 Tips for this task</AccordionTrigger>
              <AccordionContent>
                <ul className="space-y-1.5">
                  {tips.map((t, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-400" />
                      {t}
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          )}
        </Accordion>
      )}

      {/* Editor */}
      <div className="rounded-2xl border bg-card p-5 shadow-card">
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Schreib hier deinen Text… (your draft autosaves)"
          className="min-h-[260px] resize-y border-0 bg-transparent p-0 text-[15px] leading-relaxed shadow-none focus-visible:ring-0"
        />
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border-t pt-3">
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className={cn("font-semibold", wordCount >= minWords ? "text-emerald-600 dark:text-emerald-400" : "")}>
              {wordCount} / {minWords} words
            </span>
            <div className="h-1.5 w-28 overflow-hidden rounded-full bg-secondary">
              <div
                className={cn("h-full rounded-full transition-all", wordCount >= minWords ? "bg-emerald-500" : "bg-brand-400")}
                style={{ width: `${pctOfMin}%` }}
              />
            </div>
            <span className="hidden sm:inline">Autosaved ✓</span>
          </div>
          <Button onClick={submit} disabled={busy || wordCount < 5}>
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />}
            {busy ? "Checking your text…" : "Check my text"}
          </Button>
        </div>
      </div>

      {/* Feedback */}
      {feedback && (
        <div className="overflow-hidden rounded-2xl border-2 border-brand-200 bg-card shadow-card dark:border-brand-900">
          <div className="flex items-center justify-between gap-3 border-b bg-brand-50/60 px-5 py-3.5 dark:bg-brand-950/40">
            <div className="flex items-center gap-2 text-sm font-bold">
              {feedback.source === "ai" ? <Bot className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
              Dein Feedback
              <Badge variant="brand" className="text-[10px]">
                {feedback.source === "ai" ? "AI corrected" : "Smart check"}
              </Badge>
            </div>
            <div
              className={cn(
                "flex h-11 w-11 items-center justify-center rounded-full text-sm font-bold text-white",
                feedback.score >= 75 ? "bg-emerald-500" : feedback.score >= 55 ? "bg-brand-500" : "bg-rose-500"
              )}
            >
              {feedback.score}
            </div>
          </div>
          <div className="space-y-5 p-5">
            <p className="text-sm leading-relaxed">{feedback.summary}</p>

            {feedback.strengths.length > 0 && (
              <div>
                <div className="section-label mb-2">Das machst du gut</div>
                <ul className="space-y-1.5">
                  {feedback.strengths.map((s, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <span className="mt-0.5 text-emerald-500">✓</span> {s}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {feedback.issues.length > 0 && (
              <div>
                <div className="section-label mb-2">Verbessern</div>
                <div className="space-y-2.5">
                  {feedback.issues.map((issue, i) => (
                    <div key={i} className="rounded-xl border bg-secondary/30 p-3.5 text-sm">
                      {issue.quote && <div className="mb-1 italic text-muted-foreground line-through">„{issue.quote}"</div>}
                      <div className="font-medium">{issue.problem}</div>
                      <div className="mt-1 text-emerald-700 dark:text-emerald-400">→ {issue.suggestion}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {feedback.vocabularyTips.length > 0 && (
              <div>
                <div className="section-label mb-2">Wortschatz-Tipps</div>
                <ul className="space-y-1.5">
                  {feedback.vocabularyTips.map((t, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <span className="mt-0.5">💡</span> {t}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {feedback.correctedVersion && (
              <div>
                <div className="section-label mb-2">Korrigierte Version</div>
                <div className="whitespace-pre-line rounded-xl bg-emerald-50 p-4 text-sm leading-relaxed dark:bg-emerald-950/30">
                  {feedback.correctedVersion}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Native sample */}
      {sampleAnswer && (
        <div className="rounded-2xl border bg-card p-5 shadow-card">
          <button
            onClick={() => setShowSample((v) => !v)}
            className="flex w-full items-center justify-between text-sm font-bold"
          >
            <span className="flex items-center gap-2">
              {showSample ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              Musterlösung · Native sample answer
            </span>
            <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform", showSample && "rotate-180")} />
          </button>
          {showSample && (
            <div className="mt-3 whitespace-pre-line rounded-xl bg-secondary/50 p-4 text-sm leading-relaxed">
              {sampleAnswer}
            </div>
          )}
          {!showSample && (
            <p className="mt-1.5 text-xs text-muted-foreground">Write your own version first — then compare.</p>
          )}
        </div>
      )}

      {/* Past submissions */}
      {pastSubmissions.length > 0 && (
        <Accordion type="single" collapsible className="rounded-2xl border bg-card px-5 shadow-card">
          <AccordionItem value="history" className="border-b-0">
            <AccordionTrigger className="text-sm font-bold">
              🗂 Your previous attempts ({pastSubmissions.length})
            </AccordionTrigger>
            <AccordionContent className="space-y-3">
              {pastSubmissions.map((s) => (
                <div key={s.id} className="rounded-xl border bg-secondary/30 p-3.5">
                  <div className="mb-1.5 flex items-center justify-between text-xs text-muted-foreground">
                    <span>{new Date(s.createdAt).toLocaleString("en", { dateStyle: "medium", timeStyle: "short" })}</span>
                    {s.score !== null && <Badge variant={s.score >= 75 ? "success" : "secondary"}>{s.score}/100</Badge>}
                  </div>
                  <p className="line-clamp-3 whitespace-pre-line text-sm text-foreground/80">{s.content}</p>
                </div>
              ))}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )}
    </div>
  );
}
