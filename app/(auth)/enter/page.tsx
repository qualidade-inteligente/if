"use client";

import type React from "react";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

export default function Enter() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const supabase = createClient();

    // VERCEL_URL is set to the domain of the Vercel deployment.
    // "The value does not include the protocol scheme https://."
    //   – https://vercel.com/docs/environment-variables/system-environment-variables#VERCEL_URL

    const url = process.env.VERCEL_URL
      ? `s://${process.env.VERCEL_URL}`
      : "://localhost:3000";

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true,
        emailRedirectTo: `http${url}/auth/v1/verify`,
      },
    });

    if (error) {
      toast.error("It was not possible to sign you in.", {
        duration: 3000,
      });
      setLoading(false);
      return;
    }

    toast.success("Please, check your email for the login link.", {
      duration: 3000,
    });
    setLoading(false);
    setEmail("");
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="w-[320px]">
        <h1 className="text-base font-medium mb-2">AI Chat Login</h1>
        <p className="text-sm text-gray-600 mb-4">
          Enter your email to start chatting with our AI assistant.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="text-sm"
          />
          <Button
            type="submit"
            className="w-full text-sm h-9"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </Button>
        </form>
        <div className="mt-4">
          <Link
            href="https://github.com/yourusername/your-repo"
            className="text-xs text-gray-500 hover:underline"
          >
            View project on GitHub
          </Link>
        </div>
      </div>
    </div>
  );
}
