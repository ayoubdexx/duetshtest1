"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Camera, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LEVELS } from "@/lib/levels";

interface Props {
  initial: {
    name: string;
    email: string;
    bio: string | null;
    nativeLanguage: string | null;
    currentLevel: string;
    examDate: string | null; // yyyy-MM-dd
    examTarget: string | null;
    avatarUrl: string | null;
  };
}

/** Resize an image file client-side to a small square JPEG data-URL */
async function resizeToDataUrl(file: File, size = 256): Promise<string> {
  const bitmap = await createImageBitmap(file);
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const scale = Math.max(size / bitmap.width, size / bitmap.height);
  const w = bitmap.width * scale;
  const h = bitmap.height * scale;
  ctx.drawImage(bitmap, (size - w) / 2, (size - h) / 2, w, h);
  return canvas.toDataURL("image/jpeg", 0.85);
}

export function ProfileForm({ initial }: Props) {
  const router = useRouter();
  const { update } = useSession();
  const fileRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [avatar, setAvatar] = useState<string | null>(initial.avatarUrl);
  const [form, setForm] = useState({
    name: initial.name,
    bio: initial.bio ?? "",
    nativeLanguage: initial.nativeLanguage ?? "",
    currentLevel: initial.currentLevel,
    examDate: initial.examDate ?? "",
    examTarget: initial.examTarget ?? "",
  });

  async function pickAvatar(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return toast.error("Please choose an image file");
    try {
      const dataUrl = await resizeToDataUrl(file);
      setAvatar(dataUrl);
    } catch {
      toast.error("Could not process the image");
    }
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          bio: form.bio.trim() || null,
          nativeLanguage: form.nativeLanguage.trim() || null,
          currentLevel: form.currentLevel,
          examDate: form.examDate || null,
          examTarget: form.examTarget.trim() || null,
          avatarDataUrl: avatar === initial.avatarUrl ? undefined : avatar,
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error);
      await update({ name: form.name.trim(), image: avatar, currentLevel: form.currentLevel }).catch(() => {});
      toast.success("Profile saved");
      router.refresh();
    } catch (e) {
      toast.error(e instanceof Error && e.message ? e.message : "Could not save profile");
    } finally {
      setBusy(false);
    }
  }

  const initials = form.name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <form onSubmit={save} className="space-y-6">
      {/* Avatar */}
      <div className="flex items-center gap-5">
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="group relative rounded-full outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          aria-label="Change avatar"
        >
          <Avatar className="h-20 w-20 border-2">
            {avatar ? <AvatarImage src={avatar} alt={form.name} /> : null}
            <AvatarFallback className="text-xl">{initials}</AvatarFallback>
          </Avatar>
          <span className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
            <Camera className="h-5 w-5 text-white" />
          </span>
        </button>
        <div>
          <div className="font-semibold">{initial.email}</div>
          <button type="button" onClick={() => fileRef.current?.click()} className="text-sm text-muted-foreground underline-offset-4 hover:underline">
            Upload new photo
          </button>
          {avatar && (
            <button type="button" onClick={() => setAvatar(null)} className="ml-3 text-sm text-muted-foreground underline-offset-4 hover:underline">
              Remove
            </button>
          )}
        </div>
        <input ref={fileRef} type="file" accept="image/*" onChange={pickAvatar} className="hidden" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label>Name</Label>
          <Input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required minLength={2} />
        </div>
        <div className="space-y-1.5">
          <Label>Native language</Label>
          <Input
            value={form.nativeLanguage}
            onChange={(e) => setForm((f) => ({ ...f, nativeLanguage: e.target.value }))}
            placeholder="e.g. Arabic, English…"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label>Bio</Label>
        <Textarea
          value={form.bio}
          onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
          placeholder="Why are you learning German?"
          rows={2}
          maxLength={300}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-1.5">
          <Label>Current level</Label>
          <Select value={form.currentLevel} onValueChange={(v) => setForm((f) => ({ ...f, currentLevel: v }))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {LEVELS.map((l) => (
                <SelectItem key={l} value={l}>
                  {l}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label>Exam target</Label>
          <Input
            value={form.examTarget}
            onChange={(e) => setForm((f) => ({ ...f, examTarget: e.target.value }))}
            placeholder="e.g. telc B1"
          />
        </div>
        <div className="space-y-1.5">
          <Label>Exam date</Label>
          <Input type="date" value={form.examDate} onChange={(e) => setForm((f) => ({ ...f, examDate: e.target.value }))} />
        </div>
      </div>

      <Button type="submit" size="lg" disabled={busy}>
        {busy && <Loader2 className="h-4 w-4 animate-spin" />}
        Save profile
      </Button>
    </form>
  );
}
