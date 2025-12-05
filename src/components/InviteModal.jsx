// components/InviteModal.jsx
"use client";
import { useState } from "react";

export default function InviteModal({ open, onClose }) {
  const [email,setEmail]=useState(""); const [role,setRole]=useState("member"); const [msg,setMsg]=useState(""); const [loading,setLoading]=useState(false);

  async function send(){
    setLoading(true); setMsg("");
    try{
      const res = await fetch("/api/invite", { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({ email, role }) });
      const json = await res.json();
      if(!res.ok) throw new Error(json?.error||"Invite failed");
      setMsg("Invitation sent");
      setEmail("");
    }catch(e){ setMsg(e.message); } finally{ setLoading(false); }
  }

  if(!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative w-full max-w-md glass-card p-6 rounded-2xl z-20">
        <h3 className="text-lg font-bold mb-4">Invite Team Member</h3>
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="colleague@example.com" className="w-full p-3 rounded-md bg-white/4 mb-3" />
        <select value={role} onChange={e=>setRole(e.target.value)} className="w-full p-3 rounded-md bg-white/4 mb-4">
          <option value="member">Member</option>
          <option value="admin">Admin</option>
        </select>

        <div className="flex justify-end gap-2">
          <button className="px-4 py-2 rounded-md" onClick={onClose}>Cancel</button>
          <button className="px-4 py-2 rounded-md bg-[var(--primary)] text-white" onClick={send} disabled={loading}>{loading?"Sending...":"Send"}</button>
        </div>

        {msg && <div className="mt-3 text-sm opacity-80">{msg}</div>}
      </div>
    </div>
  );
}
