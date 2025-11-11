/**
 * Generic Community Feed Component
 * Used in Community Hub
 */

import React, { useState, useEffect } from 'react';
import { useEnhancedEntity } from '../../hooks/useEnhancedEntity';
import { CommunityPost, ActivityFeed } from '@/api/entities';
import UniversalCard from '../../shared/UniversalCard';
import { MessageCircle, Heart, Share2 } from 'lucide-react';
import { useXP } from '../../XPContext';

export default function CommunityFeed() {
  const { user } = useXP();
  const { data: posts, isLoading } = useEnhancedEntity(CommunityPost, {
    autoLoad: true,
    sortBy: '-created_date',
    limit: 20,
    cacheTTL: 2
  });

  if (isLoading) {
    return <div>Loading feed...</div>;
  }

  return (
    <div className="space-y-4">
      {posts.length > 0 ? (
        posts.map(post => (
          <UniversalCard
            key={post.id}
            title={post.content.substring(0, 100) + (post.content.length > 100 ? '...' : '')}
            badges={[
              { label: post.post_type.replace('_', ' '), className: 'bg-blue-100 text-blue-800' }
            ]}
            stats={[
              { label: 'Likes', value: post.likes?.length || 0 },
              { label: 'Comments', value: post.comments?.length || 0 }
            ]}
            actions={[
              { 
                label: 'Like', 
                icon: Heart,
                onClick: () => console.log('Like post', post.id)
              },
              { 
                label: 'Comment', 
                icon: MessageCircle,
                onClick: () => console.log('Comment on post', post.id)
              }
            ]}
          >
            <p className="text-sm text-brand-text-secondary mt-2">
              Posted {new Date(post.created_date).toLocaleDateString()}
            </p>
          </UniversalCard>
        ))
      ) : (
        <p className="text-center py-12 text-brand-text-secondary">
          No posts yet. Be the first to share!
        </p>
      )}
    </div>
  );
}