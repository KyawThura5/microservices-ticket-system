import { useMemo } from "react";

export default function DonutChart({ counts }) {
  const total = counts.PENDING + counts.CONFIRMED + counts.REJECTED;
  const segments = useMemo(() => {
    const radius = 46;
    const circumference = 2 * Math.PI * radius;
    const safeTotal = total || 1;
    const confirmed = (counts.CONFIRMED / safeTotal) * circumference;
    const pending = (counts.PENDING / safeTotal) * circumference;
    const rejected = (counts.REJECTED / safeTotal) * circumference;
    return { radius, circumference, confirmed, pending, rejected };
  }, [counts, total]);

  return (
    <div className="donut">
      <div className="donut__chart">
        <svg viewBox="0 0 120 120">
          <circle className="donut__track" cx="60" cy="60" r={segments.radius} />
          <circle
            className="donut__segment donut__segment--confirmed"
            cx="60"
            cy="60"
            r={segments.radius}
            strokeDasharray={`${segments.confirmed} ${segments.circumference}`}
            strokeDashoffset="0"
          />
          <circle
            className="donut__segment donut__segment--pending"
            cx="60"
            cy="60"
            r={segments.radius}
            strokeDasharray={`${segments.pending} ${segments.circumference}`}
            strokeDashoffset={-segments.confirmed}
          />
          <circle
            className="donut__segment donut__segment--rejected"
            cx="60"
            cy="60"
            r={segments.radius}
            strokeDasharray={`${segments.rejected} ${segments.circumference}`}
            strokeDashoffset={-(segments.confirmed + segments.pending)}
          />
        </svg>
        <div className="donut__center">
          <span>Total</span>
          <strong>{total}</strong>
        </div>
      </div>
      <div className="donut__legend">
        <div>
          <span className="legend legend--confirmed" />
          Confirmed: {counts.CONFIRMED}
        </div>
        <div>
          <span className="legend legend--pending" />
          Pending: {counts.PENDING}
        </div>
        <div>
          <span className="legend legend--rejected" />
          Rejected: {counts.REJECTED}
        </div>
      </div>
    </div>
  );
}
