import { useEffect, useState } from "react";
import { getSummary } from "../services/api";
import { formatCurrency } from "../utils/helpers";

function Navbar() {
  const [summary, setSummary] = useState(null);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    getSummary().then(setSummary).catch(() => {});
    const timer = setInterval(() => setTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const dateStr = time.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
  const timeStr = time.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

  return (
    <header className="topbar">
      <div>
        <h1>ClearQuote CS Dashboard</h1>
      </div>
      <div className="topbar-meta">
        {summary && (
          <>
            <div className="topbar-stat">
              <span className="topbar-stat-label">MRR</span>
              <span className="topbar-stat-value">{formatCurrency(summary.total_mrr)}</span>
            </div>
            <div className="topbar-stat">
              <span className="topbar-stat-label">Avg Health</span>
              <span className="topbar-stat-value">{summary.avg_health}</span>
            </div>
            <div className="topbar-stat">
              <span className="topbar-stat-label">Open Tickets</span>
              <span className="topbar-stat-value">{summary.open_tickets}</span>
            </div>
          </>
        )}
        <div className="topbar-stat" style={{ borderRight: 0 }}>
          <span className="topbar-stat-label">{dateStr}</span>
          <span className="topbar-stat-value">{timeStr}</span>
        </div>
        <span className="chip">Internal CS</span>
      </div>
    </header>
  );
}

export default Navbar;
