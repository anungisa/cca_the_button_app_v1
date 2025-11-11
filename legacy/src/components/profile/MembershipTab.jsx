import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, MapPin, Calendar, Star } from 'lucide-react';

export default function MembershipTab({ user }) {
  if (!user) {
    return (
      <Card className="bg-brand-card-bg border-brand-border">
        <CardContent className="p-6 text-center">
          <p className="text-brand-text-secondary">No user data available</p>
        </CardContent>
      </Card>
    );
  }

  const formatUserType = (userType) => {
    if (!userType) return 'Member';
    return userType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    try {
      return new Date(dateString).toLocaleDateString('en-CA', {
        year: 'numeric', month: 'long', day: 'numeric'
      });
    } catch {
      return 'Not specified';
    }
  };

  return (
    <Card className="bg-brand-card-bg border-brand-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5 text-blue-400" />
          Membership Details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-brand-text-secondary">Member Type</p>
            <p className="font-medium text-brand-text-primary">{formatUserType(user.user_type)}</p>
          </div>
          
          <div>
            <p className="text-sm text-brand-text-secondary">Member Since</p>
            <p className="font-medium text-brand-text-primary">{formatDate(user.created_date)}</p>
          </div>

          {user.home_club_name && (
            <div>
              <p className="text-sm text-brand-text-secondary">Home Club</p>
              <p className="font-medium text-brand-text-primary flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {user.home_club_name}
              </p>
            </div>
          )}

          {user.ma_region && (
            <div>
              <p className="text-sm text-brand-text-secondary">Region</p>
              <p className="font-medium text-brand-text-primary">{user.ma_region}</p>
            </div>
          )}

          {user.skill_level && (
            <div>
              <p className="text-sm text-brand-text-secondary">Skill Level</p>
              <Badge variant="outline" className="border-brand-border text-brand-text-primary">
                <Star className="w-3 h-3 mr-1" />
                {formatUserType(user.skill_level)}
              </Badge>
            </div>
          )}

          {user.preferred_position && (
            <div>
              <p className="text-sm text-brand-text-secondary">Preferred Position</p>
              <p className="font-medium text-brand-text-primary">{formatUserType(user.preferred_position)}</p>
            </div>
          )}
        </div>

        {user.club_history && user.club_history.length > 0 && (
          <div>
            <p className="text-sm text-brand-text-secondary mb-2">Club History</p>
            <div className="space-y-2">
              {user.club_history.map((club, index) => (
                <div key={index} className="p-3 bg-brand-charcoal/50 rounded-md">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-brand-text-primary">{club.club_name}</p>
                      {club.position && (
                        <p className="text-sm text-brand-text-secondary">{formatUserType(club.position)}</p>
                      )}
                    </div>
                    <div className="text-right text-sm text-brand-text-secondary">
                      <p>{formatDate(club.start_date)}</p>
                      {club.end_date && <p>to {formatDate(club.end_date)}</p>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}