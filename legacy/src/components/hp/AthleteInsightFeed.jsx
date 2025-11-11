import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AIInsight, User } from '@/api/entities';
import AIInsightCard from './AIInsightCard';
import { FlaskConical, ChevronDown, User as UserIcon } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from '@/components/ui/button';

export default function AthleteInsightFeed({ coachId }) {
  const [insights, setInsights] = useState([]);
  const [athletes, setAthletes] = useState([]);
  const [selectedAthlete, setSelectedAthlete] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (coachId) {
      loadAthletesAndInsights();
    }
  }, [coachId]);

  const loadAthletesAndInsights = async () => {
    setIsLoading(true);
    try {
      // In a real app, you'd fetch athletes assigned to this coach
      const allUsers = await User.filter({ performance_tier: { $ne: 'none' } });
      setAthletes(allUsers);
      
      const allInsights = await AIInsight.filter({}, '-created_date', 20);
      setInsights(allInsights);
      
    } catch (error) {
      console.error("Error loading insights for coach:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const filteredInsights = insights.filter(insight => {
    if (selectedAthlete === 'all') return true;
    return insight.athlete_id === selectedAthlete;
  });

  return (
    <Card className="bg-brand-card-bg border-brand-border">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <FlaskConical className="w-5 h-5 text-purple-400" />
          Team's AI Insights
        </CardTitle>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <UserIcon className="w-4 h-4 mr-2" />
              {selectedAthlete === 'all' ? 'All Athletes' : athletes.find(a => a.id === selectedAthlete)?.full_name || 'Select Athlete'}
              <ChevronDown className="w-4 h-4 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuRadioGroup value={selectedAthlete} onValueChange={setSelectedAthlete}>
              <DropdownMenuRadioItem value="all">All Athletes</DropdownMenuRadioItem>
              {athletes.map(athlete => (
                <DropdownMenuRadioItem key={athlete.id} value={athlete.id}>
                  {athlete.full_name}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <p className="text-center text-brand-text-secondary py-4">Loading insights...</p>
        ) : filteredInsights.length > 0 ? (
          filteredInsights.map(insight => <AIInsightCard key={insight.id} insight={insight} />)
        ) : (
          <p className="text-center text-brand-text-secondary py-4">No insights found for the selected athlete. Have them log a session!</p>
        )}
      </CardContent>
    </Card>
  );
}