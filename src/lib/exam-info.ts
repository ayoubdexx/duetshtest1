/** Reference information about the official Goethe & TELC exam formats (guide values). */

export interface ExamFormatSection {
  name: string;
  durationMin: number;
  tasks: string;
}

export interface ExamFormatInfo {
  name: string;
  sections: ExamFormatSection[];
  passing: string;
  note?: string;
}

export const GOETHE_INFO: Record<string, ExamFormatInfo> = {
  A1: {
    name: "Goethe-Zertifikat A1: Start Deutsch 1",
    sections: [
      { name: "Lesen", durationMin: 25, tasks: "3 tasks — short texts, ads and notices with true/false and matching questions" },
      { name: "Hören", durationMin: 20, tasks: "3 tasks — everyday conversations, announcements and phone messages" },
      { name: "Schreiben", durationMin: 20, tasks: "2 tasks — fill in a form and write a short message (~30 words)" },
      { name: "Sprechen", durationMin: 15, tasks: "3 parts in a group — introduce yourself, ask & answer, make requests" },
    ],
    passing: "60 of 100 points overall",
  },
  A2: {
    name: "Goethe-Zertifikat A2",
    sections: [
      { name: "Lesen", durationMin: 30, tasks: "4 tasks — articles, ads, notices and short everyday texts" },
      { name: "Hören", durationMin: 30, tasks: "4 tasks — announcements, radio, everyday dialogues" },
      { name: "Schreiben", durationMin: 30, tasks: "2 tasks — SMS/message (~20-30 words) and semi-formal email" },
      { name: "Sprechen", durationMin: 15, tasks: "3 parts — questions about yourself, describing daily life, planning together" },
    ],
    passing: "60% overall",
  },
  B1: {
    name: "Goethe-Zertifikat B1",
    sections: [
      { name: "Lesen", durationMin: 65, tasks: "5 tasks — blog posts, emails, newspaper articles, ads, instructions" },
      { name: "Hören", durationMin: 40, tasks: "4 tasks — announcements, presentations, conversations, radio discussions" },
      { name: "Schreiben", durationMin: 60, tasks: "3 tasks — informal email, forum post with opinion, semi-formal email" },
      { name: "Sprechen", durationMin: 15, tasks: "3 parts — planning together, presentation (~3 min), feedback & questions" },
    ],
    passing: "60% per module (modules can be taken separately)",
    note: "B1 is modular — you can pass or retake each skill individually.",
  },
  B2: {
    name: "Goethe-Zertifikat B2",
    sections: [
      { name: "Lesen", durationMin: 65, tasks: "5 tasks — press articles, commentaries, opinion pieces, rules" },
      { name: "Hören", durationMin: 40, tasks: "4 tasks — interviews, lectures, everyday and media conversations" },
      { name: "Schreiben", durationMin: 75, tasks: "2 tasks — forum post with argumentation (~150 words) and formal message" },
      { name: "Sprechen", durationMin: 15, tasks: "2 parts — presentation with discussion, debate with a partner" },
    ],
    passing: "60% per module",
    note: "Since 2019 the B2 exam is modular, digital versions available in many test centers.",
  },
};

