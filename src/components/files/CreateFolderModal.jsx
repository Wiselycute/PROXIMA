// "use client";

// import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { useState } from "react";

// export default function CreateFolderModal({ open, setOpen }) {
//   const [folderName, setFolderName] = useState("");

//   return (
//     <Dialog open={open} onOpenChange={setOpen}>
//       <DialogContent className="bg-[#1f2937] border-white/10 text-white">
//         <DialogHeader>
//           <DialogTitle>Create New Folder</DialogTitle>
//         </DialogHeader>

//         <div className="space-y-4 mt-3">
//           <Input
//             placeholder="Enter folder name"
//             value={folderName}
//             onChange={(e) => setFolderName(e.target.value)}
//             className="bg-black/20 border-white/10 text-white"
//           />

//           <Button
//             className="w-full bg-primary"
//             onClick={() => {
//               setFolderName("");
//               setOpen(false);
//             }}
//           >
//             Create Folder
//           </Button>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// }
"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

export default function CreateFolderModal({ open, setOpen, onCreate }) {
  const [name, setName] = useState("");

  useEffect(() => {
    if (!open) setName("");
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-md">
        <h3 className="font-semibold text-lg mb-2">Create New Folder</h3>
        <Input placeholder="Folder name" value={name} onChange={e=>setName(e.target.value)} className="mb-3" />
        <div className="flex gap-3 justify-end">
          <Button variant="ghost" onClick={()=>setOpen(false)}>Cancel</Button>
          <Button onClick={() => { if (!name.trim()) return alert("Enter folder name"); onCreate(name.trim()); setOpen(false); }}>Create</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
