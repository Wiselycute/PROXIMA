// src/components/settings/RoleDropdown.jsx
"use client";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { ChevronDown } from "lucide-react";
import React from "react";

export default function RoleDropdown({ value, onChange, currentUserIsAdmin = false }) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger className="px-3 py-2 rounded bg-white/6 flex items-center gap-2">
        <span className="text-sm">{value}</span>
        <ChevronDown size={14} />
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content className="glass p-2 rounded shadow-md" sideOffset={6}>
          {currentUserIsAdmin && (
            <DropdownMenu.Item onSelect={() => onChange("Admin")} className="p-2 rounded hover:bg-white/6 cursor-pointer">
              Admin
            </DropdownMenu.Item>
          )}
          <DropdownMenu.Item onSelect={() => onChange("Member")} className="p-2 rounded hover:bg-white/6 cursor-pointer">
            Member
          </DropdownMenu.Item>
          <DropdownMenu.Item onSelect={() => onChange("Viewer")} className="p-2 rounded hover:bg-white/6 cursor-pointer">
            Viewer
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
