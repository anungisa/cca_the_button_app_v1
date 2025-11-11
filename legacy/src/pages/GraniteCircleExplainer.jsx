
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Gem, 
  Trophy, 
  Crown,
  Star,
  Zap,
  Gift,
  Users,
  Heart,
  Target,
  Award,
  ChevronRight,
  Play,
  ShoppingCart,
  HelpingHand,
  BookOpen,
  Calendar
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';

const tierData = [
  {
    id: 'granite_rookie',
    name: 'Granite Rookie',
    icon: Gem,
    color: 'from-gray-400 to-gray-600',
    borderColor: 'border-gray-400',
    textColor: 'text-gray-700',
    xpRequired: 0,
    nextTier: 500,
    description: 'Welcome to the Granite Circle! Every curler starts here.',
    perks: [
      'Access to basic loyalty features',
      'Earn CurlPoints for activities',
      'Track your curling journey',
      'Basic badge collection'
    ]
  },
  {
    id: 'sheet_champion',
    name: 'Sheet Champion',
    icon: Trophy,
    color: 'from-blue-400 to-blue-600',
    borderColor: 'border-blue-400',
    textColor: 'text-blue-700',
    xpRequired: 500,
    nextTier: 2000,
    description: 'You\'re making your mark on the ice!',
    perks: [
      'All Granite Rookie benefits',
      '5% discount on shop purchases',
      'Priority event notifications',
      'Exclusive Champion badges',
      'Monthly bonus point opportunities'
    ]
  },
  {
    id: 'house_hero',
    name: 'House Hero',
    icon: Crown,
    color: 'from-amber-400 to-amber-600',
    borderColor: 'border-amber-400',
    textColor: 'text-amber-700',
    xpRequired: 2000,
    nextTier: null,
    description: 'The elite tier for curling\'s most dedicated community members.',
    perks: [
      'All previous tier benefits',
      '10% discount on all purchases',
      'Exclusive merchandise access',
      'VIP event invitations',
      'Personal curling concierge',
      'Legacy badge collection'
    ]
  }
];

const pointsActivities = [
  {
    category: 'Community Engagement',
    icon: Users,
    color: 'bg-blue-100 text-blue-800',
    activities: [
      { action: 'Volunteer at events', points: '50-200', description: 'Help at tournaments, registration, ice prep' },
      { action: 'Refer a friend', points: '100', description: 'Invite someone new to join MyCurling' },
      { action: 'Club check-in', points: '10', description: 'Visit your home club or try a new one' },
      { action: 'Complete profile', points: '25', description: 'Add photo, preferences, and club info' }
    ]
  },
  {
    category: 'Supporting Curling',
    icon: Heart,
    color: 'bg-red-100 text-red-800',
    activities: [
      { action: 'FTLOC donation', points: '1 per $1', description: 'Support youth curling development' },
      { action: 'Watch livestreams', points: '15', description: 'Tune in to championship events' },
      { action: 'Share social content', points: '25', description: 'Spread the curling love online' },
      { action: 'Event attendance', points: '50', description: 'Participate in club or regional events' }
    ]
  },
  {
    category: 'Learning & Development',
    icon: BookOpen,
    color: 'bg-green-100 text-green-800',
    activities: [
      { action: 'Complete Safe Sport', points: '200', description: 'Finish required certification' },
      { action: 'Coaching courses', points: '150', description: 'NCCP or skills development' },
      { action: 'Knowledge articles', points: '25', description: 'Read business or technical guides' },
      { action: 'DEI training', points: '100', description: 'Complete diversity and inclusion modules' }
    ]
  },
  {
    category: 'Competition & Performance',
    icon: Target,
    color: 'bg-purple-100 text-purple-800',
    activities: [
      { action: 'Hit Draw Tap entry', points: '50', description: 'Submit youth skills competition scores' },
      { action: 'Smart Broom session', points: '75', description: 'Upload training data from Smart Broom' },
      { action: 'Competition results', points: '100', description: 'Participate in registered events' },
      { action: 'Personal best', points: '25', description: 'Achieve new performance milestones' }
    ]
  },
  {
    category: 'Shopping & Rewards',
    icon: ShoppingCart,
    color: 'bg-amber-100 text-amber-800',
    activities: [
      { action: 'Shop purchases', points: 'Varies', description: 'Earn points on official merchandise' },
      { action: 'Product reviews', points: '15', description: 'Review purchased items' },
      { action: 'Loyalty redemptions', points: 'Varies', description: 'Use points for exclusive rewards' }
    ]
  }
];

