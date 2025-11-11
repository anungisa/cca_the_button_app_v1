import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Lock, Users, Clock, Star, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { format, parseISO } from 'date-fns';

export default function StreamCard({ stream, onSelect, hasAccess }) {
  const [imageError, setImageError] = useState(false);

  if (!stream) {
    return null;
  }

  const isLive = stream.event_type === 'live';
  const isPremium = stream.premium_url && !stream.free_highlight_url;
  const canWatch = hasAccess || !isPremium;
  const safeTags = Array.isArray(stream.tags) ? stream.tags : [];

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <Card className="bg-brand-card-bg border-brand-border overflow-hidden hover:border-brand-red transition-colors group">
        <div className="relative">
          {!imageError && stream.thumbnail_url ? (
            <img
              src={stream.thumbnail_url}
              alt={stream.name}
              className="w-full h-48 object-cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-48 bg-brand-charcoal flex items-center justify-center">
              <Play className="w-12 h-12 text-brand-text-secondary" />
            </div>
          )}
          
          {/* Overlay badges */}
          <div className="absolute top-2 left-2 flex gap-2">
            {isLive && (
              <Badge className="bg-red-600 text-white animate-pulse">
                LIVE
              </Badge>
            )}
            {isPremium && (
              <Badge className="bg-amber-500 text-white">
                <Star className="w-3 h-3 mr-1" />
                Premium
              </Badge>
            )}
          </div>

          {/* Play button overlay */}
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              size="lg"
              className="bg-white/90 hover:bg-white text-black rounded-full"
              onClick={() => onSelect(stream)}
            >
              {canWatch ? <Play className="w-6 h-6" /> : <Lock className="w-6 h-6" />}
            </Button>
          </div>
        </div>

        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-2">
            {safeTags.map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs bg-brand-charcoal text-brand-text-secondary">
                {tag}
              </Badge>
            ))}
          </div>
          <h3 className="font-bold text-brand-text-primary mb-2 leading-tight group-hover:text-brand-red transition-colors">
            {stream.name}
          </h3>
          <p className="text-sm text-brand-text-secondary mb-3 line-clamp-2">
            {stream.description}
          </p>
          
          <div className="flex items-center justify-between text-xs text-brand-text-secondary">
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {format(parseISO(stream.start_time), 'MMM d, h:mm a')}
            </div>
            {stream.ppv_price > 0 && (
              <div className="flex items-center gap-1">
                <Zap className="w-3 h-3" />
                ${stream.ppv_price}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}