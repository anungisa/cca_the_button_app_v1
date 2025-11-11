import React from 'react';
import { cn } from '@/lib/utils';

const ToggleGroup = React.forwardRef(({ 
  className, 
  type = "single", 
  value, 
  onValueChange, 
  children, 
  ...props 
}, ref) => {
  const handleToggle = (itemValue) => {
    if (type === "single") {
      if (value !== itemValue) {
        onValueChange(itemValue);
      }
    }
  };

  return (
    <div
      ref={ref}
      className={cn("flex items-center justify-center gap-1", className)}
      {...props}
    >
      {React.Children.map(children, (child) =>
        React.cloneElement(child, {
          isSelected: value === child.props.value,
          onToggle: () => handleToggle(child.props.value),
        })
      )}
    </div>
  );
});

ToggleGroup.displayName = "ToggleGroup";

const ToggleGroupItem = React.forwardRef(({ 
  className, 
  children, 
  value,
  isSelected,
  onToggle,
  ...props 
}, ref) => {
  return (
    <button
      ref={ref}
      type="button"
      onClick={onToggle}
      className={cn(
        "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors",
        "h-10 px-3 py-2",
        "hover:bg-brand-border hover:text-brand-text-primary",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red focus-visible:ring-offset-2",
        "disabled:pointer-events-none disabled:opacity-50",
        isSelected 
          ? "bg-brand-red text-white" 
          : "bg-transparent text-brand-text-secondary",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
});

ToggleGroupItem.displayName = "ToggleGroupItem";

export { ToggleGroup, ToggleGroupItem };