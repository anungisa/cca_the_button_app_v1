import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Gift, ExternalLink, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { SponsorCampaign } from '@/api/entities';

export default function SponsorActivationWidget({ gameId, currentEnd, onInteraction }) {
  const [activeQuest, setActiveQuest] = useState(null);
  const [completedQuests, setCompletedQuests] = useState(new Set());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadActiveQuest();
  }, [gameId, currentEnd]);

  const loadActiveQuest = async () => {
    setIsLoading(true);
    try {
      const campaigns = await SponsorCampaign.filter({
        is_active: true,
        quest_type: 'watch_video' // or other quest types suitable for live events
      });

      if (campaigns.length > 0) {
        // Select a quest that matches the current game context
        const contextualQuest = campaigns.find(c => 
          c.name.toLowerCase().includes('live') || 
          c.name.toLowerCase().includes('stream')
        ) || campaigns[0];
        
        setActiveQuest(contextualQuest);
      }
    } catch (error) {
      console.error('Error loading sponsor quest:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuestAction = async (action) => {
    if (!activeQuest || completedQuests.has(activeQuest.id)) return;

    try {
      let xpAwarded = activeQuest.xp_reward || 10;
      
      if (action === 'complete') {
        // Mark quest as completed
        setCompletedQuests(new Set([...completedQuests, activeQuest.id]));
        
        await onInteraction('sponsor_quest_completed', {
          quest_id: activeQuest.id,
          sponsor_id: activeQuest.sponsor_name,
          quest_type: activeQuest.quest_type,
          xpAwarded
        });

        // Load next quest after a delay
        setTimeout(() => {
          loadActiveQuest();
        }, 3000);
      } else if (action === 'visit_url') {
        // Open sponsor URL and award partial XP
        window.open(activeQuest.quest_payload, '_blank');
        
        await onInteraction('sponsor_quest_completed', {
          quest_id: activeQuest.id,
          sponsor_id: activeQuest.sponsor_name,
          quest_type: 'visit_url',
          xpAwarded: Math.floor(xpAwarded / 2) // Half XP for URL visits
        });
      }
    } catch (error) {
      console.error('Error completing sponsor quest:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-red"></div>
      </div>
    );
  }

  if (!activeQuest) {
    return (
      <Card className="bg-brand-charcoal border-brand-border">
        <CardContent className="p-6 text-center">
          <Star className="w-8 h-8 text-brand-text-secondary mx-auto mb-2" />
          <p className="text-brand-text-secondary">No sponsor activations available.</p>
          <p className="text-xs text-brand-text-secondary mt-1">
            Check back during commercial breaks!
          </p>
        </CardContent>
      </Card>
    );
  }

  const isCompleted = completedQuests.has(activeQuest.id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <Card className="bg-gradient-to-br from-purple-900/20 to-brand-charcoal border-purple-500/30">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm flex items-center gap-2">
              <Star className="w-4 h-4 text-purple-400" />
              Sponsor Challenge
            </CardTitle>
            <Badge className="bg-purple-600 text-white">
              <Gift className="w-3 h-3 mr-1" />
              {activeQuest.xp_reward} XP
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Sponsor Branding */}
          <div className="text-center">
            <div className="text-lg font-bold text-brand-text-primary mb-1">
              {activeQuest.sponsor_name}
            </div>
            {activeQuest.brand_logo_url && (
              <img 
                src={activeQuest.brand_logo_url} 
                alt={activeQuest.sponsor_name}
                className="h-8 mx-auto mb-2"
              />
            )}
          </div>

          {/* Quest Description */}
          <div className="bg-brand-card-bg/50 p-3 rounded-lg">
            <h4 className="font-medium text-brand-text-primary mb-2">
              {activeQuest.name}
            </h4>
            <p className="text-sm text-brand-text-secondary">
              {activeQuest.description}
            </p>
          </div>

          {/* Quest Actions */}
          <div className="space-y-2">
            {activeQuest.quest_type === 'watch_video' && (
              <Button
                onClick={() => handleQuestAction('complete')}
                disabled={isCompleted}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white"
              >
                {isCompleted ? (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Completed!
                  </>
                ) : (
                  <>
                    <Star className="w-4 h-4 mr-2" />
                    Complete Challenge
                  </>
                )}
              </Button>
            )}

            {activeQuest.quest_type === 'visit_url' && (
              <Button
                onClick={() => handleQuestAction('visit_url')}
                disabled={isCompleted}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Visit {activeQuest.sponsor_name}
              </Button>
            )}

            {activeQuest.quest_type === 'social_share' && (
              <Button
                onClick={() => handleQuestAction('complete')}
                disabled={isCompleted}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white"
              >
                <Star className="w-4 h-4 mr-2" />
                Share & Earn XP
              </Button>
            )}
          </div>

          {/* Completion Message */}
          <AnimatePresence>
            {isCompleted && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center p-3 rounded-lg bg-purple-600/10 border border-purple-600/20"
              >
                <CheckCircle className="w-5 h-5 text-purple-400 mx-auto mb-1" />
                <p className="text-purple-400 font-medium">
                  Challenge completed! +{activeQuest.xp_reward} XP
                </p>
                <p className="text-xs text-purple-400/80 mt-1">
                  Thanks for engaging with {activeQuest.sponsor_name}!
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
}