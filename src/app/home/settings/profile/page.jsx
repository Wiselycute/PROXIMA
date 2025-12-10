"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Camera, User2, Lock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import Link  from 'next/link';
import api from "@/lib/api";
import ProfileImageUpload from "@/components/ProfileImageUpload";

export default function ProfileSettings() {
  const [image, setImage] = useState("/avatar.jpg");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (user.id) {
      setUserId(user.id);
      setName(user.name || "");
      setEmail(user.email || "");
      setImage(user.profileImage || "/avatar.jpg");
    }
  }, []);

  return (
    <div className="min-h-screen flex bg-[var(--background)]">
          <Sidebar />
          <div className="flex-1 bg-[var(--background)]">
            {/* <Topbar    /> */}
    <section className="max-w-5xl mx-auto bg-[var(--background)] ">
      {/* ----------- PAGE TITLE ----------- */}
      <h2 className="text-2xl font-bold mb-4">Profile Settings</h2>

      {/* ----------- GRID ----------- */}
      <div className="grid grid-cols-4 gap-6">

        {/* ---------- LEFT MENU ---------- */}
         <aside className="col-span-1 glass p-4">
                  <ul className="space-y-3 flex flex-col">
                    <Link href="/home/settings/profile" className="py-2 px-3 rounded hover:bg-white/4">Profile Settings</Link>
                    <Link href="/home/settings/preferences" className="py-2 px-3 rounded hover:bg-white/4">Preferences</Link>
                    <Link href="/home/settings/account" className="py-2 px-3 rounded bg-white/6">Account Management</Link>
                    <Link href="/home/settings" className="py-2 px-3 rounded hover:bg-white/4">Team & Permissions</Link>
                  </ul>
                </aside>

        {/* ---------- MAIN FORM ---------- */}
        <div className="col-span-3 glass p-6">
          <h3 className="text-lg font-semibold mb-6">Edit Your Profile</h3>

          {/* ----------- AVATAR ----------- */}
          <div className="flex items-center gap-6 mb-10">
            <ProfileImageUpload 
              currentImage={image} 
              onImageUpdate={(newUrl) => setImage(newUrl)}
            />
            <p className="text-gray-400 text-sm">Click on your profile image to upload a new one. PNG, JPG, GIF — Max 10MB</p>
          </div>

          {/* ----------- FORM FIELDS ----------- */}
          <div className="space-y-6 ">
            {/* Full Name */}
            <div>
              <label className="text-gray-300 text-sm mb-1 flex items-center gap-2">
                <User2 size={16} /> Full Name
              </label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter full name"
                className="bg-white/5 border-white/10 text-white w-full"
              />
            </div>

            {/* Email */}
            <div className="flex flex-col ">
              <label className="text-gray-300 text-sm mb-1 flex items-center gap-2">Email Address</label>
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@gmail.com"
                className="bg-white/5 border-white/10 text-white"
              />
            </div>

            {/* Current Password */}
            <div>
              <label className="text-gray-300 text-sm mb-1 flex items-center gap-2">
                <Lock size={16} /> Current Password
              </label>
              <Input
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                type="password"
                placeholder="Enter current password"
                className="bg-white/5 border-white/10 text-white w-full"
              />
            </div>

            {/* New Password */}
            <div className="flex flex-col">
              <label className="text-gray-300 text-sm mb-1">New Password</label>
              <Input
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                type="password"
                placeholder="Enter new password"
                className="bg-white/5 border-white/10 text-white"
              />
            </div>
          </div>

          {/* ----------- BUTTONS ----------- */}
          <div className="mt-10 flex justify-end gap-3">
            <button className="px-4 py-2 rounded bg-white/6">Cancel</button>
            <button
              onClick={async () => {
                if (!userId) return alert("No user loaded");
                const payload = { name, email };
                if (newPassword) payload.password = newPassword;
                try {
                  await api.put(`/users/${userId}`, payload);
                  alert("Profile updated");
                } catch (err) {
                  console.error(err);
                  alert("Failed to update profile");
                }
              }}
              className="px-4 py-2 rounded btn-neon bg-[#3AB4F2]"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </section>
    </div>
    </div>
  );
}
