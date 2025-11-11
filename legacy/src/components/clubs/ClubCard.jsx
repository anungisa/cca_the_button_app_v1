
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Users, Home, CheckCircle, Eye, RefreshCw, AlertTriangle, Calendar, Trophy, ExternalLink } from 'lucide-react'; // Added ExternalLink

export default function ClubCard({
  club,
  isHomeClub,
  onSetHomeClub,
  onViewDetails,
  isAffiliationDisabled,
  showAdminView = false,
  onResync
}) {
  const {
    name,
    logo_url,
    location,
    membership_count,
    facilities,
    ma_region,
    distance,
    status,
    engagement_metrics,
    system_integrations,
    programs, // Keep programs, even if not used in this specific update area
    website // Destructure website as it will be used
  } = club;

  const clubFacilities = facilities || {};
  const metrics = engagement_metrics || {};
  const integrations = system_integrations || {};

  const formatDistance = (dist) => {
    if (dist === undefined || dist === null) return null;
    if (dist < 1) return `${Math.round(dist * 1000)}m away`;
    return `${dist.toFixed(1)}km away`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-600 text-white';
      case 'pilot': return 'bg-blue-600 text-white';
      case 'featured': return 'bg-amber-600 text-white';
      case 'at_risk': return 'bg-orange-600 text-white';
      case 'inactive': return 'bg-gray-600 text-white';
      case 'suspended': return 'bg-red-600 text-white';
      default: return 'bg-gray-600 text-white';
    }
  };

  const getEngagementRibbon = () => {
    if (metrics.monthly_rank_in_region && metrics.monthly_rank_in_region <= 10) {
      return `Top ${metrics.monthly_rank_in_region} in Region`;
    }
    if (metrics.xp_total > 1000) {
      return 'High Engagement';
    }
    return null;
  };

  const engagementRibbon = getEngagementRibbon();

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
    <Card className="bg-brand-card-bg/80 backdrop-blur-sm border-brand-border hover:border-brand-red/50 transition-all duration-300 flex flex-col relative overflow-hidden">
      {engagementRibbon && (
        <div className="absolute top-0 right-0 bg-brand-red text-white text-xs px-2 py-1 transform rotate-12 translate-x-2 -translate-y-1 z-10">
          {engagementRibbon}
        </div>
      )}

      <CardHeader className="cursor-pointer pb-3" onClick={() => onViewDetails(club)}>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3 flex-1">
            {logo_url && (
              <img
                src={logo_url}
                alt={`${name} logo`}
                className="w-12 h-12 object-cover rounded-lg border border-brand-border"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            )}
            <div className="flex-1">
              <CardTitle className="text-lg font-bold text-brand-text-primary leading-tight">{name}</CardTitle>
              <div className="flex items-center gap-2 text-sm text-brand-text-secondary mt-1">
                <MapPin className="w-4 h-4" />
                <span>{location?.city}, {location?.province}</span>
              </div>
            </div>
          </div>
          {distance !== undefined && (
            <Badge className="bg-green-600 text-white ml-2 text-xs">{formatDistance(distance)}</Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="flex-grow space-y-3 cursor-pointer pt-0" onClick={() => onViewDetails(club)}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-brand-text-secondary" />
            <span className="text-brand-text-primary font-medium">{membership_count || 0} members</span>
          </div>
          <Badge variant="outline" className="border-brand-border text-brand-text-secondary bg-brand-charcoal/50 text-xs">
            {ma_region || 'MA'}
          </Badge>
        </div>

        {/* Simplified Status Summary */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {clubFacilities.num_sheets && (
              <Badge variant="outline" className="border-blue-500/50 text-blue-400 bg-blue-500/10 text-xs">
                {clubFacilities.num_sheets} Sheets
              </Badge>
            )}
          </div>
          {integrationCount > 0 && (
            <Badge className="bg-brand-red/20 text-brand-red border-brand-red/30 text-xs">
              {integrationCount} Integration{integrationCount !== 1 ? 's' : ''}
            </Badge>
          )}
        </div>

        {/* Key Features Only */}
        <div className="flex flex-wrap gap-1">
          {clubFacilities.lounge && (
            <span className="text-xs text-brand-text-secondary">🧼 Lounge</span>
          )}
          {clubFacilities.pro_shop && (
            <span className="text-xs text-brand-text-secondary">🛍️ Pro Shop</span>
          )}
          {clubFacilities.equipment_rental && (
            <span className="text-xs text-brand-text-secondary">🎯 Equipment</span>
          )}
        </div>

        {/* Admin Info - Simplified */}
        {showAdminView && (
          <div className="pt-2 border-t border-brand-border">
            <div className="flex items-center justify-between">
              <Badge className={getStatusColor(status)}>
                {status?.replace('_', ' ') || 'unknown'}
              </Badge>
              {metrics.xp_total > 0 && (
                <div className="flex items-center gap-1 text-xs text-brand-text-secondary">
                  <Trophy className="w-3 h-3" />
                  {metrics.xp_total} XP
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>

      <div className="p-4 pt-0 space-y-2">
        <div className="flex gap-2"> {/* New div to group "View Details" and "Website" buttons */}
          <Button
            size="sm"
            onClick={(e) => {
              e.stopPropagation(); // Prevent card's onClick from firing
              onViewDetails(club);
            }}
            className="flex-1 bg-brand-red text-white hover:bg-red-700"
          >
            <Eye className="w-4 h-4 mr-1" />
            View Details
          </Button>

          {website && (
            <Button
              size="sm"
              variant="outline"
              onClick={(e) => {
                e.stopPropagation(); // Prevent card's onClick from firing
                window.open(website, '_blank');
              }}
              className="flex-1 border-brand-border bg-brand-charcoal/50 hover:bg-brand-charcoal text-brand-text-primary"
            >
              <ExternalLink className="w-4 h-4 mr-1" />
              Website
            </Button>
          )}
        </div>

        {isHomeClub ? (
          <Button disabled className="w-full bg-green-600 text-white">
            <CheckCircle className="w-4 h-4 mr-2" />
            Your Home Club
          </Button>
        ) : (
          <Button
            onClick={(e) => {
              e.stopPropagation(); // Prevent card's onClick from firing
              onSetHomeClub();
            }}
            disabled={isAffiliationDisabled}
            className="w-full bg-brand-red hover:bg-red-700 text-white disabled:bg-gray-600 disabled:cursor-not-allowed"
          >
            <Home className="w-4 h-4 mr-2" />
            Set as Home Club
          </Button>
        )}

        {showAdminView && onResync && (
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation(); // Prevent card's onClick from firing
              onResync();
            }}
            className="w-full border-brand-border bg-brand-charcoal/50 hover:bg-brand-charcoal text-brand-text-primary"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Resync Data
          </Button>
        )}

        {isAffiliationDisabled && !isHomeClub && (
           <p className="text-xs text-center text-brand-text-secondary">Sign in to affiliate.</p>
        )}
      </div>
    </Card>
  );
}
