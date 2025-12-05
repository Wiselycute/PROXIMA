"use client";
import { useState } from "react";
import { X } from "lucide-react";

export default function AddProjectModal({ open, onClose, onCreate }) {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");

  if (!open) return null;

  const handleSubmit = async () => {
    try {
      const payload = { name, description: desc };
      const api = (await import("@/lib/api")).default;
      await api.post("/projects", payload);
      if (onClose) onClose();
    } catch (e) {
      // Optionally show error toast
    }
  };

  return (
    <div className="fixed inset-0 z-[200] bg-black/50 backdrop-blur-md flex items-center justify-center">
      <div className="bg-[#15182A] bg-transparent p-6 rounded-2xl w-full max-w-md border border-white/10 animate-in fade-in duration-150">

        <div className="flex justify-between mb-4">
          <h2 className="text-xl font-semibold">Create New Project</h2>
          <button onClick={onClose}><X /></button>
        </div>

        <div className="space-y-4">
          <input
            className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 w-full"
            placeholder="Project Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <textarea
            className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 w-full min-h-[100px]"
            placeholder="Description..."
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          />
        </div>

        <div className="mt-5 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white/5 rounded-xl border border-white/10"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="px-5 py-2 bg-blue-600 rounded-xl hover:bg-blue-700"
          >
            Create
          </button>
        </div>

      </div>
    </div>
  );
}
