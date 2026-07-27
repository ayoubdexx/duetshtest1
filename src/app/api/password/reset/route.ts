import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  token: z.string().min(10),
  password: z.string().min(8, "Password must be at least 8 characters").max(100),
});

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 400 });
  }

  const record = await prisma.authToken.findUnique({ where: { token: parsed.data.token } });
  if (!record || record.type !== "RESET_PASSWORD") {
    return NextResponse.json({ error: "This reset link is invalid." }, { status: 400 });
  }
  if (record.expires < new Date()) {
    await prisma.authToken.delete({ where: { token: record.token } });
    return NextResponse.json({ error: "This reset link has expired. Please request a new one." }, { status: 400 });
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 10);
  await prisma.user.update({
    where: { email: record.identifier },
    data: { passwordHash, emailVerified: new Date() },
  });
  await prisma.authToken.deleteMany({ where: { identifier: record.identifier, type: "RESET_PASSWORD" } });

  return NextResponse.json({ ok: true });
}
