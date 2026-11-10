import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { month: "Jan", users: 500 },
  { month: "Feb", users: 800 },
  { month: "Mar", users: 1200 },
  { month: "Apr", users: 1600 },
  { month: "May", users: 2100 },
  { month: "Jun", users: 2800 },
  { month: "Jul", users: 3100 },
  { month: "Aug", users: 3600 },
  { month: "Sep", users: 3900 },
  { month: "Oct", users: 4300 },
  { month: "Nov", users: 4700 },
  { month: "Dec", users: 5200 },
];

const rangeLengths = { "3 months": 3, "6 months": 6, "12 months": 12 };

export default function UserGrowthChart({ period = "6 months" }) {
  const chartData = data.slice(-rangeLengths[period]);

  return (
    <div className="chart-card">
      <div className="chart-title">
        <h2>User Growth</h2>
        <span>{period}</span>
      </div>

      <ResponsiveContainer
        width="100%"
        height={350}
      >
        <BarChart data={chartData}>
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />

          <Bar
            dataKey="users"
            fill="#10b981"
            radius={[8, 8, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}