import React, { useState } from 'react';
import { User } from '@/api/entities';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  MessageCircle, 
  FileText, 
  BarChart3, 
  Shield,
  Target,
  Clock
} from 'lucide-react';

import HPDashboard from '../components/hp/HPDashboard';
import MyTeamworksCalendar from '../components/hp/MyTeamworksCalendar';
import TeamDocumentsPanel from '../components/hp/TeamDocumentsPanel';
import HPMessagesInbox from '../components/hp/HPMessagesInbox';
import HPAthleteProgress from '../components/hp/HPAthleteProgress';
import HPSyncAudit from '../components/hp/HPSyncAudit';

export default function HPTeamworksDashboard() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isLoading, setIsLoading] = useState(true);

  React.useEffect(() => {
    User.me().then(userData => {
      setUser(userData);
      setIsLoading(false);
    }).catch(() => {
      setUser(null);
      setIsLoading(false);
    });
  }, []);

  // Check if user has HP access
  const hasHPAccess = user && (
    user.role === 'admin' || 
    user.performance_tier && user.performance_tier !== 'none' ||
    user.user_type === 'coach'
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-red"></div>
      </div>
    );
  }

  if (!hasHPAccess) {
    return (
      <div className="text-center py-20">
        <div className="max-w-md mx-auto">
          <Target className="w-16 h-16 mx-auto mb-6 text-brand-text-secondary" />
          <h2 className="text-2xl font-bold text-brand-text-primary mb-4">
            High Performance Access Required
          </h2>
          <p className="text-brand-text-secondary mb-6">
            This Teamworks integration is available for High Performance athletes, coaches, and staff members.
          </p>
          <Card className="bg-brand-card-bg border-brand-border">
            <CardContent className="p-6">
              <h3 className="font-semibold text-brand-text-primary mb-3">Access Levels:</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-brand-text-secondary">HP Athletes</span>
                  <Badge className="bg-blue-600 text-white text-xs">Personal Access</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-brand-text-secondary">Coaches</span>
                  <Badge className="bg-green-600 text-white text-xs">Team Access</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-brand-text-secondary">Admin/Staff</span>
                  <Badge className="bg-purple-600 text-white text-xs">Full Access</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-brand-text-primary">Teamworks Integration</h1>
            <p className="text-brand-text-secondary mt-2">
              Your High Performance training hub - synced with Teamworks
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-purple-600 text-white">
              High Performance
            </Badge>
            <Badge variant="outline" className="border-brand-border text-brand-text-secondary">
              {user.performance_tier?.replace('_', ' ') || 'HP Member'}
            </Badge>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-6 bg-brand-card-bg border-brand-border">
          <TabsTrigger value="dashboard" className="text-brand-text-secondary data-[state=active]:bg-brand-red data-[state=active]:text-white">
            <Target className="w-4 h-4 mr-2 md:hidden" />
            <span className="hidden md:inline">Dashboard</span>
          </TabsTrigger>
          <TabsTrigger value="calendar" className="text-brand-text-secondary data-[state=active]:bg-brand-red data-[state=active]:text-white">
            <Calendar className="w-4 h-4 mr-2 md:hidden" />
            <span className="hidden md:inline">Calendar</span>
          </TabsTrigger>
          <TabsTrigger value="documents" className="text-brand-text-secondary data-[state=active]:bg-brand-red data-[state=active]:text-white">
            <FileText className="w-4 h-4 mr-2 md:hidden" />
            <span className="hidden md:inline">Documents</span>
          </TabsTrigger>
          <TabsTrigger value="messages" className="text-brand-text-secondary data-[state=active]:bg-brand-red data-[state=active]:text-white">
            <MessageCircle className="w-4 h-4 mr-2 md:hidden" />
            <span className="hidden md:inline">Messages</span>
          </TabsTrigger>
          <TabsTrigger value="progress" className="text-brand-text-secondary data-[state=active]:bg-brand-red data-[state=active]:text-white">
            <BarChart3 className="w-4 h-4 mr-2 md:hidden" />
            <span className="hidden md:inline">Progress</span>
          </TabsTrigger>
          {(user.role === 'admin') && (
            <TabsTrigger value="audit" className="text-brand-text-secondary data-[state=active]:bg-brand-red data-[state=active]:text-white">
              <Shield className="w-4 h-4 mr-2 md:hidden" />
              <span className="hidden md:inline">Audit</span>
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="dashboard" className="mt-6">
          <HPDashboard user={user} />
        </TabsContent>

        <TabsContent value="calendar" className="mt-6">
          <MyTeamworksCalendar user={user} />
        </TabsContent>

        <TabsContent value="documents" className="mt-6">
          <TeamDocumentsPanel user={user} />
        </TabsContent>

        <TabsContent value="messages" className="mt-6">
          <HPMessagesInbox user={user} />
        </TabsContent>

        <TabsContent value="progress" className="mt-6">
          <HPAthleteProgress user={user} />
        </TabsContent>

        {(user.role === 'admin') && (
          <TabsContent value="audit" className="mt-6">
            <HPSyncAudit user={user} />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}