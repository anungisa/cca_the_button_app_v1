import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, TrendingUp, HelpCircle } from 'lucide-react';
import { getLiveOdds } from '@/api/functions';
import { useXP } from '@/components/XPContext';
import PredictionModal from './PredictionModal';
import { useToast } from '@/components/hooks/use-toast';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export default function LiveOddsPanel({ game, teams }) {
  const { user } = useXP();
  const { toast } = useToast();
  const [odds, setOdds] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [predictionTarget, setPredictionTarget] = useState(null);

  const fetchOdds = useCallback(async () => {
    if (!game || !game.status || game.status === 'final' || !game.team1 || !game.team2) {
      setOdds(null);
      return;
    }
    setIsLoading(true);
    try {
      const response = await getLiveOdds({
        team1Score: game.team1.total_score || 0,
        team2Score: game.team2.total_score || 0,
        currentEnd: game.current_end || 1,
        team1HasHammer: game.team1.has_hammer || false,
      });

      if (response.data && response.data.success) {
        setOdds(response.data.odds);
      } else {
        throw new Error('Failed to fetch odds from backend.');
      }
    } catch (error) {
      console.error("Error fetching live odds:", error);
      // Don't toast on every failure, could be noisy during game
    } finally {
      setIsLoading(false);
    }
  }, [game]);

  useEffect(() => {
    fetchOdds();
    const interval = setInterval(fetchOdds, 30000); // Refresh odds every 30 seconds
    return () => clearInterval(interval);
  }, [fetchOdds]);

  const handlePredictionClick = (team, teamOdds) => {
    if (!user) {
      toast({ title: 'Please Log In', description: 'You must be logged in to make predictions.', variant: 'destructive' });
      return;
    }
    setPredictionTarget({ team, odds: teamOdds });
    setIsModalOpen(true);
  };

  const handlePredictionMade = () => {
    toast({ title: 'Prediction Locked!', description: 'Your prediction has been recorded. Good luck!' });
    setIsModalOpen(false);
  };

  const OddsButton = ({ team, teamOdds }) => (
    <Button
      variant="outline"
      className="w-full h-auto text-left flex flex-col items-start p-3 border-brand-border hover:bg-brand-red/10 hover:border-brand-red"
      onClick={() => handlePredictionClick(team, teamOdds)}
    >
      <span className="font-semibold text-brand-text-primary">{team.name}</span>
      <div className="flex items-center justify-between w-full mt-1">
        <span className="text-xs text-brand-text-secondary">Win Probability: {Math.round(teamOdds.winProbability * 100)}%</span>
        <span className={`text-lg font-bold ${teamOdds.moneyline > 0 ? 'text-green-400' : 'text-amber-400'}`}>
          {teamOdds.moneyline > 0 ? `+${teamOdds.moneyline}` : teamOdds.moneyline}
        </span>
      </div>
    </Button>
  );

  return (
    <Card className="bg-brand-card-bg border-brand-border">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-brand-red" />
            Live Win Probability
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle className="w-4 h-4 text-brand-text-secondary cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Odds powered by PointsBet. Click to make your prediction!</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {isLoading && !odds ? (
          <div className="flex justify-center items-center h-24">
            <Loader2 className="w-6 h-6 animate-spin text-brand-text-secondary" />
          </div>
        ) : odds && teams.team1 && teams.team2 ? (
          <>
            <OddsButton team={teams.team1} teamOdds={odds.team1} />
            <OddsButton team={teams.team2} teamOdds={odds.team2} />
          </>
        ) : (
          <p className="text-center text-sm text-brand-text-secondary h-24 flex items-center justify-center">
            Live odds will appear here when the game is active.
          </p>
        )}
      </CardContent>
       <CardFooter className="text-xs text-brand-text-muted text-center block">
          Sponsored by PointsBet. For educational and entertainment purposes only.
      </CardFooter>

      {isModalOpen && (
        <PredictionModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          game={game}
          predictionTarget={predictionTarget}
          onPredictionMade={handlePredictionMade}
        />
      )}
    </Card>
  );
}