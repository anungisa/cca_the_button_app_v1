import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Users, Trophy } from 'lucide-react';

export default function ClubGridCard({ 
  club, 
  isHomeClub, 
  onSetHomeClub, 
  onViewDetails, 
  isAffiliationDisabled 
}) {
  const { 
    name, 
    logo_url,
    location, 
    membership_count, 
    ma_region,
    engagement_metrics,
    system_integrations
  } = club;
  
  const metrics = engagement_metrics || {};
  const integrations = system_integrations || {};

  // Count key integrations for a simple summary
  const getIntegrationCount = () => {
    let count = 0;
    if (metrics.ftloc_participating) count++;
    if (metrics.survey_completed) count++;
    if (integrations.smart_coach_enabled) count++;
    if (integrations.interpodia_connected) count++;
    if (integrations.safe_sport_compliant) count++;
    return count;
  };

  const integrationCount = getIntegrationCount();

  return (
    <Card 
      className="bg-brand-card-bg/80 backdrop-blur-sm border-brand-border hover:border-brand-red/50 transition-all duration-300 cursor-pointer"
      onClick={onViewDetails}
    >
      <CardContent className="p-4 space-y-3">
        {/* Header */}
        <div className="text-center">
          {logo_url ? (
            <img 
              src={logo_url} 
              alt={`${name} logo`} 
              className="w-12 h-12 object-cover rounded-lg mx-auto mb-2 border border-brand-border"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          ) : (
            <div className="w-12 h-12 bg-brand-red/20 border border-brand-red/30 rounded-lg mx-auto mb-2 flex items-center justify-center">
              <span className="text-brand-red font-bold text-lg">
                {name.charAt(0)}
              </span>
            </div>
          )}
          
          <h3 className="font-semibold text-brand-text-primary text-sm leading-tight mb-1">
            {name}
          </h3>
          
          <div className="flex items-center justify-center gap-1 text-xs text-brand-text-secondary">
            <MapPin className="w-3 h-3" />
            <span>{location?.city}</span>
          </div>
        </div>

        {/* Stats */}
        <div className="text-center space-y-1">
          <div className="flex items-center justify-center gap-1 text-xs">
            <Users className="w-3 h-3 text-brand-text-secondary" />
            <span className="text-brand-text-primary font-medium">{membership_count || 0}</span>
          </div>
          
          {metrics.xp_total > 0 && (
            <div className="flex items-center justify-center gap-1 text-xs">
              <Trophy className="w-3 h-3 text-amber-400" />
              <span className="text-brand-text-primary">{metrics.xp_total} XP</span>
            </div>
          )}
        </div>

        {/* Integration Summary */}
        {integrationCount > 0 && (
          <div className="text-center">
            <Badge className="bg-brand-red/20 text-brand-red border-brand-red/30 text-xs">
              {integrationCount} Integration{integrationCount !== 1 ? 's' : ''}
            </Badge>
          </div>
        )}

        {/* Home Club Indicator */}
        {isHomeClub && (
          <Badge className="w-full justify-center bg-green-600 text-white">
            Your Club
          </Badge>
        )}
      </CardContent>
    </Card>
  );
}