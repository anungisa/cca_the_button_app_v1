
import { cn } from "@/components/utils/cn"

function Skeleton({
  className,
  ...props
}) {
  return (
    (<div
      className={cn("animate-pulse rounded-md bg-brand-border/50", className)}
      {...props} />)
  );
}

export { Skeleton };
