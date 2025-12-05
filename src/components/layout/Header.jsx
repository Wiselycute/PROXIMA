import { Bell, HelpCircle } from "lucide-react";
import Image from "next/image";
import ThemeToggle from "../ThemeToggle";

export default function Header({isDark,setIsDark}){
  return (
    <header className="flex items-center justify-between px-6 py-3 border-b" style={{borderColor:"var(--border)"}}>
      <div className="text-lg font-semibold">Hi , Mostafa</div>
      <div className="flex items-center gap-4">
        <HelpCircle />
        <Bell />
        <ThemeToggle isDark={isDark} setIsDark={setIsDark} />
        <Image src="/avatar.png" alt="avatar" width={38} height={38} className="rounded-full"/>
      </div>
    </header>
  );
}
