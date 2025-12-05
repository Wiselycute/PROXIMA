// components/RealtimeChat.jsx
"use client";
import { useEffect, useState, useRef } from "react";
import Pusher from "pusher-js";

export default function RealtimeChat({ channelName="proxima-channel", user={id:"u-1",name:"You"} }) {
  const [messages,setMessages]=useState(() => {
    try {
      if (typeof window === "undefined") return [];
      return JSON.parse(localStorage.getItem("proxima-chat") || "[]");
    } catch (e) {
      return [];
    }
  });
  const [text,setText]=useState("");
  const boxRef = useRef(null);
  const pusherRef = useRef(null);

  useEffect(()=>{ localStorage.setItem("proxima-chat", JSON.stringify(messages)); boxRef.current?.scrollTo({ top: boxRef.current.scrollHeight, behavior:"smooth" }); }, [messages]);

  useEffect(()=>{
    if(process.env.NEXT_PUBLIC_PUSHER_KEY){
      pusherRef.current = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY, { cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER });
      const ch = pusherRef.current.subscribe(channelName);
      ch.bind("new-message", (data)=> setMessages(m=>[...m,data]));
      return ()=> { pusherRef.current.unsubscribe(channelName); pusherRef.current.disconnect(); };
    } else {
      // fallback: listen to storage events from other tabs
      function onStorage(e){ if(e.key==="proxima-chat") setMessages(JSON.parse(e.newValue||"[]")); }
      window.addEventListener("storage", onStorage);
      return ()=> window.removeEventListener("storage", onStorage);
    }
  }, []);

  async function send(){
    if(!text.trim()) return;
    const msg = { from:user.name, text, time: new Date().toISOString() };
    // If pusher env available - send to server to trigger, else update localStorage and state
    if(process.env.NEXT_PUBLIC_PUSHER_KEY){
      await fetch("/api/pusher/send", { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({ channel: channelName, event: "new-message", payload: msg })});
    } else {
      const next = [...messages, msg];
      setMessages(next);
      localStorage.setItem("proxima-chat", JSON.stringify(next));
    }
    setText("");
  }

  return (
    <div className="glass-card p-4 rounded-2xl flex flex-col h-96">
      <div ref={boxRef} className="flex-1 overflow-y-auto space-y-3 p-2">
        {messages.map((m,i)=>(
          <div key={i} className={`max-w-[70%] p-3 rounded-xl ${m.from===user.name ? "ml-auto bg-[linear-gradient(90deg,var(--primary),var(--accent))] text-black" : "bg-white/4 text-[var(--foreground)]"}`}>
            <div className="text-xs opacity-70">{m.from}</div>
            <div className="mt-1">{m.text}</div>
            <div className="text-xs opacity-50 mt-2">{new Date(m.time).toLocaleTimeString()}</div>
          </div>
        ))}
      </div>

      <div className="mt-3 flex gap-2">
        <input value={text} onChange={e=>setText(e.target.value)} placeholder="Type a message..." className="flex-1 p-3 rounded-lg bg-white/4" />
        <button onClick={send} className="px-4 py-2 rounded-lg neon-badge">Send</button>
      </div>
    </div>
  );
}
