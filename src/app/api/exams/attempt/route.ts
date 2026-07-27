import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { scoreExam } from "@/lib/exam-scoring";
import { recordActivity, updateSkillScore } from "@/lib/activity";
import type { ExamSection } from "@/types/content";

const schema = z.object({
  examId: z.string().min(1),
  answers: z.record(z.string(), z.unknown()),
  writing: z.record(z.string(), z.string().max(8000)),
  speaking: z.record(z.string(), z.number().min(0).max(100)),
  durationUsedSec: z.number().int().min(0).optional(),
});

async function aiWritingScorer(text: string, prompt: string, minWords: number): Promise<number | null> {
  const key = process.env.AI_API_KEY;
  if (!key) return null;
  const baseUrl = process.env.AI_BASE_URL ?? "https://api.openai.com/v1";
  const model = process.env.AI_MODEL ?? "gpt-4o-mini";
  const res = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model,
      temperature: 0.2,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `You grade German exam writing tasks. Reply with strict JSON: {"score": <0-100>}. Judge task fulfilment, coherence, vocabulary and grammar for the requested level. Minimum words: ${minWords}.`,
        },
        { role: "user", content: `Task: ${prompt}\n\nStudent text:\n"""${text}"""` },
      ],
    }),
  });
  if (!res.ok) return null;
  const json = await res.json();
  try {
    const parsed = JSON.parse(json.choices?.[0]?.message?.content ?? "{}");
    const score = Number(parsed.score);
    return isFinite(score) ? Math.max(0, Math.min(100, score)) : null;
  } catch {
    return null;
  }
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = session.user.id;

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  const exam = await prisma.mockExam.findUnique({ where: { id: parsed.data.examId } });
  if (!exam) return NextResponse.json({ error: "Exam not found" }, { status: 404 });

  const sections = exam.sections as unknown as ExamSection[];
  const result = await scoreExam(
    sections,
    {
      answers: parsed.data.answers,
      writing: parsed.data.writing,
      speaking: parsed.data.speaking,
    },
    aiWritingScorer
  );

  const passed = result.pct >= exam.passScore;

  const attempt = await prisma.examAttempt.create({
    data: {
      userId,
      examId: exam.id,
      answers: {
        answers: parsed.data.answers,
        writing: parsed.data.writing,
        speaking: parsed.data.speaking,
      } as object,
      score: result.total,
      maxScore: result.max,
      sectionScores: result.sectionScores as unknown as object,
      passed,
      finishedAt: new Date(),
    },
  });

  // Certificate on first pass of this level
  let certificateSerial: string | null = null;
  if (passed) {
    const existing = await prisma.certificate.findFirst({ where: { userId, levelCode: exam.levelCode } });
    if (!existing) {
      const serial = `DW-${exam.levelCode}-${Date.now().toString(36).toUpperCase()}`;
      await prisma.certificate.create({
        data: { userId, levelCode: exam.levelCode, score: result.pct, serial },
      });
      certificateSerial = serial;
    }
  }

  const minutes = Math.min(exam.durationMin, Math.max(10, Math.round((parsed.data.durationUsedSec ?? 0) / 60)));
  await recordActivity(userId, { xp: Math.round(result.pct * 1.5), minutes, exercises: 1 });
  await updateSkillScore(userId, "EXAM", result.pct);

  return NextResponse.json({
    ok: true,
    attemptId: attempt.id,
    total: result.total,
    max: result.max,
    pct: result.pct,
    passed,
    passScore: exam.passScore,
    sectionScores: result.sectionScores,
    questionResults: result.questionResults,
    writingEstimates: result.writingEstimates,
    certificateSerial,
  });
}
