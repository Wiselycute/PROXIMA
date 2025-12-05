"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function AddColumnModal({ open, setOpen, onAdd }) {
  const [name, setName] = useState("");

  const handleSubmit = () => {
    if (!name.trim()) return;

    onAdd(name.trim());
    setName("");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="rounded-2xl p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Add New Column</DialogTitle>
        </DialogHeader>

        <div className="space-y-3 mt-3">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter column name (e.g. Backlog)"
            className="rounded-xl"
          />
        </div>

        <DialogFooter className="mt-4">
          <Button
            onClick={handleSubmit}
            className="rounded-xl bg-[#9B72CF] hover:bg-[#845abd] text-white"
          >
            Add Column
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
