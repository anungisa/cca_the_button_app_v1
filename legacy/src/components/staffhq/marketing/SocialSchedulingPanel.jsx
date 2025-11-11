import React, { useState, useEffect } from 'react';
import { SocialPost } from '@/api/entities';
import { Button } from '@/components/ui/button';
import { Plus, Loader2, Twitter, Instagram } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import CreateSocialPostModal from './CreateSocialPostModal';

const SocialPostCard = ({ post }) => {
  const getIcon = () => {
    switch (post.platform) {
      case 'Twitter': return <Twitter className="w-5 h-5 text-blue-400" />;
      case 'Instagram': return <Instagram className="w-5 h-5 text-pink-500" />;
      default: return null;
    }
  };
  
  const getStatusColor = (status) => {
    const colors = {
      draft: 'bg-gray-500',
      scheduled: 'bg-blue-500',
      published: 'bg-green-500',
      error: 'bg-red-500',
    };
    return colors[status] || 'bg-gray-400';
  };

  return (
    <Card className="bg-brand-charcoal border-brand-border">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          {getIcon()}
          <CardTitle className="text-lg">{post.platform}</CardTitle>
        </div>
        <Badge className={`${getStatusColor(post.status)} text-white`}>{post.status}</Badge>
      </CardHeader>
      <CardContent>
        <p className="text-brand-text-secondary line-clamp-3">{post.content}</p>
      </CardContent>
      <CardFooter className="text-xs text-brand-text-secondary">
        Scheduled for: {new Date(post.scheduled_at).toLocaleString()}
      </CardFooter>
    </Card>
  );
};


export default function SocialSchedulingPanel() {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadPosts = async () => {
    setIsLoading(true);
    const data = await SocialPost.list('-scheduled_at');
    setPosts(data);
    setIsLoading(false);
  };
  
  useEffect(() => {
    loadPosts();
  }, []);

  const handleSave = async (data) => {
    await SocialPost.create(data);
    await loadPosts();
    setIsModalOpen(false);
  };

  if (isLoading) {
    return <div className="flex justify-center p-8"><Loader2 className="w-8 h-8 animate-spin" /></div>;
  }
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-brand-text-primary">Social Media Scheduler</h3>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          New Post
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {posts.map(post => (
          <SocialPostCard key={post.id} post={post} />
        ))}
      </div>
      
      {isModalOpen && <CreateSocialPostModal onSave={handleSave} onClose={() => setIsModalOpen(false)} />}
    </div>
  );
}