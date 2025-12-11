"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import RoleDropdown from "./RoleDropdown";
import { useToast } from "@/components/ui/ToastProvider";
import  Link  from 'next/link';
import api from "@/lib/api";
import { isAdmin } from "@/lib/auth";

/* mock members */
const MOCK = [
  { id: 1, name: "Alex Morgan", email: "alex@example.com", role: "Admin", avatar: "/team/alex.jpg" },
  { id: 2, name: "Jamie Chen", email: "jamie@example.com", role: "Viewer", avatar: "/team/jamie.jpg" },
  { id: 3, name: "Taylor Swift", email: "taylor@example.com", role: "Member", avatar: "/team/taylor.jpg" },
];

export default function TeamPermissions() {
  const [currentUserIsAdmin, setCurrentUserIsAdmin] = useState(false);
  const [members, setMembers] = useState(() => {
    // try load from localStorage
    try {
      const raw = localStorage.getItem("proxima-members");
      return raw ? JSON.parse(raw) : MOCK;
    } catch { return MOCK; }
  });

  useEffect(() => {
    setCurrentUserIsAdmin(isAdmin());
  }, []);

  useEffect(() => {
    let mounted = true;
    api
      .get("/users")
      .then((res) => {
        if (!mounted) return;
        const data = res.data || [];
        const norm = data.map((u) => ({ id: u._id || u.id, name: u.name || "Unknown", email: u.email || "", role: (u.role || "member").charAt(0).toUpperCase() + (u.role || "member").slice(1), avatar: u.profileImage || "/team/alex.jpg" }));
        setMembers(norm.length ? norm : MOCK);
      })
      .catch((err) => {
        console.warn("TeamPermissions: failed to load users", err);
        setMembers(MOCK);
      });
    return () => { mounted = false; };
  }, []);
  const { push } = useToast();

  async function changeRole(id, role) {
    // map UI role to API role enum (lowercase)
    const apiRole = role.toLowerCase() === "viewer" ? "member" : role.toLowerCase();
    setMembers((m) => {
      const next = m.map((x) => (x.id === id ? { ...x, role } : x));
      try { localStorage.setItem("proxima-members", JSON.stringify(next)); } catch {}
      return next;
    });

    try {
      await api.put(`/users/${id}`, { role: apiRole });
      push({ title: "Role updated", description: `Role set to ${role}`, duration: 2400 });
    } catch (err) {
      console.warn("Failed to update role", err);
      push({ title: "Update failed", description: "Could not update role on server", intent: "error" });
    }
  }

  return (
    <section className="max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold text-[#3AB4F2] p-2">Team & Permissions</h2>

      <div className="grid grid-cols-4 gap-6">
         <aside className="col-span-1 glass p-4">
                  <ul className="space-y-3 flex flex-col">
                    <Link href="/home/settings/profile" className="py-2 px-3 rounded hover:bg-white/4">Profile Settings</Link>
                    <Link href="/home/settings/preferences" className="py-2 px-3 rounded hover:bg-white/4">Preferences</Link>
                    <Link href="/home/settings/account" className="py-2 px-3 rounded bg-white/6">Account Management</Link>
                    <Link href="/home/settings" className="py-2 px-3 rounded hover:bg-white/4">Team & Permissions</Link>
                  </ul>
                </aside>

        <div className="col-span-3 glass p-6">
          <h3 className="text-lg font-semibold mb-4">Team & Permissions</h3>
          <div className="space-y-3">
            {members.map((member) => (
              <div key={member.id} className="flex items-center justify-between p-3 bg-white/3 rounded">
                <div className="flex items-center gap-3">
                  <Image 
                    src={member.avatar} 
                    width={48} 
                    height={48} 
                    className="rounded-full w-12 h-12 object-cover" 
                    alt={member.name} 
                  />
                  <div>
                    <div className="font-medium">{member.name}</div>
                    <div className="text-xs opacity-70">{member.email}</div>
                  </div>
                </div>

                <div>
                  <RoleDropdown 
                  className="bg-[var(--background)] text-white border border-white/10"
                    value={member.role} 
                    onChange={(role) => changeRole(member.id, role)} 
                    currentUserIsAdmin={currentUserIsAdmin}
                  />
                </div>
              </div>
            ))}

            <div className="mt-4">
              <button className="w-full p-3 rounded btn-neon">Invite New Team Member</button>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button className="px-4 py-2 rounded bg-white/6">Cancel</button>
              <button className="px-4 py-2 rounded btn-neon bg-[#3AB4F2]">Save Changes</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
