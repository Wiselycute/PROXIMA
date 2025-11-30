"use client";
import React, { useState } from "react";

export default function TaskCard({ task, refresh }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div
        id={task._id}
        className="bg-white rounded shadow p-3 cursor-pointer"
        onClick={() => setOpen(true)}
      >
        <div className="flex justify-between">
          <strong>{task.title}</strong>
          <span className="text-xs text-gray-500">{task.priority}</span>
        </div>
        <div className="text-sm text-gray-600 mt-1">{task.description?.slice(0,60)}</div>
        <div className="mt-2 flex items-center gap-2">
          {task.assignees?.slice(0,3).map(a => (
            <img key={a} src={`/api/users/${a}/avatar`} className="w-6 h-6 rounded-full" alt="" />
          ))}
        </div>
      </div>

      {open && <TaskDetailModal taskId={task._id} onClose={()=>{setOpen(false); refresh();}} />}
    </>
  );
}
