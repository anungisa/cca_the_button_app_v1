
import React, { Suspense, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"; // Keep tabs imports as they might be used elsewhere, though not in the final AdminTools render.
import {
  Settings,
  Users,
  Database,
  Activity, // New
  Shield,
  FileText, // New
  BarChart3,
  Wrench, // New
  Brain, // New
  Workflow, // New (replacing Repeat for workflows)
  Repeat // Kept for completeness if it was used for something else, but Workflow is more specific for 'Workflows'
} from 'lucide-react';
import EventTemplateManager from '../eventops/EventTemplateManager';
import WorkflowManager from './WorkflowManager';

// Assuming usePermissions is a custom hook available in the project
import usePermissions from '@/hooks/usePermissions'; // Make sure this path is correct for your project

// Lazy-loaded components for the dynamic sections
const UserManagement = React.lazy(() => import('./UserManagement'));
const DataHealthDashboard = React.lazy(() => import('./DataHealthDashboard'));
const UserAccessAudit = React.lazy(() => import('./UserAccessAudit'));
const AISystemsManager = React.lazy(() => import('./AISystemsManager')); // New lazy-loaded component

export default function AdminTools() {
  const [activeSection, setActiveSection] = useState('overview'); // Initial state set to 'overview'
  const { permissions, roles } = usePermissions(); // Assuming this hook provides roles and permissions
  const isSuperAdmin = roles.includes('admin'); // Check if the user has 'admin' role

  // If user is not a super admin, deny access
  if (!isSuperAdmin) {
    return (
      <div className="p-8 text-center bg-brand-card-bg border-brand-border rounded-lg">
        <Shield className="w-12 h-12 mx-auto text-yellow-400 mb-4" />
        <h2 className="text-xl font-bold text-brand-text-primary">Access Denied</h2>
        <p className="text-brand-text-secondary">You need super admin privileges to access these tools.</p>
      </div>
    );
  }

  // Define the admin sections and their associated components and metadata
  const adminSections = [
    {
      id: 'users',
      name: 'User Management',
      description: 'Manage user accounts and roles',
      icon: Users,
      component: UserManagement,
      color: 'from-blue-600 to-cyan-600'
    },
    {
      id: 'workflows',
      name: 'Workflows',
      description: 'Automate tasks and processes',
      icon: Workflow, // Changed from Repeat to Workflow
      component: WorkflowManager,
      color: 'from-green-600 to-teal-600'
    },
    {
      id: 'data',
      name: 'Data Health',
      description: 'Monitor database health and integrity',
      icon: Database,
      component: DataHealthDashboard,
      color: 'from-orange-600 to-red-600'
    },
    {
      id: 'audit',
      name: 'Access Audit',
      description: 'Review user access logs and permissions',
      icon: Shield,
      component: UserAccessAudit,
      color: 'from-yellow-600 to-amber-600'
    },
    {
      id: 'ai_systems',
      name: 'AI Systems',
      description: 'Manage AI and machine learning systems',
      icon: Brain,
      component: AISystemsManager,
      color: 'from-purple-600 to-indigo-600'
    },
    // Add other admin sections here as needed
  ];

  // Determine the component to render based on the active section
  const ActiveComponent = adminSections.find(section => section.id === activeSection)?.component;

  return (
    <div className="space-y-6">
      {/* Existing Event Workflow Configuration Card - this remains unchanged */}
      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <SlidersHorizontal className="w-6 h-6 text-brand-red" />
            Event Workflow Configuration
          </CardTitle>
          <p className="text-brand-text-secondary">Manage the templates that power automated event plans.</p>
        </CardHeader>
        <CardContent>
          <EventTemplateManager />
        </CardContent>
      </Card>

      {/* New Admin Tools section with a sidebar navigation and main content area */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-1">
          <Card className="bg-brand-card-bg border-brand-border">
            <CardHeader>
              <CardTitle className="text-lg">Admin Tools</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {adminSections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    activeSection === section.id
                      ? 'bg-brand-red/20 border border-brand-red/30' // Highlight active section
                      : 'hover:bg-brand-charcoal/50' // Hover effect for inactive sections
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${section.color} flex items-center justify-center`}>
                      <section.icon className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <div className="font-medium text-brand-text-primary">{section.name}</div>
                      <div className="text-xs text-brand-text-secondary">{section.description}</div>
                    </div>
                  </div>
                </button>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-3">
          {ActiveComponent ? (
            <Suspense fallback={<Card className="bg-brand-card-bg border-brand-border p-6 text-center"><div className="text-brand-text-secondary">Loading {activeSection.replace(/_/g, ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}...</div></Card>}>
              <ActiveComponent />
            </Suspense>
          ) : (
            // Default message when no section is active or 'overview' is selected
            <Card className="bg-brand-card-bg border-brand-border">
              <CardContent className="text-center py-12">
                <Settings className="w-12 h-12 mx-auto text-brand-text-secondary mb-4" />
                <h3 className="text-lg font-medium text-brand-text-primary mb-2">Select an Admin Tool</h3>
                <p className="text-brand-text-secondary">
                  Choose a tool from the sidebar to get started.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

// Mock usePermissions hook for local development/demonstration if not provided externally
// In a real application, this would be imported from a centralized hooks file (e.g., '@/hooks/usePermissions')
declare module '@/hooks/usePermissions' {
  const usePermissions: () => {
    permissions: Record<string, boolean>;
    roles: string[];
  };
  export default usePermissions;
}

// Simple mock implementation if the above module declaration is not enough
// For a fully functional file, if '@/hooks/usePermissions' doesn't exist, this should be uncommented or a real hook provided.
/*
const usePermissions = () => {
  // For demonstration, let's assume the user is an admin by default.
  // In a real app, this would come from an authentication context or API.
  const roles = ['user', 'admin']; 
  const permissions = {}; 
  return { permissions, roles };
};
*/
