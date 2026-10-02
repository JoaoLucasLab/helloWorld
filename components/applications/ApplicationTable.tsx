"use client";

import { useState } from "react";
import type { Application, ApplicationStatus } from "@/types/application";
import { ApplicationRow } from "./ApplicationRow";

type ApplicationTableProps = { applications: Application[]; onDelete: (id: string) => Promise<void> };
type SortKey = "company" | "status" | "date";
type SortDirection = "asc" | "desc";

const statusOrder: ApplicationStatus[] = ["Interested", "Applied", "Interview", "Offer", "Rejected"];

function compareApplications(a: Application, b: Application, key: SortKey) {
  if (key === "company") return a.company.localeCompare(b.company, undefined, { sensitivity: "base" });
  if (key === "status") return statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status);
  return a.date.localeCompare(b.date);
}

function sortApplications(applications: Application[], key: SortKey, direction: SortDirection) {
  return [...applications].sort((a, b) => {
    // Applications without a date always go last, whichever direction is chosen.
    if (key === "date" && !a.date !== !b.date) return a.date ? -1 : 1;
    const result = compareApplications(a, b, key);
    return direction === "asc" ? result : -result;
  });
}

export function ApplicationTable({ applications, onDelete }: ApplicationTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>("date");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  if (!applications.length) return <div className="empty-state">No applications yet. Add your first one above.</div>;

  function handleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDirection(key === "date" ? "desc" : "asc");
    }
  }

  function sortableHeader(key: SortKey, label: string) {
    const isActive = key === sortKey;
    const arrow = isActive ? (sortDirection === "asc" ? "▲" : "▼") : "↕";
    return <th className="px-4 py-3" aria-sort={isActive ? (sortDirection === "asc" ? "ascending" : "descending") : "none"}><button type="button" onClick={() => handleSort(key)} className={"inline-flex items-center gap-1 uppercase tracking-wide hover:text-slate-800 " + (isActive ? "text-slate-800" : "")}>{label}<span aria-hidden="true" className="text-[10px]">{arrow}</span></button></th>;
  }

  const sortedApplications = sortApplications(applications, sortKey, sortDirection);
  return <div className="overflow-x-auto"><table className="w-full min-w-[760px] text-left text-sm"><thead className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500"><tr>{sortableHeader("company", "Company")}{sortableHeader("status", "Status")}{sortableHeader("date", "Applied")}<th className="px-4 py-3">Description</th><th className="px-4 py-3">Actions</th></tr></thead><tbody>{sortedApplications.map((application) => <ApplicationRow key={application.id} application={application} onDelete={onDelete} />)}</tbody></table></div>;
}
