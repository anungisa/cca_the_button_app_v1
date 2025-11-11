import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  MapPin, Calendar, Play, BarChart2, Heart, Share2, 
  Users, Clock, ExternalLink, Ticket, Zap, Star
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

const EventCard = ({ 
  event, 
  onClick, 
  onFavorite, 
  onShare, 
  isFavorited, 
  user, 
  delay = 0 
}) => {
  const isLive = event.status === 'live';
  const isUpcoming = new Date(event.start_date) > new Date();
  const totalXP = event.xp_missions?.reduce((sum, mission) => sum + mission.xp, 0) || 0;
  
  const getStatusBadge = () => {
    if (isLive) return <Badge className="bg-red-600 text-white">LIVE</Badge>;
    if (isUpcoming) return <Badge className="bg-blue-600 text-white">UPCOMING</Badge>;
    return <Badge className="bg-gray-600 text-white">COMPLETED</Badge>;
  };

  const getPrimaryAction = () => {
    if (isLive && event.livestream_url) {
      return (
        <Button className="w-full bg-red-600 hover:bg-red-700" onClick={() => window.open(event.livestream_url, '_blank')}>
          <Play className="w-4 h-4 mr-2" />
          Watch Live
        </Button>
      );
    }
    
    if (isUpcoming && event.ticket_url) {
      return (
        <Button className="w-full bg-green-600 hover:bg-green-700" onClick={() => window.open(event.ticket_url, '_blank')}>
          <Ticket className="w-4 h-4 mr-2" />
          Get Tickets
        </Button>
      );
    }
    
    if (isUpcoming && event.registration_url) {
      return (
        <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={() => window.open(event.registration_url, '_blank')}>
          <Users className="w-4 h-4 mr-2" />
          Register
        </Button>
      );
    }
    
    if (event.volunteer_url) {
      return (
        <Button className="w-full bg-purple-600 hover:bg-purple-700" onClick={() => window.open(event.volunteer_url, '_blank')}>
          <Heart className="w-4 h-4 mr-2" />
          Volunteer
        </Button>
      );
    }
    
    return (
      <Button 
        variant="outline" 
        className="w-full border-brand-border" 
        asChild
      >
        <Link to={createPageUrl('EventDetails') + `?id=${event.id}`}>
          View Details
        </Link>
      </Button>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="h-full"
    >
      <Card className="bg-brand-card-bg border-brand-border hover:shadow-lg transition-all duration-300 h-full flex flex-col group">
        {/* Event Image/Header */}
        {event.promo_image && (
          <div className="relative h-48 overflow-hidden rounded-t-lg">
            <img 
              src={event.promo_image} 
              alt={event.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute top-4 left-4">
              {getStatusBadge()}
            </div>
            <div className="absolute top-4 right-4 flex gap-2">
              {onFavorite && (
                <Button
                  size="icon"
                  variant="ghost"
                  className="bg-black/50 text-white hover:bg-black/70"
                  onClick={(e) => {
                    e.stopPropagation();
                    onFavorite();
                  }}
                >
                  <Heart className={`w-4 h-4 ${isFavorited ? 'fill-red-500 text-red-500' : ''}`} />
                </Button>
              )}
              {onShare && (
                <Button
                  size="icon"
                  variant="ghost"
                  className="bg-black/50 text-white hover:bg-black/70"
                  onClick={(e) => {
                    e.stopPropagation();
                    onShare();
                  }}
                >
                  <Share2 className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        )}

        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <Link to={createPageUrl('EventDetails') + `?id=${event.id}`}>
                <h3 className="font-bold text-brand-text-primary text-lg leading-tight mb-2 cursor-pointer hover:text-brand-red transition-colors">
                  {event.name}
                </h3>
              </Link>
              
              <div className="flex flex-wrap gap-2 mb-3">
                {event.tags?.slice(0, 2).map(tag => (
                  <Badge key={tag} variant="outline" className="text-xs border-brand-border text-brand-text-secondary">
                    {tag}
                  </Badge>
                ))}
                {totalXP > 0 && (
                  <Badge className="bg-amber-900/50 text-amber-300 text-xs">
                    <Zap className="w-3 h-3 mr-1" />
                    {totalXP} XP
                  </Badge>
                )}
              </div>
            </div>
            {event.is_featured && (
              <Star className="w-5 h-5 text-yellow-400 flex-shrink-0" />
            )}
          </div>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col">
          <p className="text-brand-text-secondary text-sm mb-4 line-clamp-2">
            {event.description}
          </p>

          {/* Event Details */}
          <div className="space-y-2 mb-4 flex-1">
            <div className="flex items-center gap-2 text-sm text-brand-text-secondary">
              <Calendar className="w-4 h-4" />
              <span>
                {new Date(event.start_date).toLocaleDateString('en-CA', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}
                {event.start_date !== event.end_date && (
                  <span> - {new Date(event.end_date).toLocaleDateString('en-CA', {
                    month: 'short',
                    day: 'numeric'
                  })}</span>
                )}
              </span>
            </div>
            
            {event.venue && (
              <div className="flex items-center gap-2 text-sm text-brand-text-secondary">
                <MapPin className="w-4 h-4" />
                <span>{event.venue.name}, {event.venue.city}</span>
              </div>
            )}

            {event.attendance_count && (
              <div className="flex items-center gap-2 text-sm text-brand-text-secondary">
                <Users className="w-4 h-4" />
                <span>{event.attendance_count.toLocaleString()} attending</span>
              </div>
            )}

            {event.cost && (
              <div className="flex items-center gap-2 text-sm text-brand-text-secondary">
                <Ticket className="w-4 h-4" />
                <span>{event.cost}</span>
              </div>
            )}
          </div>

          {/* Sponsor Badges */}
          {event.sponsors && event.sponsors.length > 0 && (
            <div className="mb-4">
              <p className="text-xs text-brand-text-secondary mb-2">Presented by:</p>
              <div className="flex flex-wrap gap-1">
                {event.sponsors.slice(0, 2).map(sponsor => (
                  <Badge key={sponsor} variant="outline" className="text-xs border-brand-border text-brand-text-secondary">
                    {sponsor}
                  </Badge>
                ))}
                {event.sponsors.length > 2 && (
                  <Badge variant="outline" className="text-xs border-brand-border text-brand-text-secondary">
                    +{event.sponsors.length - 2} more
                  </Badge>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-2 mt-auto">
            {getPrimaryAction()}
            
            <div className="flex gap-2">
              {(isLive || !isUpcoming) && (
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 border-brand-border"
                  asChild
                >
                  <Link to={createPageUrl('EventDetails') + `?id=${event.id}`}>
                    <BarChart2 className="w-4 h-4 mr-2" />
                    View Scores
                  </Link>
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                className="flex-1 border-brand-border"
                asChild
              >
                <Link to={createPageUrl('EventDetails') + `?id=${event.id}`}>
                  More Details
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default EventCard;