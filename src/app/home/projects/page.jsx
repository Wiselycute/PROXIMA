// "use client";

// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Progress } from "@/components/ui/progress";
// import { Plus, LayoutGrid, List, Trash2, Edit, MoreVertical } from "lucide-react";
// import Image from "next/image";
// import Link from "next/link";
// import Sidebar from "@/components/Sidebar";
// import Topbar from "@/components/Topbar";
// import AddTaskModal from "@/components/Kanban/AddTaskModal";
// import EditTaskModal from "@/components/Kanban/EditTaskModal";
// import DeleteConfirmationModal from "@/components/Kanban/DeleteConfirmationModal";

// export default function ProjectPage() {
//   const [project, setProject] = useState({
//     id: "p-1",
//     name: "Website Redesign",
//     description: "Redesign company website with new branding",
//     progress: 65
//   });

//   const [tasks, setTasks] = useState([
//     { id: "t-1", title: "Content migration", date: "10/25/2023", priority: "Low", column: "todo", description: "" },
//     { id: "t-2", title: "Implement responsive layout", date: "10/18/2023", priority: "Medium", column: "inprogress", description: "" },
//     { id: "t-3", title: "Design homepage mockup", date: "10/15/2023", priority: "High", column: "done", description: "" }
//   ]);

//   const [showAddTask, setShowAddTask] = useState(false);
//   const [showEditTask, setShowEditTask] = useState(false);
//   const [showDeleteTask, setShowDeleteTask] = useState(false);
//   const [selectedTask, setSelectedTask] = useState(null);
//   const [showProjectMenu, setShowProjectMenu] = useState(false);

//   const columns = [
//     { id: "todo", title: "To Do", color: "#4BE2F2" },
//     { id: "inprogress", title: "In Progress", color: "#9B72CF" },
//     { id: "done", title: "Done", color: "#F39ACB" }
//   ];

//   const handleAddTask = (data) => {
//     const newTask = {
//       id: `t-${Date.now()}`,
//       title: data.title,
//       description: data.description || "",
//       date: data.dueDate,
//       priority: data.priority,
//       column: "todo"
//     };
//     setTasks([...tasks, newTask]);
//     setShowAddTask(false);
//   };

//   const handleEditTask = (data) => {
//     setTasks(tasks.map(t => t.id === selectedTask.id ? { ...selectedTask, ...data } : t));
//     setShowEditTask(false);
//     setSelectedTask(null);
//   };

//   const handleDeleteTask = () => {
//     setTasks(tasks.filter(t => t.id !== selectedTask.id));
//     setShowDeleteTask(false);
//     setSelectedTask(null);
//   };

//   const todoTasks = tasks.filter(t => t.column === "todo");
//   const inprogressTasks = tasks.filter(t => t.column === "inprogress");
//   const doneTasks = tasks.filter(t => t.column === "done");

//   return (
//     <>
//     <div className="min-h-screen flex bg-[var(--background)] text-[var(--foreground)]">
//       <Sidebar />
//       <div className="flex-1">
//         <Topbar />
//         <main className="p-8 w-full">
//           <div className="min-h-screen w-full px-6 py-8">
//             {/* HEADER */}
//             <div className="flex flex-col gap-1">
//               <div className="flex items-center justify-between">
//                 <h1 className="text-2xl font-semibold flex items-center gap-2">
//                   {project.name}
//                   <span className="inline-block w-3 h-3 rounded-full bg-[#4BE2F2]"></span>
//                 </h1>
//                 <div className="relative">
//                   <button onClick={() => setShowProjectMenu(!showProjectMenu)} className="p-2 hover:bg-white/10 rounded transition">
//                     <MoreVertical size={20} />
//                   </button>
//                   {showProjectMenu && (
//                     <div className="absolute right-0 mt-2 w-32 bg-[#1B1F36] border border-white/10 rounded-xl shadow-lg z-50">
//                       <button className="w-full text-left px-4 py-2 hover:bg-white/5 flex items-center gap-2 text-sm">
//                         <Edit size={14} /> Edit
//                       </button>
//                       <button className="w-full text-left px-4 py-2 hover:bg-white/5 flex items-center gap-2 text-sm text-red-400">
//                         <Trash2 size={14} /> Delete
//                       </button>
//                     </div>
//                   )}
//                 </div>
//               </div>
//               <p className="text-muted-foreground">
//                 {project.description}
//               </p>
//             </div>

