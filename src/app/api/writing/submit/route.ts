import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getWritingFeedback } from "@/lib/ai";
import { recordActivity, updateSkillScore } from "@/lib/activity";

const schema = z.object({
  taskId: z.string().min(1),
  content: z.string().min(10, "Write a little more first").max(8000),
});

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = session.user.id;

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 400 });
  }

  const task = await prisma.writingTask.findUnique({ where: { id: parsed.data.taskId } });
  if (!task) return NextResponse.json({ error: "Task not found" }, { status: 404 });

  const feedback = await getWritingFeedback({
    levelCode: task.levelCode,
    taskType: task.type,
    prompt: task.prompt,
    minWords: task.minWords,
    content: parsed.data.content,
    sampleAnswer: task.sampleAnswer,
  });

  const submission = await prisma.writingSubmission.create({
    data: {
      userId,
      taskId: task.id,
      content: parsed.data.content,
      feedback: feedback as unknown as object,
      score: feedback.score,
    },
  });

  const words = parsed.data.content.split(/\s+/).filter(Boolean).length;
  await recordActivity(userId, {
    xp: Math.round(feedback.score / 4),
    minutes: Math.max(5, Math.round(words / 20)),
    exercises: 1,
  });
  await updateSkillScore(userId, "WRITING", feedback.score);

  return NextResponse.json({ ok: true, submissionId: submission.id, feedback });
}
