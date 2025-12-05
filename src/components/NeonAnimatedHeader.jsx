"use client";
import Image from "next/image";

export default function NeonAnimatedHeader({ title, subtitle, rightSlot }) {
  return (
    <header className="relative mb-8">
      {/* neon background blob */}
      <div className="pointer-events-none absolute -left-24 -top-12 w-96 h-96 rounded-full"
           style={{
             background: "radial-gradient(circle at 30% 30%, rgba(75,226,242,0.18), transparent 25%, rgba(155,114,207,0.06))",
             filter: "blur(50px)",
             zIndex: -1
           }} />

      <div className="flex items-start justify-between gap-6">
        <div>
          <p className="text-sm text-muted-foreground">Project</p>
          <h1 className="text-3xl md:text-4xl font-extrabold leading-tight">
            {title}
            <span className="ml-3 inline-block align-middle px-3 py-1 rounded-full bg-[#4BE2F2]/8 text-[#4BE2F2] text-sm font-medium" style={{boxShadow:"0 8px 30px rgba(75,226,242,0.06)"}}>
              Active
            </span>
          </h1>
          {subtitle && <p className="mt-2 text-sm text-muted-foreground max-w-xl">{subtitle}</p>}
        </div>

        <div className="ml-auto">
          {rightSlot}
        </div>
      </div>
    </header>
  );
}
