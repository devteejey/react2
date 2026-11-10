export default function Loader() {
  return (
    <div className="loader" role="status" aria-live="polite">
      <span className="spinner" aria-hidden="true" />
      Loading your dashboard...
    </div>
  );
}