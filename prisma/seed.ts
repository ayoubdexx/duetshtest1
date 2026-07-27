/**
 * Deutschwerk seed — idempotent upserts for all curriculum content,
 * achievements and demo accounts.
 *
 * Run: pnpm db:seed
 */
import { PrismaClient, Prisma } from "@prisma/client";
import bcrypt from "bcryptjs";
import { LEVELS_SEED } from "./seed-data/levels";
import { MODULES_A1 } from "./seed-data/lessons-a1";
import { MODULES_A2, MODULES_B1, MODULES_B2 } from "./seed-data/lessons-a2b";
import { GRAMMAR_A } from "./seed-data/grammar-a";
import { GRAMMAR_B } from "./seed-data/grammar-b";
import { VOCAB_A } from "./seed-data/vocab-a";
import { VOCAB_B } from "./seed-data/vocab-b";
import { VERBS_SEED, conjugate } from "./seed-data/conjugator";
import { READINGS, LISTENINGS } from "./seed-data/skills-1";
import { SPEAKINGS, WRITINGS } from "./seed-data/skills-2";
import { EXERCISES_A } from "./seed-data/exercises-1";
import { EXERCISES_B } from "./seed-data/exercises-2";
import { EXAMS } from "./seed-data/exams";
import { ACHIEVEMENT_DEFS } from "../src/lib/achievement-defs";
import type { ModuleSeed } from "./seed-data/types";

const prisma = new PrismaClient();

const j = (x: unknown) => x as Prisma.InputJsonValue;

async function seedLevels() {
  for (const l of LEVELS_SEED) {
    await prisma.level.upsert({
      where: { code: l.code },
      update: { title: l.title, tagline: l.tagline, description: l.description, color: l.color, order: l.order },
      create: l,
    });
  }
  console.log(`✓ ${LEVELS_SEED.length} levels`);
}

async function seedModules(levelCode: string, modules: ModuleSeed[]) {
  let lessonCount = 0;
  for (let mi = 0; mi < modules.length; mi++) {
    const m = modules[mi];
    const moduleRow = await prisma.module.upsert({
      where: { slug: m.slug },
      update: { title: m.title, description: m.description, icon: m.icon, order: mi + 1, levelCode },
      create: { slug: m.slug, title: m.title, description: m.description, icon: m.icon, order: mi + 1, levelCode },
    });
    for (let li = 0; li < m.lessons.length; li++) {
      const l = m.lessons[li];
      const data = {
        moduleId: moduleRow.id,
        order: li + 1,
        title: l.title,
        subtitle: l.subtitle ?? null,
        type: l.type ?? "STANDARD",
        durationMin: l.durationMin ?? 25,
        xpReward: l.xpReward ?? 50,
        objectives: l.objectives ? j(l.objectives) : Prisma.JsonNull,
        blocks: j(l.blocks),
        homework: l.homework ? j(l.homework) : Prisma.JsonNull,
        published: true,
      } as const;
      await prisma.lesson.upsert({
        where: { slug: l.slug },
        update: data,
        create: { slug: l.slug, ...data },
      });
      lessonCount++;
    }
  }
  console.log(`✓ ${levelCode}: ${modules.length} modules, ${lessonCount} lessons`);
}

async function seedGrammar() {
  const all = [...GRAMMAR_A, ...GRAMMAR_B];
  for (let i = 0; i < all.length; i++) {
    const g = all[i];
    const data = {
      levelCode: g.levelCode,
      order: i + 1,
      title: g.title,
      category: g.category,
      summary: g.summary,
      blocks: j(g.blocks),
      cheatSheet: g.cheatSheet ? j(g.cheatSheet) : Prisma.JsonNull,
    };
    await prisma.grammarTopic.upsert({ where: { slug: g.slug }, update: data, create: { slug: g.slug, ...data } });
  }
  console.log(`✓ ${all.length} grammar topics`);
}

