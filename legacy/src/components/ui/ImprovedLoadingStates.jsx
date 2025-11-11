import React from 'react';
import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';

// Unified loading spinner with branding
export const LoadingSpinner = ({ size = 'default', message = null }) => {
  const sizes = {
    sm: 'w-4 h-4',
    default: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <Loader2 className={`${sizes[size]} animate-spin text-brand-red`} />
      {message && (
        <p className="mt-4 text-sm text-brand-text-secondary animate-pulse">{message}</p>
      )}
    </div>
  );
};

// Full page loading with branding
export const FullPageLoader = ({ message = 'Loading...' }) => {
  return (
    <div className="min-h-screen bg-brand-charcoal flex items-center justify-center">
      <div className="text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <img
            src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/7eb979759_Curling-Canada_CMYK.png"
            alt="Curling Canada"
            className="h-16 mx-auto mb-6 animate-pulse"
          />
          <LoadingSpinner size="lg" message={message} />
        </motion.div>
      </div>
    </div>
  );
};

// Card loading skeleton
export const CardSkeleton = ({ count = 1 }) => {
  return (
    <>
      {[...Array(count)].map((_, i) => (
        <div key={i} className="bg-brand-card-bg border border-brand-border rounded-lg p-6">
          <div className="flex items-center gap-4 mb-4">
            <Skeleton className="w-12 h-12 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
          <Skeleton className="h-20 w-full mb-2" />
          <Skeleton className="h-3 w-full mb-2" />
          <Skeleton className="h-3 w-2/3" />
        </div>
      ))}
    </>
  );
};

// Table loading skeleton
export const TableSkeleton = ({ rows = 5, columns = 4 }) => {
  return (
    <div className="bg-brand-card-bg border border-brand-border rounded-lg overflow-hidden">
      <div className="border-b border-brand-border p-4">
        <div className="flex gap-4">
          {[...Array(columns)].map((_, i) => (
            <Skeleton key={i} className="h-4 flex-1" />
          ))}
        </div>
      </div>
      {[...Array(rows)].map((_, i) => (
        <div key={i} className="border-b border-brand-border p-4 last:border-b-0">
          <div className="flex gap-4">
            {[...Array(columns)].map((_, j) => (
              <Skeleton key={j} className="h-4 flex-1" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

// Inline loading for buttons
export const ButtonLoader = () => (
  <Loader2 className="w-4 h-4 animate-spin mr-2" />
);

// Progress indicator
export const ProgressIndicator = ({ current, total, label }) => {
  const percentage = Math.round((current / total) * 100);
  
  return (
    <div className="space-y-2">
      {label && (
        <div className="flex justify-between text-sm">
          <span className="text-brand-text-secondary">{label}</span>
          <span className="text-brand-text-primary font-medium">{percentage}%</span>
        </div>
      )}
      <div className="w-full bg-brand-border rounded-full h-2 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5 }}
          className="h-full bg-brand-red"
        />
      </div>
    </div>
  );
};