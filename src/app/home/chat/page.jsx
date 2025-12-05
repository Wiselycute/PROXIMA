"use client";

import RealtimeChat from "@/components/RealtimeChat";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";

export default function ChatPage() {
  return (
    <div className="min-h-screen flex bg-[var(--background)] text-[var(--foreground)]">
      <Sidebar />
      <div className="flex-1">
        <Topbar />
        <main className="p-8">
          <div className="space-y-6">
            <h1 className="text-3xl font-bold mb-4">Team Chat</h1>

            <div className="max-w-3xl">
              <RealtimeChat channelName="proxima-team" />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
