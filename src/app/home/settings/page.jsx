"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import TeamPermissions from "@/components/settings/TeamPermissions";
import { isAdmin } from "@/lib/auth";

export default function Page() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    if (!isAdmin()) {
      router.push("/home/dashboard");
    } else {
      setAuthorized(true);
    }
  }, [router]);

  if (!authorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
        <p className="text-gray-400">Checking permissions...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-[var(--background)] text-[var(--foreground)]">
      <Sidebar />
      <div className="flex-1">
        <Topbar />
        <main className="p-8">
          <TeamPermissions />
        </main>
      </div>
    </div>
  );
}