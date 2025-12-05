"use client";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";

const data = [
  { name: "Mon", files: 30 }, { name: "Tue", files: 45 }, { name: "Wed", files: 28 },
  { name: "Thu", files: 60 }, { name: "Fri", files: 42 }, { name: "Sat", files: 34 },
];

export default function ActivityChart(){
  return (
    <div style={{ width: "100%", height: 220 }}>
      <ResponsiveContainer>
        <BarChart data={data}>
          <XAxis dataKey="name" stroke="#aabbd0" />
          <YAxis stroke="#aabbd0" />
          <Tooltip />
          <Bar dataKey="files" fill="#6f5bd7" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
