"use client";

import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import Link  from 'next/link';
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";

export default function PreferencesPage() {
  const [darkMode, setDarkMode] = useState(true);
  const [emailNotif, setEmailNotif] = useState(true);
  const [soundNotif, setSoundNotif] = useState(false);

  return (
    <div className="min-h-screen flex bg-[var(--background)]">
          <Sidebar />
          <div className="flex-1 bg-[var(--background)]">
            {/* <Topbar   /> */}
    <section className="max-w-5xl mx-auto bg-[var(--background)] ">
      <h2 className="text-2xl font-bold mb-4">Preferences</h2>

      <div className="grid grid-cols-4 gap-6">

        {/* ---------- LEFT MENU ---------- */}
         <aside className="col-span-1  glass p-4">
                  <ul className="space-y-3 flex flex-col">
                    <Link href="/home/settings/profile" className="py-2 px-3 rounded hover:bg-white/4">Profile Settings</Link>
                    <Link href="/home/settings/preferences" className="py-2 px-3 rounded hover:bg-white/4">Preferences</Link>
                    <Link href="/home/settings/account" className="py-2 px-3 rounded bg-white/6">Account Management</Link>
                    <Link href="/home/settings" className="py-2 px-3 rounded hover:bg-white/4">Team & Permissions</Link>
                  </ul>
                </aside>

        {/* ---------- MAIN CONTENT ---------- */}
        <div className="col-span-3 glass p-6">
          <h3 className="text-lg font-semibold mb-6">Customize Your Experience</h3>

          <div className="space-y-8">
            
            {/* Theme */}
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Dark Mode</h4>
                <p className="text-sm opacity-70">Enable dark interface theme</p>
              </div>
              <Switch checked={darkMode} onCheckedChange={setDarkMode} />
            </div>

            {/* Email Notifications */}
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Email Notifications</h4>
                <p className="text-sm opacity-70">Receive updates by email</p>
              </div>
              <Switch checked={emailNotif} onCheckedChange={setEmailNotif} />
            </div>

            {/* Sound Notifications */}
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Sound Alerts</h4>
                <p className="text-sm opacity-70">Play a notification sound</p>
              </div>
              <Switch checked={soundNotif} onCheckedChange={setSoundNotif} />
            </div>

            {/* Language */}
            <div>
              <label className="text-sm opacity-70">Language</label>
              <Input
                placeholder="English (Default)"
                className="bg-white/5 border-white/10 mt-1 text-white"
              />
            </div>

            <div className="flex justify-end gap-3 mt-8">
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
