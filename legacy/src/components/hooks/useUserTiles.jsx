import { useState, useEffect, useMemo } from 'react';
import { useXP } from '../XPContext';
import { 
  Zap, 
  ShoppingCart, 
  Heart, 
  Trophy,
  Building,
  ShieldCheck,
  Users,
  Video,
  Target,
  BookOpen,
  Smartphone,
  GraduationCap
} from 'lucide-react';

export const useUserTiles = (user) => {
  const { loyaltyData } = useXP();
  const [tileInteractions, setTileInteractions] = useState({});

  const baseTiles = [
    {
      id: 'smart_broom',
      title: 'Smart Broom Training',
      description: 'Connect your Smart Curling Broom and analyze your sweeping technique with real-time data.',
      icon: Smartphone,
      color: 'bg-blue-100',
      textColor: 'text-blue-600',
      xpReward: 100,
      priority: 'high',
      roles: ['athlete', 'coach'],
      requirements: ['performance_tier'],
      actionText: 'Connect Device',
      route: '/smart-broom'
    },
    {
      id: 'youth_development',
      title: 'Youth Development Hub',
      description: 'Access Hit Draw Tap, scholarships, and youth programs. Build your pathway to Team Canada.',
      icon: Target,
      color: 'bg-purple-100',
      textColor: 'text-purple-600',
      xpReward: 75,
      priority: 'high',
      roles: ['youth', 'parent', 'coach'],
      actionText: 'Explore Programs',
      route: '/youth-passport'
    },
    {
      id: 'high_performance',
      title: 'High Performance Hub',
      description: 'Elite training resources, performance analytics, and coaching tools for competitive curlers.',
      icon: Trophy,
      color: 'bg-amber-100',
      textColor: 'text-amber-600',
      xpReward: 150,
      priority: 'high',
      roles: ['athlete', 'coach'],
      requirements: ['performance_tier'],
      actionText: 'Access Hub',
      route: '/high-performance'
    },
    {
      id: 'safe_sport',
      title: 'Safe Sport Certification',
      description: 'Complete your Safe Sport certification to participate in curling activities.',
      icon: ShieldCheck,
      color: 'bg-green-100',
      textColor: 'text-green-600',
      xpReward: 200,
      priority: 'high',
      roles: ['all'],
      requirements: ['safe_sport_incomplete'],
      requiresAction: true,
      actionText: 'Get Certified',
      route: '/safe-sport'
    },
    {
      id: 'shop_gear',
      title: 'Shop New Gear',
      description: 'Browse official Curling Canada merchandise and equipment. Exclusive discounts for loyalty members.',
      icon: ShoppingCart,
      color: 'bg-green-100',
      textColor: 'text-green-600',
      xpReward: 50,
      priority: 'normal',
      roles: ['all'],
      actionText: 'Browse Shop',
      route: '/shop',
      badgeText: loyaltyData?.tier === 'house_hero' ? '10% OFF' : loyaltyData?.tier === 'sheet_champion' ? '5% OFF' : null
    },
    {
      id: 'ftloc_impact',
      title: 'FTLOC Impact Tracker',
      description: 'See how your donations are making a difference in youth curling across Canada.',
      icon: Heart,
      color: 'bg-red-100',
      textColor: 'text-red-600',
      xpReward: 25,
      priority: 'normal',
      roles: ['all'],
      actionText: 'View Impact',
      route: '/ftloc'
    },
    {
      id: 'pick_club',
      title: 'Pick Your Home Club',
      description: 'Connect with your local curling community and get personalized content.',
      icon: Building,
      color: 'bg-purple-100',
      textColor: 'text-purple-600',
      xpReward: 50,
      priority: 'medium',
      roles: ['all'],
      requirements: ['no_home_club'],
      actionText: 'Select Club',
      route: '/profile'
    },
    {
      id: 'coaching_courses',
      title: 'Coaching Development',
      description: 'Advance your coaching skills with NCCP certification courses and resources.',
      icon: GraduationCap,
      color: 'bg-indigo-100',
      textColor: 'text-indigo-600',
      xpReward: 300,
      priority: 'normal',
      roles: ['coach', 'volunteer'],
      actionText: 'Start Learning',
      route: '/coaching'
    }
  ];

  const getVisibleTiles = useMemo(() => {
    if (!user) return baseTiles.filter(tile => tile.roles.includes('all')).slice(0, 4);

    // Calculate user age
    const userAge = user.date_of_birth ? calculateAge(user.date_of_birth) : null;
    const isYouth = userAge && userAge < 18;

    return baseTiles.filter(tile => {
      // Role check
      const roleMatch = tile.roles.includes('all') || 
                       tile.roles.includes(user.user_type) ||
                       (isYouth && tile.roles.includes('youth'));
      if (!roleMatch) return false;

      // Requirements check
      if (tile.requirements) {
        return tile.requirements.every(req => {
          switch (req) {
            case 'performance_tier':
              return user.performance_tier && user.performance_tier !== 'none';
            case 'no_home_club':
              return !user.home_club_id;
            case 'safe_sport_incomplete':
              return user.safe_sport_status !== 'current';
            default:
              return true;
          }
        });
      }

      return true;
    });
  }, [user, loyaltyData]);

  const calculateAge = (dateOfBirth) => {
    const today = new Date();
    const birth = new Date(dateOfBirth);
    return today.getFullYear() - birth.getFullYear();
  };

  const sortedTiles = useMemo(() => {
    const priorityOrder = { high: 3, medium: 2, normal: 1 };
    
    return getVisibleTiles.sort((a, b) => {
      // First sort by priority
      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
      if (priorityDiff !== 0) return priorityDiff;
      
      // Then by interaction frequency (if tracked)
      const aInteractions = tileInteractions[a.id] || 0;
      const bInteractions = tileInteractions[b.id] || 0;
      
      return bInteractions - aInteractions;
    });
  }, [getVisibleTiles, tileInteractions]);

  const trackTileInteraction = (tileId) => {
    setTileInteractions(prev => ({
      ...prev,
      [tileId]: (prev[tileId] || 0) + 1
    }));
  };

  return {
    tiles: sortedTiles,
    trackTileInteraction
  };
};