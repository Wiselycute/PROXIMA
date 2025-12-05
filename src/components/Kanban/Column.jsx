"use client";
import React, { useState } from "react";
import { MoreVertical } from "lucide-react";
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

export default function Column({ column, tasks = [], onAddTask, onUpdateTask, onDeleteTask, onRenameColumn, onDeleteColumn }) {
  const [newTitle, setNewTitle] = useState("");
  const [showSettings, setShowSettings] = useState(false);

  return (
    <div className="kanban-column">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-semibold flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[var(--accent)] inline-block" />
          {column.title}
        </h3>
        <div className="flex items-center gap-2">
          <div className="text-sm opacity-70">{tasks.length}</div>
          <button onClick={() => setShowSettings(true)} className="p-1 hover:bg-white/10 rounded transition">
            <MoreVertical size={16} />
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {tasks.map((task, idx) => (
          <TaskCard key={task.id} task={task} index={idx} onUpdate={(patch) => onUpdateTask(task.id, patch)} onDelete={() => onDeleteTask(task.id)} />
        ))}
      </div>

      <div className="mt-4">
        <input
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="New task title"
          className="w-full p-2 rounded-md bg-white/3 text-[var(--foreground)]"
        />
        <button
          className="mt-2 w-full px-3 py-2 rounded-md bg-[var(--primary)] text-white"
          onClick={() => {
            if (!newTitle.trim()) return;
            onAddTask(newTitle.trim());
            setNewTitle("");
          }}
        >
          + Add Task
        </button>
      </div>

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
