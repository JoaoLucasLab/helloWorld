"use client";

import { useState } from "react";
import type { Application } from "@/types/application";

type ApplicationRowProps = { application: Application; onDelete: (id: string) => Promise<void> };

export function ApplicationRow({ application, onDelete }: ApplicationRowProps) {
  const [isConfirming, setIsConfirming] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete() {
    if (!application.id) return;
    setIsDeleting(true);
    setError(null);
    try {
      // On success the row is removed from the list, so there's no state to reset.
      await onDelete(application.id);
    } catch (deleteError) {
      console.error(deleteError);
      setError("Could not delete. Please try again.");
      setIsDeleting(false);
      setIsConfirming(false);
    }
  }

  const actions = isConfirming
    ? <div className="flex items-center gap-3"><span className="text-slate-600">Delete?</span><button type="button" onClick={handleDelete} disabled={isDeleting} className="font-semibold text-red-600 hover:underline disabled:opacity-60">{isDeleting ? "Deleting..." : "Yes, delete"}</button>{!isDeleting && <button type="button" onClick={() => setIsConfirming(false)} className="text-slate-600 hover:underline">Cancel</button>}</div>
    : <div className="flex items-center gap-3">{application.link && <a href={application.link} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">View</a>}{application.id && <button type="button" onClick={() => { setError(null); setIsConfirming(true); }} aria-label={"Delete " + application.company} className="text-red-600 hover:underline">Delete</button>}</div>;

  return <tr className="border-b border-slate-100 last:border-0"><td className="px-4 py-4 font-semibold text-slate-900">{application.company}</td><td className="px-4 py-4"><span className={"status-pill status-" + application.status.toLowerCase()}>{application.status}</span></td><td className="px-4 py-4 text-slate-600">{application.date || "—"}</td><td className="max-w-xs px-4 py-4 text-slate-600">{application.description || "—"}</td><td className="px-4 py-4">{actions}{error && <p role="alert" className="mt-1 text-xs text-red-600">{error}</p>}</td></tr>;
}
