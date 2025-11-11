import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Users, 
  UserPlus, 
  UserCheck, 
  Search, 
  Heart,
  MessageCircle,
  MapPin,
  Trophy,
  UserMinus,
  Settings,
  Filter
} from 'lucide-react';
import { User } from '@/api/entities';
import { SocialConnection } from '@/api/entities';
import { useXP } from '../XPContext';
import { motion } from 'framer-motion';

const ConnectionCard = ({ connection, onFollow, onUnfollow, currentUserId }) => {
  const isFollowing = connection.isFollowing;
  const isMutual = connection.mutual;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-brand-card-bg border border-brand-border rounded-lg p-4"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar className="w-12 h-12">
            <AvatarImage src={connection.profile_image_url} />
            <AvatarFallback className="bg-brand-red text-white">
              {connection.full_name?.charAt(0) || 'U'}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <h3 className="font-semibold text-brand-text-primary">{connection.full_name}</h3>
            <div className="flex items-center gap-2 text-sm text-brand-text-secondary">
              {connection.home_club_name && (
                <div className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  <span>{connection.home_club_name}</span>
                </div>
              )}
              {connection.user_type && (
                <Badge variant="outline" className="text-xs">
                  {connection.user_type}
                </Badge>
              )}
            </div>
            
            <div className="flex items-center gap-4 mt-1 text-xs text-brand-text-secondary">
              <span className="flex items-center gap-1">
                <Trophy className="w-3 h-3" />
                {connection.curl_points || 0} XP
              </span>
              <span>{connection.followerCount || 0} followers</span>
              <span>{connection.followingCount || 0} following</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {isMutual && (
            <Badge className="bg-green-600 text-white text-xs">
              <Heart className="w-3 h-3 mr-1" />
              Friends
            </Badge>
          )}
          
          {isFollowing ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onUnfollow(connection.id)}
              className="text-brand-text-secondary hover:text-red-400"
            >
              <UserMinus className="w-4 h-4 mr-1" />
              Unfollow
            </Button>
          ) : (
            <Button
              size="sm"
              onClick={() => onFollow(connection.id)}
              className="bg-brand-red hover:bg-red-700"
            >
              <UserPlus className="w-4 h-4 mr-1" />
              Follow
            </Button>
          )}
          
          <Button variant="outline" size="sm">
            <MessageCircle className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

const SuggestedConnections = ({ suggestions, onFollow }) => (
  <div className="space-y-4">
    <h3 className="font-semibold text-brand-text-primary flex items-center gap-2">
      <UserPlus className="w-5 h-5 text-brand-red" />
      Suggested Connections
    </h3>
    
    <div className="space-y-3">
      {suggestions.map(user => (
        <ConnectionCard
          key={user.id}
          connection={{ ...user, isFollowing: false }}
          onFollow={onFollow}
          onUnfollow={() => {}}
        />
      ))}
    </div>
  </div>
);

export default function SocialConnectionsHub() {
  const [connections, setConnections] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('following');
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useXP();

  useEffect(() => {
    loadConnections();
  }, [user]);

  const loadConnections = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      // Mock data - in real app would fetch from SocialConnection entity
      const mockConnections = [
        {
          id: '1',
          full_name: 'Sarah Mitchell',
          user_type: 'athlete',
          home_club_name: 'Calgary Curling Club',
          curl_points: 1250,
          followerCount: 89,
          followingCount: 134,
          isFollowing: true,
          mutual: true
        },
        {
          id: '2', 
          full_name: 'Mike Thompson',
          user_type: 'coach',
          home_club_name: 'Edmonton Granite Club',
          curl_points: 890,
          followerCount: 156,
          followingCount: 78,
          isFollowing: true,
          mutual: false
        },
        {
          id: '3',
          full_name: 'Jessica Chen',
          user_type: 'curler',
          home_club_name: 'Vancouver Curling Club',
          curl_points: 645,
          followerCount: 42,
          followingCount: 67,
          isFollowing: false,
          mutual: false
        }
      ];

      const mockSuggestions = [
        {
          id: '4',
          full_name: 'Alex Rodriguez',
          user_type: 'curler',
          home_club_name: 'Calgary Curling Club',
          curl_points: 445,
          followerCount: 23,
          followingCount: 45,
          reason: 'Same club'
        },
        {
          id: '5',
          full_name: 'Emma Wilson',
          user_type: 'volunteer',
          home_club_name: 'Red Deer Curling Centre',
          curl_points: 320,
          followerCount: 15,
          followingCount: 32,
          reason: 'Similar interests'
        }
      ];

      setConnections(mockConnections);
      setSuggestions(mockSuggestions);
    } catch (error) {
      console.error('Error loading connections:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFollow = async (userId) => {
    try {
      // In real app: await SocialConnection.create({ follower_id: user.id, following_id: userId })
      
      // Update local state
      setSuggestions(prev => prev.filter(s => s.id !== userId));
      setConnections(prev => [
        ...prev,
        suggestions.find(s => s.id === userId)
      ]);
    } catch (error) {
      console.error('Error following user:', error);
    }
  };

  const handleUnfollow = async (userId) => {
    try {
      // In real app: await SocialConnection.delete(connectionId)
      
      setConnections(prev => prev.filter(c => c.id !== userId));
    } catch (error) {
      console.error('Error unfollowing user:', error);
    }
  };

  const filteredConnections = connections.filter(conn =>
    conn.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conn.home_club_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const followers = connections.filter(c => c.isFollowing);
  const following = connections.filter(c => c.isFollowing);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-red mx-auto mb-4"></div>
          <p className="text-brand-text-secondary">Loading connections...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-brand-text-primary">Social Connections</h1>
          <p className="text-brand-text-secondary">Connect with fellow curlers across Canada</p>
        </div>
        <Button variant="outline">
          <Settings className="w-4 h-4 mr-2" />
          Privacy Settings
        </Button>
      </div>

      {/* Search */}
      <Card className="bg-brand-card-bg border-brand-border">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-brand-text-secondary w-4 h-4" />
            <Input
              placeholder="Search connections..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-brand-charcoal"
            />
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 bg-brand-card-bg">
          <TabsTrigger value="following">Following ({following.length})</TabsTrigger>
          <TabsTrigger value="followers">Followers ({followers.length})</TabsTrigger>
          <TabsTrigger value="discover">Discover</TabsTrigger>
        </TabsList>

        <TabsContent value="following" className="space-y-4">
          <div className="space-y-4">
            {filteredConnections.length > 0 ? (
              filteredConnections.map(connection => (
                <ConnectionCard
                  key={connection.id}
                  connection={connection}
                  onFollow={handleFollow}
                  onUnfollow={handleUnfollow}
                  currentUserId={user?.id}
                />
              ))
            ) : (
              <Card className="bg-brand-card-bg border-brand-border">
                <CardContent className="text-center py-12">
                  <Users className="w-12 h-12 text-brand-text-secondary mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-brand-text-primary mb-2">No connections yet</h3>
                  <p className="text-brand-text-secondary mb-4">Start building your curling network</p>
                  <Button onClick={() => setActiveTab('discover')}>
                    Discover People
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="followers" className="space-y-4">
          <div className="space-y-4">
            {followers.map(connection => (
              <ConnectionCard
                key={connection.id}
                connection={connection}
                onFollow={handleFollow}
                onUnfollow={handleUnfollow}
                currentUserId={user?.id}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="discover" className="space-y-4">
          <SuggestedConnections
            suggestions={suggestions}
            onFollow={handleFollow}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}