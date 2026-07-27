import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ArrowRight,
  BookOpen,
  ClipboardCheck,
  FileText,
  GraduationCap,
  Headphones,
  Layers,
  Mic,
  PenLine,
  Printer,
  Sparkles,
  Users,
} from "lucide-react";
import { auth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Logo } from "@/components/logo";
import { LEVELS, LEVEL_META } from "@/lib/levels";

const FEATURES = [
  {
    icon: GraduationCap,
    title: "Structured CEFR curriculum",
    desc: "Complete courses from A1 to B2 — modules, lessons, homework, revision, mini tests and final exams, built on the official CEFR standards.",
  },
  {
    icon: Layers,
    title: "Smart flashcards",
    desc: "Spaced repetition that schedules every word at the perfect moment. Articles, plurals, IPA, examples and memory tips on every card.",
  },
  {
    icon: Headphones,
    title: "All four skills",
    desc: "A reading library, listening studio with transcripts and speed control, guided speaking practice and writing tasks with instant feedback.",
  },
  {
    icon: ClipboardCheck,
    title: "Goethe & TELC simulations",
    desc: "Timed mock exams in the real format, with automatic scoring, sample answers, writing templates and proven exam strategies.",
  },
  {
    icon: Printer,
    title: "Print-ready PDF library",
    desc: "Every lesson, grammar sheet and vocabulary list ships as a professionally designed printable — study on paper whenever you like.",
  },
  {
    icon: Users,
    title: "Study together",
    desc: "Study groups, challenges, leaderboards and progress comparison. Learning German is better with friends.",
  },
];

const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "Levels", href: "#levels" },
  { label: "Exams", href: "#exams" },
];

