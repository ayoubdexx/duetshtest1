interface MailInput {
  to: string;
  subject: string;
  html: string;
}

export interface MailResult {
  sent: boolean;
  devMode: boolean;
}

/**
 * Pluggable mailer.
 * - With RESEND_API_KEY set → sends real email via Resend HTTP API.
 * - Without it → dev-mail mode: logs the message to the server console so
 *   flows remain fully testable locally (the API additionally surfaces the
 *   action link to the client in dev mode).
 */
export async function sendMail({ to, subject, html }: MailInput): Promise<MailResult> {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.log(`\n━━━ [dev-mail] ━━━\nTo:      ${to}\nSubject: ${subject}\n${html.replace(/<[^>]+>/g, "").trim()}\n━━━━━━━━━━━━━━━━━━\n`);
    return { sent: false, devMode: true };
  }
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from: process.env.EMAIL_FROM ?? "Deutschwerk <onboarding@resend.dev>", to, subject, html }),
  });
  if (!res.ok) {
    console.error("[mailer] Resend error:", res.status, await res.text());
    return { sent: false, devMode: false };
  }
  return { sent: true, devMode: false };
}

export function emailShell(title: string, bodyHtml: string, ctaLabel?: string, ctaUrl?: string) {
  return `<!DOCTYPE html><html><body style="margin:0;padding:0;background:#f4f4f5;font-family:-apple-system,Segoe UI,Roboto,sans-serif;">
  <div style="max-width:520px;margin:32px auto;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e4e4e7;">
    <div style="padding:28px 32px 0;">
      <div style="font-size:20px;font-weight:700;letter-spacing:-0.02em;color:#18181b;">Deutsch<span style="color:#c97a19;">werk</span></div>
    </div>
    <div style="padding:20px 32px 8px;">
      <h1 style="font-size:22px;margin:0 0 12px;color:#18181b;letter-spacing:-0.02em;">${title}</h1>
      <div style="font-size:15px;line-height:1.6;color:#3f3f46;">${bodyHtml}</div>
      ${ctaLabel && ctaUrl ? `<a href="${ctaUrl}" style="display:inline-block;margin:20px 0 8px;background:#18181b;color:#ffffff;text-decoration:none;font-size:14px;font-weight:600;padding:12px 22px;border-radius:10px;">${ctaLabel}</a>` : ""}
    </div>
    <div style="padding:16px 32px 28px;font-size:12px;color:#a1a1aa;">Dein Weg von A1 bis B2 · Deutschwerk</div>
  </div>
</body></html>`;
}
