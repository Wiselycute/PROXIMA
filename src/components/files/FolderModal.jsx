"use client";
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function FolderModal({ open = false, onClose = () => {}, onCreate = (name) => {} }) {
	const [name, setName] = useState("");

	function handleCreate() {
		if (!name.trim()) return;
		onCreate(name.trim());
		setName("");
	}

	return (
		<Dialog open={open} onOpenChange={onClose}>
			<DialogContent className="max-w-md">
				<DialogHeader>
					<DialogTitle>New Folder</DialogTitle>
				</DialogHeader>

				<div className="space-y-3">
					<Input placeholder="Folder name" value={name} onChange={(e) => setName(e.target.value)} />
				</div>

				<DialogFooter>
					<div className="flex justify-end gap-2">
						<Button variant="outline" onClick={() => { setName(""); onClose(); }}>Cancel</Button>
						<Button onClick={handleCreate}>Create</Button>
					</div>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
