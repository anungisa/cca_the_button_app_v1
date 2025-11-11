import React from 'react';
import { cn } from '@/lib/utils';

const Toggle = React.forwardRef(({ 
  className, 
  pressed,
  onPressedChange,
  variant = "default",
  size = "default",
  children,
  ...props 
}, ref) => {
  const variantClasses = {
    default: "bg-transparent",
    outline: "border border-brand-border bg-transparent hover:bg-brand-border hover:text-brand-text-primary",
  };

  const sizeClasses = {
    default: "h-10 px-3",
    sm: "h-9 px-2.5",
    lg: "h-11 px-5",
  };

  return (
    <button
      ref={ref}
      type="button"
      onClick={() => onPressedChange && onPressedChange(!pressed)}
      className={cn(
        "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors",
        "hover:bg-brand-border hover:text-brand-text-primary",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red focus-visible:ring-offset-2",
        "disabled:pointer-events-none disabled:opacity-50",
        pressed 
          ? "bg-brand-red text-white" 
          : "text-brand-text-secondary",
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
});

Toggle.displayName = "Toggle";

export { Toggle };