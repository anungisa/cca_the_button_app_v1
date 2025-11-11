import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Play, 
  Trophy, 
  QrCode, 
  Target, 
  Users, 
  Zap,
  MapPin,
  Gift
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useXP } from '../XPContext';
import TriviaPanel from './TriviaPanel';
import PatchScanPanel from './PatchScanPanel';
import LivestreamXPPanel from './LivestreamXPPanel';
import PointsBetIntegration from './PointsBetIntegration';

export default function FanOSCore({ user }) {
  const { loyaltyData, awardPoints } = useXP();
  const [activeFeature, setActiveFeature] = useState('trivia');
  const [dailyXP, setDailyXP] = useState(0);
  const [availablePatches, setAvailablePatches] = useState([]);

  useEffect(() => {
    loadFanOSData();
  }, [user]);

  const loadFanOSData = async () => {
    // Load user's daily XP progress
    // Load available patches in user's area
    // Load active trivia questions
    // Check PointsBet eligibility
  };

  const fanOSFeatures = [
    {
      id: 'trivia',
      title: 'Daily Trivia',
      icon: Trophy,
      description: 'Test your curling knowledge',
      xpPotential: '10-25 XP',
      color: 'from-blue-500 to-blue-700'
    },
    {
      id: 'livestream',
      title: 'Watch & Earn',
      icon: Play,
      description: 'Earn XP while watching live curling',
      xpPotential: '15 XP/hour',
      color: 'from-purple-500 to-purple-700'
    },
    {
      id: 'patch',
      title: 'Patch Hunt',
      icon: QrCode,
      description: 'Scan QR codes at events for exclusive rewards',
      xpPotential: '50-200 XP',
      color: 'from-green-500 to-green-700'
    },
    {
      id: 'pointsbet',
      title: 'Fan Predictions',
      icon: Target,
      description: 'Make predictions and compete with other fans',
      xpPotential: '25-100 XP',
      color: 'from-red-500 to-red-700',
      ageGated: true,
      geoRestricted: true
    }
  ];

  const FeatureCard = ({ feature }) => {
    const Icon = feature.icon;
    const isActive = activeFeature === feature.id;
    
    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`cursor-pointer transition-all duration-200 ${
          isActive ? 'ring-2 ring-brand-red' : ''
        }`}
        onClick={() => setActiveFeature(feature.id)}
      >
        <Card className={`bg-gradient-to-br ${feature.color} text-white border-0`}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <Icon className="w-8 h-8" />
              {feature.ageGated && (
                <Badge className="bg-yellow-500 text-black text-xs">18+</Badge>
              )}
            </div>
            <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
            <p className="text-sm opacity-90 mb-3">{feature.description}</p>
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium">{feature.xpPotential}</span>
              {feature.geoRestricted && (
                <MapPin className="w-4 h-4 opacity-70" />
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  return (
    <div className="space-y-8">
      {/* FanOS Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-brand-text-primary mb-2">FanOS</h1>
        <p className="text-xl text-brand-text-secondary mb-4">
          Your fan engagement hub - earn XP for being a curling enthusiast
        </p>
        
        {/* Daily XP Progress */}
        <Card className="bg-brand-card-bg border-brand-border max-w-md mx-auto">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-500" />
                <span className="font-semibold text-brand-text-primary">Today's XP</span>
              </div>
              <div className="text-right">
                <span className="text-2xl font-bold text-brand-text-primary">{dailyXP}</span>
                <span className="text-sm text-brand-text-secondary ml-1">/ 500</span>
              </div>
            </div>
            <div className="w-full bg-brand-charcoal rounded-full h-2 mt-2">
              <div 
                className="bg-gradient-to-r from-amber-500 to-amber-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${Math.min((dailyXP / 500) * 100, 100)}%` }}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Feature Selection Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {fanOSFeatures.map((feature) => (
          <FeatureCard key={feature.id} feature={feature} />
        ))}
      </div>

      {/* Active Feature Panel */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeFeature}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {activeFeature === 'trivia' && <TriviaPanel user={user} onXPEarned={awardPoints} />}
          {activeFeature === 'livestream' && <LivestreamXPPanel user={user} onXPEarned={awardPoints} />}
          {activeFeature === 'patch' && <PatchScanPanel user={user} onXPEarned={awardPoints} />}
          {activeFeature === 'pointsbet' && <PointsBetIntegration user={user} onXPEarned={awardPoints} />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}