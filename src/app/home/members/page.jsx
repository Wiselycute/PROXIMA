// "use client";

// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { UserPlus } from "lucide-react";
// import MembersList from "@/components/Members/TeamList";
// import InviteMemberModal from "@/components/InviteMemberModal";
// import { useState } from "react";

// export default function MembersPage() {
//   const [open, setOpen] = useState(false);

//   return (
//     <div className="space-y-10">
//       <div className="flex justify-between items-center">
//         <h1 className="text-3xl font-bold">Team Members</h1>

//         <button
//           onClick={() => setOpen(true)}
//           className="px-4 py-2 flex items-center gap-2 rounded-xl bg-[#9B72CF] text-white hover:bg-[#7f5bb9]"
//         >
//           <UserPlus size={18} /> Invite Member
//         </button>
//       </div>

//       <Card className="border-none shadow-sm">
//         <CardHeader>
//           <CardTitle>Team</CardTitle>
//         </CardHeader>

//         <CardContent>
//           <MembersList />
//         </CardContent>
//       </Card>

//       <InviteMemberModal open={open} setOpen={setOpen} />
//     </div>
//   );
// }

"use client";
// src/app/members/page.jsx
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import TeamList from "@/components/Members/TeamList";
import RealtimeChat from "@/components/RealtimeChat";
import InviteModal from "@/components/InviteModal";
import RealtimeMembers from "@/components/RealtimeMembers";
import { useState } from "react";

export default function MembersPage(){
  const [inviteOpen,setInviteOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[var(--background)] flex  text-[var(--foreground)]">
      <Sidebar />
      <div className="flex-1 bg-[var(--background)]">
        <Topbar />
        <main className="flex-1 p-8 overflow-auto bg-[var(--background)] transition-colors duration-300">
        <header className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Team Collaboration</h1>
            <div className="text-sm opacity-60">Manage members, chat, and assign tasks</div>
          </div>

          <div className="flex items-center gap-3">
            <button className="px-4 py-2 rounded-lg bg-[var(--primary)] text-white" onClick={()=>setInviteOpen(true)}>Invite Member</button>
            <div className="text-sm opacity-60">5 online</div>
          </div>
        </header>

        <section className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <input placeholder="Search members..." className="flex-1 p-3 rounded-lg bg-white/4 border" style={{ borderColor: "var(--border)" }} />
              <select className="p-3 rounded-lg bg-white/4 border" style={{ borderColor: "var(--border)" }}>
                <option>All roles</option><option>Admin</option><option>Member</option>
              </select>
            </div>

            <TeamList />
          </div>

          <aside>
            <div className="space-y-6">
              <div className="glass-card p-4 rounded-2xl">
                <h4 className="font-semibold">Status</h4>
                <div className="mt-3 text-sm opacity-70">Online: 5 • Away: 1 • Offline: 3</div>
              </div>

              <RealtimeMembers />
              <RealtimeChat user={{name:"Mostafa"}} />
            </div>
          </aside>
        </section>
      </main>

        <InviteModal open={inviteOpen} onClose={()=>setInviteOpen(false)} />
      </div>
    </div>
  );
}
