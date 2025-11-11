import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, TrendingUp, Users, Award, Loader2 } from 'lucide-react';
import { CTRSRanking } from '@/api/entities';
import { syncCTRSData } from '@/api/functions';
import { useToast } from '../hooks/use-toast';

export default function CTRSPanel() {
  const [rankings, setRankings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('mens');
  const { toast } = useToast();

  const loadRankings = useCallback(async () => {
    setLoading(true);
    try {
      const data = await CTRSRanking.filter({ category: selectedCategory }, 'rank', 20);
      setRankings(data);
    } catch (error) {
      console.error('Failed to load CTRS rankings:', error);
      toast({
        variant: 'destructive',
        title: 'Failed to Load Rankings',
        description: error.message
      });
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, toast]);

  useEffect(() => {
    loadRankings();
  }, [loadRankings]);

  const handleSync = async () => {
    setSyncing(true);
    try {
      const response = await syncCTRSData();
      
      if (response && response.data && response.data.success) {
        toast({
          title: 'CTRS Sync Complete',
          description: `✅ ${response.data.summary.teams.created} teams synced`
        });
        await loadRankings();
      } else {
        throw new Error(response.data?.error || 'Sync failed');
      }
    } catch (error) {
      console.error('CTRS sync failed:', error);
      toast({
        variant: 'destructive',
        title: 'Sync Failed',
        description: error.message
      });
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Category Selector */}
      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-brand-red" />
            CTRS Team Rankings
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={handleSync}
            disabled={syncing}
          >
            {syncing ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4 mr-2" />
            )}
            Sync CTRS Data
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Category Tabs */}
          <div className="flex gap-2 flex-wrap">
            {['mens', 'womens', 'mixed_doubles', 'wheelchair'].map((cat) => (
              <Button
                key={cat}
                variant={selectedCategory === cat ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(cat)}
                className={selectedCategory === cat ? 'bg-brand-red' : ''}
              >
                {cat.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </Button>
            ))}
          </div>

          {/* Rankings List */}
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-red mx-auto"></div>
              <p className="text-brand-text-secondary mt-2">Loading CTRS rankings...</p>
            </div>
          ) : rankings.length > 0 ? (
            <div className="space-y-3">
              {rankings.map((team) => (
                <div key={team.id} className="flex items-center justify-between p-3 bg-brand-charcoal/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-brand-red rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {team.rank}
                    </div>
                    <div>
                      <h4 className="font-medium text-brand-text-primary">{team.team_name}</h4>
                      <p className="text-sm text-brand-text-secondary">{team.skip_name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className="bg-blue-600">{team.points} pts</Badge>
                    <p className="text-xs text-brand-text-secondary mt-1">{team.province}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Award className="w-12 h-12 text-brand-text-secondary mx-auto mb-3" />
              <p className="text-brand-text-secondary">No CTRS data available</p>
              <Button onClick={handleSync} variant="outline" size="sm" className="mt-4">
                <RefreshCw className="w-4 h-4 mr-2" />
                Sync Now
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}