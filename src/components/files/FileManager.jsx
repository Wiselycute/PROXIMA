// 
"use client";

import { useEffect, useState, useRef } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Plus, Upload, Folder, MoreHorizontal } from "lucide-react";
import CreateFolderModal from "./CreateFolderModal";
import FileCard from "./FileCard";
import FilePreviewModal from "./FilePreviewModal";
import ShareLinkModal from "./ShareLinkModal";
import RenameDeleteModal from "./RenameDeleteModal";
import StorageChart from "./StorageChart";

const STORAGE_KEY = "proxima_files_v1";

function uid() {
  return "id_" + Math.random().toString(36).slice(2, 9);
}

export default function FileManager() {
  const [data, setData] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {
        folders: [
          { id: "f_docs", name: "Documents", files: [] },
          { id: "f_media", name: "Personal Media", files: [] },
          { id: "f_work", name: "Work Project", files: [] },
        ],
        files: {}, // map id -> file meta
      };
    } catch {
      return { folders: [], files: {} };
    }
  });

  const [showCreate, setShowCreate] = useState(false);
  const [previewFile, setPreviewFile] = useState(null);
  const [shareFile, setShareFile] = useState(null);
  const [renameTarget, setRenameTarget] = useState(null);
  const uploadRef = useRef(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  // helper: add file metadata and link it to a folder
  const handleUpload = async (fileList, folderId) => {
    const filesArray = Array.from(fileList);
    for (const f of filesArray) {
      const id = uid();
      const meta = {
        id,
        name: f.name,
        size: f.size,
        type: f.type,
        date: new Date().toISOString(),
        folderId,
        // create small preview for images/text
        preview: await readFileAsDataURL(f),
      };

      setData(prev => {
        const next = { ...prev, files: { ...prev.files, [id]: meta } };
        const folders = prev.folders.map(fd =>
          fd.id === folderId ? { ...fd, files: [...fd.files, id] } : fd
        );
        next.folders = folders;
        return next;
      });
    }
  };

  function readFileAsDataURL(file) {
    return new Promise(resolve => {
      if (!file) return resolve(null);
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(file);
    });
  }

  // Drag & drop handlers for folders (reorder folders)
  const onDragEnd = result => {
    if (!result.destination) return;
    if (result.type === "folder") {
      const newFolders = Array.from(data.folders);
      const [removed] = newFolders.splice(result.source.index, 1);
      newFolders.splice(result.destination.index, 0, removed);
      setData(prev => ({ ...prev, folders: newFolders }));
    } else if (result.type === "file") {
      // moving file between folders
      const { source, destination, draggableId } = result;
      if (!destination) return;
      const srcFolderId = source.droppableId;
      const dstFolderId = destination.droppableId;
      if (srcFolderId === dstFolderId && source.index === destination.index) return;

      setData(prev => {
        const folders = prev.folders.map(f => {
          if (f.id === srcFolderId) {
            return { ...f, files: f.files.filter(id => id !== draggableId) };
          } else if (f.id === dstFolderId) {
            const nextFiles = Array.from(f.files);
            nextFiles.splice(destination.index, 0, draggableId);
            return { ...f, files: nextFiles };
          }
          return f;
        });

        const files = { ...prev.files, [draggableId]: { ...prev.files[draggableId], folderId: dstFolderId } };

        return { ...prev, folders, files };
      });
    }
  };

  const addFolder = name => {
    const id = uid();
    setData(prev => ({ ...prev, folders: [...prev.folders, { id, name, files: [] }] }));
  };

  const handleDeleteFile = fileId => {
    setData(prev => {
      const files = { ...prev.files };
      const folderId = files[fileId]?.folderId;
      delete files[fileId];

      const folders = prev.folders.map(f => (f.id === folderId ? { ...f, files: f.files.filter(i => i !== fileId) } : f));
      return { ...prev, files, folders };
    });
    setPreviewFile(null);
  };

  const handleRenameFolder = (folderId, newName) => {
    setData(prev => ({ ...prev, folders: prev.folders.map(f => (f.id === folderId ? { ...f, name: newName } : f)) }));
    setRenameTarget(null);
  };

  const handleDeleteFolder = folderId => {
    setData(prev => {
      const files = { ...prev.files };
      const folder = prev.folders.find(f => f.id === folderId);
      if (folder) folder.files.forEach(id => delete files[id]);
      const folders = prev.folders.filter(f => f.id !== folderId);
      return { ...prev, files, folders };
    });
    setRenameTarget(null);
  };

  const handleShare = fileId => {
    setShareFile(data.files[fileId]);
  };

  const storageUsage = (() => {
    let used = 0;
    Object.values(data.files).forEach(f => { used += f.size || 0; });
    // return MBs
    return { usedBytes: used, usedMB: Math.round(used / (1024 * 1024)) };
  })();

  return (
    <div className="space-y-6">
      {/* top controls */}
      <div className="flex items-center justify-between">
        <div className="flex gap-3">
          <button onClick={() => setShowCreate(true)} className="btn-primary px-4 py-2 rounded-lg inline-flex items-center gap-2">
            <Plus className="w-4 h-4" /> New Folder
          </button>

          <label className="btn-outline px-4 py-2 rounded-lg inline-flex items-center gap-2 cursor-pointer">
            <Upload className="w-4 h-4" /> Upload
            <input ref={uploadRef} type="file" multiple className="hidden" onChange={e => {
              // if no specific folder selected, put in first folder
              const folderId = data.folders[0]?.id || null;
              if (!folderId) { alert("Create a folder first"); return; }
              handleUpload(e.target.files, folderId);
              e.target.value = "";
            }} />
          </label>
        </div>

        <div className="text-sm text-muted-foreground">
          Storage used: <strong>{storageUsage.usedMB} MB</strong>
        </div>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="folders" type="folder" direction="vertical">
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps} className="grid grid-cols-3 gap-4 py-2">
              {data.folders.map((folder, idx) => (
                <Draggable key={folder.id} draggableId={folder.id} index={idx}>
                  {(dr) => (
                    <div
                      ref={dr.innerRef}
                      {...dr.draggableProps}
                      className="bg-card p-4 rounded-xl border border-white/6 hover:border-white/12 transition"
                      style={{ ...dr.draggableProps.style }}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3 flex-1">
                          <div className="w-10 h-10 rounded-md flex items-center justify-center neon-folder" title={folder.name}>
                            <Folder className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-white truncate">{folder.name}</div>
                            <div className="text-xs text-muted-foreground">{folder.files.length} files</div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 ml-2">
                          <button {...dr.dragHandleProps} className="p-1 rounded hover:bg-white/3" title="Drag to reorder">
                            <MoreHorizontal className="w-4 h-4 text-gray-300" />
                          </button>
                          <button onClick={() => handleDeleteFolder(folder.id)} className="p-1 rounded hover:bg-red-500/20 text-red-400 hover:text-red-300 transition" title="Delete folder">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>

                      <Droppable droppableId={folder.id} type="file">
                        {(dropProvided, snapshot) => (
                          <div ref={dropProvided.innerRef} {...dropProvided.droppableProps} className={`min-h-[100px] rounded-md p-1 ${snapshot.isDraggingOver ? "border-2 border-dashed border-[#4BE2F2]/30 bg-[#0b1220]" : ""}`}>
                            {folder.files.map((fileId, index) => {
                              const meta = data.files[fileId];
                              if (!meta) return null;
                              return (
                                <Draggable key={fileId} draggableId={fileId} index={index}>
                                  {(fp) => (
                                    <div ref={fp.innerRef} {...fp.draggableProps} {...fp.dragHandleProps}>
                                      <FileCard
                                        file={meta}
                                        onPreview={() => setPreviewFile(meta)}
                                        onShare={() => handleShare(meta.id)}
                                        onDelete={() => handleDeleteFile(meta.id)}
                                      />
                                    </div>
                                  )}
                                </Draggable>
                              );
                            })}
                            {dropProvided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {/* bottom row: recent files & chart */}
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-8 bg-card rounded-xl p-4 border">
          <h3 className="font-semibold text-white mb-3">Recent Files</h3>
          <div className="space-y-2">
            {Object.values(data.files).slice(-8).reverse().map(f => (
              <div key={f.id} className="flex items-center justify-between p-3 rounded-md hover:bg-white/3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-md bg-white/5 flex items-center justify-center">
                    <div className="text-sm text-white/90">{fileTypeIcon(f.name)}</div>
                  </div>
                  <div>
                    <div className="font-medium text-white">{f.name}</div>
                    <div className="text-xs text-muted-foreground">{new Date(f.date).toLocaleString()}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button className="text-sm text-muted-foreground" onClick={() => setPreviewFile(f)}>Preview</button>
                  <button className="text-sm text-muted-foreground" onClick={() => setShareFile(f)}>Share</button>
                </div>
              </div>
            ))}
            {Object.values(data.files).length === 0 && <div className="text-sm text-muted-foreground p-4">No files uploaded yet.</div>}
          </div>
        </div>

        <div className="col-span-4 bg-card rounded-xl p-4 border">
          <h3 className="font-semibold text-white mb-3">Activity Chart</h3>
          <StorageChart files={Object.values(data.files)} folders={data.folders} />
        </div>
      </div>

      {/* Modals */}
      <CreateFolderModal open={showCreate} setOpen={setShowCreate} onCreate={addFolder} />
      <FilePreviewModal file={previewFile} onClose={() => setPreviewFile(null)} onDelete={handleDeleteFile} onShare={handleShare} />
      <ShareLinkModal file={shareFile} onClose={() => setShareFile(null)} />
      <RenameDeleteModal target={renameTarget} onClose={() => setRenameTarget(null)} onRename={handleRenameFolder} onDelete={handleDeleteFolder} />
    </div>
  );
}

function fileTypeIcon(name = "") {
  const ext = name.split(".").pop()?.toLowerCase() || "";
  if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext)) return "🖼️";
  if (["pdf"].includes(ext)) return "📄";
  if (["doc", "docx", "txt"].includes(ext)) return "📝";
  if (["zip", "rar"].includes(ext)) return "🗜️";
  return "📁";
}
