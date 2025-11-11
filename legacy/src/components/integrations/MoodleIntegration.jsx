import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  GraduationCap, RefreshCw, Loader2, CheckCircle, AlertTriangle, 
  ExternalLink, Database, BookOpen, Award, 
  Users, FileText, BarChart3, TrendingUp
} from 'lucide-react';
import { useToast } from '../hooks/use-toast';

export default function MoodleIntegration() {
  const [isSyncing, setIsSyncing] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState({ connected: false, loading: false });
  const { toast } = useToast();

  const handleSync = async (syncType) => {
    setIsSyncing(true);
    toast({
      title: "Coming Soon",
      description: `Moodle ${syncType} sync is being developed.`,
    });
    setTimeout(() => setIsSyncing(false), 1000);
  };

  const testConnection = async () => {
    setConnectionStatus({ connected: false, loading: true });
    setTimeout(() => {
      setConnectionStatus({ connected: false, loading: false });
      toast({
        title: "Moodle Integration",
        description: "Connection setup coming soon. Moodle LMS API integration in development.",
      });
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Overview */}
      <Card className="bg-gradient-to-br from-teal-950/20 to-green-950/20 border-brand-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-teal-400" />
            Moodle Learning Management System Integration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-brand-text-secondary">
            Moodle is Curling Canada's learning management system for coaching education and development programs. 
            This integration syncs course enrollments, completion data, and certificates.
          </p>

          {/* Connection Status */}
          <div className="p-4 bg-brand-charcoal/50 rounded-lg border border-brand-border">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-teal-400" />
                <span className="font-medium text-brand-text-primary">Connection Status</span>
              </div>
              {connectionStatus.loading ? (
                <Loader2 className="w-4 h-4 animate-spin text-teal-400" />
              ) : connectionStatus.connected ? (
                <Badge className="bg-green-500/20 text-green-400">Connected</Badge>
              ) : (
                <Badge className="bg-gray-500/20 text-gray-400">Not Connected</Badge>
              )}
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={testConnection}
              disabled={connectionStatus.loading}
              className="w-full"
            >
              {connectionStatus.loading ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Testing Connection...</>
              ) : (
                <><RefreshCw className="w-4 h-4 mr-2" /> Test Connection</>
              )}
            </Button>
          </div>

          <Alert className="border-yellow-500/50 bg-yellow-500/10">
            <AlertTriangle className="h-4 w-4 text-yellow-400" />
            <AlertDescription className="text-yellow-200">
              <strong>Integration In Development:</strong> Moodle LMS API integration is currently being built. 
              Course sync, completion tracking, and certificate management coming soon.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Data Sync Categories */}
      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader>
          <CardTitle>Learning & Development</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="courses" className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
              <TabsTrigger value="courses">
                <BookOpen className="w-4 h-4 mr-2" />
                Courses
              </TabsTrigger>
              <TabsTrigger value="enrollments">
                <Users className="w-4 h-4 mr-2" />
                Enrollments
              </TabsTrigger>
              <TabsTrigger value="certificates">
                <Award className="w-4 h-4 mr-2" />
                Certificates
              </TabsTrigger>
              <TabsTrigger value="analytics">
                <BarChart3 className="w-4 h-4 mr-2" />
                Analytics
              </TabsTrigger>
            </TabsList>

            <TabsContent value="courses" className="space-y-4 mt-4">
              <div className="p-4 bg-brand-charcoal/30 rounded-lg">
                <h4 className="font-medium text-brand-text-primary mb-3 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-teal-400" />
                  Course Catalog
                </h4>
                <div className="space-y-3 text-sm text-brand-text-secondary">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
                    <div>
                      <div className="font-medium text-brand-text-primary">NCCP Courses</div>
                      <div>Competition Introduction, Development, and High Performance</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
                    <div>
                      <div className="font-medium text-brand-text-primary">Online Learning Modules</div>
                      <div>Sync course content, videos, and learning materials</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
                    <div>
                      <div className="font-medium text-brand-text-primary">Professional Development</div>
                      <div>Continuing education and skill development courses</div>
                    </div>
                  </div>
                </div>
                <Button 
                  onClick={() => handleSync('Course')} 
                  disabled={isSyncing}
                  className="w-full mt-4"
                >
                  {isSyncing ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Syncing...</>
                  ) : (
                    <><RefreshCw className="w-4 h-4 mr-2" /> Sync Courses</>
                  )}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="enrollments" className="space-y-4 mt-4">
              <div className="p-4 bg-brand-charcoal/30 rounded-lg">
                <h4 className="font-medium text-brand-text-primary mb-3 flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-400" />
                  Course Enrollments
                </h4>
                <div className="space-y-3 text-sm text-brand-text-secondary">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
                    <div>
                      <div className="font-medium text-brand-text-primary">Active Students</div>
                      <div>Track who's enrolled in which courses</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
                    <div>
                      <div className="font-medium text-brand-text-primary">Progress Tracking</div>
                      <div>Monitor course completion progress for each student</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
                    <div>
                      <div className="font-medium text-brand-text-primary">Assignment Submissions</div>
                      <div>Track submitted assignments and grades</div>
                    </div>
                  </div>
                </div>
                <Button 
                  onClick={() => handleSync('Enrollment')} 
                  disabled={isSyncing}
                  className="w-full mt-4"
                >
                  {isSyncing ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Syncing...</>
                  ) : (
                    <><RefreshCw className="w-4 h-4 mr-2" /> Sync Enrollments</>
                  )}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="certificates" className="space-y-4 mt-4">
              <div className="p-4 bg-brand-charcoal/30 rounded-lg">
                <h4 className="font-medium text-brand-text-primary mb-3 flex items-center gap-2">
                  <Award className="w-4 h-4 text-yellow-400" />
                  Certifications
                </h4>
                <div className="space-y-3 text-sm text-brand-text-secondary">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
                    <div>
                      <div className="font-medium text-brand-text-primary">NCCP Certifications</div>
                      <div>Sync coaching certification status and expiry dates</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
                    <div>
                      <div className="font-medium text-brand-text-primary">Digital Certificates</div>
                      <div>Auto-generate and store course completion certificates</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
                    <div>
                      <div className="font-medium text-brand-text-primary">Compliance Tracking</div>
                      <div>Monitor certification expiry and renewal requirements</div>
                    </div>
                  </div>
                </div>
                <Button 
                  onClick={() => handleSync('Certificate')} 
                  disabled={isSyncing}
                  className="w-full mt-4"
                >
                  {isSyncing ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Syncing...</>
                  ) : (
                    <><RefreshCw className="w-4 h-4 mr-2" /> Sync Certificates</>
                  )}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-4 mt-4">
              <div className="p-4 bg-brand-charcoal/30 rounded-lg">
                <h4 className="font-medium text-brand-text-primary mb-3 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-purple-400" />
                  Learning Analytics
                </h4>
                <div className="space-y-3 text-sm text-brand-text-secondary">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
                    <div>
                      <div className="font-medium text-brand-text-primary">Completion Rates</div>
                      <div>Track course completion percentages by region and course type</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
                    <div>
                      <div className="font-medium text-brand-text-primary">Engagement Metrics</div>
                      <div>Monitor student engagement and time spent learning</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
                    <div>
                      <div className="font-medium text-brand-text-primary">Performance Trends</div>
                      <div>Analyze quiz and assignment results over time</div>
                    </div>
                  </div>
                </div>
                <Button 
                  onClick={() => handleSync('Analytics')} 
                  disabled={isSyncing}
                  className="w-full mt-4"
                >
                  {isSyncing ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Syncing...</>
                  ) : (
                    <><RefreshCw className="w-4 h-4 mr-2" /> Sync Analytics</>
                  )}
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Integration Benefits */}
      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader>
          <CardTitle>Integration Benefits</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 bg-teal-500/10 rounded-lg">
              <GraduationCap className="w-5 h-5 text-teal-400 mb-2" />
              <h4 className="font-medium text-brand-text-primary mb-1">Unified Learning Path</h4>
              <p className="text-sm text-brand-text-secondary">
                Display Moodle courses alongside Button knowledge center content
              </p>
            </div>
            <div className="p-4 bg-blue-500/10 rounded-lg">
              <Award className="w-5 h-5 text-blue-400 mb-2" />
              <h4 className="font-medium text-brand-text-primary mb-1">Coaching Certification Tracking</h4>
              <p className="text-sm text-brand-text-secondary">
                Automatically update coach certification status in The Button
              </p>
            </div>
            <div className="p-4 bg-green-500/10 rounded-lg">
              <TrendingUp className="w-5 h-5 text-green-400 mb-2" />
              <h4 className="font-medium text-brand-text-primary mb-1">XP Integration</h4>
              <p className="text-sm text-brand-text-secondary">
                Award CurlPoints for completing Moodle courses and certifications
              </p>
            </div>
            <div className="p-4 bg-purple-500/10 rounded-lg">
              <BarChart3 className="w-5 h-5 text-purple-400 mb-2" />
              <h4 className="font-medium text-brand-text-primary mb-1">Professional Development Analytics</h4>
              <p className="text-sm text-brand-text-secondary">
                Track coaching education trends and identify development needs
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* External Link */}
      <div className="flex justify-center">
        <Button 
          variant="outline" 
          onClick={() => window.open('https://moodle.org', '_blank')}
        >
          <ExternalLink className="w-4 h-4 mr-2" />
          Open Moodle
        </Button>
      </div>
    </div>
  );
}