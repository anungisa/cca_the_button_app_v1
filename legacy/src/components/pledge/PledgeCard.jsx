import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, MapPin, Building, User } from 'lucide-react';
import { motion } from 'framer-motion';

const pledgeTypeLabels = {
  'try_curling': 'Try Curling',
  'volunteer': 'Volunteer at Events',
  'bring_a_friend': 'Bring a Friend',
  'support_ftloc': 'Support FTLOC',
  'become_a_coach': 'Become a Coach',
  'become_an_official': 'Become an Official'
};

const pledgeTypeColors = {
  'try_curling': 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  'volunteer': 'bg-green-500/20 text-green-300 border-green-500/30',
  'bring_a_friend': 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  'support_ftloc': 'bg-red-500/20 text-red-300 border-red-500/30',
  'become_a_coach': 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  'become_an_official': 'bg-gray-500/20 text-gray-300 border-gray-500/30'
};

export default function PledgeCard({ pledge, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
    >
      <Card className="bg-brand-card-bg/80 backdrop-blur-sm border-brand-border hover:bg-brand-card-bg transition-all duration-300">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            {/* Logo/Avatar */}
            <div className="flex-shrink-0">
              {pledge.logo_url ? (
                <img 
                  src={pledge.logo_url} 
                  alt={pledge.pledge_by === 'Organization' ? pledge.organization_name : pledge.name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-brand-border"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-brand-charcoal border-2 border-brand-border flex items-center justify-center">
                  {pledge.pledge_by === 'Organization' ? (
                    <Building className="w-8 h-8 text-brand-text-secondary" />
                  ) : (
                    <User className="w-8 h-8 text-brand-text-secondary" />
                  )}
                </div>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-lg font-semibold text-brand-text-primary">
                    {pledge.pledge_by === 'Organization' ? pledge.organization_name : pledge.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <MapPin className="w-4 h-4 text-brand-text-secondary" />
                    <span className="text-sm text-brand-text-secondary">{pledge.province}</span>
                    {pledge.pledge_by === 'Organization' && (
                      <Badge variant="outline" className="text-xs">
                        Organization
                      </Badge>
                    )}
                  </div>
                </div>
                <Badge className={pledgeTypeColors[pledge.pledge_type] || 'bg-gray-500/20 text-gray-300'}>
                  {pledgeTypeLabels[pledge.pledge_type] || pledge.pledge_type}
                </Badge>
              </div>

              {/* Pledge Statement */}
              <blockquote className="border-l-4 border-brand-red pl-4 mb-3">
                <p className="text-brand-text-primary font-medium italic">
                  "{pledge.pledge_statement}"
                </p>
              </blockquote>

              {/* Reason */}
              {pledge.reason && (
                <p className="text-brand-text-secondary text-sm mb-4">
                  {pledge.reason}
                </p>
              )}

              {/* Media Attachments */}
              {pledge.media_attachments && pledge.media_attachments.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
                  {pledge.media_attachments.slice(0, 4).map((media, index) => (
                    <div key={index} className="aspect-square rounded-lg overflow-hidden">
                      {media.type === 'image' ? (
                        <img 
                          src={media.url} 
                          alt={`Media ${index + 1}`}
                          className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer"
                          onClick={() => window.open(media.url, '_blank')}
                        />
                      ) : (
                        <video 
                          src={media.url}
                          className="w-full h-full object-cover rounded cursor-pointer"
                          onClick={() => window.open(media.url, '_blank')}
                        />
                      )}
                    </div>
                  ))}
                  {pledge.media_attachments.length > 4 && (
                    <div className="aspect-square bg-brand-charcoal/50 rounded-lg flex items-center justify-center">
                      <span className="text-brand-text-secondary text-sm">
                        +{pledge.media_attachments.length - 4} more
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Footer */}
              <div className="flex items-center justify-between">
                <div className="text-xs text-brand-text-secondary">
                  Pledged {new Date(pledge.created_date).toLocaleDateString()}
                </div>
                {pledge.website_url && (
                  <Button variant="outline" size="sm" asChild>
                    <a href={pledge.website_url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-3 h-3 mr-1" />
                      Visit Website
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}