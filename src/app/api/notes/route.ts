import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/** Very small sanitizer for self-authored rich text (strips scripts/event handlers). */
function sanitize(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/\son\w+="[^"]*"/gi, "")
    .replace(/\son\w+='[^']*'/gi, "")
    .replace(/javascript:/gi, "");
}

const createSchema = z.object({
  title: z.string().max(160).default("Untitled"),
  content: z.string().max(50000).default(""),
  folderId: z.string().nullable().optional(),
});

const updateSchema = z.object({
  id: z.string().min(1),
  title: z.string().max(160).optional(),
  content: z.string().max(50000).optional(),
  folderId: z.string().nullable().optional(),
});

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const [notes, folders] = await Promise.all([
    prisma.note.findMany({ where: { userId: session.user.id }, orderBy: { updatedAt: "desc" } }),
    prisma.noteFolder.findMany({ where: { userId: session.user.id }, orderBy: { createdAt: "asc" } }),
  ]);
  return NextResponse.json({ notes, folders });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = createSchema.safeParse(body ?? {});
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  const note = await prisma.note.create({
    data: {
      userId: session.user.id,
      title: parsed.data.title || "Untitled",
      content: sanitize(parsed.data.content),
      folderId: parsed.data.folderId ?? null,
    },
  });
  return NextResponse.json({ note });
}

export async function PATCH(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  const note = await prisma.note.findUnique({ where: { id: parsed.data.id } });
  if (!note || note.userId !== session.user.id) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const updated = await prisma.note.update({
    where: { id: note.id },
    data: {
      title: parsed.data.title,
      content: parsed.data.content !== undefined ? sanitize(parsed.data.content) : undefined,
      folderId: parsed.data.folderId,
    },
  });
  return NextResponse.json({ note: updated });
}

export async function DELETE(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const note = await prisma.note.findUnique({ where: { id } });
  if (!note || note.userId !== session.user.id) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await prisma.note.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
