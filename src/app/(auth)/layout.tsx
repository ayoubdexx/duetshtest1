import { Logo } from "@/components/logo";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col bg-background">
      {/* Soft ambient background */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[480px] w-[720px] -translate-x-1/2 rounded-full bg-brand-200/40 blur-[120px] dark:bg-brand-900/20" />
        <div className="absolute bottom-0 right-0 h-[320px] w-[420px] rounded-full bg-sky-200/30 blur-[100px] dark:bg-sky-900/10" />
      </div>

      <header className="relative z-10 flex h-16 items-center px-6 sm:px-10">
        <Logo />
      </header>

      <main className="relative z-10 flex flex-1 items-center justify-center px-4 pb-16">
        <div className="w-full max-w-[420px] animate-fade-in">{children}</div>
      </main>

      <footer className="relative z-10 pb-6 text-center text-xs text-muted-foreground">
        Dein Weg von A1 bis B2 · Deutschwerk
      </footer>
    </div>
  );
}
