import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PrintHeader, PrintFooter } from "@/components/print/print-parts";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const topic = await prisma.vocabTopic.findUnique({ where: { slug }, select: { title: true } });
  return { title: topic ? `${topic.title} · Vocabulary` : "Vocabulary" };
}

export default async function PrintVocabPage({ params }: { params: Promise<{ slug: string }> }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const { slug } = await params;
  const topic = await prisma.vocabTopic.findUnique({
    where: { slug },
    include: { words: { orderBy: { german: "asc" } } },
  });
  if (!topic) notFound();

  return (
    <div>
      <PrintHeader
        eyebrow="Wortschatz · Vocabulary list"
        title={topic.title}
        subtitle={`${topic.words.length} words with articles, plurals and examples`}
        badge={topic.levelCode}
      />

      <table className="w-full border-collapse text-sm">
        <thead>
          <tr>
            <th className="border-b-2 border-zinc-900 px-2 py-2 text-left font-bold">Wort</th>
            <th className="border-b-2 border-zinc-900 px-2 py-2 text-left font-bold">Plural</th>
            <th className="border-b-2 border-zinc-900 px-2 py-2 text-left font-bold">Bedeutung</th>
            <th className="border-b-2 border-zinc-900 px-2 py-2 text-left font-bold">Beispiel</th>
          </tr>
        </thead>
        <tbody>
          {topic.words.map((w, i) => (
            <tr key={w.id} className={i % 2 === 1 ? "bg-zinc-50" : ""}>
              <td className="border-b border-zinc-200 px-2 py-2 align-top">
                <span className="font-semibold">
                  {w.article ? `${w.article} ` : ""}
                  {w.german}
                </span>
                {w.ipa && <span className="ml-1 text-xs text-zinc-500">[{w.ipa}]</span>}
              </td>
              <td className="border-b border-zinc-200 px-2 py-2 align-top text-zinc-600">{w.plural ?? "—"}</td>
              <td className="border-b border-zinc-200 px-2 py-2 align-top">{w.meaning}</td>
              <td className="border-b border-zinc-200 px-2 py-2 align-top italic text-zinc-600">{w.exampleDe}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="avoid-break mt-8 rounded-2xl bg-zinc-100 p-5 text-sm">
        <div className="mb-1.5 font-bold">🧠 Lerntipp</div>
        Cover the "Bedeutung" column with a sheet of paper and test yourself — first German → English, then the harder
        direction: English → German with the correct article.
      </div>

      <PrintFooter />
    </div>
  );
}
