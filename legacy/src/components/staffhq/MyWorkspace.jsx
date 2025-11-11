
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Clock,
  CheckCircle,
  AlertTriangle,
  Calendar,
  Users,
  TrendingUp,
  Bell,
  FileText,
  Target,
  DollarSign,
  Search,
  Briefcase
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import GlobalSearch from '@/components/GlobalSearch';
import { format, formatDistanceToNow } from 'date-fns';
import ProactiveAIInsights from '../ai/ProactiveAIInsights';
import { InterHubWorkflowEngine } from '../utils/InterHubWorkflowEngine';

export default function MyWorkspace() {
  const [user, setUser] = useState(null);
  const [workspaceData, setWorkspaceData] = useState({
    myTasks: [],
    myApprovals: [],
    myNotifications: [],
    upcomingDeadlines: [],
    recentActivity: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalTasks: 0,
    pendingApprovals: 0,
    overdueItems: 0,
    upcomingDeadlinesCount: 0,
  });
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [entities, setEntities] = useState({});

  const loadAllEntities = async () => {
    const loadedEntities = {};
    const entityModules = [
      { name: 'User', path: '@/api/entities' },
      { name: 'Task', path: '@/api/entities' },
      { name: 'Notification', path: '@/api/entities' },
      { name: 'MarketingCampaign', path: '@/api/entities' },
      { name: 'EventPlan', path: '@/api/entities' },
      { name: 'Incident', path: '@/api/entities' },
      { name: 'ComplianceItem', path: '@/api/entities' },
      { name: 'OnboardingChecklist', path: '@/api/entities' },
      { name: 'DocumentApproval', path: '@/api/entities' },
      { name: 'GovernanceMeeting', path: '@/api/entities' },
      { name: 'InnovationRequest', path: '@/api/entities' },
      { name: 'LegalCase', path: '@/api/entities/LegalCase' },
      { name: 'PressRelease', path: '@/api/entities' },
    ];

    for (const { name, path } of entityModules) {
      try {
        const module = await import(path);
        loadedEntities[name] = module[name];
      } catch (e) {
        console.warn(`${name} entity not available. Error:`, e);
      }
    }
    return loadedEntities;
  };
  
  useEffect(() => {
    const initializeWorkspace = async () => {
      setIsLoading(true);
      try {
        const loadedEntities = await loadAllEntities();
        setEntities(loadedEntities);
        if (!loadedEntities.User) {
           throw new Error('User entity not available. Cannot load workspace data.');
        }
        const currentUser = await loadedEntities.User.me();
        setUser(currentUser);
        await loadWorkspaceData(currentUser, loadedEntities);
      } catch (error) {
        console.error('Error initializing workspace:', error);
      } finally {
        setIsLoading(false);
      }
    };
    initializeWorkspace();
  }, []);

  const loadWorkspaceData = async (currentUser, availableEntities) => {
    if (!currentUser) return;
    
    // Unified task and approval arrays
    const myTasks = [];
    const myApprovals = [];
    
    // --- Enhanced Data Fetching with Workflow Integration ---
    const dataSources = {
        tasks: availableEntities.Task ? await availableEntities.Task.filter({ assigned_to: currentUser.id, status: { $ne: 'completed' } }) : [],
        campaigns: availableEntities.MarketingCampaign ? await availableEntities.MarketingCampaign.filter({ assigned_to: currentUser.id, status: { $ne: 'completed' } }) : [],
        eventPlans: availableEntities.EventPlan ? await availableEntities.EventPlan.filter({ created_by: currentUser.id, status: { $ne: 'completed' } }) : [],
        incidents: availableEntities.Incident ? await availableEntities.Incident.filter({ assigned_to_id: currentUser.id, status: { $ne: 'closed' } }) : [],
        complianceItems: availableEntities.ComplianceItem ? await availableEntities.ComplianceItem.filter({ assigned_to: currentUser.id, status: { $ne: 'completed' } }) : [],
        onboardingChecklists: availableEntities.OnboardingChecklist ? await availableEntities.OnboardingChecklist.filter({ overall_status: { $ne: 'completed' } }) : [],
        documentApprovals: availableEntities.DocumentApproval ? await availableEntities.DocumentApproval.filter({ workflow_stage: { $ne: 'completed' } }) : [],
        governanceMeetings: availableEntities.GovernanceMeeting ? await availableEntities.GovernanceMeeting.filter({ status: 'scheduled' }) : [],
        innovationRequests: availableEntities.InnovationRequest ? await availableEntities.InnovationRequest.filter({ status: { $ne: 'completed' } }) : [],
        legalCases: availableEntities.LegalCase ? await availableEntities.LegalCase.filter({ assigned_to: currentUser.id, status: 'open' }) : [],
        pressReleases: availableEntities.PressRelease ? await availableEntities.PressRelease.filter({ status: { $in: ['draft', 'review'] } }) : []
    };

    // Process tasks from various entities with workflow awareness
    dataSources.tasks.forEach(task => {
        myTasks.push({
            id: task.id,
            title: task.title,
            type: 'Direct Task',
            module: 'Task Management',
            dueDate: task.due_date,
            priority: task.priority,
            status: task.status,
            link: createPageUrl('StaffHQ'),
            workflowGenerated: task.created_by === 'system_workflow'
        });
    });

    // Marketing campaigns
    dataSources.campaigns.forEach(campaign => {
        myTasks.push({
            id: campaign.id,
            title: `Campaign: ${campaign.campaign_name}`,
            type: 'Marketing Campaign',
            module: 'Marketing',
            dueDate: campaign.target_date,
            priority: campaign.priority,
            status: campaign.status,
            link: createPageUrl('StaffHQ?tab=communications')
        });
    });

    // Event planning
    dataSources.eventPlans.forEach(eventPlan => {
        // Assuming eventPlan.departments and eventPlan.departments[x].tasks structure
        const overdueTasks = eventPlan.departments?.flatMap(dept => 
            dept.tasks?.filter(task => 
                task.status !== 'completed' && new Date(task.due_date) < new Date()
            ) || []
        ) || [];

        if (overdueTasks.length > 0) {
            myTasks.push({
                id: eventPlan.id,
                title: `Event Planning: ${eventPlan.event_name}`,
                type: 'Event Planning',
                module: 'Events',
                dueDate: eventPlan.event_date,
                priority: 'high',
                status: 'overdue',
                link: createPageUrl(`EventPlanDetail?id=${eventPlan.id}`)
            });
        }
    });

    // Compliance items with workflow integration
    dataSources.complianceItems.forEach(item => {
        if (item.status === 'overdue' && item.risk_level === 'critical') {
            // This would trigger workflow automatically
            InterHubWorkflowEngine.processEntityChange('ComplianceItem', item, 'update');
        }
        
        myTasks.push({
            id: item.id,
            title: `Compliance: ${item.title}`,
            type: 'Compliance Item',
            module: 'Governance',
            dueDate: item.due_date,
            priority: item.risk_level === 'critical' ? 'urgent' : item.risk_level,
            status: item.status,
            link: createPageUrl('StaffHQ?tab=governance')
        });
    });

    // Incidents with escalation workflow
    dataSources.incidents.forEach(incident => {
        if (incident.severity === 'level_4') {
            InterHubWorkflowEngine.processEntityChange('Incident', incident, 'update');
        }
        
        myTasks.push({
            id: incident.id,
            title: `Incident: ${incident.title}`,
            type: 'Incident Management',
            module: 'Safe Sport',
            dueDate: incident.due_date, // Assuming incidents have a due_date
            priority: incident.severity === 'level_4' ? 'critical' : 'high',
            status: incident.status,
            link: createPageUrl('IncidentManagementHub')
        });
    });

    // Document approvals
    dataSources.documentApprovals.forEach(approval => {
        const currentStepData = approval.approval_workflow?.find(step => 
            step.status === 'pending' && step.approver_name === currentUser.full_name
        );
        
        if (currentStepData) {
            myApprovals.push({
                id: approval.id,
                title: `Approve: ${approval.document_title}`,
                type: 'Document Approval',
                module: 'Governance',
                submittedDate: approval.submission_date,
                submittedBy: approval.submitted_by,
                priority: approval.priority,
                link: createPageUrl('StaffHQ?tab=governance')
            });
        }
    });

    // Legal cases
    dataSources.legalCases.forEach(legalCase => {
        if (legalCase.priority === 'critical') {
            InterHubWorkflowEngine.processEntityChange('LegalCase', legalCase, 'update');
        }
        
        myTasks.push({
            id: legalCase.id,
            title: `Legal: ${legalCase.case_title}`,
            type: 'Legal Case',
            module: 'Legal',
            dueDate: legalCase.deadline_date,
            priority: legalCase.priority,
            status: legalCase.status,
            link: createPageUrl('StaffHQ?tab=legal')
        });
    });

    // Sample notifications with AI insights integration
    const sampleNotifications = [
      { id: 'notif-1', title: 'New AI insight available', message: 'Club membership trend analysis completed', created_date: '2024-02-13T10:00:00Z', link_to: 'StaffHQ', notification_type: 'ai_insight' },
      { id: 'notif-2', title: 'Workflow task created', message: 'System created follow-up task for overdue compliance item', created_date: '2024-02-14T09:30:00Z', link_to: 'StaffHQ', notification_type: 'task_assigned' },
    ];

    const now = new Date();
    // Set next week to a date that includes the sample tasks' due dates for demonstration
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); 

    const upcomingDeadlines = [...myTasks, ...myApprovals]
      .filter(item => item.dueDate && new Date(item.dueDate) >= now && new Date(item.dueDate) <= nextWeek)
      .map(item => ({
        ...item,
        daysUntilDue: Math.ceil((new Date(item.dueDate) - now) / (1000 * 60 * 60 * 24))
      }))
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()); // Sort by actual date

    const overdueItems = myTasks.filter(item => item.dueDate && new Date(item.dueDate) < now).length;

    setWorkspaceData({
      myTasks: myTasks.sort((a, b) => new Date(a.dueDate || '9999-12-31').getTime() - new Date(b.dueDate || '9999-12-31').getTime()),
      myApprovals: myApprovals.sort((a, b) => new Date(b.submittedDate).getTime() - new Date(a.submittedDate).getTime()),
      myNotifications: sampleNotifications,
      upcomingDeadlines,
      recentActivity: []
    });
    
    setStats({
      totalTasks: myTasks.length,
      pendingApprovals: myApprovals.length,
      overdueItems,
      upcomingDeadlinesCount: upcomingDeadlines.length,
    });
  };

  const getPriorityIcon = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high': case 'critical': case 'urgent': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'medium': return <Clock className="w-4 h-4 text-yellow-500" />;
      default: return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };
  
   const getStatusBadge = (status) => {
    const statusConfig = {
      'not_started': { color: 'bg-gray-500', text: 'Not Started' },
      'in_progress': { color: 'bg-blue-500', text: 'In Progress' },
      'planning': { color: 'bg-yellow-500', text: 'Planning' },
      'review': { color: 'bg-orange-500', text: 'In Review' },
      'pending': { color: 'bg-yellow-500', text: 'Pending' },
      'open': { color: 'bg-blue-500', text: 'Open' },
      'new': { color: 'bg-purple-500', text: 'New' },
      'overdue': { color: 'bg-red-500', text: 'Overdue' } // Added overdue status
    };
    const config = statusConfig[status] || { color: 'bg-gray-500', text: status };
    return <Badge className={`${config.color} text-white text-xs capitalize`}>{config.text}</Badge>;
  };

  if (isLoading) {
    return <div className="p-6"><div className="animate-pulse h-64 bg-brand-card-bg rounded-lg"></div></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-brand-text-primary">
            Welcome back, {user?.full_name?.split(' ')[0] || 'there'}!
          </h1>
          <p className="text-brand-text-secondary">Here's your unified command center for today.</p>
        </div>
        <Button variant="outline" onClick={() => setIsSearchOpen(true)} className="flex items-center gap-2">
            <Search className="w-4 h-4" /> Quick Search
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* KPI Cards */}
        <Card className="bg-brand-card-bg border-brand-border">
          <CardContent className="p-4 flex items-center"><Target className="w-8 h-8 text-blue-500 mr-3" /><div><p className="text-2xl font-bold">{stats.totalTasks}</p><p className="text-sm text-brand-text-secondary">Active Tasks</p></div></CardContent>
        </Card>
        <Card className="bg-brand-card-bg border-brand-border">
          <CardContent className="p-4 flex items-center"><FileText className="w-8 h-8 text-purple-500 mr-3" /><div><p className="text-2xl font-bold">{stats.pendingApprovals}</p><p className="text-sm text-brand-text-secondary">Pending Approvals</p></div></CardContent>
        </Card>
         <Card className="bg-brand-card-bg border-brand-border">
          <CardContent className="p-4 flex items-center"><AlertTriangle className="w-8 h-8 text-red-500 mr-3" /><div><p className="text-2xl font-bold">{stats.overdueItems}</p><p className="text-sm text-brand-text-secondary">Overdue Items</p></div></CardContent>
        </Card>
        <Card className="bg-brand-card-bg border-brand-border">
          <CardContent className="p-4 flex items-center"><Calendar className="w-8 h-8 text-orange-500 mr-3" /><div><p className="text-2xl font-bold">{stats.upcomingDeadlinesCount}</p><p className="text-sm text-brand-text-secondary">Deadlines this Week</p></div></CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main workspace content */}
        <div className="lg:col-span-3">
          <Tabs defaultValue="tasks" className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-brand-card-bg border-brand-border">
              <TabsTrigger value="tasks">My Tasks ({workspaceData.myTasks.length})</TabsTrigger>
              <TabsTrigger value="approvals">My Approvals ({workspaceData.myApprovals.length})</TabsTrigger>
              <TabsTrigger value="deadlines">Upcoming Deadlines ({workspaceData.upcomingDeadlines.length})</TabsTrigger>
              <TabsTrigger value="notifications">Notifications ({workspaceData.myNotifications.length})</TabsTrigger>
            </TabsList>
            
            <TabsContent value="tasks" className="mt-6">
                <Card className="bg-brand-card-bg border-brand-border">
                    <CardHeader><CardTitle className="flex items-center"><Briefcase className="w-5 h-5 mr-2" />My Unified Tasks</CardTitle></CardHeader>
                    <CardContent>
                        {workspaceData.myTasks.length > 0 ? (
                            <div className="space-y-3">
                            {workspaceData.myTasks.map((task) => (
                                <div key={task.id} className="flex items-center justify-between p-3 bg-brand-charcoal/30 rounded-lg">
                                <div className="flex items-center space-x-3">
                                    {getPriorityIcon(task.priority)}
                                    <div>
                                    <h4 className="font-medium">{task.title}</h4>
                                    <div className="flex items-center space-x-2 mt-1">
                                        <Badge variant="secondary" className="text-xs">{task.module}</Badge>
                                        {getStatusBadge(task.status)}
                                        {task.dueDate && <span className="text-xs text-brand-text-secondary">Due: {format(new Date(task.dueDate), 'PP')}</span>}
                                    </div>
                                    </div>
                                </div>
                                <Button asChild size="sm" variant="outline"><Link to={task.link}>View</Link></Button>
                                </div>
                            ))}
                            </div>
                        ) : (
                             <div className="text-center py-8"><CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-500" /><p>You're all caught up!</p></div>
                        )}
                    </CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="approvals" className="mt-6">
                 <Card className="bg-brand-card-bg border-brand-border">
                    <CardHeader><CardTitle className="flex items-center"><CheckCircle className="w-5 h-5 mr-2 text-green-500" />Awaiting My Approval</CardTitle></CardHeader>
                    <CardContent>
                    {workspaceData.myApprovals.length > 0 ? (
                        <div className="space-y-3">
                        {workspaceData.myApprovals.map((item) => (
                            <div key={item.id} className="flex items-center justify-between p-3 bg-brand-charcoal/30 rounded-lg">
                            <div>
                                <h4 className="font-medium">{item.title}</h4>
                                <div className="flex items-center space-x-2 mt-1">
                                    <Badge variant="secondary" className="text-xs">{item.module}</Badge>
                                    {item.submittedBy && <span className="text-xs text-brand-text-secondary">From: {item.submittedBy}</span>}
                                    {item.submittedDate && <span className="text-xs text-brand-text-secondary">on {format(new Date(item.submittedDate), 'PP')}</span>}
                                </div>
                            </div>
                            <div className="flex space-x-2">
                                <Button size="sm" variant="outline">Review</Button>
                                <Button size="sm" className="bg-green-600 hover:bg-green-700">Approve</Button>
                            </div>
                            </div>
                        ))}
                        </div>
                    ) : (
                        <div className="text-center py-8"><CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-500" /><p>Approval queue is empty.</p></div>
                    )}
                    </CardContent>
                 </Card>
            </TabsContent>
             <TabsContent value="deadlines" className="mt-6">
                <Card className="bg-brand-card-bg border-brand-border">
                    <CardHeader><CardTitle className="flex items-center"><Calendar className="w-5 h-5 mr-2 text-orange-500" />Upcoming Deadlines</CardTitle></CardHeader>
                     <CardContent>
                    {workspaceData.upcomingDeadlines.length > 0 ? (
                        <div className="space-y-3">
                        {workspaceData.upcomingDeadlines.map((item) => (
                            <div key={item.id} className="flex items-center justify-between p-3 bg-brand-charcoal/30 rounded-lg">
                                <div className="flex items-center space-x-3">
                                    <div className="font-bold text-orange-500">{item.daysUntilDue}d</div>
                                    <div>
                                        <h4 className="font-medium">{item.title}</h4>
                                        <Badge variant="outline" className="text-xs">{item.module}</Badge>
                                    </div>
                                </div>
                                 <span className="text-sm text-brand-text-secondary">Due: {format(new Date(item.dueDate), 'MMM d')}</span>
                            </div>
                        ))}
                        </div>
                    ) : (
                         <div className="text-center py-8"><Calendar className="w-12 h-12 mx-auto mb-4 text-green-500" /><p>No deadlines in the next 7 days.</p></div>
                    )}
                    </CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="notifications" className="mt-6">
                <Card className="bg-brand-card-bg border-brand-border">
                    <CardHeader><CardTitle className="flex items-center"><Bell className="w-5 h-5 mr-2 text-blue-500"/>Recent Notifications</CardTitle></CardHeader>
                    <CardContent>
                    {workspaceData.myNotifications.length > 0 ? (
                         <div className="space-y-3">
                         {workspaceData.myNotifications.map((n) => (
                            <div key={n.id} className="p-3 bg-brand-charcoal/30 rounded-lg">
                                <h4 className="font-medium">{n.title}</h4>
                                <p className="text-sm text-brand-text-secondary mt-1">{n.message}</p>
                                <div className="flex items-center justify-between mt-2">
                                    <span className="text-xs text-brand-text-secondary">{formatDistanceToNow(new Date(n.created_date), { addSuffix: true })}</span>
                                    <Button asChild size="sm" variant="outline"><Link to={createPageUrl(n.link_to || '')}>View</Link></Button>
                                </div>
                            </div>
                         ))}
                         </div>
                    ) : (
                        <div className="text-center py-8"><Bell className="w-12 h-12 mx-auto mb-4 text-gray-500" /><p>No new notifications.</p></div>
                    )}
                    </CardContent>
                </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        {/* AI Insights Sidebar */}
        <div className="lg:col-span-1">
          <ProactiveAIInsights maxInsights={5} />
        </div>
      </div>

      <GlobalSearch isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </div>
  );
}
