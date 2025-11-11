import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, X, Globe, User, ExternalLink } from 'lucide-react';
import PurchaseButton from '../purchasing/PurchaseButton';
import { useXP } from '../XPContext';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function EventDetailModal({ event, isOpen, onClose }) {
  const { awardPoints } = useXP();

  if (!event) return null;
  
  const handleRegistration = () => {
    if (!event) return [];
    
    return [{
      id: `event_${event.id}`,
      name: `Registration: ${event.name}`,
      category: 'event_ticket',
      amount: (event.registration_fee || 0) * 100,
      metadata: {
        event_id: event.id,
        event_date: event.start_date,
      }
    }];
  };

  const handleRegistrationSuccess = async (purchases) => {
    if (!purchases || purchases.length === 0) {
      console.log(`Free registration for ${event.name}`);
    }
    
    await awardPoints(25, 'event_registration', `Registered for ${event.name}`, event.id);
    alert(`Successfully registered for ${event.name}!`);
    onClose();
  };

  const hasFee = event.registration_fee && event.registration_fee > 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-brand-card-bg border-brand-border text-brand-text-primary max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">{event.name}</DialogTitle>
          <DialogDescription className="text-brand-text-secondary">
            {event.completed ? 'Event Completed' : 'Upcoming Event'}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-brand-text-secondary" />
            <span className="text-sm">
              {new Date(event.start_date).toLocaleDateString()} - {new Date(event.end_date).toLocaleDateString()}
            </span>
          </div>
          {event.venue && (
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-brand-text-secondary" />
              <span className="text-sm">{event.venue.name}, {event.venue.city}</span>
            </div>
          )}
          {event.website && (
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-brand-text-secondary" />
              <a href={event.website} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline text-sm flex items-center gap-1">
                Event Website
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          )}

          {event.description && (
            <p className="text-brand-text-secondary">{event.description}</p>
          )}
        </div>
        
        <div className="mt-6 flex gap-3">
          <Button 
            variant="outline" 
            asChild 
            className="flex-1"
          >
            <Link to={createPageUrl('EventDetails') + `?id=${event.id}`}>
              View Full Details
            </Link>
          </Button>

          {hasFee ? (
            <PurchaseButton
              products={handleRegistration()}
              purchaseType="one_time"
              buttonText={`Register - $${event.registration_fee}`}
              buttonClassName="flex-1 bg-brand-red hover:bg-red-700"
              onSuccess={handleRegistrationSuccess}
              requiresAuth={true}
            >
              <Button className="flex-1 bg-brand-red hover:bg-red-700">
                <User className="w-4 h-4 mr-2" />
                Register - ${event.registration_fee}
              </Button>
            </PurchaseButton>
          ) : (
            <Button 
              className="flex-1 bg-brand-red hover:bg-red-700" 
              onClick={() => handleRegistrationSuccess([])}
            >
              <User className="w-4 h-4 mr-2" />
              Register (Free)
            </Button>
          )}
        </div>

        <Button variant="ghost" size="icon" className="absolute top-4 right-4" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </DialogContent>
    </Dialog>
  );
}