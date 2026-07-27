import { redirect } from "next/navigation";
import { format } from "date-fns";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/app/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { ProfileForm } from "@/components/profile/profile-form";
import { Badge } from "@/components/ui/badge";
import { levelMeta } from "@/lib/levels";

export const metadata = { title: "Profile" };

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      name: true,
      email: true,
      bio: true,
      nativeLanguage: true,
      currentLevel: true,
      examDate: true,
      examTarget: true,
      avatarUrl: true,
      role: true,
      xp: true,
      streak: true,
      longestStreak: true,
      createdAt: true,
    },
  });
  if (!user) redirect("/login");

  const meta = levelMeta(user.currentLevel);

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader title="Profile" description="Your identity on Deutschwerk — and your learning setup.">
        <div className="flex items-center gap-2">
          <Badge className={`${meta.color} border-transparent text-white`}>{user.currentLevel}</Badge>
          {user.role !== "STUDENT" && <Badge variant="brand">{user.role.toLowerCase()}</Badge>}
        </div>
      </PageHeader>

      <Card className="mb-6">
        <CardContent className="flex flex-wrap items-center gap-x-8 gap-y-3 p-5 text-sm">
          <div>
            <div className="text-xs text-muted-foreground">Member since</div>
            <div className="font-semibold">{user.createdAt.toLocaleDateString("en", { month: "long", year: "numeric" })}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Total XP</div>
            <div className="font-semibold">{user.xp.toLocaleString()}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Current streak</div>
            <div className="font-semibold">{user.streak} days</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Longest streak</div>
            <div className="font-semibold">{user.longestStreak} days</div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <ProfileForm
            initial={{
              name: user.name,
              email: user.email,
              bio: user.bio,
              nativeLanguage: user.nativeLanguage,
              currentLevel: user.currentLevel,
              examDate: user.examDate ? format(user.examDate, "yyyy-MM-dd") : null,
              examTarget: user.examTarget,
              avatarUrl: user.avatarUrl,
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
