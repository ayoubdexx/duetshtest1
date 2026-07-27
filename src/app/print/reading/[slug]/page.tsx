import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { ExerciseQuestion, GlossaryEntry } from "@/types/content";
import { PrintExercise } from "@/components/content/block-renderer";
import { PrintHeader, PrintFooter } from "@/components/print/print-parts";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const text = await prisma.readingText.findUnique({ where: { slug }, select: { title: true } });
  return { title: text?.title ?? "Reading" };
}

export default async function PrintReadingPage({ params }: { params: Promise<{ slug: string }> }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const { slug } = await params;
  const text = await prisma.readingText.findUnique({ where: { slug } });
  if (!text) notFound();

  const glossary = (text.glossary as GlossaryEntry[] | null) ?? [];
  const questions = text.questions as unknown as ExerciseQuestion[];
  const paragraphs = text.body.split(/\n\s*\n/);

  return (
    <div>
      <PrintHeader
        eyebrow={`Lesen · ${text.topic ?? "Reading worksheet"}`}
        title={text.title}
        subtitle={`${text.wordCount} words`}
        badge={text.levelCode}
      />

      {text.intro && <p className="mb-5 text-sm italic text-zinc-600">{text.intro}</p>}

      <div className="space-y-4">
        {paragraphs.map((p, i) => (
          <p key={i} className="text-[15px] leading-7">
            {p}
          </p>
        ))}
      </div>

      {glossary.length > 0 && (
        <div className="avoid-break mt-8 rounded-2xl border p-5">
          <div className="mb-2.5 text-sm font-bold">📚 Wortschatz · Glossary</div>
          <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-sm">
            {glossary.map((g, i) => (
              <div key={i}>
                <span className="font-medium">{g.de}</span> — {g.en}
              </div>
            ))}
          </div>
        </div>
      )}

      {questions.length > 0 && (
        <>
          <div className="mt-8">
            <PrintExercise
              exercise={{
                id: "",
                slug: `print-${text.slug}`,
                title: "Verständnisfragen · Comprehension questions",
                type: "MCQ",
                skill: "READING",
                instructions: "Answer based on the text.",
                xpReward: 0,
                questions,
              }}
            />
          </div>
          <div className="print-page mt-8">
            <h2 className="mb-4 border-b-2 border-zinc-900 pb-2 text-xl font-bold">Lösungen · Solutions</h2>
            <PrintExercise
              exercise={{
                id: "",
                slug: `print-sol-${text.slug}`,
                title: "Verständnisfragen",
                type: "MCQ",
                skill: "READING",
                instructions: null,
                xpReward: 0,
                questions,
              }}
              showSolutions
            />
          </div>
        </>
      )}

      <PrintFooter />
    </div>
  );
}
