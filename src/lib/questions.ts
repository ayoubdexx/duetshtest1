import type { ExerciseQuestion } from "@/types/content";
import { normalizeAnswer } from "@/lib/utils";

/** Shared scoring logic for exercise & exam questions (client + server). */
export function isCorrect(q: ExerciseQuestion, answer: unknown): boolean {
  switch (q.type) {
    case "mcq":
      return answer === q.answerIndex;
    case "gap": {
      if (typeof answer !== "string") return false;
      const norm = normalizeAnswer(answer);
      return q.answers.some((a) => normalizeAnswer(a) === norm);
    }
    case "order": {
      if (!Array.isArray(answer)) return false;
      return (answer as string[]).join("¦") === q.fragments.join("¦");
    }
    case "match": {
      if (typeof answer !== "object" || answer === null) return false;
      const map = answer as Record<string, string>;
      return q.pairs.every((p) => map[p.left] === p.right);
    }
  }
}

export function correctAnswerLabel(q: ExerciseQuestion): string {
  switch (q.type) {
    case "mcq":
      return q.options[q.answerIndex];
    case "gap":
      return q.answers[0];
    case "order":
      return q.fragments.join(" ");
    case "match":
      return q.pairs.map((p) => `${p.left} → ${p.right}`).join(" · ");
  }
}
