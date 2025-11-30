"use client";

import { Plus, Search, MoreHorizontal, Sparkles } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";

// --- Shared card style shortcut ---
const glass = `
  bg-[color-mix(in_srgb,var(--card)90%,transparent)]
  border border-[color-mix(in_srgb,var(--border)70%,transparent)]
  backdrop-blur-xl
`;

function StatCard({ label, value, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className={`${glass} p-4 rounded-xl shadow-[0_0_40px_rgba(0,0,0,0.15)]`}
    >
      <div className="text-xs opacity-70">{label}</div>
      <div className="text-xl font-bold mt-2 tracking-tight">{value}</div>
    </motion.div>
  );
}

function KanbanColumn({ title, accent, items, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className={`${glass} rounded-2xl p-5 shadow-[0_0_45px_rgba(0,0,0,0.17)] relative overflow-hidden`}
    >
      {/* Neon Accent Line */}
      <div
        className="absolute top-0 left-0 h-full w-1 opacity-60"
        style={{ background: accent }}
      />

      <h4 className="font-semibold mb-4 tracking-tight flex items-center gap-2">
        <span
          className="inline-block w-2 h-2 rounded-full"
          style={{ background: accent }}
        />
        {title}
      </h4>

      {/* Tasks */}
      <div className="space-y-3">
        {items.map((it, i) => (
          <div
            key={i}
            className={`
              bg-[color-mix(in_srgb,var(--background)10%,transparent)]
              border border-[color-mix(in_srgb,var(--border)60%,transparent)]
              p-4 rounded-xl
              shadow-[0_0_30px_rgba(0,0,0,0.08)]
              hover:shadow-[0_0_45px_rgba(0,0,0,0.15)]
              transition
            `}
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="font-medium text-sm">{it.title}</div>
                <div className="text-xs opacity-60 mt-1">{it.meta}</div>
              </div>
              <div
                className="px-2 py-1 text-[10px] rounded-lg font-semibold"
                style={{
                  background: `${accent}22`,
                  color: accent,
                }}
              >
                {it.badge}
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

export default function DashboardPreview() {
  const neonBlue = "#4BE2F2";
  const neonPurple = "#9B72CF";
  const neonAqua = "#3AB4F2";

  const todo = [
    { title: "Design Task UI", meta: "Due tomorrow", badge: "2" },
    { title: "Write tests", meta: "Due in 2d", badge: "3" },
  ];
  const inProgress = [
    { title: "API Integration", meta: "Blocked", badge: "4" },
    { title: "Landing copy", meta: "Review", badge: "1" },
  ];
  const done = [
    { title: "Auth flow", meta: "Completed", badge: "5" },
    { title: "Set up DB", meta: "Completed", badge: "2" },
  ];

  return (
    <section className="py-24 relative overflow-hidden bg-background">
      {/* Glow background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(75,226,242,0.16),transparent_60%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-10 relative">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <motion.h3
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="text-2xl font-extrabold tracking-tight flex items-center gap-2"
          >
            <Sparkles size={18} className="text-[var(--primary)]" />
            Dashboard Preview
          </motion.h3>

          <div className="flex items-center gap-3">
            <button
              className={`${glass} p-2 rounded-lg shadow-md hover:bg-white/10 transition`}
            >
              <Search size={16} />
            </button>
            <button className="p-2 rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)] shadow-[0_0_20px_rgba(0,0,0,0.2)]">
              <Plus size={16} />
            </button>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard label="Active tasks" value={87} delay={0.05} />
              <StatCard label="Teams" value={12} delay={0.1} />
              <StatCard label="Completed" value={430} delay={0.15} />
              <StatCard label="Users" value={98} delay={0.2} />
            </div>

            {/* Kanban */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <KanbanColumn
                title="To Do"
                items={todo}
                accent={neonPurple}
                delay={0.25}
              />
              <KanbanColumn
                title="In Progress"
                items={inProgress}
                accent={neonBlue}
                delay={0.35}
              />
              <KanbanColumn
                title="Done"
                items={done}
                accent={neonAqua}
                delay={0.45}
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className={`${glass} p-6 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.2)]`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm opacity-75">Your plan</div>
                  <div className="text-lg font-bold">Pro — Team</div>
                </div>
                <div className="text-sm opacity-75">Active</div>
              </div>
              <p className="mt-4 text-xs opacity-60 leading-relaxed">
                Everything your 10-person team needs to collaborate and execute
                effortlessly.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className={`${glass} p-6 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.2)]`}
            >
              <div className="text-sm opacity-75">Recent activity</div>
              <p className="mt-3 text-xs opacity-60">
                Alice moved <strong>“Design Task UI”</strong> to In Progress.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