async function seedVocab() {
  const all = [...VOCAB_A, ...VOCAB_B];
  let words = 0;
  for (let i = 0; i < all.length; i++) {
    const t = all[i];
    const topic = await prisma.vocabTopic.upsert({
      where: { slug: t.slug },
      update: { levelCode: t.levelCode, order: i + 1, title: t.title, description: t.description ?? null, icon: t.icon ?? "book" },
      create: { slug: t.slug, levelCode: t.levelCode, order: i + 1, title: t.title, description: t.description ?? null, icon: t.icon ?? "book" },
    });
    // Recreate words for the topic (content is source-of-truth in seed files)
    await prisma.vocabWord.deleteMany({ where: { topicId: topic.id } });
    await prisma.vocabWord.createMany({
      data: t.words.map((w) => ({
        topicId: topic.id,
        german: w.german,
        article: w.article ?? null,
        plural: w.plural ?? null,
        pos: w.pos ?? (w.article ? "noun" : "phrase"),
        ipa: w.ipa ?? null,
        meaning: w.meaning,
        exampleDe: w.exampleDe,
        exampleEn: w.exampleEn ?? null,
        synonyms: w.synonyms ? j(w.synonyms) : Prisma.JsonNull,
        opposites: w.opposites ? j(w.opposites) : Prisma.JsonNull,
        expressions: w.expressions ? j(w.expressions) : Prisma.JsonNull,
        memoryTip: w.memoryTip ?? null,
        difficulty: w.difficulty ?? 1,
      })),
    });
    words += t.words.length;
  }
  console.log(`✓ ${all.length} vocab topics, ${words} words`);
}

async function seedVerbs() {
  for (const v of VERBS_SEED) {
    const forms = conjugate(v);
    const data = {
      english: v.english,
      levelCode: v.level,
      isIrregular: !!(v.praesens || v.praeteritum || v.partizip2),
      isSeparable: !!v.separablePrefix,
      auxiliary: v.aux ?? "haben",
      partizip2: v.partizip2 ?? forms.perfekt.ich.split(" ").slice(1).join(" "),
      forms: j(forms),
      examples: v.examples ? j(v.examples) : Prisma.JsonNull,
    };
    await prisma.verb.upsert({ where: { infinitive: v.infinitive }, update: data, create: { infinitive: v.infinitive, ...data } });
  }
  console.log(`✓ ${VERBS_SEED.length} verbs (fully conjugated)`);
}

async function seedSkillsContent() {
  for (let i = 0; i < READINGS.length; i++) {
    const r = READINGS[i];
    const wordCount = r.body.split(/\s+/).filter(Boolean).length;
    const data = {
      levelCode: r.levelCode, order: i + 1, title: r.title, topic: r.topic ?? null, wordCount,
      intro: r.intro ?? null, body: r.body,
      glossary: r.glossary ? j(r.glossary) : Prisma.JsonNull,
      grammarNotes: r.grammarNotes ? j(r.grammarNotes) : Prisma.JsonNull,
      questions: j(r.questions),
    };
    await prisma.readingText.upsert({ where: { slug: r.slug }, update: data, create: { slug: r.slug, ...data } });
  }
  console.log(`✓ ${READINGS.length} readings`);

  const LISTENING_DURATIONS: Record<string, number> = {
    "im-supermarkt": 17,
    "am-bahnhof": 23,
    "anruf-beim-arzt": 25,
    "die-einladung": 26,
    "wg-besichtigung": 37,
    "radio-umfrage-handy": 31,
    "vorstellungsgespraech": 43,
    "podcast-nachhaltigkeit": 61,
  };
  for (let i = 0; i < LISTENINGS.length; i++) {
    const l = LISTENINGS[i];
    const data = {
      levelCode: l.levelCode, order: i + 1, title: l.title, description: l.description ?? null,
      audioUrl: `/audio/${l.slug}.mp3`, durationSec: LISTENING_DURATIONS[l.slug] ?? 0, transcript: l.transcript,
      vocabulary: l.vocabulary ? j(l.vocabulary) : Prisma.JsonNull,
      questions: j(l.questions),
    };
    await prisma.listeningExercise.upsert({ where: { slug: l.slug }, update: data, create: { slug: l.slug, ...data } });
  }
  console.log(`✓ ${LISTENINGS.length} listening exercises`);

  for (let i = 0; i < SPEAKINGS.length; i++) {
    const s = SPEAKINGS[i];
    const data = {
      levelCode: s.levelCode, order: i + 1, title: s.title, type: s.type, description: s.description ?? null,
      prompt: s.prompt,
      dialogue: s.dialogue ? j(s.dialogue) : Prisma.JsonNull,
      phrases: s.phrases ? j(s.phrases) : Prisma.JsonNull,
      tips: s.tips ? j(s.tips) : Prisma.JsonNull,
    };
    await prisma.speakingActivity.upsert({ where: { slug: s.slug }, update: data, create: { slug: s.slug, ...data } });
  }
  console.log(`✓ ${SPEAKINGS.length} speaking activities`);

  for (let i = 0; i < WRITINGS.length; i++) {
    const w = WRITINGS[i];
    const data = {
      levelCode: w.levelCode, order: i + 1, title: w.title, type: w.type, prompt: w.prompt, minWords: w.minWords,
      template: w.template ? j(w.template) : Prisma.JsonNull,
      sampleAnswer: w.sampleAnswer ?? null,
      tips: w.tips ? j(w.tips) : Prisma.JsonNull,
    };
    await prisma.writingTask.upsert({ where: { slug: w.slug }, update: data, create: { slug: w.slug, ...data } });
  }
  console.log(`✓ ${WRITINGS.length} writing tasks`);
}

