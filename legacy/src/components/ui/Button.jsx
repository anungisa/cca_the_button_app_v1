import React from 'react';
import { cn } from '../utils/cn';

const buttonVariants = {
  variant: {
    default: "bg-brand-red text-white hover:bg-red-700 active:bg-red-800 focus:ring-brand-red/50",
    destructive: "bg-red-600 text-white hover:bg-red-700 active:bg-red-800",
    outline: "border border-brand-border bg-transparent text-brand-text-primary hover:bg-brand-card-bg hover:text-brand-text-primary",
    secondary: "bg-brand-card-bg text-brand-text-primary hover:bg-brand-border",
    ghost: "text-brand-text-primary hover:bg-brand-card-bg hover:text-brand-text-primary",
    link: "text-brand-red underline-offset-4 hover:underline",
  },
  size: {
    default: "h-10 px-4 py-2",
    sm: "h-9 rounded-md px-3",
    lg: "h-11 rounded-md px-8",
    icon: "h-10 w-10",
  },
};

const Button = React.forwardRef(({ 
  className, 
  variant = "default", 
  size = "default", 
  children,
  disabled,
  ...props 
}, ref) => {
  const baseClasses = "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";
  
  const variantClasses = buttonVariants.variant[variant] || buttonVariants.variant.default;
  const sizeClasses = buttonVariants.size[size] || buttonVariants.size.default;
  
  return (
    <button
      className={cn(baseClasses, variantClasses, sizeClasses, className)}
      disabled={disabled}
      ref={ref}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";

export { Button, buttonVariants };