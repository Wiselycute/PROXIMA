"use client";
import { useState } from "react";
import { X } from "lucide-react";

export default function AddCommentModal({ open, onClose, onCreate }) {
  const [text, setText] = useState("");

  if (!open) return null;

  const handleSubmit = () => {
    onCreate({ text });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-md z-[200] flex items-center justify-center">
      <div className="bg-[#1B1F36] p-6 w-full max-w-md rounded-2xl border border-white/10 animate-in zoom-in">

        <div className="flex justify-between mb-3">
          <h2 className="text-lg font-semibold">Add Comment</h2>
          <button onClick={onClose}><X /></button>
        </div>

        <textarea
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 min-h-[100px]"
          placeholder="Write a comment..."
          value={text}
          onChange={(e) => setText(e.target.value)}
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
            Comment
          </button>
        </div>

      </div>
    </div>
  );
}
