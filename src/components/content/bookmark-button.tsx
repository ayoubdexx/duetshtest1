"use client";

import { useState } from "react";
import { Bookmark } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface BookmarkButtonProps {
  type: string;
  refId: string;
  title: string;
  href: string;
  initialBookmarked: boolean;
  className?: string;
}

export function BookmarkButton({ type, refId, title, href, initialBookmarked, className }: BookmarkButtonProps) {
  const [bookmarked, setBookmarked] = useState(initialBookmarked);
  const [busy, setBusy] = useState(false);

  async function toggle() {
    if (busy) return;
    setBusy(true);
    const next = !bookmarked;
    setBookmarked(next);
    try {
      const res = await fetch("/api/bookmarks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, refId, title, href }),
      });
      if (!res.ok) throw new Error();
      const json = await res.json();
      setBookmarked(json.bookmarked);
      toast.success(json.bookmarked ? "Added to bookmarks" : "Removed from bookmarks");
    } catch {
      setBookmarked(!next);
      toast.error("Could not update bookmark");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Button variant="outline" size="icon" onClick={toggle} aria-label={bookmarked ? "Remove bookmark" : "Add bookmark"} className={className}>
      <Bookmark className={cn("h-4 w-4", bookmarked && "fill-brand-500 text-brand-500")} />
    </Button>
  );
}
