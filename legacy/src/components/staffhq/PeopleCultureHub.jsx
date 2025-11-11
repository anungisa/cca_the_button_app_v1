import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { StaffProfile } from '@/api/entities';
import { OnboardingChecklist } from '@/api/entities';
import { HRPolicy } from '@/api/entities';
import { PolicyAcknowledgment } from '@/api/entities';
import { User } from '@/api/entities';
import { Users, UserPlus, FileText, CheckSquare, TrendingUp, Calendar, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';

const StaffDirectoryPanel = () => {
  const [staff, setStaff] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStaffData();
  }, []);

  const loadStaffData = async () => {
    try {
      const staffProfiles = await StaffProfile.list('-start_date');
      const staffWithUsers = await Promise.all(
        staffProfiles.map(async (profile) => {
          try {
            const user = await User.filter({ id: profile.user_id });
            return { ...profile, user: user[0] };
          } catch {
            return profile;
          }
        })
      );
      setStaff(staffWithUsers);
    } catch (error) {
      console.error('Failed to load staff:', error);
      setStaff([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="bg-brand-card-bg border-brand-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5 text-blue-400" />
          Staff Directory
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-brand-charcoal rounded-lg animate-pulse" />
            ))}
          </div>
        ) : staff.length === 0 ? (
          <div className="text-center py-8 text-brand-text-secondary">
            <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No staff members found</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {staff.map((member) => (
                <TableRow key={member.id || member.user_id}>
                  <TableCell>
                    <div>
                      <p className="font-medium text-brand-text-primary">
                        {member.user?.full_name || 'Unknown'}
                      </p>
                      <p className="text-sm text-brand-text-secondary">
                        {member.user?.email || 'No email'}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={`${
                      member.department === 'executive' ? 'bg-purple-600' :
                      member.department === 'operations' ? 'bg-blue-600' :
                      member.department === 'marketing' ? 'bg-green-600' :
                      'bg-gray-600'
                    } text-white`}>
                      {member.department || 'Unknown'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-brand-text-primary">
                    {member.job_title || 'Unknown'}
                  </TableCell>
                  <TableCell className="text-brand-text-secondary">
                    {member.start_date ? format(new Date(member.start_date), 'MMM d, yyyy') : 'Unknown'}
                  </TableCell>
                  <TableCell>
                    <Badge variant={member.is_active ? "default" : "secondary"}>
                      {member.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

const OnboardingTrackerPanel = () => {
  const [onboardingTasks, setOnboardingTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadOnboardingData();
  }, []);

  const loadOnboardingData = async () => {
    try {
      const checklists = await OnboardingChecklist.list('-start_date');
      setOnboardingTasks(checklists);
    } catch (error) {
      console.error('Failed to load onboarding data:', error);
      setOnboardingTasks([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="bg-brand-card-bg border-brand-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserPlus className="w-5 h-5 text-green-400" />
          Onboarding Tracker
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-20 bg-brand-charcoal rounded-lg animate-pulse" />
            ))}
          </div>
        ) : onboardingTasks.length === 0 ? (
          <div className="text-center py-8 text-brand-text-secondary">
            <UserPlus className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No active onboarding processes</p>
          </div>
        ) : (
          <div className="space-y-4">
            {onboardingTasks.map((checklist) => (
              <div key={checklist.id} className="p-4 bg-brand-charcoal rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-brand-text-primary">
                    New Hire - {checklist.template_type}
                  </h4>
                  <Badge variant={checklist.overall_status === 'completed' ? 'default' : 'secondary'}>
                    {checklist.overall_status || 'In Progress'}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <Progress value={checklist.completion_percentage || 0} className="flex-1" />
                  <span className="text-sm text-brand-text-secondary">
                    {checklist.completion_percentage || 0}%
                  </span>
                </div>
                <p className="text-sm text-brand-text-secondary">
                  Started: {checklist.start_date ? format(new Date(checklist.start_date), 'MMM d, yyyy') : 'Unknown'}
                </p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const PolicyCompliancePanel = () => {
  const [policies, setPolicies] = useState([]);
  const [acknowledgments, setAcknowledgments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadPolicyData();
  }, []);

  const loadPolicyData = async () => {
    try {
      const [policyData, ackData] = await Promise.all([
        HRPolicy.filter({ is_active: true }),
        PolicyAcknowledgment.list('-acknowledgment_date', 10)
      ]);
      setPolicies(policyData);
      setAcknowledgments(ackData);
    } catch (error) {
      console.error('Failed to load policy data:', error);
      setPolicies([]);
      setAcknowledgments([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="bg-brand-card-bg border-brand-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-yellow-400" />
          Policy Compliance
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-brand-charcoal rounded-lg animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-brand-text-primary">{policies.length}</p>
                <p className="text-sm text-brand-text-secondary">Active Policies</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-brand-text-primary">{acknowledgments.length}</p>
                <p className="text-sm text-brand-text-secondary">Recent Acknowledgments</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <h5 className="font-medium text-brand-text-primary">Recent Acknowledgments</h5>
              {acknowledgments.length === 0 ? (
                <p className="text-brand-text-secondary text-sm">No recent acknowledgments</p>
              ) : (
                acknowledgments.slice(0, 5).map((ack) => (
                  <div key={ack.id} className="flex items-center justify-between p-2 bg-brand-charcoal rounded">
                    <span className="text-sm text-brand-text-primary">{ack.policy_title || 'Unknown Policy'}</span>
                    <span className="text-xs text-brand-text-secondary">
                      {ack.acknowledgment_date ? format(new Date(ack.acknowledgment_date), 'MMM d') : 'Unknown'}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default function PeopleCultureHub() {
  return (
    <div className="min-h-screen bg-brand-charcoal">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
            <Users className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-brand-text-primary">People & Culture Hub</h1>
            <p className="text-brand-text-secondary">Manage staff, policies, and organizational culture.</p>
          </div>
        </div>

        <Tabs defaultValue="directory" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-brand-card-bg border-brand-border">
            <TabsTrigger value="directory">
              <Users className="w-4 h-4 mr-2" />
              Directory
            </TabsTrigger>
            <TabsTrigger value="onboarding">
              <UserPlus className="w-4 h-4 mr-2" />
              Onboarding
            </TabsTrigger>
            <TabsTrigger value="policies">
              <FileText className="w-4 h-4 mr-2" />
              Policies
            </TabsTrigger>
            <TabsTrigger value="analytics">
              <TrendingUp className="w-4 h-4 mr-2" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="directory" className="mt-6">
            <StaffDirectoryPanel />
          </TabsContent>

          <TabsContent value="onboarding" className="mt-6">
            <OnboardingTrackerPanel />
          </TabsContent>

          <TabsContent value="policies" className="mt-6">
            <PolicyCompliancePanel />
          </TabsContent>

          <TabsContent value="analytics" className="mt-6">
            <Card className="bg-brand-card-bg border-brand-border">
              <CardHeader>
                <CardTitle>HR Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-brand-text-secondary">
                  <TrendingUp className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Analytics dashboard coming soon</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}