"use client";
import Image from "next/image";
import { Moon, Bell } from "lucide-react";
import { ModeToggle } from "./ModeToggle";

export default function Topbar() {
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
        <div className="text-lg font-semibold">Hi, Mostafa</div>
      </div>

      <div className="flex items-center gap-3">
        <ModeToggle />
        <Image src="/avatar.jpg" width={36} height={36} className="rounded-full object-cover" alt="me" />
      </div>
    </header>
  );
}
// "use client";
// import { Search, Bell } from "lucide-react";
// import { ModeToggle } from './ModeToggle';

// export default function Topbar() {
//   return (
//     <header 
//       className="
//         fixed top-0 right-0 h-16 z-40
//         left-0 md:left-64
//         bg-white/10 backdrop-blur-xl border-b border-white/10 
//         flex items-center justify-between 
//         pr-6 pl-16 md:pl-6
//         transition-all duration-300
//       "
//     >
//       <div className="flex items-center gap-3">
//         <Search size={18} className="text-gray-300" />
//         <input
//           className="bg-transparent outline-none text-sm text-gray-200 placeholder-gray-400 w-full max-w-[120px] md:max-w-none"
//           placeholder="Search..."
//         />
//       </div>

//       <div className="flex items-center gap-5">
//         <button className="text-gray-300 hover:text-white transition">
//           <Bell size={20} />
//         </button>
//         <ModeToggle />
//         <img
//           src="/avatar.png"
//           className="h-8 w-8 rounded-full border border-white/20 object-cover"
//           alt="User Avatar"
//         />
//       </div>
//     </header>
//   );
// }