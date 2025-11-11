
import React from 'react';
import { usePermissions } from '../components/hooks/usePermissions';
import StaffHQDashboard from '../components/staffhq/StaffHQDashboard';
import HubCard from '../components/staffhq/HubCard';
import {
  Briefcase, BarChart3, Users, Shield, Megaphone, FileText, Settings,
  Trophy, DollarSign, FlaskConical, Handshake, TrendingUp, Activity,
  Globe, Scale, Building, Calendar, Brain, Zap, Target, ShieldAlert, Heart, Database
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Loader2 } from 'lucide-react';

const hubCategories = {
  "Command & Control": {
    icon: Activity,
    hubs: [
      { name: "My Workspace", href: "MyWorkspace", icon: Briefcase, description: "Your personal tasks, approvals, and calendar." },
      { name: "Executive Hub", href: "ExecutiveHub", icon: Target, description: "High-level strategic and operational overview." }
    ]
  },
  "Operations & Services": {
    icon: Settings,
    hubs: [
      { name: "Club Services", href: "ClubServicesHub", icon: Building, description: "Manage club affiliations, health, and support." },
      { name: "Competitions", href: "LiveScoring", icon: Trophy, description: "Oversee live scores, standings, and events." },
      { name: "Events Hub", href: "EventOpsToolkit", icon: Calendar, description: "Plan and execute all national and regional events." },
      { name: "High Performance", href: "HighPerformanceHub", icon: BarChart3, description: "Monitor athlete progress and team performance." },
      { name: "IT Operations", href: "PlatformSettings", icon: Settings, description: "Manage platform settings, health, and integrations." }
    ]
  },
  "People, Comms & Governance": {
    icon: Users,
    hubs: [
      { name: "Comms & Media", href: "MarketingCenter", icon: Megaphone, description: "Coordinate all external communications." },
      { name: "Governance", href: "GovernanceComplianceHub", icon: Shield, description: "Oversee board, policy, and compliance." },
      { name: "International", href: "FederationContext", icon: Globe, description: "Manage global partnerships and events." },
      { name: "Legal Hub", href: "LegalComplianceHub", icon: Scale, description: "Track legal cases, contracts, and compliance." },
      { name: "People & Culture", href: "PeopleCultureHub", icon: Users, description: "Handle all HR functions and staff development." },
      { name: "Safe Sport", href: "SafeSportHub", icon: Shield, description: "Manage Safe Sport cases, policies, and training." }
    ]
  },
  "Engagement & Knowledge": {
    icon: Brain,
    hubs: [
      { name: "Community Hub", href: "CommunityHub", icon: Users, description: "Engage with and manage community programs." },
      { name: "FanOS", href: "FanOS", icon: Zap, description: "Manage all fan engagement features." },
      { name: "Forms Hub", href: "FormsHub", icon: FileText, description: "Create and manage data collection forms." },
      { name: "Incidents", href: "IncidentManagementHub", icon: ShieldAlert, description: "Track and resolve all reported incidents." },
      { name: "Knowledge Base", href: "KnowledgeBase", icon: Brain, description: "Curate and share internal knowledge." },
      { name: "Reports Hub", href: "ReportsHub", icon: BarChart3, description: "Access and generate custom data reports." },
      { name: "Youth & Community", href: "YouthCommunityHub", icon: Heart, description: "Manage youth programs, FTLOC, and community initiatives." }
    ]
  },
  "Strategy & Finance": {
    icon: DollarSign,
    hubs: [
      { name: "Finance Hub", href: "FinanceHub", icon: DollarSign, description: "Oversee all financial operations." },
      { name: "Monetization", href: "MonetizationHub", icon: TrendingUp, description: "Revenue optimization and engagement economics." },
      { name: "Research & Data", href: "ResearchHub", icon: FlaskConical, description: "Manage research partnerships and data privacy." },
      { name: "Sponsorship HQ", href: "SponsorshipHQ", icon: Handshake, description: "Track sponsorship pipeline and deliverables." },
      { name: "Sponsor Intelligence", href: "SponsorIntelligence", icon: Target, description: "Real-time sponsor performance from 5 data sources." },
      { name: "Strategic Planning", href: "StrategicPlanningHub", icon: TrendingUp, description: "Manage strategic goals and initiatives." }
    ]
  },
  "Data & Analytics": {
    icon: Database,
    hubs: [
      { name: "Data Navigation", href: "DataNavigationHub", icon: Database, description: "Access all data infrastructure and analytics tools." },
      { name: "System Architecture", href: "SystemArchitecture", icon: Activity, description: "View complete system integration map." },
      { name: "Data Quality", href: "DataQualityDashboard", icon: Shield, description: "Monitor data quality and governance." },
      { name: "Research Hub", href: "ResearchHub", icon: Brain, description: "Research partnerships and AI models." }
    ]
  }
};

export default function StaffHQ() {
  const { permissions, isLoading } = usePermissions();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-brand-red" />
      </div>
    );
  }

  if (!permissions.canAccessStaffHQ) {
    return (
      <div className="text-center p-8">
        <h1 className="text-2xl font-bold">Access Denied</h1>
        <p>You do not have permission to view Staff HQ.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Staff HQ</h1>
        <p className="text-brand-text-secondary">Welcome to your central command center.</p>
      </div>
      
      <StaffHQDashboard />

      {Object.entries(hubCategories).map(([category, { icon: CategoryIcon, hubs }]) => (
        <div key={category}>
          <div className="flex items-center gap-3 mb-4">
            <CategoryIcon className="w-6 h-6" />
            <h2 className="text-2xl font-semibold">{category}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {hubs.map((hub) => (
              <HubCard 
                key={hub.name}
                title={hub.name}
                href={hub.href}
                icon={hub.icon}
                description={hub.description}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
