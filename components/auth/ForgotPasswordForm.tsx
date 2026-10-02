"use client";

import { useState } from "react";
import type { SyntheticEvent } from "react";
import Link from "next/link";
import { Wordmark } from "@/components/ui/Wordmark";
import { getAuthErrorMessage, useAuth } from "@/context/AuthContext";

export function ForgotPasswordForm() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      await resetPassword(email);
      setSentTo(email);
    } catch (resetError) {
      // Firebase may report a missing account here. Show the same success message anyway,
      // so the form can't be used to discover which emails have accounts.
      if (typeof resetError === "object" && resetError && "code" in resetError && resetError.code === "auth/user-not-found") {
        setSentTo(email);
      } else {
        console.error(resetError);
        setError(getAuthErrorMessage(resetError));
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="auth-page">
      <div className="auth-card">
        <div className="brand auth-brand"><Wordmark /></div>
        <p className="eyebrow">Account recovery</p>
        <h1>Reset your password</h1>
        {sentTo ? (
          <div role="status" className="auth-success">If an account exists for <strong>{sentTo}</strong>, we&apos;ve sent a link to reset your password. Check your inbox and spam folder.</div>
        ) : (
          <>
            <p className="auth-intro">Enter the email you signed up with and we&apos;ll send you a link to choose a new password.</p>
            <form onSubmit={handleSubmit} className="grid gap-4">
              <label className="field-label">Email<input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" placeholder="you@example.com" className="field-input" /></label>
              {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
              <button type="submit" disabled={isSubmitting} className="primary-button disabled:opacity-60">{isSubmitting ? "Sending..." : "Send reset link"}</button>
            </form>
          </>
        )}
        <p className="auth-switch">Remembered it? <Link href="/login">Back to log in</Link></p>
      </div>
    </main>
  );
}
