"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function FilePreviewModal({ file, onClose, onDelete, onShare }) {
  if (!file) return null;

  const isImage = (file.type || "").startsWith("image/");
  const isText = (file.type || "").startsWith("text/");
  const isPdf = (file.type || "").includes("pdf");

  return (
    <Dialog open={!!file} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <div className="flex items-start gap-6">
          <div className="w-full">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-semibold text-xl">{file.name}</h3>
                <div className="text-sm text-muted-foreground">{new Date(file.date).toLocaleString()}</div>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" onClick={() => onShare && onShare(file.id)}>Share</Button>
                <Button variant="destructive" onClick={() => { onDelete && onDelete(file.id); onClose(); }}>Delete</Button>
              </div>
            </div>

            <div className="bg-black/40 rounded-md p-4 min-h-[280px]">
              {isImage && file.preview && <img src={file.preview} alt={file.name} className="max-h-[420px] object-contain mx-auto" />}
              {isPdf && file.preview && <iframe src={file.preview} className="w-full h-96" title={file.name} />}
              {isText && file.preview && <pre className="text-xs text-gray-200 overflow-auto max-h-96">{atob(file.preview.split(",")[1] || "")}</pre>}
              {!isImage && !isPdf && !isText && <div className="text-muted-foreground">No preview available</div>}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
