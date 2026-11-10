import { useEffect, useState } from "react";

import Navbar from "../components/Navbar";
import StatCard from "../components/StatCard";
import RevenueChart from "../components/RevenueChart";
import UserGrowthChart from "../components/UserGrowthChart";
import SalesPieChart from "../components/SalesPieChart";
import Loader from "../components/Loader";
import { getDashboardStats } from "../services/dashboardService";
import { downloadCsv } from "../services/downloadService";
import { useAuth } from "../context/auth";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [recentUsers, setRecentUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retryCount, setRetryCount] = useState(0);
  const [period, setPeriod] = useState("6 months");
  const { user } = useAuth();

  useEffect(() => {
    Promise.resolve()
      .then(() => getDashboardStats())
      .then((dashboard) => {
        setStats(dashboard.stats);
        setRecentUsers(dashboard.recentUsers);
        setError("");
      })
      .catch((requestError) => {
        console.error("Unable to load dashboard statistics:", requestError);
        setError("Dashboard statistics could not be loaded. Please try again.");
      })
      .finally(() => setLoading(false));
  }, [retryCount]);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  const exportDashboard = () => {
    const rows = [
      ["Metric", "Value"],
      ["Total users", stats?.totalUsers ?? "Unavailable"],
      ["Active users", stats?.activeUsers ?? "Unavailable"],
      ["Pending users", stats?.pendingUsers ?? "Unavailable"],
      ["Inactive users", stats?.inactiveUsers ?? "Unavailable"],
      ["New users (last 30 days)", stats?.newUsers ?? "Unavailable"],
      ["Report period", period],
    ];
    downloadCsv("adminpro-dashboard.csv", rows);
  };

  return (
    <>
      <Navbar />
      <section className="page dashboard">
        <div className="page-heading dashboard-heading">
          <div>
            <p className="eyebrow">{new Date().toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric", year: "numeric" })}</p>
            <h2>{greeting}, {user?.name ?? "Admin"}</h2>
            <p className="page-description">Here’s what’s happening with your workspace today.</p>
          </div>
          <div className="heading-actions">
            <span className="demo-badge">DEMO DATA</span>
            <button className="button button-secondary" type="button" onClick={exportDashboard}>Export report</button>
          </div>
        </div>
        {loading ? (
          <Loader />
        ) : error ? (
          <div className="dashboard-error" role="alert">
            <p>{error}</p>
            <button onClick={() => {
              setLoading(true);
              setRetryCount((count) => count + 1);
            }}>
              Retry
            </button>
          </div>
        ) : (
          <>
            <div className="stats">
              <StatCard title="Total users" value={stats.totalUsers} change="Local" caption="in this browser" icon="U" />
              <StatCard title="Active users" value={stats.activeUsers} change="Local" caption="with access" icon="✓" />
              <StatCard title="Pending users" value={stats.pendingUsers} change="Local" caption="awaiting activation" icon="…" />
              <StatCard title="New users" value={stats.newUsers} change="Last 30 days" caption="recently added" icon="↗" />
            </div>
            <div className="chart-toolbar">
              <div>
                <h3>Performance</h3>
                <p>Review sample revenue and user growth over time.</p>
              </div>
              <label>
                <span className="visually-hidden">Dashboard chart period</span>
                <select name="dashboardPeriod" value={period} onChange={(event) => setPeriod(event.target.value)}>
                  <option>3 months</option>
                  <option>6 months</option>
                  <option>12 months</option>
                </select>
              </label>
            </div>
            <div className="charts-grid">
              <RevenueChart period={period} />
              <UserGrowthChart period={period} />
              <SalesPieChart period={period} />
            </div>
            <section className="panel activity-panel">
              <div className="panel-heading">
                <div>
                  <h3>Recently added users</h3>
                  <p>The latest people added to your workspace.</p>
                </div>
                <span className="count-badge">{recentUsers.length} total</span>
              </div>
              <div className="activity-list">
                {recentUsers.slice(0, 4).map((user) => (
                  <div className="activity-row" key={user._id ?? user.id}>
                    <span className="avatar" aria-hidden="true">
                      {user.name.split(/\s+/).map((part) => part[0]).slice(0, 2).join("").toUpperCase()}
                    </span>
                    <div className="activity-user">
                      <strong>{user.name}</strong>
                      <span>{user.email}</span>
                    </div>
                    <span className={`status status-${(user.status ?? "Active").toLowerCase()}`}>{user.status ?? "Active"}</span>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}
      </section>
    </>
  );
}
