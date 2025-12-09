"use client";
import { useState, useEffect } from "react";
import { X } from "lucide-react";

export default function AddTaskModal({
  open,
  onClose,
  onCreate,
  columns,
  defaultColumnId,
  projectId,
}) {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [columnId, setColumnId] = useState(defaultColumnId || "");
  const [members, setMembers] = useState([]);
  const [assignees, setAssignees] = useState([]); // MULTI SELECT
  const [priority, setPriority] = useState("medium");
  const [dueDate, setDueDate] = useState("");

  // Load users from MongoDB when modal opens
  useEffect(() => {
    async function loadUsers() {
      try {
        const api = (await import("@/lib/api")).default;
        const { data } = await api.get("/users"); // MUST exist in API
        setMembers(data);
      } catch (err) {
        console.log("Failed to load members");
      }
    }

    if (open) {
      loadUsers();
      setTitle("");
      setDesc("");
      setAssignees([]);
      setPriority("medium");
      setDueDate("");
      setColumnId(defaultColumnId || columns[0]?._id || "");
    }
  }, [open, defaultColumnId, columns]);

  if (!open) return null;

  const toggleAssignee = (userId) => {
    setAssignees((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSubmit = async () => {
    if (!title.trim()) return;
    
    if (!projectId) {
      alert("Project ID is required. Please ensure the board is linked to a project.");
      return;
    }

    const payload = {
      title,
      description: desc,
      columnId,
      projectId,
      assignees, // multiple IDs
      priority,
      dueDate,
    };

    // Just notify parent to create the task - don't create it here
    if (onCreate) onCreate(payload);
    if (onClose) onClose();
  };

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/50 backdrop-blur-md">
      <div className="w-full max-w-sm bg-[#0F1120]/90 bg-transparent border border-white/10 rounded-2xl p-6 shadow-2xl relative">

        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-white/60 hover:text-white"
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-semibold mb-4 text-white">New Task</h2>

        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1 scrollbar-hide">

          {/* Title */}
          <div>
            <label className="text-sm text-white/60">Title</label>
            <input
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 mt-1"
              placeholder="Task title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-sm text-white/60">Description</label>
            <textarea
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 mt-1 min-h-[80px]"
              placeholder="Short description..."
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
            />
          </div>

          {/* Column */}
          <div>
            <label className="text-sm text-white/60">Column</label>
            <select
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 mt-1"
              value={columnId}
              onChange={(e) => setColumnId(e.target.value)}
            >
              {columns.map((col) => (
                <option key={col._id} value={col._id}>
                  {col.title}
                </option>
              ))}
            </select>
          </div>

          {/* Multi-select Assignees */}
          <div>
            <label className="text-sm text-white/60">Assign To</label>

            <div className="bg-white/5 border scrollbar-hide border-white/10 rounded-xl px-3 py-2 mt-1 space-y-2 max-h-[120px] overflow-y-auto">
              {members.length === 0 && (
                <p className="text-xs text-white/40">Loading members...</p>
              )}

              {members.map((m) => (
                <label
                  key={m._id}
                  className="flex items-center gap-2 text-white text-sm cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={assignees.includes(m._id)}
                    onChange={() => toggleAssignee(m._id)}
                  />
                  {m.name}
                </label>
              ))}
            </div>
          </div>

          {/* Priority */}
          <div>
            <label className="text-sm text-white/60">Priority</label>
            <div className="grid grid-cols-3 gap-2 mt-2">
              {["low", "medium", "high"].map((p) => (
                <button
                  key={p}
                  onClick={() => setPriority(p)}
                  className={`py-2 rounded-xl border text-sm capitalize transition ${
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

          {/* Due date */}
          <div>
            <label className="text-sm text-white/60">Due Date</label>
            <input
              type="date"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 mt-1"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>

        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 mt-5">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-6 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-800 text-white"
          >
            Create
          </button>
        </div>

      </div>
    </div>
  );
}
