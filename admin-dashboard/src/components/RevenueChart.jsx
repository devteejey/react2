import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const data = [
  { month: "Jan", revenue: 12000 },
  { month: "Feb", revenue: 18000 },
  { month: "Mar", revenue: 15000 },
  { month: "Apr", revenue: 25000 },
  { month: "May", revenue: 22000 },
  { month: "Jun", revenue: 32000 },
  { month: "Jul", revenue: 29000 },
  { month: "Aug", revenue: 36000 },
  { month: "Sep", revenue: 34000 },
  { month: "Oct", revenue: 41000 },
  { month: "Nov", revenue: 39000 },
  { month: "Dec", revenue: 48290 },
];

const rangeLengths = { "3 months": 3, "6 months": 6, "12 months": 12 };

export default function RevenueChart({ period = "6 months" }) {
  const chartData = data.slice(-rangeLengths[period]);

  return (
    <div className="chart-card">
      <div className="chart-title">
        <h2>Revenue Overview</h2>
        <span>{period}</span>
      </div>

      <ResponsiveContainer
        width="100%"
        height={350}
      >
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="month" />

          <YAxis />

          <Tooltip />

          <Line
            type="monotone"
            dataKey="revenue"
            stroke="#2563eb"
            strokeWidth={3}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}