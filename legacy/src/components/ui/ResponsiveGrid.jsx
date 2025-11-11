import React from 'react';
import { cn } from '@/components/utils/cn';

/**
 * Responsive grid component that adapts to screen sizes
 */
export default function ResponsiveGrid({ 
  children, 
  className = "",
  cols = { mobile: 1, tablet: 2, desktop: 3, wide: 4 },
  gap = "gap-4 md:gap-6",
  ...props 
}) {
  const gridClasses = cn(
    "grid w-full",
    `grid-cols-${cols.mobile}`,
    `sm:grid-cols-${cols.mobile}`,
    `md:grid-cols-${cols.tablet}`,
    `lg:grid-cols-${cols.desktop}`,
    `xl:grid-cols-${cols.wide}`,
    gap,
    className
  );

  return (
    <div className={gridClasses} {...props}>
      {children}
    </div>
  );
}