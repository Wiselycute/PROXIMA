"use client";
import * as React from "react";

const DialogContext = React.createContext({ open: false, onOpenChange: () => {} });

export function Dialog({ open = false, onOpenChange = () => {}, children }) {
  return (
    <DialogContext.Provider value={{ open, onOpenChange }}>
      {children}
    </DialogContext.Provider>
  );
}

export function DialogContent({ className = "", children, ...props }) {
  return (
    <div className={`bg-[rgba(255,255,255,0.02)] p-4 rounded-lg ${className}`} {...props}>
      {children}
    </div>
  );
}

export function DialogHeader({ children, ...props }) {
  return <div className="mb-2" {...props}>{children}</div>;
}

export function DialogTitle({ children, ...props }) {
  return <h3 className="text-lg font-semibold" {...props}>{children}</h3>;
}

export function DialogFooter({ children, className = "", ...props }) {
  return <div className={`mt-4 ${className}`} {...props}>{children}</div>;
}

export default Dialog;
