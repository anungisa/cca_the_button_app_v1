
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import {
  Users, Trophy, Building, Globe, Heart, Briefcase, Shield,
  AlertTriangle, CheckCircle, TrendingUp, Zap, Target,
  DollarSign, Map, ArrowLeft, Download, Award, ArrowRight,
  Eye, MessageSquare, BarChart3, Sparkles, Brain, ChevronRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function JourneyMapping() {
  const [selectedStakeholder, setSelectedStakeholder] = useState('fan');
  const [expandedStage, setExpandedStage] = useState(0);

  const stakeholders = [
    { id: 'fan', label: 'Fans', icon: Users, color: 'blue', count: '45K' },
    { id: 'athlete', label: 'Athletes', icon: Trophy, color: 'purple', count: '12K' },
    { id: 'club', label: 'Clubs', icon: Building, color: 'green', count: '1,247' },
    { id: 'ma', label: 'MAs', icon: Shield, color: 'red', count: '14' },
    { id: 'sponsor', label: 'Sponsors', icon: Briefcase, color: 'amber', count: '18' },
    { id: 'international', label: 'International', icon: Globe, color: 'cyan', count: '52 Nations' },
    { id: 'coach', label: 'Coaches', icon: Award, color: 'orange', count: '8,500' },
    { id: 'volunteer', label: 'Volunteers', icon: Heart, color: 'pink', count: '15K' }
  ];

  const journeyData = {
    fan: {
      totalPainRevenue: 1295,
      totalGainValue: 555,
      avgAdoption: 52,
      criticalPains: 3,
      avgConversion: 36,
      stages: [
        {
          name: 'Awareness',
          description: 'Discovery of curling and The Button',
          conversion: 12,
          target: 35,
          touchpoints: [
            { name: 'Social Media', button_role: 'Viral sharing features', status: 'partial', impact: 'medium' },
            { name: 'TV Broadcasts', button_role: 'QR codes for app download', status: 'missing', impact: 'critical' },
            { name: 'Event Attendance', button_role: 'Patch scanning onboarding', status: 'active', impact: 'high' },
            { name: 'Friend Referral', button_role: 'Referral rewards program', status: 'partial', impact: 'medium' }
          ],
          pains: [
            { text: 'No clear entry point from broadcast to app', severity: 'critical', impact: '$350K' },
            { text: 'App discovery relies on word-of-mouth only', severity: 'high', impact: '$150K' },
            { text: 'Don\'t understand rules or value of curling', severity: 'high', impact: '$200K' }
          ],
          gains: [
            { text: 'Patch scanning creates instant engagement hook', value: '$85K', adoption: 67 },
            { text: 'Event-based QR codes capture in-venue traffic', value: '$120K', adoption: 58 },
            { text: 'Social proof from leaderboards drives curiosity', value: '$45K', adoption: 42 }
          ]
        },
        {
          name: 'Onboarding',
          description: 'First app experience and account creation',
          conversion: 68,
          target: 85,
          touchpoints: [
            { name: 'SSO Login', button_role: 'Google/Apple/FB/Microsoft auth', status: 'active', impact: 'high' },
            { name: 'Interest Survey', button_role: 'Personalized onboarding quiz', status: 'active', impact: 'high' },
            { name: 'First Mission', button_role: 'Quick-win XP missions', status: 'active', impact: 'medium' },
            { name: 'Tutorial', button_role: 'Interactive app tour', status: 'partial', impact: 'medium' }
          ],
          pains: [
            { text: 'Complex signup loses casual fans', severity: 'high', impact: '$180K' },
            { text: 'Overwhelming feature set on first login', severity: 'medium', impact: '$65K' },
            { text: 'No immediate value demonstration', severity: 'high', impact: '$95K' }
          ],
          gains: [
            { text: 'SSO reduces friction - 85% use it', value: '$110K', adoption: 85 },
            { text: 'First XP reward creates instant gratification', value: '$75K', adoption: 73 },
            { text: 'Role-based onboarding personalizes experience', value: '$90K', adoption: 68 }
          ]
        },
        {
          name: 'Engagement',
          description: 'Regular app usage and habit formation',
          conversion: 51,
          target: 75,
          touchpoints: [
            { name: 'Live Streaming', button_role: 'Curling+ integration + trivia', status: 'active', impact: 'high' },
            { name: 'Daily Trivia', button_role: 'Trivia Hub with streaks', status: 'active', impact: 'high' },
            { name: 'Event Check-ins', button_role: 'Geo-challenges + patches', status: 'active', impact: 'high' },
            { name: 'Social Feed', button_role: 'Community posts + kudos', status: 'active', impact: 'medium' },
            { name: 'Leaderboards', button_role: 'Club/regional rankings', status: 'active', impact: 'medium' },
            { name: 'Push Notifications', button_role: 'Personalized prompts', status: 'partial', impact: 'high' }
          ],
          pains: [
            { text: 'Limited content between major events', severity: 'high', impact: '$220K' },
            { text: 'No multiscreen second-screen sync for broadcasts', severity: 'critical', impact: '$300K' },
            { text: 'Engagement drops after championships', severity: 'high', impact: '$175K' },
            { text: 'Social features underutilized (low virality)', severity: 'medium', impact: '$120K' }
          ],
          gains: [
            { text: 'Trivia during live games drives 3x engagement', value: '$180K', adoption: 45 },
            { text: 'Patch parties create event attendance spikes', value: '$95K', adoption: 62 },
            { text: 'XP missions keep year-round engagement', value: '$140K', adoption: 51 },
            { text: 'Streaks drive daily app opens (+40%)', value: '$110K', adoption: 38 }
          ]
        },
        {
          name: 'Monetization',
          description: 'Converting engagement to revenue',
          conversion: 8,
          target: 25,
          touchpoints: [
            { name: 'Fan Pass Upsell', button_role: 'In-app subscription prompts', status: 'active', impact: 'critical' },
            { name: 'Reward Store', button_role: 'Point redemption marketplace', status: 'active', impact: 'high' },
            { name: 'Curling+ PPV', button_role: 'Premium streaming access', status: 'active', impact: 'high' },
            { name: 'Shop Integration', button_role: 'Merchandise store', status: 'partial', impact: 'medium' },
            { name: 'FTLOC Donations', button_role: 'One-click donation flow', status: 'active', impact: 'medium' }
          ],
          pains: [
            { text: 'No clear value prop for Fan Pass ($15/mo)', severity: 'critical', impact: '$450K' },
            { text: 'Reward store has limited inventory', severity: 'high', impact: '$170K' },
            { text: 'No tiered subscription options', severity: 'high', impact: '$200K' },
            { text: 'Payment friction at checkout', severity: 'medium', impact: '$85K' }
          ],
          gains: [
            { text: 'Point economy drives reward redemptions', value: '$85K', adoption: 22 },
            { text: 'FTLOC emotional connection converts 18%', value: '$450K', adoption: 18 },
            { text: 'Fan Pass holders engage 5x more', value: '$120K', adoption: 4 },
            { text: 'In-app purchases have low friction', value: '$45K', adoption: 8 }
          ]
        },
        {
          name: 'Loyalty',
          description: 'Retention and lifetime value maximization',
          conversion: 65,
          target: 88,
          touchpoints: [
            { name: 'Tier Progression', button_role: '6-tier loyalty system', status: 'active', impact: 'high' },
            { name: 'Exclusive Perks', button_role: 'VIP rewards + experiences', status: 'partial', impact: 'high' },
            { name: 'Anniversary Rewards', button_role: 'Tenure bonuses', status: 'missing', impact: 'medium' },
            { name: 'Coalition Partners', button_role: 'Scene+/Aeroplan integration', status: 'missing', impact: 'critical' }
          ],
          pains: [
            { text: 'Top tier (Legacy) has limited exclusive value', severity: 'high', impact: '$200K' },
            { text: 'No external coalition partners yet', severity: 'critical', impact: '$600K' },
            { text: 'Churn after 6 months for non-Fan Pass users', severity: 'high', impact: '$150K' },
            { text: 'Limited personalization for long-term users', severity: 'medium', impact: '$75K' }
          ],
          gains: [
            { text: 'Tier system creates aspiration + status', value: '$95K', adoption: 65 },
            { text: 'Badge collection drives completionist behavior', value: '$70K', adoption: 48 },
            { text: 'Club loyalty programs extend LTV', value: '$110K', adoption: 34 },
            { text: 'XP never expires - long-term investment', value: '$60K', adoption: 100 }
          ]
        },
        {
          name: 'Advocacy',
          description: 'Fans become brand ambassadors',
          conversion: 28,
          target: 55,
          touchpoints: [
            { name: 'Social Sharing', button_role: 'Share achievements + badges', status: 'partial', impact: 'high' },
            { name: 'Referral Program', button_role: 'Invite friends for XP', status: 'partial', impact: 'high' },
            { name: 'UGC Creation', button_role: 'Photo/video sharing tools', status: 'missing', impact: 'medium' },
            { name: 'Ambassador Program', button_role: 'Super-fan recognition tier', status: 'missing', impact: 'high' }
          ],
          pains: [
            { text: 'Limited viral sharing mechanics', severity: 'critical', impact: '$350K' },
            { text: 'No TikTok/Instagram story integration', severity: 'high', impact: '$180K' },
            { text: 'Referral rewards not compelling enough', severity: 'medium', impact: '$95K' },
            { text: 'No formal ambassador/influencer program', severity: 'high', impact: '$120K' }
          ],
          gains: [
            { text: 'Organic word-of-mouth drives 35% of new users', value: '$180K', adoption: 35 },
            { text: 'Club champions recruit entire leagues', value: '$140K', adoption: 28 },
            { text: 'Social proof increases conversion by 2.3x', value: '$95K', adoption: 100 },
            { text: 'User testimonials power marketing campaigns', value: '$45K', adoption: 15 }
          ]
        }
      ]
    },
    athlete: {
      totalPainRevenue: 445,
      totalGainValue: 340,
      avgAdoption: 61,
      criticalPains: 1,
      avgConversion: 63,
      stages: [
        {
          name: 'Registration',
          description: 'Athlete enters the system',
          conversion: 78,
          target: 92,
          touchpoints: [
            { name: 'CurlingReg Signup', button_role: 'Auto-sync to create Button profile', status: 'active', impact: 'high' },
            { name: 'Club Affiliation', button_role: 'Connect to home club', status: 'active', impact: 'high' },
            { name: 'Safe Sport Training', button_role: 'Track compliance status', status: 'active', impact: 'critical' },
            { name: 'Profile Creation', button_role: 'Athlete bio + photo', status: 'partial', impact: 'medium' }
          ],
          pains: [
            { text: 'Duplicate data entry across systems', severity: 'high', impact: '$45K' },
            { text: 'CurlingReg sync delays (24h lag)', severity: 'medium', impact: '$25K' },
            { text: 'Athletes don\'t see immediate value', severity: 'high', impact: '$85K' }
          ],
          gains: [
            { text: 'Single sign-on reduces friction', value: '$30K', adoption: 78 },
            { text: 'Safe Sport tracking in one place', value: '$40K', adoption: 100 },
            { text: 'Automatic club connection', value: '$20K', adoption: 82 }
          ]
        },
        {
          name: 'Training & Development',
          description: 'Skill building and performance tracking',
          conversion: 45,
          target: 75,
          touchpoints: [
            { name: 'Smart Broom Sessions', button_role: 'Track sweeping performance', status: 'active', impact: 'high' },
            { name: 'Shot Tracker', button_role: 'Log game/practice shots', status: 'active', impact: 'high' },
            { name: 'Coach Feedback', button_role: 'Receive digital coaching notes', status: 'active', impact: 'high' },
            { name: 'Drill Library', button_role: 'Access training drills + videos', status: 'active', impact: 'medium' }
          ],
          pains: [
            { text: 'Coach adoption of Shot Tracker only 45%', severity: 'critical', impact: '$120K' },
            { text: 'No integration with Dartfish video analysis', severity: 'high', impact: '$75K' },
            { text: 'Data entry burden on coaches during games', severity: 'high', impact: '$95K' }
          ],
          gains: [
            { text: 'Smart Broom provides unique performance data', value: '$140K', adoption: 12 },
            { text: 'Shot tracking creates accountability culture', value: '$85K', adoption: 45 },
            { text: 'AI insights help athletes improve faster', value: '$95K', adoption: 23 }
          ]
        },
        {
          name: 'Competition',
          description: 'Event participation and performance',
          conversion: 72,
          target: 90,
          touchpoints: [
            { name: 'Event Registration', button_role: 'Sync from CurlingReg/TrustEvent', status: 'active', impact: 'high' },
            { name: 'Live Scoring', button_role: 'Real-time game updates', status: 'active', impact: 'high' },
            { name: 'In-Game Stats', button_role: 'Shot-by-shot tracking', status: 'partial', impact: 'high' }
          ],
          pains: [
            { text: 'Manual data entry during high-pressure games', severity: 'high', impact: '$110K' },
            { text: 'No real-time fan engagement during games', severity: 'medium', impact: '$60K' }
          ],
          gains: [
            { text: 'Live scoring brings families/fans into app', value: '$130K', adoption: 72 },
            { text: 'Performance tracking builds athlete portfolios', value: '$85K', adoption: 38 }
          ]
        },
        {
          name: 'Progression',
          description: 'Pathway advancement and recognition',
          conversion: 58,
          target: 82,
          touchpoints: [
            { name: 'HP Pathway Tracking', button_role: 'Visualize progression to national team', status: 'active', impact: 'high' },
            { name: 'Achievement Badges', button_role: 'Celebrate milestones', status: 'active', impact: 'medium' },
            { name: 'CTRS Rankings', button_role: 'Display official rankings', status: 'active', impact: 'medium' }
          ],
          pains: [
            { text: 'HP pathway is opaque - athletes don\'t know how to advance', severity: 'high', impact: '$55K' }
          ],
          gains: [
            { text: 'Clear pathway visualization motivates athletes', value: '$60K', adoption: 58 }
          ]
        }
      ]
    },
    club: {
      totalPainRevenue: 690,
      totalGainValue: 405,
      avgAdoption: 40,
      criticalPains: 2,
      avgConversion: 44,
      stages: [
        {
          name: 'Discovery',
          description: 'Club learns about The Button',
          conversion: 23,
          target: 65,
          touchpoints: [
            { name: 'MA Communication', button_role: 'MA-led rollout communications', status: 'partial', impact: 'high' },
            { name: 'Peer Clubs', button_role: 'See other clubs on leaderboards', status: 'active', impact: 'medium' },
            { name: 'Business Hub Demo', button_role: 'Showcase club analytics value', status: 'active', impact: 'high' },
            { name: 'National Events', button_role: 'Patch parties at championships', status: 'active', impact: 'medium' }
          ],
          pains: [
            { text: 'Clubs don\'t understand ROI of Button adoption', severity: 'critical', impact: '$250K' },
            { text: 'MA adoption varies wildly (12%-89%)', severity: 'high', impact: '$180K' },
            { text: 'No dedicated club onboarding resources', severity: 'high', impact: '$120K' },
            { text: 'Trust deficit - "another new system"', severity: 'high', impact: '$140K' }
          ],
          gains: [
            { text: 'Early adopter clubs see +35% member engagement', value: '$120K', adoption: 23 },
            { text: 'Leaderboards create competitive motivation', value: '$75K', adoption: 67 },
            { text: 'Business Hub provides unique club insights', value: '$95K', adoption: 18 }
          ]
        },
        {
          name: 'Activation',
          description: 'Club sets up and launches Button',
          conversion: 34,
          target: 70,
          touchpoints: [
            { name: 'Club Profile Setup', button_role: 'Create club page + info', status: 'active', impact: 'high' },
            { name: 'Member Invitation', button_role: 'Invite members via email/SMS', status: 'partial', impact: 'high' },
            { name: 'Survey Completion', button_role: 'Annual club survey for benchmarks', status: 'active', impact: 'medium' },
            { name: 'Hero Program Setup', button_role: 'Create club-specific rewards', status: 'partial', impact: 'medium' }
          ],
          pains: [
            { text: 'Complex setup requires tech-savvy volunteer', severity: 'high', impact: '$95K' },
            { text: 'No dedicated onboarding support', severity: 'medium', impact: '$70K' }
          ],
          gains: [
            { text: 'Survey unlocks MA benchmarking insights', value: '$85K', adoption: 34 },
            { text: 'Hero Program creates club differentiation', value: '$60K', adoption: 12 }
          ]
        },
        {
          name: 'Growth',
          description: 'Club drives member engagement',
          conversion: 45,
          target: 75,
          touchpoints: [
            { name: 'Club Leaderboard', button_role: 'Gamify club participation', status: 'active', impact: 'high' },
            { name: 'Event Promotion', button_role: 'Promote learn-to-curl + bonspiels', status: 'partial', impact: 'high' },
            { name: 'Member Analytics', button_role: 'Track member engagement metrics', status: 'active', impact: 'high' }
          ],
          pains: [
            { text: 'No direct communication channel to members in app', severity: 'critical', impact: '$95K' }
          ],
          gains: [
            { text: 'Clubs with active leaderboards retain 22% more members', value: '$115K', adoption: 45 },
            { text: 'Analytics help identify at-risk members', value: '$95K', adoption: 23 }
          ]
        },
        {
          name: 'Retention',
          description: 'Sustaining long-term club success',
          conversion: 56,
          target: 80,
          touchpoints: [
            { name: 'Benchmark Reporting', button_role: 'Compare to regional clubs', status: 'active', impact: 'high' },
            { name: 'Grant Support', button_role: 'Track grant eligibility', status: 'partial', impact: 'medium' },
            { name: 'Best Practices', button_role: 'Access knowledge library', status: 'active', impact: 'medium' }
          ],
          pains: [
            { text: 'No automated grant compliance tracking', severity: 'high', impact: '$50K' }
          ],
          gains: [
            { text: 'Benchmark data drives strategic planning', value: '$30K', adoption: 56 }
          ]
        }
      ]
    },
    ma: {
      totalPainRevenue: 730,
      totalGainValue: 375,
      avgAdoption: 58,
      criticalPains: 2,
      avgConversion: 46,
      stages: [
        {
          name: 'Platform Evaluation',
          description: 'MA evaluates and adopts Button',
          conversion: 34,
          target: 75,
          touchpoints: [
            { name: 'Executive Presentation', button_role: 'Strategic value proposition', status: 'active', impact: 'critical' },
            { name: 'Pilot Program', button_role: 'Test with 3-5 clubs', status: 'partial', impact: 'high' },
            { name: 'ROI Analysis', button_role: 'Show member retention impact', status: 'partial', impact: 'critical' }
          ],
          pains: [
            { text: 'MAs resistant to change (status quo bias)', severity: 'critical', impact: '$400K' },
            { text: 'Limited resources for new system rollout', severity: 'high', impact: '$180K' },
            { text: 'Competing priorities (registration, events)', severity: 'high', impact: '$150K' }
          ],
          gains: [
            { text: 'Pilot MAs (ON, AB) show 67% club adoption', value: '$280K', adoption: 67 },
            { text: 'MAs can offload member communications to app', value: '$95K', adoption: 34 }
          ]
        },
        {
          name: 'Rollout & Scaling',
          description: 'MA drives club and member adoption',
          conversion: 58,
          target: 85,
          touchpoints: [
            { name: 'MA Dashboard', button_role: 'Monitor regional adoption + engagement', status: 'active', impact: 'high' },
            { name: 'Club Support', button_role: 'Provide club activation resources', status: 'partial', impact: 'high' },
            { name: 'Regional Campaigns', button_role: 'Run MA-wide challenges', status: 'missing', impact: 'high' }
          ],
          pains: [
            { text: 'MAs can\'t create custom campaigns for their region', severity: 'high', impact: '$100K' }
          ],
          gains: [
            { text: 'MAs with 60%+ club adoption see +18% member retention', value: '$180K', adoption: 58 }
          ]
        }
      ]
    },
    coach: {
      totalPainRevenue: 335,
      totalGainValue: 170,
      avgAdoption: 49,
      criticalPains: 1,
      avgConversion: 62,
      stages: [
        {
          name: 'Tool Adoption',
          description: 'Coach adopts Shot Tracker and Smart Broom',
          conversion: 45,
          target: 80,
          touchpoints: [
            { name: 'Coach Training', button_role: 'Shot Tracker onboarding', status: 'partial', impact: 'high' },
            { name: 'Team Setup', button_role: 'Add athletes to roster', status: 'active', impact: 'high' },
            { name: 'First Game Log', button_role: 'Log first competition', status: 'active', impact: 'medium' }
          ],
          pains: [
            { text: 'Data entry burden during games', severity: 'critical', impact: '$120K' },
            { text: 'No automated game log templates', severity: 'high', impact: '$85K' },
            { text: 'Limited training on new features', severity: 'medium', impact: '$60K' }
          ],
          gains: [
            { text: 'Shot tracking creates accountability', value: '$85K', adoption: 45 },
            { text: 'XP rewards for logging create habit', value: '$35K', adoption: 58 }
          ]
        },
        {
          name: 'Active Usage',
          description: 'Coach uses tools consistently',
          conversion: 62,
          target: 85,
          touchpoints: [
            { name: 'Performance Reports', button_role: 'Auto-generated athlete insights', status: 'partial', impact: 'high' },
            { name: 'AI Recommendations', button_role: 'Drill suggestions based on data', status: 'partial', impact: 'high' },
            { name: 'Feedback Loop', button_role: 'Share insights with athletes', status: 'active', impact: 'medium' }
          ],
          pains: [
            { text: 'Reports lack actionable insights', severity: 'high', impact: '$70K' }
          ],
          gains: [
            { text: 'AI-powered coaching saves 3 hours/week', value: '$50K', adoption: 23 }
          ]
        }
      ]
    },
    volunteer: {
      totalPainRevenue: 285,
      totalGainValue: 150,
      avgAdoption: 52,
      criticalPains: 1,
      avgConversion: 64,
      stages: [
        {
          name: 'Recruitment',
          description: 'Volunteer signs up for events',
          conversion: 52,
          target: 75,
          touchpoints: [
            { name: 'TrustEvent Integration', button_role: 'Sync volunteer shifts', status: 'active', impact: 'high' },
            { name: 'Volunteer Portal', button_role: 'Browse opportunities', status: 'partial', impact: 'high' },
            { name: 'Background Check', button_role: 'Track Safe Sport compliance', status: 'active', impact: 'critical' }
          ],
          pains: [
            { text: 'No recognition for volunteer hours', severity: 'critical', impact: '$95K' },
            { text: 'Complex sign-up process across multiple systems', severity: 'high', impact: '$120K' },
            { text: 'Limited visibility of available opportunities', severity: 'medium', impact: '$70K' }
          ],
          gains: [
            { text: 'XP rewards drive volunteer retention', value: '$75K', adoption: 52 },
            { text: 'One-click event sign-up', value: '$45K', adoption: 68 }
          ]
        },
        {
          name: 'Retention & Recognition',
          description: 'Keeping volunteers engaged',
          conversion: 64,
          target: 85,
          touchpoints: [
            { name: 'Volunteer Badges', button_role: 'Recognition tiers (Bronze, Silver, Gold)', status: 'active', impact: 'high' },
            { name: 'Hour Tracking', button_role: 'Automatic hour logging', status: 'partial', impact: 'medium' },
            { name: 'Appreciation Events', button_role: 'Track volunteer appreciation activities', status: 'missing', impact: 'medium' }
          ],
          pains: [
            { text: 'No formal recognition program across MAs', severity: 'high', impact: '$50K' }
          ],
          gains: [
            { text: 'Volunteer tier system increases retention 18%', value: '$30K', adoption: 34 }
          ]
        }
      ]
    },
    sponsor: {
      totalPainRevenue: 1230,
      totalGainValue: 600,
      avgAdoption: 49,
      criticalPains: 3,
      avgConversion: 62,
      stages: [
        {
          name: 'Prospecting',
          description: 'Sponsor evaluates partnership',
          conversion: 35,
          target: 70,
          touchpoints: [
            { name: 'Sales Deck', button_role: 'Showcase engagement metrics', status: 'active', impact: 'high' },
            { name: 'Demo Access', button_role: 'Sponsor dashboard preview', status: 'partial', impact: 'high' },
            { name: 'ROI Calculator', button_role: 'Project reach + impressions', status: 'missing', impact: 'critical' },
            { name: 'Case Studies', button_role: 'Existing sponsor success stories', status: 'partial', impact: 'high' }
          ],
          pains: [
            { text: 'Can\'t prove ROI vs traditional sponsorship', severity: 'critical', impact: '$600K' },
            { text: 'No industry benchmarks for digital fan engagement', severity: 'high', impact: '$200K' },
            { text: 'Limited proof points from existing sponsors', severity: 'high', impact: '$180K' }
          ],
          gains: [
            { text: 'Real-time engagement data beats traditional ads', value: '$400K', adoption: 35 },
            { text: 'Sponsor quests create measurable activation', value: '$180K', adoption: 28 },
            { text: 'Demographic data enables targeting', value: '$220K', adoption: 42 }
          ]
        },
        {
          name: 'Activation',
          description: 'Sponsor runs campaigns in Button',
          conversion: 67,
          target: 85,
          touchpoints: [
            { name: 'Sponsor Dashboard', button_role: 'Real-time campaign analytics', status: 'active', impact: 'high' },
            { name: 'Quest Builder', button_role: 'Create branded XP missions', status: 'partial', impact: 'high' },
            { name: 'Reward Sponsorship', button_role: 'Sponsor rewards in marketplace', status: 'active', impact: 'medium' }
          ],
          pains: [
            { text: 'Limited ad formats (mostly quest-based)', severity: 'high', impact: '$350K' },
            { text: 'Campaign setup requires Button staff support', severity: 'medium', impact: '$85K' },
            { text: 'Can\'t A/B test creative or messaging', severity: 'medium', impact: '$95K' }
          ],
          gains: [
            { text: 'Sponsor quests have 67% completion rate', value: '$240K', adoption: 67 },
            { text: 'Real-time reporting beats TV Nielsen data', value: '$180K', adoption: 100 },
            { text: 'Direct attribution to brand lift/sales', value: '$320K', adoption: 45 }
          ]
        },
        {
          name: 'Renewal',
          description: 'Sponsor evaluates partnership value',
          conversion: 85,
          target: 95,
          touchpoints: [
            { name: 'Annual ROI Report', button_role: 'Comprehensive performance report', status: 'active', impact: 'critical' },
            { name: 'Vividata Integration', button_role: 'Industry-standard measurement', status: 'active', impact: 'critical' },
            { name: 'Renewal Pitch', button_role: 'Upsell to higher tier', status: 'partial', impact: 'high' }
          ],
          pains: [
            { text: 'Renewal decisions made without full-year data', severity: 'high', impact: '$100K' }
          ],
          gains: [
            { text: 'Sponsors renewing at 85% rate (industry: 60%)', value: '$500K', adoption: 85 },
            { text: 'Vividata data provides third-party validation', value: '$320K', adoption: 100 }
          ]
        }
      ]
    },
    international: {
      totalPainRevenue: 2150,
      totalGainValue: 270,
      avgAdoption: 15,
      criticalPains: 4,
      avgConversion: 18,
      stages: [
        {
          name: 'Global Awareness',
          description: 'International fans discover Button',
          conversion: 8,
          target: 45,
          touchpoints: [
            { name: 'WCF Championships', button_role: 'QR codes at international events', status: 'missing', impact: 'critical' },
            { name: 'Social Media', button_role: 'Multi-language social content', status: 'missing', impact: 'high' },
            { name: 'Federation Partnerships', button_role: 'White-label for other nations', status: 'missing', impact: 'critical' }
          ],
          pains: [
            { text: 'Button is Canada-only - no international version', severity: 'critical', impact: '$800K' },
            { text: 'No multi-language support (English/French only)', severity: 'high', impact: '$200K' },
            { text: 'International fans can\'t participate in loyalty', severity: 'critical', impact: '$400K' },
            { text: 'No international streaming rights', severity: 'critical', impact: '$350K' }
          ],
          gains: [
            { text: 'Canadian diaspora wants to stay connected', value: '$150K', adoption: 8 },
            { text: 'International fans follow Canadian teams', value: '$120K', adoption: 12 }
          ]
        },
        {
          name: 'Federation Adoption',
          description: 'Other federations adopt Button model',
          conversion: 0,
          target: 30,
          touchpoints: [
            { name: 'WCF Showcase', button_role: 'Present at WCF Congress', status: 'planned', impact: 'critical' },
            { name: 'White-Label Platform', button_role: 'Offer Button as SaaS', status: 'missing', impact: 'critical' },
            { name: 'Bilateral Partnerships', button_role: 'Co-develop with Norway/Sweden/Scotland', status: 'missing', impact: 'high' }
          ],
          pains: [
            { text: 'No revenue model for international licensing', severity: 'critical', impact: '$2M+' },
            { text: 'Platform not architected for multi-tenant', severity: 'critical', impact: '$500K' },
            { text: 'Legal/privacy complexity across jurisdictions', severity: 'high', impact: '$150K' }
          ],
          gains: [
            { text: 'First-mover advantage in digital curling engagement', value: '$1.5M', adoption: 0 },
            { text: 'WCF partnership validates innovation leadership', value: '$400K', adoption: 0 }
          ]
        },
        {
          name: 'Global Scaling',
          description: 'Multi-nation rollout and operations',
          conversion: 0,
          target: 25,
          touchpoints: [
            { name: 'SaaS Infrastructure', button_role: 'Multi-tenant architecture', status: 'missing', impact: 'critical' },
            { name: 'Localization', button_role: '10+ language support', status: 'missing', impact: 'critical' },
            { name: 'Payment Processing', button_role: 'Multi-currency support', status: 'missing', impact: 'high' }
          ],
          pains: [
            { text: 'Technical architecture not ready for scale', severity: 'critical', impact: '$400K' }
          ],
          gains: [
            { text: 'Licensing revenue potential from 52 nations', value: '$2M+', adoption: 0 }
          ]
        }
      ]
    }
  };

  const currentJourney = journeyData[selectedStakeholder];
  const currentStages = currentJourney.stages || [];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Link to={createPageUrl('MonetizationHub')}>
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
          </div>
          <h1 className="text-3xl font-bold text-brand-text-primary flex items-center gap-2">
            <Map className="w-8 h-8 text-brand-red" />
            Stakeholder Journey Mapping
          </h1>
          <p className="text-brand-text-secondary mt-1">
            Visualize stakeholder experiences, identify friction, optimize conversions
          </p>
        </div>
        <Button className="bg-brand-red hover:bg-red-700">
          <Download className="w-4 h-4 mr-2" />
          Export Analysis
        </Button>
      </div>

      {/* Stakeholder Selector */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
        {stakeholders.map((sh) => {
          const Icon = sh.icon;
          const isSelected = selectedStakeholder === sh.id;
          return (
            <button
              key={sh.id}
              onClick={() => {
                setSelectedStakeholder(sh.id);
                setExpandedStage(0);
              }}
              className={`p-4 rounded-lg border-2 transition-all ${
                isSelected
                  ? 'border-brand-red bg-brand-red/10 scale-105'
                  : 'border-brand-border bg-brand-card-bg hover:border-brand-border/50 hover:scale-102'
              }`}
            >
              <Icon className={`w-8 h-8 mx-auto mb-2 transition-colors ${isSelected ? 'text-brand-red' : 'text-brand-text-secondary'}`} />
              <p className="text-sm font-medium text-brand-text-primary">{sh.label}</p>
              <p className="text-xs text-brand-text-secondary">{sh.count}</p>
            </button>
          );
        })}
      </div>

      {/* Journey Overview Metrics */}
      <div className="grid md:grid-cols-5 gap-4">
        <Card className="bg-gradient-to-br from-red-950/30 to-rose-950/30 border-red-500/30">
          <CardContent className="p-6">
            <AlertTriangle className="w-8 h-8 text-red-400 mb-3" />
            <div className="text-3xl font-bold text-brand-text-primary mb-1">
              ${currentJourney.totalPainRevenue}K
            </div>
            <p className="text-sm text-brand-text-secondary">Revenue at Risk</p>
            <Badge className="mt-2 bg-red-500/20 text-red-400 text-xs">
              {currentJourney.criticalPains} critical issues
            </Badge>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-950/30 to-emerald-950/30 border-green-500/30">
          <CardContent className="p-6">
            <TrendingUp className="w-8 h-8 text-green-400 mb-3" />
            <div className="text-3xl font-bold text-brand-text-primary mb-1">
              ${currentJourney.totalGainValue}K
            </div>
            <p className="text-sm text-brand-text-secondary">Realized Value</p>
            <Badge className="mt-2 bg-green-500/20 text-green-400 text-xs">
              Active features
            </Badge>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-950/30 to-cyan-950/30 border-blue-500/30">
          <CardContent className="p-6">
            <Target className="w-8 h-8 text-blue-400 mb-3" />
            <div className="text-3xl font-bold text-brand-text-primary mb-1">
              {currentJourney.avgConversion}%
            </div>
            <p className="text-sm text-brand-text-secondary">Avg Conversion</p>
            <Badge className="mt-2 bg-blue-500/20 text-blue-400 text-xs">
              All stages
            </Badge>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-950/30 to-pink-950/30 border-purple-500/30">
          <CardContent className="p-6">
            <Zap className="w-8 h-8 text-purple-400 mb-3" />
            <div className="text-3xl font-bold text-brand-text-primary mb-1">
              {currentJourney.avgAdoption}%
            </div>
            <p className="text-sm text-brand-text-secondary">Feature Adoption</p>
            <Badge className="mt-2 bg-purple-500/20 text-purple-400 text-xs">
              Touchpoint usage
            </Badge>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-950/30 to-orange-950/30 border-amber-500/30">
          <CardContent className="p-6">
            <Map className="w-8 h-8 text-amber-400 mb-3" />
            <div className="text-3xl font-bold text-brand-text-primary mb-1">
              {currentStages.length || 'N/A'}
            </div>
            <p className="text-sm text-brand-text-secondary">Journey Stages</p>
            <Badge className="mt-2 bg-amber-500/20 text-amber-400 text-xs">
              Mapped touchpoints
            </Badge>
          </CardContent>
        </Card>
      </div>

      <>
        {/* Visual Journey Timeline */}
        <Card className="bg-brand-card-bg border-brand-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Map className="w-5 h-5" />
              {stakeholders.find(s => s.id === selectedStakeholder)?.label} Journey Funnel
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {currentStages.map((stage, idx) => {
                const width = stage.conversion;
                const targetWidth = stage.target;
                const gap = targetWidth - width;
                const totalPainValue = stage.pains.reduce((sum, p) => {
                  return sum + parseInt(p.impact.replace(/[$K,+]/g, '')) || 0;
                }, 0);
                
                return (
                  <div key={idx}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <span className="text-lg font-bold text-brand-red">{idx + 1}</span>
                        <div>
                          <span className="text-sm font-semibold text-brand-text-primary">
                            {stage.name}
                          </span>
                          <p className="text-xs text-brand-text-secondary">{stage.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className="text-sm text-brand-text-primary font-bold">
                            {stage.conversion}% / {stage.target}%
                          </div>
                          {gap > 0 && (
                            <span className="text-xs text-yellow-400">
                              {gap}% gap
                            </span>
                          )}
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setExpandedStage(expandedStage === idx ? null : idx)}
                        >
                          <ChevronRight className={`w-4 h-4 transition-transform ${expandedStage === idx ? 'rotate-90' : ''}`} />
                        </Button>
                      </div>
                    </div>
                    
                    {/* Conversion Bar */}
                    <div className="relative h-12 bg-brand-charcoal/30 rounded-lg overflow-hidden mb-3">
                      <div 
                        className="absolute top-0 bottom-0 w-0.5 bg-green-400/50 z-10"
                        style={{ left: `${targetWidth}%` }}
                      >
                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-xs text-green-400 whitespace-nowrap font-semibold">
                          Target
                        </div>
                      </div>
                      <div 
                        className={`h-full transition-all duration-700 flex items-center justify-between px-4 ${
                          width >= targetWidth ? 'bg-gradient-to-r from-green-500 to-emerald-500' :
                          width >= targetWidth * 0.8 ? 'bg-gradient-to-r from-yellow-500 to-amber-500' :
                          'bg-gradient-to-r from-red-500 to-rose-500'
                        }`}
                        style={{ width: `${width}%` }}
                      >
                        <span className="text-xs font-bold text-white">
                          {stage.conversion}% converting
                        </span>
                        <div className="flex items-center gap-4">
                          <Badge className="bg-white/20 text-white text-xs">
                            {stage.touchpoints.length} touchpoints
                          </Badge>
                          {totalPainValue > 0 && (
                            <Badge className="bg-red-900/50 text-red-200 text-xs">
                              ${totalPainValue}K at risk
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Expanded Details */}
                    {expandedStage === idx && (
                      <div className="mt-4 p-6 bg-brand-charcoal/20 rounded-lg border-2 border-brand-red/30">
                        <Tabs defaultValue="touchpoints">
                          <TabsList className="grid w-full grid-cols-3 mb-4">
                            <TabsTrigger value="touchpoints">
                              <Zap className="w-4 h-4 mr-2" />
                              Touchpoints ({stage.touchpoints.length})
                            </TabsTrigger>
                            <TabsTrigger value="pains">
                              <AlertTriangle className="w-4 h-4 mr-2" />
                              Pains ({stage.pains.length})
                            </TabsTrigger>
                            <TabsTrigger value="gains">
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Gains ({stage.gains.length})
                            </TabsTrigger>
                          </TabsList>

                          <TabsContent value="touchpoints" className="space-y-3">
                            {stage.touchpoints.map((tp, i) => (
                              <div key={i} className="flex items-start gap-4 p-4 bg-brand-card-bg rounded-lg border border-brand-border">
                                <div className="flex-1">
                                  <div className="flex items-center justify-between mb-2">
                                    <h5 className="font-semibold text-brand-text-primary">{tp.name}</h5>
                                    <Badge className={
                                      tp.status === 'active' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                                      tp.status === 'partial' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
                                      'bg-red-500/20 text-red-400 border-red-500/30'
                                    }>
                                      {tp.status}
                                    </Badge>
                                  </div>
                                  <p className="text-sm text-brand-text-secondary mb-2">
                                    <strong>Button Role:</strong> {tp.button_role}
                                  </p>
                                  <Badge className={`text-xs ${
                                    tp.impact === 'critical' ? 'bg-red-500/20 text-red-400' :
                                    tp.impact === 'high' ? 'bg-orange-500/20 text-orange-400' :
                                    'bg-blue-500/20 text-blue-400'
                                  }`}>
                                    {tp.impact} impact
                                  </Badge>
                                </div>
                              </div>
                            ))}
                          </TabsContent>

                          <TabsContent value="pains" className="space-y-3">
                            {stage.pains.map((pain, i) => (
                              <div key={i} className="flex items-start gap-3 p-4 bg-red-500/5 rounded-lg border border-red-500/20">
                                <AlertTriangle className={`w-5 h-5 mt-1 flex-shrink-0 ${
                                  pain.severity === 'critical' ? 'text-red-400' :
                                  pain.severity === 'high' ? 'text-orange-400' :
                                  'text-yellow-400'
                                }`} />
                                <div className="flex-1">
                                  <div className="flex items-start justify-between mb-2">
                                    <p className="text-sm text-brand-text-primary font-medium flex-1">{pain.text}</p>
                                    <Badge className={`ml-3 ${
                                      pain.severity === 'critical' ? 'bg-red-500 text-white' :
                                      pain.severity === 'high' ? 'bg-orange-500 text-white' :
                                      'bg-yellow-500 text-white'
                                    }`}>
                                      {pain.severity}
                                    </Badge>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <DollarSign className="w-4 h-4 text-red-400" />
                                    <span className="text-sm text-red-400 font-bold">
                                      {pain.impact} annual revenue impact
                                    </span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </TabsContent>

                          <TabsContent value="gains" className="space-y-3">
                            {stage.gains.map((gain, i) => (
                              <div key={i} className="flex items-start gap-3 p-4 bg-green-500/5 rounded-lg border border-green-500/20">
                                <CheckCircle className="w-5 h-5 mt-1 text-green-400 flex-shrink-0" />
                                <div className="flex-1">
                                  <div className="flex items-start justify-between mb-2">
                                    <p className="text-sm text-brand-text-primary font-medium flex-1">{gain.text}</p>
                                    <Badge className="ml-3 bg-green-500/20 text-green-400 border-green-500/30">
                                      {gain.adoption}% adoption
                                    </Badge>
                                  </div>
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                      <DollarSign className="w-4 h-4 text-green-400" />
                                      <span className="text-sm text-green-400 font-bold">
                                        {gain.value} annual value
                                      </span>
                                    </div>
                                    <div className="flex-1 ml-4">
                                      <Progress value={gain.adoption} className="h-2" />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </TabsContent>
                        </Tabs>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Opportunity Heatmap */}
        <Card className="bg-brand-card-bg border-brand-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Revenue Impact Heatmap
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              {/* Pain Analysis */}
              <div>
                <h4 className="font-semibold text-brand-text-primary mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-400" />
                  Revenue Leak by Stage
                </h4>
                <div className="space-y-3">
                  {currentStages.map((stage, idx) => {
                    const totalPainValue = stage.pains.reduce((sum, p) => {
                      return sum + (parseInt(p.impact.replace(/[$K,+]/g, '')) || 0);
                    }, 0);
                    const maxPain = 1000;
                    const heatPercent = Math.min((totalPainValue / maxPain) * 100, 100);
                    
                    return (
                      <div key={idx} className="p-3 bg-brand-charcoal/30 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-brand-text-primary">{stage.name}</span>
                          <span className="text-red-400 font-bold text-sm">${totalPainValue}K</span>
                        </div>
                        <div className="h-8 bg-brand-charcoal/50 rounded-lg overflow-hidden">
                          <div 
                            className={`h-full transition-all duration-500 ${
                              heatPercent >= 60 ? 'bg-gradient-to-r from-red-500 to-red-600' :
                              heatPercent >= 30 ? 'bg-gradient-to-r from-orange-500 to-orange-600' :
                              'bg-gradient-to-r from-yellow-500 to-yellow-600'
                            }`}
                            style={{ width: `${heatPercent}%` }}
                          />
                        </div>
                        <div className="flex gap-2 mt-2">
                          {stage.pains.filter(p => p.severity === 'critical').length > 0 && (
                            <Badge className="bg-red-500/20 text-red-400 text-xs">
                              {stage.pains.filter(p => p.severity === 'critical').length} critical
                            </Badge>
                          )}
                          <Badge className="bg-orange-500/20 text-orange-400 text-xs">
                            {stage.pains.filter(p => p.severity === 'high').length} high
                          </Badge>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Gain Analysis */}
              <div>
                <h4 className="font-semibold text-brand-text-primary mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-400" />
                  Value Capture by Stage
                </h4>
                <div className="space-y-3">
                  {currentStages.map((stage, idx) => {
                    const totalGainValue = stage.gains.reduce((sum, g) => {
                      return sum + (parseInt(g.value.replace(/[$K,+]/g, '')) || 0);
                    }, 0);
                    const avgAdoption = Math.round(
                      stage.gains.reduce((sum, g) => sum + g.adoption, 0) / stage.gains.length
                    );
                    const maxGain = 500;
                    const valuePercent = Math.min((totalGainValue / maxGain) * 100, 100);
                    
                    return (
                      <div key={idx} className="p-3 bg-brand-charcoal/30 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-brand-text-primary">{stage.name}</span>
                          <span className="text-green-400 font-bold text-sm">${totalGainValue}K</span>
                        </div>
                        <div className="h-8 bg-brand-charcoal/50 rounded-lg overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-500"
                            style={{ width: `${valuePercent}%` }}
                          />
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">
                            {avgAdoption}% avg adoption
                          </Badge>
                          <span className="text-xs text-brand-text-secondary">
                            {stage.gains.length} value drivers
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Touchpoint Alignment Matrix */}
        <Card className="bg-brand-card-bg border-brand-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Touchpoint Status Matrix
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 bg-green-500/5 rounded-lg border border-green-500/20">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <h4 className="font-semibold text-green-400">Active & Working</h4>
                </div>
                <div className="space-y-2">
                  {currentStages.flatMap(s => s.touchpoints)
                    .filter(tp => tp.status === 'active')
                    .slice(0, 5)
                    .map((tp, i) => (
                      <div key={i} className="text-xs text-brand-text-secondary">
                        • {tp.name}
                      </div>
                    ))}
                </div>
                <div className="mt-3 pt-3 border-t border-green-500/20">
                  <div className="text-2xl font-bold text-green-400">
                    {currentStages.flatMap(s => s.touchpoints).filter(tp => tp.status === 'active').length}
                  </div>
                  <div className="text-xs text-brand-text-secondary">touchpoints live</div>
                </div>
              </div>

              <div className="p-4 bg-yellow-500/5 rounded-lg border border-yellow-500/20">
                <div className="flex items-center gap-2 mb-3">
                  <Eye className="w-5 h-5 text-yellow-400" />
                  <h4 className="font-semibold text-yellow-400">Partial / Needs Work</h4>
                </div>
                <div className="space-y-2">
                  {currentStages.flatMap(s => s.touchpoints)
                    .filter(tp => tp.status === 'partial')
                    .slice(0, 5)
                    .map((tp, i) => (
                      <div key={i} className="text-xs text-brand-text-secondary">
                        • {tp.name}
                      </div>
                    ))}
                </div>
                <div className="mt-3 pt-3 border-t border-yellow-500/20">
                  <div className="text-2xl font-bold text-yellow-400">
                    {currentStages.flatMap(s => s.touchpoints).filter(tp => tp.status === 'partial').length}
                  </div>
                  <div className="text-xs text-brand-text-secondary">needs optimization</div>
                </div>
              </div>

              <div className="p-4 bg-red-500/5 rounded-lg border border-red-500/20">
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="w-5 h-5 text-red-400" />
                  <h4 className="font-semibold text-red-400">Missing / Planned</h4>
                </div>
                <div className="space-y-2">
                  {currentStages.flatMap(s => s.touchpoints)
                    .filter(tp => tp.status === 'missing' || tp.status === 'planned')
                    .slice(0, 5)
                    .map((tp, i) => (
                      <div key={i} className="text-xs text-brand-text-secondary">
                        • {tp.name}
                      </div>
                    ))}
                </div>
                <div className="mt-3 pt-3 border-t border-red-500/20">
                  <div className="text-2xl font-bold text-red-400">
                    {currentStages.flatMap(s => s.touchpoints).filter(tp => tp.status === 'missing' || tp.status === 'planned').length}
                  </div>
                  <div className="text-xs text-brand-text-secondary">opportunities</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </>

      {/* Strategic Insights */}
      <Card className="bg-gradient-to-r from-purple-950/20 to-pink-950/20 border-purple-500/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            Strategic Insights: {stakeholders.find(s => s.id === selectedStakeholder)?.label}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-semibold text-brand-text-primary mb-3 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-400" />
                Critical Priorities
              </h4>
              <div className="space-y-2 text-sm text-brand-text-secondary">
                <p>• {currentJourney.criticalPains} critical pain points identified</p>
                <p>• ${currentJourney.totalPainRevenue}K revenue opportunity at risk</p>
                <p>• Focus on lowest converting stages for quick wins</p>
                <p>• Address friction points blocking growth</p>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-brand-text-primary mb-3 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                What's Working Well
              </h4>
              <div className="space-y-2 text-sm text-brand-text-secondary">
                <p>• ${currentJourney.totalGainValue}K annual value captured</p>
                <p>• {currentJourney.avgAdoption}% average feature adoption</p>
                <p>• Strong retention in high-performing stages</p>
                <p>• User testimonials validate value proposition</p>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-brand-text-primary mb-3 flex items-center gap-2">
                <Zap className="w-4 h-4 text-brand-red" />
                Quick Win Opportunities
              </h4>
              <div className="space-y-2 text-sm text-brand-text-secondary">
                <p>• Optimize high-impact, low-effort touchpoints</p>
                <p>• Reduce onboarding friction by 30%</p>
                <p>• Scale successful engagement tactics</p>
                <p>• Leverage what's already working</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cross-Journey Comparison */}
      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Stakeholder Comparison Matrix
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-brand-border">
                  <th className="text-left p-3 text-brand-text-primary font-semibold">Stakeholder</th>
                  <th className="text-center p-3 text-brand-text-primary font-semibold">Avg Conversion</th>
                  <th className="text-center p-3 text-brand-text-primary font-semibold">Pain Revenue</th>
                  <th className="text-center p-3 text-brand-text-primary font-semibold">Gain Value</th>
                  <th className="text-center p-3 text-brand-text-primary font-semibold">Adoption</th>
                  <th className="text-center p-3 text-brand-text-primary font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {stakeholders.map((sh) => {
                  const data = journeyData[sh.id] || {};
                  const Icon = sh.icon;
                  return (
                    <tr 
                      key={sh.id} 
                      className={`border-b border-brand-border hover:bg-brand-charcoal/20 cursor-pointer transition-colors ${
                        selectedStakeholder === sh.id ? 'bg-brand-red/10' : ''
                      }`}
                      onClick={() => setSelectedStakeholder(sh.id)}
                    >
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <Icon className={`w-4 h-4 text-${sh.color}-400`} />
                          <span className="font-medium text-brand-text-primary">{sh.label}</span>
                        </div>
                      </td>
                      <td className="text-center p-3">
                        <div className="flex flex-col items-center">
                          <span className={`font-bold ${
                            data.avgConversion >= 70 ? 'text-green-400' :
                            data.avgConversion >= 50 ? 'text-yellow-400' :
                            'text-red-400'
                          }`}>
                            {data.avgConversion}%
                          </span>
                          <Progress value={data.avgConversion} className="w-20 h-1 mt-1" />
                        </div>
                      </td>
                      <td className="text-center p-3">
                        <span className="text-red-400 font-bold">${data.totalPainRevenue}K</span>
                      </td>
                      <td className="text-center p-3">
                        <span className="text-green-400 font-bold">${data.totalGainValue}K</span>
                      </td>
                      <td className="text-center p-3">
                        <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                          {data.avgAdoption}%
                        </Badge>
                      </td>
                      <td className="text-center p-3">
                        {data.criticalPains > 0 ? (
                          <Badge className="bg-red-500/20 text-red-400">
                            {data.criticalPains} critical
                          </Badge>
                        ) : (
                          <Badge className="bg-green-500/20 text-green-400">
                            Healthy
                          </Badge>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Action Items CTA */}
      <Card className="bg-gradient-to-r from-brand-red/10 to-purple-500/10 border-brand-red/30">
        <CardContent className="p-8">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-brand-red/20 rounded-full flex items-center justify-center flex-shrink-0">
              <Target className="w-10 h-10 text-brand-red" />
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-brand-text-primary mb-3">
                Journey Optimization Recommendations
              </h3>
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div className="p-3 bg-brand-charcoal/30 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-4 h-4 text-yellow-400" />
                    <span className="font-semibold text-brand-text-primary text-sm">Top Priority</span>
                  </div>
                  <p className="text-xs text-brand-text-secondary">
                    Fix critical touchpoints in {currentStages.find(s => s.conversion < 30)?.name || 'Monetization'} stage 
                    to unlock ${Math.round(currentJourney.totalPainRevenue * 0.4)}K immediate revenue
                  </p>
                </div>
                <div className="p-3 bg-brand-charcoal/30 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-4 h-4 text-green-400" />
                    <span className="font-semibold text-brand-text-primary text-sm">Scale Successes</span>
                  </div>
                  <p className="text-xs text-brand-text-secondary">
                    Double down on high-adoption features to increase value capture by ${Math.round(currentJourney.totalGainValue * 0.3)}K
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button className="bg-brand-red hover:bg-red-700">
                  <Download className="w-4 h-4 mr-2" />
                  Download Full Report
                </Button>
                <Button variant="outline">
                  <Target className="w-4 h-4 mr-2" />
                  View Action Plan
                </Button>
                <Link to={createPageUrl('RevenueOpportunities')}>
                  <Button variant="outline">
                    <DollarSign className="w-4 h-4 mr-2" />
                    See Revenue Opportunities
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
