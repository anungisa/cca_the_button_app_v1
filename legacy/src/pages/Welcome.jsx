import React, { useState, useEffect } from 'react';
import { User } from '@/api/entities';
import { Button } from '@/components/ui/button';
import { ArrowRight, Star, Users, Trophy, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import YouTubeBackgroundHero from '../components/home/YouTubeBackgroundHero';

const FeatureCard = ({ icon, title, description }) => {
  const Icon = icon;
  return (
    <div className="bg-brand-card-bg/50 backdrop-blur-sm border border-brand-border rounded-xl p-6 text-center hover:bg-brand-card-bg/70 transition-all">
      <div className="w-16 h-16 bg-brand-red text-white rounded-full flex items-center justify-center mx-auto mb-4">
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-xl font-bold text-brand-text-primary mb-2">{title}</h3>
      <p className="text-brand-text-secondary">{description}</p>
    </div>
  );
};

export default function Welcome() {
  return (
    <div className="min-h-screen bg-brand-charcoal text-white">
      {/* YouTube Video Hero - Now Actually Used */}
      <YouTubeBackgroundHero />

      {/* Features Section */}
      <div className="py-24 bg-brand-charcoal">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-base font-semibold leading-7 text-brand-red">Everything Curling</h2>
            <p className="mt-2 text-4xl font-bold tracking-tight text-brand-text-primary">
              One community, one platform
            </p>
            <p className="mt-6 text-lg leading-8 text-brand-text-secondary">
              The Button integrates every part of your curling journey, from finding your first club to tracking high-performance stats.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon={Users}
              title="Find Your Community"
              description="Find and connect with curling clubs across Canada, register for events, and stay up-to-date with your local curling scene."
            />
            <FeatureCard
              icon={Star}
              title="Granite Circle Rewards"
              description="Earn points (XP) for everything you do—from watching live games to volunteering. Redeem your points for exclusive merchandise and experiences."
            />
            <FeatureCard
              icon={Trophy}
              title="Performance Tracking"
              description="For competitive athletes, The Button offers advanced tools like SmartBroom integration and shot tracking to analyze and improve your game."
            />
            <FeatureCard
              icon={Shield}
              title="Safe Sport Commitment"
              description="Access resources, manage your certifications, and find help through our integrated Safe Sport hub, ensuring a safe environment for all."
            />
          </div>
        </div>
      </div>

      {/* Quick Stats Section */}
      <div className="py-16 bg-gradient-to-r from-brand-red/10 to-brand-charcoal">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="backdrop-blur-sm bg-brand-card-bg/30 p-6 rounded-lg border border-brand-border hover:scale-105 transition-transform">
              <div className="text-4xl font-bold text-brand-text-primary mb-2">1M+</div>
              <div className="text-brand-text-secondary">Canadians Curl</div>
            </div>
            <div className="backdrop-blur-sm bg-brand-card-bg/30 p-6 rounded-lg border border-brand-border hover:scale-105 transition-transform">
              <div className="text-4xl font-bold text-brand-text-primary mb-2">700+</div>
              <div className="text-brand-text-secondary">Curling Clubs</div>
            </div>
            <div className="backdrop-blur-sm bg-brand-card-bg/30 p-6 rounded-lg border border-brand-border hover:scale-105 transition-transform">
              <div className="text-4xl font-bold text-brand-text-primary mb-2">1959</div>
              <div className="text-brand-text-secondary">Curling Canada Founded</div>
            </div>
            <div className="backdrop-blur-sm bg-brand-card-bg/30 p-6 rounded-lg border border-brand-border hover:scale-105 transition-transform">
              <div className="text-4xl font-bold text-brand-text-primary mb-2">16th</div>
              <div className="text-brand-text-secondary">Century Origins</div>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="py-24 bg-brand-charcoal">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-brand-text-primary mb-6">
            Ready to Give Curling a Try?
          </h2>
          <p className="text-xl text-brand-text-secondary mb-10">
            Join thousands of Canadians who have discovered the joy of curling.
            Find a Try Curling event near you and experience the sport firsthand.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-brand-red hover:bg-red-700 text-lg px-8 py-6 transform hover:scale-105 transition-all">
              <Link to={createPageUrl('GetInvolvedHub')}>
                Find Try Curling Events
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-brand-border text-brand-text-secondary hover:bg-brand-border text-lg px-8 py-6 transform hover:scale-105 transition-all">
              <Link to={createPageUrl('Clubs')}>
                Find Local Clubs
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slide-up {
          from { 
            opacity: 0; 
            transform: translateY(20px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
        .animate-slide-up {
          animation: slide-up 0.8s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
}