//             {/* TOP BAR BUTTONS */}
//             <div className="flex items-center justify-between mt-5">
//               <div className="w-full max-w-3xl">
//                 <Progress value={project.progress} className="h-3" />
//                 <div className="flex justify-between text-sm mt-1 text-muted-foreground">
//                   <span>Progress</span>
//                   <span>{project.progress}% complete</span>
//                 </div>
//               </div>

//               <div className="flex gap-2">
//                 <Link href="/home/board" className="rounded-xl flex items-center gap-2 px-3 py-2 hover:bg-white/5">
//                   <LayoutGrid size={16} /> Kanban
//                 </Link>
//                 <Link href="/home/projects/project-list" className="rounded-xl flex items-center gap-2 px-3 py-2 hover:bg-white/5">
//                   <List size={16} /> List
//                 </Link>
//                 <Button onClick={() => setShowAddTask(true)} className="rounded-xl bg-[#9B72CF] hover:bg-[#815ab6] text-white flex items-center gap-2">
//                   <Plus size={16} /> Add Task
//                 </Button>
//               </div>
//             </div>

//             {/* MAIN CONTENT */}
//             <div className="mt-8 grid grid-cols-1 lg:grid-cols-4 gap-6">

//               {/* COLUMN PREVIEW SECTION */}
//               <div className="lg:col-span-3 flex gap-4 overflow-x-auto pb-3 scrollbar-hide">
//                 {/* Column Card */}
//                 <ColumnCard
//                   title="To Do"
//                   tasks={todoTasks}
//                   onEditTask={(task) => {
//                     setSelectedTask(task);
//                     setShowEditTask(true);
//                   }}
//                   onDeleteTask={(task) => {
//                     setSelectedTask(task);
//                     setShowDeleteTask(true);
//                   }}
//                 />

//                 <ColumnCard
//                   title="In Progress"
//                   tasks={inprogressTasks}
//                   onEditTask={(task) => {
//                     setSelectedTask(task);
//                     setShowEditTask(true);
//                   }}
//                   onDeleteTask={(task) => {
//                     setSelectedTask(task);
//                     setShowDeleteTask(true);
//                   }}
//                 />

//                 <ColumnCard
//                   title="Done"
//                   tasks={doneTasks}
//                   onEditTask={(task) => {
//                     setSelectedTask(task);
//                     setShowEditTask(true);
//                   }}
//                   onDeleteTask={(task) => {
//                     setSelectedTask(task);
//                     setShowDeleteTask(true);
//                   }}
//                 />
//               </div>

//               {/* TEAM MEMBERS SIDEBAR */}
//               <aside className="rounded-2xl border bg-card p-5 shadow-sm">
//                 <div className="flex items-center justify-between mb-4">
//                   <h2 className="font-semibold text-lg">Team Members</h2>
//                   <button className="text-sm text-[#4BE2F2] hover:underline">+ Add</button>
//                 </div>

//                 <div className="space-y-4">

//                   <TeamMember
//                     name="Alex Morgan"
//                     role="Admin"
//                     status="online"
//                     avatar="/avatars/1.png"
//                   />

//                   <TeamMember
//                     name="Jamie Chen"
//                     role="Member"
//                     status="online"
//                     avatar="/avatars/2.png"
//                   />

//                   <TeamMember
//                     name="Taylor Swift"
//                     role="Member"
//                     status="offline"
//                     avatar="/avatars/3.png"
//                   />

//                 </div>
//               </aside>

//             </div>
//           </div>
//         </main>
//       </div>
//     </div>

//     {/* Modals */}
    
//     <AddTaskModal
//       open={showAddTask}
//       onClose={() => setShowAddTask(false)}
//       onCreate={handleAddTask}
//       columns={[{ _id: "todo", title: "To Do" }]}
//       members={[]}
//     />

//     <EditTaskModal
//       open={showEditTask}
//       onClose={() => setShowEditTask(false)}
//       task={selectedTask}
//       columns={[
//         { _id: "todo", title: "To Do" },
//         { _id: "inprogress", title: "In Progress" },
//         { _id: "done", title: "Done" }
//       ]}
//       members={[]}
//       onSave={handleEditTask}
//     />

//     <DeleteConfirmationModal
//       open={showDeleteTask}
//       onClose={() => setShowDeleteTask(false)}
//       text={`Are you sure you want to delete "${selectedTask?.title}"? This cannot be undone.`}
//       onConfirm={handleDeleteTask}
//     />
//    </>
//   );
// }

