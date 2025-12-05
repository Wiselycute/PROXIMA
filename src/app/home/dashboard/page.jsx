// "use client";

// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Check, Users, Folder, Activity } from "lucide-react";
// import Sidebar from "@/components/Sidebar";
// import Topbar from "@/components/Topbar";

// export default function DashboardPage() {
//   return (
//     <div className="min-h-screen flex bg-[var(--background)] text-[var(--foreground)]">
//       <Sidebar />
//       <div className="flex-1">
//         <Topbar />
//         <main className="p-8">
//           <div className="space-y-10">

//       {/* Neon Line Accent */}
//       <div className="absolute top-0 right-0 w-80 h-80 blur-3xl opacity-40 bg-[#C9B7ED] rounded-full -z-10"></div>

//       <h1 className="text-3xl font-bold">Dashboard</h1>

//       {/* Stats */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
//         <Card className="border-none shadow-sm hover:shadow-md transition">
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <Check size={22} /> Active Tasks
//             </CardTitle>
//           </CardHeader>
//           <CardContent className="text-3xl font-semibold">42</CardContent>
//         </Card>

//         <Card className="border-none shadow-sm hover:shadow-md transition">
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <Users size={22} /> Team Members
//             </CardTitle>
//           </CardHeader>
//           <CardContent className="text-3xl font-semibold">10</CardContent>
//         </Card>

//         <Card className="border-none shadow-sm hover:shadow-md transition">
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <Folder size={22} /> Projects
//             </CardTitle>
//           </CardHeader>
//           <CardContent className="text-3xl font-semibold">6</CardContent>
//         </Card>

//       </div>

//       {/* Recent Activity */}
//       <Card className="border-none shadow-sm">
//         <CardHeader>
//           <CardTitle className="flex items-center gap-1">
//             <Activity size={20} /> Recent Activity
//           </CardTitle>
//         </CardHeader>

//         <CardContent className="space-y-4">
//           <div className="flex gap-3 items-start">
//             <div className="h-2 w-2 rounded-full bg-[#9B72CF] mt-2"></div>
//             <p className="text-sm text-[#5c4c70]">
//               <strong>Amanda</strong> moved <strong>Landing Page UI</strong> to <em>In Progress</em>.
//             </p>
//           </div>

//           <div className="flex gap-3 items-start">
//             <div className="h-2 w-2 rounded-full bg-[#3AB4F2] mt-2"></div>
//             <p className="text-sm text-[#5c4c70]">
//               <strong>David</strong> uploaded <strong>Brand Assets.zip</strong>.
//             </p>
//           </div>

//           <div className="flex gap-3 items-start">
//             <div className="h-2 w-2 rounded-full bg-[#9B72CF] mt-2"></div>
//             <p className="text-sm text-[#5c4c70]">
//               <strong>You</strong> commented on <strong>Team Dashboard Design</strong>.
//             </p>
//           </div>
//         </CardContent>
//       </Card>

//           </div>
//         </main>
//       </div>
//     </div>
//   );
// }
"use client";

