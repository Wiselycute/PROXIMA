// components/Members/MemberProfile.jsx
import Image from "next/image";

export default function MemberProfile({ member, onClose }) {
  if (!member) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-3xl glass-card p-6 rounded-2xl z-60">
        <div className="flex items-start gap-6">
          <Image src={member.avatar || "/avatar.jpg"} width={96} height={96} className="rounded-2xl" alt={member.name} />
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-[var(--foreground)]">{member.name}</h3>
                <div className="text-sm opacity-70">{member.role}</div>
              </div>
              <div><div className="neon-badge">Online</div></div>
            </div>

            <p className="mt-4 text-sm opacity-80">{member.bio || "Passionate about great product design and delightful experiences."}</p>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="p-3 rounded-lg bg-white/3">
                <div className="text-xs opacity-70">Tasks Assigned</div>
                <div className="font-bold text-lg mt-1">12</div>
              </div>
              <div className="p-3 rounded-lg bg-white/3">
                <div className="text-xs opacity-70">Active Projects</div>
                <div className="font-bold text-lg mt-1">3</div>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button className="px-4 py-2 rounded-lg neon-badge">Message</button>
              <button className="px-4 py-2 rounded-lg border" style={{ borderColor: "var(--border)" }}>Assign Task</button>
            </div>
          </div>
        </div>

        <button onClick={onClose} className="absolute top-4 right-4 text-sm opacity-70">Close</button>
      </div>
    </div>
  );
}
