import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Calendar, MapPin, Play, Heart, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const RecommendedEventsCarousel = ({ events, onEventClick, onFavorite, favorites }) => {
  if (!events || events.length === 0) return null;

  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-4">
        <Star className="w-5 h-5 text-yellow-400" />
        <h2 className="text-xl font-bold text-brand-text-primary">Recommended for You</h2>
      </div>
      
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
        {events.map((event, index) => {
          const totalXP = event.xp_missions?.reduce((sum, mission) => sum + mission.xp, 0) || 0;
          
          return (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex-shrink-0 w-80"
            >
              <Card className="bg-gradient-to-br from-brand-red/10 to-brand-card-bg border-brand-red/30 hover:shadow-lg transition-all duration-300">
                <CardContent className="p-0">
                  {event.promo_image && (
                    <div className="relative h-40 overflow-hidden rounded-t-lg">
                      <img 
                        src={event.promo_image} 
                        alt={event.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-3 left-3">
                        <Badge className={event.status === 'live' ? 'bg-red-600' : 'bg-blue-600'}>
                          {event.status === 'live' ? 'LIVE' : 'FEATURED'}
                        </Badge>
                      </div>
                      <div className="absolute top-3 right-3">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="bg-black/50 text-white hover:bg-black/70"
                          onClick={(e) => {
                            e.stopPropagation();
                            onFavorite(event.id);
                          }}
                        >
                          <Heart className={`w-4 h-4 ${favorites.includes(event.id) ? 'fill-red-500 text-red-500' : ''}`} />
                        </Button>
                      </div>
                    </div>
                  )}
                  
                  <div className="p-4">
                    <h3 className="font-bold text-brand-text-primary text-lg mb-2 cursor-pointer hover:text-brand-red transition-colors" onClick={() => onEventClick(event)}>
                      {event.name}
                    </h3>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-brand-text-secondary">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {new Date(event.start_date).toLocaleDateString('en-CA', {
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm text-brand-text-secondary">
                        <MapPin className="w-4 h-4" />
                        <span>{event.venue?.city}</span>
                      </div>
                      
                      {totalXP > 0 && (
                        <div className="flex items-center gap-2">
                          <Badge className="bg-amber-900/50 text-amber-300 text-xs">
                            <Zap className="w-3 h-3 mr-1" />
                            {totalXP} XP Available
                          </Badge>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex gap-2">
                      {event.status === 'live' && event.livestream_url ? (
                        <Button 
                          className="flex-1 bg-red-600 hover:bg-red-700"
                          onClick={() => window.open(event.livestream_url, '_blank')}
                        >
                          <Play className="w-4 h-4 mr-2" />
                          Watch Live
                        </Button>
                      ) : (
                        <Button 
                          variant="outline" 
                          className="flex-1 border-brand-border"
                          onClick={() => onEventClick(event)}
                        >
                          View Details
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default RecommendedEventsCarousel;