"use client";
import { useState, useEffect } from "react";
import { X } from "lucide-react";

export default function AddTaskModal({
  open,
  onClose,
  onCreate,
  columns,
  members,
  defaultColumnId,
}) {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [columnId, setColumnId] = useState(defaultColumnId || columns[0]?._id);
  const [assignee, setAssignee] = useState(""); // SINGLE SELECT
  const [priority, setPriority] = useState("medium");
  const [dueDate, setDueDate] = useState("");

  useEffect(() => {
    if (open) {
      setColumnId(defaultColumnId || columns[0]?._id);
      setTitle("");
      setDesc("");
      setAssignee("");
      setPriority("medium");
      setDueDate("");
    }
  }, [open]);

  if (!open) return null;

  const handleSubmit = () => {
    if (!title.trim()) return;

    onCreate({
      title,
      description: desc,
      columnId,
      assignees: assignee ? [assignee] : [], // convert to array
      priority,
      dueDate,
    });
  };

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/50 backdrop-blur-md ">
      <div
        className="w-full max-w-sm bg-[#0F1120]/80 bg-transparent border border-white/10
                   shadow-2xl rounded-2xl p-5 animate-in fade-in zoom-in 
                   duration-200 relative"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-white/60 hover:text-white"
        >
          <X size={20} />
        </button>

        {/* Header */}
        <h2 className="text-xl font-semibold mb-4 text-white tracking-wide">
          New Task
        </h2>

        <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1 scrollbar-hide">

          {/* Task Title */}
          <div>
            <label className="text-sm text-white/60">Title</label>
            <input
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 mt-1 
                         focus:ring-2 ring-blue-500/40 outline-none transition"
              placeholder="Enter task title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-sm text-white/60">Description</label>
            <textarea
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 mt-1 min-h-[90px]
                         focus:ring-2 ring-blue-500/40 outline-none transition"
              placeholder="Write a short description..."
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
            />
          </div>

          {/* Column Select */}
          <div>
            <label className="text-sm text-white/60">Column</label>
            <select
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 mt-1"
              value={columnId}
              onChange={(e) => setColumnId(e.target.value)}
            >
              {columns.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.title}
                </option>
              ))}
            </select>
          </div>

          {/* Single Assignee Select */}
          <div>
            <label className="text-sm text-white/60">Assign To</label>
            <select
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 mt-1"
              value={assignee}
              onChange={(e) => setAssignee(e.target.value)}
            >
              <option value="">Select member...</option>
              {members.map((m) => (
                <option key={m._id} value={m._id}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>

          {/* Priority Pills */}
          <div>
            <label className="text-sm text-white/60">Priority</label>
            <div className="grid grid-cols-3 gap-2 mt-2">
              {["low", "medium", "high"].map((p) => (
                <button
                  key={p}
                  onClick={() => setPriority(p)}
                  className={`py-2 rounded-xl border text-sm capitalize transition 
                  ${
                    priority === p
                      ? "bg-blue-600 border-blue-700"
                      : "bg-white/5 border-white/10"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Due Date */}
          <div>
            <label className="text-sm text-white/60">Due Date</label>
            <input
              type="date"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 mt-1"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 mt-5">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="px-6 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-800 
                     hover:opacity-90 font-medium shadow-lg shadow-blue-600/20"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
}
