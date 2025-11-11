
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Trophy, Users, Target, Activity, TrendingUp, 
  Calendar, BookOpen, MapPin, Award, Zap, BarChart3, Settings
} from 'lucide-react';
import { usePermissions } from '../components/hooks/usePermissions';
import { createPageUrl } from '@/utils';
import { Link } from 'react-router-dom';
import HubCard from '../components/staffhq/HubCard';

const HPTileCard = ({ title, description, icon: Icon, href, badge, color = "blue" }) => (
  <Link to={createPageUrl(href)}>
    <Card className="bg-brand-card-bg border-brand-border hover:border-brand-red hover:shadow-lg transition-all duration-300 cursor-pointer h-full">
      <CardHeader>
        <div className="flex items-start justify-between mb-2">
          <div className={`p-3 rounded-lg bg-${color}-500/10`}>
            <Icon className={`w-6 h-6 text-${color}-500`} />
          </div>
          {badge && (
            <Badge variant="secondary" className="text-xs">
              {badge}
            </Badge>
          )}
        </div>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-brand-text-secondary">
          {description}
        </CardDescription>
      </CardContent>
    </Card>
  </Link>
);

export default function HighPerformanceHub() {
  const { permissions } = usePermissions();

  const athleteTools = [
    {
      title: 'Performance Center',
      description: 'Track your training, analyze your game, and monitor your progress',
      icon: Activity,
      href: 'PerformanceCenter',
      color: 'red'
    },
    {
      title: 'Smart Broom',
      description: 'Connect your Smart Broom and analyze sweeping performance',
      icon: Zap,
      href: 'SmartBroomHub',
      color: 'purple'
    },
    {
      title: 'My Training Calendar',
      description: 'View your training schedule, camps, and competitions',
      icon: Calendar,
      href: 'PersonalCalendar',
      color: 'blue'
    }
  ];

  const nationalTeamResources = [
    {
      title: 'National Teams',
      description: 'View current national team rosters and athlete profiles',
      icon: Trophy,
      href: 'NationalTeams',
      badge: 'Updated', // Changed from 'New' to 'Updated'
      color: 'yellow'
    },
    {
      title: 'HP Centers',
      description: 'Training centers across Canada with world-class facilities',
      icon: MapPin,
      href: 'HPCenters',
      color: 'green'
    },
    {
      title: 'NextGen Program',
      description: 'Development pathway for emerging elite athletes',
      icon: TrendingUp,
      href: 'NextGenProgram',
      color: 'indigo'
    }
  ];

  const coachingTools = [
    {
      title: 'Coach Dashboard',
      description: 'Manage your athletes, log drills, and provide feedback',
      icon: Users,
      href: 'CoachDashboard',
      color: 'blue'
    },
    {
      title: 'Drill Library',
      description: 'Access and assign drills from the national library',
      icon: BookOpen,
      href: 'DrillLibraryManager',
      color: 'purple'
    },
    {
      title: 'Shot Tracker',
      description: 'Log and analyze athlete shot performance',
      icon: Target,
      href: 'ShotTracker',
      color: 'orange'
    }
  ];

  const staffTools = [
    {
      title: 'HP Analytics',
      description: 'System-wide performance analytics and talent identification',
      icon: BarChart3,
      href: 'HPAnalyticsDashboard',
      color: 'cyan'
    },
    {
      title: 'Team Selection',
      description: 'Manage team selection process and criteria',
      icon: Award,
      href: 'TeamSelection',
      color: 'amber'
    },
    {
      title: 'HP Management',
      description: 'Administer HP programs, centers, and staff',
      icon: Settings,
      href: 'HPManagement',
      color: 'slate'
    }
  ];

  return (
    <div className="min-h-screen bg-brand-charcoal p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <Trophy className="w-12 h-12 text-brand-red" />
            <h1 className="text-4xl font-bold text-brand-text-primary">
              High Performance
            </h1>
          </div>
          <p className="text-lg text-brand-text-secondary max-w-2xl mx-auto">
            Supporting Canada's elite athletes on their journey to excellence
          </p>
        </div>

        {/* National Teams & Resources */}
        <div>
          <h2 className="text-2xl font-bold text-brand-text-primary mb-4 flex items-center gap-2">
            <Trophy className="w-6 h-6 text-brand-red" />
            National Teams & Programs
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {nationalTeamResources.map((tool, index) => (
              <HPTileCard key={index} {...tool} />
            ))}
          </div>
        </div>

        {/* Athlete Tools */}
        <div>
          <h2 className="text-2xl font-bold text-brand-text-primary mb-4 flex items-center gap-2">
            <Activity className="w-6 h-6 text-brand-red" />
            Athlete Tools
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {athleteTools.map((tool, index) => (
              <HPTileCard key={index} {...tool} />
            ))}
          </div>
        </div>

        {/* Coaching Tools */}
        {permissions.canAccessHP && (
          <div>
            <h2 className="text-2xl font-bold text-brand-text-primary mb-4 flex items-center gap-2">
              <Users className="w-6 h-6 text-brand-red" />
              Coaching Tools
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {coachingTools.map((tool, index) => (
                <HPTileCard key={index} {...tool} />
              ))}
            </div>
          </div>
        )}

        {/* Staff Tools */}
        {permissions.canAccessStaffHQ && (
          <div>
            <h2 className="text-2xl font-bold text-brand-text-primary mb-4 flex items-center gap-2">
              <Settings className="w-6 h-6 text-brand-red" />
              HP Administration
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {staffTools.map((tool, index) => (
                <HPTileCard key={index} {...tool} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
