import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";

export default NextAuth(authConfig).auth;

export const config = {
  matcher: [
    // Protect pages only — API routes enforce auth themselves (JSON 401s, not redirects)
    "/((?!api|_next/static|_next/image|favicon.ico|icons/|images/|audio/|manifest.webmanifest|sw.js|robots.txt).*)",
  ],
};
