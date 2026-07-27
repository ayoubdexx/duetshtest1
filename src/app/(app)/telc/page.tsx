import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { TELC_INFO } from "@/lib/exam-info";
import { ExamProviderHub } from "@/components/exams/exam-provider-hub";

export const metadata = { title: "TELC Preparation" };

export default async function TelcPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const exams = await prisma.mockExam.findMany({
    where: { provider: "TELC" },
    orderBy: { level: { order: "asc" } },
    select: { slug: true, title: true, levelCode: true, durationMin: true },
  });

  return (
    <ExamProviderHub
      providerLabel="telc"
      title="TELC Preparation"
      description="telc Deutsch certificates are accepted for visas, citizenship and professional recognition across Germany. Know the format, train the strategies, pass with confidence."
      info={TELC_INFO}
      exams={exams}
    />
  );
}
