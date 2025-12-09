"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Moon, Bell } from "lucide-react";
import { ModeToggle } from "./ModeToggle";

export default function Topbar() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadUser = () => {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    };

    loadUser();

    // Listen for storage changes (profile image updates)
    window.addEventListener("storage", loadUser);
    return () => window.removeEventListener("storage", loadUser);
  }, []);

  return (
    <header 
      className="
        h-14 flex items-center justify-between px-6 
        glass bg-[var(--background)] z-10
        ml-0 md:ml-64 
        transition-all duration-300
      "
    >
      <div className="flex items-center gap-4">
        <div className="text-lg font-semibold">Hi, {user?.name || "Guest"}</div>
      </div>

      <div className="flex items-center gap-3">
        <ModeToggle />
        <Image src={user?.profileImage || "/avatar.jpg"} width={36} height={36} className="rounded-full object-cover w-9 h-9" alt="User" />
      </div>
    </header>
  );
}

