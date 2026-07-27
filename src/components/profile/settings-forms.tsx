"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { signOut } from "next-auth/react";
import { Loader2, Moon, Sun, Laptop, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function AppearanceSettings() {
  const { theme, setTheme } = useTheme();
  const options = [
    { value: "light", label: "Light", icon: Sun },
    { value: "dark", label: "Dark", icon: Moon },
    { value: "system", label: "System", icon: Laptop },
  ];
  return (
    <div className="grid grid-cols-3 gap-3">
      {options.map((o) => (
        <button
          key={o.value}
          onClick={() => setTheme(o.value)}
          className={cn(
            "flex flex-col items-center gap-2 rounded-xl border-2 p-4 text-sm font-medium transition-colors",
            theme === o.value ? "border-primary bg-accent" : "hover:bg-accent/50"
          )}
        >
          <o.icon className="h-5 w-5" />
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function DailyGoalSetting({ initial }: { initial: number }) {
  const router = useRouter();
  const [value, setValue] = useState(initial);
  const [busy, setBusy] = useState(false);

  async function save() {
    setBusy(true);
    const res = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ dailyGoalMin: value }),
    });
    setBusy(false);
    if (!res.ok) return toast.error("Could not save");
    toast.success(`Daily goal set to ${value} minutes`);
    router.refresh();
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-2xl font-bold">{value} min</span>
        <Button size="sm" onClick={save} disabled={busy || value === initial}>
          {busy && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
          Save
        </Button>
      </div>
      <input
        type="range"
        min={5}
        max={120}
        step={5}
        value={value}
        onChange={(e) => setValue(Number(e.target.value))}
        className="w-full accent-brand-500"
        aria-label="Daily goal in minutes"
      />
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>5 min — casual</span>
        <span>30 min — serious</span>
        <span>120 min — intensive</span>
      </div>
    </div>
  );
}

export function PasswordForm() {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (next !== confirm) return toast.error("New passwords don't match");
    setBusy(true);
    try {
      const res = await fetch("/api/profile/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ current, next }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error);
      toast.success("Password updated");
      setCurrent("");
      setNext("");
      setConfirm("");
    } catch (e) {
      toast.error(e instanceof Error && e.message ? e.message : "Could not update password");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="pw-current">Current password</Label>
        <Input id="pw-current" type="password" value={current} onChange={(e) => setCurrent(e.target.value)} required autoComplete="current-password" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="pw-next">New password</Label>
          <Input id="pw-next" type="password" value={next} onChange={(e) => setNext(e.target.value)} required minLength={8} autoComplete="new-password" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="pw-confirm">Confirm new password</Label>
          <Input id="pw-confirm" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required minLength={8} autoComplete="new-password" />
        </div>
      </div>
      <Button type="submit" disabled={busy}>
        {busy && <Loader2 className="h-4 w-4 animate-spin" />}
        Update password
      </Button>
    </form>
  );
}

export function DangerZone() {
  const [busy, setBusy] = useState(false);

  async function deleteAccount() {
    const confirmation = prompt('This permanently deletes your account and ALL progress. Type "DELETE" to confirm:');
    if (confirmation !== "DELETE") return;
    setBusy(true);
    const res = await fetch("/api/profile", { method: "DELETE" });
    if (!res.ok) {
      setBusy(false);
      return toast.error("Could not delete the account");
    }
    await signOut({ callbackUrl: "/" });
  }

  return (
    <div className="flex items-start gap-4">
      <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
      <div className="flex-1">
        <div className="font-semibold">Delete account</div>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Permanently removes your account, progress, flashcards, notes and group memberships. This cannot be undone.
        </p>
        <Button variant="destructive" size="sm" className="mt-3" onClick={deleteAccount} disabled={busy}>
          {busy && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
          Delete my account
        </Button>
      </div>
    </div>
  );
}
