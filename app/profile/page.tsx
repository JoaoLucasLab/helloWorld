"use client";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { ProfilePhotoEditor } from "@/components/profile/ProfilePhotoEditor";
import { getDisplayName } from "@/lib/user";

export default function ProfilePage() {
  return <AppShell active="profile">{(user) => {
    const memberSince = user.metadata.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString(undefined, { month: "long", year: "numeric" }) : "—";
    const signInMethod = user.providerData.some((provider) => provider.providerId === "google.com") ? "Google" : "Email & password";
    return <><header className="topbar"><div><p className="eyebrow">Account</p><h1>Your profile</h1></div><Link href="/" className="profile-chip">Back to dashboard</Link></header><section className="profile-layout"><div className="profile-card"><ProfilePhotoEditor user={user} /><h2>{getDisplayName(user)}</h2><p>Internship candidate</p><div className="profile-detail"><span>Email</span><strong>{user.email ?? "—"}</strong></div><div className="profile-detail"><span>Sign-in</span><strong>{signInMethod}</strong></div><div className="profile-detail"><span>Member since</span><strong>{memberSince}</strong></div></div><div className="panel profile-about"><p className="eyebrow">About your workspace</p><h2>Build momentum one application at a time.</h2><p>Keep company details, job links, notes, and progress in one focused workspace.</p><div className="profile-note">Your applications are saved to your account in Firestore. Only you can see them, on any device where you sign in.</div></div></section></>;
  }}</AppShell>;
}
