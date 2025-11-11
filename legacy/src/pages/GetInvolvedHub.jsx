
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { Handshake, Gavel, GraduationCap, Users } from 'lucide-react';
import GetInvolvedTile from '../components/GetInvolvedTile';
import PathwayInfoDrawer from '../components/PathwayInfoDrawer';
import { useInvolvementProgress } from '../components/hooks/useInvolvementProgress';
import { useXP } from '../components/XPContext';
// import SponsorShowcase from '../components/home/SponsorShowcase'; // This is now handled by the global layout

const involvementPathways = [
  {
    id: 'volunteer',
    title: 'Volunteer',
    icon: Handshake,
    description: "Support events, help at your local club, and be the backbone of curling in your community.",
    longDescription: "Volunteering is the heart of curling. From helping at tournaments to supporting your local club, volunteers make the sport possible. Join thousands of Canadians who give their time to grow the game.",
    color: 'from-blue-500 to-blue-700',
    cta: 'Find Opportunities',
    xpReward: 50,
    estimatedTime: '2-4 hours/week',
    difficulty: 'beginner',
    participantCount: 15000,
    requirements: [
      'Must be 16+ years old',
      'Complete basic orientation',
      'Available for events'
    ],
    nextSteps: [
      'Complete volunteer application',
      'Attend orientation session',
      'Choose your preferred roles',
      'Get assigned to first event',
      'Complete event feedback'
    ],
    resources: [
      {
        title: 'Volunteer Handbook',
        description: 'Everything you need to know',
        url: '#'
      },
      {
        title: 'Event Calendar',
        description: 'Upcoming opportunities',
        url: '#'
      }
    ]
  },
  {
    id: 'coach',
    title: 'Coach',
    icon: GraduationCap,
    description: "Mentor the next generation of curlers. Access resources and certification pathways.",
    longDescription: "Share your passion and knowledge by becoming a certified coach. Help develop skills, build confidence, and inspire the next generation of curlers through structured learning programs.",
    color: 'from-green-500 to-green-700',
    cta: 'Start Coaching',
    xpReward: 100,
    estimatedTime: '3-6 hours/week',
    difficulty: 'intermediate',
    participantCount: 3500,
    requirements: [
      'Basic curling knowledge',
      'Complete NCCP training',
      'Background check required'
    ],
    nextSteps: [
      'Register for NCCP course',
      'Complete online modules',
      'Attend practical sessions',
      'Pass certification exam',
      'Apply to coach programs'
    ],
    resources: [
      {
        title: 'NCCP Coaching Courses',
        description: 'National certification program',
        url: '#'
      },
      {
        title: 'Coaching Resources',
        description: 'Drills, tips, and techniques',
        url: '#'
      }
    ]
  },
  {
    id: 'official',
    title: 'Official',
    icon: Gavel,
    description: "Ensure fair play and uphold the integrity of the game. Get trained and certified.",
    longDescription: "Officials ensure fair play and maintain the spirit of curling. From local club games to national championships, trained officials are essential for competitive integrity.",
    color: 'from-purple-500 to-purple-700',
    cta: 'Become an Official',
    xpReward: 75,
    estimatedTime: '4-8 hours/month',
    difficulty: 'intermediate',
    participantCount: 1200,
    requirements: [
      'Strong understanding of rules',
      'Complete officials training',
      'Available for competitions'
    ],
    nextSteps: [
      'Study official rulebook',
      'Attend training clinic',
      'Shadow experienced officials',
      'Pass certification exam',
      'Officiate first competition'
    ],
    resources: [
      {
        title: 'Rules of Curling',
        description: 'Complete rulebook',
        url: '#'
      },
      {
        title: 'Officials Training',
        description: 'Certification courses',
        url: '#'
      }
    ]
  },
  {
    id: 'contribute',
    title: 'Contributor',
    icon: Users,
    description: "Use your professional skills to help grow the sport in areas like marketing, tech, and more.",
    longDescription: "Bring your professional expertise to curling. Whether you're in marketing, technology, finance, or other fields, your skills can help grow and modernize the sport.",
    color: 'from-amber-500 to-amber-700',
    cta: 'Offer Your Skills',
    xpReward: 60,
    estimatedTime: '2-5 hours/week',
    difficulty: 'beginner',
    participantCount: 800,
    requirements: [
      'Professional experience in relevant field',
      'Passion for curling growth',
      'Commitment to projects'
    ],
    nextSteps: [
      'Complete skills assessment',
      'Match with suitable projects',
      'Meet with project leaders',
      'Define scope and timeline',
      'Begin contributing'
    ],
    resources: [
      {
        title: 'Skills Database',
        description: 'Match your expertise',
        url: '#'
      },
      {
        title: 'Current Projects',
        description: 'See what needs help',
        url: '#'
      }
    ]
  },
];

export default function GetInvolvedHub() {
  const [selectedPathway, setSelectedPathway] = useState(null);
  const { progress, isLoading, trackPathwayAction } = useInvolvementProgress();
  const { awardPoints, awardBadge } = useXP();

  const safeProgress = Array.isArray(progress) ? progress : [];

  const handleStartPathway = async (pathway) => {
    if (!pathway) return;

    try {
      // Award XP for starting a pathway
      await awardPoints(25, 'pathway_started', `Started ${pathway.title} pathway`);
      
      // Track the pathway action
      await trackPathwayAction(pathway.id, 'pathway_started', `Started ${pathway.title} pathway`, 25);
      
      // Award a badge for getting involved
      await awardBadge('pathway_starter', 'Pathway Starter', 'Started your first involvement pathway');
      
      // Close the drawer
      setSelectedPathway(null);
      
      // Show success message or redirect
      alert(`Welcome to the ${pathway.title} pathway! Check your profile for next steps.`);
      
    } catch (error) {
      console.error('Error starting pathway:', error);
      alert('There was an error starting your pathway. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-brand-charcoal"> {/* Added wrapper div */}
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-brand-text-primary">Find Your Place</h1>
          <p className="text-xl mt-2 text-brand-text-secondary max-w-3xl mx-auto">
            Curling thrives because of people like you. Discover the many ways you can contribute to the sport you love.
          </p>
        </div>
        
        {/* Progress Card */}
        <Card className="bg-brand-card-bg border-brand-border">
          <CardHeader>
            <CardTitle>Your Involvement Journey</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="text-brand-text-secondary">Loading your progress...</p>
            ) : (
              <div className="flex flex-wrap gap-4">
                {safeProgress.map(p => (
                  <Badge key={p.pathway} variant="secondary" className="p-2 text-sm">
                    {p.pathway.charAt(0).toUpperCase() + p.pathway.slice(1)}: <span className="font-bold ml-1">{p.status}</span>
                  </Badge>
                ))}
                {safeProgress.length === 0 && <p className="text-brand-text-secondary">Start a pathway to track your progress here!</p>}
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Pathways Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {involvementPathways.map((pathway) => (
            <GetInvolvedTile 
              key={pathway.id}
              pathway={pathway}
              onClick={() => setSelectedPathway(pathway)}
            />
          ))}
        </div>

        <PathwayInfoDrawer
          pathway={selectedPathway}
          isOpen={!!selectedPathway}
          onClose={() => setSelectedPathway(null)}
          onStartPathway={handleStartPathway}
        />
      </div>
    </div>
  );
}
