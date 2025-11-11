import React, { useState, useEffect } from 'react';
import { User } from '@/api/entities';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Search,
  Star,
  Users,
  Share2,
  Heart,
  Instagram,
  Youtube,
  Facebook,
  Twitter
} from 'lucide-react';
import { motion } from 'framer-motion';

import SocialPostCard from '../components/SocialPostCard';
import FollowLinkDialog from '../components/FollowLinkDialog';
import { useSocialEngagement } from '../components/hooks/useSocialEngagement';

// Mock data remains the same
const mockPosts = [
  {
    id: '1',
    platform: 'instagram',
    caption: '🥌 Team Gushue practicing their precision at the Brier! Watch them compete for another championship title. #Curling #TeamGushue #Brier2024',
    mediaUrl: 'https://images.unsplash.com/photo-1627993358399-52b3c2936a7e?q=80&w=800&auto=format&fit=crop',
    mediaType: 'image',
    url: 'https://instagram.com/p/example',
    timeAgo: '2 hours ago',
    likes: 1247,
    comments: 89,
    shares: 156,
    hashtags: ['Curling', 'TeamGushue', 'Brier2024'],
    xpReward: 25
  },
  {
    id: '2',
    platform: 'youtube',
    caption: 'Behind the Scenes: Smart Broom Technology - See how our NTP athletes are using cutting-edge technology to improve their sweeping technique.',
    mediaUrl: 'https://images.unsplash.com/photo-1559166631-ef2084400183?q=80&w=800&auto=format&fit=crop',
    mediaType: 'video',
    thumbnail: 'https://images.unsplash.com/photo-1559166631-ef2084400183?q=80&w=800&auto=format&fit=crop',
    url: 'https://youtube.com/watch?v=example',
    timeAgo: '1 day ago',
    likes: 892,
    comments: 45,
    shares: 78,
    hashtags: ['SmartBroom', 'Technology', 'NTP'],
    xpReward: 35
  },
  {
    id: '3',
    platform: 'facebook',
    caption: 'For The Love of Curling scholarships are now open! Support the next generation of Canadian curlers. Applications due March 15th.',
    mediaUrl: 'https://images.unsplash.com/photo-1594736797933-d0401ba0bf61?q=80&w=800&auto=format&fit=crop',
    mediaType: 'image',
    url: 'https://facebook.com/curlingcanada/posts/example',
    timeAgo: '3 days ago',
    likes: 2156,
    comments: 134,
    shares: 289,
    hashtags: ['FTLOC', 'Scholarships', 'YouthCurling'],
    xpReward: 25
  },
  {
    id: '4',
    platform: 'twitter',
    caption: '🎯 Hit Draw Tap results are in! Congratulations to all the young curlers who participated in this year\'s national competition.',
    mediaUrl: 'https://images.unsplash.com/photo-159844496850-7561f0326a54?q=80&w=800&auto=format&fit=crop',
    mediaType: 'image',
    url: 'https://twitter.com/CurlingCanada/status/example',
    timeAgo: '5 days ago',
    likes: 456,
    comments: 23,
    shares: 67,
    hashtags: ['HitDrawTap', 'YouthCurling', 'Results'],
    xpReward: 25
  }
];

const campaigns = [
  {
    id: 'curling_day_2024',
    name: 'Curling Day in Canada 2024',
    description: 'Join the celebration of our national sport!',
    hashtag: '#CurlingDay',
    xpBonus: 50,
    endDate: '2024-02-17',
    isActive: true
  },
  {
    id: 'ftloc_spring',
    name: 'FTLOC Spring Campaign',
    description: 'Support young curlers with scholarship donations',
    hashtag: '#FTLOC',
    xpBonus: 75,
    endDate: '2024-03-31',
    isActive: true
  }
];

const platformConfig = {
  all: { name: 'All Platforms', icon: null },
  instagram: { name: 'Instagram', icon: Instagram },
  youtube: { name: 'YouTube', icon: Youtube },
  facebook: { name: 'Facebook', icon: Facebook },
  twitter: { name: 'Twitter/X', icon: Twitter }
};

