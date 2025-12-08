// components/Navbar.jsx
"use client";
import { useState } from "react";
import Link from "next/link";
import { Sun, Moon, Menu } from "lucide-react";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import MobileMenu from "./MobileMenu";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "./ModeToggle";


export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  return (
    <>
      <nav className="fixed w-full z-30 backdrop-blur-md bg-white/6 dark:bg-black/30 border-b border-transparent dark:border-zinc-800">
        <div className="container mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 font-bold rounded-full bg-gradient-to-br from-pf-purple to-pf-purple-600 shadow-glow flex items-center justify-center text-[#3AB4F2] font-bold">PROXIMA</div>
          </div>

          <div className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-sm hover:underline">Features</a>
            <a href="#pricing" className="text-sm hover:underline">Pricing</a>
            <a href="#about" className="text-sm hover:underline">About</a>
            <a href="#contact" className="text-sm hover:underline">Contact</a>
            <ModeToggle/>
            <Link href="/auth/signup" className="bg-primary text-white p-2 rounded-md">Get Started</Link>
          </div>

          <div className="md:hidden flex items-center gap-3">
            <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")} aria-label="toggle theme" className="p-2 rounded-md">
              {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <motion.button onClick={() => setOpen(true)} whileTap={{ scale: 0.95 }} className="p-2 rounded-md bg-[rgba(255,255,255,0.03)]">
              <Menu className="w-6 h-6" />
            </motion.button>
          </div>
        </div>
      </nav>

      <MobileMenu open={open} setOpen={setOpen} />
    </>
  );
}
