import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { ExamSection } from "@/types/content";
import { ExamRunner, type ExamDTO } from "@/components/exams/exam-runner";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const exam = await prisma.mockExam.findUnique({ where: { slug }, select: { title: true } });
  return { title: exam ? `${exam.title} — Exam` : "Exam" };
}

export default async function TakeExamPage({ params }: { params: Promise<{ slug: string }> }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const { slug } = await params;
  const exam = await prisma.mockExam.findUnique({ where: { slug } });
  if (!exam) notFound();

  const dto: ExamDTO = {
    id: exam.id,
    slug: exam.slug,
    title: exam.title,
    provider: exam.provider,
    levelCode: exam.levelCode,
    durationMin: exam.durationMin,
    passScore: exam.passScore,
    sections: exam.sections as unknown as ExamSection[],
  };

  return <ExamRunner exam={dto} />;
}
