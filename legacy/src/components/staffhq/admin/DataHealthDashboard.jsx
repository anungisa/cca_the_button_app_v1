
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  HeartPulse, 
  Database, 
  FileWarning, 
  CalendarClock,
  Archive,
  RefreshCw,
  ListChecks,
  Link2Off,
  UserCheck
} from 'lucide-react';
import { Case, Volunteer, SponsorContract, EventPlan, User, ApiConfiguration } from '@/api/entities';

const DataHealthDashboard = () => {
  const [healthStats, setHealthStats] = useState({
    staleCases: 0,
    expiredCompliance: 0,
    expiringContracts: 0,
    staleEventPlans: 0,
    inactiveUsers: 0,
    unassignedCases: 0,
    integrationErrors: 0,
    overallScore: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    runHealthChecks();
  }, []);

  const runHealthChecks = async () => {
    setIsLoading(true);
    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      // Add checks to ensure entities exist before calling methods on them
      const [casesData, volunteersData, contractsData, eventPlansData, usersData, apiConfigsData] = await Promise.all([
        Case ? Case.filter({ status: ['new', 'open', 'in_progress'] }) : Promise.resolve([]),
        Volunteer ? Volunteer.list() : Promise.resolve([]),
        SponsorContract ? SponsorContract.filter({ status: 'active' }) : Promise.resolve([]),
        EventPlan ? EventPlan.filter({ status: ['planning', 'in_progress'] }) : Promise.resolve([]),
        User ? User.filter({ is_active: true }) : Promise.resolve([]),
        ApiConfiguration ? ApiConfiguration.list() : Promise.resolve([])
      ]);

      // Ensure all fetched data are arrays before filtering to prevent errors
      const cases = casesData ?? [];
      const volunteers = volunteersData ?? [];
      const contracts = contractsData ?? [];
      const eventPlans = eventPlansData ?? [];
      const users = usersData ?? [];
      const apiConfigs = apiConfigsData ?? [];

      const now = new Date();

      const staleCases = cases.filter(c => new Date(c.updated_date) < thirtyDaysAgo).length;
      const expiredCompliance = volunteers.filter(v => 
        v.compliance?.background_check === 'expired' || 
        v.compliance?.policy_signed === 'expired'
      ).length;
      const expiringContracts = contracts.filter(c => 
        c.end_date && new Date(c.end_date) > now && new Date(c.end_date) < new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
      ).length;
      const staleEventPlans = eventPlans.filter(p => new Date(p.updated_date) < thirtyDaysAgo).length;
      const inactiveUsers = users.filter(u => u.last_login && new Date(u.last_login) < thirtyDaysAgo).length; // Assumes last_login exists
      const unassignedCases = cases.filter(c => !c.assigned_staff_id).length;
      const integrationErrors = apiConfigs.filter(api => api.status === 'error').length; // Calculate integration errors

      // Include new metric in totalChecks and totalItems for overall score
      const totalChecks = staleCases + expiredCompliance + expiringContracts + staleEventPlans + inactiveUsers + unassignedCases + integrationErrors;
      const totalItems = cases.length + volunteers.length + contracts.length + eventPlans.length + users.length + apiConfigs.length;
      const score = totalItems > 0 ? Math.max(0, Math.round(100 - (totalChecks / totalItems) * 100)) : 100;

      setHealthStats({
        staleCases,
        expiredCompliance,
        expiringContracts,
        staleEventPlans,
        inactiveUsers,
        unassignedCases,
        integrationErrors, // Update state with new metric
        overallScore: score
      });
    } catch (error) {
      console.error("Error running health checks:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-400';
    if (score >= 70) return 'text-yellow-400';
    return 'text-red-400';
  };

  const StatCard = ({ icon: Icon, value, label, description, action }) => (
    <Card className="bg-brand-card-bg border-brand-border">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Icon className="w-6 h-6 text-brand-red" />
            <div>
              <p className="text-2xl font-bold text-brand-text-primary">{value}</p>
              <p className="text-sm font-medium text-brand-text-primary">{label}</p>
            </div>
          </div>
          {action && (
            <Button variant="outline" size="sm" onClick={action} className="border-brand-border">
              View
            </Button>
          )}
        </div>
        <p className="text-xs text-brand-text-secondary mt-2">{description}</p>
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return <div className="text-center p-8"><p className="text-brand-text-secondary">Running data health checks...</p></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold text-brand-text-primary">Data Health & Integrity</h3>
          <p className="text-brand-text-secondary">Monitor the quality and timeliness of platform data</p>
        </div>
        <Button onClick={runHealthChecks} disabled={isLoading}>
          <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Re-run Checks
        </Button>
      </div>

      <Card className="bg-brand-card-bg border-brand-border">
        <CardContent className="p-6 text-center">
          <HeartPulse className="w-12 h-12 text-brand-red mx-auto mb-3" />
          <h4 className="text-lg font-semibold text-brand-text-primary mb-2">Overall Data Health Score</h4>
          <p className={`text-6xl font-bold ${getScoreColor(healthStats.overallScore)}`}>
            {healthStats.overallScore}%
          </p>
          <Progress value={healthStats.overallScore} className="mt-4" />
        </CardContent>
      </Card>

      {/* Health Statistics Grid - Updated layout and cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={FileWarning}
          value={healthStats.staleCases}
          label="Stale Cases"
          description="Cases not updated in 30+ days"
        />
        <StatCard
          icon={UserCheck}
          value={healthStats.expiredCompliance}
          label="Expired Compliance"
          description="Volunteers with expired certifications"
        />
        <StatCard
          icon={CalendarClock}
          value={healthStats.expiringContracts}
          label="Expiring Contracts"
          description="Sponsor contracts ending soon"
        />
        <StatCard
          icon={Archive}
          value={healthStats.staleEventPlans}
          label="Stale Event Plans"
          description="Event plans not updated recently"
        />
        <StatCard
          icon={Link2Off}
          value={healthStats.integrationErrors}
          label="Integration Errors"
          description="Failed API connections"
        />
        <StatCard
          icon={UserCheck} 
          value={healthStats.inactiveUsers}
          label="Inactive Users"
          description="Users not logged in recently"
        />
        {/* The "Unassigned Cases" StatCard is removed from the display as per outline, but the metric is still calculated */}
      </div>
    </div>
  );
};

export default DataHealthDashboard;