export const TELC_INFO: Record<string, ExamFormatInfo> = {
  A1: {
    name: "telc Deutsch A1",
    sections: [
      { name: "Hören", durationMin: 20, tasks: "3 parts — short statements, announcements and phone messages" },
      { name: "Lesen + Schreiben", durationMin: 45, tasks: "Reading: 3 parts. Writing: fill in a form and write a short text" },
      { name: "Sprechen", durationMin: 11, tasks: "3 parts in a group — introduction, information exchange, making requests" },
    ],
    passing: "60% overall",
  },
  A2: {
    name: "telc Deutsch A2 (Start Deutsch 2)",
    sections: [
      { name: "Hören", durationMin: 20, tasks: "3 parts — everyday conversations and announcements" },
      { name: "Lesen + Sprachbausteine", durationMin: 50, tasks: "Reading comprehension plus language elements (grammar in context)" },
      { name: "Schreiben", durationMin: 30, tasks: "Write a short personal message" },
      { name: "Sprechen", durationMin: 15, tasks: "3 parts — about yourself, information exchange, negotiating" },
    ],
    passing: "60% overall",
  },
  B1: {
    name: "telc Deutsch B1 (Zertifikat Deutsch)",
    sections: [
      { name: "Lesen + Sprachbausteine", durationMin: 90, tasks: "5 reading tasks plus 2 Sprachbausteine tasks (grammar & vocabulary in context)" },
      { name: "Hören", durationMin: 30, tasks: "3 parts — announcements, conversations, radio" },
      { name: "Schreiben", durationMin: 30, tasks: "1 task — semi-formal letter/email answering 3 of 4 guiding points" },
      { name: "Sprechen", durationMin: 15, tasks: "3 parts — contact conversation, topic discussion, planning a task together" },
    ],
    passing: "60% in written AND oral part",
    note: "Widely accepted for German citizenship and permanent residence applications.",
  },
  B2: {
    name: "telc Deutsch B2",
    sections: [
      { name: "Lesen + Sprachbausteine", durationMin: 90, tasks: "Global, detailed and selective reading plus language elements" },
      { name: "Hören", durationMin: 20, tasks: "Global, detailed and selective listening" },
      { name: "Schreiben", durationMin: 30, tasks: "Formal letter/email — complaint, application or inquiry" },
      { name: "Sprechen", durationMin: 15, tasks: "3 parts — presentation, discussion, problem solving (with 20 min preparation)" },
    ],
    passing: "60% in written AND oral part",
    note: "telc B2 is a standard requirement for many professional recognitions (e.g. nursing).",
  },
};

export const EXAM_STRATEGIES: { skill: string; emoji: string; title: string; tips: string[] }[] = [
  {
    skill: "READING",
    emoji: "📖",
    title: "Lesen — read the questions first",
    tips: [
      "Read the questions BEFORE the text — you'll know what to scan for.",
      "Don't panic over unknown words; you rarely need every word to answer.",
      "Watch for negations (nicht, kein) in questions — classic trap.",
      "Manage time per task: if stuck, mark a guess and move on.",
      "In matching tasks, cross out options you've used (when allowed).",
    ],
  },
  {
    skill: "LISTENING",
    emoji: "🎧",
    title: "Hören — anticipate before the audio starts",
    tips: [
      "Use the pause before each recording to read the items — predict what you'll hear.",
      "First listening: global understanding. Second: details.",
      "Numbers, dates, times and prices are favorite test points — write them instantly.",
      "Never leave a blank; eliminate and guess.",
      "Train with 1.25× speed at home — the real exam will feel slow.",
    ],
  },
  {
    skill: "WRITING",
    emoji: "✍️",
    title: "Schreiben — structure wins points",
    tips: [
      "Answer EVERY guiding point in the task — missed points cost more than grammar errors.",
      "Memorize your greeting/closing pairs: Sehr geehrte… + Mit freundlichen Grüßen (formal).",
      "Use connectors (weil, deshalb, trotzdem) — they directly raise the communication score.",
      "Keep 5 minutes to re-read: check verb position and noun capitalization.",
      "Learn one flexible template per text type — adapt, don't invent under pressure.",
    ],
  },
  {
    skill: "SPEAKING",
    emoji: "🗣",
    title: "Sprechen — fluency beats perfection",
    tips: [
      "Mistakes are fine; silence is not. Keep talking with fillers: also, na ja, ich meine…",
      "Learn reaction phrases: Das finde ich auch. / Da bin ich anderer Meinung.",
      "In planning dialogues, make suggestions AND respond to your partner's ideas.",
      "For presentations, follow a fixed skeleton: intro → 2-3 points → personal opinion → closing.",
      "Practice with a timer — knowing what 3 minutes feels like removes half the stress.",
    ],
  },
];
