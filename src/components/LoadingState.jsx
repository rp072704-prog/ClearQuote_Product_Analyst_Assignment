function LoadingState({ cards = 4, chart = false }) {
  return (
    <div>
      <div className="grid four" style={{ marginBottom: 20 }}>
        {Array.from({ length: cards }).map((_, i) => (
          <div key={i} className="skeleton skeleton-card" />
        ))}
      </div>
      {chart && <div className="skeleton skeleton-chart" />}
    </div>
  );
}

export default LoadingState;
