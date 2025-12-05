// components/Members/TeamList.jsx
"use client";
import { useState, useEffect } from "react";
import MemberProfile from "./MemberProfile";
import MemberCard from './MembersCard';
import api from "@/lib/api";

const MOCK = [
  { id:1, name:"Alex Morgan", role:"Admin", status:"online", skills:["React","UX"], avatar:"/team/alex.jpg", location:"NY" },
  { id:2, name:"Jamie Chen", role:"Member", status:"online", skills:["Figma","Design"], avatar:"/team/jamie.jpg" },
  { id:3, name:"Taylor Swift", role:"Member", status:"offline", skills:["Node","API"], avatar:"/team/taylor.jpg" },
  { id:4, name:"Riley Johnson", role:"Member", status:"away", skills:["QA","Testing"], avatar:"/team/riley.jpg" },
];

export default function TeamList({ members: initialMembers = [] }) {
  const [members, setMembers] = useState(initialMembers.length ? initialMembers : MOCK);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    let mounted = true;
    api
      .get("/users")
      .then((res) => {
        if (!mounted) return;
        const data = res.data || [];
        // normalize id fields
        const norm = data.map((u) => ({ ...(u || {}), id: u._id || u.id }));
        setMembers(norm.length ? norm : MOCK);
      })
      .catch((err) => {
        console.warn("Failed to load users, falling back to mock:", err);
        setMembers(MOCK);
      });
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <>
      <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-6">
        {members.map((m) => (
          <MemberCard key={m.id || m._id} member={m} onOpen={setSelected} />
        ))}
      </div>
      {selected && <MemberProfile member={selected} onClose={() => setSelected(null)} />}
    </>
  );
}
