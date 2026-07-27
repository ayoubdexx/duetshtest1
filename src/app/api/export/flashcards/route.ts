import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function csvEscape(s: string): string {
  if (/[",\n;]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

/** GET — export the user's flashcards as an Anki-compatible CSV */
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return new Response("Unauthorized", { status: 401 });

  const cards = await prisma.flashcard.findMany({
    where: { userId: session.user.id },
    include: { word: true },
    orderBy: { createdAt: "asc" },
  });

  const header = "Front;Back;Example;Notes;Deck";
  const rows = cards.map((c) => {
    const example = c.word?.exampleDe ?? "";
    return [c.front, c.back, example, c.notes ?? c.word?.memoryTip ?? "", c.deck].map(csvEscape).join(";");
  });

  const csv = "﻿" + [header, ...rows].join("\n");

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="deutschwerk-flashcards.csv"`,
    },
  });
}
