
import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CTRSRanking } from '@/api/entities';
import { TrendingUp, TrendingDown, Minus, Trophy, Users, Calendar, ExternalLink, Info } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function CTRSRankings() {
  const [rankings, setRankings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('mens');

  const loadSampleData = useCallback(() => {
    const sampleData = [
      {
        id: '1',
        team_name: 'Team Gushue',
        skip_name: 'Brad Gushue',
        category: 'mens',
        rank: 1,
        points: 145.5,
        events_played: 8,
        province: 'NL',
        previous_rank: 1,
        season: '2024-2025'
      },
      {
        id: '2',
        team_name: 'Team Edin',
        skip_name: 'Niklas Edin',
        category: 'mens',
        rank: 2,
        points: 138.2,
        events_played: 7,
        province: 'International',
        previous_rank: 3,
        season: '2024-2025'
      },
      {
        id: '3',
        team_name: 'Team Bottcher',
        skip_name: 'Brendan Bottcher',
        category: 'mens',
        rank: 3,
        points: 132.8,
        events_played: 9,
        province: 'AB',
        previous_rank: 2,
        season: '2024-2025'
      }
    ];
    setRankings(sampleData);
  }, []); // Empty dependency array as it doesn't depend on any external state/props

  const loadRankings = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await CTRSRanking.filter(
        { category: selectedCategory },
        'rank',
        50
      );
      setRankings(data);
    } catch (error) {
      console.error('Error loading CTRS rankings:', error);
      loadSampleData();
    } finally {
      setIsLoading(false);
    }
  }, [selectedCategory, loadSampleData]); // Dependencies: selectedCategory and the memoized loadSampleData

  useEffect(() => {
    loadRankings();
  }, [loadRankings]); // Dependency: the memoized loadRankings function

  const getRankChange = (current, previous) => {
    if (!previous || current === previous) {
      return { icon: <Minus className="w-4 h-4" />, color: 'text-gray-400', text: '-' };
    }
    if (current < previous) {
      return { 
        icon: <TrendingUp className="w-4 h-4" />, 
        color: 'text-green-500', 
        text: `+${previous - current}` 
      };
    }
    return { 
      icon: <TrendingDown className="w-4 h-4" />, 
      color: 'text-red-500', 
      text: `-${current - previous}` 
    };
  };

  const getRankBadgeColor = (rank) => {
    if (rank === 1) return 'bg-yellow-500 text-white';
    if (rank === 2) return 'bg-gray-400 text-white';
    if (rank === 3) return 'bg-amber-700 text-white';
    return 'bg-brand-border text-brand-text-primary';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-brand-text-primary flex items-center gap-3">
            <Trophy className="w-8 h-8 text-amber-500" />
            Canadian Team Ranking System
          </h1>
          <p className="text-brand-text-secondary mt-2">
            Official rankings for Canadian curling teams
          </p>
        </div>
        <Button asChild variant="outline">
          <a 
            href="https://www.curling.ca/high-performance/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2"
          >
            Visit Curling.ca <ExternalLink className="w-4 h-4" />
          </a>
        </Button>
      </div>

      {/* Info Alert */}
      <Alert className="bg-blue-950/50 border-blue-800">
        <Info className="h-4 w-4" />
        <AlertDescription>
          The CTRS ranks teams based on their performance in sanctioned events. Rankings are updated regularly based on event results and determine eligibility for national championships and Olympic trials.
        </AlertDescription>
      </Alert>

      {/* Category Tabs */}
      <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
        <TabsList className="grid w-full grid-cols-4 max-w-2xl">
          <TabsTrigger value="mens">Men's</TabsTrigger>
          <TabsTrigger value="womens">Women's</TabsTrigger>
          <TabsTrigger value="mixed_doubles">Mixed Doubles</TabsTrigger>
          <TabsTrigger value="wheelchair">Wheelchair</TabsTrigger>
        </TabsList>

        <TabsContent value={selectedCategory} className="mt-6">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-red mx-auto"></div>
              <p className="text-brand-text-secondary mt-4">Loading rankings...</p>
            </div>
          ) : rankings.length === 0 ? (
            <Card className="bg-brand-card-bg border-brand-border">
              <CardContent className="p-12 text-center">
                <p className="text-brand-text-secondary">No rankings available for this category</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {rankings.map((team) => {
                const rankChange = getRankChange(team.rank, team.previous_rank);
                return (
                  <Card key={team.id} className="bg-brand-card-bg border-brand-border hover:border-brand-red transition-colors">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        {/* Rank Badge */}
                        <Badge className={`${getRankBadgeColor(team.rank)} text-lg font-bold px-3 py-2 min-w-[50px] justify-center`}>
                          #{team.rank}
                        </Badge>

                        {/* Team Info */}
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-brand-text-primary flex items-center gap-2">
                            {team.team_name}
                            {team.province && (
                              <Badge variant="outline" className="text-xs">
                                {team.province}
                              </Badge>
                            )}
                          </h3>
                          <p className="text-sm text-brand-text-secondary">
                            Skip: {team.skip_name}
                          </p>
                        </div>

                        {/* Stats */}
                        <div className="text-right space-y-1">
                          <div className="text-2xl font-bold text-brand-text-primary">
                            {team.points.toFixed(1)}
                          </div>
                          <div className="text-xs text-brand-text-secondary">
                            {team.events_played} events
                          </div>
                        </div>

                        {/* Rank Change */}
                        <div className={`flex items-center gap-1 ${rankChange.color} min-w-[60px] justify-end`}>
                          {rankChange.icon}
                          <span className="font-semibold">{rankChange.text}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Additional Info */}
      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="w-5 h-5" />
            About CTRS Rankings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-brand-text-secondary">
          <p>
            The Canadian Team Ranking System (CTRS) is the official ranking system used by Curling Canada to determine team standings and eligibility for national championships.
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li>Rankings are based on performance at sanctioned curling events</li>
            <li>Points are awarded based on event level and finish position</li>
            <li>Teams must maintain rankings to qualify for major championships</li>
            <li>Rankings are updated after each sanctioned event</li>
          </ul>
          <Button asChild variant="link" className="p-0">
            <a 
              href="https://www.curling.ca/high-performance/ctrs-overview/" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              Learn more about CTRS <ExternalLink className="w-4 h-4 ml-1" />
            </a>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
