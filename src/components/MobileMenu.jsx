// components/MobileMenu.jsx
"use client";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function MobileMenu({ open, setOpen }) {
  if (!open) return null;
  return (
    <motion.aside
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "spring", damping: 20 }}
      className="fixed inset-0 z-40"
    >
      <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
      <div className="absolute right-0 top-0 h-full w-80 bg-background p-6 backdrop-blur-lg border-l border-zinc-800">
        <div className="flex items-center justify-between mb-6">
          <div className="font-bold text-lg">TeamFlow</div>
          <button onClick={() => setOpen(false)} className="p-2 rounded-md">
            <X />
          </button>
        </div>

        <nav className="flex flex-col gap-4">
          <a href="#features" onClick={() => setOpen(false)} className="py-2">Features</a>
          <a href="#pricing" onClick={() => setOpen(false)} className="py-2">Pricing</a>
          <a href="#testimonials" onClick={() => setOpen(false)} className="py-2">Testimonials</a>
          <a href="#about" onClick={() => setOpen(false)} className="py-2">About</a>
          <a href="#contact" onClick={() => setOpen(false)} className="py-2">Contact</a>
        </nav>

        <div className="mt-8">
          <Button className="w-full bg-pf-purple text-white">Create Team</Button>
        </div>
      </div>
    </motion.aside>
  );
}
