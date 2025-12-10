// "use client";

// import { useState } from "react";
// import FileManager from "@/components/files/FileManager";
// import UploadModal from "@/components/UploadModal";
// import Sidebar from "@/components/Sidebar";
// import Topbar from "@/components/Topbar";
// import { Upload } from "lucide-react";

// export default function FilesPage() {
//   const [open, setOpen] = useState(false);

//   return (
//     <div className="min-h-screen flex bg-[var(--background)] text-[var(--foreground)]">
//       <Sidebar />
//       <div className="flex-1">
//         <Topbar />
//         <main className="p-8">
//           <div className="space-y-10">
//             <div className="flex items-center justify-between">
//               <h1 className="text-3xl font-bold">Files</h1>

//               <button
//                 onClick={() => setOpen(true)}
//                 className="px-4 py-2 flex items-center gap-2 rounded-xl bg-[#3AB4F2] text-white hover:bg-[#2b97cc]"
//               >
//                 <Upload size={18} /> Upload File
//               </button>
//             </div>

//             <FileManager />

//             <UploadModal open={open} setOpen={setOpen} />
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// }
// "use client";

// import { useState } from "react";
// import { Plus, Upload, Folder, MoreHorizontal } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Progress } from "@/components/ui/progress";
// import CreateFolderModal from "@/components/files/CreateFolderModal";
// import Image from "next/image";
// import Sidebar from "@/components/Sidebar";
// import Topbar from "@/components/Topbar";

// export default function FilesPage() {
//   const [openNewFolder, setOpenNewFolder] = useState(false);

//   const folders = [
//     { name: "Documents", count: "24 files", color: "bg-blue-500" },
//     { name: "Music", count: "102 files", color: "bg-purple-500" },
//     { name: "Work Project", count: "84 files", color: "bg-cyan-500" },
//     { name: "Personal Media", count: "2450 files", color: "bg-yellow-500" },
//     { name: "Reddingo Backup", count: "22 files", color: "bg-green-500" },
//     { name: "Root", count: "105 files", color: "bg-orange-500" },
//   ];

//   const recentFiles = [
//     {
//       name: "Proposal.docx",
//       size: "2.9 MB",
//       date: "Feb 25, 2022",
//       icon: "/icons/doc.png",
//     },
//     {
//       name: "Background.jpg",
//       size: "3.5 MB",
//       date: "Feb 24, 2022",
//       icon: "/icons/jpg.png",
//     },
//     {
//       name: "Apex website.fig",
//       size: "23.5 MB",
//       date: "Feb 22, 2022",
//       icon: "/icons/fig.png",
//     },
//     {
//       name: "Illustration.ai",
//       size: "7.2 MB",
//       date: "Feb 20, 2022",
//       icon: "/icons/ai.png",
//     },
//   ];

//   return (
//     <div className="min-h-screen flex bg-[var(--background)] text-[var(--foreground)]">
//       <Sidebar />      
//        <div className="flex-1">
//         <Topbar />
//       {/* Top Bar */}
//       <div className="flex justify-between items-center mb-4">
//         <h1 className="text-3xl font-semibold text-white tracking-tight">
//           File Manager
//         </h1>

//         <div className="flex gap-3">
//           <Button
//             className="bg-primary text-white px-4"
//             onClick={() => setOpenNewFolder(true)}
//           >
//             <Plus className="mr-2 h-4 w-4" />
//             Create New Folder
//           </Button>

//           <Button variant="outline" className="px-4">
//             <Upload className="mr-2 h-4 w-4" />
//             Upload
//           </Button>
//         </div>
//       </div>

//       {/* Main Layout */}
//       <div className="grid grid-cols-12 gap-4">
//         {/* Folders Section */}
//         <Card className="col-span-8 bg-[#111827] border-none shadow-lg">
//           <CardHeader>
//             <CardTitle className="text-white flex justify-between">
//               <span>All Files</span>
//               <Button variant="outline" size="sm">
//                 Show All
//               </Button>
//             </CardTitle>
//           </CardHeader>

//           <CardContent>
//             <div className="grid grid-cols-3 gap-4">
//               {folders.map((folder, i) => (
//                 <div
//                   key={i}
//                   className="p-4 rounded-xl bg-gradient-to-br from-[#2E0756] to-[#0F172A] 
//                   border border-white/10 hover:scale-[1.02] transition cursor-pointer"
//                 >
//                   <Folder className={`h-10 w-10 ${folder.color} text-white rounded-lg p-1`} />

