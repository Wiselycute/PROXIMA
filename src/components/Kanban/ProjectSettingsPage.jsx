"use client";
import { useState } from "react";

export default function ProjectSettingsPage({ project, onSave, onDelete }) {
  const [name, setName] = useState(project.name);
  const [desc, setDesc] = useState(project.description || "");

  const handleSave = async () => {
    try {
      const api = (await import("@/lib/api")).default;
      await api.put(`/projects/${project._id || project.id}`, { name, description: desc });
      // Optionally reload or close
    } catch (e) {
      // Optionally show error toast
    }
  };

  const handleDelete = async () => {
    try {
      const api = (await import("@/lib/api")).default;
      await api.delete(`/projects/${project._id || project.id}`);
      // Optionally redirect or close
    } catch (e) {
      // Optionally show error toast
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Project Settings</h1>
      <div className="space-y-5">
        <input
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Project Name"
        />
        <textarea
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 min-h-[140px]"
          value={desc}
          onChange={e => setDesc(e.target.value)}
          placeholder="Description..."
        />
      </div>
      <div className="flex justify-end mt-6">
        <button onClick={handleSave}
          className="px-6 py-3 bg-blue-600 rounded-xl hover:bg-blue-700">
          Save Changes
        </button>
      </div>
      <hr className="my-10 border-white/10" />
      <div>
        <p className="text-red-400 font-semibold mb-3">Danger Zone</p>
        <button
          onClick={handleDelete}
          className="px-6 py-3 bg-red-600 rounded-xl hover:bg-red-700"
        >
          Delete Project
        </button>
      </div>
    </div>
  );
}
