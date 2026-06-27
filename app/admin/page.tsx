"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/shared/Button";
import { Card } from "@/components/shared/Card";
import { useTurnstile } from "@/hooks/useTurnstile";
import { ShieldCheck, Mail, Lock, AlertCircle, Loader2 } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const turnstileContainerRef = useRef<HTMLDivElement>(null);
  
  // Custom hook for Cloudflare Turnstile CAPTCHA
  const { token: turnstileToken, resetWidget } = useTurnstile(turnstileContainerRef);

  // Form submission handler
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    if (!turnstileToken) {
      setError("Please complete the Cloudflare Turnstile verification.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          turnstileToken,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Login failed. Please try again.");
      }

      // Successful login -> redirect to Overview dashboard
      router.push("/admin/overview");
      router.refresh();
    } catch (err: any) {
      console.error("[admin-login-submit] Error:", err);
      setError(err.message || "An unexpected error occurred.");
      setIsLoading(false);
      resetWidget(); // Force captcha reload on error
    }
  };

  return (
    <div className="relative min-h-[100vh] w-full flex items-center justify-center p-6 bg-radial-[at_50%_50%] from-env-surface/40 via-env-surface/80 to-env-surface z-10">
      
      {/* Background Subtle Elements */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,var(--env-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--env-border)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-10 pointer-events-none" />

      <Card 
        hoverEffect={false} 
        className="w-full max-w-md bg-env-surface/80 border-env-border/40 backdrop-blur-md shadow-2xl relative z-10 p-8 sm:p-10 transition-all duration-300"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="p-3.5 bg-env-text/5 rounded-2xl border border-env-border/50 text-env-text mb-4">
            <ShieldCheck className="h-7 w-7" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-env-text">
            Admin Console
          </h2>
          <p className="text-xs text-env-muted mt-1 uppercase tracking-widest font-semibold select-none">
            Rajat Deep Singh Portfolio
          </p>
        </div>

        {error && (
          <div className="flex items-start gap-3 rounded-lg border border-red-500/20 bg-red-500/5 p-4 mb-6 text-xs text-red-400 font-medium">
            <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-1.5">
            <label htmlFor="email" className="text-[10px] font-bold uppercase tracking-widest text-env-muted">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-env-muted" />
              <input
                type="email"
                id="email"
                required
                disabled={isLoading}
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-env-border bg-env-surface/50 text-sm outline-none focus:border-env-text focus:bg-env-surface transition-all text-env-text font-body disabled:opacity-50"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="password" className="text-[10px] font-bold uppercase tracking-widest text-env-muted">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-env-muted" />
              <input
                type="password"
                id="password"
                required
                disabled={isLoading}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-env-border bg-env-surface/50 text-sm outline-none focus:border-env-text focus:bg-env-surface transition-all text-env-text font-body disabled:opacity-50"
              />
            </div>
          </div>

          {/* Cloudflare Turnstile Container */}
          <div className="space-y-1.5 flex justify-center py-2">
            <div 
              ref={turnstileContainerRef} 
              className="w-full rounded-lg overflow-hidden border border-env-border/50 bg-env-surface/30 p-1 flex justify-center min-h-[65px]" 
            />
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full font-bold uppercase tracking-widest text-xs h-11 transition-all"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Authenticating...
              </span>
            ) : (
              "Sign In"
            )}
          </Button>
        </form>
      </Card>
    </div>
  );
}
