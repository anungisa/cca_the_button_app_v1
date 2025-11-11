
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

const colorVariants = {
  blue: 'bg-blue-500',
  purple: 'bg-purple-500',
  green: 'bg-green-500',
  orange: 'bg-orange-500',
  pink: 'bg-pink-500',
  red: 'bg-red-500',
  indigo: 'bg-indigo-500',
  emerald: 'bg-emerald-500',
  teal: 'bg-teal-500',
  slate: 'bg-slate-500',
  cyan: 'bg-cyan-500',
  violet: 'bg-violet-500',
  amber: 'bg-amber-500',
  gray: 'bg-gray-500'
};

export default function HubCard({ 
  title, 
  description, 
  icon: Icon, 
  color = 'blue', 
  href,
  badge = null,
  onClick = null
}) {
  const cardContent = (
    <Card className="bg-brand-card-bg border-brand-border hover:shadow-lg transition-all duration-300 cursor-pointer group h-full">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className={`w-12 h-12 rounded-lg ${colorVariants[color]} flex items-center justify-center mb-4`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          <ChevronRight className="w-5 h-5 text-brand-text-secondary group-hover:text-brand-text-primary transition-colors" />
        </div>
        <CardTitle className="text-lg font-semibold text-brand-text-primary group-hover:text-brand-red transition-colors">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-sm text-brand-text-secondary mb-3 line-clamp-2">
          {description}
        </p>
        {badge && (
          <Badge variant="secondary" className="text-xs">
            {badge}
          </Badge>
        )}
      </CardContent>
    </Card>
  );

  if (onClick) {
    return (
      <motion.div
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.98 }}
        onClick={onClick}
      >
        {cardContent}
      </motion.div>
    );
  }

  return (
    <motion.div
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
    >
      <Link to={createPageUrl(href)}>
        {cardContent}
      </Link>
    </motion.div>
  );
}
