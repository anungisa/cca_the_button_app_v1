import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MessageCircle, Heart, Share2, MoreHorizontal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useXP } from '../XPContext';

export default function CommunityPostCard({ post }) {
  const [showComments, setShowComments] = useState(false);
  const [liked, setLiked] = useState(false);
  const { awardPoints } = useXP();

  if (!post) {
    return null; // Don't render anything if the post object is missing
  }

  const handleLike = async () => {
    setLiked(!liked);
    if (!liked && awardPoints) {
      // Award XP for engagement
      await awardPoints(2, 'community_like', 'Liked a post');
    }
  };

  const safeLikes = Array.isArray(post.likes) ? post.likes : [];
  const safeComments = Array.isArray(post.comments) ? post.comments : [];
  const safeTags = Array.isArray(post.tags) ? post.tags : [];
  
  const likeCount = safeLikes.length + (liked ? 1 : 0);
  const commentCount = safeComments.length;

  return (
    <Card className="bg-brand-card-bg border-brand-border">
      <CardHeader className="flex flex-row items-start gap-4 p-4">
        <Avatar>
          <AvatarFallback>{post.author_name?.charAt(0) || 'U'}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-brand-text-primary">{post.author_name || 'Anonymous'}</h3>
              <p className="text-sm text-brand-text-secondary">{post.author_club || 'Unknown Club'}</p>
            </div>
            <Button variant="ghost" size="icon" className="text-brand-text-secondary">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <p className="text-brand-text-primary mb-4 whitespace-pre-wrap">{post.content}</p>
        
        {post.images && post.images[0] && (
          <div className="mb-4 rounded-lg overflow-hidden border border-brand-border">
            <img src={post.images[0]} alt="Community post" className="w-full h-auto object-cover" />
          </div>
        )}

        <div className="flex flex-wrap gap-2 mb-4">
          {safeTags.map((tag, index) => (
            <Badge key={index} variant="secondary" className="bg-brand-charcoal text-brand-text-secondary">
              #{tag}
            </Badge>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center text-brand-text-secondary border-t border-brand-border pt-3">
          <Button variant="ghost" size="sm" onClick={() => setShowComments(!showComments)} className="hover:text-brand-red">
            <MessageCircle className="w-4 h-4 mr-2" />
            {commentCount} Comments
          </Button>
          <Button variant="ghost" size="sm" onClick={handleLike} className={`hover:text-brand-red ${liked ? 'text-brand-red' : ''}`}>
            <Heart className={`w-4 h-4 mr-2 ${liked ? 'fill-current' : ''}`} />
            {likeCount} Likes
          </Button>
          <Button variant="ghost" size="sm" className="hover:text-brand-red">
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
        </div>

        {/* Comments Section */}
        <AnimatePresence>
          {showComments && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mt-4"
            >
              <div className="space-y-3">
                {safeComments.map((comment, index) => (
                  <div key={comment.commenter_id || index} className="flex items-start gap-2 text-sm">
                    <Avatar className="w-6 h-6">
                      <AvatarFallback>{comment.commenter_name?.charAt(0) || 'U'}</AvatarFallback>
                    </Avatar>
                    <div className="bg-brand-charcoal rounded-lg p-2 flex-1">
                      <p className="font-semibold text-brand-text-primary">{comment.commenter_name || 'Anonymous'}</p>
                      <p className="text-brand-text-secondary">{comment.comment}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}