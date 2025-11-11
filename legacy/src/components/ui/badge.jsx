import * as React from "react"
import { cn } from "@/components/utils/cn"

const badgeVariants = {
  default: "inline-flex items-center rounded-full border border-transparent bg-brand-red text-white px-2.5 py-0.5 text-xs font-semibold",
  secondary: "inline-flex items-center rounded-full border border-brand-border bg-brand-card-bg text-brand-text-primary px-2.5 py-0.5 text-xs font-semibold",
  outline: "inline-flex items-center rounded-full border border-brand-border bg-transparent text-brand-text-primary px-2.5 py-0.5 text-xs font-semibold"
}

function Badge({ className, variant = "default", children, ...props }) {
  const baseClasses = badgeVariants[variant] || badgeVariants.default;
  
  return (
    <div className={cn(baseClasses, className)} {...props}>
      {children}
    </div>
  )
}

export { Badge, badgeVariants }