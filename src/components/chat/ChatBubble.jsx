"use client";

import Image from "next/image";

export default function ChatBubble({ msg, meId }) {
  const mine = `${msg.sender}` === `${meId}` || `${msg.senderId}` === `${meId}`;
  const time = new Date(msg.createdAt || msg.created_at || Date.now()).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const seenCount = (msg.seenBy || []).length - (mine ? 1 : 0);

  return (
    <div className={`flex items-end ${mine ? "justify-end" : "justify-start"}`}>
      {!mine && <Image src={msg.sender?.avatar || "/avatar2.jpg"} width={36} height={36} className="rounded-full" alt="avatar" />}

      <div className={`${mine ? "bg-gradient-to-r from-[#7B5CFB] to-[#4BE2F2] text-black" : "bg-[#11101a] text-white/90"} px-4 py-3 rounded-xl max-w-[72%] ml-3 mr-3 shadow-sm`}>
        <div className="text-sm">{msg.content}</div>
        <div className="flex items-center gap-2 mt-2 text-[11px]">
          <div className="opacity-70">{time}</div>
          {mine && (
            <div className="flex items-center gap-1">
              {/* simple seen / delivered icons */}
              { (msg.seenBy && msg.seenBy.length > 1) ? (
                <svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 6.5L5 10.5L15 0.5" stroke="#0ea5a1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M1 6.5L5 10.5L7 8.5" stroke="#0ea5a1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              ) : (
                <svg width="14" height="11" viewBox="0 0 14 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 6L5 10L13 2" stroke="#cbd5e1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </div>
          )}
        </div>
      </div>

      {mine && <Image src="/avatar.jpg" width={36} height={36} className="rounded-full" alt="me" />}
    </div>
  );
}
