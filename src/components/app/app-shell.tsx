"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Flame, Sparkles, Search, Menu, LayoutDashboard, GraduationCap, Layers, ClipboardCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/logo";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { NAV_GROUPS, ADMIN_GROUP, type NavGroup } from "@/components/app/nav-config";
import { CommandPalette } from "@/components/app/command-palette";
import { ThemeToggle } from "@/components/app/theme-toggle";
import { UserMenu } from "@/components/app/user-menu";
import { levelMeta } from "@/lib/levels";

export interface ShellUser {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  role: string;
  currentLevel: string;
  xp: number;
  streak: number;
}

function NavLink({
  href,
  title,
  icon: Icon,
  onClick,
}: {
  href: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  onClick?: () => void;
}) {
  const pathname = usePathname();
  const active = pathname === href || (href !== "/dashboard" && pathname.startsWith(href + "/")) || (href === "/courses" && pathname.startsWith("/lessons"));

  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "group flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors",
        active
          ? "bg-primary text-primary-foreground shadow-sm"
          : "text-muted-foreground hover:bg-accent hover:text-foreground"
      )}
    >
      <Icon className={cn("h-[18px] w-[18px] shrink-0", active ? "" : "text-muted-foreground/80 group-hover:text-foreground")} />
      <span className="truncate">{title}</span>
    </Link>
  );
}

function NavGroups({ groups, onNavigate }: { groups: NavGroup[]; onNavigate?: () => void }) {
  return (
    <div className="space-y-5">
      {groups.map((group) => (
        <div key={group.label}>
          <div className="section-label mb-1.5 px-3">{group.label}</div>
          <div className="space-y-0.5">
            {group.items.map((item) => (
              <NavLink key={item.href} {...item} onClick={onNavigate} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

const MOBILE_TABS = [
  { title: "Home", href: "/dashboard", icon: LayoutDashboard },
  { title: "Courses", href: "/courses", icon: GraduationCap },
  { title: "Cards", href: "/flashcards", icon: Layers },
  { title: "Exams", href: "/exams", icon: ClipboardCheck },
];

export function AppShell({ user, children }: { user: ShellUser; children: React.ReactNode }) {
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const pathname = usePathname();
  const meta = levelMeta(user.currentLevel);

  const groups = user.role === "ADMIN" || user.role === "TEACHER" ? [...NAV_GROUPS, ADMIN_GROUP] : NAV_GROUPS;

  return (
    <div className="min-h-screen bg-background">
      {/* ── Desktop sidebar ── */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r bg-card lg:flex">
        <div className="flex h-16 shrink-0 items-center px-5">
          <Logo href="/dashboard" />
        </div>
        <nav className="flex-1 overflow-y-auto px-3 pb-4 pt-2">
          <NavGroups groups={groups} />
        </nav>
        <div className="shrink-0 border-t p-4">
          <Link
            href={`/courses/${user.currentLevel.toLowerCase()}`}
            className={cn("flex items-center gap-3 rounded-xl p-3 ring-1 transition-colors hover:opacity-90", meta.bg, meta.ring)}
          >
            <span className={cn("flex h-9 w-9 items-center justify-center rounded-lg text-sm font-bold text-white", meta.color)}>
              {user.currentLevel}
            </span>
            <div className="min-w-0">
              <div className="truncate text-sm font-semibold">{meta.title}</div>
              <div className="truncate text-xs text-muted-foreground">Current level</div>
            </div>
          </Link>
        </div>
      </aside>

      {/* ── Main column ── */}
      <div className="lg:pl-64">
        <header className="glass sticky top-0 z-20 flex h-16 items-center gap-3 border-b px-4 sm:px-6">
          <div className="lg:hidden">
            <Logo href="/dashboard" />
          </div>

          <button
            onClick={() => setPaletteOpen(true)}
            className="hidden h-10 w-full max-w-sm items-center gap-3 rounded-xl border bg-background/60 px-3.5 text-sm text-muted-foreground shadow-sm transition-colors hover:bg-accent sm:flex"
          >
            <Search className="h-4 w-4" />
            <span className="flex-1 text-left">Search anything…</span>
            <kbd className="rounded-md border bg-muted px-1.5 py-0.5 text-[10px] font-medium">⌘K</kbd>
          </button>

          <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
            <Badge variant="secondary" className="hidden gap-1 rounded-lg px-2 py-1 sm:inline-flex" title="Study streak">
              <Flame className="h-3.5 w-3.5 text-orange-500" />
              {user.streak}
            </Badge>
            <Badge variant="secondary" className="hidden gap-1 rounded-lg px-2 py-1 sm:inline-flex" title="Experience points">
              <Sparkles className="h-3.5 w-3.5 text-brand-500" />
              {user.xp.toLocaleString()} XP
            </Badge>
            <button
              onClick={() => setPaletteOpen(true)}
              className="flex h-10 w-10 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-accent hover:text-foreground sm:hidden"
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </button>
            <ThemeToggle />
            <UserMenu name={user.name} email={user.email} image={user.image} role={user.role} />
          </div>
        </header>

        <main className="mx-auto w-full max-w-7xl px-4 pb-28 pt-6 sm:px-6 lg:px-10 lg:pb-12 lg:pt-8">{children}</main>
      </div>

      {/* ── Mobile bottom tab bar ── */}
      <nav className="glass fixed inset-x-0 bottom-0 z-30 border-t pb-[env(safe-area-inset-bottom)] lg:hidden">
        <div className="grid grid-cols-5">
          {MOBILE_TABS.map((tab) => {
            const active = pathname === tab.href || pathname.startsWith(tab.href + "/");
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={cn(
                  "flex flex-col items-center gap-1 py-2.5 text-[10px] font-medium",
                  active ? "text-foreground" : "text-muted-foreground"
                )}
              >
                <tab.icon className={cn("h-5 w-5", active && "text-brand-600 dark:text-brand-400")} />
                {tab.title}
              </Link>
            );
          })}
          <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
            <SheetTrigger className="flex flex-col items-center gap-1 py-2.5 text-[10px] font-medium text-muted-foreground">
              <Menu className="h-5 w-5" />
              More
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] overflow-y-auto p-5">
              <SheetTitle className="sr-only">Navigation</SheetTitle>
              <div className="mb-5">
                <Logo href="/dashboard" />
              </div>
              <NavGroups groups={groups} onNavigate={() => setMobileNavOpen(false)} />
            </SheetContent>
          </Sheet>
        </div>
      </nav>

      <CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} />
    </div>
  );
}
