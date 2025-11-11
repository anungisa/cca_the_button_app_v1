import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, User, Award, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AthleteSpotlight({ scholars = [], onSendKudos, kudosGiven = new Set() }) {
  const [scholarIndex, setScholarIndex] = useState(0);

  // Ensure scholars is always an array
  const safeScholars = Array.isArray(scholars) ? scholars : [];

  if (safeScholars.length === 0) {
    return (
      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5 text-brand-red" />
            Athlete Spotlight
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center text-brand-text-secondary py-8">
          <p>No athletes to spotlight at this time.</p>
        </CardContent>
      </Card>
    );
  }

  const currentScholar = safeScholars[scholarIndex];

  if (!currentScholar) {
    return (
      <Card className="bg-brand-card-bg border-brand-border">
        <CardContent className="p-6 text-center text-brand-text-secondary">
          Error loading athlete data.
        </CardContent>
      </Card>
    );
  }

  const hasGivenKudos = kudosGiven.has(currentScholar.id);
  const safeAchievements = Array.isArray(currentScholar.achievements) ? currentScholar.achievements : [];

  const nextScholar = () => {
    setScholarIndex((prev) => (prev + 1) % safeScholars.length);
  };

  const prevScholar = () => {
    setScholarIndex((prev) => (prev - 1 + safeScholars.length) % safeScholars.length);
  };

  return (
    <Card className="bg-brand-card-bg border-brand-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="w-5 h-5 text-brand-red" />
          Athlete Spotlight
        </CardTitle>
      </CardHeader>
      <CardContent className="text-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={scholarIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="relative w-24 h-24 mx-auto mb-4">
              <img
                src={currentScholar.image || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200'}
                alt={currentScholar.name}
                className="w-full h-full rounded-full object-cover border-4 border-brand-red"
              />
            </div>

            <div className="flex items-center justify-center gap-2 mb-2">
              {safeScholars.length > 1 && (
                <Button variant="ghost" size="icon" onClick={prevScholar} className="w-8 h-8">
                  <ChevronLeft className="w-4 h-4" />
                </Button>
              )}
              <h3 className="text-xl font-bold text-brand-text-primary px-4">{currentScholar.name}</h3>
              {safeScholars.length > 1 && (
                <Button variant="ghost" size="icon" onClick={nextScholar} className="w-8 h-8">
                  <ChevronRight className="w-4 h-4" />
                </Button>
              )}
            </div>

            <p className="text-brand-text-secondary mb-2">{currentScholar.location}</p>
            <p className="text-sm text-brand-text-secondary italic mb-4 h-12">"{currentScholar.story}"</p>

            <div className="space-y-4 text-left">
              <div className="flex flex-wrap gap-2 justify-center">
                {safeAchievements.map((ach, index) => (
                  <Badge key={index} className="bg-amber-900/50 text-amber-300">
                    <Award className="w-3 h-3 mr-1" />
                    {ach}
                  </Badge>
                ))}
              </div>

              <Button
                onClick={() => onSendKudos && onSendKudos(currentScholar.id)}
                disabled={hasGivenKudos}
                className="w-full bg-brand-red hover:bg-red-700 disabled:bg-gray-500"
              >
                <Heart className="w-4 h-4 mr-2" />
                {hasGivenKudos ? 'Kudos Sent!' : 'Send Kudos'}
              </Button>
            </div>
          </motion.div>
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}