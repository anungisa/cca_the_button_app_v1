
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  ClipboardList, Calendar, MessageSquare, FileText, Users, BarChart3,
  Clock, Target, Briefcase, Settings, AlertTriangle, CheckCircle2,
  Mail, Phone, Video, Share2, Archive, Search, Bell, Zap,
  Database, Shield, Smartphone, Globe, RefreshCw, BookOpen,
  PieChart, TrendingUp, UserCheck, GitBranch, Workflow,
  Timer, MapPin, CreditCard, ShoppingCart, Upload, Download,
  Edit3, Trash2, Copy, Filter, SortAsc, Eye, Lock, Unlock,
  Plus, Minus, RotateCcw, Save, Send, Reply, Forward, Star,
  Tag, Paperclip, Image, Link, Code, Terminal, Package,
  HardDrive, Cpu, Monitor, Headphones, Mic, Camera, Printer,
  Wifi, Bluetooth, Battery, Signal, Activity, Hash, AtSign,
  DollarSign, Percent, Calendar as CalendarIcon, Home, Building,
  Car, Plane, Train, Ship, Truck, Bike, Coffee, Utensils,
  ShoppingBag, Gift, Heart, ThumbsUp, Smile, Frown, Meh,
  Sun, Moon, Cloud, Umbrella, Snowflake, Thermometer,
  Volume2, VolumeX, Play, Pause, Square, SkipBack, SkipForward,
  Lightbulb
} from 'lucide-react';

