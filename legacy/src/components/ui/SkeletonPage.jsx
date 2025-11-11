import React from 'react';

/**
 * A component to show a full-page skeleton UI while a page or its data is loading.
 */
export default function SkeletonPage({ variant = 'dashboard' }) {
  const SkeletonBox = ({ className = '' }) => (
    <div className={`animate-pulse bg-brand-border rounded ${className}`} />
  );

  if (variant === 'list') {
    return (
      <div className="space-y-4">
        <SkeletonBox className="h-10 w-1/3" />
        <SkeletonBox className="h-8 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <SkeletonBox key={i} className="h-64" />
          ))}
        </div>
      </div>
    );
  }

  if (variant === 'form') {
    return (
      <div className="space-y-6">
        <SkeletonBox className="h-10 w-1/2" />
        <SkeletonBox className="h-8 w-1/4" />
        <div className="space-y-4">
          <SkeletonBox className="h-12 w-full" />
          <SkeletonBox className="h-12 w-full" />
          <SkeletonBox className="h-24 w-full" />
          <SkeletonBox className="h-12 w-1/4 ml-auto" />
        </div>
      </div>
    );
  }

  // Default: dashboard variant
  return (
    <div className="space-y-6">
      <SkeletonBox className="h-12 w-1/2" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <SkeletonBox className="h-24" />
        <SkeletonBox className="h-24" />
        <SkeletonBox className="h-24" />
        <SkeletonBox className="h-24" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <SkeletonBox className="h-64 lg:col-span-2" />
        <SkeletonBox className="h-64" />
      </div>
    </div>
  );
}