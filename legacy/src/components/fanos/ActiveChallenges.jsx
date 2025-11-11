import React, { useState, useEffect } from 'react';
import { XPChallenge } from '@/api/entities';
import { Loader2, Trophy } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function ActiveChallenges() {
  const [challenges, setChallenges] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchChallenges = async () => {
      setIsLoading(true);
      try {
        const activeChallenges = await XPChallenge.filter({ is_active: true });
        setChallenges(activeChallenges.slice(0, 4)); // Show top 4
      } catch (error) {
        console.error("Failed to fetch challenges", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchChallenges();
  }, []);

  if (isLoading) {
    return <div className="flex justify-center items-center h-40"><Loader2 className="animate-spin" /></div>;
  }
  
  if (challenges.length === 0) {
      return <p className="text-brand-text-secondary">No active challenges right now. Check back soon!</p>;
  }

  return (
    <div className="space-y-4">
      {challenges.map(challenge => (
        <div key={challenge.id} className="flex items-center justify-between p-3 bg-brand-charcoal/50 rounded-lg">
          <div>
            <h4 className="font-semibold">{challenge.name}</h4>
            <p className="text-sm text-brand-text-secondary">{challenge.description}</p>
          </div>
          <Badge variant="outline" className="text-yellow-400 border-yellow-400">
            <Trophy className="w-3 h-3 mr-1" /> {challenge.xp_reward} XP
          </Badge>
        </div>
      ))}
    </div>
  );
}