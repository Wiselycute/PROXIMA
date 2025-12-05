// src/components/ui/ToastProvider.jsx
"use client";
import React, { createContext, useContext, useState, useCallback } from "react";

const ToastCtx = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const push = useCallback((props) => {
    const id = `t-${Date.now()}-${Math.random().toString(36).slice(2,7)}`;
    setToasts((s) => [...s, { id, ...props }]);
    if (props.duration !== 0) {
      setTimeout(() => setToasts((s) => s.filter((t) => t.id !== id)), props.duration ?? 3200);
    }
  }, []);

  const remove = useCallback((id) => setToasts((s) => s.filter((t) => t.id !== id)), []);

  return (
    <ToastCtx.Provider value={{ push, remove }}>
      {children}
      <div className="toast-container" aria-live="polite">
        {toasts.map((t) => (
          <div key={t.id} className="toast">
            <div style={{fontWeight:700}}>{t.title}</div>
            {t.description && <div style={{opacity:0.9,fontSize:13, marginTop:6}}>{t.description}</div>}
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastCtx);
  if (!ctx) throw new Error("useToast must be used inside ToastProvider");
  return ctx;
}
