import { redirect } from "next/navigation";
import Link from "next/link";
import { BookOpen, Layers, ClipboardCheck, Target } from "lucide-react";
import { auth } from "@/lib/auth";
import { PageHeader } from "@/components/app/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export const metadata = { title: "Help Center" };

const FAQ: { q: string; a: string }[] = [
  {
    q: "How do I know which level to start with?",
    a: "Complete beginner? Start with A1, lesson 1. If you already know some German, open the Courses page, skim a B-level lesson and try its exercises — if you score above 80% comfortably, move up a level. You can change your current level any time in your profile.",
  },
  {
    q: "How does the flashcard spaced repetition work?",
    a: "Every card has a schedule. When you rate a card (Again / Hard / Good / Easy), the algorithm calculates the ideal next review date — just before you'd naturally forget it. Clearing your daily queue is the single highest-impact habit on this platform.",
  },
  {
    q: "How is my writing corrected?",
    a: "When an AI key is configured, a language model grades your text against CEFR criteria and returns detailed corrections plus a corrected version. Without a key, a built-in smart check evaluates length, structure, greetings/closings, connectors and capitalization — and you always get a native sample answer to compare against.",
  },
  {
    q: "Are the mock exams identical to the real Goethe/TELC exams?",
    a: "They follow the authentic structure, timing and task types, and are scored automatically at the official 60% pass mark. Writing is auto-estimated (or AI-graded); in the real exam human examiners apply the official criteria — so treat writing scores as guidance.",
  },
  {
    q: "How do streaks and XP work?",
    a: "Any completed activity (lesson, exercise, review session, writing task) counts for the day and extends your streak. XP measures total effort — lessons give the most, reviews a little each. XP feeds the leaderboard and unlocks achievements.",
  },
  {
    q: "Can I study with friends?",
    a: "Yes! Create a study group under Community, share the 6-character invite code, and you get a shared chat, weekly progress comparison and group challenges (e.g. 'first to 500 XP this week').",
  },
  {
    q: "How do I print lessons as PDFs?",
    a: "Every lesson, grammar topic, vocabulary pack and mock exam has a print icon. It opens a beautifully formatted print view — use your browser's 'Save as PDF' to keep it. The Download Center collects all printable materials in one place.",
  },
  {
    q: "Does pronunciation audio work offline?",
    a: "Word and sentence audio uses your device's built-in German voice, so it works instantly and offline. Listening exercises use recorded audio files that stream when online.",
  },
  {
    q: "What happens when I pass a final mock exam?",
    a: "Passing a mock exam at 60%+ earns you the Deutschwerk level certificate with a unique serial number — printable from the Achievements page. It's a motivation milestone (not an official Goethe/TELC certificate).",
  },
  {
    q: "How do I prepare for an Ausbildung in Germany?",
    a: "The Ausbildung section has everything: German CV (Lebenslauf) and cover letter templates, the 8 standard interview questions with model answers, workplace vocabulary by field, phone/email phrases and German work culture essentials.",
  },
];

const SHORTCUTS = [
  { keys: "⌘K / Ctrl+K", desc: "Global search — jump to any lesson, word or verb" },
  { keys: "Space", desc: "Reveal flashcard answer during review" },
  { keys: "1 – 4", desc: "Rate flashcard (Again / Hard / Good / Easy)" },
  { keys: "ESC", desc: "Close dialogs and search" },
];

export default async function HelpPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title="Help Center" description="Everything you need to get the most out of Deutschwerk." />

      {/* Getting started */}
      <div className="mb-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { icon: BookOpen, title: "1. Pick your level", desc: "Courses → A1 to B2", href: "/courses" },
          { icon: Target, title: "2. Daily session", desc: "Your personalized plan", href: "/daily" },
          { icon: Layers, title: "3. Build your deck", desc: "Vocabulary → add words", href: "/vocabulary" },
          { icon: ClipboardCheck, title: "4. Test yourself", desc: "Timed mock exams", href: "/exams" },
        ].map((s) => (
          <Link key={s.title} href={s.href}>
            <Card className="card-hover h-full">
              <CardContent className="p-4">
                <s.icon className="h-5 w-5 text-brand-500" />
                <div className="mt-2 text-sm font-bold">{s.title}</div>
                <div className="text-xs text-muted-foreground">{s.desc}</div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* FAQ */}
      <h2 className="mb-3 text-lg font-bold tracking-tight">Frequently asked questions</h2>
      <Accordion type="single" collapsible className="rounded-2xl border bg-card px-5 shadow-card">
        {FAQ.map((item, i) => (
          <AccordionItem key={i} value={`faq-${i}`} className={i === FAQ.length - 1 ? "border-b-0" : ""}>
            <AccordionTrigger className="text-left text-sm font-semibold">{item.q}</AccordionTrigger>
            <AccordionContent className="text-sm leading-relaxed text-muted-foreground">{item.a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      {/* Shortcuts */}
      <h2 className="mb-3 mt-8 text-lg font-bold tracking-tight">Keyboard shortcuts</h2>
      <div className="overflow-hidden rounded-2xl border">
        <div className="divide-y">
          {SHORTCUTS.map((s) => (
            <div key={s.keys} className="flex items-center justify-between px-5 py-3 text-sm">
              <span className="text-muted-foreground">{s.desc}</span>
              <kbd className="rounded-lg border bg-muted px-2 py-1 text-xs font-semibold">{s.keys}</kbd>
            </div>
          ))}
        </div>
      </div>

      <p className="mt-8 text-center text-sm text-muted-foreground">
        Still stuck? Ask the community in the{" "}
        <Link href="/discussion" className="font-medium text-foreground underline underline-offset-4">
          discussion forum
        </Link>{" "}
        — someone has been exactly where you are.
      </p>
    </div>
  );
}
