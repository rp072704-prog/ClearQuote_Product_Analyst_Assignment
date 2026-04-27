import { useEffect, useMemo, useState } from "react";
import AlertBanner from "../components/AlertBanner";
import BarChart from "../components/Charts/BarChart";
import LineChart from "../components/Charts/LineChart";
import FilterBar from "../components/FilterBar";
import LoadingState from "../components/LoadingState";
import Table from "../components/Table";
import { getCustomers, getUsage } from "../services/api";
import { average, compactMonth, formatNumber, formatPercent } from "../utils/helpers";

function aggregateByMonth(records) {
  const m = {};
  records.forEach((r) => {
    m[r.month] = m[r.month] || { month: r.month, inspections: 0, api_calls: 0, active_drivers: 0, damage_rates: [] };
    m[r.month].inspections += r.inspections;
    m[r.month].api_calls += r.api_calls;
    m[r.month].active_drivers += r.active_drivers;
    m[r.month].damage_rates.push(r.damage_rate);
  });
  return Object.values(m).sort((a, b) => a.month.localeCompare(b.month))
    .map((r) => ({ ...r, damage_rate: average(r.damage_rates) }));
}

function UsageMetrics() {
  const [customers, setCustomers] = useState([]);
  const [usage, setUsage] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCustomer, setSelectedCustomer] = useState("all");

  useEffect(() => {
    Promise.all([getCustomers(), getUsage()]).then(([c, u]) => {
      setCustomers(c); setUsage(u); setLoading(false);
    });
  }, []);

  const customerById = useMemo(() => Object.fromEntries(customers.map(c => [c.id, c])), [customers]);

  const filteredUsage = useMemo(() => {
    if (selectedCustomer === "all") return usage;
    return usage.filter(r => String(r.customer_id) === selectedCustomer);
  }, [usage, selectedCustomer]);

  const monthly = useMemo(() => aggregateByMonth(filteredUsage), [filteredUsage]);
  const latest = monthly[monthly.length - 1] || {};
  const prev = monthly[monthly.length - 2] || {};

  // Usage drop detection
  const usageDropAlerts = useMemo(() => {
    if (selectedCustomer !== "all") return [];
    const alerts = [];
    const byCustomer = {};
    usage.forEach(r => { (byCustomer[r.customer_id] = byCustomer[r.customer_id] || []).push(r); });
    Object.entries(byCustomer).forEach(([cid, records]) => {
      const sorted = [...records].sort((a, b) => a.month.localeCompare(b.month));
      if (sorted.length < 4) return;
      const recent3 = sorted.slice(-4, -1);
      const latestR = sorted[sorted.length - 1];
      const avg3 = average(recent3.map(r => r.inspections));
      if (avg3 > 0 && latestR.inspections < avg3 * 0.8) {
        const name = customerById[cid]?.name || `Customer ${cid}`;
        alerts.push(`${name}: inspections dropped to ${latestR.inspections} (3-mo avg: ${Math.round(avg3)})`);
      }
    });
    return alerts;
  }, [usage, customerById, selectedCustomer]);

  const inspTrend = prev.inspections ? ((latest.inspections - prev.inspections) / prev.inspections * 100).toFixed(1) : null;
  const recentDrivers = monthly.slice(-8).map(r => ({ label: compactMonth(r.month), value: r.active_drivers }));

  const lineSeries = [
    { label: "Inspections", color: "#14b8a6", data: monthly.map(r => ({ label: compactMonth(r.month), value: r.inspections })) },
    { label: "API Calls / 10", color: "#f59e0b", data: monthly.map(r => ({ label: compactMonth(r.month), value: Math.round(r.api_calls / 10) })) }
  ];

  if (loading) return <LoadingState cards={4} chart />;

  return (
    <div>
      <div className="page-header">
        <div>
          <h2 className="page-title">Usage Metrics</h2>
          <p className="page-copy">Monthly inspection volume, damage rate, driver activity, and API trend visibility.</p>
        </div>
      </div>

      {usageDropAlerts.map((msg, i) => <AlertBanner key={i} type="warning" message={msg} />)}

      <FilterBar filters={[{
        key: "customer", label: "Customer", value: selectedCustomer, onChange: setSelectedCustomer,
        options: [{ value: "all", label: "All customers" }, ...customers.map(c => ({ value: String(c.id), label: c.name }))]
      }]} />

      <section className="grid four">
        <div className="metric-card accent-teal">
          <p className="metric-label">Latest Inspections</p>
          <p className="metric-value">
            {formatNumber(latest.inspections)}
            {inspTrend && <span className={`metric-trend ${Number(inspTrend) >= 0 ? "up" : "down"}`}>
              {Number(inspTrend) >= 0 ? "↑" : "↓"} {Math.abs(Number(inspTrend))}%
            </span>}
          </p>
          <p className="metric-note">{latest.month || "—"}</p>
        </div>
        <div className="metric-card accent-amber">
          <p className="metric-label">Damage Rate</p>
          <p className="metric-value">{formatPercent(latest.damage_rate || 0)}</p>
          <p className="metric-note">Latest monthly average</p>
        </div>
        <div className="metric-card accent-brand">
          <p className="metric-label">Active Drivers</p>
          <p className="metric-value">{formatNumber(latest.active_drivers)}</p>
          <p className="metric-note">Drivers using inspections</p>
        </div>
        <div className="metric-card accent-green">
          <p className="metric-label">API Calls</p>
          <p className="metric-value">{formatNumber(latest.api_calls)}</p>
          <p className="metric-note">Latest monthly total</p>
        </div>
      </section>

      <section className="grid two section-space">
        <div className="panel">
          <div className="panel-header"><h3 className="panel-title">Inspection & API Trends</h3></div>
          <div className="panel-body"><LineChart series={lineSeries} yLabel="Usage trends" /></div>
        </div>
        <div className="panel">
          <div className="panel-header"><h3 className="panel-title">Active Drivers (Recent 8 Months)</h3></div>
          <div className="panel-body"><BarChart data={recentDrivers} color="#0ea5e9" valueFormatter={formatNumber} /></div>
        </div>
      </section>

      <section className="panel section-space">
        <div className="panel-header"><h3 className="panel-title">Monthly Usage Detail</h3></div>
        <div className="panel-body">
          <Table data={filteredUsage} columns={[
            { key: "customer", label: "Customer", render: (r) => customerById[r.customer_id]?.name || `Customer ${r.customer_id}` },
            { key: "month", label: "Month" },
            { key: "inspections", label: "Inspections", render: (r) => formatNumber(r.inspections) },
            { key: "damage_rate", label: "Damage Rate", render: (r) => formatPercent(r.damage_rate) },
            { key: "active_drivers", label: "Active Drivers", render: (r) => formatNumber(r.active_drivers) },
            { key: "api_calls", label: "API Calls", render: (r) => formatNumber(r.api_calls) }
          ]} />
        </div>
      </section>
    </div>
  );
}

export default UsageMetrics;
