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

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Plus, ArrowLeft, Users as UsersIcon, Calendar, TrendingUp, CheckCircle2, Clock, Circle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import { useParams } from "next/navigation";
import api from "@/lib/api";
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
} from "@dnd-kit/sortable";
import Column from "@/components/Kanban/Column";
import AddTaskModal from "@/components/Kanban/AddTaskModal";
import ProjectProgress from "@/components/ProjectProgress";

export default function ProjectDetailPage() {
  const params = useParams();
  const projectId = params?.id;
  const [project, setProject] = useState(null);
  const [board, setBoard] = useState({
    columns: {},
    tasks: {},
    columnOrder: []
  });
  const [activeId, setActiveId] = useState(null);
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [selectedColumnForNewTask, setSelectedColumnForNewTask] = useState("todo");
  const [progressRefresh, setProgressRefresh] = useState(0);
  const [members, setMembers] = useState([]);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));

  // Load project details
  useEffect(() => {
    if (!projectId) return;
    let mounted = true;
    async function load() {
      try {
        const res = await api.get(`/projects/${projectId}`);
        if (!mounted) return;
        setProject(res.data);
      } catch (err) {
        console.error("Failed to load project", err);
      }
    }
    load();
    return () => { mounted = false; };
  }, [projectId]);

  // Load board data (columns and tasks for this project)
  useEffect(() => {
    if (!projectId) return;
    let mounted = true;
    async function loadBoard() {
      try {
        const tasksRes = await api.get(`/tasks?projectId=${projectId}`);
        if (!mounted) return;

        const tasks = tasksRes.data || [];

        console.log(`Loaded ${tasks.length} tasks for project ${projectId}`, tasks);

        // Create default columns
        const columns = {
          "todo": { id: "todo", title: "To Do", taskIds: [] },
          "in-progress": { id: "in-progress", title: "In Progress", taskIds: [] },
          "done": { id: "done", title: "Done", taskIds: [] }
        };
        const columnOrder = ["todo", "in-progress", "done"];

        const tasksMap = {};
        
        tasks.forEach((t) => {
          const id = t._id || t.id;
          const status = t.status || "todo";
          
          // Map status to column
          let colId;
          if (status === "completed" || status === "done") {
            colId = "done";
          } else if (status === "in-progress") {
            colId = "in-progress";
          } else {
            colId = "todo";
          }
          
          tasksMap[id] = {
            id,
            title: t.title || "Untitled",
            desc: t.description || "",
            assignees: t.assignees || [],
            due: t.dueDate || null,
            comments: t.comments || [],
            priority: t.priority || "low",
            columnId: colId,
            status: status,
            _id: t._id
          };

          // Add task to the appropriate column
          columns[colId].taskIds.push(id);
        });

        console.log("Board state:", { 
          columns, 
          tasks: tasksMap, 
          columnOrder, 
          taskCount: tasks.length,
          todoCount: columns.todo.taskIds.length,
          inProgressCount: columns["in-progress"].taskIds.length,
          doneCount: columns.done.taskIds.length
        });
        
        setBoard({ columns, tasks: tasksMap, columnOrder });
      } catch (err) {
        console.error("Failed to load board", err);
      }
    }
    loadBoard();
    return () => { mounted = false; };
  }, [projectId, progressRefresh]);

  // Load team members
  useEffect(() => {
    let mounted = true;
    api.get("/users").then((res) => {
      if (!mounted) return;
      setMembers(res.data || []);
    }).catch(() => {});
    return () => { mounted = false; };
  }, []);

  const findColumnForTask = useCallback(
    (taskId) => Object.values(board.columns).find((c) => c.taskIds.includes(taskId))?.id,
    [board]
  );

  function handleDragStart(event) {
    setActiveId(event.active.id);
  }

  function handleDragEnd(event) {
    const { active, over } = event;
    setActiveId(null);
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    const sourceColId = findColumnForTask(activeId);
    const destColId = findColumnForTask(overId) || overId;
    if (!sourceColId || !destColId) return;

    if (sourceColId === destColId) {
      const col = board.columns[sourceColId];
      if (!col || !col.taskIds) return;
      
      const oldIndex = col.taskIds.indexOf(activeId);
      const newIndex = col.taskIds.indexOf(overId);
      if (oldIndex !== newIndex) {
        const newTaskIds = arrayMove(col.taskIds, oldIndex, newIndex);
        setBoard((prev) => ({
          ...prev,
          columns: { ...prev.columns, [sourceColId]: { ...col, taskIds: newTaskIds } },
        }));
      }
      return;
    }

    // Moving between columns
    const source = board.columns[sourceColId];
    const dest = board.columns[destColId];
    if (!source || !dest || !source.taskIds || !dest.taskIds) return;
    const newSourceIds = source.taskIds.filter((id) => id !== activeId);

    let insertAt = dest.taskIds.length;
    const overIndex = dest.taskIds.indexOf(overId);
    if (overIndex !== -1) insertAt = overIndex;

    const newDestIds = [...dest.taskIds.slice(0, insertAt), activeId, ...dest.taskIds.slice(insertAt)];

    // Map column IDs to status
    const getStatusFromColumnId = (colId) => {
      const col = board.columns[colId];
      if (!col) return "todo";
      const title = col.title.toLowerCase();
      if (title.includes("progress") || title.includes("doing")) return "in-progress";
      if (title.includes("done") || title.includes("complete")) return "completed";
      return "todo";
    };

    const newStatus = getStatusFromColumnId(destColId);
    
    setBoard((prev) => ({
      ...prev,
      tasks: {
        ...prev.tasks,
        [activeId]: {
          ...prev.tasks[activeId],
          status: newStatus,
          columnId: destColId
        }
      },
      columns: {
        ...prev.columns,
        [sourceColId]: { ...source, taskIds: newSourceIds },
        [destColId]: { ...dest, taskIds: newDestIds },
      },
    }));

    // Update on server
    if (!activeId.toString().startsWith('t-')) {
      (async () => {
        try {
          const user = JSON.parse(localStorage.getItem("user") || "{}");
          const updatePayload = { 
            columnId: destColId,
            status: newStatus
          };
          
          // Add completion metadata if moving to completed
          if (newStatus === "completed") {
            updatePayload.completedAt = new Date().toISOString();
            updatePayload.completedBy = user.id;
          } else {
            updatePayload.completedAt = null;
            updatePayload.completedBy = null;
          }
          
          await api.put(`/tasks/${activeId}`, updatePayload);
          setProgressRefresh(prev => prev + 1);
        } catch (err) {
          console.warn("Failed to persist task move", err);
        }
      })();
    }
  }

  async function handleAddTask(data) {
    try {
      // Validate projectId
      if (!projectId) {
        console.error("No project ID available");
        alert("Cannot create task: No project ID");
        return;
      }

      // Map column ID to status
      let status = "todo";
      if (data.columnId === "in-progress") {
        status = "in-progress";
      } else if (data.columnId === "done") {
        status = "completed";
      }

      const payload = {
        title: data.title,
        description: data.description || "",
        assignees: data.assignees || [],
        dueDate: data.dueDate || null,
        priority: data.priority || "medium",
        status: status,
        projectId,
      };

      console.log("Creating task with payload:", payload);
      
      const res = await api.post("/tasks", payload);
      const t = res.data;

      console.log("Task created:", t);

      // Refresh the board to reload all tasks from the server
      setProgressRefresh(prev => prev + 1);
      setTaskModalOpen(false);
    } catch (err) {
      console.error("Failed to create task", err);
      alert("Failed to create task: " + (err.response?.data?.message || err.message));
    }
  }

  function updateTask(taskId, patch) {
    setBoard((prev) => {
      if (!prev.tasks[taskId]) {
        console.warn("Task not found:", taskId);
        return prev;
      }
      
      return {
        ...prev,
        tasks: { ...prev.tasks, [taskId]: { ...prev.tasks[taskId], ...patch } }
      };
    });

    if (!taskId.toString().startsWith('t-')) {
      (async () => {
        try {
          await api.put(`/tasks/${taskId}`, patch);
          if (patch.status) {
            setProgressRefresh(prev => prev + 1);
          }
        } catch (err) {
          console.warn("Failed to update task", err);
        }
      })();
    }
  }

  async function deleteTask(taskId) {
    if (!taskId.toString().startsWith('t-')) {
      try {
        await api.delete(`/tasks/${taskId}`);
        setProgressRefresh(prev => prev + 1);
      } catch (err) {
        console.warn("Failed to delete task", err);
      }
    }

    setBoard((prev) => {
      const newTasks = { ...prev.tasks };
      delete newTasks[taskId];
      const newCols = { ...prev.columns };
      Object.keys(newCols).forEach((cid) => {
        if (newCols[cid] && newCols[cid].taskIds) {
          newCols[cid] = {
            ...newCols[cid],
            taskIds: newCols[cid].taskIds.filter((id) => id !== taskId)
          };
        }
      });
      return { ...prev, tasks: newTasks, columns: newCols };
    });
  }

  const completedTasks = Object.values(board.tasks).filter(t => t.status === "completed").length;
  const totalTasks = Object.values(board.tasks).length;
  const inProgressTasks = Object.values(board.tasks).filter(t => t.status === "in-progress").length;
  const todoTasks = Object.values(board.tasks).filter(t => t.status === "todo").length;
  const progressPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="min-h-screen flex bg-[var(--background)] text-foreground">
      <Sidebar />
      <div className="flex-1 overflow-hidden bg-[var(--background)]">
        <Topbar />
        <main className="h-[calc(100vh-4rem)] overflow-y-auto">
          <div className="max-w-[1800px] mx-auto p-6 lg:p-8 space-y-6">
            
            {/* Header Section */}
            <div className="rounded-lg bg-[var(--background)]  p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <Link href="/home/projects">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="rounded-lg bg-[var(--background)] hover:bg-gray-600"
                    >
                      <ArrowLeft size={20} />
                    </Button>
                  </Link>
                  <div>
                    <h1 className="text-3xl font-bold ">
                      {project?.name || "Loading..."}
                    </h1>
                    <p className="text-gray-400 mt-1">{project?.description || "No description"}</p>
                  </div>
                </div>
                <Button
                  onClick={() => {
                    setSelectedColumnForNewTask(board.columnOrder[0] || "todo");
                    setTaskModalOpen(true);
                  }}
                  className="bg-purple-600 hover:bg-purple-700 text-white rounded-lg px-6 py-2"
                >
                  <Plus size={18} /> <span className="ml-2">New Task</span>
                </Button>
              </div>

              {/* Quick Stats Row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div className="bg-[var(--background)] rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-blue-600 flex items-center justify-center">
                      <CheckCircle2 className="text-white" size={24} />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-white">{totalTasks}</div>
                      <div className="text-sm text-gray-400">Total Tasks</div>
                    </div>
                  </div>
                </div>

                <div className="bg-[var(--background)] rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-green-600 flex items-center justify-center">
                      <CheckCircle2 className="text-white" size={24} />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-white">{completedTasks}</div>
                      <div className="text-sm text-gray-400">Completed</div>
                    </div>
                  </div>
                </div>

                <div className="bg-[var(--background)] rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-purple-600 flex items-center justify-center">
                      <TrendingUp className="text-white" size={24} />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-white">{progressPercentage}%</div>
                      <div className="text-sm text-gray-400">Progress</div>
                    </div>
                  </div>
                </div>

                <div className="bg-[var(--background)] rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-orange-600 flex items-center justify-center">
                      <UsersIcon className="text-white" size={24} />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-white">{members.length}</div>
                      <div className="text-sm text-gray-400">Team Members</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Progress Section */}
            <div className="bg-[var(--background)] p-4 rounded-lg ">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Overall Progress</h3>
                <span className="text-2xl font-bold text-white">{progressPercentage}%</span>
              </div>
              <div className="relative w-full h-3 bg-gray-700 rounded-full overflow-hidden mb-4">
                <div 
                  className="absolute inset-y-0 left-0 bg-purple-600 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-3 rounded-lg bg-[var(--background)]">
                  <div className="text-2xl font-bold text-green-400">{completedTasks}</div>
                  <div className="text-xs text-gray-400 mt-1">Completed</div>
                </div>
                <div className="text-center p-3 rounded-lg bg-[var(--background)]">
                  <div className="text-2xl font-bold text-blue-400">{inProgressTasks}</div>
                  <div className="text-xs text-gray-400 mt-1">In Progress</div>
                </div>
                <div className="text-center p-3 rounded-lg bg-[var(--background)]">
                  <div className="text-2xl font-bold text-gray-300">{todoTasks}</div>
                  <div className="text-xs text-gray-400 mt-1">To Do</div>
                </div>
              </div>
            </div>

            {/* Kanban Board Section */}
            <div className="bg-[var(--background)] p-6 rounded-lg border border-gray-700">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold ">Project Board</h2>
                <div className="text-sm text-gray-400">
                  Total: <span className="font-semibold text-white">{totalTasks}</span> tasks
                </div>
              </div>
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
              >
                <div className="flex gap-5 overflow-x-auto scrollbar-hide  pb-6">
                  {board.columnOrder
                    .map((colId) => board.columns[colId])
                    .filter((col) => col && col.title && Array.isArray(col.taskIds))
                    .map((column) => {
                      const columnTasks = column.taskIds
                        .map(taskId => board.tasks[taskId])
                        .filter(task => !!task);
                      
                      return (
                        <Column
                          key={column.id}
                          column={column}
                          tasks={columnTasks}
                          onAddTask={() => {
                            setSelectedColumnForNewTask(column.id);
                            setTaskModalOpen(true);
                          }}
                          onUpdateTask={updateTask}
                          onDeleteTask={deleteTask}
                          columns={Object.values(board.columns).filter(c => c && c.id && c.title).map(c => ({ _id: c.id, title: c.title }))}
                          members={members}
                          onRenameColumn={(colId, newName) => {
                            setBoard((prev) => {
                              const targetCol = prev.columns[colId];
                              if (!targetCol) return prev;
                              
                              return {
                                ...prev,
                                columns: {
                                  ...prev.columns,
                                  [colId]: { ...targetCol, title: newName }
                                }
                              };
                            });
                          }}
                          onDeleteColumn={(colId) => {
                            console.log("Delete column:", colId);
                          }}
                        />
                      );
                    })}
                </div>
              </DndContext>
            </div>

            {/* Team Members Section */}
            <div className="bg-[var(--background)] p-6 rounded-lg ">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold ">Team Members</h2>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="bg-[var(--background)] hover:bg-[var(--primary)] hover:text-white border-gray-600 rounded-lg"
                >
                  <Plus size={16} className="mr-2" /> Add Member
                </Button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {members.length > 0 ? members.map((member) => (
                  <div 
                    key={member._id || member.id} 
                    className="flex items-center gap-3 p-4 rounded-lg bg-[var(--background)] hover:bg-[var(--background)] hover:text-white"
                  >
                    <div className="relative">
                      <Image
                        src={member.profileImage || "/avatar.jpg"}
                        width={48}
                        height={48}
                        className="rounded-full w-12 h-12 object-cover"
                        alt={member.name}
                      />
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-gray-700"></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold truncate text-white">{member.name}</div>
                      <div className="text-xs text-gray-400 truncate">{member.email}</div>
                    </div>
                  </div>
                )) : (
                  <div className="col-span-full text-center py-8 text-gray-400">
                    No team members yet
                  </div>
                )}
              </div>
            </div>

          </div>
        </main>
      </div>

      <AddTaskModal
        open={taskModalOpen}
        onClose={() => setTaskModalOpen(false)}
        onCreate={handleAddTask}
        defaultColumnId={selectedColumnForNewTask}
        projectId={projectId}
        columns={Object.values(board.columns)
          .filter(c => c && c.id && c.title)
          .map(c => ({ _id: c.id, title: c.title }))}
        members={members}
      />
    </div>
  );
}
