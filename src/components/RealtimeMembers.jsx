"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Pusher from "pusher-js";

const USE_PUSHER = false; // set true if you have Pusher keys and server emitting presence

export default function RealtimeMembers({ channel = "proxima-presence" }) {
  const [members, setMembers] = useState([
    { id: "u1", name: "Alex Morgan", avatar: "/avatars/1.png", status: "online" },
    { id: "u2", name: "Jamie Chen", avatar: "/avatars/2.png", status: "online" },
    { id: "u3", name: "Taylor Swift", avatar: "/avatars/3.png", status: "offline" }
  ]);

  useEffect(() => {
    if (USE_PUSHER && process.env.NEXT_PUBLIC_PUSHER_KEY) {
      const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY, { cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER });
      const ch = pusher.subscribe(channel);

      ch.bind("presence-update", (payload) => {
        setMembers(payload.members);
      });

      return () => {
        pusher.unsubscribe(channel);
      };
    } else {
      // local simulation: every 6s toggle one member
      const idCycle = ["u1","u2","u3"];
      let idx = 0;
      const t = setInterval(() => {
        setMembers(prev => {
          const copy = prev.map(m => ({...m}));
          copy[idx].status = copy[idx].status === "online" ? "away" : "online";
          idx = (idx + 1) % copy.length;
          return copy;
        });
      }, 6000);

      return () => clearInterval(t);
    }
  }, [channel]);

  return (
    <div className="space-y-3">
      {members.map(m => (
        <div key={m.id} className="flex items-center justify-between p-3 rounded-lg bg-card border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden">
              <Image src={m.avatar} width={40} height={40} alt={m.name} />
            </div>
            <div>
              <div className="font-medium">{m.name}</div>
              <div className="text-xs text-muted-foreground">{m.status}</div>
            </div>
          </div>

          <span className={`inline-block w-3 h-3 rounded-full ${m.status === "online" ? "bg-green-400" : m.status==="away" ? "bg-yellow-400":"bg-gray-400"}`} />
        </div>
      ))}
    </div>
  );
}
