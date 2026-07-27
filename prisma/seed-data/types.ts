import type {
  LessonBlock,
  Homework,
  ExerciseQuestion,
  GlossaryEntry,
  GrammarNote,
  CheatSheet,
  ExamSection,
  WritingTemplate,
  DialogueLine,
  PhraseGroup,
  VerbExample,
} from "../../src/types/content";

export interface LessonSeed {
  slug: string;
  title: string;
  subtitle?: string;
  type?: "STANDARD" | "REVISION" | "MINI_TEST" | "FINAL_EXAM";
  durationMin?: number;
  xpReward?: number;
  objectives?: string[];
  blocks: LessonBlock[];
  homework?: Homework;
}

export interface ModuleSeed {
  slug: string;
  title: string;
  description: string;
  icon: string;
  lessons: LessonSeed[];
}

export interface GrammarSeed {
  slug: string;
  levelCode: string;
  title: string;
  category: string;
  summary: string;
  blocks: LessonBlock[];
  cheatSheet?: CheatSheet;
}

export interface VocabWordSeed {
  german: string;
  article?: string;
  plural?: string;
  pos?: string;
  ipa?: string;
  meaning: string;
  exampleDe: string;
  exampleEn?: string;
  synonyms?: string[];
  opposites?: string[];
  expressions?: { de: string; en: string }[];
  memoryTip?: string;
  difficulty?: number;
}

export interface VocabTopicSeed {
  slug: string;
  levelCode: string;
  title: string;
  description?: string;
  icon?: string;
  words: VocabWordSeed[];
}

export interface ReadingSeed {
  slug: string;
  levelCode: string;
  title: string;
  topic?: string;
  intro?: string;
  body: string;
  glossary?: GlossaryEntry[];
  grammarNotes?: GrammarNote[];
  questions: ExerciseQuestion[];
}

export interface ListeningSeed {
  slug: string;
  levelCode: string;
  title: string;
  description?: string;
  transcript: string;
  /** Dialogue used for TTS generation */
  dialogue: { speaker: string; text: string }[];
  vocabulary?: GlossaryEntry[];
  questions: ExerciseQuestion[];
}

export interface SpeakingSeed {
  slug: string;
  levelCode: string;
  title: string;
  type: "ROLEPLAY" | "CONVERSATION" | "INTERVIEW" | "PRONUNCIATION" | "CHALLENGE";
  description?: string;
  prompt: string;
  dialogue?: DialogueLine[];
  phrases?: PhraseGroup[];
  tips?: string[];
}

export interface WritingSeed {
  slug: string;
  levelCode: string;
  title: string;
  type: "EMAIL" | "LETTER" | "MESSAGE" | "ESSAY" | "EXAM_TASK";
  prompt: string;
  minWords: number;
  template?: WritingTemplate;
  sampleAnswer?: string;
  tips?: string[];
}

export interface ExerciseSeed {
  slug: string;
  levelCode: string;
  title: string;
  skill: "GRAMMAR" | "VOCABULARY" | "READING" | "LISTENING";
  type: "MCQ" | "GAP_FILL" | "ORDERING" | "MATCHING";
  instructions?: string;
  questions: ExerciseQuestion[];
  grammarTopicSlug?: string;
  xpReward?: number;
}

export interface ExamSeed {
  slug: string;
  provider: "GOETHE" | "TELC";
  levelCode: string;
  title: string;
  description?: string;
  durationMin: number;
  passScore?: number;
  sections: ExamSection[];
}

export interface VerbSeedInput {
  infinitive: string;
  english: string;
  level: string;
  aux?: "haben" | "sein";
  /** du/er-sie-es stem change for irregular Präsens, e.g. "fährst/fährt" */
  praesens?: { du: string; er: string };
  /** Präteritum 1st person singular, e.g. "ging". If absent → regular (stem + te). */
  praeteritum?: string;
  /** Partizip II, e.g. "gegangen". If absent → regular ge+stem+t. */
  partizip2?: string;
  /** Konjunktiv II 1st person (hätte, wäre, könnte…). If absent → würde + Infinitiv. */
  konjunktiv2?: string;
  separablePrefix?: string;
  examples?: VerbExample[];
}
