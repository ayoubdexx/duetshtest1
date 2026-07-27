import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { levelMeta } from "@/lib/levels";
import type { VerbForms, SixForms, VerbExample } from "@/types/content";
import { Badge } from "@/components/ui/badge";
import { BookmarkButton } from "@/components/content/bookmark-button";
import { SpeakButton } from "@/components/content/speak-button";

export async function generateMetadata({ params }: { params: Promise<{ infinitive: string }> }) {
  const { infinitive } = await params;
  return { title: `${decodeURIComponent(infinitive)} · Conjugation` };
}

const PRONOUNS: { key: keyof SixForms; label: string }[] = [
  { key: "ich", label: "ich" },
  { key: "du", label: "du" },
  { key: "er", label: "er/sie/es" },
  { key: "wir", label: "wir" },
  { key: "ihr", label: "ihr" },
  { key: "sie", label: "sie/Sie" },
];

function TenseTable({ title, forms, highlight }: { title: string; forms: SixForms; highlight?: boolean }) {
  return (
    <div className={`overflow-hidden rounded-2xl border ${highlight ? "border-brand-300 dark:border-brand-800" : ""}`}>
      <div className={`border-b px-4 py-2.5 text-sm font-bold ${highlight ? "bg-brand-50 dark:bg-brand-950/50" : "bg-secondary/60"}`}>
        {title}
      </div>
      <table className="w-full text-sm">
        <tbody>
          {PRONOUNS.map((p, i) => (
            <tr key={p.key} className={i > 0 ? "border-t" : ""}>
              <td className="w-24 px-4 py-2 text-muted-foreground">{p.label}</td>
              <td className="px-4 py-2 font-medium">
                <span className="inline-flex items-center gap-1">
                  {forms[p.key]}
                  <SpeakButton text={`${p.label.split("/")[0]} ${forms[p.key]}`} className="h-5 w-5 opacity-0 transition-opacity [tr:hover_&]:opacity-100" />
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default async function VerbPage({ params }: { params: Promise<{ infinitive: string }> }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  const userId = session.user.id;

  const { infinitive: raw } = await params;
  const infinitive = decodeURIComponent(raw);
  const verb = await prisma.verb.findUnique({ where: { infinitive } });
  if (!verb) notFound();

  const bookmark = await prisma.bookmark.findUnique({
    where: { userId_type_refId: { userId, type: "VERB", refId: verb.id } },
  });

  const meta = levelMeta(verb.levelCode);
  const forms = verb.forms as unknown as VerbForms;
  const examples = (verb.examples as unknown as VerbExample[] | null) ?? [];

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <div className="mb-2 text-sm text-muted-foreground">
            <Link href="/verbs" className="hover:text-foreground">
              Verbs
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight">{verb.infinitive}</h1>
            <SpeakButton text={verb.infinitive} size="md" />
          </div>
          <p className="mt-1 text-muted-foreground">{verb.english}</p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Badge className={`${meta.color} border-transparent text-white`}>{verb.levelCode}</Badge>
            {verb.isIrregular && <Badge variant="brand">unregelmäßig</Badge>}
            {verb.isSeparable && <Badge variant="outline">trennbar</Badge>}
            <Badge variant="secondary">
              Perfekt: {verb.auxiliary === "sein" ? "ist" : "hat"} {verb.partizip2}
            </Badge>
          </div>
        </div>
        <BookmarkButton
          type="VERB"
          refId={verb.id}
          title={verb.infinitive}
          href={`/verbs/${encodeURIComponent(verb.infinitive)}`}
          initialBookmarked={!!bookmark}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <TenseTable title="Präsens" forms={forms.praesens} highlight />
        <TenseTable title="Perfekt" forms={forms.perfekt} />
        <TenseTable title="Präteritum" forms={forms.praeteritum} />
        <TenseTable title="Futur I" forms={forms.futur1} />
        <TenseTable title="Konjunktiv II" forms={forms.konjunktiv2} />

        <div className="space-y-4">
          <div className="overflow-hidden rounded-2xl border">
            <div className="border-b bg-secondary/60 px-4 py-2.5 text-sm font-bold">Imperativ</div>
            <table className="w-full text-sm">
              <tbody>
                <tr>
                  <td className="w-24 px-4 py-2 text-muted-foreground">du</td>
                  <td className="px-4 py-2 font-medium">{forms.imperativ.du}</td>
                </tr>
                <tr className="border-t">
                  <td className="px-4 py-2 text-muted-foreground">ihr</td>
                  <td className="px-4 py-2 font-medium">{forms.imperativ.ihr}</td>
                </tr>
                <tr className="border-t">
                  <td className="px-4 py-2 text-muted-foreground">Sie</td>
                  <td className="px-4 py-2 font-medium">{forms.imperativ.Sie}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {forms.passiv && (
            <div className="overflow-hidden rounded-2xl border">
              <div className="border-b bg-secondary/60 px-4 py-2.5 text-sm font-bold">Passiv (3. Person)</div>
              <table className="w-full text-sm">
                <tbody>
                  <tr>
                    <td className="w-24 px-4 py-2 text-muted-foreground">Präsens</td>
                    <td className="px-4 py-2 font-medium">{forms.passiv.praesens}</td>
                  </tr>
                  <tr className="border-t">
                    <td className="px-4 py-2 text-muted-foreground">Präteritum</td>
                    <td className="px-4 py-2 font-medium">{forms.passiv.praeteritum}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {examples.length > 0 && (
        <div className="mt-6 overflow-hidden rounded-2xl border">
          <div className="border-b bg-secondary/60 px-4 py-2.5 text-sm font-bold">Beispiele · Examples</div>
          <div className="divide-y">
            {examples.map((ex, i) => (
              <div key={i} className="flex items-start gap-2 px-4 py-3">
                <SpeakButton text={ex.de} className="mt-0.5" />
                <div>
                  <div className="font-medium">{ex.de}</div>
                  <div className="text-sm text-muted-foreground">
                    {ex.en} <Badge variant="secondary" className="ml-1 px-1.5 py-0 text-[9px]">{ex.tense}</Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
