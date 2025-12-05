// "use client";
// import React, { useEffect, useState, useCallback } from "react";
// import {
//   DndContext,
//   PointerSensor,
//   useSensor,
//   useSensors,
//   closestCenter,
//   DragOverlay
// } from "@dnd-kit/core";
// import {
//   SortableContext,
//   rectSortingStrategy,
//   arrayMove,
//   sortableKeyboardCoordinates
// } from "@dnd-kit/sortable";

// import Column from "./Column";
// import { loadBoard, saveBoard, resetBoard, subscribeStorage } from "@/lib/kanbanStorage";

// /**
//  * KanbanBoard
//  *
//  * Handles:
//  * - localStorage load/save
//  * - cross-tab sync via storage event (subscribeStorage)
//  * - drag+drop reordering within same column and moving across columns
//  *
//  * Note: each TaskCard uses its id as draggable id.
//  */

// export default function KanbanBoard() {
//   const [board, setBoard] = useState(null);
//   const [activeId, setActiveId] = useState(null);

//   useEffect(() => {
//     const existing = loadBoard();
//     if (existing) setBoard(existing);
//     else setBoard(resetBoard());
//     // subscribe storage updates from other tabs
//     const unsub = subscribeStorage((nextBoard) => {
//       if (!nextBoard) return;
//       setBoard(nextBoard);
//     });
//     return () => unsub();
//   }, []);

//   // save on changes
//   useEffect(() => {
//     if (board) saveBoard(board);
//   }, [board]);

//   const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));

//   if (!board) return null;

//   const findColumnForTask = useCallback(
//     (taskId) => Object.values(board.columns).find((c) => c.taskIds.includes(taskId))?.id,
//     [board]
//   );

//   function handleDragStart(event) {
//     setActiveId(event.active.id);
//   }

//   function handleDragEnd(event) {
//     const { active, over } = event;
//     setActiveId(null);
//     if (!over) return;

//     const activeId = active.id;
//     const overId = over.id;

//     // find columns
//     const sourceColId = findColumnForTask(activeId);
//     const destColId = findColumnForTask(overId) || overId; // if over is column id

//     if (!sourceColId || !destColId) return;

//     // if same column => we need to reorder within that column using indexes
//     if (sourceColId === destColId) {
//       const col = board.columns[sourceColId];
//       const oldIndex = col.taskIds.indexOf(activeId);
//       const newIndex = col.taskIds.indexOf(overId);

//       if (oldIndex !== newIndex) {
//         const newTaskIds = arrayMove(col.taskIds, oldIndex, newIndex);
//         setBoard((prev) => ({
//           ...prev,
//           columns: { ...prev.columns, [sourceColId]: { ...col, taskIds: newTaskIds } }
//         }));
//       }
//       return;
//     }

//     // moving between columns: remove from source and insert before/after over item or at end
//     const source = board.columns[sourceColId];
//     const dest = board.columns[destColId];

//     // remove from source
//     const newSourceIds = source.taskIds.filter((id) => id !== activeId);

//     // if over id is a task in dest, insert before that task
//     let insertAt = dest.taskIds.length;
//     const overIndex = dest.taskIds.indexOf(overId);
//     if (overIndex !== -1) {
//       insertAt = overIndex;
//     }

//     const newDestIds = [...dest.taskIds.slice(0, insertAt), activeId, ...dest.taskIds.slice(insertAt)];

//     setBoard((prev) => ({
//       ...prev,
//       columns: {
//         ...prev.columns,
//         [sourceColId]: { ...source, taskIds: newSourceIds },
//         [destColId]: { ...dest, taskIds: newDestIds }
//       }
//     }));
//   }

//   function addTask(columnId, title) {
//     const id = `t-${Date.now()}`;
//     const newTask = { id, title, desc: "", assignees: [], due: null, comments: [], attachments: [], priority: "low" };
//     setBoard((prev) => ({
//       ...prev,
//       tasks: { ...prev.tasks, [id]: newTask },
//       columns: { ...prev.columns, [columnId]: { ...prev.columns[columnId], taskIds: [id, ...prev.columns[columnId].taskIds] } }
//     }));
//   }

//   function updateTask(taskId, patch) {
//     setBoard((prev) => ({ ...prev, tasks: { ...prev.tasks, [taskId]: { ...prev.tasks[taskId], ...patch } } }));
//   }

//   function deleteTask(taskId) {
//     setBoard((prev) => {
//       const newTasks = { ...prev.tasks };
//       delete newTasks[taskId];
//       const newCols = {};
//       for (const id of prev.columnOrder) {
//         newCols[id] = { ...prev.columns[id], taskIds: prev.columns[id].taskIds.filter((t) => t !== taskId) };
//       }
//       return { ...prev, tasks: newTasks, columns: newCols };
//     });
//   }

