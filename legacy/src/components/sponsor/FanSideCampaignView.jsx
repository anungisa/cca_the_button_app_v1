import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Gift, 
  Target, 
  Play, 
  ExternalLink, 
  Share2, 
  QrCode,
  X,
  Zap,
  Award,
  Star
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { SponsorCampaign } from '@/api/entities';
import { useXP } from '../XPContext';
import useSponsorAPI from '../hooks/useSponsorAPI';

const getQuestIcon = (type) => {
  switch (type) {
    case 'watch_video': return Play;
    case 'visit_url': return ExternalLink;
    case 'social_share': return Share2;
    case 'scan_qr': return QrCode;
    default: return Target;
  }
};

const getQuestGradient = (type, tier = 'Silver') => {
  const gradients = {
    watch_video: 'from-blue-600 to-purple-700',
    visit_url: 'from-green-600 to-teal-700',
    social_share: 'from-pink-600 to-rose-700',
    scan_qr: 'from-amber-600 to-orange-700'
  };
  
  // Platinum sponsors get special gradients
  if (tier === 'Platinum') {
    return gradients[type]?.replace('600', '500').replace('700', '600') || 'from-purple-500 to-indigo-600';
  }
  
  return gradients[type] || 'from-gray-600 to-gray-700';
};

export default function FanSideCampaignView({ user }) {
  const [availableCampaigns, setAvailableCampaigns] = useState([]);
  const [completedCampaigns, setCompletedCampaigns] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(null);
  
  const { awardPoints, awardBadge } = useXP();
  const { getCampaigns, logEngagement } = useSponsorAPI();

  useEffect(() => {
    if (user) {
      loadCampaigns();
    }
  }, [user]);

  const loadCampaigns = async () => {
    try {
      // Get all active campaigns
      const campaigns = await getCampaigns({ status: 'active' });
      
      // Filter campaigns based on user eligibility
      const eligible = campaigns.filter(campaign => {
        // Check target audience
        if (campaign.target_audience === 'all') return true;
        if (campaign.target_audience === 'clubs' && user.home_club_id) return true;
        if (campaign.target_audience === 'volunteers' && user.user_type === 'volunteer') return true;
        if (campaign.target_audience === 'hp' && user.performance_tier !== 'none') return true;
        if (campaign.target_audience === 'youth' && user.age && user.age < 18) return true;
        return false;
      });

      // TODO: Filter out already completed campaigns
      setAvailableCampaigns(eligible.slice(0, 3)); // Show top 3 most relevant
    } catch (error) {
      console.error('Error loading campaigns:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCampaignClick = async (campaign) => {
    // Log impression
    await logEngagement(campaign.id, user.id, 'impression');
    
    // Show quest modal
    setShowModal(campaign);
  };

  const handleQuestComplete = async (campaign) => {
    try {
      // Log completion
      await logEngagement(campaign.id, user.id, 'completion');
      
      // Award XP
      const success = await awardPoints(
        campaign.xp_reward,
        'sponsor_quest',
        `Completed: ${campaign.name}`,
        campaign.id
      );

      if (success) {
        // Check if special badge should be awarded
        if (campaign.quest_type === 'scan_qr' && campaign.xp_reward >= 100) {
          await awardBadge(
            'event_scanner',
            'Event Scanner',
            'Completed your first QR code quest at an event'
          );
        }

        // Remove from available campaigns
        setAvailableCampaigns(prev => prev.filter(c => c.id !== campaign.id));
        setCompletedCampaigns(prev => [...prev, campaign]);
        
        // Show success feedback
        alert(`Quest completed! You earned ${campaign.xp_reward} XP.`);
      }
    } catch (error) {
      console.error('Error completing quest:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setShowModal(null);
    }
  };

  const executeQuest = (campaign) => {
    switch (campaign.quest_type) {
      case 'watch_video':
        // Open video in modal or redirect
        window.open(campaign.quest_payload, '_blank');
        setTimeout(() => handleQuestComplete(campaign), 30000); // Auto-complete after 30s
        break;
      case 'visit_url':
        window.open(campaign.quest_payload, '_blank');
        handleQuestComplete(campaign);
        break;
      case 'social_share':
        // Open share dialog
        if (navigator.share) {
          navigator.share({
            title: campaign.name,
            text: campaign.description,
            url: campaign.quest_payload || window.location.href
          }).then(() => handleQuestComplete(campaign));
        } else {
          // Fallback to copy link
          navigator.clipboard.writeText(campaign.quest_payload || window.location.href);
          alert('Link copied! Share it to complete the quest.');
          handleQuestComplete(campaign);
        }
        break;
      case 'scan_qr':
        // In a real app, this would open QR scanner
        alert('QR Scanner would open here. For demo, completing quest automatically.');
        handleQuestComplete(campaign);
        break;
      default:
        handleQuestComplete(campaign);
    }
  };

  const QuestModal = ({ campaign }) => {
    if (!campaign) return null;
    
    const QuestIcon = getQuestIcon(campaign.quest_type);
    
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowModal(null)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-brand-card-bg border-brand-border rounded-xl max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className={`bg-gradient-to-r ${getQuestGradient(campaign.quest_type)} p-6 rounded-t-xl text-white`}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <QuestIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{campaign.name}</h3>
                    <p className="text-white/80 text-sm">by {campaign.sponsor_name}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowModal(null)}
                  className="text-white/70 hover:text-white hover:bg-white/20"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
              
              <p className="text-white/90 mb-4">{campaign.description}</p>
              
              <div className="flex items-center justify-between">
                <Badge className="bg-amber-500 text-white flex items-center gap-1">
                  <Zap className="w-3 h-3" />
                  +{campaign.xp_reward} XP
                </Badge>
                <div className="flex items-center gap-2 text-white/80 text-sm">
                  <Target className="w-4 h-4" />
                  Quest Available
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <div className="mb-6">
                <h4 className="font-semibold text-brand-text-primary mb-2">What you need to do:</h4>
                <p className="text-brand-text-secondary text-sm">
                  {campaign.quest_type === 'watch_video' && 'Watch the sponsored video to completion'}
                  {campaign.quest_type === 'visit_url' && 'Visit the sponsor\'s website'}
                  {campaign.quest_type === 'social_share' && 'Share this content on your social media'}
                  {campaign.quest_type === 'scan_qr' && 'Scan the QR code at the event location'}
                </p>
              </div>
              
              <div className="flex gap-3">
                <Button 
                  onClick={() => executeQuest(campaign)}
                  className="flex-1 bg-brand-red hover:bg-red-700"
                >
                  <QuestIcon className="w-4 h-4 mr-2" />
                  Start Quest
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowModal(null)}
                  className="border-brand-border text-brand-text-secondary"
                >
                  Later
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  };

  // Alert bar for new quests (appears on homepage)
  const NewQuestAlert = () => {
    if (availableCampaigns.length === 0) return null;
    
    return (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-purple-600 to-indigo-700 text-white p-4 rounded-lg mb-6"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Gift className="w-6 h-6" />
            <div>
              <h4 className="font-bold">New Sponsor Quests Available!</h4>
              <p className="text-sm text-white/80">
                Earn up to {Math.max(...availableCampaigns.map(c => c.xp_reward))} XP from {availableCampaigns.length} quest{availableCampaigns.length > 1 ? 's' : ''}
              </p>
            </div>
          </div>
          <Button 
            variant="secondary" 
            className="bg-white/20 hover:bg-white/30 text-white border-0"
            onClick={() => {/* Scroll to quests section */}}
          >
            View Quests
          </Button>
        </div>
      </motion.div>
    );
  };

  // Compact quest cards for homepage
  const QuestCards = () => {
    if (availableCampaigns.length === 0) return null;
    
    return (
      <div>
        <h3 className="text-xl font-bold text-brand-text-primary mb-4 flex items-center gap-2">
          <Star className="w-5 h-5 text-brand-red" />
          Sponsor Quests
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {availableCampaigns.map((campaign, index) => {
            const QuestIcon = getQuestIcon(campaign.quest_type);
            return (
              <motion.div
                key={campaign.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -2 }}
                className="cursor-pointer"
                onClick={() => handleCampaignClick(campaign)}
              >
                <Card className={`text-white overflow-hidden bg-gradient-to-br ${getQuestGradient(campaign.quest_type)} border-0`}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                        <QuestIcon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold truncate">{campaign.name}</h4>
                        <p className="text-white/80 text-xs">by {campaign.sponsor_name}</p>
                      </div>
                    </div>
                    
                    <p className="text-white/90 text-sm mb-3 line-clamp-2">
                      {campaign.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <Badge className="bg-amber-500 text-white text-xs">
                        +{campaign.xp_reward} XP
                      </Badge>
                      <Button size="sm" className="bg-white/20 hover:bg-white/30 text-xs">
                        Start Quest
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-4 bg-gray-600 rounded w-1/4 mb-4"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-32 bg-gray-600 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <NewQuestAlert />
      <QuestCards />
      <QuestModal campaign={showModal} />
    </>
  );
}