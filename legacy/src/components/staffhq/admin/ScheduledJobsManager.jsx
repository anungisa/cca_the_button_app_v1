import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  Clock, Database, Mail, BarChart3, Play, 
  CheckCircle, Server, ExternalLink, Info,
  Copy, CheckCheck
} from 'lucide-react';
import { useToast } from '../../hooks/use-toast';

export default function ScheduledJobsManager() {
  const [copied, setCopied] = useState({});
  const { toast } = useToast();

  const scheduledJobs = [
    {
      id: 'domo-sync',
      name: 'DOMO Data Sync',
      description: 'Syncs all entity data to DOMO for analytics dashboards',
      frequency: 'Every 6 hours',
      command: 'curl -X GET https://your-app.base44.app/functions/scheduled/syncDOMOScheduled',
      icon: Database,
      color: 'text-purple-400',
      entities: ['Club', 'User', 'Event', 'Donation', 'ClubMetrics', 'PointTransaction']
    },
    {
      id: 'mongodb-backup',
      name: 'MongoDB Daily Backup',
      description: 'Full backup of all entities to MongoDB',
      frequency: 'Daily at 2:00 AM',
      command: 'curl -X GET https://your-app.base44.app/functions/scheduled/syncMongoDBScheduled',
      icon: Database,
      color: 'text-green-400',
      entities: ['All entities (12 collections)']
    },
    {
      id: 'email-worker',
      name: 'Email Queue Processor',
      description: 'Sends pending email notifications to users',
      frequency: 'Every 15 minutes',
      command: 'curl -X GET https://your-app.base44.app/functions/workers/processEmailQueue',
      icon: Mail,
      color: 'text-blue-400',
      entities: ['Notification']
    },
    {
      id: 'analytics-worker',
      name: 'Analytics Processor',
      description: 'Calculates club metrics, user streaks, and engagement stats',
      frequency: 'Every hour',
      command: 'curl -X GET https://your-app.base44.app/functions/workers/processAnalytics',
      icon: BarChart3,
      color: 'text-orange-400',
      entities: ['ClubMetrics', 'UserStreak']
    }
  ];

  const copyCommand = (jobId, command) => {
    navigator.clipboard.writeText(command);
    setCopied({ ...copied, [jobId]: true });
    
    toast({
      title: "Command Copied",
      description: "Paste this into Heroku Scheduler",
    });

    setTimeout(() => {
      setCopied({ ...copied, [jobId]: false });
    }, 2000);
  };

  const testJob = async (jobId) => {
    toast({
      title: "Testing Job",
      description: "Check the browser console for results...",
    });

    const job = scheduledJobs.find(j => j.id === jobId);
    
    try {
      const response = await fetch(job.command);
      const data = await response.json();
      
      console.log(`[${job.name}] Test Result:`, data);
      
      toast({
        title: "Job Test Complete",
        description: data.success ? "Check console for details" : "Job failed - check console",
      });
    } catch (error) {
      console.error(`[${job.name}] Error:`, error);
      toast({
        variant: "destructive",
        title: "Job Test Failed",
        description: error.message,
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-6 h-6 text-brand-red" />
            Heroku Scheduled Jobs
          </CardTitle>
          <CardDescription>
            Background jobs for data syncing, backups, and processing
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="mb-6">
            <Info className="h-4 w-4" />
            <AlertTitle>Setup Instructions</AlertTitle>
            <AlertDescription className="space-y-2 mt-2">
              <ol className="list-decimal list-inside space-y-1 text-sm">
                <li>Go to your Heroku Dashboard</li>
                <li>Select your app → Resources tab</li>
                <li>Add "Heroku Scheduler" add-on (free tier available)</li>
                <li>Click "Heroku Scheduler" → Create Job</li>
                <li>Copy the command from below and paste it</li>
                <li>Set the frequency (every 10 min, hourly, daily)</li>
              </ol>
              <Button
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={() => window.open('https://dashboard.heroku.com', '_blank')}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Open Heroku Dashboard
              </Button>
            </AlertDescription>
          </Alert>

          <div className="grid gap-4">
            {scheduledJobs.map(job => {
              const Icon = job.icon;
              return (
                <Card key={job.id} className="bg-brand-charcoal border-brand-border">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <Icon className={`w-6 h-6 mt-1 ${job.color}`} />
                        <div>
                          <CardTitle className="text-lg">{job.name}</CardTitle>
                          <CardDescription className="mt-1">
                            {job.description}
                          </CardDescription>
                          <Badge variant="outline" className="mt-2">
                            <Clock className="w-3 h-3 mr-1" />
                            {job.frequency}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <label className="text-xs text-brand-text-secondary mb-1 block">
                        Entities Affected:
                      </label>
                      <div className="flex flex-wrap gap-1">
                        {job.entities.map((entity, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {entity}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-xs text-brand-text-secondary mb-1 block">
                        Heroku Scheduler Command:
                      </label>
                      <div className="flex gap-2">
                        <code className="flex-1 p-2 bg-black/50 rounded text-xs text-green-400 overflow-x-auto">
                          {job.command}
                        </code>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => copyCommand(job.id, job.command)}
                        >
                          {copied[job.id] ? (
                            <CheckCheck className="w-4 h-4 text-green-500" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => testJob(job.id)}
                        className="flex-1"
                      >
                        <Play className="w-4 h-4 mr-2" />
                        Test Job Now
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}