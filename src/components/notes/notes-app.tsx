"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  Bold,
  Folder,
  FolderPlus,
  Italic,
  List,
  ListOrdered,
  Plus,
  Search,
  StickyNote,
  Trash2,
  Underline,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export interface NoteDTO {
  id: string;
  title: string;
  content: string;
  folderId: string | null;
  updatedAt: string;
}

export interface FolderDTO {
  id: string;
  name: string;
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

export function NotesApp({ initialNotes, initialFolders }: { initialNotes: NoteDTO[]; initialFolders: FolderDTO[] }) {
  const [notes, setNotes] = useState(initialNotes);
  const [folders, setFolders] = useState(initialFolders);
  const [folderId, setFolderId] = useState<string | null | "all">("all");
  const [selectedId, setSelectedId] = useState<string | null>(initialNotes[0]?.id ?? null);
  const [query, setQuery] = useState("");
  const [saved, setSaved] = useState(true);
  const [mobileEditing, setMobileEditing] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const selected = notes.find((n) => n.id === selectedId) ?? null;

  const filtered = notes.filter((n) => {
    if (folderId !== "all" && n.folderId !== folderId) return false;
    if (query && !`${n.title} ${stripHtml(n.content)}`.toLowerCase().includes(query.toLowerCase())) return false;
    return true;
  });

  // Load selected note into the editor
  useEffect(() => {
    if (editorRef.current && selected) {
      editorRef.current.innerHTML = selected.content || "";
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId]);

  const persist = useCallback(
    (id: string, data: { title?: string; content?: string; folderId?: string | null }) => {
      setSaved(false);
      if (saveTimer.current) clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(async () => {
        const res = await fetch("/api/notes", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id, ...data }),
        });
        if (res.ok) setSaved(true);
        else toast.error("Could not save the note");
      }, 700);
    },
    []
  );

  async function createNote() {
    const res = await fetch("/api/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "Neue Notiz", folderId: folderId === "all" ? null : folderId }),
    });
    if (!res.ok) return toast.error("Could not create note");
    const { note } = await res.json();
    setNotes((ns) => [{ ...note, updatedAt: note.updatedAt }, ...ns]);
    setSelectedId(note.id);
    setMobileEditing(true);
  }

  async function deleteNote(id: string) {
    if (!confirm("Delete this note?")) return;
    const prev = notes;
    setNotes((ns) => ns.filter((n) => n.id !== id));
    if (selectedId === id) setSelectedId(null);
    const res = await fetch(`/api/notes?id=${id}`, { method: "DELETE" });
    if (!res.ok) {
      setNotes(prev);
      toast.error("Could not delete");
    }
  }

  async function createFolder() {
    const name = prompt("Folder name:");
    if (!name?.trim()) return;
    const res = await fetch("/api/notes/folders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name.trim() }),
    });
    if (!res.ok) return toast.error("Could not create folder");
    const { folder } = await res.json();
    setFolders((fs) => [...fs, folder]);
  }

  function updateLocal(id: string, data: Partial<NoteDTO>) {
    setNotes((ns) => ns.map((n) => (n.id === id ? { ...n, ...data, updatedAt: new Date().toISOString() } : n)));
  }

  function exec(cmd: string) {
    document.execCommand(cmd);
    editorRef.current?.focus();
    if (selected && editorRef.current) {
      const html = editorRef.current.innerHTML;
      updateLocal(selected.id, { content: html });
      persist(selected.id, { content: html });
    }
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[220px_300px_1fr]">
      {/* Folders */}
      <div className={cn("space-y-1", mobileEditing && "hidden lg:block")}>
        <button
          onClick={() => setFolderId("all")}
          className={cn(
            "flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium",
            folderId === "all" ? "bg-primary text-primary-foreground" : "hover:bg-accent"
          )}
        >
          <StickyNote className="h-4 w-4" /> All notes
          <span className="ml-auto text-xs opacity-70">{notes.length}</span>
        </button>
        {folders.map((f) => (
          <button
            key={f.id}
            onClick={() => setFolderId(f.id)}
            className={cn(
              "flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium",
              folderId === f.id ? "bg-primary text-primary-foreground" : "hover:bg-accent"
            )}
          >
            <Folder className="h-4 w-4" /> <span className="truncate">{f.name}</span>
            <span className="ml-auto text-xs opacity-70">{notes.filter((n) => n.folderId === f.id).length}</span>
          </button>
        ))}
        <Button variant="ghost" size="sm" onClick={createFolder} className="w-full justify-start text-muted-foreground">
          <FolderPlus className="h-4 w-4" /> New folder
        </Button>
      </div>

      {/* Note list */}
      <div className={cn("space-y-3", mobileEditing && "hidden lg:block")}>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search notes…" className="h-9 pl-8 text-sm" />
          </div>
          <Button size="icon-sm" onClick={createNote} aria-label="New note" className="h-9 w-9">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="max-h-[60vh] space-y-1.5 overflow-y-auto pr-1">
          {filtered.map((n) => (
            <button
              key={n.id}
              onClick={() => {
                setSelectedId(n.id);
                setMobileEditing(true);
              }}
              className={cn(
                "w-full rounded-xl border p-3 text-left transition-colors",
                selectedId === n.id ? "border-primary/40 bg-accent" : "bg-card hover:bg-accent/60"
              )}
            >
              <div className="truncate text-sm font-semibold">{n.title || "Untitled"}</div>
              <div className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{stripHtml(n.content) || "Empty note"}</div>
              <div className="mt-1 text-[10px] text-muted-foreground/70">
                {new Date(n.updatedAt).toLocaleDateString("en", { month: "short", day: "numeric" })}
              </div>
            </button>
          ))}
          {filtered.length === 0 && (
            <div className="rounded-xl border border-dashed p-6 text-center text-sm text-muted-foreground">
              No notes here yet.
            </div>
          )}
        </div>
      </div>

      {/* Editor */}
      <div className={cn(!mobileEditing && "hidden lg:block")}>
        {selected ? (
          <div className="overflow-hidden rounded-2xl border bg-card shadow-card">
            <div className="flex flex-wrap items-center gap-1 border-b bg-secondary/40 px-3 py-2">
              <Button variant="ghost" size="icon-sm" className="lg:hidden" onClick={() => setMobileEditing(false)}>
                ←
              </Button>
              <Button variant="ghost" size="icon-sm" onClick={() => exec("bold")} aria-label="Bold">
                <Bold className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon-sm" onClick={() => exec("italic")} aria-label="Italic">
                <Italic className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon-sm" onClick={() => exec("underline")} aria-label="Underline">
                <Underline className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon-sm" onClick={() => exec("insertUnorderedList")} aria-label="Bullet list">
                <List className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon-sm" onClick={() => exec("insertOrderedList")} aria-label="Numbered list">
                <ListOrdered className="h-4 w-4" />
              </Button>
              <div className="mx-1 h-5 w-px bg-border" />
              <select
                value={selected.folderId ?? ""}
                onChange={(e) => {
                  const v = e.target.value || null;
                  updateLocal(selected.id, { folderId: v });
                  persist(selected.id, { folderId: v });
                }}
                className="h-8 rounded-lg border bg-background px-2 text-xs"
              >
                <option value="">No folder</option>
                {folders.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name}
                  </option>
                ))}
              </select>
              <div className="ml-auto flex items-center gap-2">
                <Badge variant="secondary" className="text-[10px]">
                  {saved ? "Saved ✓" : "Saving…"}
                </Badge>
                <Button variant="ghost" size="icon-sm" onClick={() => deleteNote(selected.id)} aria-label="Delete note">
                  <Trash2 className="h-4 w-4 text-muted-foreground" />
                </Button>
              </div>
            </div>
            <input
              value={selected.title}
              onChange={(e) => {
                updateLocal(selected.id, { title: e.target.value });
                persist(selected.id, { title: e.target.value });
              }}
              placeholder="Title"
              className="w-full border-b bg-transparent px-5 py-3.5 text-lg font-bold outline-none"
            />
            <div
              ref={editorRef}
              contentEditable
              suppressContentEditableWarning
              onInput={() => {
                const html = editorRef.current?.innerHTML ?? "";
                updateLocal(selected.id, { content: html });
                persist(selected.id, { content: html });
              }}
              className="prose prose-sm min-h-[46vh] max-w-none px-5 py-4 outline-none dark:prose-invert [&_li]:my-0.5"
            />
          </div>
        ) : (
          <div className="flex min-h-[40vh] flex-col items-center justify-center rounded-2xl border border-dashed text-center">
            <StickyNote className="h-8 w-8 text-muted-foreground/50" />
            <p className="mt-3 text-sm text-muted-foreground">Select a note — or create your first one.</p>
            <Button className="mt-4" onClick={createNote}>
              <Plus className="h-4 w-4" /> New note
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
