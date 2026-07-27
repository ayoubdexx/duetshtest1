"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Plus, KeyRound } from "lucide-react";
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
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

export function CreateGroupDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const res = await fetch("/api/groups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), description: description.trim() || undefined, isPrivate }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error);
      toast.success("Study group created!");
      setOpen(false);
      router.push(`/community/groups/${json.group.id}`);
      router.refresh();
    } catch (e) {
      toast.error(e instanceof Error && e.message ? e.message : "Could not create group");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4" /> Create group
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a study group</DialogTitle>
          <DialogDescription>Learn together — share progress, chat and run challenges.</DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="g-name">Group name</Label>
            <Input id="g-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="B1 Prüfung Herbst 2026" required minLength={2} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="g-desc">Description (optional)</Label>
            <Textarea id="g-desc" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="What is this group about?" rows={2} />
          </div>
          <div className="flex items-center justify-between rounded-xl border p-3.5">
            <div>
              <div className="text-sm font-medium">Private study room</div>
              <div className="text-xs text-muted-foreground">Only people with the invite code can join</div>
            </div>
            <Switch checked={isPrivate} onCheckedChange={setIsPrivate} />
          </div>
          <Button type="submit" className="w-full" disabled={busy || name.trim().length < 2}>
            {busy && <Loader2 className="h-4 w-4 animate-spin" />}
            Create group
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function JoinGroupDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [code, setCode] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const res = await fetch("/api/groups/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: code.trim().toUpperCase() }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error);
      toast.success("Welcome to the group!");
      setOpen(false);
      router.push(`/community/groups/${json.groupId}`);
      router.refresh();
    } catch (e) {
      toast.error(e instanceof Error && e.message ? e.message : "Could not join");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <KeyRound className="h-4 w-4" /> Join with code
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Join a group</DialogTitle>
          <DialogDescription>Enter the 6-character invite code from a friend.</DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <Input
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="Z.B. K7M2PQ"
            className="text-center font-mono text-lg uppercase tracking-[0.3em]"
            maxLength={8}
            required
          />
          <Button type="submit" className="w-full" disabled={busy || code.trim().length < 4}>
            {busy && <Loader2 className="h-4 w-4 animate-spin" />}
            Join group
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function JoinPublicButton({ groupId }: { groupId: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function join() {
    setBusy(true);
    try {
      const res = await fetch("/api/groups/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ groupId }),
      });
      if (!res.ok) throw new Error();
      toast.success("Joined!");
      router.push(`/community/groups/${groupId}`);
      router.refresh();
    } catch {
      toast.error("Could not join");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Button size="sm" variant="outline" onClick={join} disabled={busy}>
      {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Join"}
    </Button>
  );
}
