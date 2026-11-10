import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Desktop", value: 55 },
  { name: "Mobile", value: 30 },
  { name: "Tablet", value: 15 },
];

const COLORS = [
  "#2563eb",
  "#10b981",
  "#f59e0b",
];

export default function SalesPieChart({ period = "sample period" }) {
  return (
    <div className="chart-card">
      <div className="chart-title">
        <h2>Traffic Sources</h2>
        <span>{period}</span>
      </div>

      <ResponsiveContainer
        width="100%"
        height={350}
      >
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={120}
            dataKey="value"
            label
          >
            {data.map((entry, index) => (
              <Cell
                key={index}
                fill={
                  COLORS[
                    index % COLORS.length
                  ]
                }
              />
            ))}
          </Pie>

          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}