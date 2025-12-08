"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Users, Folder, Settings, Grid, Menu, X, FileText } from "lucide-react";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const pathname = usePathname();
  const router = useRouter();

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

  // Helper to determine if a link is active
  const isActive = (path) => pathname === path;

  // Helper to close sidebar when a link is clicked on mobile
  const handleLinkClick = () => {
    setIsOpen(false);
  };

  // Navigation Items
  const navItems = [
    { name: "Dashboard", href: "/home/dashboard", icon: Grid },
    { name: "Projects", href: "/home/projects", icon: Folder },
    { name: "Team", href: "/home/members", icon: Users },
    { name: "Settings", href: "/home/settings/profile", icon: Settings },
    { name: "Files", href: "/home/files", icon: FileText },
  ];

  return (
    <>
      {/* --- Mobile Trigger Button --- */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 md:hidden p-2 rounded-md bg-gray-900 border border-white/10 text-white shadow-lg hover:bg-gray-800 transition"
        aria-label="Toggle Sidebar"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* --- Mobile Overlay Backdrop --- */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* --- Sidebar Container --- */}
      <aside
        className={`
          w-60 h-screen  sticky top-0 z-50
          flex flex-col gap-6 p-5
          bg-[var(--background)] border-r border-white/10
          transition-transform duration-300 ease-in-out
          overflow-y-auto scrollbar-hide
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 
        `}
      >
        {/* Header / Logo */}
        <div className="flex items-center gap-3 mt-8 md:mt-0 px-2">
          <div className="w-10 h-10 rounded-md bg-white/5 flex items-center justify-center shrink-0 border border-white/10">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M4 6h16v12H4z"
                stroke="#3AB4F2"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className="font-bold text-lg text-white tracking-wide">Proxima</div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 mt-6 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={handleLinkClick}
              className={`
                flex items-center gap-3 p-3 rounded-lg transition-all duration-200
                ${
                  isActive(item.href)
                    ? "bg-[#3AB4F2]/10 text-[#3AB4F2] font-medium border border-[#3AB4F2]/20"
                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                }
              `}
            >
              <item.icon size={18} />
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Footer Area */}
        <div className="mt-auto pt-6 border-t border-white/5">
          <button className="w-full py-2.5 rounded-lg bg-gradient-to-r from-[#3AB4F2] to-[#2563EB] text-white font-medium hover:opacity-90 transition shadow-lg shadow-blue-500/20 text-sm">
            + New Project
          </button>

          <div className="mt-6 flex items-center gap-3 px-2">
            <div className="relative">
              <Image
                src={user?.profileImage || "/avatar.jpg"}
                width={40}
                height={40}
                className="rounded-full object-cover border border-white/10 w-10 h-10"
                alt="User Avatar"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-gray-900 rounded-full"></span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-white truncate">{user?.name || "Guest"}</div>
              <div className="text-xs text-gray-400 truncate">{user?.email || ""}</div>
            </div>
          </div>

          <button 
            onClick={() => {
              localStorage.removeItem("user");
              router.push("/auth/signin");
            }}
            className="mt-4 w-full py-2 rounded-md border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 text-xs flex items-center justify-center gap-2 transition"
          >
            Log out
          </button>
        </div>
      </aside>
    </>
  );
}