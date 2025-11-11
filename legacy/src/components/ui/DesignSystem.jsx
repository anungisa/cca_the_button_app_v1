import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MetricCard, StatusBadge, EmptyState, PageHeader } from './StandardizedComponents';
import { Users, DollarSign, TrendingUp } from 'lucide-react';

/**
 * Design System Documentation Component
 * This component serves as both documentation and a testing ground for our standardized components.
 */
export default function DesignSystem() {
  return (
    <div className="min-h-screen bg-brand-charcoal p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        
        <PageHeader
          title="The Button Design System"
          description="Standardized components and patterns for consistent user experience"
          breadcrumbs={[
            { label: 'Components', href: '#' },
            { label: 'Design System' }
          ]}
        />

        {/* Metric Cards Section */}
        <Card className="bg-brand-card-bg border-brand-border">
          <CardHeader>
            <CardTitle>Metric Cards</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <MetricCard
                title="Total Revenue"
                value="$847,239"
                subtitle="This month"
                trend="up"
                trendValue="+12.5%"
                icon={DollarSign}
                variant="success"
              />
              
              <MetricCard
                title="Active Users"
                value="12,847"
                subtitle="Last 30 days"
                trend="neutral"
                trendValue="±0.2%"
                icon={Users}
              />
              
              <MetricCard
                title="Conversion Rate"
                value="3.7%"
                subtitle="This quarter"
                trend="down"
                trendValue="-2.1%"
                icon={TrendingUp}
                variant="warning"
              />
            </div>
          </CardContent>
        </Card>

        {/* Status Badges Section */}
        <Card className="bg-brand-card-bg border-brand-border">
          <CardHeader>
            <CardTitle>Status Badges</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <StatusBadge status="active" />
              <StatusBadge status="pending" />
              <StatusBadge status="completed" />
              <StatusBadge status="cancelled" />
              <StatusBadge status="approved" />
              <StatusBadge status="rejected" />
              <StatusBadge status="overdue" />
              <StatusBadge status="compliant" />
              <StatusBadge status="at_risk" />
            </div>
          </CardContent>
        </Card>

        {/* Empty States Section */}
        <Card className="bg-brand-card-bg border-brand-border">
          <CardHeader>
            <CardTitle>Empty States</CardTitle>
          </CardHeader>
          <CardContent>
            <EmptyState
              icon={Users}
              title="No team members found"
              description="Get started by inviting team members to collaborate on your projects."
              action={{
                label: 'Invite Team Members',
                onClick: () => console.log('Invite clicked'),
                icon: Users
              }}
            />
          </CardContent>
        </Card>

        {/* Loading States */}
        <Card className="bg-brand-card-bg border-brand-border">
          <CardHeader>
            <CardTitle>Loading States</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <MetricCard isLoading />
              <MetricCard isLoading />
              <MetricCard isLoading />
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}