"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

export default function RenameDeleteModal({ target, onClose, onRename, onDelete }) {
  const [value, setValue] = useState("");

  useEffect(() => {
    if (target?.type === "folder") setValue(target.name || "");
    else setValue("");
  }, [target]);

  if (!target) return null;

  return (
    <Dialog open={!!target} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        {target.type === "folder" ? (
          <>
            <h3 className="font-semibold text-lg mb-3">Folder options</h3>
            <label className="text-sm text-muted-foreground">Rename folder</label>
            <Input value={value} onChange={(e) => setValue(e.target.value)} className="mb-3" />
            <div className="flex gap-3 justify-end">
              <Button variant="ghost" onClick={onClose}>Cancel</Button>
              <Button onClick={() => onRename(target.id, value)}>Rename</Button>
              <Button variant="destructive" onClick={() => { if (confirm("Delete folder and its files?")) onDelete(target.id); }}>Delete</Button>
            </div>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