// /* COLUMN CARD COMPONENT */
// function ColumnCard({ title, tasks, onEditTask, onDeleteTask }) {
//   return (
//     <div className="min-w-[250px] w-[280px] rounded-xl bg-card border shadow-sm p-4">
//       <div className="flex items-center justify-between mb-4">
//         <h3 className="font-semibold">{title}</h3>
//         <div className="text-sm text-muted-foreground">{tasks.length}</div>
//       </div>

//       {tasks.map((t) => (
//         <div
//           key={t.id}
//           className="group rounded-xl bg-muted p-4 text-sm shadow-sm mb-3 space-y-2 hover:shadow transition"
//         >
//           <div className="flex justify-between items-start gap-2">
//             <p className="font-medium flex-1">{t.title}</p>
//             <div className="opacity-0 group-hover:opacity-100 flex gap-1 transition">
//               <button
//                 onClick={() => onEditTask(t)}
//                 className="p-1 hover:bg-white/20 rounded"
//                 title="Edit"
//               >
//                 <Edit size={14} />
//               </button>
//               <button
//                 onClick={() => onDeleteTask(t)}
//                 className="p-1 hover:bg-red-500/20 rounded"
//                 title="Delete"
//               >
//                 <Trash2 size={14} />
//               </button>
//             </div>
//           </div>

//           <div className="flex justify-between items-center text-xs text-muted-foreground">
//             <p>{t.date}</p>
//             <span
//               className={`px-2 py-1 rounded-lg text-xs ${
//                 t.priority === "Low"
//                   ? "bg-green-200 text-green-700"
//                   : t.priority === "Medium"
//                   ? "bg-yellow-200 text-yellow-700"
//                   : "bg-red-200 text-red-700"
//               }`}
//             >
//               {t.priority}
//             </span>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// }

// /* TEAM MEMBER CARD */
// function TeamMember({ name, role, status, avatar }) {
//   return (
//     <div className="flex items-center justify-between">
//       <div className="flex items-center gap-3">
//         <div className="w-10 h-10 rounded-full overflow-hidden">
//           <Image src={avatar} width={40} height={40} alt={name} />
//         </div>
//         <div>
//           <p className="font-medium">{name}</p>
//           <p className="text-xs text-muted-foreground">{role}</p>
//         </div>
//       </div>

//       <span
//         className={`text-xs px-2 py-1 rounded-full ${
//           status === "online"
//             ? "bg-green-200 text-green-700"
//             : "bg-gray-300 text-gray-700"
//         }`}
//       >
//         {status}
//       </span>
//     </div>
//   );
// }
"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import NeonAnimatedHeader from "@/components/NeonAnimatedHeader";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import AddProjectModal from "@/components/Kanban/AddProjectModal";
import DeleteConfirmationModal from "@/components/Kanban/DeleteConfirmationModal";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { isAdmin } from "@/lib/auth";

const SAMPLE = [];

