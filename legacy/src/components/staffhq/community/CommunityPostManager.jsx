import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CommunityPost } from '@/api/entities';
import { MessageSquare, Heart, Pin, Eye, Loader2 } from 'lucide-react';

export default function CommunityPostManager() {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadPosts = async () => {
      setIsLoading(true);
      try {
        const data = await CommunityPost.list('-created_date', 20);
        setPosts(data);
      } catch (error) {
        console.error('Error loading community posts:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadPosts();
  }, []);

  const handleTogglePin = async (postId, isPinned) => {
    try {
      await CommunityPost.update(postId, { is_pinned: !isPinned });
      setPosts(prev => prev.map(post => 
        post.id === postId ? { ...post, is_pinned: !isPinned } : post
      ));
    } catch (error) {
      console.error('Error updating post:', error);
    }
  };

  const PostCard = ({ post }) => (
    <Card className="bg-brand-card-bg border-brand-border">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-base font-medium text-brand-text-primary">
              {post.is_pinned && <Pin className="w-4 h-4 inline mr-1 text-brand-red" />}
              Post by {post.author_id}
            </CardTitle>
            <Badge variant="outline" className="mt-1 text-xs">
              {post.post_type.replace('_', ' ')}
            </Badge>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => handleTogglePin(post.id, post.is_pinned)}
          >
            <Pin className={`w-4 h-4 ${post.is_pinned ? 'text-brand-red' : 'text-gray-400'}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-brand-text-secondary mb-3 line-clamp-3">{post.content}</p>
        <div className="flex items-center gap-4 text-xs text-brand-text-muted">
          <div className="flex items-center gap-1">
            <Heart className="w-3 h-3" />
            {post.likes?.length || 0} likes
          </div>
          <div className="flex items-center gap-1">
            <MessageSquare className="w-3 h-3" />
            {post.comments?.length || 0} comments
          </div>
          <div className="flex items-center gap-1">
            <Eye className="w-3 h-3" />
            {post.visibility}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return <div className="flex justify-center p-8"><Loader2 className="w-8 h-8 animate-spin" /></div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-brand-text-primary">Recent Community Posts</h3>
        <Button>Manage Posts</Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {posts.map(post => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}