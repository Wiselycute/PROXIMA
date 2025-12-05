"use client";
import { useState } from "react";
import { X, Trash } from "lucide-react";

export default function ColumnSettingsModal({ open, onClose, column, onRename, onDelete }) {
  const [name, setName] = useState(column?.title || "");

  if (!open) return null;

  const handleRename = () => {
    onRename(name);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-lg flex items-center justify-center z-[300]">
      <div className="bg-[#1B1F36] w-full max-w-sm p-6 rounded-2xl border border-white/10">

        <div className="flex justify-between mb-4">
          <h2 className="text-lg font-semibold">Column Settings</h2>
          <button onClick={onClose}><X /></button>
        </div>

        <input
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Column Name"
        />

        <div className="flex justify-end gap-3 mt-5">
          <button className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl" onClick={onClose}>
            Cancel
          </button>

          <button className="px-4 py-2 bg-blue-600 rounded-xl hover:bg-blue-700" onClick={handleRename}>
            Save
          </button>
        </div>

        <hr className="my-6 border-white/10" />

        <button
          onClick={onDelete}
          className="w-full py-3 bg-red-600 rounded-xl hover:bg-red-700 flex items-center justify-center gap-2"
        >
          <Trash size={16} /> Delete Column
        </button>

      </div>
    </div>
  );
}
