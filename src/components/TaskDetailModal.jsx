// "use client";
// import React, { useEffect, useState } from "react";
// import axios from "axios";

// export default function TaskDetailModal({ taskId, onClose }) {
//   const [task, setTask] = useState(null);
//   const [comments, setComments] = useState([]);
//   const [newComment, setNewComment] = useState("");

//   useEffect(()=>{ async function load(){ const res = await axios.get(`/api/tasks/${taskId}`); setTask(res.data); const c = await axios.get(`/api/tasks/${taskId}/comments`); setComments(c.data); } load(); }, [taskId]);

//   async function postComment() {
//     if (!newComment.trim()) return;
//     await axios.post("/api/comments", { taskId, author: "SOME_USER_ID", text: newComment });
//     setNewComment("");
//     const c = await axios.get(`/api/tasks/${taskId}/comments`); setComments(c.data);
//   }

//   if (!task) return null;
//   return (
//     <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
//       <div className="bg-white w-[720px] rounded p-6">
//         <button className="ml-auto" onClick={onClose}>Close</button>
//         <h2 className="text-xl font-bold">{task.title}</h2>
//         <p className="text-gray-600">{task.description}</p>
//         <div className="mt-4">
//           <h4 className="font-semibold">Comments</h4>
//           <div className="space-y-2 max-h-48 overflow-auto my-2">
//             {comments.map(c => (
//               <div key={c._id} className="border p-2 rounded">
//                 <div className="text-sm text-gray-700">{c.text}</div>
//                 <div className="text-xs text-gray-400">{new Date(c.createdAt).toLocaleString()}</div>
//               </div>
//             ))}
//           </div>
//           <div className="flex gap-2">
//             <input value={newComment} onChange={e=>setNewComment(e.target.value)} className="flex-1 border p-2 rounded"/>
//             <button className="bg-blue-600 text-white px-3 py-2 rounded" onClick={postComment}>Send</button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
import { X, Send, Paperclip, Smile } from 'lucide-react';

export default function TaskDetailModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm transition-opacity">
      {/* Slide-over Panel */}
      <div className="w-full md:w-[500px] h-full bg-[#161b22] border-l border-white/10 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="p-6 border-b border-white/5 flex justify-between items-start">
            <div>
                <span className="text-[10px] font-bold text-orange-400 bg-orange-400/10 px-2 py-1 rounded-full border border-orange-400/20">MEDIUM PRIORITY</span>
                <h2 className="text-xl font-bold text-white mt-3">Integrate Stripe API</h2>
                <p className="text-slate-400 text-sm mt-1">in list <span className="text-violet-400">In Progress</span></p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors"><X size={20} className="text-slate-400" /></button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Description */}
            <div className="bg-slate-800/30 p-4 rounded-2xl border border-white/5">
                <p className="text-slate-300 text-sm leading-relaxed">
                    We need to implement the payment gateway using Stripe's new intent API. Make sure to handle webhooks for failed payments.
                </p>
            </div>

            {/* The "WhatsApp" Style Activity Feed */}
            <div className="space-y-4">
                <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-500 shrink-0" />
                    <div>
                        <div className="bg-slate-800 p-3 rounded-2xl rounded-tl-none text-sm text-slate-200 inline-block border border-white/5">
                            I've generated the API keys, they are in the secure vault. 🔑
                        </div>
                        <span className="text-[10px] text-slate-500 ml-1 block mt-1">10:23 AM</span>
                    </div>
                </div>

                <div className="flex gap-3 flex-row-reverse">
                    <div className="w-8 h-8 rounded-full bg-purple-500 shrink-0" />
                    <div className="text-right">
                        <div className="bg-violet-600 p-3 rounded-2xl rounded-tr-none text-sm text-white inline-block shadow-lg shadow-violet-600/20">
                            Got it! Starting the implementation now.
                        </div>
                        <span className="text-[10px] text-slate-500 mr-1 block mt-1">10:25 AM</span>
                    </div>
                </div>
            </div>
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-white/5 bg-[#0B0E14]">
            <div className="relative flex items-center gap-2">
                <button className="p-2 text-slate-400 hover:text-white"><Paperclip size={20} /></button>
                <input 
                    type="text" 
                    placeholder="Write a comment..." 
                    className="flex-1 bg-slate-800/50 border border-white/10 rounded-full py-3 px-4 text-sm text-white focus:outline-none focus:border-violet-500 transition-colors placeholder:text-slate-500"
                />
                <button className="p-2.5 bg-violet-600 hover:bg-violet-500 text-white rounded-full shadow-lg shadow-violet-600/30 transition-all hover:scale-105">
                    <Send size={18} />
                </button>
            </div>
        </div>

      </div>
    </div>
  );
}