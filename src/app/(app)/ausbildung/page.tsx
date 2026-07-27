import Link from "next/link";
import { redirect } from "next/navigation";
import { Briefcase, FileText, MessagesSquare, Phone } from "lucide-react";
import { auth } from "@/lib/auth";
import { PageHeader } from "@/components/app/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { SpeakButton } from "@/components/content/speak-button";
import {
  LEBENSLAUF_SECTIONS,
  ANSCHREIBEN_SECTIONS,
  INTERVIEW_QUESTIONS,
  WORKPLACE_VOCAB,
  PHONE_PHRASES,
  EMAIL_PHRASES,
  WORK_CULTURE,
  WORK_SITUATIONS,
} from "@/lib/ausbildung-data";

export const metadata = { title: "Ausbildung" };

export default async function AusbildungPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader
        title="Ausbildung & Arbeiten in Deutschland"
        description="Everything for your move to Germany through vocational training: application documents, interview preparation, workplace German and work culture."
      />

      <Tabs defaultValue="bewerbung">
        <TabsList className="mb-2 h-auto flex-wrap justify-start">
          <TabsTrigger value="bewerbung">
            <FileText className="h-3.5 w-3.5" /> Bewerbung
          </TabsTrigger>
          <TabsTrigger value="interview">
            <Briefcase className="h-3.5 w-3.5" /> Interview
          </TabsTrigger>
          <TabsTrigger value="vocab">📚 Wortschatz</TabsTrigger>
          <TabsTrigger value="kommunikation">
            <Phone className="h-3.5 w-3.5" /> Telefon & E-Mail
          </TabsTrigger>
          <TabsTrigger value="kultur">🇩🇪 Arbeitskultur</TabsTrigger>
          <TabsTrigger value="situationen">
            <MessagesSquare className="h-3.5 w-3.5" /> Situationen
          </TabsTrigger>
        </TabsList>

        {/* ── Bewerbung ── */}
        <TabsContent value="bewerbung" className="space-y-5">
          <Card>
            <CardHeader>
              <CardTitle>Der deutsche Lebenslauf (CV)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                German CVs are tabular ("tabellarischer Lebenslauf"), maximum 2 pages, reverse-chronological, signed and
                dated. Use this structure:
              </p>
              {LEBENSLAUF_SECTIONS.map((s) => (
                <div key={s.label} className="rounded-xl border bg-secondary/30 p-4">
                  <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{s.label}</div>
                  <div className="mt-1 text-sm font-medium">{s.example}</div>
                  {s.note && <div className="mt-1.5 text-xs text-muted-foreground">💡 {s.note}</div>}
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Das Anschreiben (cover letter)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                One page, four paragraphs, tailored to each company. This template has carried thousands of successful
                Ausbildung applications:
              </p>
              {ANSCHREIBEN_SECTIONS.map((s) => (
                <div key={s.label} className="rounded-xl border bg-secondary/30 p-4">
                  <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{s.label}</div>
                  <div className="mt-1 whitespace-pre-line text-sm italic leading-relaxed">{s.example}</div>
                </div>
              ))}
              <div className="rounded-xl border border-brand-200 bg-brand-50/60 p-4 text-sm dark:border-brand-900 dark:bg-brand-950/40">
                ✍️ Practice both documents in the <Link href="/writing" className="font-semibold underline underline-offset-2">Writing section</Link> — the B1/B2 formal-letter tasks use exactly these structures.
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Interview ── */}
        <TabsContent value="interview">
          <Card>
            <CardHeader>
              <CardTitle>Vorstellungsgespräch · The 8 questions that always come</CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible>
                {INTERVIEW_QUESTIONS.map((item, i) => (
                  <AccordionItem key={i} value={`q${i}`}>
                    <AccordionTrigger className="text-left text-sm font-semibold">
                      {i + 1}. {item.q}
                    </AccordionTrigger>
                    <AccordionContent className="space-y-3">
                      <div className="rounded-xl bg-secondary/50 p-3.5 text-sm">
                        <span className="font-semibold">Strategie: </span>
                        {item.hint}
                      </div>
                      <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-3.5 dark:border-emerald-900 dark:bg-emerald-950/40">
                        <div className="mb-1 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                          Beispielantwort <SpeakButton text={item.sample} />
                        </div>
                        <p className="text-sm italic leading-relaxed">{item.sample}</p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Wortschatz ── */}
        <TabsContent value="vocab" className="space-y-5">
          {Object.entries(WORKPLACE_VOCAB).map(([key, group]) => (
            <Card key={key}>
              <CardHeader>
                <CardTitle>
                  {group.emoji} {group.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-2 sm:grid-cols-2">
                  {group.words.map((w) => (
                    <div key={w.de} className="flex items-center gap-2 rounded-xl bg-secondary/50 px-3 py-2 text-sm">
                      <SpeakButton text={w.de.replace(/,.*$/, "")} />
                      <span className="font-medium">{w.de}</span>
                      <span className="ml-auto text-right text-muted-foreground">{w.en}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* ── Kommunikation ── */}
        <TabsContent value="kommunikation" className="space-y-5">
          <Card>
            <CardHeader>
              <CardTitle>📞 Telefonieren</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {PHONE_PHRASES.map((group) => (
                <div key={group.label}>
                  <div className="section-label mb-1.5">{group.label}</div>
                  <div className="space-y-1">
                    {group.items.map((p, i) => (
                      <div key={i} className="flex items-center gap-1.5 text-sm">
                        <SpeakButton text={p} />
                        {p}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>📧 Professionelle E-Mails</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {EMAIL_PHRASES.map((group) => (
                <div key={group.label}>
                  <div className="section-label mb-1.5">{group.label}</div>
                  <ul className="space-y-1 text-sm">
                    {group.items.map((p, i) => (
                      <li key={i}>• {p}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Arbeitskultur ── */}
        <TabsContent value="kultur">
          <div className="grid gap-4 sm:grid-cols-2">
            {WORK_CULTURE.map((item) => (
              <Card key={item.title}>
                <CardContent className="p-5">
                  <div className="font-semibold">{item.title}</div>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{item.tip}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* ── Situationen ── */}
        <TabsContent value="situationen" className="space-y-5">
          {WORK_SITUATIONS.map((situation) => (
            <Card key={situation.title}>
              <CardHeader>
                <CardTitle className="text-base">{situation.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {situation.lines.map((line, i) => {
                  const isYou = line.speaker === "Sie";
                  return (
                    <div key={i} className={`flex gap-3 ${isYou ? "" : "flex-row-reverse"}`}>
                      <div
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                          isYou
                            ? "bg-brand-100 text-brand-700 dark:bg-brand-900/50 dark:text-brand-300"
                            : "bg-sky-100 text-sky-700 dark:bg-sky-900/50 dark:text-sky-300"
                        }`}
                      >
                        {line.speaker.slice(0, 1)}
                      </div>
                      <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 ${isYou ? "rounded-tl-md bg-secondary" : "rounded-tr-md bg-sky-50 dark:bg-sky-950/40"}`}>
                        <div className="mb-0.5 flex items-center gap-1 text-[11px] font-semibold text-muted-foreground">
                          {line.speaker}
                          {isYou && <Badge variant="brand" className="px-1.5 py-0 text-[9px]">you</Badge>}
                          <SpeakButton text={line.de} className="h-5 w-5" />
                        </div>
                        <div className="text-[15px] font-medium leading-relaxed">{line.de}</div>
                        <div className="mt-0.5 text-xs text-muted-foreground">{line.en}</div>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
