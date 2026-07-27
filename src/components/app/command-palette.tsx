"use client";

import { useEffect, useState, useDeferredValue } from "react";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import { useQuery } from "@tanstack/react-query";
import { Search, CornerDownLeft } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { QUICK_NAV } from "@/components/app/nav-config";

interface SearchResult {
  type: string;
  title: string;
  subtitle?: string;
  href: string;
}

const TYPE_LABELS: Record<string, string> = {
  lesson: "Lessons",
  grammar: "Grammar",
  word: "Vocabulary",
  reading: "Reading",
  listening: "Listening",
  speaking: "Speaking",
  writing: "Writing",
  verb: "Verbs",
  exam: "Mock Exams",
  exercise: "Exercises",
};

export function CommandPalette({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const deferredQ = useDeferredValue(q);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        onOpenChange(!open);
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onOpenChange]);

  useEffect(() => {
    if (!open) setQ("");
  }, [open]);

  const { data } = useQuery<{ results: SearchResult[] }>({
    queryKey: ["global-search", deferredQ],
    queryFn: async () => {
      const res = await fetch(`/api/search?q=${encodeURIComponent(deferredQ)}`);
      if (!res.ok) throw new Error("Search failed");
      return res.json();
    },
    enabled: open && deferredQ.trim().length >= 2,
    staleTime: 60_000,
  });

  const results = data?.results ?? [];
  const grouped = results.reduce<Record<string, SearchResult[]>>((acc, r) => {
    (acc[r.type] ??= []).push(r);
    return acc;
  }, {});

  const quickMatches =
    q.trim().length > 0
      ? QUICK_NAV.filter((i) => i.title.toLowerCase().includes(q.trim().toLowerCase())).slice(0, 5)
      : QUICK_NAV.slice(0, 6);

  function go(href: string) {
    onOpenChange(false);
    router.push(href);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="top-[15%] max-w-xl translate-y-0 gap-0 overflow-hidden p-0 [&>button]:hidden">
        <DialogTitle className="sr-only">Global search</DialogTitle>
        <Command shouldFilter={false} className="flex flex-col">
          <div className="flex items-center gap-3 border-b px-4">
            <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
            <Command.Input
              value={q}
              onValueChange={setQ}
              placeholder="Search lessons, grammar, words, verbs, exams…"
              className="h-14 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
            <kbd className="hidden rounded-md border bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground sm:block">
              ESC
            </kbd>
          </div>
          <Command.List className="max-h-[420px] overflow-y-auto p-2">
            <Command.Empty className="py-10 text-center text-sm text-muted-foreground">
              {deferredQ.trim().length >= 2 ? "No results found." : "Type at least 2 characters to search content."}
            </Command.Empty>

            {quickMatches.length > 0 && (
              <Command.Group
                heading="Go to"
                className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-[11px] [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wider [&_[cmdk-group-heading]]:text-muted-foreground"
              >
                {quickMatches.map((item) => (
                  <Command.Item
                    key={item.href}
                    value={`nav-${item.href}`}
                    onSelect={() => go(item.href)}
                    className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-2 text-sm aria-selected:bg-accent"
                  >
                    <item.icon className="h-4 w-4 text-muted-foreground" />
                    {item.title}
                  </Command.Item>
                ))}
              </Command.Group>
            )}

            {Object.entries(grouped).map(([type, items]) => (
              <Command.Group
                key={type}
                heading={TYPE_LABELS[type] ?? type}
                className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-[11px] [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wider [&_[cmdk-group-heading]]:text-muted-foreground"
              >
                {items.map((r) => (
                  <Command.Item
                    key={`${r.type}-${r.href}-${r.title}`}
                    value={`${r.type}-${r.href}-${r.title}`}
                    onSelect={() => go(r.href)}
                    className="flex cursor-pointer items-center justify-between gap-3 rounded-lg px-2 py-2 text-sm aria-selected:bg-accent"
                  >
                    <div className="min-w-0">
                      <div className="truncate font-medium">{r.title}</div>
                      {r.subtitle && <div className="truncate text-xs text-muted-foreground">{r.subtitle}</div>}
                    </div>
                    <CornerDownLeft className="h-3.5 w-3.5 shrink-0 text-muted-foreground/50" />
                  </Command.Item>
                ))}
              </Command.Group>
            ))}
          </Command.List>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
