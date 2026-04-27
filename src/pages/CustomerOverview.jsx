import { useEffect, useMemo, useState } from "react";
import { getCustomers } from "../services/api";
import AlertBanner from "../components/AlertBanner";
import FilterBar from "../components/FilterBar";
import HealthBadge from "../components/HealthBadge";
import LoadingState from "../components/LoadingState";
import StatRing from "../components/StatRing";
import Table from "../components/Table";
import { average, formatCurrency, statusClass } from "../utils/helpers";

function toMapPosition(loc) {
  const x = ((loc.lng - -125) / (-66 - -125)) * 100;
  const y = ((-loc.lat - -49) / (-24 - -49)) * 100;
  return { left: `${Math.min(93, Math.max(7, x))}%`, top: `${Math.min(88, Math.max(16, y))}%` };
}

function healthPinClass(score) {
  if (score < 40) return "risk";
  if (score < 70) return "watch";
  return "";
}

function UsPinMap({ customers }) {
  return (
    <div className="map-panel">
      <span className="map-label">US Customer Map</span>
      <div className="us-map">
        {customers.map((c) => (
          <span className={`map-pin ${healthPinClass(c.health_score)}`}
            data-label={`${c.name} — ${c.location.city}, ${c.location.state}`}
            key={c.id} style={toMapPosition(c.location)} />
        ))}
      </div>
    </div>
  );
}

function CustomerOverview() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [tier, setTier] = useState("all");
  const [status, setStatus] = useState("all");
  const [sort, setSort] = useState("health");

  useEffect(() => {
    getCustomers().then((r) => { setData(r); setLoading(false); });
  }, []);

  const tiers = useMemo(() => [...new Set(data.map((c) => c.tier))], [data]);
  const statuses = useMemo(() => [...new Set(data.map((c) => c.status))], [data]);

  const filtered = useMemo(() => {
    const s = search.toLowerCase();
    const rows = data.filter((c) => {
      const ms = c.name.toLowerCase().includes(s) || c.csm.toLowerCase().includes(s) ||
        c.location.city.toLowerCase().includes(s) || c.location.state.toLowerCase().includes(s);
      return ms && (tier === "all" || c.tier === tier) && (status === "all" || c.status === status);
    });
    return [...rows].sort((a, b) => {
      if (sort === "mrr") return b.MRR - a.MRR;
      if (sort === "name") return a.name.localeCompare(b.name);
      return b.health_score - a.health_score;
    });
  }, [data, search, tier, status, sort]);

  const totalMrr = data.reduce((s, c) => s + c.MRR, 0);
  const avgHealth = average(data.map((c) => c.health_score));
  const atRisk = data.filter((c) => c.health_score < 40);
  const watchList = data.filter((c) => c.health_score < 70).length;

  if (loading) return <LoadingState cards={4} chart />;

  return (
    <div>
      <div className="page-header">
        <div>
          <h2 className="page-title">Customer Overview</h2>
          <p className="page-copy">Customer health, revenue, ownership, and location in one CS workspace.</p>
        </div>
      </div>

      {atRisk.length > 0 && (
        <AlertBanner type="danger"
          message={`${atRisk.length} customer${atRisk.length > 1 ? "s" : ""} flagged At Risk — immediate CS attention recommended.`} />
      )}

      <section className="grid four">
        <div className="metric-card accent-brand">
          <p className="metric-label">Customers</p>
          <p className="metric-value">{data.length}</p>
          <p className="metric-note">Active accounts</p>
        </div>
        <div className="metric-card accent-green">
          <p className="metric-label">Monthly Recurring Revenue</p>
          <p className="metric-value">{formatCurrency(totalMrr)}</p>
          <p className="metric-note">Across all accounts</p>
        </div>
        <div className="metric-card accent-teal">
          <p className="metric-label">Average Health</p>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 4 }}>
            <StatRing value={avgHealth} color="var(--teal)" size={48} stroke={4} />
            <p className="metric-value" style={{ margin: 0 }}>{avgHealth.toFixed(1)}</p>
          </div>
          <p className="metric-note">Weighted signal from usage & support</p>
        </div>
        <div className="metric-card accent-amber">
          <p className="metric-label">Watch List</p>
          <p className="metric-value">{watchList}</p>
          <p className="metric-note">Customers below 70 health</p>
        </div>
      </section>

      {atRisk.length > 0 && (
        <section className="panel section-space" style={{ animationDelay: ".25s" }}>
          <div className="panel-header">
            <h3 className="panel-title" style={{ color: "var(--red)" }}>⚠ At-Risk Customers</h3>
          </div>
          <div className="panel-body">
            <div className="risk-cards">
              {atRisk.map((c) => (
                <div className="risk-card" key={c.id}>
                  <StatRing value={c.health_score} size={42} stroke={3.5} color="var(--red)" />
                  <div className="risk-card-info">
                    <p className="risk-card-name">{c.name}</p>
                    <p className="risk-card-detail">{c.location.city}, {c.location.state} · CSM: {c.csm}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="grid two section-space">
        <div className="panel">
          <div className="panel-header">
            <h3 className="panel-title">Accounts</h3>
          </div>
          <div className="panel-body">
            <FilterBar search={search} onSearchChange={setSearch}
              searchPlaceholder="Search customers, CSMs, or location"
              filters={[
                { key: "tier", label: "Tier", value: tier, onChange: setTier,
                  options: [{ value: "all", label: "All tiers" }, ...tiers.map(t => ({ value: t, label: t }))] },
                { key: "status", label: "Status", value: status, onChange: setStatus,
                  options: [{ value: "all", label: "All statuses" }, ...statuses.map(s => ({ value: s, label: s }))] },
                { key: "sort", label: "Sort", value: sort, onChange: setSort,
                  options: [{ value: "health", label: "Sort by health" }, { value: "mrr", label: "Sort by MRR" }, { value: "name", label: "Sort by name" }] }
              ]} />
            <Table data={filtered} columns={[
              { key: "name", label: "Name" },
              { key: "status", label: "Status", render: (r) => <span className={`status-pill ${statusClass(r.status)}`}>{r.status}</span> },
              { key: "tier", label: "Tier" },
              { key: "MRR", label: "MRR", render: (r) => formatCurrency(r.MRR) },
              { key: "csm", label: "CSM" },
              { key: "location", label: "Location", render: (r) => `${r.location.city}, ${r.location.state}` },
              { key: "health_score", label: "Health", render: (r) => <HealthBadge score={r.health_score} /> }
            ]} />
          </div>
        </div>
        <UsPinMap customers={filtered} />
      </section>
    </div>
  );
}

export default CustomerOverview;
