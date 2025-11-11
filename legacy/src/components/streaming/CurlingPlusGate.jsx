import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Lock, Star, Crown } from 'lucide-react';
import { useCurlingPlus } from '@/components/hooks/useCurlingPlus';
import CurlingPlusModal from './CurlingPlusModal';

export default function CurlingPlusGate({ 
  children, 
  requiredFeature = 'live_streaming',
  requiredTier = 'basic',
  contentType = 'content',
  fallbackContent = null 
}) {
  const { hasAccess, hasFeature, subscription, getSubscriptionStatus, getTrialDaysRemaining } = useCurlingPlus();
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  // If user has access and the required feature, show content
  if (hasAccess && hasFeature(requiredFeature)) {
    return (
      <>
        {children}
        {getSubscriptionStatus() === 'trial' && (
          <div className="mt-4">
            <Badge className="bg-amber-600 text-white">
              Trial: {getTrialDaysRemaining()} days remaining
            </Badge>
          </div>
        )}
      </>
    );
  }

  // Show fallback content if provided
  if (fallbackContent) {
    return (
      <>
        {fallbackContent}
        <CurlingPlusUpgradePrompt 
          onUpgrade={() => setShowUpgradeModal(true)}
          requiredTier={requiredTier}
          contentType={contentType}
        />
        <CurlingPlusModal 
          isOpen={showUpgradeModal}
          onClose={() => setShowUpgradeModal(false)}
          initialTier={requiredTier}
        />
      </>
    );
  }

  // Default upgrade prompt
  return (
    <>
      <CurlingPlusUpgradePrompt 
        onUpgrade={() => setShowUpgradeModal(true)}
        requiredTier={requiredTier}
        contentType={contentType}
      />
      <CurlingPlusModal 
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        initialTier={requiredTier}
      />
    </>
  );
}

const CurlingPlusUpgradePrompt = ({ onUpgrade, requiredTier, contentType }) => {
  const getTierIcon = (tier) => {
    switch (tier) {
      case 'premium': return Star;
      case 'championship': return Crown;
      default: return Play;
    }
  };

  const getTierColor = (tier) => {
    switch (tier) {
      case 'premium': return 'from-blue-600 to-purple-600';
      case 'championship': return 'from-purple-600 to-amber-600';
      default: return 'from-red-600 to-red-800';
    }
  };

  const TierIcon = getTierIcon(requiredTier);
  const gradientClass = getTierColor(requiredTier);

  return (
    <Card className={`bg-gradient-to-br ${gradientClass} text-white border-0 shadow-xl`}>
      <CardContent className="p-6 sm:p-8 text-center">
        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <TierIcon className="w-8 h-8" />
        </div>
        
        <h3 className="text-xl sm:text-2xl font-bold mb-2">
          Upgrade to Curling+ {requiredTier.charAt(0).toUpperCase() + requiredTier.slice(1)}
        </h3>
        
        <p className="text-white/90 mb-6 text-sm sm:text-base">
          Get unlimited access to {contentType === 'live' ? 'live streaming' : 'premium content'}, 
          replays, and exclusive features.
        </p>
        
        <div className="space-y-3 mb-6 text-sm">
          <div className="flex items-center justify-center gap-2">
            <Lock className="w-4 h-4" />
            <span>This {contentType} requires a Curling+ subscription</span>
          </div>
        </div>
        
        <Button 
          onClick={onUpgrade}
          size="lg"
          className="bg-white text-gray-900 hover:bg-gray-100 font-semibold"
        >
          <Crown className="w-5 h-5 mr-2" />
          Upgrade to Curling+ 
        </Button>
        
        <p className="text-white/70 text-xs mt-3">
          7-day free trial • Cancel anytime
        </p>
      </CardContent>
    </Card>
  );
};