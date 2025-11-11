
import React, { useState, useEffect } from 'react';
import { Donation } from '@/api/entities';
import { Pledge } from '@/api/entities';
import { ScholarshipApplication } from '@/api/entities';
import { GrantApplication } from '@/api/entities';
import { YouthInitiative } from '@/api/entities';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  Heart, 
  Users, 
  TrendingUp, 
  Award,
  DollarSign,
  Target,
  Calendar,
  Map,
  Star,
  Trophy,
  Zap,
  Gift,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ImpactStats from '../components/ftloc/ImpactStats';
import DonatePanel from '../components/ftloc/DonatePanel';
import AthleteSpotlight from '../components/ftloc/AthleteSpotlight';
import SupportLeaderboard from '../components/ftloc/SupportLeaderboard';
import YourImpactCard from '../components/ftloc/YourImpactCard';
import { useXP } from '../components/XPContext';

export default function FTLOCHub() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 },
    },
  };

  // Mock Data
  const mockScholars = [
    { id: '1', name: 'Rachel Homan', age: 34, province: 'ON', story: 'Aiming for another national title with my new team...', image: 'https://images.unsplash.com/photo-1594744806549-83a888316a58?w=500&auto=format&fit=crop&q=60', audio_testimonial_url: '', kudos_count: 1250, achievements: ['4x Scotties Champion', 'World Champion'], impact_goals: { training: { current: 75, goal: 100 }, travel: { current: 50, goal: 100 }, equipment: { current: 90, goal: 100 } } },
    { id: '2', name: 'Brad Gushue', age: 43, province: 'NL', story: 'The drive to compete never fades. Every rock is a new challenge.', image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=500&auto=format&fit=crop&q=60', audio_testimonial_url: '', kudos_count: 2300, achievements: ['Olympic Gold Medalist', '5x Brier Champion'], impact_goals: { training: { current: 95, goal: 100 }, travel: { current: 80, goal: 100 }, equipment: { current: 100, goal: 100 } } },
    { id: '3', name: 'Kerri Einarson', age: 36, province: 'MB', story: 'Balancing life as a mom and a professional curler is my biggest achievement.', image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=500&auto=format&fit=crop&q=60', audio_testimonial_url: '', kudos_count: 980, achievements: ['4x Scotties Champion', 'Mixed Doubles Champion'], impact_goals: { training: { current: 85, goal: 100 }, travel: { current: 60, goal: 100 }, equipment: { current: 75, goal: 100 } } },
  ];

  const mockLeaderboard = [
    { name: 'CurlFan2024', kudos: 520 },
    { name: 'Anonymous', kudos: 480 },
    { name: 'The Rockers Club', kudos: 450 },
    { name: 'GushueFan1', kudos: 390 },
    { name: 'SlideRight', kudos: 320 },
  ];
  
  const mockUserImpact = {
      donationsMade: 3,
      kudosSent: 15
  };

  return (
    <div className="min-h-screen bg-brand-charcoal">
      {/* Header */}
      <motion.div
        variants={itemVariants}
        className="text-center p-8 rounded-lg bg-gradient-to-br from-brand-red to-red-800 text-white"
      >
        <div className="flex justify-center items-center mb-4">
          <Heart className="w-16 h-16" />
        </div>
        <h1 className="text-4xl font-bold">For The Love of Curling</h1>
        <p className="text-xl mt-2 text-red-100 max-w-3xl mx-auto">
          Support the future of curling in Canada. Your donation helps develop athletes, support clubs, and grow the game we all love.
        </p>
      </motion.div>

      {/* Main Content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-8"
      >
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          <motion.div variants={itemVariants}>
            <ImpactStats />
          </motion.div>
          <motion.div variants={itemVariants}>
            <DonatePanel scholars={mockScholars} onDonate={() => {}} />
          </motion.div>
          <motion.div variants={itemVariants}>
            <SupportLeaderboard leaderboardData={mockLeaderboard} />
          </motion.div>
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          <motion.div variants={itemVariants}>
            <YourImpactCard donationsMade={mockUserImpact.donationsMade} kudosSent={mockUserImpact.kudosSent} />
          </motion.div>
          <motion.div variants={itemVariants}>
            <AthleteSpotlight scholars={mockScholars} onSendKudos={() => {}} kudosGiven={new Set()} />
          </motion.div>
        </div>
      </motion.div>

      {/* The section with SponsorShowcase was removed as per the refactoring outline. */}
    </div>
  );
}
