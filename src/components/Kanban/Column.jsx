"use client";
import React, { useState } from "react";
import { MoreVertical, Plus } from "lucide-react";
import TaskCard from "./TaskCard";
import ColumnSettingsModal from "./ColumnSettingsModal";

/**
 * Column: shows tasks for the column.
 * Accepts:
 * - column: { id, title, taskIds }
 * - tasks: array of task objects
 * - onAddTask(title)
 * - onUpdateTask(id, patch)
 * - onDeleteTask(id)
 * - onRenameColumn(columnId, newName)
 * - onDeleteColumn(columnId)
 */

// Color mapping for different column types
const getColumnStyle = (title) => {
  const lowerTitle = title?.toLowerCase() || "";
  if (lowerTitle.includes("todo") || lowerTitle.includes("to do")) {
    return {
      
      accentColor: "bg-[var(--background)]",
      borderColor: "border-gray-500/30",
      badgeBg: "bg-gray-500/10",
      badgeText: "text-gray-400"
    };
  }
  if (lowerTitle.includes("progress") || lowerTitle.includes("doing")) {
    return {
     
      accentColor: "bg-[var(--background)]",
      borderColor: "border-blue-500/30",
      badgeBg: "bg-blue-500/10",
      badgeText: "text-blue-400"
    };
  }
  if (lowerTitle.includes("done") || lowerTitle.includes("complete")) {
    return {
      
      accentColor: "bg-green-400",
      borderColor: "border-green-500/30",
      badgeBg: "bg-green-500/10",
      badgeText: "text-green-400"
    };
  }
  return {
    gradient: "from-purple-500/20 to-pink-500/20",
    accentColor: "bg-purple-400",
    borderColor: "border-purple-500/30",
    badgeBg: "bg-purple-500/10",
    badgeText: "text-purple-400"
  };
};

export default function Column({ column, tasks = [], onAddTask, onUpdateTask, onDeleteTask, onTaskClick, onEditTask, onRenameColumn, onDeleteColumn, columns = [], members = [], userIsAdmin = false }) {
  const [showSettings, setShowSettings] = useState(false);
  const columnStyle = getColumnStyle(column.title);

  return (
    <div className={`min-w-[340px] flex-shrink-0 bg-gradient-to-br ${columnStyle.gradient} backdrop-blur-sm rounded-2xl p-5 border ${columnStyle.borderColor} shadow-lg`}>
      {/* Column Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${columnStyle.accentColor} shadow-lg`} />
          <h3 className="font-bold text-lg text-white">{column.title}</h3>
        </div>
        <div className="flex items-center gap-3">
          <div className={`px-3 py-1 rounded-full ${columnStyle.badgeBg} ${columnStyle.badgeText} text-sm font-semibold`}>
            {tasks.length}
          </div>
          <button 
            onClick={() => setShowSettings(true)} 
            className="p-2 hover:bg-white/10 rounded-lg transition-all hover:scale-110"
          >
            <MoreVertical size={18} className="text-white/70" />
          </button>
        </div>
      </div>

      {/* Tasks Container */}
      <div className="space-y-3 mb-4 max-h-[calc(100vh-400px)] overflow-y-auto w-[300px] pr-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
        {tasks.length === 0 && (
          <div className="text-center py-12 px-4 rounded-xl bg-white/5 border border-dashed border-white/10">
            <div className="text-white/40 text-sm mb-2">No tasks yet</div>
            <div className="text-white/30 text-xs">Add your first task to get started</div>
          </div>
        )}
        {tasks.map((task, idx) => (
          <TaskCard 
            key={task.id} 
            task={task} 
            index={idx} 
            onUpdate={(patch) => onUpdateTask(task.id, patch)} 
            onDelete={() => onDeleteTask(task.id)} 
            onClick={() => onTaskClick?.(task)}
            onEdit={() => onEditTask?.(task)}
            columns={columns} 
            members={members}
            userIsAdmin={userIsAdmin} 
          />
        ))}
      </div>

      {/* Add Task Button */}
      {userIsAdmin && (
        <button
          className="w-full px-4 py-3 rounded-xl bg-primary hover:bg-primary/90 text-white font-medium hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 group"
          onClick={() => {
            onAddTask();
          }}
        >
          <Plus size={18} className="group-hover:rotate-90 transition-transform duration-200" />
          <span>Add Task</span>
        </button>
      )}

      <ColumnSettingsModal
        open={showSettings}
        onClose={() => setShowSettings(false)}
        column={column}
        onRename={(newName) => {
          onRenameColumn(column.id, newName);
          setShowSettings(false);
        }}
        onDelete={() => {
          onDeleteColumn(column.id);
          setShowSettings(false);
        }}
      />
    </div>
  );
}