//   return (
//     <div className="space-y-6">
//       <div className="flex items-center justify-between">
//         <h2 className="text-xl font-bold">Kanban</h2>
//         <div className="flex gap-3">
//           <button
//             className="px-3 py-2 rounded-lg"
//             onClick={() => {
//               const b = resetBoard();
//               setBoard(b);
//             }}
//           >
//             Reset
//           </button>
//         </div>
//       </div>

//       <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
//         <div className="flex gap-6 overflow-x-auto pb-6">
//           {board.columnOrder.map((colId) => {
//             const column = board.columns[colId];
//             const tasks = column.taskIds.map((tid) => board.tasks[tid]);
//             return (
//               <SortableContext key={column.id} items={column.taskIds} strategy={rectSortingStrategy}>
//                 <Column
//                   key={column.id}
//                   column={column}
//                   tasks={tasks}
//                   onAddTask={(title) => addTask(column.id, title)}
//                   onUpdateTask={updateTask}
//                   onDeleteTask={deleteTask}
//                 />
//               </SortableContext>
//             );
//           })}
//         </div>

//         <DragOverlay>
//           {activeId ? (
//             <div className="glass-card p-3 rounded-xl w-72">
//               <div className="font-semibold">{board.tasks[activeId]?.title}</div>
//               <div className="text-xs opacity-60 mt-1">{board.tasks[activeId]?.desc?.slice(0, 60)}</div>
//             </div>
//           ) : null}
//         </DragOverlay>
//       </DndContext>
//     </div>
//   );
// }





// "use client";
// import { useEffect, useState } from "react";
// import axios from "axios";
// import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

// export default function KanbanBoard(){
//   const [board,setBoard] = useState(null);
//   useEffect(()=>{ axios.get("/api/tasks").then(r=>setBoard(r.data)); },[]);
//   if(!board) return <div className="card-glass p-4">Loading...</div>;

//   function reorder(list, start, end){
//     const arr = Array.from(list);
//     const [removed] = arr.splice(start,1);
//     arr.splice(end,0,removed);
//     return arr;
//   }

//   async function onDragEnd(result){
//     const { source, destination, draggableId } = result;
//     if(!destination) return;
//     if(source.droppableId === destination.droppableId && source.index === destination.index) return;

//     const newBoard = JSON.parse(JSON.stringify(board));
//     const startCol = newBoard.columns[source.droppableId];
//     const endCol = newBoard.columns[destination.droppableId];

//     if(startCol === endCol){
//       newBoard.columns[startCol.id].taskIds = reorder(startCol.taskIds, source.index, destination.index);
//     } else {
//       newBoard.columns[startCol.id].taskIds.splice(source.index,1);
//       newBoard.columns[endCol.id].taskIds.splice(destination.index,0,draggableId);
//       newBoard.tasks[draggableId].status = endCol.id;
//     }

//     setBoard(newBoard);
//     try{ await axios.put("/api/tasks/reorder", newBoard); }catch(e){ console.error(e); }
//   }

//   return (
//     <div className="flex gap-4 overflow-x-auto py-2">
//       <DragDropContext onDragEnd={onDragEnd}>
//         {board.columnOrder.map(colId=>{
//           const column = board.columns[colId];
//           const tasks = column.taskIds.map(id=>board.tasks[id]);
//           return (
//             <div key={colId} className="kanban-column min-w-[320px]">
//               <h3 className="font-semibold mb-3">{column.title} <span className="text-xs text-muted-foreground">({tasks.length})</span></h3>
//               <Droppable droppableId={column.id}>
//                 {(provided)=>(
//                   <div ref={provided.innerRef} {...provided.droppableProps} className="space-y-3">
//                     {tasks.map((task,index)=>(
//                       <Draggable draggableId={task.id} index={index} key={task.id}>
//                         {(prov,snap)=>(
//                           <div ref={prov.innerRef} {...prov.draggableProps} {...prov.dragHandleProps} className={`card-glass p-4 rounded-xl ${snap.isDragging ? "ring-2 ring-offset-2" : ""}`}>
//                             <div className="font-semibold">{task.title}</div>
//                             <div className="text-xs text-muted-foreground">{task.description}</div>
//                             <div className="flex justify-between items-center mt-3">
//                               <div className="text-xs text-muted-foreground">{(task.assignees||[]).slice(0,3).join(", ")}</div>
//                               <div className="neon-badge text-xs">{task.priority}</div>
//                             </div>
//                           </div>
//                         )}
//                       </Draggable>
//                     ))}
//                     {provided.placeholder}
//                   </div>
//                 )}
//               </Droppable>
//             </div>
//           );
//         })}
//       </DragDropContext>
//     </div>
//   );
// }





