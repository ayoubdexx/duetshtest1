import Link from "next/link";
import { redirect } from "next/navigation";
import { MessageSquare } from "lucide-react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/app/page-header";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { NewPostDialog } from "@/components/community/discussion-forms";
import { cn } from "@/lib/utils";

export const metadata = { title: "Discussion" };

const CATEGORIES = ["Allgemein", "Grammatik", "Prüfungen", "Ausbildung", "Small Talk"];

export default async function DiscussionPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const { category } = await searchParams;
  const activeCategory = category && CATEGORIES.includes(category) ? category : null;

  const posts = await prisma.post.findMany({
    where: activeCategory ? { category: activeCategory } : undefined,
    orderBy: { createdAt: "desc" },
    take: 50,
    include: {
      user: { select: { name: true, avatarUrl: true, currentLevel: true } },
      _count: { select: { comments: true } },
    },
  });

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title="Discussion" description="Questions, tips and conversation with fellow learners.">
        <NewPostDialog />
      </PageHeader>

      <div className="mb-6 flex flex-wrap gap-2">
        <Link href="/discussion">
          <Badge variant={activeCategory === null ? "default" : "secondary"} className="cursor-pointer px-3 py-1.5 text-xs">
            All
          </Badge>
        </Link>
        {CATEGORIES.map((c) => (
          <Link key={c} href={`/discussion?category=${encodeURIComponent(c)}`}>
            <Badge variant={activeCategory === c ? "default" : "secondary"} className="cursor-pointer px-3 py-1.5 text-xs">
              {c}
            </Badge>
          </Link>
        ))}
      </div>

      {posts.length === 0 ? (
        <div className="rounded-2xl border border-dashed p-12 text-center">
          <div className="text-4xl">💬</div>
          <h2 className="mt-3 font-bold">No posts yet</h2>
          <p className="mx-auto mt-1 max-w-sm text-sm text-muted-foreground">Be the first — ask a question or share a learning tip.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {posts.map((post) => (
            <Link key={post.id} href={`/discussion/${post.id}`} className="group block">
              <div className="card-hover flex items-start gap-4 rounded-2xl border bg-card p-5 shadow-card">
                <Avatar className="h-10 w-10 shrink-0">
                  {post.user.avatarUrl ? <AvatarImage src={post.user.avatarUrl} alt={post.user.name} /> : null}
                  <AvatarFallback className="text-xs">
                    {post.user.name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <h3 className={cn("font-semibold leading-snug group-hover:underline")}>{post.title}</h3>
                  <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{post.content}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    <span className="font-medium text-foreground/80">{post.user.name}</span>
                    <Badge variant="secondary" className="px-1.5 py-0 text-[9px]">
                      {post.user.currentLevel}
                    </Badge>
                    <span>·</span>
                    <Badge variant="outline" className="px-1.5 py-0 text-[9px]">
                      {post.category}
                    </Badge>
                    <span>· {post.createdAt.toLocaleDateString("en", { month: "short", day: "numeric" })}</span>
                  </div>
                </div>
                <span className="flex shrink-0 items-center gap-1 text-sm text-muted-foreground">
                  <MessageSquare className="h-4 w-4" /> {post._count.comments}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
