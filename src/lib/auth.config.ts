import type { NextAuthConfig } from "next-auth";

const PUBLIC_PATHS = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/verify-email",
];

/**
 * Edge-safe auth config (no Prisma / bcrypt imports) — used by middleware.
 * The full config with the Credentials provider lives in src/lib/auth.ts.
 */
export const authConfig = {
  pages: { signIn: "/login" },
  session: { strategy: "jwt" },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const p = nextUrl.pathname;

      const isPublic =
        p === "/" ||
        PUBLIC_PATHS.some((x) => p.startsWith(x)) ||
        p.startsWith("/api/auth") ||
        p.startsWith("/api/register") ||
        p.startsWith("/api/password") ||
        p.startsWith("/api/verify");

      if (isPublic) {
        if (isLoggedIn && (p.startsWith("/login") || p.startsWith("/register"))) {
          return Response.redirect(new URL("/dashboard", nextUrl));
        }
        return true;
      }
      return isLoggedIn;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
