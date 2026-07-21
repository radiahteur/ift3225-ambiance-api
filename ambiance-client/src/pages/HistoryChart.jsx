import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function HistoryChart({ timeline }) {
  if (!timeline || timeline.length === 0) {
    return <p>Aucune mesure disponible pour ce lieu.</p>;
  }

  const data = timeline.map((m) => ({
    time: new Date(m.timestamp).toLocaleString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }),
    soundLevelDb: m.soundLevelDb,
  }));

  return (
    <div style={{ width: "100%", height: 300 }}>
      <ResponsiveContainer>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis label={{ value: "dBFS", angle: -90, position: "insideLeft" }} />
          <Tooltip />
          <Line type="monotone" dataKey="soundLevelDb" stroke="#8884d8" name="Niveau sonore (dBFS)" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default HistoryChart;