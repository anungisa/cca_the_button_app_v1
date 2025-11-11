import React from 'react';
import { cn } from '@/components/utils/cn';
import { useIsMobile } from '../hooks/useIsMobile';

export const MobileAwareLayout = ({ 
  children, 
  mobileClassName,
  desktopClassName,
  className,
  breakpoint = 768,
  ...props 
}) => {
  const isMobile = useIsMobile(breakpoint);

  return (
    <div 
      className={cn(
        className,
        isMobile ? mobileClassName : desktopClassName
      )}
      {...props}
    >
      {children}
    </div>
  );
};

// Responsive Grid Component
export const ResponsiveGrid = ({ 
  children, 
  cols = { xs: 1, sm: 2, md: 3, lg: 4 }, 
  gap = 4,
  className,
  ...props 
}) => {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-2', 
    3: 'grid-cols-3',
    4: 'grid-cols-4',
    5: 'grid-cols-5',
    6: 'grid-cols-6'
  };

  const responsiveClasses = [
    cols.xs && gridCols[cols.xs],
    cols.sm && `sm:${gridCols[cols.sm]}`,
    cols.md && `md:${gridCols[cols.md]}`,
    cols.lg && `lg:${gridCols[cols.lg]}`,
    cols.xl && `xl:${gridCols[cols.xl]}`
  ].filter(Boolean).join(' ');

  return (
    <div 
      className={cn(
        'grid',
        responsiveClasses,
        `gap-${gap}`,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

// Responsive Container
export const ResponsiveContainer = ({ 
  children, 
  maxWidth = '7xl',
  padding = { x: 4, sm: 6, lg: 8 },
  className,
  ...props 
}) => {
  const maxWidths = {
    'sm': 'max-w-sm',
    'md': 'max-w-md', 
    'lg': 'max-w-lg',
    'xl': 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    '4xl': 'max-w-4xl',
    '5xl': 'max-w-5xl',
    '6xl': 'max-w-6xl',
    '7xl': 'max-w-7xl',
    'full': 'max-w-full'
  };

  const paddingClasses = [
    padding.x && `px-${padding.x}`,
    padding.y && `py-${padding.y}`,
    padding.sm && `sm:px-${padding.sm}`,
    padding.md && `md:px-${padding.md}`,
    padding.lg && `lg:px-${padding.lg}`,
    padding.xl && `xl:px-${padding.xl}`
  ].filter(Boolean).join(' ');

  return (
    <div 
      className={cn(
        'mx-auto w-full',
        maxWidths[maxWidth],
        paddingClasses,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};