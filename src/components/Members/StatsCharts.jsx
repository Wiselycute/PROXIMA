"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { Bar, Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend } from "chart.js";
ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

export default function StatsCharts(){
  const [stats,setStats] = useState(null);
  useEffect(()=>{ axios.get("/api/stats").then(r=>setStats(r.data)); },[]);
  if(!stats) return <div className="card-glass p-4">Loading stats...</div>;

  const statusData = {
    labels:["To Do","In Progress","Done"],
    datasets:[{ data:[stats.byStatus.todo||0, stats.byStatus.inprogress||0, stats.byStatus.done||0], backgroundColor:["#9B72CF","#3AB4F2","#2E0F55"] }]
  };

  return (
    <div className="grid gap-4">
      <div className="card-glass p-4"><h4 className="mb-2">Task Status</h4><Bar data={statusData} options={{plugins:{legend:{display:false}}}}/></div>
      <div className="card-glass p-4"><h4 className="mb-2">Priority</h4><Doughnut data={{labels:Object.keys(stats.byPriority), datasets:[{data:Object.values(stats.byPriority), backgroundColor:["#FDE68A","#FCA5A5","#A78BFA"]}]}} /></div>
    </div>
  );
}
