import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Zap, 
  Gift, 
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

export default function RedemptionConfirmModal({ 
  reward, 
  userPoints, 
  isOpen, 
  onConfirm, 
  onCancel 
}) {
  if (!reward) return null;

  const remainingPoints = userPoints - reward.points_cost;

  return (
    <Dialog open={isOpen} onOpenChange={onCancel}>
      <DialogContent className="max-w-md bg-brand-card-bg border-brand-border text-brand-text-primary">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Gift className="w-6 h-6 text-brand-red" />
            Confirm Redemption
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Reward Details */}
          <div className="text-center">
            <h3 className="text-lg font-semibold text-brand-text-primary mb-2">
              {reward.name}
            </h3>
            <Badge variant="outline" className="bg-blue-900/50 text-blue-300 border-blue-800/50">
              {reward.category}
            </Badge>
          </div>

          {/* Points Summary */}
          <div className="bg-brand-charcoal border border-brand-border rounded-lg p-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-brand-text-secondary">Current Points:</span>
              <div className="flex items-center gap-1">
                <Zap className="w-4 h-4 text-amber-400" />
                <span className="font-bold text-brand-text-primary">{userPoints}</span>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-brand-text-secondary">Cost:</span>
              <div className="flex items-center gap-1">
                <Zap className="w-4 h-4 text-red-400" />
                <span className="font-bold text-red-400">-{reward.points_cost}</span>
              </div>
            </div>
            
            <hr className="border-brand-border" />
            
            <div className="flex justify-between items-center">
              <span className="text-brand-text-primary font-semibold">Remaining:</span>
              <div className="flex items-center gap-1">
                <Zap className="w-4 h-4 text-amber-400" />
                <span className="font-bold text-brand-text-primary">{remainingPoints}</span>
              </div>
            </div>
          </div>

          {/* Warning/Success Message */}
          {remainingPoints < 100 && remainingPoints >= 0 && (
            <div className="flex items-center gap-2 p-3 bg-amber-900/30 border border-amber-500/30 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0" />
              <p className="text-sm text-amber-300">
                You'll have less than 100 points remaining after this redemption.
              </p>
            </div>
          )}

          {remainingPoints >= 100 && (
            <div className="flex items-center gap-2 p-3 bg-green-900/30 border border-green-500/30 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
              <p className="text-sm text-green-300">
                Great choice! You'll still have plenty of points left.
              </p>
            </div>
          )}

          {/* Fulfillment Info */}
          <div className="text-sm text-brand-text-secondary">
            {reward.category === 'merch' && (
              <p>Physical items will be shipped to your registered address within 5-7 business days.</p>
            )}
            {reward.category === 'discount' && (
              <p>You'll receive a promo code via email that can be used at checkout.</p>
            )}
            {reward.category === 'experience' && (
              <p>You'll receive detailed instructions and any required tickets via email.</p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            onClick={onCancel}
            className="flex-1 border-brand-border text-brand-text-secondary hover:bg-brand-border"
          >
            Cancel
          </Button>
          <Button 
            onClick={onConfirm}
            className="flex-1 bg-brand-red hover:bg-red-700 text-white"
          >
            <Gift className="w-4 h-4 mr-2" />
            Confirm Redemption
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}