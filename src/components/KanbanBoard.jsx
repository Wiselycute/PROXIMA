"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import KanbanColumn from "./KanbanColumn";
import TaskModal from "./Kanban/TaskModal";

// The repository previously referenced a missing `NewTaskModal` component.
// Provide a small inline wrapper that reuses `TaskModal` for creating new tasks.
function NewTaskModal({ projectId, refresh }) {
  const [open, setOpen] = useState(false);

  async function handleCreate(patch) {
    try {
      await axios.post(`/api/projects/${projectId}/tasks`, patch);
      setOpen(false);
      refresh();
    } catch (err) {
      console.error("Failed to create task", err);
    }
  }

  return (
    <>
      <div className="flex items-center">
        <button onClick={() => setOpen(true)} className="ml-2 px-3 py-1 rounded-md bg-[var(--primary)] text-white">+ New Task</button>
      </div>
      {open && <TaskModal task={{}} onClose={() => setOpen(false)} onUpdate={handleCreate} />}
    </>
  );
}

export default function KanbanBoard({ projectId }) {
  const [board, setBoard] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchBoard() {
    setLoading(true);
    const res = await axios.get(`/api/projects/${projectId}/board`);
    setBoard(res.data);
    setLoading(false);
  }

  useEffect(() => {
    fetchBoard();
    // simple poll every 8s for updates (replace with sockets later)
    const id = setInterval(fetchBoard, 8000);
    return () => clearInterval(id);
  }, [projectId]);

  return (
    <div className="flex gap-4 overflow-x-auto p-4">
      {loading ? <div>Loading...</div> : board.map(col => (
        <KanbanColumn key={col._id} column={col} refresh={fetchBoard} />
      ))}
      <NewTaskModal projectId={projectId} refresh={fetchBoard} />
    </div>
  );
}