//                   <h3 className="text-white mt-4 font-medium">{folder.name}</h3>
//                   <p className="text-gray-400 text-sm">{folder.count}</p>
//                 </div>
//               ))}
//             </div>
//           </CardContent>
//         </Card>

//         {/* Storage Overview */}
//         <Card className="col-span-4 bg-[#111827] border-none shadow-lg">
//           <CardHeader>
//             <CardTitle className="text-white">Storage Overview</CardTitle>
//           </CardHeader>

//           <CardContent className="space-y-4">
//             <div className="text-center">
//               <div className="w-32 h-32 mx-auto rounded-full bg-black/20 border border-white/10 flex items-center justify-center">
//                 <div className="w-24 h-24 rounded-full border-4 border-primary flex items-center justify-center">
//                   <span className="text-xl font-semibold text-white">85%</span>
//                 </div>
//               </div>

//               <p className="mt-2 text-gray-400">130 GB / 512 GB</p>
//             </div>

//             <div className="space-y-3">
//               <StorageBar label="Media" color="bg-blue-500" value={80} size="86 GB" />
//               <StorageBar label="Photos" color="bg-yellow-500" value={30} size="26 GB" />
//               <StorageBar label="Docs" color="bg-red-500" value={10} size="10 GB" />
//               <StorageBar label="Others" color="bg-purple-500" value={18} size="18 GB" />
//             </div>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Bottom section */}
//       <div className="grid grid-cols-12 gap-4">
//         {/* Recent Files */}
//         <Card className="col-span-8 bg-[#111827] border-none shadow-lg">
//           <CardHeader className="flex justify-between">
//             <CardTitle className="text-white">Recent Files</CardTitle>
//           </CardHeader>

//           <CardContent className="space-y-4">
//             {recentFiles.map((file, i) => (
//               <div
//                 key={i}
//                 className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition"
//               >
//                 <div className="flex items-center gap-3">
//                   <Image
//                     src={file.icon}
//                     width={36}
//                     height={36}
//                     alt="file"
//                     className="rounded-md"
//                   />

//                   <div>
//                     <p className="text-white font-medium">{file.name}</p>
//                     <p className="text-gray-400 text-sm">{file.size}</p>
//                   </div>
//                 </div>

//                 <div className="flex items-center gap-10">
//                   <span className="text-gray-400 text-sm">{file.date}</span>
//                   <MoreHorizontal className="text-gray-400 cursor-pointer" />
//                 </div>
//               </div>
//             ))}
//           </CardContent>
//         </Card>

//         {/* Activity Chart Placeholder */}
//         <Card className="col-span-4 bg-[#111827] border-none shadow-lg">
//           <CardHeader>
//             <CardTitle className="text-white">Activity Chart</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="w-full h-48 bg-black/20 rounded-lg flex items-center justify-center text-gray-500">
//               Chart Goes Here
//             </div>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Modal */}
//       <CreateFolderModal open={openNewFolder} setOpen={setOpenNewFolder} />
//     </div>
//     </div>
//   );
// }

// function StorageBar({ label, color, value, size }) {
//   return (
//     <div>
//       <div className="flex justify-between">
//         <span className="text-gray-300 text-sm">{label}</span>
//         <span className="text-gray-400 text-sm">{size}</span>
//       </div>
//       <Progress className="h-2 mt-1" value={value} indicatorClassName={color} />
//     </div>
//   );
// }

"use client"
import { useState } from "react";
import FileManager from "@/components/files/FileManager";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import UploadModal from "@/components/UploadModal";
import { Upload } from "lucide-react";

export default function FilesPage() {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-[var(--background)] text-[var(--foreground)]"> 
      <Sidebar />
      <div className="flex-1">   
        {/* <Topbar /> */}
        <main className="p-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-semibold">Files</h1>
            <div>
              <button onClick={() => setOpen(true)} className="px-4 py-2 rounded-xl bg-[var(--primary)] text-white inline-flex items-center gap-2">
                <Upload size={16} /> Upload File
              </button>
            </div>
          </div>

          <FileManager />

          <UploadModal open={open} setOpen={setOpen} />
        </main>
      </div>
    </div>
  );
}
