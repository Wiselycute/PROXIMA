// "use client";
// import { useState } from "react";
// import Link from "next/link";
// import NeonAnimatedHeader from "@/components/NeonAnimatedHeader";
// import Sidebar from "@/components/Sidebar";
// import Topbar from "@/components/Topbar";
// import AddProjectModal from "@/components/Kanban/AddProjectModal";
// import DeleteConfirmationModal from "@/components/Kanban/DeleteConfirmationModal";
// import { Button } from "@/components/ui/button";
// import { Plus, Trash2 } from "lucide-react";

// const SAMPLE = [
//   { id: "p-1", name: "Website Redesign", tasks: 12, progress: 65, color: "#9B72CF" },
//   { id: "p-2", name: "Mobile App", tasks: 7, progress: 42, color: "#4BE2F2" },
//   { id: "p-3", name: "Marketing Campaign", tasks: 4, progress: 90, color: "#F39ACB" }
// ];

// export default function ProjectListPage() {
//   const [projects, setProjects] = useState(SAMPLE);
//   const [showAddProjectModal, setShowAddProjectModal] = useState(false);
//   const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
//   const [selectedProject, setSelectedProject] = useState(null);

//   const handleAddProject = (data) => {
//     const newProject = {
//       id: `p-${Date.now()}`,
//       name: data.name,
//       description: data.description,
//       tasks: 0,
//       progress: 0,
//       color: ["#9B72CF", "#4BE2F2", "#F39ACB"][Math.floor(Math.random() * 3)]
//     };
//     setProjects([...projects, newProject]);
//   };

//   const handleDeleteProject = () => {
//     setProjects(projects.filter(p => p.id !== selectedProject.id));
//     setShowDeleteConfirm(false);
//     setSelectedProject(null);
//   };
//   return (
//     <div className="min-h-screen flex bg-[var(--background)] text-[var(--foreground)]">
//       <Sidebar />
//       <div className="flex-1">
//         <Topbar />
//         <div className="p-6">
//       <NeonAnimatedHeader
//         title="Projects"
//         subtitle="All active projects and their quick health snapshot"
//         rightSlot={
//           <div className="flex gap-2">
//             <Link href="/home/board" className="px-4 py-2 rounded-xl bg-[#9B72CF] text-white inline-block">Open Board</Link>
//             <Button onClick={() => setShowAddProjectModal(true)} className="rounded-xl flex items-center gap-2">
//               <Plus size={16} /> New Project
//             </Button>
//           </div>
//         }
//       />

//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//         {projects.map(p => (
//           <div key={p.id} className="group rounded-2xl p-5 bg-card border hover:shadow-lg transition relative">
//             <Link href={`/project/${p.id}`} className="block">
//               <div className="flex justify-between items-start">
//                 <h3 className="font-semibold text-lg">{p.name}</h3>
//                 <div className="text-sm text-muted-foreground">{p.tasks} tasks</div>
//               </div>

//               <div className="mt-4">
//                 <div className="h-2 rounded-full bg-white/5 overflow-hidden">
//                   <div style={{ width: `${p.progress}%`, background: p.color }} className="h-full rounded-full transition" />
//                 </div>
//                 <div className="mt-2 text-xs text-muted-foreground">{p.progress}% complete</div>
//               </div>
//             </Link>
            
//             <button
//               onClick={(e) => {
//                 e.preventDefault();
//                 setSelectedProject(p);
//                 setShowDeleteConfirm(true);
//               }}
//               className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 p-2 hover:bg-red-500/20 rounded transition"
//               title="Delete project"
//             >
//               <Trash2 size={18} className="text-red-400" />
//             </button>
//           </div>
//         ))}
//         </div>

//         <AddProjectModal
//           open={showAddProjectModal}
//           onClose={() => setShowAddProjectModal(false)}
//           onCreate={handleAddProject}
//         />

