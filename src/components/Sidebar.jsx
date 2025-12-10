"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Users, Folder, Settings, Grid, Menu, X, FileText, MessageCircleMore } from "lucide-react";

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
    { name: "Messages", href: "/home/messages", icon: MessageCircleMore },
  ];

  return (
    <>
      {/* --- Mobile Trigger Button --- */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-[60] md:hidden p-2.5 rounded-lg bg-[var(--background)] border border-white/20 text-white shadow-xl hover:bg-white/5 transition-all"
        aria-label="Toggle Sidebar"
      >
        {isOpen ? <X size={22} /> : <Menu size={22} />}
      </button>

      {/* --- Mobile Overlay Backdrop --- */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm md:hidden transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* --- Sidebar Container --- */}
      <aside
        className={`
          fixed md:sticky top-0 left-0
          w-64 md:w-60 h-screen
          z-50
          flex flex-col gap-6 p-5
          bg-[var(--background)] border-r border-white/10
          transition-transform duration-300 ease-in-out
          overflow-y-auto scrollbar-hide
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
          shadow-2xl md:shadow-none
        `}
      >
        {/* Header / Logo */}
        <div className="flex items-center gap-3 pt-4 md:pt-0 px-2">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#3AB4F2] to-[#2563EB] flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/20">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path
                d="M4 6h16v12H4z"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className="font-bold text-xl text-white tracking-wide">Proxima</div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 mt-4 space-y-1.5">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={handleLinkClick}
              className={`
                flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200
                ${
                  isActive(item.href)
                    ? "bg-[#3AB4F2]/10 text-[#3AB4F2] font-semibold border border-[#3AB4F2]/30 shadow-lg shadow-blue-500/10"
                    : "text-gray-400 hover:bg-white/5 hover:text-white font-medium"
                }
              `}
            >
              <item.icon size={20} className="shrink-0" />
              <span className="truncate">{item.name}</span>
            </Link>
          ))}
        </nav>

        {/* Footer Area */}
        <div className="mt-auto pt-4 border-t border-white/10 space-y-4">
          <button className="w-full py-3 rounded-lg bg-gradient-to-r from-[#3AB4F2] to-[#2563EB] text-white font-semibold hover:opacity-90 transition-all shadow-lg shadow-blue-500/30 text-sm">
            + New Project
          </button>

          <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-all">
            <div className="relative shrink-0">
              <Image
                src={user?.profileImage || "/avatar.jpg"}
                width={40}
                height={40}
                className="rounded-full object-cover border-2 border-white/20 w-10 h-10"
                alt="User Avatar"
              />
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-[var(--background)] rounded-full"></span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-white truncate">{user?.name || "Guest"}</div>
              <div className="text-xs text-gray-400 truncate">{user?.email || "guest@proxima.com"}</div>
            </div>
          </div>

          <button 
            onClick={() => {
              localStorage.removeItem("user");
              router.push("/auth/signin");
            }}
            className="w-full py-2.5 rounded-lg border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 hover:border-white/20 text-sm font-medium flex items-center justify-center gap-2 transition-all"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Log out
          </button>
        </div>
      </aside>
    </>
  );
}