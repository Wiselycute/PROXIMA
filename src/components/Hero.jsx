"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { Mail, Phone, Calendar, Clock,  } from "lucide-react";
import Link from "next/link";

export default function Hero() {
    return (
    <header className="hero-shell bg-[var(--background)] text-[var(--foreground)]">
      {/* decorative glows */}
      <div className="hero-left-glow" aria-hidden />
      <div className="hero-right-vignette" aria-hidden />

      <div className="relative z-20 max-w-7xl mx-auto px-6 md:px-12 lg:px-16 py-24 grid lg:grid-cols-2 gap-12 items-start">
        {/* LEFT COLUMN: copy */}
        <div className="space-y-6 max-w-xl">
          <div className="flex items-center gap-3 text-sm opacity-80">
            <span
              className="inline-block w-2.5 h-2.5 rounded-full text-primary"
              style={{ background: "var(--primary)" }}
            />
            <span>PROXIMA-Powered task manager</span>
          </div>

          <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold leading-tight">
            Lighting the <br />
            Way with <span style={{ color: "var(--accent)" }}>PROXIMA</span> for <br />
            Team Excellence
          </h1>

          <p className="text-[12px] max-w-md opacity-80">
            Leverage PROXIMA to streamline your workflow and illuminate your team’s path to achieving remarkable results.
          </p>

          <div className="flex flex-wrap gap-4 mt-4">
            <Link
              href="/auth/signup"
              className="inline-flex items-center px-6 py-3 rounded-full font-semibold shadow-lg"
              style={{
                background: "var(--primary)",
                color: "var(--primary-foreground)",
              }}
            >
             GET STARTED
            </Link>

            <a
              href="#demo"
              className="inline-flex items-center px-5 py-3 rounded-full border"
              style={{
                borderColor: "color-mix(in oklch, var(--primary) 16%, var(--border) 84%)",
                color: "var(--foreground)",
                background: "transparent",
              }}
            >
              Request a Demo →
            </a>
          </div>
        </div>

        {/* RIGHT COLUMN: neon + stacked cards */}
        <div className="relative w-full h-[460px] md:h-[520px]">
          {/* neon svg */}
          <div className="neon-line-wrap">
            <Image
              src="/neon-line.svg"
              alt="neon stroke"
              width={1200}
              height={800}
              style={{ width: "100%", height: "auto", objectFit: "contain" }}
              priority
            />
          </div>

          {/* small orb top-right */}
          <div className="absolute right-6 top-6">
            <div className="hero-orb" aria-hidden />
          </div>

          {/* PROFILE CARD (top-left inside neon area) */}
          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="hero-card absolute left-6 top-6 w-72"
            style={{ transform: "translateZ(0)" }}
          >
            <div className="flex items-center gap-3">
              <Image
                src="/avatar.jpg"
                alt="avatar"
                width={44}
                height={44}
                className="rounded-full"
                priority
              />
              <div>
                <div className="font-semibold">Jack Wilson</div>
                <div className="text-xs opacity-70">Senior Manager</div>
              </div>
            </div>

            <div className="mt-4 text-xs opacity-80 space-y-1">
              <div>Design Team</div>
              <div className="text-[12px] opacity-60">04/12/2024</div>
            </div>

            <div className="mt-4 text-xs space-y-1 opacity-80">
              <div className="flex items-center gap-2"><Mail size={14}/> jack@zippy.com</div>
              <div className="flex items-center gap-2"><Phone size={14}/> +425 456 7890</div>
            </div>
          </motion.div>

          {/* RIGHT MID: big metric card */}
          <motion.div
            initial={{ opacity: 0, y: 28, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.12, duration: 0.7 }}
            className="hero-card absolute right-12 top-28 w-44 h-36 flex flex-col items-center justify-center text-center"
          >
            <div className="text-4xl font-bold" style={{ color: "var(--primary)" }}>26</div>
            <div className="text-xs opacity-75 mt-2">New Teams<br/>Collaborated</div>
          </motion.div>

          {/* lower cluster: upcoming + small stat */}
          <motion.div
            initial={{ opacity: 0, y: 36, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.22, duration: 0.8 }}
            className="hero-card absolute right-0 top-70 w-72"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="font-medium text-sm">Upcoming Event</div>
                <div className="mt-3 text-xs opacity-80">
                  <div className="flex items-center gap-2"><Calendar size={14}/> Monday, 04 Nov</div>
                  <div className="flex items-center gap-2 mt-2"><Clock size={14}/> 09:00 AM – 10:00 AM</div>
                </div>
              </div>

              <div className="ml-3">
                <div className="hero-orb-sm" aria-hidden />
              </div>
            </div>
          </motion.div>

          {/* tiny floating small card (bottom-left-ish) — subtle layer */}
          <motion.div
            initial={{ opacity: 0, y: 46, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.34, duration: 0.78 }}
            className="hero-card absolute left-36 bottom-12 w-56 p-3"
            style={{ display: "flex", gap: "12px", alignItems: "center", justifyContent: "space-between" }}
          >
            <div>
              <div className="text-xs opacity-80">Upcoming</div>
              <div className="font-semibold text-sm mt-1">Sprint Planning</div>
              <div className="text-xs opacity-70 mt-1">Mon, Nov 4 • 09:00</div>
            </div>
            <div className="ml-2">
              <div className="card-pill" aria-hidden />
            </div>
          </motion.div>
        </div>
      </div>
    </header>
  );
}