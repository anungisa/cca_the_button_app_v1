import React from 'react';
import { cn } from '../utils/cn';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

// Heading Component
export const Heading = ({ level = 1, children, className, ...props }) => {
  const Tag = `h${level}`;
  const sizeClasses = {
    1: 'text-4xl font-bold tracking-tight',
    2: 'text-3xl font-semibold tracking-tight',
    3: 'text-xl font-semibold',
    4: 'text-lg font-medium',
  };
  return (
    <Tag className={cn(sizeClasses[level], 'text-brand-text-primary', className)} {...props}>
      {children}
    </Tag>
  );
};

// Text Component
export const Text = ({ variant = 'body', children, className, ...props }) => {
  const variants = {
    body: 'text-base text-brand-text-primary',
    muted: 'text-sm text-brand-text-secondary',
    caption: 'text-xs text-brand-text-secondary',
    lead: 'text-lg text-brand-text-primary',
  };
  return (
    <p className={cn(variants[variant], className)} {...props}>
      {children}
    </p>
  );
};

// Grid Component
export const Grid = ({ children, cols = 1, className, ...props }) => {
  // Simple mapping for columns. For complex responsive grids, use className.
  const colClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
    5: 'grid-cols-5',
    6: 'grid-cols-6',
  };

  return (
    <div className={cn('grid gap-6', colClasses[cols] || 'grid-cols-1', className)} {...props}>
      {children}
    </div>
  );
};

// StandardCard Component
export const StandardCard = ({ variant = 'base', children, className, ...props }) => {
  const variants = {
    base: 'bg-brand-card-bg border-brand-border',
    interactive: 'bg-brand-card-bg border-brand-border hover:border-brand-red transition-colors cursor-pointer',
    highlight: 'bg-brand-red/10 border-brand-red/50',
  };
  return (
    <Card className={cn(variants[variant], className)} {...props}>
      {children}
    </Card>
  );
};

// LoadingCard Component
export const LoadingCard = ({ className, ...props }) => {
  return <Skeleton className={cn('w-full h-full bg-brand-border', className)} {...props} />;
};

// EmptyState Component
export const EmptyState = ({ icon: Icon, title, description, action, className, ...props }) => {
  return (
    <div 
      className={cn(
        'flex flex-col items-center justify-center text-center py-12',
        className
      )} 
      {...props}
    >
      {Icon && (
        <Icon className="w-12 h-12 text-brand-text-secondary mb-4" />
      )}
      {title && (
        <Heading level={3} className="mb-2">
          {title}
        </Heading>
      )}
      {description && (
        <Text variant="muted" className="mb-4 max-w-md">
          {description}
        </Text>
      )}
      {action}
    </div>
  );
};

// Simple MetricCard Component
export const MetricCard = ({ title, value, subtitle, trend, trendValue, icon: Icon, variant = 'default', onClick, className }) => {
  return (
    <Card 
      className={cn(
        'border-brand-border bg-brand-card-bg transition-all hover:shadow-lg', 
        onClick ? 'cursor-pointer' : '',
        className
      )}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-brand-text-secondary">{title}</p>
          {Icon && <Icon className="w-6 h-6 text-brand-text-secondary" />}
        </div>
        <div className="mt-2">
          <p className="text-2xl font-bold text-brand-text-primary">{value}</p>
          <div className="flex justify-between items-center mt-1">
            {subtitle && (
              <p className="text-sm text-brand-text-secondary">{subtitle}</p>
            )}
            {trend && trendValue && (
              <div className={cn(
                "flex items-center gap-1 text-sm",
                trend === 'up' ? 'text-green-500' : trend === 'down' ? 'text-red-500' : 'text-brand-text-secondary'
              )}>
                {trend === 'up' && <ArrowUp className="w-3 h-3" />}
                {trend === 'down' && <ArrowDown className="w-3 h-3" />}
                <span>{trendValue}</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Simple StatusBadge Component
export const StatusBadge = ({ status, size = 'default' }) => {
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
      case 'paid':
      case 'approved':
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
      case 'pending_approval':
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'failed':
      case 'rejected':
      case 'cancelled':
      case 'expired':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'draft':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const sizeClass = size === 'sm' ? 'text-xs px-2 py-1' : 'text-sm px-2 py-1';

  return (
    <Badge 
      className={cn(
        'border',
        getStatusColor(status),
        sizeClass
      )}
    >
      {status}
    </Badge>
  );
};

// Export other simple components if needed
export const Container = ({ children, className, maxWidth = 'max-w-7xl', ...props }) => (
  <div className={cn('mx-auto px-4 sm:px-6 lg:px-8', maxWidth, className)} {...props}>
    {children}
  </div>
);

export const Section = ({ children, className, ...props }) => (
  <section className={cn('py-8', className)} {...props}>
    {children}
  </section>
);