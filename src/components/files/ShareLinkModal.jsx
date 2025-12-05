"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export default function ShareLinkModal({ file, onClose }) {
  const [link, setLink] = useState("");

  useEffect(() => {
    if (!file) return setLink("");
    // generate a fake shareable URL (client-side)
    const fake = `${location.origin}/share/${file.id}-${btoa(file.name).slice(0,6)}`;
    setLink(fake);
  }, [file]);

  if (!file) return null;

  return (
    <Dialog open={!!file} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <h3 className="font-semibold text-lg mb-2">Share "{file.name}"</h3>
        <p className="text-sm text-muted-foreground mb-4">Use the link below to allow others to download or preview this file (demo link).</p>

        <div className="bg-black/20 p-3 rounded-md mb-4">
          <input className="w-full bg-transparent text-white" readOnly value={link} onClick={(e)=>e.target.select()} />
        </div>

        <div className="flex gap-3 justify-end">
          <Button variant="ghost" onClick={onClose}>Close</Button>
          <Button onClick={()=>{ navigator.clipboard?.writeText(link); alert("Link copied!"); }}>Copy Link</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
