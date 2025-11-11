import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  ExternalLink, 
  Star, 
  Instagram, 
  Youtube, 
  Facebook, 
  Twitter,
  CheckCircle,
  Copy
} from 'lucide-react';
import { useSocialEngagement } from './hooks/useSocialEngagement';
import { useXP } from './XPContext';

const socialPlatforms = [
  {
    id: 'instagram',
    name: 'Instagram',
    icon: Instagram,
    handle: '@curlingcanada',
    url: 'https://instagram.com/curlingcanada',
    color: 'bg-pink-500',
    xpReward: 25
  },
  {
    id: 'youtube',
    name: 'YouTube',
    icon: Youtube,
    handle: 'Curling Canada',
    url: 'https://youtube.com/@curlingcanada',
    color: 'bg-red-600',
    xpReward: 25
  },
  {
    id: 'facebook',
    name: 'Facebook',
    icon: Facebook,
    handle: 'Curling Canada',
    url: 'https://facebook.com/curlingcanada',
    color: 'bg-blue-600',
    xpReward: 25
  },
  {
    id: 'twitter',
    name: 'Twitter/X',
    icon: Twitter,
    handle: '@CurlingCanada',
    url: 'https://twitter.com/CurlingCanada',
    color: 'bg-gray-800',
    xpReward: 25
  }
];

export default function FollowLinkDialog({ isOpen, onClose }) {
  const { trackSocialAction, socialActions } = useSocialEngagement();
  const { loyaltyData } = useXP();
  
  const followedPlatforms = socialActions.follows.map(f => f.platform);

  const handleFollow = (platform) => {
    trackSocialAction('follow', platform.id);
    window.open(platform.url, '_blank', 'noopener,noreferrer');
  };

  const copyHandle = (handle) => {
    navigator.clipboard.writeText(handle);
  };

  const totalXPAvailable = socialPlatforms.reduce((sum, p) => sum + p.xpReward, 0);
  const earnedXP = followedPlatforms.length * 25;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-brand-card-bg border-brand-border text-brand-text-primary">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Star className="w-6 h-6 text-amber-400" />
            Follow Curling Canada & Earn XP
          </DialogTitle>
          <DialogDescription className="text-brand-text-secondary">
            Connect with us on your favorite platforms to get the latest news and earn CurlPoints.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="bg-brand-charcoal border border-brand-border rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-brand-text-primary">Your Progress</span>
              <Badge className="bg-amber-500 text-white">
                {earnedXP} / {totalXPAvailable} XP
              </Badge>
            </div>
            <div className="w-full bg-brand-border rounded-full h-2.5">
              <div 
                className="bg-amber-500 h-2.5 rounded-full transition-all duration-500"
                style={{ width: `${(earnedXP / totalXPAvailable) * 100}%` }}
              ></div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {socialPlatforms.map((platform) => {
              const IconComponent = platform.icon;
              const isFollowed = followedPlatforms.includes(platform.id);

              return (
                <Card key={platform.id} className={`transition-all duration-300 bg-brand-charcoal border ${
                  isFollowed ? 'border-green-500' : 'border-brand-border'
                }`}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 ${platform.color} rounded-lg flex items-center justify-center`}>
                          <IconComponent className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-brand-text-primary">{platform.name}</h3>
                          <p className="text-sm text-brand-text-secondary">{platform.handle}</p>
                        </div>
                      </div>
                      {isFollowed && (
                        <CheckCircle className="w-6 h-6 text-green-500" />
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                       <Badge variant="outline" className="flex items-center gap-1 border-brand-border text-brand-text-secondary">
                        <Star className="w-3 h-3 text-amber-400" />
                        {platform.xpReward} XP
                      </Badge>
                      <Button
                        size="sm"
                        onClick={() => handleFollow(platform)}
                        disabled={isFollowed}
                        className={isFollowed ? 'bg-green-600 hover:bg-green-700' : 'bg-brand-red hover:bg-red-700'}
                      >
                        {isFollowed ? 'Followed' : 'Follow'}
                        {!isFollowed && <ExternalLink className="w-4 h-4 ml-2" />}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 text-center">
            <h4 className="font-semibold text-blue-300 mb-2">How it works:</h4>
            <p className="text-sm text-blue-400">
              Click "Follow", connect with us on the social platform, and your XP will be awarded automatically.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}