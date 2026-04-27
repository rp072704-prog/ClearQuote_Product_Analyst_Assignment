import { useEffect, useMemo, useState } from "react";
import AlertBanner from "../components/AlertBanner";
import BarChart from "../components/Charts/BarChart";
import DonutChart from "../components/Charts/DonutChart";
import FilterBar from "../components/FilterBar";
import LoadingState from "../components/LoadingState";
import Table from "../components/Table";
import { getCustomers, getTickets } from "../services/api";
import { average, formatNumber, statusClass } from "../utils/helpers";

function SupportComms() {
  const [customers, setCustomers] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [priority, setPriority] = useState("all");

  useEffect(() => {
    Promise.all([getCustomers(), getTickets()]).then(([c, t]) => {
      setCustomers(c); setTickets(t); setLoading(false);
    });
  }, []);

  const customerById = useMemo(() => Object.fromEntries(customers.map(c => [c.id, c])), [customers]);

  const filteredTickets = useMemo(() => {
    const s = search.toLowerCase();
    return tickets.filter(t => {
      const c = customerById[t.customer_id];
      const ms = t.subject.toLowerCase().includes(s) || c?.name.toLowerCase().includes(s);
      return ms && (status === "all" || t.status === status) && (priority === "all" || t.priority === priority);
    });
  }, [tickets, customerById, search, status, priority]);

  const statuses = [...new Set(tickets.map(t => t.status))];
  const priorities = [...new Set(tickets.map(t => t.priority))];
  const openTickets = tickets.filter(t => t.status !== "Resolved");
  const recentTickets = tickets.filter(t => t.age_days <= 14);
  const avgCsat = average(tickets.map(t => t.csat).filter(Boolean));
  const p1Open = openTickets.filter(t => t.priority === "P1").length;

  // Ageing buckets
  const bucket0_2 = openTickets.filter(t => t.age_days <= 2).length;
  const bucket3_7 = openTickets.filter(t => t.age_days >= 3 && t.age_days <= 7).length;
  const bucket7plus = openTickets.filter(t => t.age_days > 7).length;

  // Channel mix
  const channelCounts = {};
  tickets.forEach(t => { channelCounts[t.channel] = (channelCounts[t.channel] || 0) + 1; });
  const channelData = Object.entries(channelCounts).map(([label, value]) => ({ label, value }));

  // Priority chart
  const priorityChart = priorities.map(p => ({
    label: p, value: tickets.filter(t => t.priority === p).length,
    color: p === "P1" ? "#ef4444" : p === "P2" ? "#f59e0b" : "#3b82f6"
  }));

  // Alerts
  const highBacklog = openTickets.length > 20;
  const lowCsat = avgCsat < 3.5;

  if (loading) return <LoadingState cards={4} chart />;

  return (
    <div>
      <div className="page-header">
        <div>
          <h2 className="page-title">Support & Comms</h2>
          <p className="page-copy">Open tickets, recency, priority, channel mix, CSAT, and ageing for follow-up planning.</p>
        </div>
      </div>

      {highBacklog && <AlertBanner type="danger" message={`High ticket backlog: ${openTickets.length} open tickets require attention.`} />}
      {lowCsat && <AlertBanner type="warning" message={`Low CSAT alert: average score is ${avgCsat.toFixed(1)} / 5.`} />}

      <section className="grid four">
        <div className="metric-card accent-red">
          <p className="metric-label">Open Tickets</p>
          <p className="metric-value">{openTickets.length}</p>
          <p className="metric-note">Pending CS action</p>
        </div>
        <div className="metric-card accent-brand">
          <p className="metric-label">Recent Tickets</p>
          <p className="metric-value">{recentTickets.length}</p>
          <p className="metric-note">Created in last 14 days</p>
        </div>
        <div className="metric-card accent-green">
          <p className="metric-label">Average CSAT</p>
          <p className="metric-value">{avgCsat.toFixed(1)}<span style={{ fontSize: 14, color: "var(--muted)" }}> / 5</span></p>
          <p className="metric-note">Resolved ticket average</p>
        </div>
        <div className="metric-card accent-amber">
          <p className="metric-label">Open P1s</p>
          <p className="metric-value">{p1Open}</p>
          <p className="metric-note">Highest priority</p>
        </div>
      </section>

      {/* Ageing Buckets */}
      <section className="panel section-space">
        <div className="panel-header"><h3 className="panel-title">Ticket Ageing Buckets</h3></div>
        <div className="panel-body">
          <div className="ageing-grid">
            <div className="ageing-bucket">
              <p className="ageing-bucket-value text-green">{bucket0_2}</p>
              <p className="ageing-bucket-label">0 – 2 Days</p>
            </div>
            <div className="ageing-bucket">
              <p className="ageing-bucket-value text-amber">{bucket3_7}</p>
              <p className="ageing-bucket-label">3 – 7 Days</p>
            </div>
            <div className="ageing-bucket">
              <p className="ageing-bucket-value text-red">{bucket7plus}</p>
              <p className="ageing-bucket-label">&gt; 7 Days</p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid two section-space">
        <div className="panel">
          <div className="panel-header"><h3 className="panel-title">Ticket Queue</h3></div>
          <div className="panel-body">
            <FilterBar search={search} onSearchChange={setSearch} searchPlaceholder="Search tickets or customers"
              filters={[
                { key: "status", label: "Status", value: status, onChange: setStatus,
                  options: [{ value: "all", label: "All statuses" }, ...statuses.map(s => ({ value: s, label: s }))] },
                { key: "priority", label: "Priority", value: priority, onChange: setPriority,
                  options: [{ value: "all", label: "All priorities" }, ...priorities.map(p => ({ value: p, label: p }))] }
              ]} />
            <Table data={filteredTickets} columns={[
              { key: "customer", label: "Customer", render: (r) => customerById[r.customer_id]?.name || `Customer ${r.customer_id}` },
              { key: "subject", label: "Subject" },
              { key: "priority", label: "Priority", render: (r) => <span className={`priority-pill ${r.priority.toLowerCase()}`}>{r.priority}</span> },
              { key: "channel", label: "Channel" },
              { key: "csat", label: "CSAT", render: (r) => r.csat || "Pending" },
              { key: "status", label: "Status", render: (r) => <span className={`status-pill ${statusClass(r.status)}`}>{r.status}</span> },
              { key: "age_days", label: "Age", render: (r) => `${r.age_days}d` }
            ]} />
          </div>
        </div>
        <div style={{ display: "grid", gap: 18 }}>
          <div className="panel">
            <div className="panel-header"><h3 className="panel-title">Priority Mix</h3></div>
            <div className="panel-body"><BarChart data={priorityChart} valueFormatter={formatNumber} /></div>
          </div>
          <div className="panel">
            <div className="panel-header"><h3 className="panel-title">Channel Distribution</h3></div>
            <div className="panel-body"><DonutChart data={channelData} size={180} strokeWidth={28} centerValue={String(tickets.length)} centerLabel="Total" /></div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default SupportComms;