import { useState } from "react";
import { Plus, Search } from "lucide-react";
import { Line, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import AddProjectModal from "@/components/Kanban/AddProjectModal";
import { motion } from 'framer-motion';

ChartJS.register(
  LineElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

const glass = `
  bg-[color-mix(in_srgb,var(--card)90%,transparent)]
  border border-[color-mix(in_srgb,var(--border)70%,transparent)]
  backdrop-blur-xl
 `;

function StatCard({ label, value, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className={` bg-[var(--background)]  p-4 rounded-xl border border-[#3AB4F2] shadow-[0_0_40px_rgba(0,0,0,0.15)]`}
    >
      <div className="text-xs opacity-70">{label}</div>
      <div className="text-xl font-bold mt-2 tracking-tight">{value}</div>
    </motion.div>
  );
}

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("Monthly");
  const [showAddProjectModal, setShowAddProjectModal] = useState(false);
  const [projects, setProjects] = useState([
    { id: "p-1", label: "W", title: "Website Redesign", subtitle: "Redesign company website with new branding", members: 3, status: "Active", progress: 65, color: "bg-blue-500" },
    { id: "p-2", label: "M", title: "Mobile App", subtitle: "iOS and Android development", members: 4, status: "Active", progress: 42, color: "bg-purple-500" },
    { id: "p-3", label: "D", title: "Dashboard Design", subtitle: "Internal analytics platform", members: 2, status: "Planning", progress: 20, color: "bg-green-500" }
  ]);

  const handleAddProject = (data) => {
    const newProject = {
      id: `p-${Date.now()}`,
      label: data.name.charAt(0).toUpperCase(),
      title: data.name,
      subtitle: data.description,
      members: 0,
      status: "Active",
      progress: 0,
      color: ["bg-blue-500", "bg-purple-500", "bg-green-500"][Math.floor(Math.random() * 3)]
    };
    setProjects([...projects, newProject]);
  };

  const lineData = {
    labels: [
      "May", "Jun", "Jul", "Aug", "Sep", "Oct", 
      "Nov", "Dec", "Jan", "Feb", "Mar", "Apr",
    ],
    datasets: [
      {
        label: "Completed",
        data: [20, 60, 150, 300, 250, 200, 180, 220, 260, 280, 320, 270],
        tension: 0.4,
        borderWidth: 3,
        borderColor: "rgba(84,112,255,1)",
        pointBackgroundColor: "rgba(84,112,255,1)",
      },
      {
        label: "In Progress",
        data: [10, 40, 80, 150, 180, 130, 100, 120, 140, 160, 200, 190],
        tension: 0.4,
        borderWidth: 3,
        borderColor: "rgba(0,204,153,1)",
        pointBackgroundColor: "rgba(0,204,153,1)",
      },
    ],
  };

  const donutData = {
    labels: ["To Do", "In Progress", "Done"],
    datasets: [
      {
        data: [2, 2, 2],
        backgroundColor: ["#F4A261", "#4A90E2", "#2ECC71"],
        borderWidth: 0,
      },
    ],
  };

  return (
    <div className="min-h-screen  flex bg-[var(--background)] text-[var(--foreground)]">
      <Sidebar />
      <div className="flex-1">
        <Topbar />

      {/* Header */}
      <div className="flex flex-col bg-[var(--background)] sticky top-0 z-10 sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-xl sm:text-2xl font-semibold text-white p-4">
          Dashboard
        </h1>

        <div className="flex bg-[var(--background)] flex-col sm:flex-row gap-3  sm:items-center">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="bg-[var(--background)] w-full pl-9 pr-3 py-2 rounded-lg border border-gray-700 text-sm text-gray-300 focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <button onClick={() => setShowAddProjectModal(true)} className="bg-[#5A62EA] hover:bg-[#7077FF] transition px-4 py-2 rounded-lg flex items-center gap-2 text-white text-sm w-full sm:w-auto">
            <Plus size={16} /> New Project
          </button>
        </div>
      </div>

         {/* stat card */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 flex bg-[var(--background)] mx-6 ">
              <StatCard label="Active tasks" value={87} delay={0.05} />
              <StatCard label="Teams" value={12} delay={0.1} />
              <StatCard label="Completed" value={430} delay={0.15} />
              <StatCard label="Users" value={98} delay={0.2} />
            </div>

     

      {/* Charts Section */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 my-6 ml-4">

        {/* Line Chart */}
        <div className="xl:col-span-2 bg-[var(--background)] p-4 sm:p-6 rounded-xl border border-gray-700">
          <div className="flex flex-wrap items-center justify-between mb-4 gap-3">
            <h2 className="text-white text-lg font-semibold">
              Tasks Done
            </h2>

            <div className="flex gap-4 text-gray-300 text-sm">
              {["Daily", "Weekly", "Monthly"].map((t) => (
                <button
                  key={t}
                  onClick={() => setActiveTab(t)}
                  className={`
                    pb-1 border-b-2 transition
                    ${
                      activeTab === t
                        ? "text-indigo-400 border-indigo-400"
                        : "border-transparent"
                    }
                  `}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="w-full overflow-x-auto">
            <Line data={lineData} />
          </div>
        </div>

        {/* Donut Chart */}
        <div className="bg-[var(--background)] my-6 p-4 mr-4 sm:p-6 rounded-xl border border-gray-700">
          <h2 className="text-white text-lg font-semibold mb-4">
            Task Status Overview
          </h2>

          <div className="w-56 mx-auto">
            <Doughnut data={donutData} />
          </div>

          <div className="flex justify-between mt-6 text-sm text-gray-300">
            <Status label="To Do" value={2} color="#F4A261" />
            <Status label="In Progress" value={2} color="#4A90E2" />
            <Status label="Done" value={2} color="#2ECC71" />
          </div>
        </div>
        
      </div>
       {/* Project Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3p-4 sm:p-6 space-y-4 w-full gap-4">
        {projects.map(p => (
          <ProjectCard
            key={p.id}
            label={p.label}
            title={p.title}
            subtitle={p.subtitle}
            members={p.members}
            status={p.status}
            progress={p.progress}
            color={p.color}
          />
        ))}

        <div className="bg-bg-[var(--background)] p-5 rounded-xl border border-gray-700 text-gray-400 text-center">
          <h3 className="text-white text-lg mb-2">Upcoming Tasks</h3>
          <p>No upcoming tasks for the next 7 days</p>
        </div>
      </div>
    </div>

    {/* Add Project Modal */}
    <AddProjectModal
      open={showAddProjectModal}
      onClose={() => setShowAddProjectModal(false)}
      onCreate={handleAddProject}
    />
    </div>
  );
}

/* ---------------------
   PROJECT CARD
---------------------- */
function ProjectCard({ label, title, subtitle, members, status, progress, color }) {
  const statusColor = {
    Active: "text-green-400",
    Completed: "text-blue-400",
    "On-hold": "text-yellow-400",
  }[status];

  return (
    <div className="bg-[var(--background)] p-5 rounded-xl border border-gray-700 hover:border-indigo-500/50 transition">
      <div className="flex items-center justify-between mb-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white ${color}`}>
          {label}
        </div>
        <span className={`text-xs font-medium ${statusColor}`}>{status}</span>
      </div>

      <h3 className=" font-semibold text-base">{title}</h3>
      <p className="text-gray-400 text-sm">{subtitle}</p>

      <div className="flex items-center justify-between mt-4 text-gray-400 text-xs">
        <span>{members} members</span>
        <span>{progress}% complete</span>
      </div>

      <div className="w-full bg-gray-700 h-2 mt-2 rounded-full">
        <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${progress}%` }}></div>
      </div>
    </div>
  );
}

/* ---------------------
   STATUS SMALL BADGE
---------------------- */
function Status({ label, value, color }) {
  return (
    <div className="flex flex-col items-center ">
      <div
        className="w-3 h-3 rounded-full mb-1"
        style={{ backgroundColor: color }}
      ></div>
      <span className="text-gray-300">{value} {label}</span>
    </div>
  );
}
