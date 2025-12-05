// export default function LandingPage() {
// return (
// <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 to-fuchsia-600 text-white p-10 text-center">
// <div>
// <h1 className="text-5xl font-bold mb-4">Work Better Together</h1>
// <p className="text-lg mb-6 max-w-xl mx-auto">
// TaskFlow helps your team stay organized, productive, and beautifully coordinated.
// </p>
// <a
// href="/dashboard"
// className="px-6 py-3 bg-black/30 rounded-lg border border-white/20 hover:bg-black/40"
// >
// Go to Dashboard
// </a>
// </div>
// </section>
// );
// }
"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export default function HomePage() {
  return (
    <div className="w-full mt-20 flex flex-col items-center text-center">
      <span className="px-4 py-1 rounded-full bg-[#EFE8FF] text-[#7a4deb] text-sm flex items-center gap-1">
        <Sparkles size={14} /> Welcome to Proxima
      </span>

      <h1 className="mt-6 text-5xl font-bold leading-tight text-[#2E0F55]">
        Work Better, <span className="text-[#9B72CF]">Together.</span>
      </h1>

      <p className="mt-4 text-lg text-[#6F6182] max-w-xl">
        A beautiful, modern workspace for tasks, teams, files, and real-time collaboration.
      </p>

      <Link href="/dashboard">
        <Button className="mt-8 px-6 py-5 rounded-xl bg-[#9B72CF] hover:bg-[#7c56ad] text-white">
          Enter Workspace <ArrowRight className="ml-1 h-4 w-4" />
        </Button>
      </Link>

      {/* Hero Image */}
      <div className="w-full max-w-5xl mt-16 rounded-3xl overflow-hidden shadow-xl">
        <img
          src="/hero-preview.png"
          alt="Workspace preview"
          className="w-full object-cover"
        />
      </div>
    </div>
  );
}
