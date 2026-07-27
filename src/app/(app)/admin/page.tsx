import Link from "next/link";
import { redirect } from "next/navigation";
import { subDays } from "date-fns";
import { Users, GraduationCap, BookOpen, Layers, ClipboardCheck, MessagesSquare, ArrowRight, Database } from "lucide-react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/app/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AnnouncementsManager } from "@/components/admin/admin-widgets";

export const metadata = { title: "Admin Panel" };

export default async function AdminPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  if (session.user.role !== "ADMIN" && session.user.role !== "TEACHER") redirect("/dashboard");

  const weekAgo = subDays(new Date(), 7);
  const [userCount, newUsers, activeUsers, lessonCount, grammarCount, wordCount, exerciseCount, examCount, postCount, submissionCount, announcements] =
    await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { createdAt: { gte: weekAgo } } }),
      prisma.user.count({ where: { lastActiveAt: { gte: weekAgo } } }),
      prisma.lesson.count(),
      prisma.grammarTopic.count(),
      prisma.vocabWord.count(),
      prisma.exercise.count(),
      prisma.mockExam.count(),
      prisma.post.count(),
      prisma.writingSubmission.count(),
      prisma.announcement.findMany({
        orderBy: { createdAt: "desc" },
        take: 10,
        include: { author: { select: { name: true } } },
      }),
    ]);

  const stats = [
    { icon: Users, label: "Total users", value: userCount, sub: `+${newUsers} this week` },
    { icon: Users, label: "Active (7d)", value: activeUsers, sub: `${userCount > 0 ? Math.round((activeUsers / userCount) * 100) : 0}% of all users` },
    { icon: GraduationCap, label: "Lessons", value: lessonCount, sub: "published content" },
    { icon: BookOpen, label: "Grammar topics", value: grammarCount, sub: "across A1–B2" },
    { icon: Layers, label: "Vocabulary words", value: wordCount, sub: "in topic packs" },
    { icon: ClipboardCheck, label: "Exercises & exams", value: exerciseCount + examCount, sub: `${examCount} mock exams` },
    { icon: MessagesSquare, label: "Forum posts", value: postCount, sub: "community discussions" },
    { icon: BookOpen, label: "Writing submissions", value: submissionCount, sub: "corrected texts" },
  ];

  return (
    <div>
      <PageHeader title="Admin Panel" description="Platform health, users and content at a glance.">
        <Link href="/admin/users">
          <Button>
            <Users className="h-4 w-4" /> Manage users
          </Button>
        </Link>
      </PageHeader>

      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardContent className="p-4">
              <s.icon className="h-4 w-4 text-muted-foreground" />
              <div className="mt-2 text-2xl font-bold leading-none tracking-tight">{s.value.toLocaleString()}</div>
              <div className="mt-1 text-xs font-medium">{s.label}</div>
              <div className="text-[11px] text-muted-foreground">{s.sub}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Announcements</CardTitle>
            <CardDescription>Shown as a banner on every user's dashboard.</CardDescription>
          </CardHeader>
          <CardContent>
            <AnnouncementsManager
              initial={announcements.map((a) => ({
                id: a.id,
                title: a.title,
                content: a.content,
                createdAt: a.createdAt.toISOString(),
                author: a.author.name,
              }))}
              isAdmin={session.user.role === "ADMIN"}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Content management</CardTitle>
            <CardDescription>How curriculum content is maintained.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm leading-relaxed text-muted-foreground">
            <p>
              All curriculum content (levels, modules, lessons, grammar, vocabulary, readings, listening, speaking,
              writing tasks, exercises and mock exams) lives in versioned seed files under{" "}
              <code className="rounded bg-secondary px-1.5 py-0.5 font-mono text-xs">prisma/seed-data/</code> — the
              single source of truth that scales to C1/C2 without code changes.
            </p>
            <div className="rounded-xl border bg-secondary/40 p-4">
              <div className="flex items-center gap-2 font-semibold text-foreground">
                <Database className="h-4 w-4" /> Edit content
              </div>
              <ol className="mt-2 list-decimal space-y-1 pl-5 text-xs">
                <li>Edit or add entries in prisma/seed-data/*</li>
                <li>
                  Run <code className="rounded bg-secondary px-1 font-mono">pnpm db:seed</code> (idempotent upserts)
                </li>
                <li>
                  For ad-hoc fixes: <code className="rounded bg-secondary px-1 font-mono">pnpm db:studio</code> opens a
                  full database GUI
                </li>
              </ol>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Link href="/courses" className="group flex items-center justify-between rounded-xl border p-3 text-xs font-medium text-foreground hover:bg-accent">
                Preview courses <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link href="/library" className="group flex items-center justify-between rounded-xl border p-3 text-xs font-medium text-foreground hover:bg-accent">
                Preview PDFs <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
