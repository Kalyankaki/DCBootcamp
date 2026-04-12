"use client";

import { signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, Suspense } from "react";
import Link from "next/link";
import { Server, ArrowLeft } from "lucide-react";

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen app-surface" />}>
      <LoginPageInner />
    </Suspense>
  );
}

function LoginPageInner() {
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackParam = searchParams.get("callbackUrl");

  // Role-based landing — teachers go to the Command Center, students go to the dashboard
  const destinationFor = (role: string | undefined): string => {
    if (callbackParam && callbackParam.startsWith("/")) return callbackParam;
    if (role === "teacher" || role === "superadmin") return "/teacher";
    return "/dashboard";
  };

  useEffect(() => {
    if (session) {
      const role = (session.user as { role?: string } | undefined)?.role;
      router.replace(destinationFor(role));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  return (
    <div className="min-h-screen flex items-center justify-center app-surface p-4">
      <div className="w-full max-w-md">
        <Link href="/" className="inline-flex items-center gap-1 text-xs app-text-muted hover:app-text-strong mb-5">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to home
        </Link>

        <div className="app-card rounded-lg p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-md app-accent-bg flex items-center justify-center">
              <Server className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="app-text-strong font-semibold text-lg tracking-tight">DC Bootcamp</h1>
              <p className="app-text-muted text-xs">MathCodeLab Program</p>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="app-text-strong text-xl font-semibold tracking-tight mb-1">Sign in to continue</h2>
            <p className="app-text-muted text-sm">
              Your role — student or teacher — determines where you land. Teachers go straight to the Command Center.
            </p>
          </div>

          <button
            onClick={() => signIn("google", { callbackUrl: callbackParam ?? "/dashboard" })}
            className="w-full flex items-center justify-center gap-3 bg-white text-slate-800 font-semibold py-3 px-6 rounded-lg hover:bg-slate-100 transition-colors shadow-sm border border-slate-300"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Sign in with Google
          </button>

          <div className="mt-6 pt-5 border-t border-t-[var(--border-subtle)] grid grid-cols-2 gap-3 text-xs">
            <Link href="/demo" className="app-text-muted hover:app-text-strong">Try the demo →</Link>
            <Link href="/demo-advanced" className="app-text-muted hover:app-text-strong text-right">Advanced demo →</Link>
          </div>
        </div>

        <p className="text-center app-text-subtle text-xs mt-5">
          By signing in you agree to our terms of service.
        </p>
      </div>
    </div>
  );
}
