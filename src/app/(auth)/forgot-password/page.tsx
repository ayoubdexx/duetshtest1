"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, KeyRound, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const schema = z.object({ email: z.string().email("Enter a valid email") });
type FormData = z.infer<typeof schema>;

export default function ForgotPasswordPage() {
  const [done, setDone] = useState<{ devResetUrl?: string } | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  async function onSubmit(data: FormData) {
    const res = await fetch("/api/password/forgot", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const json = await res.json().catch(() => ({}));
    setDone({ devResetUrl: json.devResetUrl });
  }

  if (done) {
    return (
      <Card className="shadow-lifted">
        <CardHeader className="items-center space-y-3 pb-4 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-100 dark:bg-brand-900/40">
            <KeyRound className="h-7 w-7 text-brand-600 dark:text-brand-400" />
          </div>
          <CardTitle className="text-2xl tracking-tight">Check your inbox</CardTitle>
          <CardDescription>
            If an account exists for that email, we've sent a link to reset the password. The link is valid for one
            hour.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {done.devResetUrl && (
            <a href={done.devResetUrl} className="block">
              <Button variant="brand" className="w-full" size="lg">
                <ExternalLink className="h-4 w-4" />
                Dev mode: open reset link
              </Button>
            </a>
          )}
          <Link href="/login" className="block">
            <Button variant="outline" className="w-full" size="lg">
              Back to sign in
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lifted">
      <CardHeader className="space-y-2 pb-4">
        <CardTitle className="text-2xl tracking-tight">Reset your password</CardTitle>
        <CardDescription>Enter your email and we'll send you a reset link.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" autoComplete="email" placeholder="you@example.com" {...register("email")} />
            {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
          </div>
          <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
            Send reset link
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Remembered it?{" "}
          <Link href="/login" className="font-semibold text-foreground underline-offset-4 hover:underline">
            Sign in
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
