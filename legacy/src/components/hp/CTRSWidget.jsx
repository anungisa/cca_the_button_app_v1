import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CTRSRanking } from '@/api/entities';
import { Trophy, TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function CTRSWidget({ category = 'mens', limit = 5 }) {
  const [topRankings, setTopRankings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadTopRankings = useCallback(async () => {
    try {
      const data = await CTRSRanking.filter(
        { category },
        'rank',
        limit
      );
      setTopRankings(data);
    } catch (error) {
      console.error('Error loading CTRS rankings:', error);
    } finally {
      setIsLoading(false);
    }
  }, [category, limit]);

  useEffect(() => {
    loadTopRankings();
  }, [loadTopRankings]);

  if (isLoading) {
    return (
      <Card className="bg-brand-card-bg border-brand-border">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-12 bg-brand-border rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-brand-card-bg border-brand-border">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500" />
            CTRS Top Rankings
          </span>
          <Button asChild variant="ghost" size="sm">
            <Link to={createPageUrl('CTRSRankings')}>
              View All <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {topRankings.length === 0 ? (
          <p className="text-sm text-brand-text-secondary text-center py-4">
            No rankings available
          </p>
        ) : (
          topRankings.map((team, index) => (
            <div key={team.id} className="flex items-center justify-between p-2 rounded hover:bg-brand-charcoal/50">
              <div className="flex items-center gap-3">
                <Badge className={index === 0 ? 'bg-yellow-500' : 'bg-brand-border'}>
                  #{team.rank}
                </Badge>
                <div>
                  <div className="font-semibold text-brand-text-primary text-sm">
                    {team.team_name}
                  </div>
                  <div className="text-xs text-brand-text-secondary">
                    {team.skip_name}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-brand-text-primary">
                  {team.points.toFixed(1)}
                </div>
                {team.previous_rank && team.rank < team.previous_rank && (
                  <div className="flex items-center gap-1 text-green-500 text-xs">
                    <TrendingUp className="w-3 h-3" />
                    +{team.previous_rank - team.rank}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}