async function seedExercises() {
  const all = [...EXERCISES_A, ...EXERCISES_B];
  const grammarMap = new Map(
    (await prisma.grammarTopic.findMany({ select: { id: true, slug: true } })).map((g) => [g.slug, g.id])
  );
  for (const e of all) {
    const data = {
      levelCode: e.levelCode,
      title: e.title,
      skill: e.skill,
      type: e.type,
      instructions: e.instructions ?? null,
      questions: j(e.questions),
      xpReward: e.xpReward ?? 10,
      grammarTopicId: e.grammarTopicSlug ? grammarMap.get(e.grammarTopicSlug) ?? null : null,
    };
    await prisma.exercise.upsert({ where: { slug: e.slug }, update: data, create: { slug: e.slug, ...data } });
  }
  console.log(`✓ ${all.length} exercises`);
}

async function seedExams() {
  for (const e of EXAMS) {
    const data = {
      provider: e.provider,
      levelCode: e.levelCode,
      title: e.title,
      description: e.description ?? null,
      durationMin: e.durationMin,
      passScore: e.passScore ?? 60,
      sections: j(e.sections),
    };
    await prisma.mockExam.upsert({ where: { slug: e.slug }, update: data, create: { slug: e.slug, ...data } });
  }
  console.log(`✓ ${EXAMS.length} mock exams`);
}

async function seedAchievements() {
  for (const a of ACHIEVEMENT_DEFS) {
    await prisma.achievement.upsert({
      where: { code: a.code },
      update: { title: a.title, description: a.description, icon: a.icon, xp: a.xp, tier: a.tier },
      create: { code: a.code, title: a.title, description: a.description, icon: a.icon, xp: a.xp, tier: a.tier },
    });
  }
  console.log(`✓ ${ACHIEVEMENT_DEFS.length} achievements`);
}

