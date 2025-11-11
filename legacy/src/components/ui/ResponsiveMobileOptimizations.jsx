import React from 'react';
import { useIsMobile } from '../hooks/useIsMobile';
import { cn } from '../utils/cn';

/**
 * Responsive container with mobile optimizations
 */
export const ResponsiveContainer = ({ children, className = '' }) => {
  const isMobile = useIsMobile();

  return (
    <div className={cn(
      'w-full',
      isMobile ? 'px-4 py-3' : 'px-6 py-4',
      className
    )}>
      {children}
    </div>
  );
};

/**
 * Responsive grid with mobile optimizations
 */
export const ResponsiveGrid = ({ children, cols = { mobile: 1, tablet: 2, desktop: 3 }, gap = 4, className = '' }) => {
  return (
    <div className={cn(
      'grid gap-' + gap,
      `grid-cols-${cols.mobile}`,
      `md:grid-cols-${cols.tablet}`,
      `lg:grid-cols-${cols.desktop}`,
      className
    )}>
      {children}
    </div>
  );
};

/**
 * Mobile-friendly table that converts to cards on small screens
 */
export const ResponsiveTable = ({ data, columns, renderMobileCard }) => {
  const isMobile = useIsMobile();

  if (isMobile && renderMobileCard) {
    return (
      <div className="space-y-3">
        {data.map((item, index) => renderMobileCard(item, index))}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-brand-border">
            {columns.map((col, i) => (
              <th key={i} className="text-left p-3 text-sm font-semibold text-brand-text-primary">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, rowIndex) => (
            <tr key={rowIndex} className="border-b border-brand-border last:border-0">
              {columns.map((col, colIndex) => (
                <td key={colIndex} className="p-3 text-sm text-brand-text-secondary">
                  {col.render ? col.render(item) : item[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

/**
 * Touch-friendly button with larger hit area on mobile
 */
export const TouchButton = ({ children, className = '', ...props }) => {
  const isMobile = useIsMobile();

  return (
    <button
      className={cn(
        'transition-all duration-200 active:scale-95',
        isMobile ? 'min-h-[44px] px-4' : 'px-3 py-2',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

/**
 * Bottom sheet for mobile modals
 */
export const MobileBottomSheet = ({ isOpen, onClose, children, title }) => {
  const isMobile = useIsMobile();

  if (!isMobile) {
    return children; // Render as normal modal on desktop
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="absolute bottom-0 left-0 right-0 bg-brand-card-bg rounded-t-2xl p-6 max-h-[90vh] overflow-y-auto">
        {title && (
          <h3 className="text-lg font-semibold text-brand-text-primary mb-4">{title}</h3>
        )}
        {children}
      </div>
    </div>
  );
};