import { useEffect, useMemo, useState } from "react";
import DonutChart from "../components/Charts/DonutChart";
import FilterBar from "../components/FilterBar";
import LoadingState from "../components/LoadingState";
import Table from "../components/Table";
import { getCustomers, getFleet } from "../services/api";
import { average, formatNumber } from "../utils/helpers";

function FleetDistribution() {
  const [customers, setCustomers] = useState([]);
  const [fleet, setFleet] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [provider, setProvider] = useState("all");
  const [platform, setPlatform] = useState("all");

  useEffect(() => {
    Promise.all([getCustomers(), getFleet()]).then(([c, f]) => {
      setCustomers(c); setFleet(f); setLoading(false);
    });
  }, []);

  const customerById = useMemo(() => Object.fromEntries(customers.map(c => [c.id, c])), [customers]);
  const providers = [...new Set(fleet.map(r => r.telematics_provider))];
  const platforms = [...new Set(fleet.map(r => r.fms_platform))];

  const filteredFleet = useMemo(() => {
    const s = search.toLowerCase();
    return fleet.filter(r => {
      const c = customerById[r.customer_id];
      const ms = c?.name.toLowerCase().includes(s) || r.telematics_provider.toLowerCase().includes(s) || r.fms_platform.toLowerCase().includes(s);
      return ms && (provider === "all" || r.telematics_provider === provider) && (platform === "all" || r.fms_platform === platform);
    });
  }, [fleet, customerById, search, provider, platform]);

  const vehicleTotals = filteredFleet.reduce((t, r) => {
    Object.entries(r.vehicle_types).forEach(([k, v]) => { t[k] = (t[k] || 0) + v; });
    return t;
  }, {});
  const vehicleChart = Object.entries(vehicleTotals).map(([label, value]) => ({ label, value }));
  const totalVehicles = filteredFleet.reduce((s, r) => s + r.total_vehicles, 0);
  const avgAge = average(filteredFleet.map(r => r.avg_fleet_age));

  // Provider distribution
  const providerCounts = {};
  filteredFleet.forEach(r => { providerCounts[r.telematics_provider] = (providerCounts[r.telematics_provider] || 0) + 1; });
  const providerChart = Object.entries(providerCounts).map(([label, value]) => ({ label, value }));

  // Platform distribution
  const platformCounts = {};
  filteredFleet.forEach(r => { platformCounts[r.fms_platform] = (platformCounts[r.fms_platform] || 0) + 1; });
  const platformChart = Object.entries(platformCounts).map(([label, value]) => ({ label, value }));

  if (loading) return <LoadingState cards={4} chart />;

  return (
    <div>
      <div className="page-header">
        <div>
          <h2 className="page-title">Fleet Distribution</h2>
          <p className="page-copy">Vehicle composition, telematics provider, FMS platform, and fleet age by customer.</p>
        </div>
      </div>

      <section className="grid four">
        <div className="metric-card accent-brand">
          <p className="metric-label">Total Vehicles</p>
          <p className="metric-value">{formatNumber(totalVehicles)}</p>
          <p className="metric-note">Filtered fleet footprint</p>
        </div>
        <div className="metric-card accent-amber">
          <p className="metric-label">Average Fleet Age</p>
          <p className="metric-value">{avgAge.toFixed(1)} <span style={{ fontSize: 14, color: "var(--muted)" }}>yrs</span></p>
          <p className="metric-note">Across filtered accounts</p>
        </div>
        <div className="metric-card accent-teal">
          <p className="metric-label">Telematics Providers</p>
          <p className="metric-value">{providers.length}</p>
          <p className="metric-note">Connected tools</p>
        </div>
        <div className="metric-card accent-green">
          <p className="metric-label">FMS Platforms</p>
          <p className="metric-value">{platforms.length}</p>
          <p className="metric-note">Fleet management systems</p>
        </div>
      </section>

      <section className="grid three section-space">
        <div className="panel">
          <div className="panel-header"><h3 className="panel-title">Vehicle Types</h3></div>
          <div className="panel-body">
            <DonutChart data={vehicleChart} size={180} strokeWidth={28} centerValue={formatNumber(totalVehicles)} centerLabel="Vehicles" />
          </div>
        </div>
        <div className="panel">
          <div className="panel-header"><h3 className="panel-title">Telematics Providers</h3></div>
          <div className="panel-body">
            <DonutChart data={providerChart} size={180} strokeWidth={28} centerValue={String(providers.length)} centerLabel="Providers" />
          </div>
        </div>
        <div className="panel">
          <div className="panel-header"><h3 className="panel-title">FMS Platforms</h3></div>
          <div className="panel-body">
            <DonutChart data={platformChart} size={180} strokeWidth={28} centerValue={String(platforms.length)} centerLabel="Platforms" />
          </div>
        </div>
      </section>

      <section className="panel section-space">
        <div className="panel-header"><h3 className="panel-title">Fleet Records</h3></div>
        <div className="panel-body">
          <FilterBar search={search} onSearchChange={setSearch} searchPlaceholder="Search customer, provider, or platform"
            filters={[
              { key: "provider", label: "Telematics Provider", value: provider, onChange: setProvider,
                options: [{ value: "all", label: "All providers" }, ...providers.map(p => ({ value: p, label: p }))] },
              { key: "platform", label: "FMS Platform", value: platform, onChange: setPlatform,
                options: [{ value: "all", label: "All platforms" }, ...platforms.map(p => ({ value: p, label: p }))] }
            ]} />
          <Table data={filteredFleet} columns={[
            { key: "customer", label: "Customer", render: (r) => customerById[r.customer_id]?.name || `Customer ${r.customer_id}` },
            { key: "total_vehicles", label: "Vehicles", render: (r) => formatNumber(r.total_vehicles) },
            { key: "telematics_provider", label: "Telematics" },
            { key: "fms_platform", label: "FMS" },
            { key: "avg_fleet_age", label: "Avg Age", render: (r) => `${r.avg_fleet_age} yrs` },
            { key: "vehicle_types", label: "Vehicle Types", render: (r) => Object.entries(r.vehicle_types).map(([t, c]) => `${t}: ${c}`).join(", ") }
          ]} />
        </div>
      </section>
    </div>
  );
}

export default FleetDistribution;
