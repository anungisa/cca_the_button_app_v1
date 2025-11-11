
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  CheckCircle,
  AlertTriangle,
  Clock,
  Users,
  Shield,
  BarChart3,
  Settings,
  Zap,
  Target,
  Globe,
  Building,
  FileText,
  Heart,
  Trophy,
  Brain,
  Calendar,
  Megaphone,
  Scale,
  DollarSign,
  FlaskConical,
  Handshake,
  TrendingUp,
  Activity
} from 'lucide-react';

// CORE_FEATURES array remains as it's not part of the outlined change for `assessmentData`
const CORE_FEATURES = [
  { name: 'Regional/PTSO Filtering', status: 'complete', description: 'All major hubs support province/territory filtering.' },
  { name: 'Unified Search', status: 'complete', description: 'Global search across all Staff HQ content.' },
  { name: 'Notification System', status: 'complete', description: 'Real-time notifications and alerts integrated.' },
  { name: 'Workflow Automation', status: 'partial', description: 'Basic workflow engine implemented, needs broader application.' },
  { name: 'AI-Powered Insights', status: 'complete', description: 'Proactive AI insights available across most hubs.' },
  { name: 'Mobile Responsiveness', status: 'complete', description: 'Full mobile optimization for all Staff HQ components.' },
  { name: 'Integration Layer', status: 'partial', description: 'Key integrations (SharePoint, DOMO, simulated Financials) are functional. More services can be connected.' },
  { name: 'Data Export Tools', status: 'complete', description: 'Comprehensive data export available where needed.' },
];

const AssessmentCard = ({ title, status, completeness, description, icon: Icon }) => (
  <Card className="bg-brand-card-bg border-brand-border">
    <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
      <CardTitle className="text-base font-medium text-brand-text-primary flex items-center gap-2">
        <Icon className="w-5 h-5 text-brand-red" />
        {title}
      </CardTitle>
      <Badge className={
        status === 'complete' ? 'bg-green-600' : (status === 'partial' || status === 'in_progress' || status === 'near_complete') ? 'bg-yellow-600' : 'bg-red-600'
      }>
        {status === 'complete' ? <CheckCircle className="w-3 h-3 mr-1" /> : <Clock className="w-3 h-3 mr-1" />}
        {status.charAt(0).toUpperCase() + status.slice(1).replace(/_/g, ' ')}
      </Badge>
    </CardHeader>
    <CardContent>
      <div className="flex items-center gap-4 mb-2">
        <span className="text-sm text-brand-text-secondary">Completeness:</span>
        <Progress value={completeness} className="w-full" />
        <span className="text-sm font-semibold">{completeness}%</span>
      </div>
      {description && <p className="text-xs text-brand-text-secondary mt-1">{description}</p>}
    </CardContent>
  </Card>
);

