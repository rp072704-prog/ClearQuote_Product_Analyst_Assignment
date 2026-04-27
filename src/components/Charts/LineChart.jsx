const W = 720, H = 280, P = 36;

function buildPath(values, min, max) {
  const range = max - min || 1;
  const step = (W - P * 2) / Math.max(values.length - 1, 1);
  return values.map((pt, i) => {
    const x = P + i * step;
    const y = H - P - ((pt.value - min) / range) * (H - P * 2);
    return `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
  }).join(" ");
}

function buildArea(values, min, max) {
  const range = max - min || 1;
  const step = (W - P * 2) / Math.max(values.length - 1, 1);
  const points = values.map((pt, i) => {
    const x = P + i * step;
    const y = H - P - ((pt.value - min) / range) * (H - P * 2);
    return { x, y };
  });
  const first = points[0], last = points[points.length - 1];
  let d = `M ${first.x} ${first.y}`;
  points.slice(1).forEach(p => { d += ` L ${p.x} ${p.y}`; });
  d += ` L ${last.x} ${H - P} L ${first.x} ${H - P} Z`;
  return d;
}

function LineChart({ series = [], yLabel = "" }) {
  const all = series.flatMap(s => s.data.map(p => p.value));
  const max = Math.max(...all, 1);
  const min = Math.min(...all, 0);
  const labels = series[0]?.data || [];

  return (
    <div className="chart">
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={yLabel || "Line chart"}>
        <defs>
          {series.map((s, i) => (
            <linearGradient key={i} id={`lg${i}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={s.color} stopOpacity="0.25" />
              <stop offset="100%" stopColor={s.color} stopOpacity="0" />
            </linearGradient>
          ))}
        </defs>
        {[0, 0.25, 0.5, 0.75, 1].map(t => {
          const y = H - P - t * (H - P * 2);
          return <line key={t} x1={P} y1={y} x2={W - P} y2={y} stroke="var(--line)" />;
        })}
        <line x1={P} y1={H - P} x2={W - P} y2={H - P} stroke="var(--line)" />
        {[0, 0.5, 1].map(t => {
          const y = H - P - t * (H - P * 2);
          const v = Math.round(min + t * (max - min));
          return <text key={t} x={6} y={y + 4} fill="var(--muted)" fontSize="10" fontWeight="600">{v}</text>;
        })}
        {series.map((s, i) => (
          <g key={i}>
            <path d={buildArea(s.data, min, max)} fill={`url(#lg${i})`} />
            <path d={buildPath(s.data, min, max)} fill="none" stroke={s.color}
              strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5"
              style={{ strokeDasharray: 2000, animation: "drawLine 1.5s ease-out forwards" }} />
          </g>
        ))}
        {labels.map((pt, i) => {
          if (i % 3 !== 0 && i !== labels.length - 1) return null;
          const step = (W - P * 2) / Math.max(labels.length - 1, 1);
          return <text key={pt.label} x={P + i * step} y={H - 8} fill="var(--muted)" fontSize="10" textAnchor="middle">{pt.label}</text>;
        })}
      </svg>
      <div className="chart-legend">
        {series.map(s => (
          <span className="legend-item" key={s.label}>
            <span className="legend-swatch" style={{ background: s.color }} />{s.label}
          </span>
        ))}
      </div>
    </div>
  );
}

export default LineChart;
