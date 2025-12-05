"use client";

import { useEffect, useRef } from "react";
import ChatBubble from "./ChatBubble";

export default function MessageList({ messages = [], meId, typingUsers = [] }) {
  const listRef = useRef(null);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight + 200;
    }
  }, [messages, typingUsers]);

  return (
    <div ref={listRef} className="flex-1 overflow-auto p-6 space-y-4 bg-gradient-to-b from-[#070316] to-[#0a041e]">
      {messages.map((m) => {
        const id = m.id || m._id || m.tempId;
        return <ChatBubble key={id} msg={m} meId={meId} />;
      })}

      {typingUsers.length > 0 && (
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-[#2b1250] animate-pulse" />
          <div className="bg-[#1b1330] px-4 py-2 rounded-xl text-sm text-white/80">Typing…</div>
        </div>
      )}
    </div>
  );
}