const TierCard = ({ tier, isActive = false }) => {
  const TierIcon = tier.icon;
  
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`relative p-6 rounded-2xl border-2 ${tier.borderColor} ${
        isActive ? 'ring-4 ring-brand-red ring-opacity-50' : ''
      }`}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${tier.color} opacity-10 rounded-2xl`}></div>
      
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <div className={`w-12 h-12 bg-gradient-to-br ${tier.color} rounded-full flex items-center justify-center`}>
            <TierIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className={`text-xl font-bold ${tier.textColor}`}>{tier.name}</h3>
            {tier.nextTier ? (
              <p className="text-sm text-gray-600">{tier.xpRequired} - {tier.nextTier - 1} XP</p>
            ) : (
              <p className="text-sm text-gray-600">{tier.xpRequired}+ XP</p>
            )}
          </div>
          {isActive && (
            <Badge className="ml-auto bg-brand-red text-white">Current</Badge>
          )}
        </div>
        
        <p className="text-gray-700 mb-4">{tier.description}</p>
        
        <div className="space-y-2">
          <h4 className="font-semibold text-sm text-gray-800">Tier Benefits:</h4>
          {tier.perks.map((perk, index) => (
            <div key={index} className="flex items-center gap-2">
              <Star className="w-3 h-3 text-amber-500 flex-shrink-0" />
              <span className="text-sm text-gray-600">{perk}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default function GraniteCircleExplainer() {
  const [activeTab, setActiveTab] = useState('overview');
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-brand-charcoal">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center mb-6"
          >
            <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-red-600 rounded-full flex items-center justify-center">
              <Gem className="w-10 h-10 text-white" />
            </div>
          </motion.div>
          <motion.h1 
            className="text-4xl md:text-5xl font-bold text-brand-text-primary mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            The Granite Circle
          </motion.h1>
          <motion.p 
            className="text-xl text-brand-text-secondary max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            Your loyalty program for being part of Canada's curling community. 
            Earn CurlPoints, unlock tiers, and access exclusive rewards.
          </motion.p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="tiers">Tiers & Benefits</TabsTrigger>
            <TabsTrigger value="earn">Earn Points</TabsTrigger>
            <TabsTrigger value="rewards">Rewards</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            <Card className="bg-brand-card-bg border-brand-border">
              <CardContent className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  <div>
                    <h2 className="text-2xl font-bold text-brand-text-primary mb-4">
                      Welcome to Your Curling Journey
                    </h2>
                    <p className="text-brand-text-secondary mb-6">
                      The Granite Circle recognizes and rewards your participation in Canadian curling. 
                      Whether you're a new curler, dedicated volunteer, or competitive athlete, 
                      every action you take earns CurlPoints and helps you advance through our three tiers.
                    </p>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <Zap className="w-5 h-5 text-amber-500" />
                        <span className="text-brand-text-primary">Earn CurlPoints for every activity</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Trophy className="w-5 h-5 text-blue-500" />
                        <span className="text-brand-text-primary">Advance through three prestigious tiers</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Gift className="w-5 h-5 text-purple-500" />
                        <span className="text-brand-text-primary">Unlock exclusive rewards and discounts</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Award className="w-5 h-5 text-green-500" />
                        <span className="text-brand-text-primary">Collect badges for special achievements</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="relative">
                    <img
                      src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=600&auto=format&fit=crop"
                      alt="Curling stone on ice"
                      className="rounded-2xl shadow-lg"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-2xl"></div>
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <p className="text-lg font-semibold">Every stone tells a story</p>
                      <p className="text-sm opacity-90">Track yours with the Granite Circle</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="text-center">
              <Button 
                onClick={() => navigate(createPageUrl('LoyaltyProgram'))}
                size="lg"
                className="bg-brand-red hover:bg-red-700 text-white font-bold"
              >
                <Zap className="w-5 h-5 mr-2" />
                Start Earning Points Now
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="tiers" className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-brand-text-primary mb-4">
                Three Tiers, Endless Possibilities
              </h2>
              <p className="text-brand-text-secondary">
                Progress through our loyalty tiers and unlock increasingly valuable benefits
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {tierData.map((tier) => (
                <TierCard key={tier.id} tier={tier} />
              ))}
            </div>

            <Card className="bg-gradient-to-r from-brand-red/10 to-amber-500/10 border-brand-red/20">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-brand-text-primary mb-2">
                  🚀 Pro Tip: Accelerate Your Progress
                </h3>
                <p className="text-brand-text-secondary mb-4">
                  Upgrade to Fan Pass for 2x CurlPoints on all activities! Plus get exclusive content and early access to events.
                </p>
                <Button 
                  variant="outline" 
                  className="border-brand-red text-brand-red hover:bg-brand-red hover:text-white"
                  onClick={() => navigate(createPageUrl('FanPass'))}
                >
                  Learn About Fan Pass <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="earn" className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-brand-text-primary mb-4">
                How to Earn CurlPoints
              </h2>
              <p className="text-brand-text-secondary">
                Every action in the curling community earns you points. Here's how to maximize your earning potential.
              </p>
            </div>

            <div className="space-y-6">
              {pointsActivities.map((category, index) => (
                <Card key={index} className="bg-brand-card-bg border-brand-border">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-brand-text-primary">
                      <div className={`w-10 h-10 ${category.color} rounded-full flex items-center justify-center`}>
                        <category.icon className="w-5 h-5" />
                      </div>
                      {category.category}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {category.activities.map((activity, actIndex) => (
                        <div key={actIndex} className="p-4 bg-brand-charcoal/50 rounded-lg">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-semibold text-brand-text-primary">{activity.action}</h4>
                            <Badge className="bg-amber-100 text-amber-800 flex items-center gap-1">
                              <Zap className="w-3 h-3" />
                              {activity.points}
                            </Badge>
                          </div>
                          <p className="text-sm text-brand-text-secondary">{activity.description}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="rewards" className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-brand-text-primary mb-4">
                Redeem Your Points
              </h2>
              <p className="text-brand-text-secondary">
                Use your CurlPoints for exclusive merchandise, experiences, and discounts
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { name: 'Curling Canada Hoodie', points: 750, image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=300&h=200&fit=crop', tier: 'all' },
                { name: 'VIP Event Access', points: 500, image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop', tier: 'champion' },
                { name: 'Coaching Session', points: 1000, image: 'https://images.unsplash.com/photo-1594736797933-d0401ba0bf61?w=300&h=200&fit=crop', tier: 'hero' },
                { name: 'Official Curling Stone', points: 2000, image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop', tier: 'hero' },
                { name: 'Tournament Entry', points: 300, image: 'https://images.unsplash.com/photo-1627993358399-52b3c2936a7e?w=300&h=200&fit=crop', tier: 'all' },
                { name: 'Club Gift Card', points: 150, image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=300&h=200&fit=crop', tier: 'all' }
              ].map((reward, index) => (
                <Card key={index} className="bg-brand-card-bg border-brand-border hover:shadow-lg transition-shadow">
                  <div className="relative">
                    <img 
                      src={reward.image} 
                      alt={reward.name}
                      className="w-full h-40 object-cover rounded-t-lg"
                    />
                    <Badge className="absolute top-2 right-2 bg-amber-100 text-amber-800">
                      {reward.points} pts
                    </Badge>
                  </div>
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-brand-text-primary mb-2">{reward.name}</h4>
                    <div className="flex justify-between items-center">
                      <Badge variant="outline" className="text-xs">
                        {reward.tier === 'all' ? 'All Tiers' : reward.tier === 'champion' ? 'Champion+' : 'Hero Only'}
                      </Badge>
                      <Button size="sm" variant="outline">
                        <Gift className="w-4 h-4 mr-1" />
                        Redeem
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="bg-brand-card-bg border-brand-border">
              <CardContent className="p-6 text-center">
                <h3 className="text-lg font-bold text-brand-text-primary mb-4">
                  Ready to Start Redeeming?
                </h3>
                <p className="text-brand-text-secondary mb-6">
                  Visit the full Granite Circle dashboard to see all available rewards and your current point balance.
                </p>
                <Button 
                  onClick={() => navigate(createPageUrl('LoyaltyProgram'))}
                  className="bg-brand-red hover:bg-red-700"
                >
                  <Trophy className="w-4 h-4 mr-2" />
                  Go to Granite Circle
                </Button>
              </CardContent>
            </Card>

            <div className="text-center mt-16">
                <h2 className="text-3xl font-bold text-brand-text-primary mb-4">Ready to Redeem?</h2>
                <p className="text-lg text-brand-text-secondary mb-6 max-w-2xl mx-auto">
                    Your CurlPoints are your key to unlocking exclusive gear, discounts, and one-of-a-kind experiences.
                </p>
                <Link to={createPageUrl('RewardStore')}>
                    <Button size="lg" className="bg-amber-500 hover:bg-amber-600 text-white shadow-lg">
                        <ShoppingCart className="w-5 h-5 mr-2" />
                        Visit the Reward Store
                    </Button>
                </Link>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
