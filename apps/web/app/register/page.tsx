"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import Link from "next/link";

export default function RegisterPage() {
  const [isLoading, setIsLoading] = React.useState(false);
  const router = useRouter();

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to register");
      }

      toast.success("Account created successfully! Please log in.");
      router.push("/login");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-4 pt-24">
      <Card className="w-full max-w-md p-6 sm:p-8 bg-card/50 backdrop-blur border-border/50 shadow-xl rounded-2xl">
        <div className="flex flex-col items-center gap-2 mb-8 text-center">
          <h1 className="text-3xl font-bold">Create Account</h1>
          <p className="text-muted-foreground">Sign up to start shortening links</p>
        </div>

        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium" htmlFor="name">
              Name
            </label>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="John Doe"
              required
              className="bg-background/50 h-12"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium" htmlFor="email">
              Email
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="name@example.com"
              required
              className="bg-background/50 h-12"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium" htmlFor="password">
              Password
            </label>
            <Input
              id="password"
              name="password"
              type="password"
              required
              minLength={6}
              className="bg-background/50 h-12"
            />
          </div>

          <Button type="submit" className="h-12 mt-4 font-semibold" disabled={isLoading}>
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            Sign Up
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-8">
          Already have an account?{" "}
          <Link href="/login" className="text-primary hover:underline font-medium">
            Sign in
          </Link>
        </p>
      </Card>
    </main>
  );
}
