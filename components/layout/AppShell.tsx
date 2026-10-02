"use client";

import { useEffect } from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { User } from "firebase/auth";
import { Wordmark } from "@/components/ui/Wordmark";
import { SidebarShortcuts } from "@/components/shortcuts/SidebarShortcuts";
import { useAuth } from "@/context/AuthContext";

type AppShellProps = {
  active: "dashboard" | "profile";
  children: (user: User) => ReactNode;
};

// Wraps pages that need a signed-in user: redirects to /login otherwise.
export function AppShell({ active, children }: AppShellProps) {
  const { user, isLoading, signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) router.replace("/login");
  }, [isLoading, user, router]);

  if (!user) return <div className="auth-loading">Loading...</div>;

  return <main className="app-shell"><aside className="sidebar"><div className="brand"><Wordmark /></div><nav className="nav-links"><Link className={"nav-link" + (active === "dashboard" ? " active" : "")} href="/">Dashboard</Link><Link className={"nav-link" + (active === "profile" ? " active" : "")} href="/profile">Profile</Link></nav><SidebarShortcuts userId={user.uid} /><div className="sidebar-footer">Internship search<br /><span>Stay organized. Keep moving.</span><button type="button" onClick={signOut} className="sign-out-button">Sign out</button></div></aside><section className="main-content">{children(user)}</section></main>;
}
