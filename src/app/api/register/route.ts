import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { sendMail, emailShell } from "@/lib/mailer";

const schema = z.object({
  name: z.string().min(2, "Name is too short").max(60),
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters").max(100),
});

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 400 });
  }
  const { name, password } = parsed.data;
  const email = parsed.data.email.toLowerCase();

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  await prisma.user.create({ data: { name, email, passwordHash } });

  const token = crypto.randomBytes(32).toString("hex");
  await prisma.authToken.create({
    data: {
      identifier: email,
      token,
      type: "VERIFY_EMAIL",
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    },
  });

  const base = process.env.NEXT_PUBLIC_APP_URL ?? new URL(req.url).origin;
  const url = `${base}/api/verify?token=${token}`;
  const mail = await sendMail({
    to: email,
    subject: "Verify your email · Deutschwerk",
    html: emailShell(
      "Willkommen bei Deutschwerk! 👋",
      `<p>Hi ${name},</p><p>one click and your German journey begins. Please confirm your email address to activate your account.</p>`,
      "Verify my email",
      url
    ),
  });

  return NextResponse.json({
    ok: true,
    // In dev-mail mode we surface the link so the flow is fully testable locally.
    devVerifyUrl: mail.devMode ? url : undefined,
  });
}
