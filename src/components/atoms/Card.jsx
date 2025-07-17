import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Card = forwardRef(({ 
  className, 
  variant = "default",
  children,
  ...props 
}, ref) => {
  const variants = {
    default: "bg-white border border-gray-200 shadow-soft",
    elevated: "bg-white border border-gray-200 shadow-floating",
    gradient: "bg-gradient-to-br from-white to-gray-50 border border-gray-200 shadow-soft",
    glass: "glassmorphism"
  };

  return (
    <div
      ref={ref}
      className={cn(
        "rounded-xl transition-all duration-200",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = "Card";

export default Card;