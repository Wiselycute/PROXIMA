
"use client";

import { useState, useEffect } from "react";
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
import api from "@/lib/api";
import { isAdmin } from "@/lib/auth";
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
  const [projects, setProjects] = useState([]);
  const [stats, setStats] = useState({ tasks: 0, teams: 0, completed: 0, users: 0 });
  const [allTasks, setAllTasks] = useState([]);
  const [user, setUser] = useState(null);
  const [userIsAdmin, setUserIsAdmin] = useState(false);

  // Load user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setUserIsAdmin(isAdmin());
  }, []);

  const handleAddProject = async (data) => {
    try {
      const res = await api.post("/projects", { name: data.name, description: data.description });
      const created = res.data;
      setProjects((p) => [
        ...p,
        {
          id: created._id || created.id,
          label: (created.name || data.name).charAt(0).toUpperCase(),
          title: created.name || data.name,
          subtitle: created.description || data.description || "",
          totalTasks: 0,
          status: "Not Started",
          progress: 0,
          color: ["bg-blue-500", "bg-purple-500", "bg-green-500"][Math.floor(Math.random() * 3)],
        },
      ]);
    } catch (err) {
      console.warn("Failed to create project", err);
    }
  };

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const [pjRes, tRes, uRes] = await Promise.all([api.get("/projects"), api.get("/tasks"), api.get("/users")]);
        if (!mounted) return;
        const pj = pjRes.data || [];
        const tasks = tRes.data || [];
        const users = uRes.data || [];
        
        // Calculate stats based on task status
        const completedCount = tasks.filter((t) => t.status === "completed").length;
        const inProgressCount = tasks.filter((t) => t.status === "in-progress").length;
        const todoCount = tasks.filter((t) => t.status === "todo" || !t.status).length;
        
        // Calculate completion status for each project
        const projectsWithStatus = pj.map((p) => {
          const projectId = p._id || p.id;
          const projectTasks = tasks.filter(t => (t.projectId?._id || t.projectId) === projectId);
          const totalTasks = projectTasks.length;
          const completedTasks = projectTasks.filter(t => t.status === "completed").length;
          const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
          
          // Determine status based on progress
          let status = "Active";
          if (progress === 100 && totalTasks > 0) {
            status = "Completed";
          } else if (progress === 0) {
            status = "Not Started";
          }
          
          return { 
            id: projectId, 
            label: (p.name || "P").charAt(0).toUpperCase(), 
            title: p.name || p.title, 
            subtitle: p.description || "", 
            totalTasks: totalTasks, 
            status: status, 
            progress: progress, 
            color: "bg-indigo-500" 
          };
        });
        
        setProjects(projectsWithStatus);
        
        setStats({ 
          tasks: tasks.length, 
          teams: (pj.length || 0), 
          completed: completedCount, 
          users: users.length,
          inProgress: inProgressCount,
          todo: todoCount
        });
        
        setAllTasks(tasks);
      } catch (err) {
        console.warn("Dashboard data load failed, using defaults", err);
        // fallback minimal defaults
        setProjects([]);
        setStats({ tasks: 0, teams: 0, completed: 0, users: 0, inProgress: 0, todo: 0 });
      }
    }
    load();
    return () => { mounted = false; };
  }, []);

  // Build chart data from tasks: last 12 months
  const getLast12Months = () => {
    const months = [];
    const now = new Date();
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push(d.toLocaleString(undefined, { month: "short" }));
    }
    return months;
  };

  const months = getLast12Months();

  const completedSeries = new Array(12).fill(0);
  const inprogressSeries = new Array(12).fill(0);

  allTasks.forEach((t) => {
    const created = new Date(t.createdAt || t.created_at || t.created || Date.now());
    const monthIndex = (created.getFullYear() - new Date().getFullYear()) === 0
      ? (created.getMonth() - new Date().getMonth() + 11) * 0 + created.getMonth()
      : created.getMonth();
    // normalize month index into 0-11 relative to months array (approximate)
    const diffMonths = (new Date().getFullYear() - created.getFullYear()) * 12 + (new Date().getMonth() - created.getMonth());
    const idx = 11 - Math.min(11, Math.max(0, diffMonths));

    const isDone = t.status === "completed";
    if (isDone) completedSeries[idx] += 1; else inprogressSeries[idx] += 1;
  });

  const lineData = {
    labels: months,
    datasets: [
      {
        label: "Completed",
        data: completedSeries,
        tension: 0.4,
        borderWidth: 3,
        borderColor: "rgba(84,112,255,1)",
        pointBackgroundColor: "rgba(84,112,255,1)",
      },
      {
        label: "In Progress",
        data: inprogressSeries,
        tension: 0.4,
        borderWidth: 3,
        borderColor: "rgba(0,204,153,1)",
        pointBackgroundColor: "rgba(0,204,153,1)",
      },
    ],
  };

  // donut: breakdown by status
  const statusCounts = {
    "To Do": allTasks.filter(t => t.status === "todo" || !t.status).length,
    "In Progress": allTasks.filter(t => t.status === "in-progress").length,
    "Done": allTasks.filter(t => t.status === "completed").length
  };
  
  const donutLabels = Object.keys(statusCounts);
  const donutValues = Object.values(statusCounts);
  const palette = ["#F4A261", "#4A90E2", "#2ECC71"];
  const donutData = {
    labels: donutLabels,
    datasets: [{ data: donutValues, backgroundColor: palette, borderWidth: 0 }],
  };

  return (
    <div className="min-h-screen  flex bg-[var(--background)] text-[var(--foreground)]">
      <Sidebar />
      <div className="flex-1">
        <Topbar />

      {/* Header */}
      <div className="flex flex-col bg-[var(--background)] sticky top-0 z-10 sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-white p-4">
            Dashboard
          </h1>
          {user && (
            <p className="text-sm text-gray-400 px-4">
              Welcome back, <span className="font-semibold text-white">{user.name}</span>
            </p>
          )}
        </div>

        <div className="flex bg-[var(--background)] flex-col sm:flex-row gap-3  sm:items-center">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="bg-[var(--background)] w-full pl-9 pr-3 py-2 rounded-lg border border-gray-700 text-sm text-gray-300 focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {userIsAdmin && (
            <button onClick={() => setShowAddProjectModal(true)} className="bg-[#5A62EA] hover:bg-[#7077FF] transition px-4 py-2 rounded-lg flex items-center gap-2 text-white text-sm w-full sm:w-auto">
              <Plus size={16} /> New Project
            </button>
          )}
        </div>
      </div>

         {/* stat card */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 flex bg-[var(--background)] mx-6 ">
              <StatCard label="Active tasks" value={stats.tasks} delay={0.05} />
              <StatCard label="Projects" value={stats.teams} delay={0.1} />
              <StatCard label="Completed" value={stats.completed} delay={0.15} />
              <StatCard label="Users" value={stats.users} delay={0.2} />
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
            <Status label="To Do" value={statusCounts["To Do"]} color="#F4A261" />
            <Status label="In Progress" value={statusCounts["In Progress"]} color="#4A90E2" />
            <Status label="Done" value={statusCounts["Done"]} color="#2ECC71" />
          </div>
        </div>
        
      </div>
       {/* Project Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3p-4 sm:p-6 space-y-4 w-full gap-4">
        {projects.map((p) => (
          <ProjectCard
            key={p.id}
            label={p.label}
            title={p.title}
            subtitle={p.subtitle}
            totalTasks={p.totalTasks}
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
function ProjectCard({ label, title, subtitle, totalTasks, status, progress, color }) {
  const statusColor = {
    Active: "text-green-400",
    Completed: "text-blue-400",
    "Not Started": "text-gray-400",
    "On-hold": "text-yellow-400",
  }[status] || "text-green-400";

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
        <span>{totalTasks || 0} {totalTasks === 1 ? 'task' : 'tasks'}</span>
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
