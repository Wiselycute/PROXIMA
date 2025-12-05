"use client";

import { useState, useRef, useEffect } from "react";
import { PaperPlane } from "lucide-react";

export default function MessageInput({ onSend, onTyping }) {
  const [text, setText] = useState("");
  const typingRef = useRef(false);
  const timeoutRef = useRef(null);

  useEffect(() => {
    return () => clearTimeout(timeoutRef.current);
  }, []);

  const handleChange = (e) => {
    setText(e.target.value);
    if (!typingRef.current) {
      typingRef.current = true;
      onTyping(true);
    }
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      typingRef.current = false;
      onTyping(false);
    }, 900);
  };

  const handleSend = () => {
    if (!text.trim()) return;
    onSend(text.trim());
    setText("");
    typingRef.current = false;
    onTyping(false);
    clearTimeout(timeoutRef.current);
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="px-4 py-3 border-t border-white/6 bg-[#0D0720]">
      <div className="flex items-center gap-3">
        <textarea
          rows={1}
          value={text}
          onChange={handleChange}
          onKeyDown={handleKey}
          placeholder="Type a message"
          className="flex-1 resize-none rounded-xl bg-[#08030f] px-4 py-3 text-sm outline-none placeholder:text-white/40"
        />
        <button onClick={handleSend} className="bg-gradient-to-r from-[#7B5CFB] to-[#4BE2F2] p-3 rounded-full shadow-lg">
          <PaperPlane className="text-white" />
        </button>
      </div>
    </div>
  );
}
