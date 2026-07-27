/**
 * Content type contracts — shared by seed data, API routes and renderers.
 * All rich content is stored as validated JSON in PostgreSQL.
 */

// ───────────────────────── Lesson blocks ─────────────────────────

export type CalloutVariant = "tip" | "warning" | "info" | "culture" | "grammar";

export interface ExampleItem {
  de: string;
  en: string;
  note?: string;
}

export interface DialogueLine {
  speaker: string;
  de: string;
  en?: string;
}

export interface MiniWord {
  de: string;
  en: string;
  note?: string;
}

export interface MistakeItem {
  wrong: string;
  right: string;
  why: string;
}

export type LessonBlock =
  | { type: "heading"; text: string; id?: string }
  | { type: "text"; md: string }
  | { type: "callout"; variant: CalloutVariant; title?: string; md: string }
  | { type: "examples"; title?: string; items: ExampleItem[] }
  | { type: "table"; title?: string; caption?: string; headers: string[]; rows: string[][] }
  | { type: "dialogue"; title?: string; audioUrl?: string; lines: DialogueLine[] }
  | { type: "vocab"; title?: string; words: MiniWord[] }
  | { type: "mistakes"; title?: string; items: MistakeItem[] }
  | { type: "exercise"; slug: string }
  | { type: "audio"; title?: string; audioUrl: string; transcript?: string }
  | { type: "divider" };

export interface Homework {
  title?: string;
  tasks: string[];
}

// ───────────────────────── Questions ─────────────────────────

export type QuestionType = "mcq" | "gap" | "order" | "match";

export interface BaseQuestion {
  id: string;
  type: QuestionType;
  prompt: string;
  explanation?: string;
}

export interface McqQuestion extends BaseQuestion {
  type: "mcq";
  options: string[];
  answerIndex: number;
}

export interface GapQuestion extends BaseQuestion {
  type: "gap";
  /** Accepted answers (first is canonical) */
  answers: string[];
  hint?: string;
}

export interface OrderQuestion extends BaseQuestion {
  type: "order";
  /** Fragments in the CORRECT order (shuffled client-side) */
  fragments: string[];
}

export interface MatchQuestion extends BaseQuestion {
  type: "match";
  pairs: { left: string; right: string }[];
}

export type ExerciseQuestion = McqQuestion | GapQuestion | OrderQuestion | MatchQuestion;

// ───────────────────────── Reading ─────────────────────────

export interface GlossaryEntry {
  de: string;
  en: string;
  note?: string;
}

export interface GrammarNote {
  quote: string;
  topic: string;
  note: string;
}

// ───────────────────────── Grammar ─────────────────────────

export interface CheatSheet {
  title: string;
  points: string[];
  table?: { headers: string[]; rows: string[][] };
}

// ───────────────────────── Exams ─────────────────────────

export interface ExamWritingPrompt {
  prompt: string;
  minWords: number;
  points: number;
  sample?: string;
  criteria?: string[];
}

export interface ExamSpeakingPrompt {
  prompt: string;
  prepMin?: number;
  talkMin?: number;
  sample?: string;
}

export interface ExamPart {
  id: string;
  title: string;
  instructions: string;
  passage?: string;
  audioUrl?: string;
  transcript?: string;
  questions?: ExerciseQuestion[];
  pointsPerQuestion?: number;
  writing?: ExamWritingPrompt;
  speaking?: ExamSpeakingPrompt;
}

export interface ExamSection {
  id: string;
  title: string;
  skill: "READING" | "LISTENING" | "WRITING" | "SPEAKING" | "LANGUAGE";
  durationMin: number;
  intro?: string;
  parts: ExamPart[];
}

// ───────────────────────── Verbs ─────────────────────────

export interface SixForms {
  ich: string;
  du: string;
  er: string;
  wir: string;
  ihr: string;
  sie: string;
}

export interface VerbForms {
  praesens: SixForms;
  praeteritum: SixForms;
  perfekt: SixForms;
  futur1: SixForms;
  konjunktiv2: SixForms;
  imperativ: { du: string; ihr: string; Sie: string };
  passiv?: { praesens: string; praeteritum: string };
}

export interface VerbExample {
  de: string;
  en: string;
  tense: string;
}

// ───────────────────────── Writing ─────────────────────────

export interface WritingTemplate {
  sections: { label: string; example: string }[];
  phrases?: { label: string; items: string[] }[];
}

export interface WritingFeedback {
  score: number;
  summary: string;
  strengths: string[];
  issues: { quote?: string; problem: string; suggestion: string }[];
  vocabularyTips: string[];
  correctedVersion?: string;
  source: "ai" | "rules";
}

// ───────────────────────── Speaking ─────────────────────────

export interface PhraseGroup {
  label: string;
  items: string[];
}
