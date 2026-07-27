/** Achievement definitions — seeded into the DB and checked against user metrics. */

export type AchievementMetric =
  | "lessons"
  | "streak"
  | "xp"
  | "reviews"
  | "deck"
  | "exercises"
  | "examsPassed"
  | "writings"
  | "groups"
  | "notes"
  | "certificates";

export interface AchievementDef {
  code: string;
  title: string;
  description: string;
  icon: string;
  xp: number;
  tier: number;
  metric: AchievementMetric;
  threshold: number;
}

export const ACHIEVEMENT_DEFS: AchievementDef[] = [
  // Lessons
  { code: "LESSON_1", title: "Erste Schritte", description: "Complete your first lesson", icon: "👣", xp: 25, tier: 1, metric: "lessons", threshold: 1 },
  { code: "LESSON_10", title: "Auf Kurs", description: "Complete 10 lessons", icon: "📗", xp: 50, tier: 2, metric: "lessons", threshold: 10 },
  { code: "LESSON_25", title: "Halbe Miete", description: "Complete 25 lessons", icon: "📘", xp: 100, tier: 3, metric: "lessons", threshold: 25 },
  { code: "LESSON_50", title: "Lernmaschine", description: "Complete 50 lessons", icon: "🏛", xp: 200, tier: 4, metric: "lessons", threshold: 50 },
  // Streak
  { code: "STREAK_3", title: "Dranbleiben", description: "3-day study streak", icon: "🔥", xp: 25, tier: 1, metric: "streak", threshold: 3 },
  { code: "STREAK_7", title: "Eine Woche stark", description: "7-day study streak", icon: "⚡", xp: 50, tier: 2, metric: "streak", threshold: 7 },
  { code: "STREAK_14", title: "Gewohnheitstier", description: "14-day study streak", icon: "💪", xp: 100, tier: 3, metric: "streak", threshold: 14 },
  { code: "STREAK_30", title: "Eiserner Wille", description: "30-day study streak", icon: "🏆", xp: 250, tier: 4, metric: "streak", threshold: 30 },
  // XP
  { code: "XP_100", title: "Punktesammler", description: "Earn 100 XP", icon: "✨", xp: 10, tier: 1, metric: "xp", threshold: 100 },
  { code: "XP_500", title: "Aufsteiger", description: "Earn 500 XP", icon: "🌟", xp: 25, tier: 2, metric: "xp", threshold: 500 },
  { code: "XP_1500", title: "Überflieger", description: "Earn 1,500 XP", icon: "💫", xp: 50, tier: 3, metric: "xp", threshold: 1500 },
  { code: "XP_5000", title: "Legende", description: "Earn 5,000 XP", icon: "👑", xp: 100, tier: 4, metric: "xp", threshold: 5000 },
  // Flashcards
  { code: "REVIEW_50", title: "Karten-Kenner", description: "Review 50 flashcards", icon: "🃏", xp: 25, tier: 1, metric: "reviews", threshold: 50 },
  { code: "REVIEW_250", title: "Gedächtnis-Profi", description: "Review 250 flashcards", icon: "🧠", xp: 75, tier: 2, metric: "reviews", threshold: 250 },
  { code: "REVIEW_1000", title: "Anki-Flüsterer", description: "Review 1,000 flashcards", icon: "🔮", xp: 150, tier: 3, metric: "reviews", threshold: 1000 },
  { code: "DECK_50", title: "Wortschatz-Bauer", description: "Add 50 words to your deck", icon: "📦", xp: 25, tier: 1, metric: "deck", threshold: 50 },
  { code: "DECK_200", title: "Wörter-Sammler", description: "Add 200 words to your deck", icon: "🗃", xp: 75, tier: 2, metric: "deck", threshold: 200 },
  // Exercises
  { code: "EXERCISE_10", title: "Fleißig, fleißig", description: "Finish 10 exercises", icon: "✏️", xp: 25, tier: 1, metric: "exercises", threshold: 10 },
  { code: "EXERCISE_50", title: "Übungsmeister", description: "Finish 50 exercises", icon: "🏋️", xp: 75, tier: 2, metric: "exercises", threshold: 50 },
  // Exams
  { code: "EXAM_PASS_1", title: "Prüfung bestanden!", description: "Pass your first mock exam", icon: "🎓", xp: 100, tier: 2, metric: "examsPassed", threshold: 1 },
  { code: "EXAM_PASS_3", title: "Prüfungsprofi", description: "Pass 3 mock exams", icon: "🥇", xp: 200, tier: 3, metric: "examsPassed", threshold: 3 },
  // Writing
  { code: "WRITING_1", title: "Erster Text", description: "Submit your first writing task", icon: "🖋", xp: 25, tier: 1, metric: "writings", threshold: 1 },
  { code: "WRITING_10", title: "Vielschreiber", description: "Submit 10 writing tasks", icon: "📝", xp: 75, tier: 2, metric: "writings", threshold: 10 },
  // Community & notes
  { code: "GROUP_1", title: "Gemeinsam stärker", description: "Join a study group", icon: "🤝", xp: 25, tier: 1, metric: "groups", threshold: 1 },
  { code: "NOTES_5", title: "Ordnung muss sein", description: "Create 5 notes", icon: "🗒", xp: 25, tier: 1, metric: "notes", threshold: 5 },
  // Certificates
  { code: "CERT_1", title: "Zertifiziert", description: "Earn a level certificate", icon: "📜", xp: 150, tier: 3, metric: "certificates", threshold: 1 },
];
