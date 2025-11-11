/**
 * Universal Card Component
 * Replaces 100+ custom card implementations
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function UniversalCard({
  title,
  description,
  image,
  icon: Icon,
  badges = [],
  stats = [],
  actions = [],
  footer,
  onClick,
  variant = 'default',
  className = '',
  children
}) {
  const variantStyles = {
    default: 'bg-brand-card-bg border-brand-border',
    highlighted: 'bg-gradient-to-br from-brand-red/10 to-brand-red/5 border-brand-red',
    success: 'bg-green-500/10 border-green-500/20',
    warning: 'bg-yellow-500/10 border-yellow-500/20',
    danger: 'bg-red-500/10 border-red-500/20'
  };

  return (
    <motion.div
      whileHover={onClick ? { scale: 1.02 } : {}}
      transition={{ duration: 0.2 }}
    >
      <Card 
        className={`${variantStyles[variant]} ${onClick ? 'cursor-pointer hover:shadow-lg' : ''} transition-all ${className}`}
        onClick={onClick}
      >
        {/* Image */}
        {image && (
          <div className="relative h-48 overflow-hidden rounded-t-lg">
            <img 
              src={image} 
              alt={title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            {badges.length > 0 && (
              <div className="absolute top-2 right-2 flex gap-2">
                {badges.map((badge, idx) => (
                  <Badge key={idx} className={badge.className}>
                    {badge.label}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        )}

        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              {Icon && (
                <div className="w-10 h-10 bg-brand-red/20 rounded-full flex items-center justify-center mb-3">
                  <Icon className="w-5 h-5 text-brand-red" />
                </div>
              )}
              <CardTitle className="text-brand-text-primary">{title}</CardTitle>
              {description && (
                <CardDescription className="text-brand-text-secondary mt-1">
                  {description}
                </CardDescription>
              )}
            </div>
            {!image && badges.length > 0 && (
              <div className="flex flex-wrap gap-2 justify-end">
                {badges.map((badge, idx) => (
                  <Badge key={idx} className={badge.className}>
                    {badge.label}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent>
          {/* Stats Grid */}
          {stats.length > 0 && (
            <div className="grid grid-cols-2 gap-4 mb-4">
              {stats.map((stat, idx) => (
                <div key={idx} className="text-center p-2 bg-brand-charcoal/50 rounded">
                  <p className="text-2xl font-bold text-brand-text-primary">
                    {stat.value}
                  </p>
                  <p className="text-xs text-brand-text-secondary">{stat.label}</p>
                </div>
              ))}
            </div>
          )}

          {/* Custom Children */}
          {children}

          {/* Actions */}
          {actions.length > 0 && (
            <div className="flex gap-2 mt-4">
              {actions.map((action, idx) => (
                <Button
                  key={idx}
                  variant={action.variant || 'outline'}
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    action.onClick();
                  }}
                  className={action.className}
                >
                  {action.icon && <action.icon className="w-4 h-4 mr-2" />}
                  {action.label}
                </Button>
              ))}
            </div>
          )}

          {/* Footer */}
          {footer}
        </CardContent>

        {/* Click indicator */}
        {onClick && (
          <div className="absolute bottom-4 right-4 opacity-50">
            <ChevronRight className="w-5 h-5 text-brand-text-secondary" />
          </div>
        )}
      </Card>
    </motion.div>
  );
}