"use client";
import React, { useEffect, useState, useCallback } from "react";
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
  DragOverlay
} from "@dnd-kit/core";
import {
  SortableContext,
  rectSortingStrategy,
  arrayMove,
  sortableKeyboardCoordinates
} from "@dnd-kit/sortable";

import Column from "./Column";
import api from "@/lib/api";

/**
 * KanbanBoard
 *
 * Handles:
 * - localStorage load/save
 * - cross-tab sync via storage event (subscribeStorage)
 * - drag+drop reordering within same column and moving across columns
 *
 * Note: each TaskCard uses its id as draggable id.
 */

export default function KanbanBoard() {
  const [board, setBoard] = useState(null);
  const [activeId, setActiveId] = useState(null);

  // Load board from API
  useEffect(() => {
    api.get("/board").then(res => setBoard(res.data)).catch(() => setBoard(null));
  }, []);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));

  if (!board) return null;

  const findColumnForTask = useCallback(
    (taskId) => Object.values(board.columns).find((c) => c.taskIds.includes(taskId))?.id,
    [board]
  );

  function handleDragStart(event) {
    setActiveId(event.active.id);
  }

  function handleDragEnd(event) {
    const { active, over } = event;
    setActiveId(null);
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    // find columns
    const sourceColId = findColumnForTask(activeId);
    const destColId = findColumnForTask(overId) || overId; // if over is column id

    if (!sourceColId || !destColId) return;

    // if same column => we need to reorder within that column using indexes
    if (sourceColId === destColId) {
      const col = board.columns[sourceColId];
      const oldIndex = col.taskIds.indexOf(activeId);
      const newIndex = col.taskIds.indexOf(overId);

      if (oldIndex !== newIndex) {
        const newTaskIds = arrayMove(col.taskIds, oldIndex, newIndex);
        setBoard((prev) => ({
          ...prev,
          columns: { ...prev.columns, [sourceColId]: { ...col, taskIds: newTaskIds } }
        }));
      }
      return;
    }

    // moving between columns: remove from source and insert before/after over item or at end
    const source = board.columns[sourceColId];
    const dest = board.columns[destColId];

    // remove from source
    const newSourceIds = source.taskIds.filter((id) => id !== activeId);

    // if over id is a task in dest, insert before that task
    let insertAt = dest.taskIds.length;
    const overIndex = dest.taskIds.indexOf(overId);
    if (overIndex !== -1) {
      insertAt = overIndex;
    }

    const newDestIds = [...dest.taskIds.slice(0, insertAt), activeId, ...dest.taskIds.slice(insertAt)];

    setBoard((prev) => ({
      ...prev,
      columns: {
        ...prev.columns,
        [sourceColId]: { ...source, taskIds: newSourceIds },
        [destColId]: { ...dest, taskIds: newDestIds }
      }
    }));
  }

  async function addTask(columnId, title) {
    try {
      const res = await api.post("/tasks", { title, columnId });
      // Reload board after add
      const boardRes = await api.get("/board");
      setBoard(boardRes.data);
    } catch (e) { /* handle error */ }
  }

  async function updateTask(taskId, patch) {
    try {
      await api.put(`/tasks/${taskId}`, patch);
      const boardRes = await api.get("/board");
      setBoard(boardRes.data);
    } catch (e) { /* handle error */ }
  }

  async function deleteTask(taskId) {
    try {
      await api.delete(`/tasks/${taskId}`);
      const boardRes = await api.get("/board");
      setBoard(boardRes.data);
    } catch (e) { /* handle error */ }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Kanban</h2>
        <div className="flex gap-3">
          <button
            className="px-3 py-2 rounded-lg"
            onClick={() => {
              const b = resetBoard();
              setBoard(b);
            }}
          >
            Reset
          </button>
        </div>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="flex gap-6 overflow-x-auto pb-6">
          {board.columnOrder.map((colId) => {
            const column = board.columns[colId];
            const tasks = column.taskIds.map((tid) => board.tasks[tid]);
            return (
              <SortableContext key={column.id} items={column.taskIds} strategy={rectSortingStrategy}>
                <Column
                  key={column.id}
                  column={column}
                  tasks={tasks}
                  onAddTask={(title) => addTask(column.id, title)}
                  onUpdateTask={updateTask}
                  onDeleteTask={deleteTask}
                />
              </SortableContext>
            );
          })}
        </div>

        <DragOverlay>
          {activeId ? (
            <div className="glass-card p-3 rounded-xl w-72">
              <div className="font-semibold">{board.tasks[activeId]?.title}</div>
              <div className="text-xs opacity-60 mt-1">{board.tasks[activeId]?.desc?.slice(0, 60)}</div>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}




    


// "use client";
// import React, { useEffect, useState } from "react";
// import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
// import { arrayMove, SortableContext, rectSortingStrategy } from "@dnd-kit/sortable";
// import Column from "./Column";
// import { loadBoard, saveBoard, resetBoard } from "@/lib/kanbanStorage";

// /*
//   KanbanBoard: top-level component that loads/saves board to localStorage.
//   Uses @dnd-kit for drag & drop.
// */

// export default function KanbanBoard() {
//   const [board, setBoard] = useState(null);

//   useEffect(() => {
//     const existing = loadBoard();
//     if (existing) setBoard(existing);
//     else setBoard(resetBoard());
//   }, []);

//   useEffect(() => {
//     if (board) saveBoard(board);
//   }, [board]);

//   const sensors = useSensors(useSensor(PointerSensor));

//   if (!board) return null;

//   function moveTask({ active, over }) {
//     if (!over) return;

//     const sourceColumnId = findColumnForTask(active.id, board);
//     const destColumnId = over.data?.current?.columnId || over.id; // over may be a column or task

//     if (!sourceColumnId || !destColumnId) return;
//     if (sourceColumnId === destColumnId) return;

//     const source = board.columns[sourceColumnId];
//     const dest = board.columns[destColumnId];
//     const newSourceIds = source.taskIds.filter((id) => id !== active.id);
//     const newDestIds = [...dest.taskIds, active.id];

//     const newBoard = {
//       ...board,
//       columns: {
//         ...board.columns,
//         [sourceColumnId]: { ...source, taskIds: newSourceIds },
//         [destColumnId]: { ...dest, taskIds: newDestIds }
//       }
//     };
//     setBoard(newBoard);
//   }

//   // reorder tasks inside same column (sortable)
//   function handleSortEnd(columnId, oldIndex, newIndex) {
//     const col = board.columns[columnId];
//     const newTaskIds = arrayMove(col.taskIds, oldIndex, newIndex);
//     setBoard({
//       ...board,
//       columns: {
//         ...board.columns,
//         [columnId]: { ...col, taskIds: newTaskIds }
//       }
//     });
//   }

//   function findColumnForTask(taskId, boardObj) {
//     return Object.values(boardObj.columns).find((c) => c.taskIds.includes(taskId))?.id;
//   }

//   function addTask(columnId, title) {
//     const id = `t-${Date.now()}`;
//     const newTask = { id, title, desc: "", assignees: [], due: null, comments: [], attachments: [], priority: "low" };
//     const newBoard = {
//       ...board,
//       tasks: { ...board.tasks, [id]: newTask },
//       columns: { ...board.columns, [columnId]: { ...board.columns[columnId], taskIds: [id, ...board.columns[columnId].taskIds] } }
//     };
//     setBoard(newBoard);
//   }

//   function updateTask(taskId, patch) {
//     setBoard((prev) => ({ ...prev, tasks: { ...prev.tasks, [taskId]: { ...prev.tasks[taskId], ...patch } } }));
//   }

//   function deleteTask(taskId) {
//     const newTasks = { ...board.tasks };
//     delete newTasks[taskId];
//     const newColumns = {};
//     for (const id of board.columnOrder) {
//       newColumns[id] = { ...board.columns[id], taskIds: board.columns[id].taskIds.filter((t) => t !== taskId) };
//     }
//     setBoard({ ...board, tasks: newTasks, columns: newColumns });
//   }

//   return (
//     <div className="space-y-6">
//       <div className="flex items-center justify-between">
//         <h2 className="text-xl font-bold">Kanban</h2>
//         <div className="flex gap-3">
//           <button
//             className="px-3 py-2 rounded-lg"
//             onClick={() => {
//               const b = resetBoard();
//               setBoard(b);
//             }}
//           >
//             Reset
//           </button>
//         </div>
//       </div>

//       <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={(e) => {
//         const { active, over } = e;
//         // if over is a column drop zone, we'll move to that column
//         if (!over) return;
//         const activeId = active.id;
//         const overId = over.id;
//         // If over is a task, get column id from its data
//         const overColumn = over.data?.current?.columnId;
//         // If active and over in same container but different index, handled in Column via Sortable
//         moveTask({ active: { id: activeId }, over: over });
//       }}>
//         <div className="flex gap-6 overflow-x-auto pb-6">
//           {board.columnOrder.map((colId) => {
//             const column = board.columns[colId];
//             const tasks = column.taskIds.map((tid) => board.tasks[tid]);
//             return (
//               <SortableContext key={column.id} items={column.taskIds} strategy={rectSortingStrategy}>
//                 <Column
//                   column={column}
//                   tasks={tasks}
//                   onSortEnd={(oldIndex, newIndex) => handleSortEnd(column.id, oldIndex, newIndex)}
//                   onAddTask={(title) => addTask(column.id, title)}
//                   onUpdateTask={updateTask}
//                   onDeleteTask={deleteTask}
//                 />
//               </SortableContext>
//             );
//           })}
//         </div>
//       </DndContext>
//     </div>
//   );
// }
