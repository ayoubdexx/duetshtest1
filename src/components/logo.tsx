import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({ className, href = "/" }: { className?: string; href?: string }) {
  return (
    <Link href={href} className={cn("group inline-flex items-baseline gap-0.5 select-none", className)}>
      <span className="text-xl font-bold tracking-tight text-foreground">
        Deutsch<span className="text-brand-600 dark:text-brand-400">werk</span>
      </span>
      <span className="ml-1.5 hidden rounded-md bg-secondary px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground sm:inline">
        A1–B2
      </span>
    </Link>
  );
}

export function LogoMark({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-base font-bold text-primary-foreground",
        className
      )}
    >
      D<span className="text-brand-400">.</span>
    </div>
  );
}
