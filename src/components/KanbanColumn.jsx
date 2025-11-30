"use client";
import React from "react";
import TaskCard from "./TaskCard";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { arrayMove } from "@dnd-kit/sortable";

export default function KanbanColumn({ column, refresh }) {
  const tasks = column.tasks || [];

  function handleDragEnd(event) {
    const { active, over } = event;
    if (!over) return;
    const oldIndex = tasks.findIndex(t => t._id === active.id);
    const newIndex = tasks.findIndex(t => t._id === over.id);
    if (oldIndex !== newIndex) {
      const newTasks = arrayMove(tasks, oldIndex, newIndex);
      // optimistic UI: send new order to API
      newTasks.forEach((t, i) => {
        fetch("/api/tasks/move", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ taskId: t._id, toColumnId: column._id, newOrder: i })
        });
      });
      refresh();
    }
  }

  return (
    <div className="w-80 bg-gray-50 rounded p-3 flex-shrink-0">
      <h3 className="font-semibold mb-2">{column.title}</h3>
      <DndContext onDragEnd={handleDragEnd} collisionDetection={closestCenter}>
        <SortableContext items={tasks.map(t => t._id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-2">
            {tasks.map(t => <TaskCard key={t._id} task={t} refresh={refresh} />)}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
