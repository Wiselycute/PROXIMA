"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import KanbanColumn from "./KanbanColumn";
import NewTaskModal from "./NewTaskModal";

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
