"use client";

import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from "chart.js";
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function StorageChart({ files = [], folders = [] }) {
  // simple distribution by folder
  const labels = folders.map(f => f.name);
  const values = folders.map(f => {
    let s = 0;
    f.files.forEach(id => {
      const file = files.find(x => x.id === id) || null;
      if (file) s += file.size || 0;
    });
    return Math.round(s / (1024*1024)); // MB
  });

  const data = {
    labels,
    datasets: [
      {
        label: "MB",
        data: values,
        backgroundColor: ["#3AB4F2", "#9B72CF", "#F39ACB", "#6EE7B7"],
      },
    ],
  };

  return <div style={{height: 220}}><Bar data={data} options={{responsive:true, maintainAspectRatio:false}}/></div>;
}
