const COLORS = ["#0ea5e9", "#14b8a6", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#22c55e", "#f97316"];

function DonutChart({ data = [], size = 200, strokeWidth = 32, centerLabel = "", centerValue = "" }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const total = data.reduce((s, d) => s + d.value, 0) || 1;

  let accumulated = 0;
  const segments = data.map((item, i) => {
    const pct = item.value / total;
    const dashLen = circumference * pct;
    const dashOffset = circumference * (1 - accumulated);
    accumulated += pct;
    return { ...item, pct, dashLen, dashOffset, color: item.color || COLORS[i % COLORS.length] };
  });

  return (
    <div className="donut-wrap">
      <div style={{ position: "relative", width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
          <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="var(--line)" strokeWidth={strokeWidth} />
          {segments.map((seg, i) => (
            <circle
              key={i}
              cx={size / 2} cy={size / 2} r={radius}
              fill="none" stroke={seg.color} strokeWidth={strokeWidth}
              strokeDasharray={`${seg.dashLen} ${circumference - seg.dashLen}`}
              strokeDashoffset={seg.dashOffset}
              strokeLinecap="butt"
              style={{ transition: "stroke-dasharray 0.8s ease-out, stroke-dashoffset 0.8s ease-out" }}
            />
          ))}
        </svg>
        {centerValue && (
          <div className="donut-center">
            <div className="donut-center-value">{centerValue}</div>
            {centerLabel && <div className="donut-center-label">{centerLabel}</div>}
          </div>
        )}
      </div>
      <div className="donut-legend">
        {segments.map((seg, i) => (
          <span key={i} className="donut-legend-item">
            <span className="donut-legend-swatch" style={{ background: seg.color }} />
            {seg.label} ({Math.round(seg.pct * 100)}%)
          </span>
        ))}
      </div>
    </div>
  );
}

export default DonutChart;
