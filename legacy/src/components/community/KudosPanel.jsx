import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, Award, Star, Users } from 'lucide-react';
import { motion } from 'framer-motion';

export default function KudosPanel({ recentKudos = [] }) {
  const [selectedKudos, setSelectedKudos] = useState('great_shot');

  const kudosTypes = [
    { id: 'great_shot', label: 'Great Shot!', icon: '🎯', color: 'bg-blue-500' },
    { id: 'team_spirit', label: 'Team Spirit', icon: '🤝', color: 'bg-purple-500' },
    { id: 'sportsmanship', label: 'Sportsmanship', icon: '⚡', color: 'bg-green-500' },
    { id: 'mentorship', label: 'Great Mentor', icon: '🏆', color: 'bg-amber-500' },
  ];

  const handleSendKudos = () => {
    // In a real app, this would send kudos to a selected user
    alert('Kudos sent! 🎉');
  };

  return (
    <Card className="bg-brand-card-bg border-brand-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="w-5 h-5 text-brand-red" />
          Send Kudos
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-2">
          {kudosTypes.map((kudos) => (
            <Button
              key={kudos.id}
              variant={selectedKudos === kudos.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedKudos(kudos.id)}
              className={`${selectedKudos === kudos.id ? kudos.color : 'border-brand-border text-brand-text-secondary'} text-xs`}
            >
              <span className="mr-1">{kudos.icon}</span>
              {kudos.label}
            </Button>
          ))}
        </div>

        <Button onClick={handleSendKudos} className="w-full bg-brand-red hover:bg-red-700">
          <Heart className="w-4 h-4 mr-2" />
          Send Kudos
        </Button>

        {recentKudos && recentKudos.length > 0 && (
          <div className="mt-6">
            <h4 className="font-medium text-brand-text-primary mb-3">Recent Kudos</h4>
            <div className="space-y-2">
              {recentKudos.slice(0, 3).map((kudos, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-3 text-sm p-2 bg-brand-charcoal rounded"
                >
                  <div className="w-8 h-8 bg-brand-red rounded-full flex items-center justify-center text-white font-bold text-xs">
                    {kudos.sender_name?.charAt(0) || 'U'}
                  </div>
                  <div className="flex-1">
                    <p className="text-brand-text-primary">
                      <span className="font-medium">{kudos.sender_name || 'Someone'}</span> sent kudos
                    </p>
                    <p className="text-brand-text-secondary text-xs">{kudos.kudos_type?.replace('_', ' ') || 'Great job!'}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}