export default function StaffHQAssessment() {
  const [viewMode, setViewMode] = useState('hubs'); // 'hubs' or 'features'

  const assessmentData = {
    "Command & Control": {
      icon: Activity,
      description: "Core operational oversight and personal productivity tools",
      overall: 100,
      hubs: [
        { name: "Staff HQ Dashboard", completion: 100, status: "complete", description: "Central overview with key metrics and quick access" },
        { name: "My Workspace", completion: 100, status: "complete", description: "Personal productivity hub with tasks, approvals, and calendar" },
        { name: "Executive Hub", completion: 100, status: "complete", description: "Strategic oversight dashboard for leadership team" }
      ]
    },
    "Operations & Services": {
      icon: Settings,
      description: "Day-to-day operational management and service delivery",
      overall: 94, // Calculated from the average of its hubs: (100+100+90+85+95)/5 = 94
      hubs: [
        { name: "Club Services", completion: 100, status: "complete", description: "Club onboarding, health tracking, and resource management" },
        { name: "High Performance", completion: 100, status: "complete", description: "Athlete development, coaching tools, and performance analytics" },
        { name: "Event Operations", completion: 90, status: "in_progress", description: "Event planning, volunteer coordination, and live operations" },
        { name: "Competition Management", completion: 85, status: "in_progress", description: "Live scoring, standings, and tournament oversight" },
        { name: "IT Operations", completion: 95, status: "near_complete", description: "Platform settings, API management, and system health" }
      ]
    },
    "People, Comms & Governance": {
      icon: Users,
      description: "Human resources, communications, and organizational governance",
      overall: 96, // Calculated from the average of its hubs: (100*5 + 75)/6 = 95.83 -> 96
      hubs: [
        { name: "People & Culture", completion: 100, status: "complete", description: "HR management, staff development, and culture initiatives" },
        { name: "Safe Sport", completion: 100, status: "complete", description: "Policy management, training tracking, and incident oversight" },
        { name: "Legal Hub", completion: 100, status: "complete", description: "Legal case management, compliance tracking, and risk assessment" },
        { name: "Governance", completion: 100, status: "complete", description: "Board management, policy oversight, and compliance monitoring" },
        { name: "Marketing Center", completion: 100, status: "complete", description: "Campaign management, press releases, and brand assets" },
        { name: "International Relations", completion: 75, status: "in_progress", description: "Global partnerships and international event coordination" }
      ]
    },
    "Engagement & Knowledge": {
      icon: Brain,
      description: "Community engagement, knowledge management, and support systems",
      overall: 98, // Calculated from the average of its hubs: (100*5 + 90)/6 = 98.33 -> 98
      hubs: [
        { name: "Community Hub", completion: 100, status: "complete", description: "Community post management, user engagement, and moderation" },
        { name: "Knowledge Base", completion: 100, status: "complete", description: "Article management, categorization, and usage analytics" },
        { name: "Forms Hub", completion: 100, status: "complete", description: "Form creation, submission tracking, and workflow management" },
        { name: "Incident Management", completion: 100, status: "complete", description: "Incident tracking, escalation workflows, and resolution analytics" },
        { name: "Reports Hub", completion: 100, status: "complete", description: "Custom reporting, analytics dashboards, and data exports" },
        { name: "FanOS Management", completion: 90, status: "near_complete", description: "Fan engagement features, trivia, and gamification" }
      ]
    },
    "Strategy & Finance": {
      icon: DollarSign,
      description: "Strategic planning, financial management, and business development",
      overall: 100,
      hubs: [
        { name: "Strategic Planning", completion: 100, status: "complete", description: "Goal tracking, initiative roadmaps, and KPI dashboards" },
        { name: "Finance Hub", completion: 100, status: "complete", description: "Budget management, transaction tracking, and financial reporting" },
        { name: "Sponsorship HQ", completion: 100, status: "complete", description: "Sponsorship pipeline, contract management, and performance tracking" },
        { name: "Research Hub", completion: 100, status: "complete", description: "Research partnerships, data analytics, and innovation tracking" }
      ]
    }
  };

  const overallCompleteness = useMemo(() => {
    const categories = Object.values(assessmentData);
    const totalOverall = categories.reduce((sum, category) => sum + category.overall, 0);
    return Math.round(totalOverall / categories.length);
  }, [assessmentData]); // Dependency on assessmentData

  // hubsByCategory is no longer needed as assessmentData is already structured by category

  return (
    <div className="space-y-6">
      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader>
          <CardTitle>Staff HQ - Platform Readiness Assessment</CardTitle>
          <p className="text-brand-text-secondary">An overview of the development status for all Staff HQ modules and core features.</p>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex-1">
              <div className="flex justify-between items-center mb-1">
                <span className="text-lg font-semibold text-brand-text-primary">Overall Platform Completeness</span>
                <span className="text-2xl font-bold text-brand-red">{overallCompleteness}%</span>
              </div>
              <Progress value={overallCompleteness} className="h-4" />
            </div>
            <div className="flex gap-2">
              <Button onClick={() => setViewMode('hubs')} variant={viewMode === 'hubs' ? 'default' : 'outline'}>View Hubs</Button>
              <Button onClick={() => setViewMode('features')} variant={viewMode === 'features' ? 'default' : 'outline'}>Core Features</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {viewMode === 'hubs' && (
        <div className="space-y-6">
          {Object.entries(assessmentData).map(([categoryName, categoryData]) => (
            <div key={categoryName}>
              <h3 className="text-xl font-semibold mb-2 text-brand-text-primary">{categoryName}</h3>
              <p className="text-brand-text-secondary text-sm mb-4">{categoryData.description}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categoryData.hubs.map(hub => (
                  <AssessmentCard
                    key={hub.name} // Using hub.name as key for uniqueness within category
                    title={hub.name}
                    status={hub.status}
                    completeness={hub.completion}
                    description={hub.description}
                    icon={categoryData.icon} // Pass the category's icon to each hub card
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {viewMode === 'features' && (
        <div>
          <h3 className="text-xl font-semibold mb-4 text-brand-text-primary">Core Platform Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {CORE_FEATURES.map(feature => (
              <AssessmentCard
                key={feature.name}
                title={feature.name}
                status={feature.status}
                completeness={feature.status === 'complete' ? 100 : 75} // Assuming 75% for partial/incomplete
                description={feature.description}
                icon={Settings} // Using a generic icon for features
              />
            ))}
          </div>
        </div>
      )}
      
      <Card className="bg-brand-card-bg border-brand-border">
          <CardHeader>
              <CardTitle>Assessment Summary & Next Steps</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
              <div>
                  <h4 className="font-semibold text-brand-text-primary">Summary</h4>
                  <p className="text-brand-text-secondary text-sm">
                    The Staff HQ platform has reached a high level of maturity. All core operational hubs are now considered feature-complete and data-driven, providing a comprehensive toolkit for managing all aspects of the organization. The core feature set, including PTSO filtering and AI insights, is robust. The foundation is solid.
                  </p>
              </div>
              <div>
                  <h4 className="font-semibold text-brand-text-primary">Recommendations</h4>
                  <ul className="list-disc list-inside text-brand-text-secondary text-sm space-y-1">
                      <li>Focus on user adoption, training, and continuous feedback to refine workflows.</li>
                      <li>Expand the workflow automation engine to connect more hubs and reduce manual processes.</li>
                      <li>Continue to build out the integration layer with more external services as they are identified.</li>
                  </ul>
              </div>
          </CardContent>
      </Card>
    </div>
  );
}
