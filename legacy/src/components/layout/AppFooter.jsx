import React from 'react';
import SponsorShowcase from '../home/SponsorShowcase';

export default function AppFooter({ showSponsors = true }) {
  if (!showSponsors) return null;

  return (
    <footer className="mt-16 border-t border-brand-border/20 pt-12 pb-8 bg-brand-charcoal">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SponsorShowcase />
      </div>
    </footer>
  );
}