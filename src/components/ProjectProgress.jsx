"use client";
import { useEffect, useState } from "react";
import { CheckCircle2, Circle, Clock } from "lucide-react";

export default function ProjectProgress({ projectId, refreshTrigger }) {
  const [progress, setProgress] = useState({
    total: 0,
    completed: 0,
    inProgress: 0,
    todo: 0,
    percentage: 0
  });

  useEffect(() => {
    async function loadProgress() {
      try {
        const api = (await import("@/lib/api")).default;
        const { data: tasks } = await api.get("/tasks");
        
        // Filter tasks for this project
        const projectTasks = tasks.filter(t => 
          (t.projectId?._id || t.projectId) === projectId
        );

        const total = projectTasks.length;
        const completed = projectTasks.filter(t => t.status === "completed").length;
        const inProgress = projectTasks.filter(t => t.status === "in-progress").length;
        const todo = projectTasks.filter(t => t.status === "todo" || !t.status).length;
        const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

        setProgress({ total, completed, inProgress, todo, percentage });
      } catch (e) {
        console.error("Failed to load project progress:", e);
      }
    }

    if (projectId) {
      loadProgress();
    }
  }, [projectId, refreshTrigger]);

  if (progress.total === 0) {
    return (
      <div className="text-sm text-white/50">
        No tasks yet
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between items-center text-sm">
          <span className="text-white/70">Overall Progress</span>
          <span className="font-semibold text-white">{progress.percentage}%</span>
        </div>
        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-green-500 rounded-full transition-all duration-500"
            style={{ width: `${progress.percentage}%` }}
          />
        </div>
      </div>

      {/* Task Breakdown */}
      <div className="grid grid-cols-3 gap-3">
        <div className="flex items-center gap-2 bg-green-500/10 rounded-lg p-2 border border-green-500/20">
          <CheckCircle2 size={16} className="text-green-400" />
          <div>
            <div className="text-xs text-white/50">Completed</div>
            <div className="text-sm font-semibold text-white">{progress.completed}</div>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-blue-500/10 rounded-lg p-2 border border-blue-500/20">
          <Clock size={16} className="text-blue-400" />
          <div>
            <div className="text-xs text-white/50">In Progress</div>
            <div className="text-sm font-semibold text-white">{progress.inProgress}</div>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-gray-500/10 rounded-lg p-2 border border-gray-500/20">
          <Circle size={16} className="text-gray-400" />
          <div>
            <div className="text-xs text-white/50">To Do</div>
            <div className="text-sm font-semibold text-white">{progress.todo}</div>
          </div>
        </div>
      </div>

      {/* Total */}
      <div className="text-xs text-white/50 text-center">
        Total: {progress.total} {progress.total === 1 ? 'task' : 'tasks'}
      </div>
    </div>
  );
}
