// src/lib/kanbanStorage.js
const KEY = "proxima-kanban-v1";

export function loadBoard() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    console.error("loadBoard error", e);
    return null;
  }
}

export function saveBoard(board) {
  try {
    localStorage.setItem(KEY, JSON.stringify(board));
  } catch (e) {
    console.error("saveBoard error", e);
  }
}

export function resetBoard() {
  const initial = {
    columns: {
      todo: { id: "todo", title: "To Do", taskIds: ["t-1", "t-2"] },
      inprogress: { id: "inprogress", title: "In Progress", taskIds: ["t-3"] },
      done: { id: "done", title: "Done", taskIds: [] }
    },
    columnOrder: ["todo", "inprogress", "done"],
    tasks: {
      "t-1": { id: "t-1", title: "Design Task UI", desc: "Create landing page UI", assignees: [], due: null, comments: [], attachments: [], priority: "medium" },
      "t-2": { id: "t-2", title: "Write tests", desc: "Unit + integration tests", assignees: [], due: null, comments: [], attachments: [], priority: "low" },
      "t-3": { id: "t-3", title: "API Integration", desc: "Hook auth & data", assignees: [], due: null, comments: [], attachments: [], priority: "high" }
    }
  };
  saveBoard(initial);
  return initial;
}

/**
 * Listen to storage changes and call handler with newBoard when storage changes.
 * Returns a function to remove the listener.
 */
export function subscribeStorage(handler) {
  function onStorage(e) {
    if (e.key === KEY) {
      try {
        const next = JSON.parse(e.newValue);
        handler(next);
      } catch (err) {
        // ignore
      }
    }
  }
  window.addEventListener("storage", onStorage);
  return () => window.removeEventListener("storage", onStorage);
}
