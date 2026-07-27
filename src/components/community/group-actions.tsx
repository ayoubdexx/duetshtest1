"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Copy, Check, LogOut, Trash2, Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function CopyCodeButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={async () => {
        await navigator.clipboard.writeText(code).catch(() => {});
        setCopied(true);
        toast.success("Invite code copied");
        setTimeout(() => setCopied(false), 1500);
      }}
      className="inline-flex items-center gap-1.5 rounded-lg border bg-secondary/50 px-2.5 py-1 font-mono text-sm font-bold tracking-[0.2em] hover:bg-accent"
      aria-label="Copy invite code"
    >
      {code}
      {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5 text-muted-foreground" />}
    </button>
  );
}

export function LeaveGroupButton({ groupId, isOwner }: { groupId: string; isOwner: boolean }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function act() {
    const confirmMsg = isOwner ? "Delete this group for everyone?" : "Leave this group?";
    if (!confirm(confirmMsg)) return;
    setBusy(true);
    const res = await fetch(`/api/groups/${groupId}`, { method: isOwner ? "DELETE" : "POST" });
    setBusy(false);
    if (!res.ok) {
      toast.error("Action failed");
      return;
    }
    toast.success(isOwner ? "Group deleted" : "You left the group");
    router.push("/community");
    router.refresh();
  }

  return (
    <Button variant="outline" size="sm" onClick={act} disabled={busy} className="text-destructive hover:text-destructive">
      {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : isOwner ? <Trash2 className="h-3.5 w-3.5" /> : <LogOut className="h-3.5 w-3.5" />}
      {isOwner ? "Delete group" : "Leave"}
    </Button>
  );
}

export function NewChallengeDialog({ groupId }: { groupId: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [title, setTitle] = useState("");
  const [metric, setMetric] = useState("xp");
  const [target, setTarget] = useState("300");
  const [days, setDays] = useState("7");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const res = await fetch(`/api/groups/${groupId}/challenges`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          metric,
          target: parseInt(target, 10),
          days: parseInt(days, 10),
        }),
      });
      if (!res.ok) throw new Error();
      toast.success("Challenge started! 🏁");
      setOpen(false);
      setTitle("");
      router.refresh();
    } catch {
      toast.error("Could not create challenge");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Plus className="h-3.5 w-3.5" /> New challenge
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Start a group challenge</DialogTitle>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-1.5">
            <Label>Title</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="500 XP in einer Woche!" required minLength={2} />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <Label>Metric</Label>
              <Select value={metric} onValueChange={setMetric}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="xp">XP</SelectItem>
                  <SelectItem value="minutes">Minutes</SelectItem>
                  <SelectItem value="lessons">Lessons</SelectItem>
                  <SelectItem value="cards">Cards</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Target</Label>
              <Input type="number" value={target} onChange={(e) => setTarget(e.target.value)} min={1} required />
            </div>
            <div className="space-y-1.5">
              <Label>Days</Label>
              <Input type="number" value={days} onChange={(e) => setDays(e.target.value)} min={1} max={60} required />
            </div>
          </div>
          <Button type="submit" className="w-full" disabled={busy}>
            {busy && <Loader2 className="h-4 w-4 animate-spin" />}
            Start challenge
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
