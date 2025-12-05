// "use client";

// import { useEffect, useState } from "react";
// import Column from "@/components/Kanban/Column";

// export default function BoardPage() {
//   const [columns, setColumns] = useState(() => {
//     if (typeof window !== "undefined") {
//       return JSON.parse(localStorage.getItem("proxima-board")) || {
//         todo: [],
//         progress: [],
//         done: [],
//       };
//     }
//     return { todo: [], progress: [], done: [] };
//   });

//   // persist board
//   useEffect(() => {
//     localStorage.setItem("proxima-board", JSON.stringify(columns));
//   }, [columns]);

//   const moveTask = (task, from, to) => {
//     setColumns(prev => {
//       const newCols = { ...prev };
//       newCols[from] = newCols[from].filter(t => t.id !== task.id);
//       newCols[to] = [...newCols[to], task];
//       return newCols;
//     });
//   };

//   return (
//     <div className="space-y-8">
//       <h1 className="text-3xl font-bold">Kanban Board</h1>

//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         <Column
//           title="To Do"
//           columnId="todo"
//           tasks={columns.todo}
//           moveTask={moveTask}
//           setColumns={setColumns}
//         />

//         <Column
//           title="In Progress"
//           columnId="progress"
//           tasks={columns.progress}
//           moveTask={moveTask}
//           setColumns={setColumns}
//         />

//         <Column
//           title="Done"
//           columnId="done"
//           tasks={columns.done}
//           moveTask={moveTask}
//           setColumns={setColumns}
//         />
//       </div>
//     </div>
//   );
// }



"use client";

import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";