export default function SocialHub() {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState(mockPosts);
  const [filteredPosts, setFilteredPosts] = useState(mockPosts);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [showFollowDialog, setShowFollowDialog] = useState(false);
  
  const { socialActions, isLoading } = useSocialEngagement();

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await User.me();
        setUser(userData);
      } catch (error) {
        console.log('User not authenticated');
      }
    };
    loadUser();
  }, []);

  useEffect(() => {
    let filtered = posts;

    if (searchTerm) {
      filtered = filtered.filter(post => 
        post.caption.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.hashtags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (selectedPlatform !== 'all') {
      filtered = filtered.filter(post => post.platform === selectedPlatform);
    }

    setFilteredPosts(filtered);
  }, [posts, searchTerm, selectedPlatform]);

  const handlePostEngage = (postId, actionType) => {
    setPosts(prev => prev.map(p => 
      p.id === postId ? { ...p, hasEngaged: true } : p
    ));
  };

  const activeCampaigns = campaigns.filter(c => c.isActive);

  return (
    <div className="min-h-screen bg-brand-charcoal text-brand-text-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-brand-red rounded-full flex items-center justify-center">
              <Share2 className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-brand-text-primary mb-4">
            Curling Canada Social Hub
          </h1>
          <p className="text-xl text-brand-text-secondary max-w-3xl mx-auto">
            Follow, share, and engage with us across all platforms to earn XP and stay connected.
          </p>
        </motion.div>

        {/* Follow CTA & Active Campaigns */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <motion.div 
            className="lg:col-span-1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="bg-brand-card-bg border-brand-border h-full flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-amber-400" />
                  Join the Conversation
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-grow flex flex-col justify-center text-center">
                <p className="text-brand-text-secondary mb-4">
                  Follow us on social media to earn CurlPoints and get the latest updates.
                </p>
                <Button 
                  onClick={() => setShowFollowDialog(true)}
                  className="bg-brand-red hover:bg-red-700"
                >
                  <Star className="w-4 h-4 mr-2" />
                  Follow & Earn XP
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div 
            className="lg:col-span-2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card className="bg-brand-card-bg border-brand-border h-full">
              <CardHeader>
                <CardTitle>Active Campaigns</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {activeCampaigns.map(campaign => (
                  <div key={campaign.id} className="bg-gradient-to-r from-brand-red/80 to-red-700/80 text-white rounded-lg p-4 flex items-center justify-between">
                    <div>
                      <h3 className="font-bold">{campaign.name}</h3>
                      <p className="text-sm opacity-80">{campaign.description}</p>
                    </div>
                    <Badge className="bg-white/20 text-white text-sm">
                      +{campaign.xpBonus} XP
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </div>


        {/* Search and Filters */}
        <Card className="mb-8 bg-brand-card-bg border-brand-border">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-brand-text-secondary w-4 h-4" />
                  <Input
                    placeholder="Search posts, hashtags..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-brand-charcoal border-brand-border text-brand-text-primary"
                  />
                </div>
              </div>
              <div className="flex gap-2 flex-wrap">
                {Object.entries(platformConfig).map(([key, { name, icon: Icon }]) => (
                  <Button
                    key={key}
                    variant={selectedPlatform === key ? "default" : "outline"}
                    onClick={() => setSelectedPlatform(key)}
                    className={`border-brand-border ${selectedPlatform === key ? "bg-brand-red hover:bg-red-700" : "bg-brand-card-bg hover:bg-brand-border text-brand-text-secondary"}`}
                  >
                    {Icon && <Icon className="w-4 h-4 mr-2" />}
                    {name}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <SocialPostCard 
                  post={post} 
                  onEngage={handlePostEngage}
                />
              </motion.div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <Search className="w-12 h-12 text-brand-text-secondary mx-auto mb-4" />
              <h3 className="text-lg font-medium text-brand-text-primary mb-2">No posts found</h3>
              <p className="text-brand-text-secondary">
                Try adjusting your search or filter criteria.
              </p>
            </div>
          )}
        </div>

        {/* Follow Dialog */}
        <FollowLinkDialog 
          isOpen={showFollowDialog}
          onClose={() => setShowFollowDialog(false)}
        />
      </div>
    </div>
  );
}