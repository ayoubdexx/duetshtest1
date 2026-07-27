import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CommentForm } from "@/components/community/discussion-forms";

export const metadata = { title: "Discussion" };

function initials(name: string) {
  return name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();
}

export default async function PostPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  const { id } = await params;

  const post = await prisma.post.findUnique({
    where: { id },
    include: {
      user: { select: { name: true, avatarUrl: true, currentLevel: true } },
      comments: {
        orderBy: { createdAt: "asc" },
        include: { user: { select: { name: true, avatarUrl: true, currentLevel: true } } },
      },
    },
  });
  if (!post) notFound();

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-4 text-sm text-muted-foreground">
        <Link href="/discussion" className="hover:text-foreground">
          Discussion
        </Link>{" "}
        / <span className="text-foreground">{post.category}</span>
      </div>

      <article className="rounded-2xl border bg-card p-6 shadow-card">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            {post.user.avatarUrl ? <AvatarImage src={post.user.avatarUrl} alt={post.user.name} /> : null}
            <AvatarFallback className="text-xs">{initials(post.user.name)}</AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-2 text-sm font-semibold">
              {post.user.name}
              <Badge variant="secondary" className="px-1.5 py-0 text-[9px]">
                {post.user.currentLevel}
              </Badge>
            </div>
            <div className="text-xs text-muted-foreground">
              {post.createdAt.toLocaleDateString("en", { dateStyle: "long" })}
            </div>
          </div>
          <Badge variant="outline" className="ml-auto">
            {post.category}
          </Badge>
        </div>
        <h1 className="mt-4 text-xl font-bold tracking-tight sm:text-2xl">{post.title}</h1>
        <p className="mt-3 whitespace-pre-line text-[15px] leading-relaxed text-foreground/90">{post.content}</p>
      </article>

      <div className="mt-8">
        <div className="section-label mb-3">
          {post.comments.length} {post.comments.length === 1 ? "reply" : "replies"}
        </div>
        <div className="space-y-3">
          {post.comments.map((c) => (
            <div key={c.id} className="flex gap-3 rounded-2xl border bg-card p-4">
              <Avatar className="h-8 w-8 shrink-0">
                {c.user.avatarUrl ? <AvatarImage src={c.user.avatarUrl} alt={c.user.name} /> : null}
                <AvatarFallback className="text-[10px]">{initials(c.user.name)}</AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-semibold">{c.user.name}</span>
                  <Badge variant="secondary" className="px-1.5 py-0 text-[9px]">
                    {c.user.currentLevel}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {c.createdAt.toLocaleDateString("en", { month: "short", day: "numeric" })}
                  </span>
                </div>
                <p className="mt-1 whitespace-pre-line text-sm leading-relaxed text-foreground/90">{c.content}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4">
          <CommentForm postId={post.id} />
        </div>
      </div>
    </div>
  );
}
