import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Users, UserPlus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ConnectionButton } from './ConnectionButton';

export const SocialNetworkWidget = ({ compact = false }) => {
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    // Mock suggested connections
    setSuggestions([
      {
        id: '1',
        full_name: 'Sarah Mitchell',
        home_club_name: 'Calgary Curling Club',
        profile_image_url: null
      },
      {
        id: '2', 
        full_name: 'Mike Thompson',
        home_club_name: 'Edmonton Granite Club', 
        profile_image_url: null
      }
    ]);
  }, []);

  if (compact) {
    return (
      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Users className="w-4 h-4 text-brand-red" />
            Connect with Curlers
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {suggestions.slice(0, 2).map(person => (
            <div key={person.id} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Avatar className="w-6 h-6">
                  <AvatarImage src={person.profile_image_url} />
                  <AvatarFallback className="bg-brand-red text-white text-xs">
                    {person.full_name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium text-brand-text-primary">
                    {person.full_name}
                  </p>
                  <p className="text-xs text-brand-text-secondary">
                    {person.home_club_name}
                  </p>
                </div>
              </div>
              <ConnectionButton targetUserId={person.id} size="sm" />
            </div>
          ))}
          
          <Link to={createPageUrl('SocialConnections')}>
            <Button variant="outline" size="sm" className="w-full">
              <UserPlus className="w-4 h-4 mr-2" />
              Find More
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-brand-card-bg border-brand-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5 text-brand-red" />
          Your Network
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {suggestions.map(person => (
          <div key={person.id} className="flex items-center justify-between p-3 bg-brand-charcoal/30 rounded-lg">
            <div className="flex items-center gap-3">
              <Avatar className="w-10 h-10">
                <AvatarImage src={person.profile_image_url} />
                <AvatarFallback className="bg-brand-red text-white">
                  {person.full_name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-brand-text-primary">
                  {person.full_name}
                </p>
                <p className="text-sm text-brand-text-secondary">
                  {person.home_club_name}
                </p>
              </div>
            </div>
            <ConnectionButton targetUserId={person.id} />
          </div>
        ))}
        
        <Link to={createPageUrl('SocialConnections')}>
          <Button variant="outline" className="w-full">
            <UserPlus className="w-4 h-4 mr-2" />
            Discover More Curlers
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};