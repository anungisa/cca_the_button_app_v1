import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ExternalLink, 
  Share2, 
  Heart, 
  MessageCircle, 
  Play,
  Instagram,
  Youtube,
  Facebook,
  Twitter,
  Star,
  Clock
} from 'lucide-react';
import { useSocialEngagement } from './hooks/useSocialEngagement';
import { motion } from 'framer-motion';

const platformIcons = {
  instagram: Instagram,
  youtube: Youtube,
  facebook: Facebook,
  twitter: Twitter,
  tiktok: Play,
  linkedin: ExternalLink
};

export default function SocialPostCard({ post }) {
  const { openSocialLink, trackSocialAction, socialActions } = useSocialEngagement();
  
  const hasEngaged = socialActions.shares.some(s => s.postId === post.id) || 
                     socialActions.posts.some(p => p.postId === post.id);

  const PlatformIcon = platformIcons[post.platform] || ExternalLink;

  const handleEngagement = (actionType) => {
    trackSocialAction(actionType, post.platform, post.id);
  };
  
  const handleShare = () => {
    trackSocialAction('share', post.platform, post.id);
    // In a real app, you'd use the Web Share API
    alert(`Sharing post: ${post.url}`);
  };

  const handleView = () => {
    trackSocialAction('view', post.platform, post.id);
    window.open(post.url, '_blank', 'noopener,noreferrer');
  };

  const formatEngagement = (count) => {
    if (!count) return '0';
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
  };

  return (
    <Card className="bg-brand-card-bg border-brand-border hover:border-brand-red transition-colors duration-300 h-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PlatformIcon className="w-5 h-5 text-brand-red" />
            <span className="font-semibold text-brand-text-primary">Curling Canada</span>
            <Badge variant="outline" className="text-xs capitalize border-brand-border text-brand-text-secondary">
              {post.platform}
            </Badge>
          </div>
          <div className="flex items-center gap-1 text-xs text-brand-text-secondary">
            <Clock className="w-3 h-3" />
            {post.timeAgo}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 flex-grow flex flex-col">
        {post.mediaUrl && (
          <div className="relative aspect-video bg-brand-charcoal rounded-lg overflow-hidden cursor-pointer" onClick={handleView}>
            <img 
              src={post.mediaType === 'video' ? post.thumbnail : post.mediaUrl} 
              alt={post.caption}
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            />
            {post.mediaType === 'video' && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                <div className="w-14 h-14 bg-black/70 rounded-full flex items-center justify-center">
                  <Play className="w-7 h-7 text-white ml-1" />
                </div>
              </div>
            )}
          </div>
        )}

        <div>
          <p className="text-sm text-brand-text-secondary leading-relaxed">
            {post.caption.length > 150 ? 
              `${post.caption.substring(0, 150)}...` : 
              post.caption
            }
          </p>
          {post.hashtags && post.hashtags.length > 0 && (
            <div className="flex flex-wrap gap-x-2 mt-2">
              {post.hashtags.slice(0, 3).map((tag, index) => (
                <span key={index} className="text-xs text-blue-400 hover:underline cursor-pointer">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="flex-grow" />

        <div className="flex items-center gap-4 text-sm text-brand-text-secondary">
          {[
            { icon: Heart, count: post.likes },
            { icon: MessageCircle, count: post.comments },
            { icon: Share2, count: post.shares }
          ].map((item, index) => (
            item.count && (
              <div key={index} className="flex items-center gap-1">
                <item.icon className="w-4 h-4" />
                <span>{formatEngagement(item.count)}</span>
              </div>
            )
          ))}
        </div>

        {post.xpReward && (
          <div className="bg-amber-900/50 border border-amber-500/30 rounded-lg p-3">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-400" />
              <span className="text-sm font-medium text-amber-300">
                Earn {post.xpReward} XP for engaging!
              </span>
            </div>
          </div>
        )}

        <div className="flex gap-2 pt-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleView}
            className="flex-1 border-brand-border text-brand-text-secondary hover:bg-brand-border"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            View
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleShare}
            className="flex-1 border-brand-border text-brand-text-secondary hover:bg-brand-border"
          >
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
          <Button 
            size="sm" 
            onClick={() => handleEngagement('engage')}
            disabled={hasEngaged}
            className="flex-1 bg-brand-red hover:bg-red-700 disabled:bg-green-600 disabled:text-white"
          >
            <Star className="w-4 h-4 mr-2" />
            {hasEngaged ? 'Claimed' : `+${post.xpReward} XP`}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}