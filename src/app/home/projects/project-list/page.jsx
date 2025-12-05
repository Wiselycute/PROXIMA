"use client";
import { useState } from "react";
import Link from "next/link";
import NeonAnimatedHeader from "@/components/NeonAnimatedHeader";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import AddProjectModal from "@/components/Kanban/AddProjectModal";
import DeleteConfirmationModal from "@/components/Kanban/DeleteConfirmationModal";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

const SAMPLE = [
  { id: "p-1", name: "Website Redesign", tasks: 12, progress: 65, color: "#9B72CF" },
  { id: "p-2", name: "Mobile App", tasks: 7, progress: 42, color: "#4BE2F2" },
  { id: "p-3", name: "Marketing Campaign", tasks: 4, progress: 90, color: "#F39ACB" }
];

export default function ProjectListPage() {
  const [projects, setProjects] = useState(SAMPLE);
  const [showAddProjectModal, setShowAddProjectModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  const handleAddProject = (data) => {
    const newProject = {
      id: `p-${Date.now()}`,
      name: data.name,
      description: data.description,
      tasks: 0,
      progress: 0,
      color: ["#9B72CF", "#4BE2F2", "#F39ACB"][Math.floor(Math.random() * 3)]
    };
    setProjects([...projects, newProject]);
  };

  const handleDeleteProject = () => {
    setProjects(projects.filter(p => p.id !== selectedProject.id));
    setShowDeleteConfirm(false);
    setSelectedProject(null);
  };
  return (
    <div className="min-h-screen flex bg-[var(--background)] text-[var(--foreground)]">
      <Sidebar />
      <div className="flex-1">
        <Topbar />
        <div className="p-6">
      <NeonAnimatedHeader
        title="Projects"
        subtitle="All active projects and their quick health snapshot"
        rightSlot={
          <div className="flex gap-2">
            <Link href="/home/board" className="px-4 py-2 rounded-xl bg-[#9B72CF] text-white inline-block">Open Board</Link>
            <Button onClick={() => setShowAddProjectModal(true)} className="rounded-xl flex items-center gap-2">
              <Plus size={16} /> New Project
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map(p => (
          <div key={p.id} className="group rounded-2xl p-5 bg-card border hover:shadow-lg transition relative">
            <Link href={`/project/${p.id}`} className="block">
              <div className="flex justify-between items-start">
                <h3 className="font-semibold text-lg">{p.name}</h3>
                <div className="text-sm text-muted-foreground">{p.tasks} tasks</div>
              </div>

              <div className="mt-4">
                <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                  <div style={{ width: `${p.progress}%`, background: p.color }} className="h-full rounded-full transition" />
                </div>
                <div className="mt-2 text-xs text-muted-foreground">{p.progress}% complete</div>
              </div>
            </Link>
            
            <button
              onClick={(e) => {
                e.preventDefault();
                setSelectedProject(p);
                setShowDeleteConfirm(true);
              }}
              className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 p-2 hover:bg-red-500/20 rounded transition"
              title="Delete project"
            >
              <Trash2 size={18} className="text-red-400" />
            </button>
          </div>
        ))}
        </div>

        <AddProjectModal
          open={showAddProjectModal}
          onClose={() => setShowAddProjectModal(false)}
          onCreate={handleAddProject}
        />

        <DeleteConfirmationModal
          open={showDeleteConfirm}
          onClose={() => setShowDeleteConfirm(false)}
          text={`Are you sure you want to delete the project "${selectedProject?.name}"? All tasks will be deleted. This cannot be undone.`}
          onConfirm={handleDeleteProject}
        />
        </div>
      </div>
    </div>
  );
}
