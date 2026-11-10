import { useState } from "react";
import Navbar from "../components/Navbar";
import RevenueChart from "../components/RevenueChart";
import UserGrowthChart from "../components/UserGrowthChart";
import SalesPieChart from "../components/SalesPieChart";
import { downloadCsv } from "../services/downloadService";

const reports = {
  "Last 30 days": {
    visitors: "4,320",
    visitorsChange: "+6.8%",
    conversion: "12.4%",
    conversionChange: "+1.2%",
    bounce: "28%",
    bounceChange: "↓ 3.1%",
    session: "4m 22s",
    sessionChange: "+12 sec",
    chartPeriod: "3 months",
  },
  "Last 90 days": {
    visitors: "12,840",
    visitorsChange: "+9.4%",
    conversion: "11.8%",
    conversionChange: "+0.8%",
    bounce: "29%",
    bounceChange: "↓ 2.4%",
    session: "4m 08s",
    sessionChange: "+8 sec",
    chartPeriod: "6 months",
  },
  "Last 12 months": {
    visitors: "48,620",
    visitorsChange: "+14.2%",
    conversion: "10.9%",
    conversionChange: "+2.1%",
    bounce: "31%",
    bounceChange: "↓ 4.8%",
    session: "3m 56s",
    sessionChange: "+19 sec",
    chartPeriod: "12 months",
  },
};

export default function Analytics() {
  const [period, setPeriod] = useState("Last 30 days");
  const report = reports[period];

  const exportReport = () => {
    const rows = [
      ["Metric", "Value", "Change"],
      ["Visitors", report.visitors, report.visitorsChange],
      ["Conversion rate", report.conversion, report.conversionChange],
      ["Bounce rate", report.bounce, report.bounceChange],
      ["Average session", report.session, report.sessionChange],
      ["Period", period, ""],
    ];
    downloadCsv("adminpro-analytics.csv", rows);
  };

  return (
    <>
      <Navbar />
      <section className="page">
        <div className="page-heading">
          <div>
            <p className="eyebrow">Workspace</p>
            <h2>Analytics</h2>
            <p className="page-description">A snapshot of traffic and engagement across your workspace.</p>
          </div>
          <div className="heading-actions">
            <span className="demo-badge">SAMPLE REPORT</span>
            <button className="button button-secondary" type="button" onClick={exportReport}>Export CSV</button>
          </div>
        </div>
        <div className="chart-toolbar analytics-toolbar">
          <div>
            <h3>Engagement overview</h3>
            <p>Sample metrics for the selected reporting window.</p>
          </div>
          <label>
            <span className="visually-hidden">Analytics report period</span>
            <select name="analyticsPeriod" value={period} onChange={(event) => setPeriod(event.target.value)}>
              {Object.keys(reports).map((reportPeriod) => <option key={reportPeriod}>{reportPeriod}</option>)}
            </select>
          </label>
        </div>
        <div className="stats analytics-stats">
          <div className="card stat-card"><span className="stat-icon">V</span><p>Visitors</p><strong>{report.visitors}</strong><small><span className="positive">{report.visitorsChange}</span> vs. previous period</small></div>
          <div className="card stat-card"><span className="stat-icon">C</span><p>Conversion rate</p><strong>{report.conversion}</strong><small><span className="positive">{report.conversionChange}</span> vs. previous period</small></div>
          <div className="card stat-card"><span className="stat-icon">B</span><p>Bounce rate</p><strong>{report.bounce}</strong><small><span className="positive">{report.bounceChange}</span> vs. previous period</small></div>
          <div className="card stat-card"><span className="stat-icon">T</span><p>Avg. session</p><strong>{report.session}</strong><small><span className="positive">{report.sessionChange}</span> vs. previous period</small></div>
        </div>
        <div className="charts-grid analytics-charts">
          <RevenueChart period={report.chartPeriod} />
          <UserGrowthChart period={report.chartPeriod} />
          <SalesPieChart />
        </div>
      </section>
    </>
  );
}