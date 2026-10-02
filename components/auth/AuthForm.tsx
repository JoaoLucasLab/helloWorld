"use client";

import { useEffect, useState } from "react";
import type { SyntheticEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getAuthErrorMessage, useAuth } from "@/context/AuthContext";

type AuthFormProps = { mode: "login" | "signup" };

export function AuthForm({ mode }: AuthFormProps) {
  const { user, isLoading, signIn, signUp, signInWithGoogle } = useAuth();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isSignup = mode === "signup";

  // Already signed in (or just finished signing in): go to the dashboard.
  useEffect(() => {
    if (!isLoading && user) router.replace("/");
  }, [isLoading, user, router]);

  async function run(action: () => Promise<void>) {
    setIsSubmitting(true);
    setError(null);
    try {
      await action();
    } catch (authError) {
      console.error(authError);
      setError(getAuthErrorMessage(authError) || null);
      setIsSubmitting(false);
    }
  }

  function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSignup && password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    run(() => (isSignup ? signUp(name.trim(), email, password) : signIn(email, password)));
  }

  return (
    <main className="auth-page">
      <div className="auth-card">
        <div className="brand auth-brand"><span className="brand-mark">A</span>ApplyFlow</div>
        <p className="eyebrow">{isSignup ? "Get started" : "Welcome back"}</p>
        <h1>{isSignup ? "Create your account" : "Log in to your account"}</h1>
        <button type="button" onClick={() => run(signInWithGoogle)} disabled={isSubmitting} className="google-button">
          <svg aria-hidden="true" width="18" height="18" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" /><path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" /><path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z" /><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" /></svg>
          Continue with Google
        </button>
        <div className="auth-divider"><span>or</span></div>
        <form onSubmit={handleSubmit} className="grid gap-4">
          {isSignup && <label className="field-label">Name<input required value={name} onChange={(event) => setName(event.target.value)} autoComplete="name" placeholder="Your name" className="field-input" /></label>}
          <label className="field-label">Email<input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" placeholder="you@example.com" className="field-input" /></label>
          <label className="field-label"><span className="flex items-center justify-between">Password{!isSignup && <Link href="/forgot-password" className="auth-inline-link">Forgot password?</Link>}</span><input required type="password" minLength={6} value={password} onChange={(event) => setPassword(event.target.value)} autoComplete={isSignup ? "new-password" : "current-password"} placeholder={isSignup ? "At least 6 characters" : "Your password"} className="field-input" /></label>
          {isSignup && <label className="field-label">Confirm password<input required type="password" minLength={6} value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} autoComplete="new-password" placeholder="Repeat your password" className="field-input" /></label>}
          {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
          <button type="submit" disabled={isSubmitting} className="primary-button disabled:opacity-60">{isSubmitting ? "Please wait..." : isSignup ? "Create account" : "Log in"}</button>
        </form>
        <p className="auth-switch">{isSignup ? "Already have an account? " : "New to ApplyFlow? "}<Link href={isSignup ? "/login" : "/signup"}>{isSignup ? "Log in" : "Create an account"}</Link></p>
      </div>
    </main>
  );
}
