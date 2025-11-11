import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Gift, 
  Sparkles, 
  Trophy,
  Star,
  Zap
} from 'lucide-react';

export default function MysteryBoxCard({ mysteryBox, onClaim, userTier }) {
  const [isOpening, setIsOpening] = useState(false);
  const [isOpened, setIsOpened] = useState(false);
  const [revealedContents, setRevealedContents] = useState([]);

  const canClaim = () => {
    const tierRequirements = mysteryBox.availability?.tier_requirements || [];
    return tierRequirements.length === 0 || tierRequirements.includes(userTier);
  };

  const handleClaim = async () => {
    if (!canClaim()) return;
    
    setIsOpening(true);
    
    // Simulate opening animation
    setTimeout(() => {
      setIsOpening(false);
      setIsOpened(true);
      setRevealedContents(mysteryBox.contents);
      onClaim(mysteryBox);
    }, 2000);
  };

  const getBoxTypeColor = (type) => {
    switch (type) {
      case 'event_special': return 'bg-purple-100 text-purple-800';
      case 'sponsor_box': return 'bg-blue-100 text-blue-800';
      case 'season_finale': return 'bg-amber-100 text-amber-800';
      default: return 'bg-green-100 text-green-800';
    }
  };

  const getRarityColor = (rarity) => {
    switch (rarity) {
      case 'legendary': return 'text-amber-600';
      case 'epic': return 'text-purple-600';
      case 'rare': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  const getRarityIcon = (rarity) => {
    switch (rarity) {
      case 'legendary': return <Star className="w-4 h-4 text-amber-500" />;
      case 'epic': return <Trophy className="w-4 h-4 text-purple-500" />;
      case 'rare': return <Sparkles className="w-4 h-4 text-blue-500" />;
      default: return <Gift className="w-4 h-4 text-gray-500" />;
    }
  };

  if (isOpened) {
    return (
      <Card className="bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-600" />
            Mystery Box Opened!
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <p className="text-sm text-gray-600 mb-4">Here's what you received:</p>
            {revealedContents.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                <div className="flex items-center gap-3">
                  {getRarityIcon(item.rarity)}
                  <div>
                    <p className="font-medium">{item.item_name}</p>
                    <p className={`text-xs ${getRarityColor(item.rarity)}`}>
                      {item.rarity} • {item.item_type}
                    </p>
                  </div>
                </div>
                {item.item_type === 'curl_points' && (
                  <div className="flex items-center gap-1">
                    <Zap className="w-4 h-4 text-amber-500" />
                    <span className="font-bold">+{item.item_value}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200 hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Gift className="w-5 h-5 text-indigo-600" />
              {mysteryBox.name}
            </CardTitle>
            <p className="text-sm text-gray-600 mt-1">{mysteryBox.description}</p>
          </div>
          <Badge className={getBoxTypeColor(mysteryBox.box_type)}>
            {mysteryBox.box_type.replace(/_/g, ' ')}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Sponsor Info */}
          {mysteryBox.sponsor_info && (
            <div className="bg-white rounded-lg p-3 border">
              <div className="flex items-center gap-2 mb-2">
                <img 
                  src={mysteryBox.sponsor_info.sponsor_logo} 
                  alt={mysteryBox.sponsor_info.sponsor_name}
                  className="h-6 object-contain"
                />
                <span className="text-sm font-medium">{mysteryBox.sponsor_info.sponsor_name}</span>
              </div>
              <p className="text-xs text-gray-600">{mysteryBox.sponsor_info.sponsor_message}</p>
            </div>
          )}

          {/* Mystery Contents Preview */}
          <div>
            <p className="text-sm font-medium mb-2">Possible Contents:</p>
            <div className="flex flex-wrap gap-2">
              {mysteryBox.contents.slice(0, 3).map((item, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {item.item_type}
                </Badge>
              ))}
              {mysteryBox.contents.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{mysteryBox.contents.length - 3} more
                </Badge>
              )}
            </div>
          </div>

          {/* Tier Requirements */}
          {mysteryBox.availability?.tier_requirements && (
            <div className="text-xs text-gray-500">
              Required tier: {mysteryBox.availability.tier_requirements.join(', ')}
            </div>
          )}

          {/* Action Button */}
          <Button 
            onClick={handleClaim}
            disabled={!canClaim() || isOpening}
            className={`w-full ${
              canClaim() 
                ? 'bg-indigo-600 hover:bg-indigo-700' 
                : 'bg-gray-400 cursor-not-allowed'
            }`}
          >
            {isOpening ? (
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 animate-spin" />
                Opening...
              </div>
            ) : canClaim() ? (
              'Open Mystery Box'
            ) : (
              'Tier requirement not met'
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}