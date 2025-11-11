import React from 'react';
import { motion } from 'framer-motion';

const sponsors = [
  { name: 'PointsBet', logoUrl: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/d6abde363_images.png', href: 'https://on.pointsbet.ca/' },
  { name: 'Montana\'s', logoUrl: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/71d34ac9f_montanas-logo-print-advertising-red.png', href: 'https://www.montanas.ca/' },
  { name: 'Kruger', logoUrl: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6a2e54004_kruger_en.png', href: 'https://www.krugerproducts.ca/en-ca' },
  { name: 'AMJ Campbell', logoUrl: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/a9c521cb9_AMJ_Logo_without_Campbell_CMYK.png', href: 'https://amjmove.com/?fbclid=IwY2xjawLhGMRleHRuA2FlbQIxMABicmlkETFIUGV3TlFNRE5UZVB0bExYAR68Ka9_faxiDhFF2bbLx3d6PrUj8CclQABrHkNlMkiuegZ4XwbEoibanqRoDQ_aem_nzQ0Py04GJG9Pb1uTZUtSw' },
];

export default function SponsorShowcase() {
  return (
    <div className="text-center">
      <h3 className="text-sm font-semibold text-brand-text-secondary uppercase tracking-wider mb-6">
        Our Proud Partners
      </h3>
      <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
        {sponsors.map((sponsor, index) => (
          <motion.a 
            key={sponsor.name}
            href={sponsor.href}
            target="_blank"
            rel="noopener noreferrer"
            className="grayscale hover:grayscale-0 transition-all duration-300 opacity-70 hover:opacity-100"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 0.7, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.15 }}
          >
            <img 
              src={sponsor.logoUrl} 
              alt={`${sponsor.name} logo`}
              className="h-8 md:h-10 object-contain"
            />
          </motion.a>
        ))}
      </div>
    </div>
  );
}