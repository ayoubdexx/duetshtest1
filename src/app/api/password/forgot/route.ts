import { NextResponse } from "next/server";
import crypto from "crypto";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { sendMail, emailShell } from "@/lib/mailer";

const schema = z.object({ email: z.string().email() });

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid email" }, { status: 400 });

  const email = parsed.data.email.toLowerCase();
  const user = await prisma.user.findUnique({ where: { email } });

  // Always report success — never leak whether an account exists.
  if (!user) return NextResponse.json({ ok: true });

  const token = crypto.randomBytes(32).toString("hex");
  await prisma.authToken.create({
    data: { identifier: email, token, type: "RESET_PASSWORD", expires: new Date(Date.now() + 60 * 60 * 1000) },
  });

  const base = process.env.NEXT_PUBLIC_APP_URL ?? new URL(req.url).origin;
  const url = `${base}/reset-password?token=${token}`;
  const mail = await sendMail({
    to: email,
    subject: "Reset your password · Deutschwerk",
    html: emailShell(
      "Reset your password",
      `<p>Hi ${user.name},</p><p>we received a request to reset your password. The link is valid for one hour. If you didn't request this, you can safely ignore this email.</p>`,
      "Choose a new password",
      url
    ),
  });

  return NextResponse.json({ ok: true, devResetUrl: mail.devMode ? url : undefined });
}
