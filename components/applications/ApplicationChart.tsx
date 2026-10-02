import type { Application } from "@/types/application";

const statuses = ["Interested", "Applied", "Interview", "Offer", "Rejected"] as const;

export function ApplicationChart({ applications }: { applications: Application[] }) {
  const counts = statuses.map((status) => applications.filter((application) => application.status === status).length);
  const max = Math.max(...counts, 1);
  return <div className="chart-card"><div className="chart-bars">{statuses.map((status, index) => <div key={status} className="bar-group"><span className="bar-value">{counts[index]}</span><div className="bar-track"><div className="bar-fill" style={{ height: ((counts[index] / max) * 100) + "%" }} /></div><span className="bar-label">{status}</span></div>)}</div></div>;
}
