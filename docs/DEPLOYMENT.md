# Deploying Deutschwerk

The recommended production setup is **Vercel (app) + Supabase (PostgreSQL)** — both have generous free tiers and deploy in ~10 minutes. Any Node host + Postgres works the same way.

---

## Option A — Vercel + Supabase (recommended)

### 1. Create the database (Supabase)

1. [supabase.com](https://supabase.com) → **New project** (pick a strong DB password, region close to your users)
2. Project **Settings → Database → Connection string**:
   - Copy the **URI** in *Transaction pooler* mode (port `6543`) → this becomes `DATABASE_URL`
   - Append `?pgbouncer=true&connection_limit=1` for serverless safety
   - Also copy the *Direct connection* (port `5432`) — you'll use it once for schema push & seed

### 2. Push schema and seed (from your machine)

```bash
# Use the DIRECT (5432) connection for these one-time commands:
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[REF].supabase.co:5432/postgres" pnpm db:push
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[REF].supabase.co:5432/postgres" pnpm db:seed
```

### 3. Deploy the app (Vercel)

1. Push this repository to GitHub
2. [vercel.com](https://vercel.com) → **Add New Project** → import the repo (framework auto-detected: Next.js)
3. Set **Environment Variables**:

   | Name | Value |
   |---|---|
   | `DATABASE_URL` | the **pooler** URI (port 6543, with `?pgbouncer=true&connection_limit=1`) |
   | `AUTH_SECRET` | `openssl rand -base64 32` |
   | `AUTH_TRUST_HOST` | `true` |
   | `NEXT_PUBLIC_APP_URL` | `https://your-app.vercel.app` (update after first deploy) |
   | `RESEND_API_KEY` | *(optional)* from [resend.com](https://resend.com) for real emails |
   | `EMAIL_FROM` | *(optional)* e.g. `Deutschwerk <noreply@yourdomain.com>` |
   | `AI_API_KEY` | *(optional)* OpenAI-compatible key for AI writing feedback |

4. **Deploy.** `prisma generate` runs automatically via the `postinstall` script.
5. After the first deploy, set `NEXT_PUBLIC_APP_URL` to the real URL and redeploy (needed for correct email links).

### 4. Post-deploy checklist

- [ ] Register a fresh account → verification flow works (real email, or dev-link if no `RESEND_API_KEY`)
- [ ] Sign in with `admin@deutschwerk.dev` / `deutschwerk` → **change this password immediately** (Settings → Password), or delete the demo accounts via the Admin panel
- [ ] Open a lesson, play a listening exercise (audio serves from `/public/audio`)
- [ ] Print a lesson PDF (Library → any item → Save as PDF)

---

## Option B — Any Node server (VPS, Railway, Render, Fly…)

```bash
# Requirements: Node 20+, pnpm, PostgreSQL 14+
git clone <repo> && cd deutschwerk
pnpm install
cp .env.example .env        # fill in DATABASE_URL, AUTH_SECRET, NEXT_PUBLIC_APP_URL
pnpm db:push && pnpm db:seed
pnpm build
pnpm start                  # serves on :3000 — put nginx/Caddy in front for TLS
```

For process management use systemd or PM2 (`pm2 start "pnpm start" --name deutschwerk`).

---

## Notes & FAQs

**Migrations vs. db push** — this project ships with `db push` for simplicity. For team workflows, switch to migrations: `pnpm prisma migrate dev --name init` locally, then `pnpm prisma migrate deploy` in CI/production.

**Is the seed idempotent?** Yes — content upserts by slug/code; user progress is never wiped. Vocabulary words are re-created per topic on each seed (flashcards linked to replaced words fall back gracefully).

**Avatars** — stored as small data-URLs in the database (zero-config, serverless-safe). For very large user bases, swap `avatarUrl` for object storage (e.g. Supabase Storage) — it's a single column + one API route.

**Email without Resend?** The mailer is a single function (`src/lib/mailer.ts`) — swap in SMTP/nodemailer or any provider in ~10 lines.

**Scaling content** — everything lives in `prisma/seed-data/`. Adding C1: add the level to `levels.ts`, create `lessons-c1.ts`, extend `LEVELS` in `src/lib/levels.ts` — the whole UI picks it up automatically.
