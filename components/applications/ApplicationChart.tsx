import type { Application, ApplicationStatus } from "@/types/application";

type ApplicationChartProps = {
  applications: Application[];
};

const statuses: ApplicationStatus[] = ["Interested", "Applied", "Interview", "Offer", "Rejected"];

export function ApplicationChart({ applications }: ApplicationChartProps) {
  const bars = statuses.map((status) => ({
    status,
    count: applications.filter((application) => application.status === status).length,
  }));

  // The tallest bar fills the track; at least 1 avoids dividing by zero when there's no data.
  const maxCount = Math.max(...bars.map((bar) => bar.count), 1);

  return (
    <div className="chart-card">
      <div className="chart-bars">
        {bars.map(({ status, count }) => (
          <div key={status} className="bar-group">
            <span className="bar-value">{count}</span>
            <div className="bar-track">
              <div className="bar-fill" style={{ height: `${(count / maxCount) * 100}%` }} />
            </div>
            <span className="bar-label">{status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
