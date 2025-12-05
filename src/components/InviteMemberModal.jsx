"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

export default function InviteMemberModal({ open, setOpen, onInvite }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "member",
  });

  const handleInvite = () => {
    if (!form.name || !form.email) return;

    if (onInvite) onInvite(form);

    setForm({ name: "", email: "", role: "member" });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="rounded-2xl p-6 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Invite New Member</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <Input
            placeholder="Full Name"
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
            className="rounded-xl"
          />

          <Input
            placeholder="Email Address"
            value={form.email}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
            type="email"
            className="rounded-xl"
          />

          <Select
            value={form.role}
            onValueChange={(v) => setForm({ ...form, role: v })}
          >
            <SelectTrigger className="rounded-xl">
              <SelectValue placeholder="Choose role" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="member">Member</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="viewer">Viewer</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <DialogFooter className="mt-5">
          <Button
            onClick={handleInvite}
            className="rounded-xl bg-[#3AB4F2] hover:bg-[#2a95c9] text-white"
          >
            Send Invite
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
