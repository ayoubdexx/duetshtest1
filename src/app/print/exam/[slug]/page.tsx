import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { ExamSection, ExerciseQuestion } from "@/types/content";
import { correctAnswerLabel } from "@/lib/questions";
import { PrintHeader, PrintFooter } from "@/components/print/print-parts";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const exam = await prisma.mockExam.findUnique({ where: { slug }, select: { title: true } });
  return { title: exam?.title ?? "Exam" };
}

export default async function PrintExamPage({ params }: { params: Promise<{ slug: string }> }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const { slug } = await params;
  const exam = await prisma.mockExam.findUnique({ where: { slug } });
  if (!exam) notFound();

  const sections = exam.sections as unknown as ExamSection[];
  let questionNo = 0;
  const numbered: { no: number; q: ExerciseQuestion }[] = [];
  for (const s of sections) {
    for (const p of s.parts) {
      for (const q of (p.questions ?? []) as ExerciseQuestion[]) {
        questionNo += 1;
        numbered.push({ no: questionNo, q });
      }
    }
  }
  let printNo = 0;

  return (
    <div>
      <PrintHeader
        eyebrow={`${exam.provider} Format · Mock exam paper`}
        title={exam.title}
        subtitle={`${exam.durationMin} minutes · pass mark ${exam.passScore}% · Name: ______________________`}
        badge={exam.levelCode}
      />

      {sections.map((section, si) => (
        <div key={section.id} className={si > 0 ? "print-page mt-10" : ""}>
          <h2 className="mb-1 border-b-2 border-zinc-900 pb-2 text-xl font-bold">
            Teil {si + 1}: {section.title}
          </h2>
          <div className="mb-4 text-xs text-zinc-500">{section.durationMin} Minuten</div>
          {section.intro && <p className="mb-4 text-sm italic text-zinc-600">{section.intro}</p>}

          <div className="space-y-6">
            {section.parts.map((part) => (
              <div key={part.id} className="avoid-break">
                <div className="mb-1 text-sm font-bold">{part.title}</div>
                <div className="mb-3 text-xs text-zinc-500">{part.instructions}</div>

                {part.transcript && !part.passage && (
                  <div className="mb-3 rounded-xl border border-dashed p-3 text-xs text-zinc-500">
                    🎧 Listening part — play the audio in the app, or have a partner read the transcript from the answer
                    key.
                  </div>
                )}
                {part.passage && (
                  <div className="mb-4 whitespace-pre-line rounded-xl border p-4 text-sm leading-6">{part.passage}</div>
                )}

                {(part.questions as ExerciseQuestion[] | undefined)?.map((q) => {
                  printNo += 1;
                  return (
                    <div key={q.id} className="mb-3 text-sm">
                      <span className="font-semibold">{printNo}.</span> {q.prompt.replace(/___/g, "__________")}
                      {q.type === "mcq" && (
                        <div className="mt-1 flex flex-wrap gap-x-6 gap-y-0.5 pl-5 text-zinc-700">
                          {q.options.map((o, i) => (
                            <span key={i}>
                              ⬜ {String.fromCharCode(97 + i)}) {o}
                            </span>
                          ))}
                        </div>
                      )}
                      {q.type === "order" && (
                        <div className="mt-1 pl-5 text-zinc-600">[ {[...q.fragments].sort().join(" · ")} ] → ________________________________</div>
                      )}
                      {q.type === "match" && (
                        <div className="mt-1 pl-5 text-zinc-600">
                          {q.pairs.map((p) => `${p.left} → ____`).join(" · ")}   ({[...q.pairs.map((p) => p.right)].sort().join(", ")})
                        </div>
                      )}
                    </div>
                  );
                })}

                {part.writing && (
                  <div className="mt-2">
                    <div className="whitespace-pre-line rounded-xl border-2 border-zinc-300 p-4 text-sm">{part.writing.prompt}</div>
                    <div className="mt-1 text-xs text-zinc-500">
                      Mindestens {part.writing.minWords} Wörter · {part.writing.points} Punkte
                    </div>
                    <div className="mt-3 space-y-6">
                      {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="border-b border-zinc-300" />
                      ))}
                    </div>
                  </div>
                )}

                {part.speaking && (
                  <div className="mt-2 whitespace-pre-line rounded-xl border-2 border-dashed border-zinc-300 p-4 text-sm">
                    🗣 {part.speaking.prompt}
                    {(part.speaking.prepMin || part.speaking.talkMin) && (
                      <div className="mt-2 text-xs text-zinc-500">
                        {part.speaking.prepMin ? `Vorbereitung: ${part.speaking.prepMin} Min. · ` : ""}
                        {part.speaking.talkMin ? `Sprechzeit: ${part.speaking.talkMin} Min.` : ""}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Answer key */}
      <div className="print-page mt-10">
        <h2 className="mb-4 border-b-2 border-zinc-900 pb-2 text-xl font-bold">Lösungsschlüssel · Answer key</h2>
        <div className="grid grid-cols-2 gap-x-8 gap-y-1.5 text-sm">
          {numbered.map(({ no, q }) => (
            <div key={q.id}>
              <span className="font-semibold">{no}.</span> {correctAnswerLabel(q)}
            </div>
          ))}
        </div>
        {sections.some((s) => s.parts.some((p) => p.writing?.sample)) && (
          <div className="mt-6">
            <h3 className="mb-2 font-bold">Musterlösungen · Sample answers</h3>
            {sections.flatMap((s) =>
              s.parts
                .filter((p) => p.writing?.sample)
                .map((p) => (
                  <div key={p.id} className="avoid-break mb-4 rounded-xl bg-zinc-100 p-4 text-sm">
                    <div className="mb-1 text-xs font-bold uppercase tracking-wider text-zinc-500">{p.title}</div>
                    <p className="whitespace-pre-line italic">{p.writing!.sample}</p>
                  </div>
                ))
            )}
          </div>
        )}
      </div>

      <PrintFooter />
    </div>
  );
}
