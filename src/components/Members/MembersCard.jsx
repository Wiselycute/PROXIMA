// components/Members/MemberCard.jsx
import Image from "next/image";

export default function MemberCard({ member, onOpen }) {
  const onlineColor = member.status === "online" ? "bg-green-400" : member.status === "away" ? "bg-yellow-400" : "bg-gray-500";
  return (
    <div className="glass-card p-4 rounded-2xl hover-lift transition cursor-pointer" onClick={() => onOpen(member)}>
      <div className="flex items-center gap-3">
        <div className="relative">
          <Image src={member.avatar || "/avatar.jpg"} width={56} height={56} className="rounded-xl" alt={member.name}/>
          <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full ring-1 ring-white ${onlineColor}`} />
        </div>

        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-semibold text-[var(--foreground)]">{member.name}</div>
              <div className="text-xs opacity-60">{member.role}</div>
            </div>
            <div className="text-xs opacity-70 neon-badge/80 px-2 py-1 rounded-full text-[var(--foreground)]" style={{ background: "rgba(255,255,255,0.03)" }}>
              {member.location || "Remote"}
            </div>
          </div>

          <div className="mt-3 flex items-center gap-2 flex-wrap">
            {(member.skills || []).slice(0,3).map((s,i) => (
              <span key={i} className="text-xs px-2 py-1 rounded-full bg-white/6 text-[var(--foreground)]/80">{s}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
