import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { UserPlus, UserCheck, UserMinus, Loader2 } from 'lucide-react';
import { SocialConnection } from '@/api/entities';
import { useXP } from '../XPContext';

export const ConnectionButton = ({ 
  targetUserId, 
  isFollowing = false, 
  size = "sm",
  variant = "default" 
}) => {
  const [loading, setLoading] = useState(false);
  const [following, setFollowing] = useState(isFollowing);
  const { user } = useXP();

  const handleToggleFollow = async () => {
    if (!user || loading) return;
    
    setLoading(true);
    try {
      if (following) {
        // Unfollow - in real app would delete the connection
        // await SocialConnection.delete(connectionId);
        setFollowing(false);
      } else {
        // Follow - in real app would create connection
        // await SocialConnection.create({
        //   follower_id: user.id,
        //   following_id: targetUserId
        // });
        setFollowing(true);
      }
    } catch (error) {
      console.error('Error toggling follow:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Button size={size} variant="outline" disabled>
        <Loader2 className="w-4 h-4 animate-spin" />
      </Button>
    );
  }

  if (following) {
    return (
      <Button 
        size={size} 
        variant="outline" 
        onClick={handleToggleFollow}
        className="text-green-400 border-green-400 hover:text-red-400 hover:border-red-400"
      >
        <UserCheck className="w-4 h-4 mr-1" />
        Following
      </Button>
    );
  }

  return (
    <Button 
      size={size} 
      variant={variant}
      onClick={handleToggleFollow}
      className="bg-brand-red hover:bg-red-700"
    >
      <UserPlus className="w-4 h-4 mr-1" />
      Follow
    </Button>
  );
};