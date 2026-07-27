import type { WritingFeedback } from "@/types/content";

interface FeedbackInput {
  levelCode: string;
  taskType: string;
  prompt: string;
  minWords: number;
  content: string;
  sampleAnswer?: string | null;
}

/** AI-powered feedback via any OpenAI-compatible endpoint; graceful rule-based fallback without a key. */
export async function getWritingFeedback(input: FeedbackInput): Promise<WritingFeedback> {
  const key = process.env.AI_API_KEY;
  if (key) {
    try {
      const ai = await aiFeedback(input, key);
      if (ai) return ai;
    } catch (err) {
      console.error("[ai] feedback failed, falling back to rules:", err);
    }
  }
  return ruleBasedFeedback(input);
}

async function aiFeedback(input: FeedbackInput, key: string): Promise<WritingFeedback | null> {
  const baseUrl = process.env.AI_BASE_URL ?? "https://api.openai.com/v1";
  const model = process.env.AI_MODEL ?? "gpt-4o-mini";

  const system = `You are an experienced German teacher correcting a CEFR ${input.levelCode} student's writing. Be encouraging but precise. Judge ONLY against ${input.levelCode} expectations. Respond with strict JSON:
{"score": <0-100>, "summary": "<2 sentences>", "strengths": ["…"], "issues": [{"quote": "<student text>", "problem": "<what's wrong>", "suggestion": "<corrected version>"}], "vocabularyTips": ["<better word/phrase choices>"], "correctedVersion": "<full corrected text>"}`;

  const user = `Task (${input.taskType}): ${input.prompt}\nMinimum words: ${input.minWords}\n\nStudent's text:\n"""\n${input.content}\n"""`;

  const res = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
      temperature: 0.3,
      response_format: { type: "json_object" },
    }),
  });
  if (!res.ok) return null;

  const json = await res.json();
  const text: string | undefined = json.choices?.[0]?.message?.content;
  if (!text) return null;

  const parsed = JSON.parse(text);
  return {
    score: Math.max(0, Math.min(100, Number(parsed.score) || 0)),
    summary: String(parsed.summary ?? ""),
    strengths: Array.isArray(parsed.strengths) ? parsed.strengths.map(String).slice(0, 5) : [],
    issues: Array.isArray(parsed.issues)
      ? parsed.issues.slice(0, 10).map((i: Record<string, unknown>) => ({
          quote: i.quote ? String(i.quote) : undefined,
          problem: String(i.problem ?? ""),
          suggestion: String(i.suggestion ?? ""),
        }))
      : [],
    vocabularyTips: Array.isArray(parsed.vocabularyTips) ? parsed.vocabularyTips.map(String).slice(0, 5) : [],
    correctedVersion: parsed.correctedVersion ? String(parsed.correctedVersion) : undefined,
    source: "ai",
  };
}

const CONNECTORS = ["weil", "deshalb", "trotzdem", "außerdem", "aber", "denn", "dann", "danach", "zuerst", "obwohl", "während", "deswegen", "und", "oder"];
const GREETINGS = ["sehr geehrte", "liebe", "lieber", "hallo", "guten tag"];
const CLOSINGS = ["mit freundlichen grüßen", "viele grüße", "liebe grüße", "herzliche grüße", "bis bald", "lg", "mfg"];

function ruleBasedFeedback(input: FeedbackInput): WritingFeedback {
  const text = input.content.trim();
  const lower = text.toLowerCase();
  const words = text.split(/\s+/).filter(Boolean);
  const sentences = text.split(/[.!?]+/).map((s) => s.trim()).filter(Boolean);
  const isLetterLike = ["EMAIL", "LETTER", "EXAM_TASK"].includes(input.taskType);

  const strengths: string[] = [];
  const issues: WritingFeedback["issues"] = [];
  const vocabularyTips: string[] = [];
  let score = 55;

  // Length
  if (words.length >= input.minWords) {
    score += 12;
    strengths.push(`Good length — ${words.length} words (minimum: ${input.minWords}).`);
  } else {
    score -= 12;
    issues.push({
      problem: `Your text has ${words.length} words, but the task asks for at least ${input.minWords}.`,
      suggestion: "Add one or two more details — a reason (weil …) or an example makes any text stronger.",
    });
  }

  // Structure for letters/emails
  if (isLetterLike) {
    const hasGreeting = GREETINGS.some((g) => lower.includes(g));
    const hasClosing = CLOSINGS.some((c) => lower.includes(c));
    if (hasGreeting) {
      score += 6;
      strengths.push("You opened with a proper greeting.");
    } else {
      score -= 6;
      issues.push({
        problem: "No greeting found at the start.",
        suggestion: 'Formal: "Sehr geehrte Damen und Herren," · Informal: "Liebe Anna," / "Hallo Tom,"',
      });
    }
    if (hasClosing) {
      score += 6;
      strengths.push("You finished with an appropriate closing formula.");
    } else {
      score -= 6;
      issues.push({
        problem: "No closing formula found at the end.",
        suggestion: 'Formal: "Mit freundlichen Grüßen" · Informal: "Viele Grüße" — followed by your name.',
      });
    }
  }

  // Sentence variety
  const avgLen = sentences.length > 0 ? words.length / sentences.length : 0;
  if (sentences.length >= 3 && avgLen >= 6 && avgLen <= 16) {
    score += 8;
    strengths.push("Nice sentence rhythm — not too short, not too long.");
  } else if (avgLen > 20) {
    issues.push({
      problem: "Your sentences are very long on average.",
      suggestion: "Shorter sentences are easier to keep grammatically correct — aim for 8–14 words.",
    });
  }

  // Connectors
  const usedConnectors = CONNECTORS.filter((c) => new RegExp(`\\b${c}\\b`, "i").test(lower));
  if (usedConnectors.length >= 2) {
    score += 8;
    strengths.push(`Good use of connectors (${usedConnectors.slice(0, 3).join(", ")}).`);
  } else {
    vocabularyTips.push("Connect your ideas with weil, deshalb, außerdem or trotzdem — connectors lift any text a level.");
  }

  // Capitalization heuristic: sentences should start uppercase
  const lowercaseStarts = sentences.filter((s) => /^[a-zäöüß]/.test(s)).length;
  if (lowercaseStarts > 0) {
    score -= 4;
    issues.push({
      problem: `${lowercaseStarts} sentence${lowercaseStarts === 1 ? "" : "s"} start${lowercaseStarts === 1 ? "s" : ""} with a lowercase letter.`,
      suggestion: "Every German sentence starts with a capital letter — and don't forget: all nouns are capitalized too.",
    });
  }

  // Umlaut hint
  if (!/[äöüß]/.test(text) && words.length > 30) {
    vocabularyTips.push('No umlauts (ä, ö, ü) in your text — double-check words like "für", "möchte" and "grüße".');
  }

  vocabularyTips.push("Compare your text with the native sample answer below and steal two phrases you like.");

  score = Math.max(20, Math.min(92, score));

  return {
    score,
    summary:
      score >= 75
        ? "Solid work! Your text fulfils the task well — polish the details below and it's excellent."
        : score >= 55
          ? "Good foundation. The structure is there; focus on the specific points below to level up."
          : "A brave start! Work through the points below, then rewrite the text once — rewriting is where the learning happens.",
    strengths: strengths.length > 0 ? strengths : ["You completed the task — that's the most important step."],
    issues,
    vocabularyTips,
    source: "rules",
  };
}
