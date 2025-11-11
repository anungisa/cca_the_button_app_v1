import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { Inbox } from 'lucide-react';
import { emptyStateMessages } from './utils/brandEthos';

export default function EmptyState({
  icon: Icon = Inbox,
  title = "No Content Here",
  description,
  ctaLabel,
  ctaHref,
  size = 'md',
  variant = 'default',
  context = 'general'
}) {

  const sizes = {
    sm: { icon: 'w-10 h-10', title: 'text-lg', description: 'text-sm' },
    md: { icon: 'w-16 h-16', title: 'text-2xl', description: 'text-base' },
    lg: { icon: 'w-24 h-24', title: 'text-3xl', description: 'text-lg' }
  };

  const currentSize = sizes[size];
  
  // Use ethos-aware messaging if no custom description provided
  const ethosDescription = description || emptyStateMessages[context] || "There's nothing to see here at the moment, but your curling journey continues.";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`w-full text-center p-8 rounded-lg ${variant === 'card' ? 'bg-brand-card-bg border border-brand-border' : ''}`}
    >
      <Icon className={`${currentSize.icon} mx-auto text-brand-text-secondary mb-6`} />
      <h3 className={`${currentSize.title} font-bold text-brand-text-primary mb-2`}>{title}</h3>
      <p className={`${currentSize.description} text-brand-text-secondary max-w-md mx-auto mb-6`}>{ethosDescription}</p>
      {ctaLabel && ctaHref && (
        <Button asChild className="bg-brand-red hover:bg-red-700">
          <Link to={createPageUrl(ctaHref)}>
            {ctaLabel}
          </Link>
        </Button>
      )}
    </motion.div>
  );
}