const ProductivityGap = ({ category, title, description, impact, effort, priority, icon: Icon }) => (
  <div className="flex items-start gap-4 p-4 bg-brand-charcoal/50 rounded-lg">
    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
      priority === 'critical' ? 'bg-red-600/20 text-red-400' :
      priority === 'high' ? 'bg-orange-600/20 text-orange-400' :
      priority === 'medium' ? 'bg-yellow-600/20 text-yellow-400' :
      'bg-blue-600/20 text-blue-400'
    }`}>
      <Icon className="w-5 h-5" />
    </div>
    <div className="flex-1">
      <div className="flex items-start justify-between mb-2">
        <h4 className="font-semibold text-brand-text-primary">{title}</h4>
        <div className="flex items-center gap-2">
          <Badge variant={
            priority === 'critical' ? 'destructive' :
            priority === 'high' ? 'default' :
            'secondary'
          } className="text-xs">
            {priority}
          </Badge>
        </div>
      </div>
      <p className="text-sm text-brand-text-secondary mb-3">{description}</p>
      <div className="flex items-center gap-4 text-xs">
        <span className="text-brand-text-secondary">Impact: <span className="text-brand-text-primary font-medium">{impact}</span></span>
        <span className="text-brand-text-secondary">Effort: <span className="text-brand-text-primary font-medium">{effort}</span></span>
      </div>
    </div>
  </div>
);

export default function StaffProductivityAssessment() {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const missingProductivityTools = [
    // Task & Project Management
    {
      category: 'task_management',
      title: 'Task Management System',
      description: 'No unified task assignment, tracking, or project management system. Staff rely on external tools or ad-hoc methods.',
      impact: 'Very High',
      effort: 'High',
      priority: 'critical',
      icon: ClipboardList
    },
    {
      category: 'task_management',
      title: 'Project Templates & Workflows',
      description: 'No standardized project templates or automated workflows for common processes like event planning or campaign execution.',
      impact: 'High',
      effort: 'Medium',
      priority: 'high',
      icon: Workflow
    },
    {
      category: 'task_management',
      title: 'Time Tracking & Timesheets',
      description: 'No built-in time tracking for projects, campaigns, or billable work. Critical for resource allocation and reporting.',
      impact: 'High',
      effort: 'Medium',
      priority: 'high',
      icon: Timer
    },

    // Communication & Collaboration
    {
      category: 'communication',
      title: 'Internal Chat/Teams Integration',
      description: 'No native chat system or proper Microsoft Teams integration for real-time team communication.',
      impact: 'Very High',
      effort: 'High',
      priority: 'critical',
      icon: MessageSquare
    },
    {
      category: 'communication',
      title: 'Video Conferencing Integration',
      description: 'No integrated video meeting scheduling or joining capabilities within the platform.',
      impact: 'Medium',
      effort: 'Medium',
      priority: 'medium',
      icon: Video
    },
    {
      category: 'communication',
      title: 'Announcement System',
      description: 'No centralized way to broadcast announcements to staff or specific teams with read receipts.',
      impact: 'Medium',
      effort: 'Low',
      priority: 'high',
      icon: Bell
    },

    // Document & Knowledge Management
    {
      category: 'documents',
      title: 'Document Version Control',
      description: 'No version control system for documents. Staff may work on outdated versions or lose track of changes.',
      impact: 'High',
      effort: 'High',
      priority: 'high',
      icon: GitBranch
    },
    {
      category: 'documents',
      title: 'Collaborative Document Editing',
      description: 'No real-time collaborative editing capabilities. Must rely on external tools like Google Docs or SharePoint.',
      impact: 'High',
      effort: 'Very High',
      priority: 'medium',
      icon: Edit3
    },
    {
      category: 'documents',
      title: 'Document Templates Library',
      description: 'No centralized library of document templates for common tasks (contracts, reports, proposals).',
      impact: 'Medium',
      effort: 'Low',
      priority: 'medium',
      icon: Archive
    },
    {
      category: 'documents',
      title: 'File Sharing & Access Control',
      description: 'No granular file sharing with permission controls. Limited ability to securely share documents with external partners.',
      impact: 'High',
      effort: 'Medium',
      priority: 'high',
      icon: Lock
    },

    // Calendar & Scheduling
    {
      category: 'scheduling',
      title: 'Resource Booking System',
      description: 'No way to book meeting rooms, equipment, or other shared resources through the platform.',
      impact: 'Medium',
      effort: 'Medium',
      priority: 'medium',
      icon: MapPin
    },
    {
      category: 'scheduling',
      title: 'Meeting Scheduling Assistant',
      description: 'No intelligent meeting scheduling that checks availability across team members and suggests optimal times.',
      impact: 'Medium',
      effort: 'Medium',
      priority: 'low',
      icon: Calendar
    },
    {
      category: 'scheduling',
      title: 'Shared Team Calendars',
      description: 'No shared calendars for teams to see each other\'s availability and important dates.',
      impact: 'High',
      effort: 'Medium',
      priority: 'high',
      icon: CalendarIcon
    },

    // Approval & Workflow Systems
    {
      category: 'workflow',
      title: 'Budget Approval Workflows',
      description: 'No automated approval workflows for expenses, purchases, or budget requests with proper audit trails.',
      impact: 'Very High',
      effort: 'High',
      priority: 'critical',
      icon: DollarSign
    },
    {
      category: 'workflow',
      title: 'Content Approval Pipeline',
      description: 'No structured approval process for marketing materials, press releases, or social media content.',
      impact: 'High',
      effort: 'Medium',
      priority: 'high',
      icon: CheckCircle2
    },
    {
      category: 'workflow',
      title: 'Travel & Expense Management',
      description: 'No integrated system for travel requests, expense reporting, and reimbursement processing.',
      impact: 'High',
      effort: 'High',
      priority: 'medium',
      icon: Plane
    },

    // Analytics & Reporting
    {
      category: 'analytics',
      title: 'Staff Performance Dashboards',
      description: 'No individual or team performance tracking dashboards for productivity metrics and goal tracking.',
      impact: 'Medium',
      effort: 'High',
      priority: 'medium',
      icon: TrendingUp
    },
    {
      category: 'analytics',
      title: 'Custom Report Builder',
      description: 'No tool for staff to create custom reports from platform data without technical assistance.',
      impact: 'Medium',
      effort: 'Very High',
      priority: 'low',
      icon: BarChart3
    },
    {
      category: 'analytics',
      title: 'Automated Report Generation',
      description: 'No scheduled report generation and distribution for regular business reporting.',
      impact: 'Medium',
      effort: 'Medium',
      priority: 'medium',
      icon: RefreshCw
    },

    // Integration & Automation
    {
      category: 'integration',
      title: 'Email Integration (Outlook/Gmail)',
      description: 'No deep integration with email systems for tracking communications or creating tasks from emails.',
      impact: 'High',
      effort: 'High',
      priority: 'high',
      icon: Mail
    },
    {
      category: 'integration',
      title: 'Office 365/Google Workspace Integration',
      description: 'Limited integration with productivity suites. Can\'t directly edit or create documents in the platform.',
      impact: 'High',
      effort: 'Very High',
      priority: 'medium',
      icon: Package
    },
    {
      category: 'integration',
      title: 'Automation Rules Engine',
      description: 'No way to create custom automation rules (if X happens, then do Y) for common workflow patterns.',
      impact: 'Medium',
      effort: 'Very High',
      priority: 'low',
      icon: Zap
    },

    // Mobile & Remote Work
    {
      category: 'mobile',
      title: 'Offline Mobile Functionality',
      description: 'No offline capabilities for mobile users. Staff can\'t work during travel or poor connectivity.',
      impact: 'Medium',
      effort: 'Very High',
      priority: 'low',
      icon: Smartphone
    },
    {
      category: 'mobile',
      title: 'Mobile Push Notifications',
      description: 'No push notifications for mobile devices. Staff miss urgent updates or tasks when away from desktop.',
      impact: 'Medium',
      effort: 'Medium',
      priority: 'medium',
      icon: Bell
    },

    // Security & Compliance
    {
      category: 'security',
      title: 'Activity Logging & Audit Trails',
      description: 'Limited activity logging for compliance and security auditing. Can\'t track who did what when.',
      impact: 'High',
      effort: 'Medium',
      priority: 'high',
      icon: Shield
    },
    {
      category: 'security',
      title: 'Data Backup & Recovery Tools',
      description: 'No self-service data backup or recovery tools for staff. Dependent on IT for data restoration.',
      impact: 'Medium',
      effort: 'High',
      priority: 'medium',
      icon: HardDrive
    },

    // Customization & Personalization
    {
      category: 'customization',
      title: 'Customizable Dashboards',
      description: 'Staff can\'t customize their workspace or dashboards to show most relevant information for their role.',
      impact: 'Medium',
      effort: 'High',
      priority: 'low',
      icon: Settings
    },
    {
      category: 'customization',
      title: 'Personal Productivity Tools',
      description: 'No personal notes, bookmarks, or productivity features like pomodoro timers or focus modes.',
      impact: 'Low',
      effort: 'Medium',
      priority: 'low',
      icon: Target
    }
  ];

  const categories = [
    { id: 'all', name: 'All Categories', count: missingProductivityTools.length },
    { id: 'task_management', name: 'Task Management', count: missingProductivityTools.filter(t => t.category === 'task_management').length },
    { id: 'communication', name: 'Communication', count: missingProductivityTools.filter(t => t.category === 'communication').length },
    { id: 'documents', name: 'Documents', count: missingProductivityTools.filter(t => t.category === 'documents').length },
    { id: 'workflow', name: 'Workflow', count: missingProductivityTools.filter(t => t.category === 'workflow').length },
    { id: 'scheduling', name: 'Scheduling', count: missingProductivityTools.filter(t => t.category === 'scheduling').length },
    { id: 'analytics', name: 'Analytics', count: missingProductivityTools.filter(t => t.category === 'analytics').length },
    { id: 'integration', name: 'Integration', count: missingProductivityTools.filter(t => t.category === 'integration').length },
    { id: 'mobile', name: 'Mobile', count: missingProductivityTools.filter(t => t.category === 'mobile').length },
    { id: 'security', name: 'Security', count: missingProductivityTools.filter(t => t.category === 'security').length },
    { id: 'customization', name: 'Customization', count: missingProductivityTools.filter(t => t.category === 'customization').length }
  ];

  const filteredTools = selectedCategory === 'all' 
    ? missingProductivityTools 
    : missingProductivityTools.filter(tool => tool.category === selectedCategory);

  const priorityStats = {
    critical: missingProductivityTools.filter(t => t.priority === 'critical').length,
    high: missingProductivityTools.filter(t => t.priority === 'high').length,
    medium: missingProductivityTools.filter(t => t.priority === 'medium').length,
    low: missingProductivityTools.filter(t => t.priority === 'low').length
  };

  return (
    <div className="min-h-screen bg-brand-charcoal p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-brand-text-primary mb-4">Staff Productivity Tools Assessment</h1>
          <p className="text-xl text-brand-text-secondary max-w-3xl mx-auto">
            Complete analysis of missing productivity features that impact daily staff workflows and efficiency.
          </p>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-red-900/20 border-red-500/30">
            <CardContent className="p-6 text-center">
              <AlertTriangle className="w-8 h-8 text-red-400 mx-auto mb-2" />
              <div className="text-3xl font-bold text-red-400">{priorityStats.critical}</div>
              <div className="text-sm text-brand-text-secondary">Critical Gaps</div>
            </CardContent>
          </Card>
          <Card className="bg-orange-900/20 border-orange-500/30">
            <CardContent className="p-6 text-center">
              <Clock className="w-8 h-8 text-orange-400 mx-auto mb-2" />
              <div className="text-3xl font-bold text-orange-400">{priorityStats.high}</div>
              <div className="text-sm text-brand-text-secondary">High Priority</div>
            </CardContent>
          </Card>
          <Card className="bg-yellow-900/20 border-yellow-500/30">
            <CardContent className="p-6 text-center">
              <Target className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
              <div className="text-3xl font-bold text-yellow-400">{priorityStats.medium}</div>
              <div className="text-sm text-brand-text-secondary">Medium Priority</div>
            </CardContent>
          </Card>
          <Card className="bg-blue-900/20 border-blue-500/30">
            <CardContent className="p-6 text-center">
              <Lightbulb className="w-8 h-8 text-blue-400 mx-auto mb-2" />
              <div className="text-3xl font-bold text-blue-400">{priorityStats.low}</div>
              <div className="text-sm text-brand-text-secondary">Nice to Have</div>
            </CardContent>
          </Card>
        </div>

        <Alert className="bg-red-900/20 border-red-500/30">
          <AlertTriangle className="h-4 w-4 text-red-400" />
          <AlertDescription className="text-brand-text-primary">
            <strong>Staff Productivity Score: 35%</strong> - Significant productivity tools are missing. 
            Staff likely rely heavily on external tools, leading to fragmented workflows and reduced efficiency.
            Priority should be given to task management, communication tools, and approval workflows.
          </AlertDescription>
        </Alert>

        {/* Category Filter */}
        <Card className="bg-brand-card-bg border-brand-border">
          <CardHeader>
            <CardTitle>Filter by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-brand-red text-white'
                      : 'bg-brand-charcoal text-brand-text-secondary hover:text-brand-text-primary hover:bg-brand-border'
                  }`}
                >
                  {category.name} ({category.count})
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Missing Tools List */}
        <Card className="bg-brand-card-bg border-brand-border">
          <CardHeader>
            <CardTitle>
              Missing Productivity Tools
              {selectedCategory !== 'all' && (
                <span className="text-brand-text-secondary ml-2">
                  - {categories.find(c => c.id === selectedCategory)?.name}
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredTools.map((tool, index) => (
                <ProductivityGap key={index} {...tool} />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
