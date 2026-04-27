import StatRing from "./StatRing";

function HealthBadge({ score }) {
  let className = "healthy";
  let label = "Healthy";
  let color = "var(--green)";

  if (score < 70) {
    className = "watch";
    label = "Watch";
    color = "var(--amber)";
  }

  if (score < 40) {
    className = "risk";
    label = "At Risk";
    color = "var(--red)";
  }

  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
      <StatRing value={score} size={34} stroke={3} color={color} />
      <span className={`health-badge ${className}`}>{label}</span>
    </span>
  );
}

export default HealthBadge;
