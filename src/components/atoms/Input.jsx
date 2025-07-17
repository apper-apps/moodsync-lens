import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Input = forwardRef(({ 
  className, 
  type = "text", 
  label,
  error,
  ...props 
}, ref) => {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700 font-body">
          {label}
        </label>
      )}
      <input
        type={type}
        ref={ref}
        className={cn(
          "w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200",
          error && "border-error focus:ring-error/50 focus:border-error",
          className
        )}
        {...props}
      />
      {error && (
        <p className="text-sm text-error font-body">{error}</p>
      )}
    </div>
  );
});

Input.displayName = "Input";

export default Input;