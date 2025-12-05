"use client";

import Image from "next/image";

export default function ChatSidebar({ chats = [], selectedChat, setSelectedChat, onlineMap = {} }) {
  return (
    <aside className="bg-[#0F0A1A] rounded-2xl p-4 border border-white/6 h-[80vh] overflow-auto">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-lg">Messages</h3>
        <div className="text-sm text-white/60">{chats.length}</div>
      </div>

      <div className="space-y-3">
        {chats.map((c) => {
          const id = c._id || c.id;
          const latest = c.latestMessage?.content || "No messages yet";
          const member = (c.members && c.members[0]) || null;
          const online = member ? !!onlineMap[member._id || member.id] : false;

          return (
            <button key={id} onClick={() => setSelectedChat(id)} className={`w-full text-left p-3 rounded-xl flex items-center gap-3 transition ${selectedChat == id ? "bg-gradient-to-r from-[#7b5cfb]/30 to-[#4be2f2]/10 border border-[#7b5cfb]/20" : "hover:bg-white/3"}`}>
              <div className="relative w-12 h-12 rounded-full overflow-hidden bg-white/5 flex items-center justify-center">
                <Image src={member?.avatar || "/avatar.jpg"} width={48} height={48} alt="avatar" className="rounded-full" />
                <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full ring-1 ring-[#0A041E] ${online ? "bg-green-400" : "bg-gray-500"}`}></span>
              </div>

              <div className="flex-1">
                <div className="flex justify-between items-center gap-2">
                  <div className="font-medium text-sm">{c.title || member?.name || "Project Chat"}</div>
                  <div className="text-xs text-white/50">{c.latestMessage?.createdAt ? new Date(c.latestMessage.createdAt).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}) : ""}</div>
                </div>
                <div className="text-xs text-white/60 truncate max-w-[180px]">{latest}</div>
              </div>
            </button>
          );
        })}
      </div>
    </aside>
  );
}