//         <DeleteConfirmationModal
//           open={showDeleteConfirm}
//           onClose={() => setShowDeleteConfirm(false)}
//           text={`Are you sure you want to delete the project "${selectedProject?.name}"? All tasks will be deleted. This cannot be undone.`}
//           onConfirm={handleDeleteProject}
//         />
//         </div>
//       </div>
//     </div>
//   );
// }


"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Plus, LayoutGrid, List, Trash2, Edit, MoreVertical } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import AddTaskModal from "@/components/Kanban/AddTaskModal";
import EditTaskModal from "@/components/Kanban/EditTaskModal";
import DeleteConfirmationModal from "@/components/Kanban/DeleteConfirmationModal";
import { useParams } from "next/navigation";
import axios from "axios";

export default function ProjectPage() {
  const params = useParams();
  const projectId = params?.id;
  const [project, setProject] = useState(null);

  useEffect(() => {
    if (!projectId) return;
    let mounted = true;
    async function load() {
      try {
        const res = await axios.get(`/api/projects/${projectId}`);
        if (!mounted) return;
        setProject(res.data);
      } catch (err) {
        console.error("Failed to load project", err);
      }
    }
    load();
    return () => { mounted = false; };
  }, [projectId]);

  const [tasks, setTasks] = useState([]);

  // load tasks for this project
  useEffect(() => {
    if (!projectId) return;
    let mounted = true;
    async function loadTasks() {
      try {
        const res = await axios.get(`/api/tasks?projectId=${encodeURIComponent(projectId)}`);
        if (!mounted) return;
        const list = res.data.map(t => ({ ...t, id: t._id || t.id }));
        setTasks(list);
      } catch (err) {
        console.error("Failed to load tasks", err);
      }
    }
    loadTasks();
    return () => { mounted = false; };
  }, [projectId]);

  const [showAddTask, setShowAddTask] = useState(false);
  const [showEditTask, setShowEditTask] = useState(false);
  const [showDeleteTask, setShowDeleteTask] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showProjectMenu, setShowProjectMenu] = useState(false);

  const columns = [
    { id: "todo", title: "To Do", color: "#4BE2F2" },
    { id: "inprogress", title: "In Progress", color: "#9B72CF" },
    { id: "done", title: "Done", color: "#F39ACB" }
  ];

  const handleAddTask = async (data) => {
  try {
    const payload = {
      title: data.title,
      description: data.description || "",
      dueDate: data.dueDate,
      priority: data.priority,
      columnId: data.columnId,
      projectId,
      assignees: data.assignees || []
    };

    const res = await axios.post("/api/tasks", payload);
    const created = { ...res.data, id: res.data._id };

    setTasks(prev => [...prev, created]);
    setShowAddTask(false);
  } catch (err) {
    console.error(err);
    alert("Failed to create task");
  }
};

  const handleEditTask = (data) => {
    (async () => {
      try {
        const id = data.id || selectedTask?.id || selectedTask?._id;
        if (!id) return;
        const payload = {
          title: data.title,
          description: data.description,
          dueDate: data.dueDate,
          priority: data.priority,
          columnId: data.columnId,
          assignees: data.assignees || data.assignees || []
        };
        const res = await axios.put(`/api/tasks/${id}`, payload);
        const updated = { ...res.data, id: res.data._id || res.data.id };
        setTasks(prev => prev.map(t => (t.id === updated.id || t._id === updated.id ? updated : t)));
        setShowEditTask(false);
        setSelectedTask(null);
      } catch (err) {
        console.error('Failed to update task', err);
        alert('Failed to update task');
      }
    })();
  };

  const handleDeleteTask = () => {
    (async () => {
      try {
        const id = selectedTask?.id || selectedTask?._id;
        if (!id) return;
        await axios.delete(`/api/tasks/${id}`);
        setTasks(prev => prev.filter(t => (t.id || t._id) !== id));
        setShowDeleteTask(false);
        setSelectedTask(null);
      } catch (err) {
        console.error('Failed to delete task', err);
        alert('Failed to delete task');
      }
    })();
  };

  const todoTasks = tasks.filter(t => t.columnId === "todo");
  const inprogressTasks = tasks.filter(t => t.columnId === "inprogress");
  const doneTasks = tasks.filter(t => t.columnId === "done");

  return (
    <>
    <div className="min-h-screen flex bg-[var(--background)] text-[var(--foreground)]">
      <Sidebar />
      <div className="flex-1">
        <Topbar />
        <main className="p-8 w-full">
          <div className="min-h-screen w-full px-6 py-8">
            {/* HEADER */}
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold flex items-center gap-2">
                  {project?.name || "Loading..."}
                  <span className="inline-block w-3 h-3 rounded-full bg-[#4BE2F2]"></span>
                </h1>
                <div className="relative">
                  <button onClick={() => setShowProjectMenu(!showProjectMenu)} className="p-2 hover:bg-white/10 rounded transition">
                    <MoreVertical size={20} />
                  </button>
                  {showProjectMenu && (
                    <div className="absolute right-0 mt-2 w-32 bg-[#1B1F36] border border-white/10 rounded-xl shadow-lg z-50">
                      <button className="w-full text-left px-4 py-2 hover:bg-white/5 flex items-center gap-2 text-sm">
                        <Edit size={14} /> Edit
                      </button>
                      <button className="w-full text-left px-4 py-2 hover:bg-white/5 flex items-center gap-2 text-sm text-red-400">
                        <Trash2 size={14} /> Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <p className="text-muted-foreground">{project?.description}</p>
            </div>

            {/* TOP BAR BUTTONS */}
            <div className="flex items-center justify-between mt-5">
              <div className="w-full max-w-3xl">
                <Progress value={project?.progress || 0} className="h-3" />
                <div className="flex justify-between text-sm mt-1 text-muted-foreground">
                  <span>Progress</span>
                  <span>{project?.progress ?? 0}% complete</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Link href="/home/board" className="rounded-xl flex items-center gap-2 px-3 py-2 hover:bg-white/5">
                  <LayoutGrid size={16} /> Kanban
                </Link>
                <Link href="/home/projects/project-list" className="rounded-xl flex items-center gap-2 px-3 py-2 hover:bg-white/5">
                  <List size={16} /> List
                </Link>
                <Button onClick={() => setShowAddTask(true)} className="rounded-xl bg-[#9B72CF] hover:bg-[#815ab6] text-white flex items-center gap-2">
                  <Plus size={16} /> Add Task
                </Button>
              </div>
            </div>

            {/* MAIN CONTENT */}
            <div className="mt-8 grid grid-cols-1 lg:grid-cols-4 gap-6">

              {/* COLUMN PREVIEW SECTION */}
              <div className="lg:col-span-3 flex gap-4 overflow-x-auto pb-3 scrollbar-hide">
                {/* Column Card */}
                <ColumnCard
                  title="To Do"
                  tasks={todoTasks}
                  onEditTask={(task) => {
                    setSelectedTask(task);
                    setShowEditTask(true);
                  }}
                  onDeleteTask={(task) => {
                    setSelectedTask(task);
                    setShowDeleteTask(true);
                  }}
                />

                <ColumnCard
                  title="In Progress"
                  tasks={inprogressTasks}
                  onEditTask={(task) => {
                    setSelectedTask(task);
                    setShowEditTask(true);
                  }}
                  onDeleteTask={(task) => {
                    setSelectedTask(task);
                    setShowDeleteTask(true);
                  }}
                />

                <ColumnCard
                  title="Done"
                  tasks={doneTasks}
                  onEditTask={(task) => {
                    setSelectedTask(task);
                    setShowEditTask(true);
                  }}
                  onDeleteTask={(task) => {
                    setSelectedTask(task);
                    setShowDeleteTask(true);
                  }}
                />
              </div>

              {/* TEAM MEMBERS SIDEBAR */}
              <aside className="rounded-2xl border bg-card p-5 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold text-lg">Team Members</h2>
                  <button className="text-sm text-[#4BE2F2] hover:underline">+ Add</button>
                </div>

                <div className="space-y-4">

                  <TeamMember
                    name="Alex Morgan"
                    role="Admin"
                    status="online"
                    avatar="/avatars/1.png"
                  />

                  <TeamMember
                    name="Jamie Chen"
                    role="Member"
                    status="online"
                    avatar="/avatars/2.png"
                  />

                  <TeamMember
                    name="Taylor Swift"
                    role="Member"
                    status="offline"
                    avatar="/avatars/3.png"
                  />

                </div>
              </aside>

            </div>
          </div>
        </main>
      </div>
    </div>

    {/* Modals */}
    
    <AddTaskModal
  open={showAddTask}
  onClose={() => setShowAddTask(false)}
  onCreate={handleAddTask}
  projectId={projectId}
  defaultColumnId="todo"
  columns={[
    { _id: "todo", title: "To Do" },
    { _id: "inprogress", title: "In Progress" },
    { _id: "done", title: "Done" }
  ]}
  members={[]}
/>

    <EditTaskModal
      open={showEditTask}
      onClose={() => setShowEditTask(false)}
      task={selectedTask}
      columns={[
        { _id: "todo", title: "To Do" },
        { _id: "inprogress", title: "In Progress" },
        { _id: "done", title: "Done" }
      ]}
      members={[]}
      onSave={handleEditTask}
    />

    <DeleteConfirmationModal
      open={showDeleteTask}
      onClose={() => setShowDeleteTask(false)}
      text={`Are you sure you want to delete "${selectedTask?.title}"? This cannot be undone.`}
      onConfirm={handleDeleteTask}
    />
   </>
  );
}

/* COLUMN CARD COMPONENT */
function ColumnCard({ title, tasks, onEditTask, onDeleteTask }) {
  return (
    <div className="min-w-[250px] w-[280px] rounded-xl bg-card border shadow-sm p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">{title}</h3>
        <div className="text-sm text-muted-foreground">{tasks.length}</div>
      </div>

      {tasks.map((t) => (
        <div
          key={t.id}
          className="group rounded-xl bg-muted p-4 text-sm shadow-sm mb-3 space-y-2 hover:shadow transition"
        >
          <div className="flex justify-between items-start gap-2">
            <p className="font-medium flex-1">{t.title}</p>
            <div className="opacity-0 group-hover:opacity-100 flex gap-1 transition">
              <button
                onClick={() => onEditTask(t)}
                className="p-1 hover:bg-white/20 rounded"
                title="Edit"
              >
                <Edit size={14} />
              </button>
              <button
                onClick={() => onDeleteTask(t)}
                className="p-1 hover:bg-red-500/20 rounded"
                title="Delete"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>

          <div className="flex justify-between items-center text-xs text-muted-foreground">
            <p>{t.date}</p>
            <span
              className={`px-2 py-1 rounded-lg text-xs ${
                t.priority === "Low"
                  ? "bg-green-200 text-green-700"
                  : t.priority === "Medium"
                  ? "bg-yellow-200 text-yellow-700"
                  : "bg-red-200 text-red-700"
              }`}
            >
              {t.priority}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

/* TEAM MEMBER CARD */
function TeamMember({ name, role, status, avatar }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full overflow-hidden">
          <Image src={avatar} width={40} height={40} alt={name} />
        </div>
        <div>
          <p className="font-medium">{name}</p>
          <p className="text-xs text-muted-foreground">{role}</p>
        </div>
      </div>

      <span
        className={`text-xs px-2 py-1 rounded-full ${
          status === "online"
            ? "bg-green-200 text-green-700"
            : "bg-gray-300 text-gray-700"
        }`}
      >
        {status}
      </span>
    </div>
  );
}