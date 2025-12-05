"use client";
import React, { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Edit, MessageSquare } from "lucide-react";
import TaskModal from "./TaskModal";
import TaskDetailsDrawer from "./TaskDetailsDrawer";
import EditTaskModal from "./EditTaskModal";

/**
 * TaskCard: draggable card for a task.
 * Single-click opens TaskDetailsDrawer (read-only view with comments).
 * Edit button opens EditTaskModal.
 */

export default function TaskCard({ task, index, onUpdate, onDelete }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: task.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  };

  const [showDetails, setShowDetails] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [open, setOpen] = useState(false);

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className="glass-card p-3 rounded-xl cursor-grab hover:cursor-grab"
        onClick={() => setShowDetails(true)}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <div className="font-semibold text-[var(--foreground)]">{task.title}</div>
            <div className="text-xs opacity-60 mt-1">{task.desc ? task.desc.slice(0, 80) : "No description"}</div>
          </div>

          <div className="flex items-center gap-1">
            <span className={`px-2 py-1 rounded text-[var(--foreground)]`} style={{ background: "rgba(255,255,255,0.03)" }}>
              {task.priority?.toUpperCase()?.slice(0, 1) || "L"}
            </span>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center -space-x-2">
              {(task.assignees || []).slice(0, 3).map((a, i) => (
                <img key={i} src={a?.avatar || "/avatar.jpg"} className="w-6 h-6 rounded-full border border-white/10" alt={a?.name} />
              ))}
            </div>
            {(task.comments?.length || 0) > 0 && (
              <span className="text-xs opacity-60 flex items-center gap-1">
                <MessageSquare size={12} /> {task.comments?.length}
              </span>
            )}
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowEdit(true);
            }}
            className="p-1 hover:bg-white/10 rounded transition opacity-0 group-hover:opacity-100"
            title="Edit task"
          >
            <Edit size={14} />
          </button>
        </div>
      </div>

      {/* Task Details Drawer - shows comments and read-only info */}
      <TaskDetailsDrawer
        open={showDetails}
        onClose={() => setShowDetails(false)}
        task={task}
        comments={task.comments || []}
        onAddComment={(text) => {
          const newComment = {
            _id: `c-${Date.now()}`,
            text,
            createdAt: new Date().toISOString()
          };
          onUpdate({ comments: [...(task.comments || []), newComment] });
        }}
      />

      {/* Edit Task Modal */}
      <EditTaskModal
        open={showEdit}
        onClose={() => setShowEdit(false)}
        task={task}
        columns={[]} // Pass columns from parent if needed
        members={task.assignees || []}
        onSave={(updated) => {
          onUpdate(updated);
          setShowEdit(false);
        }}
      />
      {/* Fallback to old TaskModal if needed */}
      {open && <TaskModal task={task} onClose={() => setOpen(false)} onUpdate={(patch) => onUpdate(patch)} onDelete={() => { onDelete(); setOpen(false); }} />}
    </>
  );
}
