export default function StatCard({
  title,
  value,
  change,
  caption,
  icon,
}) {
  return (
    <div className="card stat-card">
      <div className="stat-card-top">
        <p>{title}</p>
        <span className="stat-icon" aria-hidden="true">{icon}</span>
      </div>
      <strong className="stat-value">{value}</strong>
      <small><span className="positive">{change}</span> {caption}</small>
    </div>
  );
}