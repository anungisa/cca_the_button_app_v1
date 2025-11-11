import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  ArrowRight, 
  Star, 
  Lock,
  AlertCircle
} from 'lucide-react';

export default function TileCard({ 
  tile, 
  onClick,
  className = ""
}) {
  const {
    id,
    title,
    description,
    icon: Icon,
    color = 'bg-gray-800',
    textColor = 'text-gray-300',
    xpReward,
    priority = 'normal',
    isLocked = false,
    requiresAction = false,
    actionText = 'Explore',
    badgeText,
    imageUrl
  } = tile;

  const getPriorityStyles = () => {
    switch (priority) {
      case 'high':
        return 'ring-2 ring-red-500';
      case 'medium':
        return 'ring-2 ring-amber-500';
      default:
        return '';
    }
  };

  return (
    <Card 
      className={`cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 bg-brand-card-bg border-brand-border ${
        getPriorityStyles()
      } ${isLocked ? 'opacity-60' : ''} ${className}`}
      onClick={() => !isLocked && onClick(tile)}
    >
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            {imageUrl ? (
              <img 
                src={imageUrl} 
                alt={title}
                className="w-12 h-12 rounded-lg object-cover"
              />
            ) : (
              <div className={`w-12 h-12 ${color} rounded-lg flex items-center justify-center`}>
                <Icon className={`w-6 h-6 ${textColor}`} />
              </div>
            )}
            <div>
              <h3 className="font-bold text-brand-text-primary text-lg">{title}</h3>
              {badgeText && (
                <Badge variant="secondary" className="mt-1 text-xs bg-brand-red text-white">
                  {badgeText}
                </Badge>
              )}
            </div>
          </div>
          
          {isLocked ? (
            <Lock className="w-5 h-5 text-brand-text-secondary" />
          ) : requiresAction ? (
            <AlertCircle className="w-5 h-5 text-amber-400" />
          ) : (
            <ArrowRight className="w-5 h-5 text-brand-text-secondary" />
          )}
        </div>

        {/* Description */}
        <p className="text-brand-text-secondary text-sm mb-4 leading-relaxed">
          {description}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {xpReward && (
              <Badge className="bg-amber-900/50 text-amber-300 flex items-center gap-1">
                <Star className="w-3 h-3" />
                +{xpReward} XP
              </Badge>
            )}
            {requiresAction && (
              <Badge className="bg-red-900/50 text-red-300">
                Action Required
              </Badge>
            )}
          </div>
          
          <Button 
            variant="ghost" 
            size="sm"
            disabled={isLocked}
            className="text-brand-red hover:text-red-700 hover:bg-red-900/20"
          >
            {isLocked ? 'Locked' : actionText}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}