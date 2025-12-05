"use client";
import { X, Clock, AlertCircle, CheckCircle, Users } from "lucide-react";
import { useState } from "react";

export default function TaskDetailsDrawer({ open, onClose, task, comments, onAddComment }) {
  const [newComment, setNewComment] = useState("");

  if (!open) return null;

  const handleAdd = async () => {
    if (!newComment.trim()) return;
    try {
      const api = (await import("@/lib/api")).default;
      await api.post(`/comments`, { text: newComment, taskId: task._id || task.id });
      setNewComment("");
      // Optionally reload comments or notify parent
    } catch (e) {
      // Optionally show error toast
    }
  };

  const getPriorityColor = (priority) => {
    switch(priority?.toLowerCase()) {
      case 'high':
        return 'bg-red-500/10 text-red-400 border-red-500/30';
      case 'medium':
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30';
      case 'low':
        return 'bg-green-500/10 text-green-400 border-green-500/30';
      default:
        return 'bg-gray-500/10 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div className="fixed inset-0 z-[400] flex">

      {/* Background */}
      <div className="flex-1 bg-black/40 backdrop-blur-md" onClick={onClose}></div>

      {/* Drawer */}
      <div className="w-full max-w-md bg-[#15182A] border-l border-white/10 p-6 animate-in slide-in-from-right duration-300 flex flex-col overflow-hidden">

        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-white">{task?.title}</h2>
            <p className="text-sm text-white/50 mt-1">Task Details</p>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/10 rounded transition">
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto space-y-6">
          {/* Description */}
          <div>
            <h3 className="text-sm font-medium text-white/70 mb-2">Description</h3>
            <p className="text-white/60 text-sm leading-relaxed">{task?.description || "No description provided."}</p>
          </div>

          {/* Task Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <AlertCircle size={16} className="text-white/50" />
              <span className={`text-sm px-3 py-1 rounded-lg border ${getPriorityColor(task?.priority)}`}>
                {task?.priority || 'Unknown'} Priority
              </span>
            </div>

            {task?.dueDate && (
              <div className="flex items-center gap-3">
                <Clock size={16} className="text-white/50" />
                <span className="text-sm text-white/70">
                  Due: {new Date(task.dueDate).toLocaleDateString()}
                </span>
              </div>
            )}

            {task?.assignees && task.assignees.length > 0 && (
              <div className="flex items-center gap-3">
                <Users size={16} className="text-white/50" />
                <span className="text-sm text-white/70">
                  {task.assignees.length} {task.assignees.length === 1 ? 'assignee' : 'assignees'}
                </span>
              </div>
            )}
          </div>

          {/* Comments */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Comments ({comments?.length || 0})</h3>

            <div className="space-y-3 max-h-[200px] overflow-y-auto">
              {comments && comments.length > 0 ? (
                comments.map(c => (
                  <div key={c._id || c.id} className="bg-white/5 p-3 rounded-xl border border-white/10 hover:border-white/20 transition">
                    <p className="text-sm text-white">{c.text}</p>
                    <p className="text-xs text-white/40 mt-2">
                      {c.createdAt ? new Date(c.createdAt).toLocaleString() : 'Just now'}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-white/50 text-center py-4">No comments yet</p>
              )}
            </div>
          </div>
        </div>

        {/* Add Comment Section */}
        <div className="mt-6 border-t border-white/10 pt-4">
          <textarea
            className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder-white/40 focus:border-white/30 focus:outline-none min-h-[70px] resize-none"
            placeholder="Add a comment..."
            value={newComment}
            onChange={e => setNewComment(e.target.value)}
          />

          <button
            onClick={handleAdd}
            disabled={!newComment.trim()}
            className="mt-3 w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 disabled:cursor-not-allowed rounded-xl text-white text-sm font-medium transition"
          >
            Add Comment
          </button>
        </div>

      </div>
    </div>
  );
}