export default function ProjectListPage() {
  const [projects, setProjects] = useState(SAMPLE);
  const [showAddProjectModal, setShowAddProjectModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [allTasks, setAllTasks] = useState([]);
  const [userIsAdmin, setUserIsAdmin] = useState(false);

  useEffect(() => {
    setUserIsAdmin(isAdmin());
  }, []);
  // const [userIsAdmin, setUserIsAdmin] = useState(false);

  // useEffect(() => {
  //   setUserIsAdmin(isAdmin());
  // }, []);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const [projectsRes, tasksRes] = await Promise.all([
          axios.get("/api/projects"),
          axios.get("/api/tasks")
        ]);
        
        if (!mounted) return;
        
        const tasks = tasksRes.data || [];
        setAllTasks(tasks);
        
        // Calculate task counts and progress for each project
        const projectsList = (projectsRes.data || []).map(p => {
          const projectId = p._id || p.id;
          const projectTasks = tasks.filter(t => 
            (t.projectId?._id || t.projectId) === projectId
          );
          
          const totalTasks = projectTasks.length;
          const completedTasks = projectTasks.filter(t => t.status === "completed").length;
          const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
          
          // Determine status
          let status = "Not Started";
          if (totalTasks > 0) {
            if (completedTasks === totalTasks) {
              status = "Completed";
            } else if (completedTasks > 0) {
              status = "Active";
            } else {
              status = "Active";
            }
          }
          
          return {
            ...p,
            id: projectId,
            tasks: totalTasks,
            progress,
            status
          };
        });
        
        setProjects(projectsList);
      } catch (err) {
        console.error("Failed to load projects", err);
      }
    }
    load();
    return () => { mounted = false; };
  }, []);

  const handleAddProject = async (data) => {
    try {
      const res = await axios.post("/api/projects", data);
      const created = { 
        ...res.data, 
        id: res.data._id || res.data.id,
        tasks: 0,
        progress: 0,
        status: "Not Started"
      };
      setProjects(prev => [...prev, created]);
      setShowAddProjectModal(false);
    } catch (err) {
      console.error("Failed to create project", err);
      alert("Failed to create project");
    }
  };

  const handleDeleteProject = async () => {
    try {
      const id = selectedProject?.id || selectedProject?._id;
      if (!id) return;
      await axios.delete(`/api/projects/${id}`);
      setProjects(prev => prev.filter(p => (p.id || p._id) !== id));
      setShowDeleteConfirm(false);
      setSelectedProject(null);
    } catch (err) {
      console.error("Failed to delete project", err);
      alert("Failed to delete project");
    }
  };
  return (
    <div className="min-h-screen flex bg-[var(--background)] text-[var(--foreground)]">
      <Sidebar />
      <div className="flex-1">
        {/* <Topbar /> */}
        <div className="p-6">
      <NeonAnimatedHeader
        title="Projects"
        subtitle="All active projects and their quick health snapshot"
        rightSlot={
          <div className="flex gap-2">
            <Link href="/home/board" className="px-4 py-2 rounded-xl bg-[#9B72CF] text-white inline-block">Open Board</Link>
            {userIsAdmin && (
              <Button onClick={() => setShowAddProjectModal(true)} className="rounded-xl flex items-center gap-2">
                <Plus size={16} /> New Project
              </Button>
            )}
          </div>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map(p => {
          const statusColor = {
            Active: "text-green-400",
            Completed: "text-blue-400",
            "Not Started": "text-gray-400",
            "On-hold": "text-yellow-400",
          }[p.status] || "text-green-400";
          
          const colors = ["bg-blue-500", "bg-purple-500", "bg-green-500", "bg-pink-500", "bg-indigo-500", "bg-cyan-500"];
          const colorClass = p.color || colors[Math.floor(Math.random() * colors.length)];
          const label = (p.name || "P").charAt(0).toUpperCase();

          return (
            <div key={p.id || p._id} className="group bg-[var(--background)] p-5 rounded-xl border border-gray-700 hover:border-indigo-500/50 transition relative">
              <Link href={`/home/projects/${p.id || p._id}`} className="block">
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold ${colorClass}`}>
                    {label}
                  </div>
                  <span className={`text-xs font-medium ${statusColor}`}>{p.status || "Active"}</span>
                </div>

                <h3 className="font-semibold text-base">{p.name}</h3>
                <p className="text-gray-400 text-sm mt-1">{p.description || "No description"}</p>

                <div className="flex items-center justify-between mt-4 text-gray-400 text-xs">
                  <span>{p.tasks || 0} {p.tasks === 1 ? 'task' : 'tasks'}</span>
                  <span>{p.progress || 0}% complete</span>
                </div>

                <div className="mt-3 h-2 rounded-full bg-gray-800 overflow-hidden">
                  <div 
                    style={{ width: `${p.progress || 0}%` }} 
                    className={`h-full rounded-full transition-all ${colorClass}`}
                  />
                </div>
              </Link>
              
              {userIsAdmin && (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectedProject(p);
                    setShowDeleteConfirm(true);
                  }}
                  className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 p-2 hover:bg-red-500/20 rounded-lg transition"
                  title="Delete project"
                >
                  <Trash2 size={16} className="text-red-400" />
                </button>
              )}
            </div>
          );
        })}
        </div>

        <AddProjectModal
          open={showAddProjectModal}
          onClose={() => setShowAddProjectModal(false)}
          onCreate={handleAddProject}
        />

        <DeleteConfirmationModal
          open={showDeleteConfirm}
          onClose={() => setShowDeleteConfirm(false)}
          text={`Are you sure you want to delete the project "${selectedProject?.name}"? All tasks will be deleted. This cannot be undone.`}
          onConfirm={handleDeleteProject}
        />
        </div>
      </div>
    </div>
  );
}
