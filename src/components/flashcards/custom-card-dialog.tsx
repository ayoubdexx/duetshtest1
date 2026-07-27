"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function CustomCardDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [front, setFront] = useState("");
  const [back, setBack] = useState("");
  const [notes, setNotes] = useState("");
  const [deck, setDeck] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!front.trim() || !back.trim()) return;
    setBusy(true);
    try {
      const res = await fetch("/api/flashcards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          custom: { front: front.trim(), back: back.trim(), notes: notes.trim() || undefined, deck: deck.trim() || undefined },
        }),
      });
      if (!res.ok) throw new Error();
      toast.success("Card created");
      setFront("");
      setBack("");
      setNotes("");
      setOpen(false);
      router.refresh();
    } catch {
      toast.error("Could not create the card");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Plus className="h-4 w-4" /> New card
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a custom flashcard</DialogTitle>
          <DialogDescription>Anything you want to remember — a word, a phrase, a grammar rule.</DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="front">Front (German)</Label>
            <Input id="front" value={front} onChange={(e) => setFront(e.target.value)} placeholder="die Verabredung" required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="back">Back (meaning)</Label>
            <Input id="back" value={back} onChange={(e) => setBack(e.target.value)} placeholder="appointment, date" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="deck">Deck</Label>
              <Input id="deck" value={deck} onChange={(e) => setDeck(e.target.value)} placeholder="Eigene Karten" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="notes">Note (optional)</Label>
              <Input id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Example or memory tip" />
            </div>
          </div>
          <Button type="submit" className="w-full" disabled={busy}>
            {busy && <Loader2 className="h-4 w-4 animate-spin" />}
            Add card
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
