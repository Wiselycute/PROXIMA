import * as React from "react";

const Input = React.forwardRef(({ className = "", ...props }, ref) => {
  return <input ref={ref} className={`px-3 py-2 bg-white/5 border rounded-md ${className}`} {...props} />;
});
Input.displayName = "Input";

export { Input };
