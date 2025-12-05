"use client";
import * as React from "react";

const SelectContext = React.createContext({ value: undefined, onValueChange: () => {} });

export function Select({ value, onValueChange = () => {}, children }) {
  return (
    <SelectContext.Provider value={{ value, onValueChange }}>
      <div>{children}</div>
    </SelectContext.Provider>
  );
}

export function SelectTrigger({ children, className = "", ...props }) {
  return (
    <div className={`border bg-white/5 px-3 py-2 rounded-md ${className}`} {...props}>
      {children}
    </div>
  );
}

export function SelectValue({ placeholder = "", children }) {
  return <span className="text-sm opacity-80">{children || placeholder}</span>;
}

export function SelectContent({ children, className = "", ...props }) {
  return (
    <div className={`mt-2 bg-white/3 p-2 rounded-md ${className}`} {...props}>
      {children}
    </div>
  );
}

export function SelectItem({ value, children, className = "" }) {
  const ctx = React.useContext(SelectContext);
  return (
    <div
      role="button"
      onClick={() => ctx.onValueChange(value)}
      className={`px-2 py-1 rounded hover:bg-white/6 cursor-pointer ${className}`}
    >
      {children}
    </div>
  );
}

export default Select;
