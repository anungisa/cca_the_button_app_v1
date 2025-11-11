
import React from 'react';
import { User } from '@/api/entities';
import { Button } from '@/components/ui/button';
import { ArrowRight, Star, Users, Trophy, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

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

export default function LandingPage() {
  const handleSignIn = () => {
    // ✅ FIX: Use base44's built-in login redirect
    window.location.href = 'https://base44.app/login?redirect=' + encodeURIComponent(window.location.href);
  };

  return (
    <div className="min-h-screen bg-brand-charcoal text-white">
      {/* Video Background Hero Section */}
      <div className="relative isolate overflow-hidden min-h-screen flex items-center">
        {/* Video Background */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="https://assets.mixkit.co/videos/preview/mixkit-curling-stone-sliding-on-ice-49834-large.mp4" type="video/mp4" />
          {/* Fallback to image if video fails */}
          <img 
            src="https://images.unsplash.com/photo-1620151525692-2b79a54620f4?q=80&w=2070&auto=format&fit=crop" 
            alt="Curling Background"
            className="absolute inset-0 w-full h-full object-cover"
          />
        </video>
        
        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-brand-charcoal/80 via-brand-charcoal/70 to-brand-charcoal/90"></div>

        {/* Hero Content */}
        <div className="relative z-10 mx-auto max-w-4xl px-6 py-32 text-center">
          <div className="flex justify-center mb-8">
            <img
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/7eb979759_Curling-Canada_CMYK.png"
              alt="Curling Canada"
              className="h-20 w-auto drop-shadow-lg"
            />
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-6 drop-shadow-lg">
            Welcome to The Button
          </h1>
          
          <p className="text-xl md:text-2xl leading-8 text-gray-200 mb-10 max-w-3xl mx-auto">
            Your all-in-one digital hub for the Canadian curling community. Connect with clubs, track events, and get rewarded for your passion.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button 
              size="lg" 
              onClick={handleSignIn}
              className="bg-brand-red hover:bg-red-700 text-lg px-8 py-6 shadow-2xl hover:shadow-brand-red/50 transition-all"
            >
              Get Started <ArrowRight className="ml-2 w-6 h-6" />
            </Button>
            <Link to={createPageUrl('AboutCurling')}>
              <Button 
                size="lg" 
                variant="outline" 
                className="text-lg px-8 py-6 bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20"
              >
                Learn More <span aria-hidden="true" className="ml-2">→</span>
              </Button>
            </Link>
          </div>

          {/* Scroll indicator */}
          <div className="mt-16 animate-bounce">
            <svg className="w-6 h-6 mx-auto text-white/70" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
            </svg>
          </div>
        </div>
      </div>

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
            <div className="backdrop-blur-sm bg-brand-card-bg/30 p-6 rounded-lg border border-brand-border">
              <div className="text-4xl font-bold text-brand-text-primary mb-2">1M+</div>
              <div className="text-brand-text-secondary">Canadians Curl</div>
            </div>
            <div className="backdrop-blur-sm bg-brand-card-bg/30 p-6 rounded-lg border border-brand-border">
              <div className="text-4xl font-bold text-brand-text-primary mb-2">700+</div>
              <div className="text-brand-text-secondary">Curling Clubs</div>
            </div>
            <div className="backdrop-blur-sm bg-brand-card-bg/30 p-6 rounded-lg border border-brand-border">
              <div className="text-4xl font-bold text-brand-text-primary mb-2">1959</div>
              <div className="text-brand-text-secondary">Curling Canada Founded</div>
            </div>
            <div className="backdrop-blur-sm bg-brand-card-bg/30 p-6 rounded-lg border border-brand-border">
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
            <Button asChild size="lg" className="bg-brand-red hover:bg-red-700 text-lg px-8 py-6">
              <Link to={createPageUrl('GetInvolvedHub')}>
                Find Try Curling Events
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-brand-border text-brand-text-secondary hover:bg-brand-border text-lg px-8 py-6">
              <Link to={createPageUrl('Clubs')}>
                Find Local Clubs
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
