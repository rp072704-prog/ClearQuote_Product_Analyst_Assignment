const W = 720, H = 280, P = 36;

function BarChart({ data = [], color = "#14b8a6", valueFormatter = (v) => v }) {
  const max = Math.max(...data.map(d => d.value), 1);
  const barSpace = (W - P * 2) / Math.max(data.length, 1);
  const barW = Math.min(42, barSpace * 0.6);

  return (
    <div className="chart">
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Bar chart">
        <defs>
          {data.map((d, i) => (
            <linearGradient key={i} id={`bg${i}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={d.color || color} stopOpacity="1" />
              <stop offset="100%" stopColor={d.color || color} stopOpacity="0.5" />
            </linearGradient>
          ))}
        </defs>
        {[0, 0.5, 1].map(t => {
          const y = H - P - t * (H - P * 2);
          return <line key={t} x1={P} y1={y} x2={W - P} y2={y} stroke="var(--line)" />;
        })}
        {data.map((d, i) => {
          const bh = (d.value / max) * (H - P * 2);
          const x = P + i * barSpace + (barSpace - barW) / 2;
          const y = H - P - bh;
          return (
            <g key={d.label} style={{ transformOrigin: `${x + barW / 2}px ${H - P}px`, animation: `growBar 0.6s ease-out ${i * 0.08}s both` }}>
              <rect fill={`url(#bg${i})`} height={bh} rx="6" width={barW} x={x} y={y} />
              <text x={x + barW / 2} y={y - 8} fill="var(--ink-2)" fontSize="11" fontWeight="700" textAnchor="middle">
                {valueFormatter(d.value)}
              </text>
              <text x={x + barW / 2} y={H - 10} fill="var(--muted)" fontSize="10" textAnchor="middle">{d.label}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export default BarChart;
