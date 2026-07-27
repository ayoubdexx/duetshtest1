import type { ExamSection, ExerciseQuestion } from "@/types/content";
import { isCorrect } from "@/lib/questions";

export interface ExamPayload {
  answers: Record<string, unknown>;
  writing: Record<string, string>;
  speaking: Record<string, number>;
}

export interface SectionScore {
  id: string;
  title: string;
  skill: string;
  score: number;
  max: number;
}

export interface WritingEstimate {
  partId: string;
  score: number;
  max: number;
  words: number;
  minWords: number;
  source: "ai" | "heuristic";
}

export interface ExamResult {
  total: number;
  max: number;
  pct: number;
  sectionScores: SectionScore[];
  questionResults: Record<string, boolean>;
  writingEstimates: WritingEstimate[];
}

const CONNECTORS = ["weil", "deshalb", "trotzdem", "außerdem", "aber", "denn", "obwohl", "während", "dann", "danach"];

function heuristicWritingScore(text: string, minWords: number, maxPoints: number): number {
  const words = text.trim().split(/\s+/).filter(Boolean);
  if (words.length < 5) return 0;
  let factor = 0.45;
  const ratio = Math.min(1, words.length / Math.max(1, minWords));
  factor += ratio * 0.25;
  const lower = text.toLowerCase();
  if (CONNECTORS.some((c) => lower.includes(c))) factor += 0.1;
  const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0);
  if (sentences.length >= 3) factor += 0.1;
  if (/[äöüß]/.test(text)) factor += 0.05;
  return Math.round(maxPoints * Math.min(0.95, factor));
}

type AiScorer = (text: string, prompt: string, minWords: number) => Promise<number | null>;

/**
 * Scores a full exam attempt server-side.
 * Question parts are exact-scored; writing parts use the AI scorer when available
 * (falling back to a transparent heuristic); speaking parts use self-assessment.
 */
export async function scoreExam(
  sections: ExamSection[],
  payload: ExamPayload,
  aiScorer?: AiScorer
): Promise<ExamResult> {
  const sectionScores: SectionScore[] = [];
  const questionResults: Record<string, boolean> = {};
  const writingEstimates: WritingEstimate[] = [];

  for (const section of sections) {
    let score = 0;
    let max = 0;

    for (const part of section.parts) {
      const ppq = part.pointsPerQuestion ?? 1;

      if (part.questions) {
        for (const q of part.questions as ExerciseQuestion[]) {
          max += ppq;
          const ok = isCorrect(q, payload.answers[q.id]);
          questionResults[q.id] = ok;
          if (ok) score += ppq;
        }
      }

      if (part.writing) {
        const maxPoints = part.writing.points;
        max += maxPoints;
        const text = payload.writing[part.id] ?? "";
        let pts: number | null = null;
        let source: "ai" | "heuristic" = "heuristic";
        if (aiScorer && text.trim().length >= 20) {
          try {
            const aiPct = await aiScorer(text, part.writing.prompt, part.writing.minWords);
            if (aiPct !== null) {
              pts = Math.round((aiPct / 100) * maxPoints);
              source = "ai";
            }
          } catch {
            pts = null;
          }
        }
        if (pts === null) pts = heuristicWritingScore(text, part.writing.minWords, maxPoints);
        score += pts;
        writingEstimates.push({
          partId: part.id,
          score: pts,
          max: maxPoints,
          words: text.trim().split(/\s+/).filter(Boolean).length,
          minWords: part.writing.minWords,
          source,
        });
      }

      if (part.speaking) {
        const maxPoints = 10;
        max += maxPoints;
        const self = Math.max(0, Math.min(100, payload.speaking[part.id] ?? 0));
        score += Math.round((self / 100) * maxPoints);
      }
    }

    sectionScores.push({ id: section.id, title: section.title, skill: section.skill, score, max });
  }

  const total = sectionScores.reduce((a, s) => a + s.score, 0);
  const max = sectionScores.reduce((a, s) => a + s.max, 0);
  return {
    total,
    max,
    pct: max > 0 ? Math.round((total / max) * 100) : 0,
    sectionScores,
    questionResults,
    writingEstimates,
  };
}