async function seedUsers() {
  const passwordHash = await bcrypt.hash("deutschwerk", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@deutschwerk.dev" },
    update: { role: "ADMIN" },
    create: {
      name: "Alex Admin",
      email: "admin@deutschwerk.dev",
      passwordHash,
      role: "ADMIN",
      emailVerified: new Date(),
      currentLevel: "B2",
      bio: "Platform administrator",
      xp: 3200,
      streak: 2,
      longestStreak: 21,
      lastActiveAt: new Date(),
    },
  });

  const demo = await prisma.user.upsert({
    where: { email: "demo@deutschwerk.dev" },
    update: {},
    create: {
      name: "Sara El Amrani",
      email: "demo@deutschwerk.dev",
      passwordHash,
      role: "STUDENT",
      emailVerified: new Date(),
      currentLevel: "A1",
      nativeLanguage: "Arabic",
      bio: "Auf dem Weg nach Deutschland für meine Ausbildung! 🇩🇪",
      dailyGoalMin: 20,
      streak: 5,
      longestStreak: 12,
      examTarget: "Goethe B1",
      examDate: new Date(Date.now() + 45 * 86400000),
      lastActiveAt: new Date(),
    },
  });

  // ── Demo activity history (last 45 days, ~65% of days) ──
  await prisma.studyActivity.deleteMany({ where: { userId: demo.id } });
  const activities: Prisma.StudyActivityCreateManyInput[] = [];
  let totalXp = 0;
  for (let i = 44; i >= 0; i--) {
    const roll = (i * 2654435761) % 100;
    if (roll < 65 || i < 5) {
      const minutes = 10 + ((i * 37) % 35);
      const xp = 20 + ((i * 53) % 90);
      totalXp += xp;
      const d = new Date();
      d.setDate(d.getDate() - i);
      d.setHours(0, 0, 0, 0);
      activities.push({
        userId: demo.id,
        date: d,
        minutes,
        xp,
        lessons: i % 9 === 0 ? 1 : 0,
        cards: 5 + ((i * 13) % 20),
        exercises: i % 3 === 0 ? 1 : 0,
      });
    }
  }
  await prisma.studyActivity.createMany({ data: activities });
  await prisma.user.update({ where: { id: demo.id }, data: { xp: totalXp } });

  // ── Lesson progress: first three A1 lessons done, fourth in progress ──
  const firstLessons = await prisma.lesson.findMany({
    where: { module: { levelCode: "A1" } },
    orderBy: [{ module: { order: "asc" } }, { order: "asc" }],
    take: 4,
  });
  for (let i = 0; i < firstLessons.length; i++) {
    const lesson = firstLessons[i];
    const done = i < 3;
    await prisma.lessonProgress.upsert({
      where: { userId_lessonId: { userId: demo.id, lessonId: lesson.id } },
      update: {},
      create: {
        userId: demo.id,
        lessonId: lesson.id,
        status: done ? "COMPLETED" : "IN_PROGRESS",
        blockIndex: done ? 10 : 4,
        completedAt: done ? new Date(Date.now() - (10 - i * 3) * 86400000) : null,
      },
    });
  }

  // ── Flashcards from the first vocab topic ──
  const firstTopic = await prisma.vocabTopic.findFirst({
    where: { levelCode: "A1" },
    orderBy: { order: "asc" },
    include: { words: { take: 20 } },
  });
  if (firstTopic) {
    const existing = await prisma.flashcard.count({ where: { userId: demo.id } });
    if (existing === 0) {
      await prisma.flashcard.createMany({
        data: firstTopic.words.map((w, i) => ({
          userId: demo.id,
          wordId: w.id,
          front: w.article ? `${w.article} ${w.german}` : w.german,
          back: w.meaning,
          deck: firstTopic.title,
          easeFactor: 2.3 + (i % 5) * 0.1,
          intervalDays: i < 8 ? 0 : (i % 6) + 1,
          repetitions: i < 8 ? 0 : (i % 4) + 1,
          dueAt: i < 8 ? new Date() : new Date(Date.now() + ((i % 6) + 1) * 86400000),
          isFavorite: i % 7 === 0,
        })),
      });
    }
  }

  // ── Skill scores ──
  const skillSeeds: { skill: "GRAMMAR" | "VOCABULARY" | "READING" | "LISTENING" | "WRITING"; score: number; samples: number }[] = [
    { skill: "GRAMMAR", score: 78, samples: 12 },
    { skill: "VOCABULARY", score: 86, samples: 15 },
    { skill: "READING", score: 72, samples: 6 },
    { skill: "LISTENING", score: 64, samples: 5 },
    { skill: "WRITING", score: 70, samples: 4 },
  ];
  for (const s of skillSeeds) {
    await prisma.skillScore.upsert({
      where: { userId_skill: { userId: demo.id, skill: s.skill } },
      update: {},
      create: { userId: demo.id, skill: s.skill, score: s.score, samples: s.samples },
    });
  }

  // ── Study group with both users ──
  const group = await prisma.studyGroup.upsert({
    where: { code: "LERNEN" },
    update: {},
    create: {
      name: "Deutsch bis B2 🚀",
      code: "LERNEN",
      description: "Wir schaffen das zusammen — tägliche Motivation und wöchentliche Challenges!",
      isPrivate: false,
      ownerId: demo.id,
    },
  });
  await prisma.groupMember.upsert({
    where: { groupId_userId: { groupId: group.id, userId: demo.id } },
    update: {},
    create: { groupId: group.id, userId: demo.id, role: "OWNER" },
  });
  await prisma.groupMember.upsert({
    where: { groupId_userId: { groupId: group.id, userId: admin.id } },
    update: {},
    create: { groupId: group.id, userId: admin.id, role: "MEMBER" },
  });
  const msgCount = await prisma.groupMessage.count({ where: { groupId: group.id } });
  if (msgCount === 0) {
    await prisma.groupMessage.createMany({
      data: [
        { groupId: group.id, userId: demo.id, content: "Hallo zusammen! Wer ist diese Woche bei der Challenge dabei? 💪" },
        { groupId: group.id, userId: admin.id, content: "Ich bin dabei! Heute schon 30 Karten wiederholt 🃏" },
        { groupId: group.id, userId: demo.id, content: "Stark! Ich mache gleich die Perfekt-Lektion fertig." },
      ],
    });
    await prisma.groupChallenge.create({
      data: { groupId: group.id, title: "500 XP in 7 Tagen", metric: "xp", target: 500, endsAt: new Date(Date.now() + 7 * 86400000) },
    });
  }

  // ── Welcome announcement + a forum post ──
  const annCount = await prisma.announcement.count();
  if (annCount === 0) {
    await prisma.announcement.create({
      data: {
        authorId: admin.id,
        title: "Willkommen bei Deutschwerk! 🎉",
        content: "Alle vier Level sind online — inklusive Goethe & TELC Mock-Exams und der druckbaren PDF-Bibliothek. Viel Erfolg beim Lernen!",
      },
    });
  }
  const postCount = await prisma.post.count();
  if (postCount === 0) {
    const post = await prisma.post.create({
      data: {
        userId: demo.id,
        title: "Wann benutze ich 'seit' und wann 'vor'?",
        content: "Ich verwechsle immer 'seit' und 'vor'. Ich wohne SEIT zwei Jahren hier, aber ich bin VOR zwei Jahren gekommen? Kann das jemand einfach erklären? 🙈",
        category: "Grammatik",
      },
    });
    await prisma.comment.create({
      data: {
        postId: post.id,
        userId: admin.id,
        content: "Genau richtig! ✅ seit = der Zeitraum läuft noch (Ich wohne seit 2 Jahren hier — und immer noch). vor = ein Punkt in der Vergangenheit, abgeschlossen (Ich bin vor 2 Jahren gekommen — einmaliges Ereignis). Merkhilfe: seit + Präsens, vor + Perfekt/Präteritum.",
      },
    });
  }

  console.log(`✓ users: admin@deutschwerk.dev / demo@deutschwerk.dev (password: "deutschwerk")`);
}

async function main() {
  // Skip when the database is already populated (safe for automatic deploys).
  const existingLevels = await prisma.level.count();
  if (existingLevels > 0 && process.env.FORCE_SEED !== "1") {
    console.log("✓ Database already seeded — skipping. (Set FORCE_SEED=1 to force a content re-seed.)");
    return;
  }

  console.log("🌱 Seeding Deutschwerk…\n");
  await seedLevels();
  await seedModules("A1", MODULES_A1);
  await seedModules("A2", MODULES_A2);
  await seedModules("B1", MODULES_B1);
  await seedModules("B2", MODULES_B2);
  await seedGrammar();
  await seedVocab();
  await seedVerbs();
  await seedSkillsContent();
  await seedExercises();
  await seedExams();
  await seedAchievements();
  await seedUsers();
  console.log("\n✅ Seed complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
