import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Avatar = forwardRef(({ 
  className, 
  src,
  name,
  color = "#5B4CFF",
  size = "default",
  ...props 
}, ref) => {
  const sizes = {
    sm: "w-6 h-6 text-xs",
    default: "w-8 h-8 text-sm",
    lg: "w-10 h-10 text-base",
    xl: "w-12 h-12 text-lg"
  };

  const getInitials = (name) => {
    return name
      ?.split(" ")
      .map(word => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "U";
  };

  return (
    <div
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center rounded-full font-medium text-white font-body",
        sizes[size],
        className
      )}
      style={{ backgroundColor: color }}
      {...props}
    >
      {src ? (
        <img
          src={src}
          alt={name}
          className="w-full h-full object-cover rounded-full"
        />
      ) : (
        <span>{getInitials(name)}</span>
      )}
    </div>
  );
});

Avatar.displayName = "Avatar";

export default Avatar;