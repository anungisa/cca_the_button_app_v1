
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useXP } from '../components/XPContext';
import { XPEngine } from '../components/xp/XPEngine';
import { Event, PointTransaction } from '@/api/entities';
import { 
  Handshake, 
  QrCode, 
  Clock, 
  MapPin, 
  Calendar,
  CheckCircle,
  Award
} from 'lucide-react';
import SponsorShowcase from '../components/home/SponsorShowcase';

const VolunteerOpportunity = ({ opportunity, onRegister }) => (
  <Card className="bg-brand-card-bg border-brand-border">
    <CardContent className="p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-brand-text-primary">{opportunity.title}</h3>
          <p className="text-brand-text-secondary mb-2">{opportunity.description}</p>
          <div className="flex items-center gap-4 text-sm text-brand-text-secondary">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {opportunity.date}
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {opportunity.location}
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {opportunity.duration}
            </div>
          </div>
        </div>
        <Badge className="bg-brand-red text-white">
          +{opportunity.xp_reward} XP
        </Badge>
      </div>
      <Button 
        onClick={() => onRegister(opportunity)}
        className="w-full bg-brand-red hover:bg-red-700"
      >
        Register to Volunteer
      </Button>
    </CardContent>
  </Card>
);

const QRCheckInPanel = ({ user }) => {
  const [checkInCode, setCheckInCode] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCheckIn = async () => {
    if (!checkInCode.trim()) {
      setFeedback({ type: 'error', message: 'Please enter a check-in code' });
      return;
    }

    setIsProcessing(true);
    setFeedback(null);

    try {
      // Simulate QR code validation and check-in
      const xpAmount = 75; // Base XP for volunteer check-in
      
      await XPEngine.awardXP(user.id, xpAmount, 'volunteer_checkin', {
        checkInCode,
        location: 'Event Location',
        timestamp: new Date().toISOString()
      });

      setFeedback({ 
        type: 'success', 
        message: `Check-in successful! +${xpAmount} XP earned.` 
      });
      setCheckInCode('');

    } catch (error) {
      console.error('Check-in failed:', error);
      setFeedback({ 
        type: 'error', 
        message: error.message || 'Check-in failed. Please try again.' 
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className="bg-brand-card-bg border-brand-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <QrCode className="w-5 h-5 text-brand-red" />
          Volunteer Check-In
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-brand-text-secondary">
          Scan QR codes at volunteer locations to check in and earn XP.
        </p>
        <div className="flex gap-2">
          <Input
            placeholder="Enter check-in code"
            value={checkInCode}
            onChange={(e) => setCheckInCode(e.target.value)}
            className="bg-brand-charcoal border-brand-border text-brand-text-primary"
          />
          <Button 
            onClick={handleCheckIn}
            disabled={isProcessing}
            className="bg-brand-red hover:bg-red-700"
          >
            {isProcessing ? 'Processing...' : 'Check In'}
          </Button>
        </div>
        {feedback && (
          <div className={`flex items-center gap-2 font-medium ${
            feedback.type === 'success' ? 'text-green-400' : 'text-red-400'
          }`}>
            {feedback.type === 'success' ? <CheckCircle className="w-4 h-4" /> : null}
            <span>{feedback.message}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const VolunteerStats = ({ user }) => {
  const [stats, setStats] = useState({
    totalHours: 0,
    eventsHelped: 0,
    xpEarned: 0,
    currentStreak: 0
  });

  useEffect(() => {
    loadVolunteerStats();
  }, [user]);

  const loadVolunteerStats = async () => {
    if (!user) return;
    
    try {
      // Load volunteer-related XP transactions
      const volunteerTransactions = await PointTransaction.filter({
        user_id: user.id,
        transaction_type: 'volunteer'
      });

      const totalXP = volunteerTransactions.reduce((sum, t) => sum + t.points_amount, 0);
      
      setStats({
        totalHours: Math.floor(totalXP / 10), // Estimate: 10 XP per hour
        eventsHelped: volunteerTransactions.length,
        xpEarned: totalXP,
        currentStreak: 3 // Mock data
      });
    } catch (error) {
      console.error('Failed to load volunteer stats:', error);
    }
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Card className="bg-brand-card-bg border-brand-border text-center">
        <CardContent className="p-4">
          <div className="text-2xl font-bold text-brand-red">{stats.totalHours}</div>
          <div className="text-sm text-brand-text-secondary">Hours Volunteered</div>
        </CardContent>
      </Card>
      
      <Card className="bg-brand-card-bg border-brand-border text-center">
        <CardContent className="p-4">
          <div className="text-2xl font-bold text-blue-400">{stats.eventsHelped}</div>
          <div className="text-sm text-brand-text-secondary">Events Helped</div>
        </CardContent>
      </Card>
      
      <Card className="bg-brand-card-bg border-brand-border text-center">
        <CardContent className="p-4">
          <div className="text-2xl font-bold text-amber-400">{stats.xpEarned}</div>
          <div className="text-sm text-brand-text-secondary">XP Earned</div>
        </CardContent>
      </Card>
      
      <Card className="bg-brand-card-bg border-brand-border text-center">
        <CardContent className="p-4">
          <div className="text-2xl font-bold text-green-400">{stats.currentStreak}</div>
          <div className="text-sm text-brand-text-secondary">Event Streak</div>
        </CardContent>
      </Card>
    </div>
  );
};

export default function VolunteerContext() {
  const { user } = useXP();
  const [opportunities] = useState([
    {
      id: 'brier_setup',
      title: 'Brier Setup Crew',
      description: 'Help set up the arena for the Montana Brier championship',
      date: 'March 15, 2024',
      location: 'Calgary, AB',
      duration: '4 hours',
      xp_reward: 200,
      category: 'event_setup'
    },
    {
      id: 'club_tournament',
      title: 'Club Tournament Scoring',
      description: 'Assist with scorekeeping at local club championship',
      date: 'March 22, 2024',
      location: 'Local Curling Club',
      duration: '6 hours',
      xp_reward: 150,
      category: 'scoring'
    },
    {
      id: 'youth_clinic',
      title: 'Youth Learn-to-Curl Assistant',
      description: 'Help coach beginners at youth development clinic',
      date: 'March 30, 2024',
      location: 'Community Center',
      duration: '3 hours',
      xp_reward: 100,
      category: 'coaching'
    }
  ]);

  const handleRegisterOpportunity = async (opportunity) => {
    try {
      // In a real app, this would register the user for the opportunity
      alert(`Registered for "${opportunity.title}"! You'll receive check-in details via email.`);
    } catch (error) {
      alert('Registration failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-brand-charcoal">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-brand-red rounded-lg flex items-center justify-center">
              <Handshake className="w-7 h-7 text-white" />
          </div>
          <div>
              <h1 className="text-3xl font-bold text-brand-text-primary">Volunteer Context</h1>
              <p className="text-brand-text-secondary">Find opportunities, check in, and earn XP for your contributions.</p>
          </div>
        </div>

        {/* Volunteer Stats */}
        <VolunteerStats user={user} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Check-in Panel */}
          <div>
            <QRCheckInPanel user={user} />
          </div>

          {/* Opportunities */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-xl font-semibold text-brand-text-primary">Available Opportunities</h2>
            
            {opportunities.map(opportunity => (
              <VolunteerOpportunity
                key={opportunity.id}
                opportunity={opportunity}
                onRegister={handleRegisterOpportunity}
              />
            ))}
          </div>
        </div>
      </div>
      
      {/* Proud Partners Section */}
      <div className="mt-16 border-t border-brand-border/20 pt-12">
        <SponsorShowcase />
      </div>
    </div>
  );
}
