import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/app/page-header";
import { BookmarksList } from "@/components/bookmarks-list";

export const metadata = { title: "Bookmarks" };

export default async function BookmarksPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const bookmarks = await prisma.bookmark.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title="Bookmarks" description="Everything you've pinned across the platform, in one place." />
      <BookmarksList
        initial={bookmarks.map((b) => ({
          id: b.id,
          type: b.type,
          refId: b.refId,
          title: b.title,
          href: b.href,
          createdAt: b.createdAt.toISOString(),
        }))}
      />
    </div>
  );
}
