import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, User, Shield, Award, AlertTriangle, Calendar } from 'lucide-react';

const VolunteerDetailView = ({ volunteer, onBack, onUpdate }) => {
  const [activeTab, setActiveTab] = useState('profile');

  const getComplianceStatus = (compliance) => {
    if (!compliance) return 'unknown';
    const statuses = [
      compliance.respect_in_sport,
      compliance.policy_signed,
      compliance.background_check
    ];

    if (statuses.every(status => status === 'compliant')) return 'compliant';
    if (statuses.some(status => status === 'expired')) return 'expired';
    if (statuses.some(status => status === 'pending')) return 'pending';
    return 'unknown';
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'compliant':
        return <Badge className="bg-green-600 text-white">Compliant</Badge>;
      case 'expired':
        return <Badge className="bg-red-600 text-white">Expired</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-600 text-yellow-950">Pending</Badge>;
      default:
        return <Badge className="bg-gray-600 text-white">Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={onBack} className="border-brand-border">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Roster
        </Button>
        <div>
          <h3 className="text-xl font-bold text-brand-text-primary">{volunteer.full_name}</h3>
          <p className="text-brand-text-secondary">Volunteer Details & History</p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-brand-card-bg border-brand-border">
          <CardContent className="p-4 text-center">
            <User className="w-8 h-8 text-blue-400 mx-auto mb-2" />
            <p className="text-sm text-brand-text-secondary">Total Events</p>
            <p className="text-2xl font-bold text-brand-text-primary">{volunteer.events?.length || 0}</p>
          </CardContent>
        </Card>
        <Card className="bg-brand-card-bg border-brand-border">
          <CardContent className="p-4 text-center">
            <Shield className="w-8 h-8 text-green-400 mx-auto mb-2" />
            <p className="text-sm text-brand-text-secondary">Compliance</p>
            <div className="mt-1">{getStatusBadge(getComplianceStatus(volunteer.compliance))}</div>
          </CardContent>
        </Card>
        <Card className="bg-brand-card-bg border-brand-border">
          <CardContent className="p-4 text-center">
            <Award className="w-8 h-8 text-purple-400 mx-auto mb-2" />
            <p className="text-sm text-brand-text-secondary">Total XP</p>
            <p className="text-2xl font-bold text-brand-text-primary">{volunteer.xp_stats?.total_xp || 0}</p>
          </CardContent>
        </Card>
        <Card className="bg-brand-card-bg border-brand-border">
          <CardContent className="p-4 text-center">
            <Calendar className="w-8 h-8 text-amber-400 mx-auto mb-2" />
            <p className="text-sm text-brand-text-secondary">Last Active</p>
            <p className="text-sm font-semibold text-brand-text-primary">
              {volunteer.last_active_date ? new Date(volunteer.last_active_date).toLocaleDateString() : 'Unknown'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Information */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-brand-card-bg border-brand-border">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="events">Event History</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="credentials">Credentials</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-6">
          <Card className="bg-brand-card-bg border-brand-border">
            <CardHeader>
              <CardTitle>Volunteer Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-brand-text-secondary">Full Name</label>
                  <p className="text-brand-text-primary">{volunteer.full_name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-brand-text-secondary">Email</label>
                  <p className="text-brand-text-primary">{volunteer.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-brand-text-secondary">Region</label>
                  <p className="text-brand-text-primary">{volunteer.ma_region}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-brand-text-secondary">Source System</label>
                  <Badge variant="outline" className="border-brand-border">{volunteer.source_system}</Badge>
                </div>
                <div>
                  <label className="text-sm font-medium text-brand-text-secondary">Recognition Tier</label>
                  <Badge className="bg-purple-600 text-white capitalize">
                    {volunteer.xp_stats?.recognition_tier || 'none'}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="events" className="mt-6">
          <Card className="bg-brand-card-bg border-brand-border">
            <CardHeader>
              <CardTitle>Event History</CardTitle>
            </CardHeader>
            <CardContent>
              {volunteer.events && volunteer.events.length > 0 ? (
                <div className="space-y-3">
                  {volunteer.events.map((event, index) => (
                    <div key={index} className="p-4 bg-brand-charcoal rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold text-brand-text-primary">{event.event_name}</h4>
                          <p className="text-sm text-brand-text-secondary">Role: {event.role}</p>
                        </div>
                        <Badge variant="outline" className="border-brand-border">
                          {event.shifts_completed} shifts
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-brand-text-secondary py-8">No event history available</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance" className="mt-6">
          <Card className="bg-brand-card-bg border-brand-border">
            <CardHeader>
              <CardTitle>Compliance Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-brand-charcoal rounded-lg">
                  <span className="text-brand-text-primary">Respect in Sport</span>
                  {getStatusBadge(volunteer.compliance?.respect_in_sport)}
                </div>
                <div className="flex justify-between items-center p-4 bg-brand-charcoal rounded-lg">
                  <span className="text-brand-text-primary">Policy Signed</span>
                  {getStatusBadge(volunteer.compliance?.policy_signed)}
                </div>
                <div className="flex justify-between items-center p-4 bg-brand-charcoal rounded-lg">
                  <span className="text-brand-text-primary">Background Check</span>
                  {getStatusBadge(volunteer.compliance?.background_check)}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="credentials" className="mt-6">
          <Card className="bg-brand-card-bg border-brand-border">
            <CardHeader>
              <CardTitle>Credentials & Access</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-brand-charcoal rounded-lg">
                  <span className="text-brand-text-primary">Credential Status</span>
                  <Badge className={`${
                    volunteer.credentials?.status === 'compliant' ? 'bg-green-600' :
                    volunteer.credentials?.status === 'issued' ? 'bg-blue-600' :
                    volunteer.credentials?.status === 'revoked' ? 'bg-red-600' :
                    'bg-yellow-600'
                  } text-white capitalize`}>
                    {volunteer.credentials?.status || 'pending'}
                  </Badge>
                </div>
                {volunteer.credentials?.access_zones && (
                  <div>
                    <label className="text-sm font-medium text-brand-text-secondary mb-2 block">Access Zones</label>
                    <div className="flex flex-wrap gap-2">
                      {volunteer.credentials.access_zones.map((zone, index) => (
                        <Badge key={index} variant="outline" className="border-brand-border">
                          {zone}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VolunteerDetailView;