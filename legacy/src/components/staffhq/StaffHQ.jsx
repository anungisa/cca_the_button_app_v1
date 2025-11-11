
import React from 'react';
import HubCard from './HubCard';
import {
  Briefcase,
  Users,
  PieChart,
  Target,
  FileText,
  Shield,
  Heart,
  Calendar,
  DollarSign,
  Megaphone,
  BookOpen,
  Settings,
  ClipboardList,
  Trophy // Added Trophy icon for Competition Management Hub
} from 'lucide-react';
import CompetitionManagementHub from './CompetitionManagementHub'; // Added as per outline instructions
import EventsHub from './EventsHub'; // Added for Events Hub

export default function StaffHQ() {
  const hubs = [
    {
      title: 'My Workspace',
      description: 'Your personal tasks, calendar, and notifications.',
      icon: ClipboardList,
      page: 'MyWorkspace',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'Club Services Hub',
      description: 'Manage club data, surveys, and support.',
      icon: Briefcase,
      page: 'ClubServicesHub',
      color: 'from-indigo-500 to-purple-500'
    },
    {
      title: 'Youth & Community Hub',
      description: 'Oversee youth programs, FTLOC, and pledges.',
      icon: Users,
      page: 'YouthCommunityHub',
      color: 'from-green-500 to-emerald-500'
    },
    {
      title: 'High Performance Hub',
      description: 'Access athlete data, shot tracking, and coaching tools.',
      icon: Target,
      page: 'HighPerformanceHub',
      color: 'from-sky-500 to-blue-500'
    },
    {
      title: 'Competition Management Hub',
      description: 'Plan, execute, and track curling competitions and events.',
      icon: Trophy,
      page: 'CompetitionManagementHub',
      color: 'from-yellow-400 to-orange-500' // Gold/orange theme for a trophy
    },
    {
      title: 'Sponsorship HQ',
      description: 'Manage sponsor pipeline, deals, and assets.',
      icon: DollarSign,
      page: 'SponsorshipHQ',
      color: 'from-amber-500 to-yellow-500'
    },
    {
      title: 'Events Hub', // Changed from 'Event Ops Toolkit'
      description: 'Plan and execute world-class curling events.',
      icon: Calendar,
      page: 'EventsHub', // Changed from 'EventOpsToolkit'
      color: 'from-rose-500 to-pink-500'
    },
    {
      title: 'Marketing Center',
      description: 'Campaigns, press releases, and brand assets.',
      icon: Megaphone,
      page: 'MarketingCenter',
      color: 'from-fuchsia-500 to-purple-500'
    },
    {
      title: 'Safe Sport Hub',
      description: 'Manage compliance, policies, and incident reports.',
      icon: Shield,
      page: 'SafeSportHub',
      color: 'from-teal-500 to-cyan-500'
    },
    {
      title: 'Governance & Compliance',
      description: 'Board materials, policies, and compliance tracking.',
      icon: BookOpen,
      page: 'GovernanceComplianceHub',
      color: 'from-slate-500 to-gray-500'
    },
    {
      title: 'People & Culture Hub',
      description: 'Manage HR policies, onboarding, and staff directory.',
      icon: Heart,
      page: 'PeopleCultureHub',
      color: 'from-red-500 to-orange-500'
    },
    {
      title: 'Finance Hub',
      description: 'Budgets, grants, and financial reporting.',
      icon: PieChart,
      page: 'FinanceHub',
      color: 'from-lime-500 to-green-500'
    },
    {
      title: 'Incident Management',
      description: 'Track and resolve all internal and external cases.',
      icon: FileText,
      page: 'IncidentManagementHub',
      color: 'from-orange-500 to-amber-500'
    },
  ];

  return (
    <div className="bg-brand-charcoal min-h-screen">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-brand-text-primary tracking-tight">Staff HQ</h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-brand-text-secondary">
            Your central command for all of Curling Canada's operations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {hubs.map((hub) => (
            <HubCard key={hub.title} {...hub} />
          ))}
        </div>
      </div>
    </div>
  );
}
