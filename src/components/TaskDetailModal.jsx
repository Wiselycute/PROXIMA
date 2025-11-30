"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function TaskDetailModal({ taskId, onClose }) {
  const [task, setTask] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  useEffect(()=>{ async function load(){ const res = await axios.get(`/api/tasks/${taskId}`); setTask(res.data); const c = await axios.get(`/api/tasks/${taskId}/comments`); setComments(c.data); } load(); }, [taskId]);

  async function postComment() {
    if (!newComment.trim()) return;
    await axios.post("/api/comments", { taskId, author: "SOME_USER_ID", text: newComment });
    setNewComment("");
    const c = await axios.get(`/api/tasks/${taskId}/comments`); setComments(c.data);
  }

  if (!task) return null;
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white w-[720px] rounded p-6">
        <button className="ml-auto" onClick={onClose}>Close</button>
        <h2 className="text-xl font-bold">{task.title}</h2>
        <p className="text-gray-600">{task.description}</p>
        <div className="mt-4">
          <h4 className="font-semibold">Comments</h4>
          <div className="space-y-2 max-h-48 overflow-auto my-2">
            {comments.map(c => (
              <div key={c._id} className="border p-2 rounded">
                <div className="text-sm text-gray-700">{c.text}</div>
                <div className="text-xs text-gray-400">{new Date(c.createdAt).toLocaleString()}</div>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input value={newComment} onChange={e=>setNewComment(e.target.value)} className="flex-1 border p-2 rounded"/>
            <button className="bg-blue-600 text-white px-3 py-2 rounded" onClick={postComment}>Send</button>
          </div>
        </div>
      </div>
    </div>
  );
}
