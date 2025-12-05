"use client";
import { useState } from "react";
import { X } from "lucide-react";

export default function AddColumnModal({ open, onClose, onCreate }) {
  const [title, setTitle] = useState("");

  if (!open) return null;

  const handleSubmit = () => {
    onCreate({ title });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[200] bg-black/50 backdrop-blur-md flex items-center justify-center">
      <div className="bg-[#15182A] w-full max-w-sm p-6 rounded-2xl border border-white/10">

        <div className="flex justify-between mb-4">
          <h2 className="text-lg font-semibold">Add Column</h2>
          <button onClick={onClose}><X /></button>
        </div>

        <input
          className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 w-full"
          placeholder="Column name (e.g. To Do)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

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
