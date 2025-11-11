
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Heart,
  Users,
  Trophy,
  MapPin,
  Calendar,
  Star,
  ArrowRight,
  PlayCircle
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
// import SponsorShowcase from '../components/home/SponsorShowcase'; // This is now handled by the global layout

export default function AboutCurling() {
  const brandStoryPoints = [
    {
      icon: Heart,
      title: "Passion for the Game",
      description: "Curling is more than a sport—it's a community united by tradition, strategy, and the spirit of fair play."
    },
    {
      icon: Users,
      title: "Welcoming Community",
      description: "From your first Try Curling session to competitive championships, our community welcomes everyone with open arms."
    },
    {
      icon: Trophy,
      title: "Excellence & Growth",
      description: "We support athletes at every level, from recreational players to Olympic champions, fostering continuous improvement."
    },
    {
      icon: Star,
      title: "Canadian Heritage",
      description: "As Canada's national winter sport, curling represents our values of teamwork, respect, and perseverance."
    }
  ];

  const gettingStartedSteps = [
    {
      step: 1,
      title: "Try Curling",
      description: "Experience the sport with a one-hour introduction session",
      icon: PlayCircle,
      color: "bg-blue-500"
    },
    {
      step: 2,
      title: "Find Your Club",
      description: "Connect with a local curling club in your community",
      icon: MapPin,
      color: "bg-green-500"
    },
    {
      step: 3,
      title: "Learn to Curl",
      description: "Join our progressive Learn to Curl programs",
      icon: Trophy,
      color: "bg-purple-500"
    },
    {
      step: 4,
      title: "Join the Community",
      description: "Become part of Canada's curling family",
      icon: Users,
      color: "bg-amber-500"
    }
  ];

  return (
    <div className="min-h-screen bg-brand-charcoal">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex justify-center mb-6">
            <img
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/7eb979759_Curling-Canada_CMYK.png"
              alt="Curling Canada"
              className="h-16 w-auto"
            />
          </div>
          <h1 className="text-5xl font-bold text-brand-text-primary mb-6">
            Welcome to Curling
          </h1>
          <p className="text-xl text-brand-text-secondary max-w-4xl mx-auto leading-relaxed">
            Discover Canada's national winter sport—a game of strategy, skill, and sportsmanship
            that brings people together from coast to coast to coast.
          </p>
        </motion.div>

        {/* Brand Story Section */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-brand-text-primary mb-4">
              More Than a Sport
            </h2>
            <p className="text-lg text-brand-text-secondary max-w-3xl mx-auto">
              Curling embodies the spirit of Canadian winter—bringing communities together through
              shared passion, friendly competition, and lifelong friendships.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {brandStoryPoints.map((point, index) => {
              const IconComponent = point.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                >
                  <Card className="bg-brand-card-bg border-brand-border h-full text-center">
                    <CardContent className="p-6">
                      <div className="w-16 h-16 bg-brand-red rounded-full flex items-center justify-center mx-auto mb-4">
                        <IconComponent className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold text-brand-text-primary mb-3">
                        {point.title}
                      </h3>
                      <p className="text-brand-text-secondary">
                        {point.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Getting Started Section */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-brand-text-primary mb-4">
              Start Your Curling Journey
            </h2>
            <p className="text-lg text-brand-text-secondary max-w-3xl mx-auto">
              Whether you're curious about the sport or ready to join a club,
              we'll guide you every step of the way.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {gettingStartedSteps.map((step, index) => {
              const IconComponent = step.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 * index }}
                  className="relative"
                >
                  <Card className="bg-brand-card-bg border-brand-border h-full">
                    <CardContent className="p-6 text-center">
                      <div className={`w-12 h-12 ${step.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                        <span className="text-white font-bold">{step.step}</span>
                      </div>
                      <div className="w-8 h-8 bg-brand-charcoal rounded-full flex items-center justify-center mx-auto mb-4">
                        <IconComponent className="w-4 h-4 text-brand-red" />
                      </div>
                      <h3 className="text-lg font-semibold text-brand-text-primary mb-3">
                        {step.title}
                      </h3>
                      <p className="text-sm text-brand-text-secondary">
                        {step.description}
                      </p>
                    </CardContent>
                  </Card>
                  {index < gettingStartedSteps.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                      <ArrowRight className="w-6 h-6 text-brand-text-secondary" />
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Quick Facts */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Card className="bg-gradient-to-r from-brand-red/10 to-brand-card-bg border-brand-border">
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
                <div>
                  <div className="text-3xl font-bold text-brand-text-primary mb-2">1M+</div>
                  <div className="text-brand-text-secondary">Canadians Curl</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-brand-text-primary mb-2">700+</div>
                  <div className="text-brand-text-secondary">Curling Clubs</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-brand-text-primary mb-2">1959</div>
                  <div className="text-brand-text-secondary">Curling Canada Founded</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-brand-text-primary mb-2">16th</div>
                  <div className="text-brand-text-secondary">Century Origins</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <Card className="bg-brand-card-bg border-brand-border max-w-2xl mx-auto">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-brand-text-primary mb-4">
                Ready to Give Curling a Try?
              </h3>
              <p className="text-brand-text-secondary mb-6">
                Join thousands of Canadians who have discovered the joy of curling.
                Find a Try Curling event near you and experience the sport firsthand.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild className="bg-brand-red hover:bg-red-700">
                  <Link to={createPageUrl('GetInvolvedHub')}>
                    <PlayCircle className="w-4 h-4 mr-2" />
                    Find Try Curling Events
                  </Link>
                </Button>
                <Button asChild variant="outline" className="border-brand-border text-brand-text-secondary hover:bg-brand-border">
                  <Link to={createPageUrl('Clubs')}>
                    <MapPin className="w-4 h-4 mr-2" />
                    Find Local Clubs
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
      {/* Removed SponsorShowcase as per instructions, as it's now handled by the global layout. */}
    </div>
  );
}
