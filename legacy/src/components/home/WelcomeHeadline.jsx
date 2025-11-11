import React from 'react';
import { motion } from 'framer-motion';
import { useXP } from '@/components/XPContext';

export default function WelcomeHeadline({ user }) {
  const { loyaltyData } = useXP();
  
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const tierName = loyaltyData?.tier 
    ? loyaltyData.tier.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) 
    : 'Granite Rookie';

  return (
    <motion.div 
      className="text-center"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h1 className="text-4xl md:text-5xl font-bold text-brand-text-primary mb-2">
        {getGreeting()}, {user?.full_name?.split(' ')[0] || 'Curler'}!
      </h1>
      <p className="text-lg text-brand-text-secondary">
        You are a <span className="font-semibold text-amber-400">{tierName}</span> in the Granite Circle.
      </p>
    </motion.div>
  );
}