"use client";
import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import DeleteConfirmationModal from "./DeleteConfirmationModal";

/**
 * TaskModal provides:
 * - edit title/description
 * - comments (persist back via onUpdate)
 * - attach files (stored as object URLs)
 * - assignees (simple demo list)
 * - due date
 *
 * onUpdate receives a patch object that will be merged by parent.
 */

const SAMPLE_MEMBERS = [
  { id: "u-1", name: "Alex Morgan", avatar: "/team/alex.jpg" },
  { id: "u-2", name: "Jamie Chen", avatar: "/team/jamie.jpg" },
  { id: "u-3", name: "Taylor Swift", avatar: "/team/taylor.jpg" }
];

import api from "@/lib/api";

export default function TaskModal({ task, onClose, onUpdate, onDelete, members }) {
  const [title, setTitle] = useState(task.title || "");
  const [desc, setDesc] = useState(task.desc || "");
  const [comments, setComments] = useState(task.comments || []);
  const [newComment, setNewComment] = useState("");
  const [attachments, setAttachments] = useState(task.attachments || []);
  const [assignees, setAssignees] = useState(task.assignees || []);
  const [due, setDue] = useState(task.due ? new Date(task.due).toISOString().slice(0, 16) : "");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [userList, setUserList] = useState(members || SAMPLE_MEMBERS);
  const fileRef = useRef();

  useEffect(() => {
    if (!members) {
      api.get("/users").then((res) => {
        const users = res.data || [];
        setUserList(users.length ? users.map(u => ({ id: u._id || u.id, name: u.name, avatar: u.profileImage || "/avatar.jpg" })) : SAMPLE_MEMBERS);
      }).catch(() => setUserList(SAMPLE_MEMBERS));
    }
  }, [members]);

  useEffect(() => {
    setTitle(task.title || "");
    setDesc(task.desc || "");
    setComments(task.comments || []);
    setAttachments(task.attachments || []);
    setAssignees(task.assignees || []);
    setDue(task.due ? new Date(task.due).toISOString().slice(0, 16) : "");
  }, [task]);

  async function handleSave() {
    const patch = {
      title,
      desc,
      comments,
      attachments,
      assignees,
      due: due ? new Date(due).toISOString() : null
    };
    try {
      await api.put(`/tasks/${task._id || task.id}`, patch);
      if (onClose) onClose();
    } catch (e) {
      // Optionally show error toast
    }
  }

  function handleAddComment() {
    if (!newComment.trim()) return;
    const c = { id: `c-${Date.now()}`, text: newComment.trim(), author: "You", time: new Date().toISOString() };
    const next = [...comments, c];
    setComments(next);
    setNewComment("");
  }

  function handleFiles(e) {
    const files = Array.from(e.target.files);
    const next = files.map((f) => ({ id: `a-${Date.now()}-${f.name}`, name: f.name, url: URL.createObjectURL(f) }));
    setAttachments((s) => [...s, ...next]);
    e.target.value = "";
  }

  function toggleAssignee(member) {
    const exists = assignees.find((a) => a.id === member.id);
    if (exists) {
      setAssignees((s) => s.filter((a) => a.id !== member.id));
    } else {
      setAssignees((s) => [...s, member]);
    }
  }

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>

      <div className="relative w-full max-w-3xl glass-card p-6 rounded-2xl z-70">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold">Task details</h3>
          <div className="flex gap-2">
            <button className="px-3 py-1 rounded-md bg-red-600 hover:bg-red-700 text-white" onClick={() => setShowDeleteConfirm(true)}>Delete</button>
            <button className="px-3 py-1 rounded-md bg-[var(--primary)] text-white" onClick={handleSave}>Save</button>
          </div>
        </div>

        <div className="space-y-4">
          <input className="w-full p-3 rounded-md bg-white/4" value={title} onChange={(e) => setTitle(e.target.value)} />
          <textarea className="w-full p-3 rounded-md bg-white/4" rows={4} value={desc} onChange={(e) => setDesc(e.target.value)} />

          {/* assignees */}
          <div>
            <div className="text-sm font-medium mb-2">Assignees</div>
            <div className="flex gap-2 items-center mb-2">
              {userList.map((m) => {
                const active = assignees.find((a) => a.id === m.id || a === m.id);
                return (
                  <button key={m.id} onClick={() => toggleAssignee(m)} className={`flex items-center gap-2 p-2 rounded-md ${active ? "bg-white/6" : "bg-white/3"}`}>
                    <Image src={m.avatar} width={28} height={28} className="rounded-full" alt={m.name} />
                    <div className="text-sm">{m.name}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* due date & attachments */}
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="text-sm font-medium mb-2">Due</div>
              <input type="datetime-local" className="w-full p-2 rounded-md bg-white/4" value={due} onChange={(e) => setDue(e.target.value)} />
            </div>

            <div className="w-1/3">
              <div className="text-sm font-medium mb-2">Attachments</div>
              <div className="flex items-center gap-2">
                <input ref={fileRef} type="file" multiple onChange={handleFiles} className="hidden" id="file-input-modal" />
                <label htmlFor="file-input-modal" className="px-3 py-2 rounded-md bg-white/6 cursor-pointer">Upload</label>
                <div className="flex gap-2 flex-wrap">
                  {attachments.map((a) => (
                    <a key={a.id} href={a.url} target="_blank" rel="noreferrer" className="px-2 py-1 rounded-md bg-white/4 text-xs">
                      {a.name}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* comments */}
          <div>
            <div className="text-sm font-medium mb-2">Comments</div>
            <div className="space-y-2 max-h-40 overflow-y-auto p-2 bg-white/3 rounded-md">
              {comments.length === 0 && <div className="opacity-60 text-sm">No comments yet</div>}
              {comments.map((c) => (
                <div key={c.id} className="text-sm">
                  <div className="font-semibold">{c.author} <span className="text-xs opacity-60 ml-2">{new Date(c.time).toLocaleString()}</span></div>
                  <div className="opacity-80">{c.text}</div>
                </div>
              ))}
            </div>

            <div className="mt-3 flex gap-2">
              <input value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="Write a comment..." className="flex-1 p-2 rounded-md bg-white/4" />
              <button className="px-3 py-2 rounded-md bg-[var(--primary)] text-white" onClick={handleAddComment}>Comment</button>
            </div>
          </div>
        </div>

        <button onClick={onClose} className="absolute top-4 right-4 text-xs opacity-70">Close</button>
      </div>

      <DeleteConfirmationModal
        open={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        text={`Are you sure you want to delete "${task.title}"? This cannot be undone.`}
        onConfirm={async () => {
          try {
            await api.delete(`/tasks/${task._id || task.id}`);
            if (onClose) onClose();
          } catch (e) {
            // Optionally show error toast
          }
          setShowDeleteConfirm(false);
        }}
      />
    </div>
  );
}
// "use client";
// import React, { useRef, useState } from "react";

// export default function TaskModal({ task, onClose, onUpdate, onDelete }) {
//   const [title, setTitle] = useState(task.title || "");
//   const [desc, setDesc] = useState(task.desc || "");
//   const [comments, setComments] = useState(task.comments || []);
//   const [newComment, setNewComment] = useState("");
//   const [attachments, setAttachments] = useState(task.attachments || []);
//   const fileRef = useRef();

//   function handleSave() {
//     onUpdate({ title, desc, comments, attachments });
//     onClose();
//   }

//   function handleAddComment() {
//     if (!newComment.trim()) return;
//     const c = { id: `c-${Date.now()}`, text: newComment.trim(), author: "You", time: new Date().toISOString() };
//     const next = [...comments, c];
//     setComments(next);
//     setNewComment("");
//   }

//   function handleFiles(e) {
//     const files = Array.from(e.target.files);
//     // store as object urls (client-only)
//     const next = files.map(f => ({ id:`a-${Date.now()}-${f.name}`, name: f.name, url: URL.createObjectURL(f) }));
//     setAttachments((s) => [...s, ...next]);
//     // clear input
//     e.target.value = "";
//   }

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
//       <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
//       <div className="relative w-full max-w-2xl bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6 z-20">
//         <div className="flex items-center justify-between mb-4">
//           <h3 className="text-lg font-bold">Task details</h3>
//           <div className="flex gap-2">
//             <button className="px-3 py-1 rounded-md" onClick={() => { onDelete(); }}>Delete</button>
//             <button className="px-3 py-1 rounded-md bg-[var(--primary)] text-white" onClick={handleSave}>Save</button>
//           </div>
//         </div>

//         <div className="space-y-4">
//           <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full p-3 rounded-md bg-white/4" />
//           <textarea value={desc} onChange={(e) => setDesc(e.target.value)} rows={3} className="w-full p-3 rounded-md bg-white/4" />

//           {/* attachments */}
//           <div>
//             <div className="text-sm font-medium mb-2">Attachments</div>
//             <div className="flex gap-3 items-center">
//               <input ref={fileRef} type="file" multiple onChange={handleFiles} className="hidden" id="file-input" />
//               <label htmlFor="file-input" className="px-3 py-2 rounded-md bg-white/6 cursor-pointer">Upload</label>
//               <div className="flex gap-2">
//                 {attachments.map(a => (
//                   <a key={a.id} href={a.url} target="_blank" rel="noreferrer" className="px-2 py-1 rounded-md bg-white/4 text-xs">{a.name}</a>
//                 ))}
//               </div>
//             </div>
//           </div>

//           {/* comments */}
//           <div>
//             <div className="text-sm font-medium mb-2">Comments</div>
//             <div className="space-y-2 max-h-40 overflow-y-auto p-2 bg-white/3 rounded-md">
//               {comments.map(c => (
//                 <div key={c.id} className="text-sm">
//                   <div className="font-semibold">{c.author} <span className="text-xs opacity-60 ml-2">{new Date(c.time).toLocaleString()}</span></div>
//                   <div className="opacity-80">{c.text}</div>
//                 </div>
//               ))}
//             </div>

//             <div className="mt-3 flex gap-2">
//               <input value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="Write a comment..." className="flex-1 p-2 rounded-md bg-white/4" />
//               <button className="px-3 py-2 rounded-md bg-[var(--primary)] text-white" onClick={handleAddComment}>Comment</button>
//             </div>
//           </div>
//         </div>

//         <button onClick={onClose} className="absolute top-4 right-4 text-xs opacity-70">Close</button>
//       </div>
//     </div>
//   );
// }
