"use client";
import Link from "next/link";
import type { User } from "firebase/auth";
import { ApplicationChart } from "@/components/applications/ApplicationChart";
import { ApplicationForm } from "@/components/applications/ApplicationForm";
import { ApplicationTable } from "@/components/applications/ApplicationTable";
import { AppShell } from "@/components/layout/AppShell";
import { useApplications } from "@/hooks/useApplications";
import { useGreeting } from "@/hooks/useGreeting";
import { Avatar } from "@/components/ui/Avatar";
import { getDisplayName } from "@/lib/user";

export default function Home() {
  return <AppShell active="dashboard">{(user) => <Dashboard user={user} />}</AppShell>;
}

function Dashboard({ user }: { user: User }) {
  const { applications, isLoading, error, addApplication, removeApplication } = useApplications(user.uid);
  const greeting = useGreeting();
  const firstName = getDisplayName(user).split(" ")[0];
  const applied = applications.filter((item) => item.status === "Applied").length;
  const interviews = applications.filter((item) => item.status === "Interview").length;
  const offers = applications.filter((item) => item.status === "Offer").length;
  const stats = [["Total applications", applications.length, "All tracked opportunities"], ["Applied", applied, "Applications submitted"], ["Interviews", interviews, "Conversations started"], ["Offers", offers, "Great news ahead"]];
  return <><header className="topbar"><div><p className="eyebrow">Overview</p><h1>{greeting}, {firstName}. Let&apos;s make progress.</h1></div><Link href="/profile" className="profile-chip"><Avatar user={user} className="profile-chip-avatar" /> Profile</Link></header><div className="stats-grid">{stats.map(([label, value, note]) => <div className="stat-card" key={String(label)}><span>{label}</span><strong>{value}</strong><small>{note}</small></div>)}</div><div className="content-grid"><section className="panel"><div className="panel-heading"><div><p className="eyebrow">Pipeline</p><h2>Applications by status</h2></div></div><ApplicationChart applications={applications} /></section><section className="panel"><div className="panel-heading"><div><p className="eyebrow">New opportunity</p><h2>Add an application</h2></div></div><ApplicationForm onSubmit={addApplication} /></section></div><section className="panel applications-panel"><div className="panel-heading"><div><p className="eyebrow">Your pipeline</p><h2>Applications</h2></div><span className="count-badge">{applications.length + " total"}</span></div>{isLoading ? <div className="empty-state">Loading applications...</div> : error ? <div role="alert" className="empty-state text-red-600">{error}</div> : <ApplicationTable applications={applications} onDelete={removeApplication} />}</section></>;
}
