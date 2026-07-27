import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "STUDENT" | "TEACHER" | "ADMIN";
      currentLevel: string;
    } & DefaultSession["user"];
  }

  interface User {
    role?: string;
    currentLevel?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: string;
    currentLevel?: string;
  }
}