import { useEffect, useState, useCallback } from "react";
import api from "@/lib/api";
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
  DragOverlay,
} from "@dnd-kit/core";
import {
  SortableContext,
  rectSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import Column from "@/components/Kanban/Column";
import TaskModal from "@/components/Kanban/TaskModal";
import AddTaskModal from "@/components/Kanban/AddTaskModal";
import AddColumnModal from "@/components/AddColumnModal";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import TaskCard from "@/components/Kanban/TaskCard";

// ----- LocalStorage Keys -----
const STORAGE_KEY = "proxima_kanban_data";

const defaultData = {
  columns: {
    todo: { id: "todo", title: "To Do", taskIds: [] },
    inprogress: { id: "inprogress", title: "In Progress", taskIds: [] },
    done: { id: "done", title: "Done", taskIds: [] },
  },
  tasks: {},
  columnOrder: ["todo", "inprogress", "done"],
};

export default function BoardPage() {
  const [board, setBoard] = useState(defaultData);
  const [apiLoaded, setApiLoaded] = useState(false);
  const [boardProjectId, setBoardProjectId] = useState(null);
  const [activeId, setActiveId] = useState(null);
  const [activeTask, setActiveTask] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [colModalOpen, setColModalOpen] = useState(false);
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [selectedColumnForNewTask, setSelectedColumnForNewTask] = useState("todo");

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) setBoard(JSON.parse(raw));
  }, []);

  // Attempt to load persisted board from API if available
  useEffect(() => {
    let mounted = true;
    async function loadFromApi() {
      try {
        const [colsRes, tasksRes] = await Promise.all([api.get("/columns"), api.get("/tasks")]);
        if (!mounted) return;
        const cols = colsRes.data || [];
        const tasks = tasksRes.data || [];

        // build board structure
        const columns = {};
        const columnOrder = [];
        cols.forEach((c) => {
          const id = c._id || c.id;
          columns[id] = { id, title: c.title || c.name || "Column", taskIds: (c.taskIds && Array.isArray(c.taskIds) ? c.taskIds : []), projectId: c.projectId || (c.project && c.project._id) || null };
          columnOrder.push(id);
        });

        const tasksMap = {};
        tasks.forEach((t) => {
          const id = t._id || t.id;
          tasksMap[id] = { id, title: t.title || t.name || "Untitled", desc: t.description || t.desc || "", assignees: t.assignees || [], due: t.due || null, comments: t.comments || [], priority: t.priority || "low", columnId: t.columnId || null };
          // ensure task present in column's taskIds
          const colId = t.columnId || t.column || null;
          if (colId && columns[colId]) {
            if (!columns[colId].taskIds.includes(id)) columns[colId].taskIds.push(id);
          }
        });

        if (Object.keys(columns).length) {
          setBoard({ columns, tasks: tasksMap, columnOrder });
          setApiLoaded(true);
          // pick projectId from first column if available
          const firstCol = Object.values(columns)[0];
          if (firstCol && firstCol.projectId) setBoardProjectId(firstCol.projectId);
        }
      } catch (err) {
        // silently ignore; fall back to localStorage/default board
        console.warn("Board: failed to load from API", err);
      }
    }

    loadFromApi();
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(board));
  }, [board]);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));

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

    // moving between columns
    const source = board.columns[sourceColId];
    const dest = board.columns[destColId];
    const newSourceIds = source.taskIds.filter((id) => id !== activeId);

    let insertAt = dest.taskIds.length;
    const overIndex = dest.taskIds.indexOf(overId);
    if (overIndex !== -1) insertAt = overIndex;

    const newDestIds = [...dest.taskIds.slice(0, insertAt), activeId, ...dest.taskIds.slice(insertAt)];

    setBoard((prev) => ({
      ...prev,
      columns: {
        ...prev.columns,
        [sourceColId]: { ...source, taskIds: newSourceIds },
        [destColId]: { ...dest, taskIds: newDestIds },
      },
    }));

    // persist move to server if available: update moved task's columnId and order
    if (apiLoaded) {
      const movedTaskId = activeId;
      const insertAt = newDestIds.indexOf(activeId);
      (async () => {
        try {
          await api.put(`/tasks/${movedTaskId}`, { columnId: destColId, order: insertAt });
        } catch (err) {
          console.warn("Failed to persist task move", err);
        }
      })();
    }
  }

  function addTask(columnId, title) {
    // If board was loaded from API and we have a project context, create on server
    if (apiLoaded && boardProjectId) {
      (async () => {
        try {
          const payload = { title, description: "", projectId: boardProjectId, columnId };
          const res = await api.post("/tasks", payload);
          const t = res.data;
          const id = t._id || t.id;
          setBoard((prev) => ({
            ...prev,
            tasks: { ...prev.tasks, [id]: { id, title: t.title, desc: t.description || "", assignees: t.assignees || [], due: t.dueDate || null, comments: [], priority: t.priority || "low" } },
            columns: { ...prev.columns, [columnId]: { ...prev.columns[columnId], taskIds: [id, ...prev.columns[columnId].taskIds] } },
          }));
        } catch (err) {
          console.warn("Failed to create task on API, falling back to local", err);
        }
      })();
      return;
    }

    const id = `t-${Date.now()}`;
    const newTask = { id, title, desc: "", assignees: [], due: null, comments: [], priority: "low" };
    setBoard((prev) => ({
      ...prev,
      tasks: { ...prev.tasks, [id]: newTask },
      columns: { ...prev.columns, [columnId]: { ...prev.columns[columnId], taskIds: [id, ...prev.columns[columnId].taskIds] } },
    }));
  }

  function handleAddTaskFromModal(data) {
    // If board is API-backed create task server-side
    if (apiLoaded && boardProjectId) {
      (async () => {
        try {
          const payload = {
            title: data.title,
            description: data.description || "",
            assignees: data.assignees || [],
            dueDate: data.dueDate || null,
            priority: data.priority || "medium",
            columnId: data.columnId,
            projectId: boardProjectId,
          };
          const res = await api.post("/tasks", payload);
          const t = res.data;
          const id = t._id || t.id;
          setBoard((prev) => ({
            ...prev,
            tasks: { ...prev.tasks, [id]: { id, title: t.title, desc: t.description || "", assignees: t.assignees || [], due: t.dueDate || null, comments: [], priority: t.priority || "medium" } },
            columns: { ...prev.columns, [data.columnId]: { ...prev.columns[data.columnId], taskIds: [id, ...prev.columns[data.columnId].taskIds] } },
          }));
        } catch (err) {
          console.warn("Failed to create task via API", err);
        }
      })();
      setTaskModalOpen(false);
      return;
    }

    const id = `t-${Date.now()}`;
    const newTask = {
      id,
      title: data.title,
      desc: data.description || "",
      assignees: data.assignees || [],
      due: data.dueDate || null,
      comments: [],
      priority: data.priority || "medium"
    };
    setBoard((prev) => ({
      ...prev,
      tasks: { ...prev.tasks, [id]: newTask },
      columns: {
        ...prev.columns,
        [data.columnId]: {
          ...prev.columns[data.columnId],
          taskIds: [id, ...prev.columns[data.columnId].taskIds]
        }
      }
    }));
    setTaskModalOpen(false);
  }

  function addColumn(name) {
    if (apiLoaded && boardProjectId) {
      (async () => {
        try {
          const res = await api.post("/columns", { title: name, projectId: boardProjectId });
          const c = res.data;
          const id = c._id || c.id;
          setBoard((prev) => ({
            ...prev,
            columns: { ...prev.columns, [id]: { id, title: c.title || name, taskIds: [] } },
            columnOrder: [id, ...prev.columnOrder],
          }));
        } catch (err) {
          console.warn("Failed to create column via API", err);
        }
      })();
      return;
    }

    const id = `c-${Date.now()}`;
    setBoard((prev) => ({
      ...prev,
      columns: { ...prev.columns, [id]: { id, title: name, taskIds: [] } },
      columnOrder: [id, ...prev.columnOrder],
    }));
  }

  function openTask(id) {
    setActiveTask(board.tasks[id]);
    setModalOpen(true);
  }

  function updateTask(taskId, patch) {
    // optimistic update locally
    setBoard((prev) => ({ ...prev, tasks: { ...prev.tasks, [taskId]: { ...prev.tasks[taskId], ...patch } } }));

    if (apiLoaded) {
      (async () => {
        try {
          await api.put(`/tasks/${taskId}`, patch);
        } catch (err) {
          console.warn("Failed to persist task update", err);
        }
      })();
    }
  }

  function renameColumn(colId, newName) {
    setBoard((prev) => ({
      ...prev,
      columns: {
        ...prev.columns,
        [colId]: { ...prev.columns[colId], title: newName }
      }
    }));

    if (apiLoaded) {
      (async () => {
        try {
          await api.put(`/columns/${colId}`, { title: newName });
        } catch (err) {
          console.warn("Failed to persist column rename", err);
        }
      })();
    }
  }

  function deleteColumn(colId) {
    if (apiLoaded) {
      (async () => {
        try {
          await api.delete(`/columns/${colId}`);
        } catch (err) {
          console.warn("Failed to delete column on server", err);
        }
      })();
    }

    setBoard((prev) => {
      const newCols = { ...prev.columns };
      const newOrder = prev.columnOrder.filter((id) => id !== colId);
      delete newCols[colId];
      return { ...prev, columns: newCols, columnOrder: newOrder };
    });
  }

  async function deleteTask(taskId) {
    if (apiLoaded) {
      try {
        await api.delete(`/tasks/${taskId}`);
      } catch (err) {
        console.warn("Failed to delete task on server", err);
      }
    }

    setBoard((prev) => {
      const newTasks = { ...prev.tasks };
      delete newTasks[taskId];
      const newCols = { ...prev.columns };
      Object.keys(newCols).forEach((cid) => {
        newCols[cid] = { ...newCols[cid], taskIds: newCols[cid].taskIds.filter((id) => id !== taskId) };
      });
      return { ...prev, tasks: newTasks, columns: newCols };
    });
  }

  return (
    <div className="min-h-screen flex bg-[var(--background)] text-[var(--foreground)]">
      <Sidebar />
      <div className="flex-1">
        <Topbar />
        <main className="p-4">
          <div className="space-y-6 p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Kanban</h2>
        <div className="flex gap-2">
          <Button onClick={() => {
            setSelectedColumnForNewTask("todo");
            setTaskModalOpen(true);
          }} className="flex items-center gap-2">
            <Plus size={14} /> New Task
          </Button>
            <Button onClick={() => setColModalOpen(true)} variant="outline" className="flex items-center gap-2">
              <Plus size={14} /> Add Column
            </Button>
        </div>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="flex gap-6 overflow-x-auto pb-6">
          {board.columnOrder
            .map((colId) => ({ id: colId, col: board.columns[colId] }))
            .filter(({ col }) => !!col)
            .map(({ id, col: column }) => {
              const tasks = (column.taskIds || []).map((tid) => board.tasks[tid]).filter(Boolean);
              return (
                <SortableContext key={column.id} items={column.taskIds || []} strategy={rectSortingStrategy}>
                  <Column
                    key={column.id}
                    column={column}
                    tasks={tasks}
                    onAddTask={(title) => {
                      setSelectedColumnForNewTask(column.id);
                      setTaskModalOpen(true);
                    }}
                    onUpdateTask={updateTask}
                    onDeleteTask={deleteTask}
                    onRenameColumn={renameColumn}
                    onDeleteColumn={deleteColumn}
                    onOpenTask={openTask}
                  />
                </SortableContext>
              );
            })}
        </div>

        <DragOverlay>{activeId ? <div className="glass-card p-3 rounded-xl w-72">{board.tasks?.[activeId]?.title}</div> : null}</DragOverlay>
      </DndContext>

          {modalOpen && activeTask && <TaskModal task={activeTask} onClose={() => setModalOpen(false)} onUpdate={(patch) => updateTask(activeTask.id, patch)} onDelete={() => {}} />}
          <AddColumnModal open={colModalOpen} setOpen={setColModalOpen} onAdd={addColumn} />
          <AddTaskModal
            open={taskModalOpen}
            onClose={() => setTaskModalOpen(false)}
            onCreate={handleAddTaskFromModal}
            defaultColumnId={selectedColumnForNewTask}
            columns={Object.values(board.columns).map(c => ({ _id: c.id, title: c.title }))}
            members={[
              { _id: "u-1", name: "Alex Morgan" },
              { _id: "u-2", name: "Jamie Chen" },
              { _id: "u-3", name: "Taylor Swift" }
            ]}
          />
          </div>
        </main>
      </div>
    </div>
  );
}
