"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import  Link  from 'next/link';
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import { useState, useEffect } from "react";
import api from "@/lib/api";

export default function AccountManagementPage() {
  const [userId, setUserId] = useState(null);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    let mounted = true;
    api.get("/users").then((res) => {
      if (!mounted) return;
      const list = res.data || [];
      if (list.length) {
        const u = list[0];
        setUserId(u._id || u.id);
        setUsername(u.name || "");
        setEmail(u.email || "");
      }
    }).catch((err) => console.warn("Account: failed to load user", err));
    return () => { mounted = false; };
  }, []);
  return (
    <div className="min-h-screen flex bg-[var(--background)]">
              <Sidebar />
              <div className="flex-1 bg-[var(--background)]">
                {/* <Topbar   /> */}
    <section className="max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold text-[#3AB4F2] p-4">Account Management</h2>

      <div className="grid grid-cols-4 gap-6">

        {/* ---------- SIDEBAR ---------- */}
        <aside className="col-span-1 glass p-4">
          <ul className="space-y-3 flex flex-col">
            <Link href="/home/settings/profile" className="py-2 px-3 rounded hover:bg-white/4">Profile Settings</Link>
            <Link href="/home/settings/preferences" className="py-2 px-3 rounded hover:bg-white/4">Preferences</Link>
            <Link href="/home/settings/account" className="py-2 px-3 rounded bg-white/6">Account Management</Link>
            <Link href="/home/settings" className="py-2 px-3 rounded hover:bg-white/4">Team & Permissions</Link>
          </ul>
        </aside>

        {/* ---------- MAIN ---------- */}
        <div className="col-span-3 glass p-6">
          <h3 className="text-lg font-semibold mb-6">Manage Your Account</h3>

          <div className="space-y-8">

            {/* Username */}
            <div className="flex flex-col">
              <label className="text-sm opacity-70">Username</label>
              <Input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="yourusername"
                className="bg-white/5 border-white/10 mt-1 text-white"
              />
            </div>

            {/* Email */}
            <div className="flex flex-col">
              <label className="text-sm opacity-70">Email</label>
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="bg-white/5 border-white/10 mt-1 text-white"
              />
            </div>

            {/* Delete Button */}
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
              <h4 className="font-semibold text-red-400">Warning!!!</h4>
              <p className="text-sm opacity-70 mb-4">
                Deleting your account is permanent and cannot be undone.
              </p>

              <Button
                onClick={async () => {
                  if (!userId) return alert("No user loaded");
                  if (!confirm("Delete account? This cannot be undone.")) return;
                  try {
                    await api.delete(`/users/${userId}`);
                    alert("Account deleted (client only). Refresh to update.");
                  } catch (err) {
                    console.error(err);
                    alert("Failed to delete account");
                  }
                }}
                className="bg-red-600 hover:bg-red-500 px-4"
              >
                Delete My Account
              </Button>
            </div>

            <div className="flex justify-end gap-3">
              <button className="px-4 py-2 rounded bg-white/6">Cancel</button>
              <button className="px-4 py-2 rounded btn-neon bg-[#3AB4F2]">Save Changes</button>
            </div>

          </div>
        </div>
      </div>
    </section>
    </div>
    </div>
  );
}