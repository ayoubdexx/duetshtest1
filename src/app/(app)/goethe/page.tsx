import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { GOETHE_INFO } from "@/lib/exam-info";
import { ExamProviderHub } from "@/components/exams/exam-provider-hub";

export const metadata = { title: "Goethe Preparation" };

export default async function GoethePage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const exams = await prisma.mockExam.findMany({
    where: { provider: "GOETHE" },
    orderBy: { level: { order: "asc" } },
    select: { slug: true, title: true, levelCode: true, durationMin: true },
  });

  return (
    <ExamProviderHub
      providerLabel="Goethe-Institut"
      title="Goethe Preparation"
      description="The Goethe-Zertifikat is the world's most recognized German certificate. Learn the exact format for every level, master the strategies and prove yourself in full mock exams."
      info={GOETHE_INFO}
      exams={exams}
    />
  );
}
