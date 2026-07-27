import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { sendMail, emailShell } from "@/lib/mailer";

/** GET /api/verify?token=… — verify email, then redirect to the status page */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const token = url.searchParams.get("token");
  const base = process.env.NEXT_PUBLIC_APP_URL ?? url.origin;

  if (!token) return NextResponse.redirect(`${base}/verify-email?status=invalid`);

  const record = await prisma.authToken.findUnique({ where: { token } });
  if (!record || record.type !== "VERIFY_EMAIL") {
    return NextResponse.redirect(`${base}/verify-email?status=invalid`);
  }
  if (record.expires < new Date()) {
    await prisma.authToken.delete({ where: { token } });
    return NextResponse.redirect(`${base}/verify-email?status=expired`);
  }

  await prisma.user.update({
    where: { email: record.identifier },
    data: { emailVerified: new Date() },
  });
  await prisma.authToken.deleteMany({ where: { identifier: record.identifier, type: "VERIFY_EMAIL" } });

  return NextResponse.redirect(`${base}/verify-email?status=success`);
}

/** POST /api/verify — resend the verification email */
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const email = typeof body?.email === "string" ? body.email.toLowerCase() : null;
  if (!email) return NextResponse.json({ error: "Email required" }, { status: 400 });

  const user = await prisma.user.findUnique({ where: { email } });
  // Do not leak account existence
  if (!user || user.emailVerified) return NextResponse.json({ ok: true });

  const token = crypto.randomBytes(32).toString("hex");
  await prisma.authToken.create({
    data: { identifier: email, token, type: "VERIFY_EMAIL", expires: new Date(Date.now() + 24 * 60 * 60 * 1000) },
  });
  const base = process.env.NEXT_PUBLIC_APP_URL ?? new URL(req.url).origin;
  const url = `${base}/api/verify?token=${token}`;
  const mail = await sendMail({
    to: email,
    subject: "Verify your email · Deutschwerk",
    html: emailShell("Confirm your email", `<p>Please confirm your email address to activate your account.</p>`, "Verify my email", url),
  });

  return NextResponse.json({ ok: true, devVerifyUrl: mail.devMode ? url : undefined });
}
