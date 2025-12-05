"use client";

import Image from "next/image";
import { MoreHorizontal } from "lucide-react";

export default function ChatHeader({ chat, onlineMap = {} }) {
  const member = (chat?.members && chat.members[0]) || null;
  const online = member ? !!onlineMap[member._id || member.id] : false;

  return (
    <header className="flex items-center justify-between px-4 py-3 bg-[#0D0720] border-b border-white/6">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full overflow-hidden bg-white/5 flex items-center justify-center">
          <Image src={member?.avatar || "/avatar.jpg"} width={48} height={48} alt="avatar" className="rounded-full" />
        </div>
        <div>
          <div className="font-semibold">{chat?.title || member?.name || "Project Chat"}</div>
          <div className="text-xs text-white/60 flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${online ? "bg-green-400" : "bg-gray-500"}`} />
            {online ? "online" : "offline"}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button className="px-3 py-2 rounded-lg bg-white/5 hover:bg-white/8">
          <MoreHorizontal />
        </button>
      </div>
    </header>
  );
}
