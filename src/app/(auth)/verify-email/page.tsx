"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, XCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const STATES = {
  success: {
    icon: CheckCircle2,
    tone: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-100 dark:bg-emerald-900/40",
    title: "Email verified! 🎉",
    desc: "Your account is active. Sign in and start your first lesson — Los geht's!",
  },
  expired: {
    icon: Clock,
    tone: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-100 dark:bg-amber-900/40",
    title: "Link expired",
    desc: "This verification link is no longer valid. Sign in to request a fresh one.",
  },
  invalid: {
    icon: XCircle,
    tone: "text-destructive",
    bg: "bg-destructive/10",
    title: "Invalid link",
    desc: "We couldn't verify this link. It may have been used already — try signing in.",
  },
} as const;

function VerifyStatus() {
  const params = useSearchParams();
  const status = (params.get("status") ?? "invalid") as keyof typeof STATES;
  const s = STATES[status] ?? STATES.invalid;
  const Icon = s.icon;

  return (
    <Card className="shadow-lifted">
      <CardHeader className="items-center space-y-3 pb-4 text-center">
        <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${s.bg}`}>
          <Icon className={`h-7 w-7 ${s.tone}`} />
        </div>
        <CardTitle className="text-2xl tracking-tight">{s.title}</CardTitle>
        <CardDescription>{s.desc}</CardDescription>
      </CardHeader>
      <CardContent>
        <Link href="/login" className="block">
          <Button className="w-full" size="lg">
            Go to sign in
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense>
      <VerifyStatus />
    </Suspense>
  );
}
