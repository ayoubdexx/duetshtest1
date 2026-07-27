"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Megaphone, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  currentLevel: string;
  xp: number;
  streak: number;
  emailVerified: string | null;
  createdAt: string;
  avatarUrl?: string | null;
}

export function UsersTable({ initialUsers, currentUserId }: { initialUsers: AdminUser[]; currentUserId: string }) {
  const [users, setUsers] = useState(initialUsers);
  const [query, setQuery] = useState("");

  const filtered = users.filter(
    (u) => !query || `${u.name} ${u.email}`.toLowerCase().includes(query.toLowerCase())
  );

  async function changeRole(user: AdminUser, role: string) {
    const prev = users;
    setUsers((us) => us.map((u) => (u.id === user.id ? { ...u, role } : u)));
    const res = await fetch("/api/admin/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: user.id, role }),
    });
    if (!res.ok) {
      setUsers(prev);
      const json = await res.json().catch(() => ({}));
      toast.error(json.error ?? "Could not update role");
    } else {
      toast.success(`${user.name} is now ${role.toLowerCase()}`);
    }
  }

  async function remove(user: AdminUser) {
    if (!confirm(`Delete ${user.name} (${user.email}) and ALL their data?`)) return;
    const prev = users;
    setUsers((us) => us.filter((u) => u.id !== user.id));
    const res = await fetch(`/api/admin/users?id=${user.id}`, { method: "DELETE" });
    if (!res.ok) {
      setUsers(prev);
      toast.error("Could not delete user");
    } else {
      toast.success("User deleted");
    }
  }

  return (
    <div>
      <div className="relative mb-4 max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search users…" className="pl-9" />
      </div>
      <div className="overflow-x-auto rounded-2xl border">
        <table className="w-full min-w-[720px] text-sm">
          <thead>
            <tr className="bg-secondary/60 text-left text-xs font-semibold text-muted-foreground">
              <th className="px-4 py-2.5">User</th>
              <th className="px-4 py-2.5">Level</th>
              <th className="px-4 py-2.5">XP</th>
              <th className="px-4 py-2.5">Streak</th>
              <th className="px-4 py-2.5">Verified</th>
              <th className="px-4 py-2.5">Joined</th>
              <th className="px-4 py-2.5">Role</th>
              <th className="px-4 py-2.5" />
            </tr>
          </thead>
          <tbody className="divide-y">
            {filtered.map((u) => (
              <tr key={u.id} className="hover:bg-accent/40">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <Avatar className="h-8 w-8">
                      {u.avatarUrl ? <AvatarImage src={u.avatarUrl} alt={u.name} /> : null}
                      <AvatarFallback className="text-[10px]">
                        {u.name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <div className="truncate font-medium">
                        {u.name}
                        {u.id === currentUserId && <span className="ml-1 text-xs text-muted-foreground">(you)</span>}
                      </div>
                      <div className="truncate text-xs text-muted-foreground">{u.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <Badge variant="secondary">{u.currentLevel}</Badge>
                </td>
                <td className="px-4 py-3">{u.xp.toLocaleString()}</td>
                <td className="px-4 py-3">{u.streak}🔥</td>
                <td className="px-4 py-3">{u.emailVerified ? "✓" : "—"}</td>
                <td className="px-4 py-3 text-xs text-muted-foreground">
                  {new Date(u.createdAt).toLocaleDateString("en", { month: "short", day: "numeric", year: "2-digit" })}
                </td>
                <td className="px-4 py-3">
                  <select
                    value={u.role}
                    onChange={(e) => changeRole(u, e.target.value)}
                    disabled={u.id === currentUserId}
                    className="h-8 rounded-lg border bg-background px-2 text-xs font-medium"
                  >
                    <option value="STUDENT">Student</option>
                    <option value="TEACHER">Teacher</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => remove(u)}
                    disabled={u.id === currentUserId}
                    className="rounded-lg p-1.5 text-muted-foreground hover:bg-accent hover:text-destructive disabled:opacity-30"
                    aria-label="Delete user"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <div className="p-8 text-center text-sm text-muted-foreground">No users found.</div>}
      </div>
    </div>
  );
}

export function AnnouncementsManager({
  initial,
  isAdmin,
}: {
  initial: { id: string; title: string; content: string; createdAt: string; author: string }[];
  isAdmin: boolean;
}) {
  const router = useRouter();
  const [items, setItems] = useState(initial);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [busy, setBusy] = useState(false);

  async function create(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const res = await fetch("/api/admin/announcements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title.trim(), content: content.trim() }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error);
      setItems((is) => [
        { id: json.announcement.id, title: title.trim(), content: content.trim(), createdAt: new Date().toISOString(), author: "You" },
        ...is,
      ]);
      setTitle("");
      setContent("");
      toast.success("Announcement published");
      router.refresh();
    } catch {
      toast.error("Could not publish");
    } finally {
      setBusy(false);
    }
  }

  async function remove(id: string) {
    const prev = items;
    setItems((is) => is.filter((i) => i.id !== id));
    const res = await fetch(`/api/admin/announcements?id=${id}`, { method: "DELETE" });
    if (!res.ok) {
      setItems(prev);
      toast.error("Could not delete");
    }
    router.refresh();
  }

  return (
    <div className="space-y-4">
      <form onSubmit={create} className="space-y-3 rounded-2xl border bg-secondary/30 p-4">
        <div className="flex items-center gap-2 text-sm font-bold">
          <Megaphone className="h-4 w-4" /> New announcement
        </div>
        <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" required minLength={2} />
        <Textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Message shown on every user's dashboard…" rows={2} required minLength={2} />
        <Button type="submit" size="sm" disabled={busy}>
          {busy && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
          Publish
        </Button>
      </form>
      <div className="space-y-2">
        {items.map((a) => (
          <div key={a.id} className="flex items-start gap-3 rounded-xl border bg-card p-4">
            <div className="min-w-0 flex-1">
              <div className="font-semibold">{a.title}</div>
              <p className="mt-0.5 text-sm text-muted-foreground">{a.content}</p>
              <div className="mt-1 text-xs text-muted-foreground/70">
                {a.author} · {new Date(a.createdAt).toLocaleDateString("en", { dateStyle: "medium" })}
              </div>
            </div>
            {isAdmin && (
              <button onClick={() => remove(a.id)} className="rounded-lg p-1.5 text-muted-foreground hover:text-destructive" aria-label="Delete announcement">
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </div>
        ))}
        {items.length === 0 && <p className="py-4 text-center text-sm text-muted-foreground">No announcements yet.</p>}
      </div>
    </div>
  );
}
