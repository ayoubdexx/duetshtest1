import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { PageHeader } from "@/components/app/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SpeakButton } from "@/components/content/speak-button";
import { Recorder } from "@/components/speaking/recorder";
import {
  ALPHABET,
  UMLAUTS,
  DIFFICULT_SOUNDS,
  MINIMAL_PAIRS,
  PRONUNCIATION_MISTAKES,
  PRACTICE_SENTENCES,
} from "@/lib/pronunciation-data";

export const metadata = { title: "Pronunciation" };

export default async function PronunciationPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader
        title="Pronunciation Studio"
        description="Master German sounds: the alphabet, umlauts, the tricky ch/r/z sounds and the mistakes almost every learner makes. Tap any word to hear it."
      />

      <Tabs defaultValue="alphabet">
        <TabsList className="mb-2 h-auto flex-wrap justify-start">
          <TabsTrigger value="alphabet">Alphabet</TabsTrigger>
          <TabsTrigger value="umlauts">Umlauts & ß</TabsTrigger>
          <TabsTrigger value="sounds">Difficult sounds</TabsTrigger>
          <TabsTrigger value="pairs">Minimal pairs</TabsTrigger>
          <TabsTrigger value="mistakes">Common mistakes</TabsTrigger>
        </TabsList>

        {/* Alphabet */}
        <TabsContent value="alphabet">
          <Card>
            <CardHeader>
              <CardTitle>Das Alphabet</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4">
                {ALPHABET.map((l) => (
                  <div key={l.letter} className="flex items-center gap-3 rounded-xl border bg-secondary/40 px-3.5 py-2.5">
                    <span className="w-7 text-xl font-bold">{l.letter}</span>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-semibold text-muted-foreground">„{l.name}"</div>
                      <div className="truncate text-sm">{l.example}</div>
                    </div>
                    <SpeakButton text={`${l.letter}. ${l.example}`} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Umlauts */}
        <TabsContent value="umlauts" className="space-y-4">
          {UMLAUTS.map((s) => (
            <Card key={s.symbol}>
              <CardContent className="p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-brand-100 text-3xl font-bold text-brand-700 dark:bg-brand-900/50 dark:text-brand-300">
                    {s.symbol}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="font-mono">
                        [{s.ipa}]
                      </Badge>
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-foreground/85">{s.hint}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {s.examples.map((ex) => (
                        <span key={ex.word} className="flex items-center gap-1 rounded-xl bg-secondary/60 py-1 pl-1 pr-3 text-sm">
                          <SpeakButton text={ex.word} />
                          <span className="font-medium">{ex.word}</span>
                          <span className="text-xs text-muted-foreground">({ex.meaning})</span>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Difficult sounds */}
        <TabsContent value="sounds" className="space-y-4">
          {DIFFICULT_SOUNDS.map((s) => (
            <Card key={s.symbol}>
              <CardContent className="p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                  <div className="flex h-16 min-w-16 shrink-0 items-center justify-center rounded-2xl bg-secondary px-3 text-lg font-bold">
                    {s.symbol}
                  </div>
                  <div className="min-w-0 flex-1">
                    <Badge variant="secondary" className="font-mono">
                      [{s.ipa}]
                    </Badge>
                    <p className="mt-2 text-sm leading-relaxed text-foreground/85">{s.hint}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {s.examples.map((ex) => (
                        <span key={ex.word} className="flex items-center gap-1 rounded-xl bg-secondary/60 py-1 pl-1 pr-3 text-sm">
                          <SpeakButton text={ex.word} />
                          <span className="font-medium">{ex.word}</span>
                          <span className="text-xs text-muted-foreground">({ex.meaning})</span>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Minimal pairs */}
        <TabsContent value="pairs">
          <Card>
            <CardHeader>
              <CardTitle>Hör genau hin · Hear the difference</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2.5">
              {MINIMAL_PAIRS.map((p, i) => (
                <div key={i} className="flex flex-wrap items-center gap-3 rounded-xl border bg-secondary/30 px-4 py-3">
                  <span className="flex items-center gap-1 font-semibold">
                    <SpeakButton text={p.a} /> {p.a}
                  </span>
                  <span className="text-muted-foreground">vs.</span>
                  <span className="flex items-center gap-1 font-semibold">
                    <SpeakButton text={p.b} /> {p.b}
                  </span>
                  <span className="ml-auto text-xs text-muted-foreground">{p.note}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Mistakes */}
        <TabsContent value="mistakes" className="space-y-4">
          {PRONUNCIATION_MISTAKES.map((m, i) => (
            <Card key={i}>
              <CardContent className="p-5">
                <div className="text-sm font-semibold text-rose-600 dark:text-rose-400">✗ {m.mistake}</div>
                <div className="mt-1.5 text-sm leading-relaxed text-foreground/85">✓ {m.fix}</div>
                <div className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
                  <SpeakButton text={m.example} />
                  <span className="italic">{m.example}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>

      {/* Practice */}
      <div className="mt-8 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Zungenbrecher & practice sentences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {PRACTICE_SENTENCES.map((s, i) => (
              <div key={i} className="flex items-center gap-2 rounded-xl bg-secondary/40 px-3.5 py-2.5 text-sm">
                <SpeakButton text={s} />
                <span className="leading-relaxed">{s}</span>
              </div>
            ))}
          </CardContent>
        </Card>
        <Recorder />
      </div>
    </div>
  );
}
