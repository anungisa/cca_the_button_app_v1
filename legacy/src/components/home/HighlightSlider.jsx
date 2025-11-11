import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

// Mock data for highlights
const highlights = [
  {
    title: 'Brier 2025 Tickets On Sale Now!',
    description: 'Get your tickets for the biggest event in Canadian curling, coming to Kelowna, BC.',
    imageUrl: 'https://images.unsplash.com/photo-1551698347-a85966d82c48?q=80&w=1974&auto=format&fit=crop',
    href: 'Events',
    cta: 'Buy Tickets'
  },
  {
    title: 'New in the Reward Store: Signed Team Jerseys',
    description: 'Redeem your CurlPoints for exclusive signed jerseys from top Canadian teams. Limited stock available!',
    imageUrl: 'https://images.unsplash.com/photo-1628905337223-e1a5b5139f40?q=80&w=2070&auto=format&fit=crop',
    href: 'RewardStore',
    cta: 'Visit Store'
  },
  {
    title: 'Watch the U18 Championships Live',
    description: 'Stream the future stars of curling live on Curling+ all week long.',
    imageUrl: 'https://images.unsplash.com/photo-1628260212284-a8360d536554?q=80&w=2070&auto=format&fit=crop',
    href: 'Streaming',
    cta: 'Watch Now'
  }
];

export default function HighlightSlider() {
  return (
    <div>
      <h2 className="text-xl font-semibold text-brand-text-primary mb-4">Highlights</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {highlights.map((item, index) => (
          <Card key={index} className="bg-brand-card-bg border-brand-border overflow-hidden">
            <img src={item.imageUrl} alt={item.title} className="w-full h-40 object-cover" />
            <CardContent className="p-4">
              <h3 className="font-bold text-lg text-brand-text-primary mb-2">{item.title}</h3>
              <p className="text-sm text-brand-text-secondary mb-4 h-16">{item.description}</p>
              <Link to={createPageUrl(item.href)}>
                <Button className="w-full" variant="outline">
                  {item.cta} <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}