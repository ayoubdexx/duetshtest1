import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/app/page-header";
import { UsersTable } from "@/components/admin/admin-widgets";

export const metadata = { title: "Users · Admin" };

export default async function AdminUsersPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  if (session.user.role !== "ADMIN") redirect("/admin");

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      currentLevel: true,
      xp: true,
      streak: true,
      emailVerified: true,
      createdAt: true,
      avatarUrl: true,
    },
  });

  return (
    <div>
      <div className="mb-2 text-sm text-muted-foreground">
        <Link href="/admin" className="hover:text-foreground">
          Admin
        </Link>{" "}
        / <span className="text-foreground">Users</span>
      </div>
      <PageHeader title="User Management" description="Roles, verification status and account administration." />
      <UsersTable
        initialUsers={users.map((u) => ({
          id: u.id,
          name: u.name,
          email: u.email,
          role: u.role,
          currentLevel: u.currentLevel,
          xp: u.xp,
          streak: u.streak,
          emailVerified: u.emailVerified?.toISOString() ?? null,
          createdAt: u.createdAt.toISOString(),
          avatarUrl: u.avatarUrl,
        }))}
        currentUserId={session.user.id}
      />
    </div>
  );
}
