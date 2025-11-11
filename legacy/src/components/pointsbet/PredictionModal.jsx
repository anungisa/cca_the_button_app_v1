import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { UserPrediction } from '@/api/entities';
import { useXP } from '@/components/XPContext';

export default function PredictionModal({ isOpen, onClose, game, predictionTarget, onPredictionMade }) {
  const { user, awardPoints } = useXP();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!user || !game || !predictionTarget) return;

    setIsSubmitting(true);
    try {
      await UserPrediction.create({
        user_id: user.id,
        game_id: game.id,
        end_number: game.current_end,
        prediction_type: 'game_winner',
        predicted_outcome: predictionTarget.team.name,
        odds_at_prediction: predictionTarget.odds.moneyline,
        prediction_locked_at: new Date().toISOString(),
      });
      
      // Award a small amount of XP for making a prediction
      await awardPoints(5, 'prediction_made', 'Made a game prediction');

      onPredictionMade();
    } catch (error) {
      console.error("Failed to submit prediction:", error);
      // Optionally show a toast message for error
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!predictionTarget) return null;

  const { team, odds } = predictionTarget;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-brand-card-bg border-brand-border text-brand-text-primary">
        <DialogHeader>
          <DialogTitle>Confirm Your Prediction</DialogTitle>
          <DialogDescription>
            You are predicting that <span className="font-bold text-brand-red">{team.name}</span> will win the game.
          </DialogDescription>
        </DialogHeader>
        
        <div className="my-4 p-4 bg-brand-charcoal rounded-lg">
            <div className="flex justify-between items-center">
                <span className="text-brand-text-secondary">Current Odds:</span>
                <span className={`text-2xl font-bold ${odds.moneyline > 0 ? 'text-green-400' : 'text-amber-400'}`}>
                    {odds.moneyline > 0 ? `+${odds.moneyline}` : odds.moneyline}
                </span>
            </div>
            <p className="text-xs text-brand-text-muted mt-1">Win Probability: {Math.round(odds.winProbability * 100)}%</p>
        </div>

        <p className="text-sm text-brand-text-secondary">
          Once submitted, your prediction is locked. You will earn bonus XP if your prediction is correct!
        </p>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={isSubmitting} className="bg-brand-red hover:bg-red-700">
            {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Lock In Prediction
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}