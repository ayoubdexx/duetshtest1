import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { authConfig } from "@/lib/auth.config";

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: { email: {}, password: {} },
      async authorize(raw) {
        const parsed = credentialsSchema.safeParse(raw);
        if (!parsed.success) return null;
        const { email, password } = parsed.data;

        const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
        if (!user) return null;

        const ok = await bcrypt.compare(password, user.passwordHash);
        if (!ok) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.avatarUrl,
          role: user.role,
          currentLevel: user.currentLevel,
        };
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role?: string }).role ?? "STUDENT";
        token.currentLevel = (user as { currentLevel?: string }).currentLevel ?? "A1";
        token.picture = user.image ?? null;
      }
      if (trigger === "update" && session) {
        const s = session as { name?: string; image?: string | null; currentLevel?: string };
        if (s.name) token.name = s.name;
        if (s.image !== undefined) token.picture = s.image;
        if (s.currentLevel) token.currentLevel = s.currentLevel;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = (token.id as string) ?? "";
        session.user.role = (token.role as "STUDENT" | "TEACHER" | "ADMIN") ?? "STUDENT";
        session.user.currentLevel = (token.currentLevel as string) ?? "A1";
        session.user.image = (token.picture as string | null) ?? null;
      }
      return session;
    },
  },
});

/** Server helper: current user id or throws (for API routes) */
export async function requireUserId(): Promise<string> {
  const session = await auth();
  if (!session?.user?.id) throw new Error("UNAUTHORIZED");
  return session.user.id;
}

export async function requireRole(roles: Array<"TEACHER" | "ADMIN">): Promise<{ userId: string; role: string }> {
  const session = await auth();
  if (!session?.user?.id) throw new Error("UNAUTHORIZED");
  const role = session.user.role;
  if (role !== "ADMIN" && !roles.includes(role as "TEACHER" | "ADMIN")) throw new Error("FORBIDDEN");
  return { userId: session.user.id, role };
}
