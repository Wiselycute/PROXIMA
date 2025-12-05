"use client";
import { X, Trash } from "lucide-react";

export default function DeleteConfirmationModal({ open, onClose, onConfirm, text = "Are you sure you want to delete this?" }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-lg z-[300] flex items-center justify-center">
      <div className="bg-[#1B1F36] bg-transparent p-6 max-w-sm w-full rounded-2xl border border-white/10">

        <div className="flex justify-between mb-4">
          <h2 className="text-lg font-semibold">Confirm Delete</h2>
          <button onClick={onClose}><X /></button>
        </div>

        <p className="text-white/70">{text}</p>

        <div className="flex justify-end gap-3 mt-6">
          <button className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl" onClick={onClose}>
            Cancel
          </button>

          <button className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-xl flex items-center gap-2"
            onClick={onConfirm}
          >
            <Trash size={16} /> Delete
          </button>
        </div>
      </div>
    </div>
  );
}
