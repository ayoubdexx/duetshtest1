import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/app/page-header";
import { NotesApp } from "@/components/notes/notes-app";

export const metadata = { title: "Notes" };

export default async function NotesPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const [notes, folders] = await Promise.all([
    prisma.note.findMany({ where: { userId: session.user.id }, orderBy: { updatedAt: "desc" } }),
    prisma.noteFolder.findMany({ where: { userId: session.user.id }, orderBy: { createdAt: "asc" } }),
  ]);

  return (
    <div>
      <PageHeader
        title="Notes"
        description="Your personal study notebook — rich text, folders and instant autosave."
      />
      <NotesApp
        initialNotes={notes.map((n) => ({
          id: n.id,
          title: n.title,
          content: n.content,
          folderId: n.folderId,
          updatedAt: n.updatedAt.toISOString(),
        }))}
        initialFolders={folders.map((f) => ({ id: f.id, name: f.name }))}
      />
    </div>
  );
}
