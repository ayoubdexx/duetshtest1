import { redirect } from "next/navigation";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AppShell } from "@/components/app/app-shell";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      avatarUrl: true,
      role: true,
      currentLevel: true,
      xp: true,
      streak: true,
    },
  });

  // Stale JWT (e.g. after a database reseed) — force re-authentication
  if (!user) redirect("/api/auth/signout");

  return (
    <SessionProvider>
      <AppShell
        user={{
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.avatarUrl,
          role: user.role,
          currentLevel: user.currentLevel,
          xp: user.xp,
          streak: user.streak,
        }}
      >
        {children}
      </AppShell>
    </SessionProvider>
  );
}