export default async function LandingPage() {
  const session = await auth();
  if (session?.user) redirect("/dashboard");

  return (
    <div className="min-h-screen bg-background">
      {/* ── Header ── */}
      <header className="glass sticky top-0 z-40 border-b">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Logo />
          <nav className="hidden items-center gap-8 md:flex">
            {NAV_LINKS.map((l) => (
              <a key={l.href} href={l.href} className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
                {l.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <Link href="/login">
              <Button variant="ghost">Sign in</Button>
            </Link>
            <Link href="/register">
              <Button>Start learning</Button>
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* ── Hero ── */}
        <section className="relative overflow-hidden">
          <div aria-hidden className="pointer-events-none absolute inset-0">
            <div className="absolute -top-48 left-1/2 h-[560px] w-[900px] -translate-x-1/2 rounded-full bg-brand-200/50 blur-[140px] dark:bg-brand-900/25" />
          </div>
          <div className="relative mx-auto max-w-6xl px-6 pb-20 pt-20 text-center sm:pt-28">
            <Badge variant="brand" className="mb-6 px-3 py-1 text-xs">
              <Sparkles className="h-3 w-3" /> Goethe & TELC exam-ready
            </Badge>
            <h1 className="mx-auto max-w-3xl text-balance text-4xl font-bold tracking-tight sm:text-6xl">
              German, mastered.
              <br />
              <span className="bg-gradient-to-r from-brand-600 via-brand-500 to-amber-500 bg-clip-text text-transparent">
                From A1 to B2.
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-pretty text-lg text-muted-foreground">
              Everything you need in one beautiful place — structured courses, grammar, vocabulary, flashcards, the
              four skills and full exam preparation. No other website required.
            </p>
            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href="/register">
                <Button size="lg" className="h-12 px-7 text-base">
                  Start for free <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <a href="#levels">
                <Button size="lg" variant="outline" className="h-12 px-7 text-base">
                  Explore the curriculum
                </Button>
              </a>
            </div>

            <div className="mx-auto mt-14 grid max-w-2xl grid-cols-2 gap-6 sm:grid-cols-4">
              {[
                ["4", "CEFR levels"],
                ["1,200+", "vocabulary words"],
                ["8", "skill areas"],
                ["2", "exam formats"],
              ].map(([num, label]) => (
                <div key={label}>
                  <div className="text-3xl font-bold tracking-tight">{num}</div>
                  <div className="mt-1 text-sm text-muted-foreground">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Features ── */}
        <section id="features" className="mx-auto max-w-6xl px-6 py-20">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Ein Werkzeug. Alles drin.</h2>
            <p className="mx-auto mt-3 max-w-lg text-muted-foreground">
              One tool with everything inside — designed like the apps you love, built for serious progress.
            </p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => (
              <div key={f.title} className="card-hover rounded-2xl border bg-card p-6 shadow-card">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-secondary">
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="mb-1.5 font-semibold">{f.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Levels ── */}
        <section id="levels" className="border-y bg-secondary/40">
          <div className="mx-auto max-w-6xl px-6 py-20">
            <div className="mb-12 text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Your path, level by level</h2>
              <p className="mx-auto mt-3 max-w-lg text-muted-foreground">
                Each level is a complete course: lessons, grammar, vocabulary, all four skills, revision and a final
                exam with certificate.
              </p>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {LEVELS.map((code) => {
                const meta = LEVEL_META[code];
                return (
                  <div key={code} className="card-hover relative overflow-hidden rounded-2xl border bg-card p-6 shadow-card">
                    <div className={`absolute inset-x-0 top-0 h-1 ${meta.color}`} />
                    <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl text-lg font-bold text-white ${meta.color}`}>
                      {code}
                    </div>
                    <h3 className="font-semibold">{meta.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{meta.tagline}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── Exams ── */}
        <section id="exams" className="mx-auto max-w-6xl px-6 py-20">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Walk into your exam already knowing it.</h2>
              <p className="mt-4 text-muted-foreground">
                Practice with full-length Goethe and TELC simulations — the same sections, the same timing, the same
                task types. Get automatic scores, detailed corrections and model answers.
              </p>
              <ul className="mt-6 space-y-3">
                {[
                  "Timed mock exams for every level",
                  "Reading, listening, writing & speaking sections",
                  "Writing templates and sample answers",
                  "Exam strategies from format experts",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-400">
                      ✓
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/register" className="mt-8 inline-block">
                <Button size="lg">
                  Try a mock exam <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="grid gap-4">
              {[
                { name: "Goethe-Zertifikat", desc: "The world's most recognized German certificate — prepared section by section.", icon: BookOpen },
                { name: "TELC Deutsch", desc: "Complete TELC preparation including Deutsch-Test and B1/B2 formats.", icon: FileText },
                { name: "Ausbildung track", desc: "CV templates, interview practice and workplace German for your move to Germany.", icon: Mic },
              ].map((card) => (
                <div key={card.name} className="card-hover flex items-start gap-4 rounded-2xl border bg-card p-6 shadow-card">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300">
                    <card.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{card.name}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{card.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="mx-auto max-w-6xl px-6 pb-24">
          <div className="relative overflow-hidden rounded-3xl bg-primary px-8 py-16 text-center text-primary-foreground">
            <div aria-hidden className="pointer-events-none absolute inset-0">
              <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-brand-500/30 blur-[90px]" />
              <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-sky-500/20 blur-[90px]" />
            </div>
            <h2 className="relative text-3xl font-bold tracking-tight sm:text-4xl">Heute ist ein guter Tag, um anzufangen.</h2>
            <p className="relative mx-auto mt-3 max-w-md opacity-80">
              Today is a good day to start. Your first lesson takes ten minutes.
            </p>
            <Link href="/register" className="relative mt-8 inline-block">
              <Button size="lg" variant="secondary" className="h-12 px-7 text-base">
                Create free account <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 sm:flex-row">
          <Logo />
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <PenLine className="hidden h-4 w-4 sm:block" />
            <span>Dein Weg von A1 bis B2</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
