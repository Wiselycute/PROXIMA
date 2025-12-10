"use client";
import { X, Clock, AlertCircle, CheckCircle, Users, CheckCircle2 } from "lucide-react";
import { useState, useEffect } from "react";
import Image from "next/image";

export default function TaskDetailsDrawer({ open, onClose, task, comments: initialComments, onAddComment }) {
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState(initialComments || []);
  const [loading, setLoading] = useState(false);

  // Fetch comments when drawer opens
  useEffect(() => {
    if (!open || !task) return;
    
    const fetchComments = async () => {
      const taskId = task._id || task.id;
      if (!taskId || taskId.toString().startsWith("t-")) {
        setComments(initialComments || []);
        return;
      }

      setLoading(true);
      try {
        const api = (await import("@/lib/api")).default;
        const { data } = await api.get(`/tasks/${taskId}`);
        setComments(data.comments || []);
      } catch (e) {
        console.error("Failed to fetch comments:", e);
        setComments(initialComments || []);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [open, task, initialComments]);

  if (!open) return null;

  const handleAdd = async () => {
    if (!newComment.trim()) return;
    
    // Get logged-in user
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (!user.id) {
      alert("Please sign in to add comments");
      return;
    }

    // Validate taskId is a real MongoDB ObjectId (not temporary client ID)
    const taskId = task._id || task.id;
    if (!taskId || taskId.toString().startsWith("t-")) {
      alert("Cannot add comment to unsaved task. Please save the task first.");
      return;
    }

    try {
      const api = (await import("@/lib/api")).default;
      await api.post(`/comments`, { 
        text: newComment, 
        taskId: taskId,
        author: user.id 
      });
      setNewComment("");
      
      // Reload comments after adding
      const { data } = await api.get(`/tasks/${taskId}`);
      setComments(data.comments || []);
      
      // Notify parent to reload comments
      if (onAddComment) {
        onAddComment(newComment);
      }
    } catch (e) {
      console.error("Failed to add comment:", e);
      alert("Failed to add comment. Please try again.");
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

  const isCompleted = task?.status === "completed";

  return (
    <div className="fixed inset-0 z-[400] flex rounded-2xl">

      {/* Background */}
      <div className="flex-1 bg-black/40 backdrop-blur-md" onClick={onClose}></div>

      {/* Drawer */}
      <div className="w-full max-w-md bg-[var(--background)]  border-l border-white/10 p-6 animate-in slide-in-from-right duration-300 flex flex-col overflow-hidden">

        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-semibold text-white">{task?.title}</h2>
              {isCompleted && <CheckCircle2 size={20} className="text-green-500" />}
            </div>
            <p className="text-sm text-white/50 mt-1">Task Details</p>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/10 rounded transition">
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto scrollbar-hide space-y-6">
          {/* Description */}
          <div>
            <h3 className="text-sm font-medium text-white/70 mb-2">Description</h3>
            <p className="text-white/60 text-sm leading-relaxed">{task?.desc || task?.description || "No description provided."}</p>
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

            {/* Assignees with avatars */}
            {task?.assignees && task.assignees.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Users size={16} className="text-white/50" />
                  <span className="text-sm text-white/70 font-medium">
                    Assigned to ({task.assignees.length})
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 pl-6">
                  {task.assignees.map((assignee, i) => (
                    <div key={i} className="flex items-center gap-2 bg-white/5 rounded-lg px-3 py-1.5 border border-white/10">
                      <Image 
                        src={assignee?.profileImage || assignee?.avatar || "/avatar.jpg"} 
                        width={20}
                        height={20}
                        className="w-5 h-5 rounded-full object-cover" 
                        alt={assignee?.name || "User"}
                      />
                      <span className="text-sm text-white/80">{assignee?.name || "User"}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Status */}
            {task?.status && (
              <div className="flex items-center gap-3">
                <CheckCircle size={16} className="text-white/50" />
                <span className={`text-sm px-3 py-1 rounded-lg border ${
                  task.status === 'completed' ? 'bg-green-500/10 text-green-400 border-green-500/30' :
                  task.status === 'in-progress' ? 'bg-blue-500/10 text-blue-400 border-blue-500/30' :
                  'bg-gray-500/10 text-gray-400 border-gray-500/30'
                }`}>
                  {task.status === 'completed' ? 'Completed' : 
                   task.status === 'in-progress' ? 'In Progress' : 'To Do'}
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
