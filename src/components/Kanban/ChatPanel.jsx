"use client";
import { useState } from "react";

export default function ChatPanel(){
  const [msgs,setMsgs] = useState([{id:1,text:"Hi! How's project?",from:"other",time:"10:15 AM"},{id:2,text:"Good, done with milestone.",from:"me",time:"10:17 AM"}]);
  const [val,setVal] = useState("");
  function send(){ if(!val) return; setMsgs(m=>[...m,{id:Date.now(),text:val,from:"me",time:"Now"}]); setVal(""); }
  return (
    <div className="card-glass p-4 flex flex-col h-[600px]">
      <div className="flex-1 overflow-y-auto space-y-3 mb-3">
        {msgs.map(m=>(
          <div key={m.id} className={`max-w-[70%] p-3 rounded-xl ${m.from==="me"?"ml-auto bg-primary text-primary-foreground":"bg-card"}`}>
            <div>{m.text}</div>
            <div className="text-xs text-muted-foreground mt-1">{m.time}</div>
          </div>
        ))}
      </div>
      <div className="flex gap-3">
        <input value={val} onChange={e=>setVal(e.target.value)} className="flex-1 p-3 rounded-xl bg-input" placeholder="Type your message..." />
        <button onClick={send} className="px-4 py-2 rounded-xl bg-primary text-primary-foreground">Send</button>
      </div>
    </div>
  );
}
