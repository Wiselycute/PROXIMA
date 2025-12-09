"use client";
import React, { useState, useEffect, useRef } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Edit, MessageSquare, CheckCircle2, Circle, Clock, TrendingUp, Trash2 } from "lucide-react";
import TaskModal from "./TaskModal";
import TaskDetailsDrawer from "./TaskDetailsDrawer";
import EditTaskModal from "./EditTaskModal";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import Image from "next/image";

/**
 * TaskCard: draggable card for a task.
 * Single-click opens TaskDetailsDrawer (read-only view with comments).
 * Edit button opens EditTaskModal.
 * Shows assignees with avatars and completion status.
 * Status can be changed via dropdown.
 */

export default function TaskCard({ task, index, onUpdate, onDelete, columns = [], members = [] }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: task.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  };

  const [showDetails, setShowDetails] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [open, setOpen] = useState(false);
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const statusMenuRef = useRef(null);

  const isCompleted = task.status === "completed";

  // Close status menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (statusMenuRef.current && !statusMenuRef.current.contains(event.target)) {
        setShowStatusMenu(false);
      }
    };

    if (showStatusMenu) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [showStatusMenu]);

  const handleToggleComplete = async (e) => {
    e.stopPropagation();
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    
    // Cycle through statuses: todo -> in-progress -> completed -> todo
    let newStatus;
    if (task.status === "todo") {
      newStatus = "in-progress";
    } else if (task.status === "in-progress") {
      newStatus = "completed";
    } else {
      newStatus = "todo";
    }
    
    onUpdate({
      status: newStatus,
      completedAt: newStatus === "completed" ? new Date().toISOString() : null,
      completedBy: newStatus === "completed" ? user.id : null
    });
  };

  const handleStatusChange = (e, newStatus) => {
    e.stopPropagation();
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    
    onUpdate({
      status: newStatus,
      completedAt: newStatus === "completed" ? new Date().toISOString() : null,
      completedBy: newStatus === "completed" ? user.id : null
    });
    setShowStatusMenu(false);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 size={14} className="text-green-500" />;
      case "in-progress":
        return <TrendingUp size={14} className="text-blue-500" />;
      default:
        return <Clock size={14} className="text-gray-500" />;
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "completed":
        return "Done";
      case "in-progress":
        return "In Progress";
      default:
        return "To Do";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "in-progress":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20";
    }
  };

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className={`group relative bg-[var(--background)] p-4 rounded-xl cursor-grab hover:cursor-grab border border-white/10 hover:border-white/20 transition-all hover:shadow-xl hover:scale-[1.02] ${isCompleted ? 'opacity-60' : ''}`}
        onClick={() => setShowDetails(true)}
      >
        {/* Priority Indicator Strip */}
        <div className={`absolute top-0 left-0 right-0 h-1 rounded-t-xl ${
          task.priority === "high" ? "bg-gradient-to-r from-red-500 to-orange-500" :
          task.priority === "medium" ? "bg-gradient-to-r from-yellow-500 to-orange-500" :
          "bg-gradient-to-r from-green-500 to-emerald-500"
        }`} />

        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-start gap-3 flex-1">
            <button
              onClick={handleToggleComplete}
              className="mt-0.5 shrink-0 hover:scale-110 transition-transform"
              title={task.status === "todo" ? "Mark as in progress" : task.status === "in-progress" ? "Mark as complete" : "Mark as todo"}
            >
              {task.status === "completed" ? (
                <CheckCircle2 size={20} className="text-green-400" />
              ) : task.status === "in-progress" ? (
                <TrendingUp size={20} className="text-blue-400" />
              ) : (
                <Circle size={20} className="text-white/30 hover:text-white/60" />
              )}
            </button>
            
            <div className="flex-1 min-w-0">
              <div className={`font-semibold text-white leading-snug ${isCompleted ? 'line-through opacity-50' : ''}`}>
                {task.title}
              </div>
              {task.desc && (
                <div className="text-sm text-white/60 mt-1.5 line-clamp-2">
                  {task.desc}
                </div>
              )}
            </div>
          </div>

          {/* Priority Badge */}
          <div className={`px-2.5 py-1 rounded-lg text-xs font-semibold shrink-0 ${
            task.priority === "high" ? "bg-red-500/20 text-red-400 border border-red-500/30" :
            task.priority === "medium" ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30" :
            "bg-green-500/20 text-green-400 border border-green-500/30"
          }`}>
            {task.priority?.toUpperCase()?.slice(0, 1) || "L"}
          </div>
        </div>

        {/* Footer Section */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/10">
          <div className="flex items-center gap-2">
            {/* Status Badge with Dropdown */}
            <div className="relative" ref={statusMenuRef}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowStatusMenu(!showStatusMenu);
                }}
                className={`px-2.5 py-1.5 rounded-lg text-xs border flex items-center gap-1.5 hover:opacity-80 transition font-medium ${getStatusColor(task.status)}`}
                title="Change status"
              >
                {getStatusIcon(task.status)}
                <span>{getStatusLabel(task.status)}</span>
              </button>
              
              {showStatusMenu && (
                <div className="absolute bottom-full left-0 mb-2 w-40 bg-gray-900 border border-white/20 rounded-xl shadow-2xl z-50 overflow-hidden">
                  <button
                    onClick={(e) => handleStatusChange(e, "todo")}
                    className={`w-full text-left px-3 py-2.5 hover:bg-white/10 flex items-center gap-2 text-sm transition ${task.status === "todo" ? "bg-white/10" : ""}`}
                  >
                    <Clock size={14} className="text-gray-400" />
                    <span className="text-white">To Do</span>
                  </button>
                  <button
                    onClick={(e) => handleStatusChange(e, "in-progress")}
                    className={`w-full text-left px-3 py-2.5 hover:bg-white/10 flex items-center gap-2 text-sm transition ${task.status === "in-progress" ? "bg-white/10" : ""}`}
                  >
                    <TrendingUp size={14} className="text-blue-400" />
                    <span className="text-white">In Progress</span>
                  </button>
                  <button
                    onClick={(e) => handleStatusChange(e, "completed")}
                    className={`w-full text-left px-3 py-2.5 hover:bg-white/10 flex items-center gap-2 text-sm transition ${task.status === "completed" ? "bg-white/10" : ""}`}
                  >
                    <CheckCircle2 size={14} className="text-green-400" />
                    <span className="text-white">Done</span>
                  </button>
                </div>
              )}
            </div>
            
            {/* Assignees */}
            {task.assignees && task.assignees.length > 0 && (
              <div className="flex items-center -space-x-2">
                {task.assignees.slice(0, 3).map((assignee, i) => (
                  <div key={i} className="relative" title={assignee?.name || "User"}>
                    <Image 
                      src={assignee?.profileImage || assignee?.avatar || "/avatar.jpg"} 
                      width={28}
                      height={28}
                      className="w-7 h-7 rounded-full border-2 border-gray-800 object-cover ring-1 ring-white/20 hover:scale-110 transition-transform" 
                      alt={assignee?.name || "User"}
                    />
                  </div>
                ))}
                {task.assignees.length > 3 && (
                  <div className="w-7 h-7 rounded-full border-2 border-gray-800 bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-xs font-semibold ring-1 ring-white/20">
                    +{task.assignees.length - 3}
                  </div>
                )}
              </div>
            )}
            
            {/* Comments */}
            {(task.comments?.length || 0) > 0 && (
              <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10">
                <MessageSquare size={14} className="text-blue-400" />
                <span className="text-xs text-white/80 font-medium">{task.comments?.length}</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowEdit(true);
              }}
              className="p-2 hover:bg-white/10 rounded-lg transition-all hover:scale-110"
              title="Edit task"
            >
              <Edit size={16} className="text-white/70" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowDeleteConfirm(true);
              }}
              className="p-2 hover:bg-red-500/20 rounded-lg transition-all hover:scale-110"
              title="Delete task"
            >
              <Trash2 size={16} className="text-red-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Task Details Drawer - shows comments and read-only info */}
      <TaskDetailsDrawer
        open={showDetails}
        onClose={() => setShowDetails(false)}
        task={task}
        comments={task.comments || []}
        onAddComment={async (text) => {
          // Reload task from API to get updated comments
          try {
            const api = (await import("@/lib/api")).default;
            const taskId = task._id || task.id;
            if (taskId && !taskId.toString().startsWith("t-")) {
              const { data } = await api.get(`/tasks/${taskId}`);
              // Update task with all fresh data including comments
              onUpdate({ 
                comments: data.comments || [],
                title: data.title,
                description: data.description,
                assignees: data.assignees,
                priority: data.priority,
                status: data.status,
                dueDate: data.dueDate
              });
            }
          } catch (e) {
            console.error("Failed to reload task comments:", e);
          }
        }}
      />

      {/* Edit Task Modal */}
      <EditTaskModal
        open={showEdit}
        onClose={() => setShowEdit(false)}
        task={task}
        columns={columns}
        members={members}
        onSave={(updated) => {
          onUpdate(updated);
          setShowEdit(false);
        }}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        open={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={() => {
          onDelete();
          setShowDeleteConfirm(false);
        }}
        text={`Are you sure you want to delete "${task.title}"? This action cannot be undone.`}
      />

      {/* Fallback to old TaskModal if needed */}
      {open && <TaskModal task={task} onClose={() => setOpen(false)} onUpdate={(patch) => onUpdate(patch)} onDelete={() => { onDelete(); setOpen(false); }} />}
    </>
  );
}
