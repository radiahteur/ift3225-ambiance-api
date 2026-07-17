import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { day: "15 juil", level: 2 },
  { day: "16 juil", level: 5 },
  { day: "17 juil", level: 3 },
  { day: "18 juil", level: 7 },
  { day: "19 juil", level: 4 },
];

function HistoryChart() {
  return (
    <div style={{ width: "100%", height: 300 }}>
      <ResponsiveContainer>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="level" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default HistoryChart;