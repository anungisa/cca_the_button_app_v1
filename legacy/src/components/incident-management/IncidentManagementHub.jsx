
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Incident } from '@/api/entities';
import { User } from '@/api/entities';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  PlusCircle,
  AlertCircle,
  Loader2,
  BarChart3,
  Filter,
  Settings,
  FileCheck,
  TrendingUp,
  Brain,
  Database,
  FolderOpen,
  MessageSquare,
  AlertTriangle,
  Plus,
  Search,
  Clock,
  CheckCircle,
  XCircle,
  Users,
  FileText,
  Calendar,
  Shield
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import IncidentList from './IncidentList';
import IncidentFilters from './IncidentFilters';
import CreateIncidentModal from './CreateIncidentModal';
import IncidentStats from './IncidentStats';
import IncidentDetailModal from './IncidentDetailModal';
import EscalationEngine from './EscalationEngine';
import SharePointIntegration from './SharePointIntegration';
import DOMOIntegration from './DOMOIntegration';
import AIClassificationEngine from './AIClassificationEngine';
import PredictiveAnalytics from './PredictiveAnalytics';
import ExecutiveDashboard from './ExecutiveDashboard';
import { usePermissions } from '../hooks/usePermissions';

export default function IncidentManagementHub() {
  const [incidents, setIncidents] = useState([]);
  const [filteredIncidents, setFilteredIncidents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  
  const [filters, setFilters] = useState({
    status: 'all',
    priority: 'all',
    category: 'all',
    department: 'all'
  });

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [selectedEscalationIncident, setSelectedEscalationIncident] = useState(null);

  const { permissions, roles, isLoading: permissionsLoading } = usePermissions();
  const canViewModule = permissions.canAccessStaffHQ || roles.includes('admin');
  const canViewExecutive = permissions.canAccessExecutiveHub || roles.includes('admin');
  // canManageIntegrations will now effectively only be used if there are other admin-specific features beyond the integrations tab
  const canManageIntegrations = roles.includes('admin'); 

  const loadIncidents = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const allIncidents = await Incident.list('-created_date', 1000);
      setIncidents(allIncidents);
    } catch (err) {
      console.error("Failed to load incidents:", err);
      setError("Could not load incidents. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!permissionsLoading && canViewModule) {
      loadIncidents();
    }
  }, [loadIncidents, permissionsLoading, canViewModule]);

  const handleIncidentCreated = () => {
    setIsCreateModalOpen(false);
    loadIncidents();
  };
  
  const handleIncidentUpdated = () => {
    setSelectedIncident(null);
    setSelectedEscalationIncident(null);
    loadIncidents();
  };

  const activeFiltersCount = Object.values(filters).filter(v => v !== 'all').length;

  useEffect(() => {
    const applyFilters = () => {
      let result = incidents;
      
      if (filters.status !== 'all') {
        result = result.filter(i => i.status === filters.status);
      }
      if (filters.priority !== 'all') {
        result = result.filter(i => i.priority === filters.priority);
      }
      if (filters.category !== 'all') {
        result = result.filter(i => i.category === filters.category);
      }
      if (filters.department !== 'all') {
        result = result.filter(i => i.assigned_department === filters.department);
      }
      
      setFilteredIncidents(result);
    };

    // Apply filters if there are incidents or if filters are active
    if (incidents.length > 0 || activeFiltersCount > 0) {
      applyFilters();
    } else if (incidents.length === 0) {
      // If no incidents and no active filters, ensure filtered list is empty
      setFilteredIncidents([]);
    }
  }, [incidents, filters, activeFiltersCount]);

  // Count incidents by status for tab badges using useCallback for memoization
  const getIncidentCounts = useCallback((data) => {
    const total = data.length;
    const open = data.filter(i => ['new', 'open', 'in_progress'].includes(i.status)).length;
    const escalated = data.filter(i => i.escalation_level > 0).length;
    const critical = data.filter(i => i.priority === 'critical').length;
    
    return { total, open, escalated, critical };
  }, []);

  // Use useMemo to memoize incident counts based on filteredIncidents
  const incidentCounts = useMemo(() => getIncidentCounts(filteredIncidents), [filteredIncidents, getIncidentCounts]);
  
  if (permissionsLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-brand-charcoal">
        <Loader2 className="w-8 h-8 animate-spin text-brand-red" />
        <p className="ml-2 text-brand-text-primary">Loading permissions...</p>
      </div>
    );
  }

  if (!canViewModule) {
    return (
      <div className="p-8 text-center bg-brand-background h-screen flex flex-col justify-center items-center">
        <Card className="max-w-md w-full bg-brand-card-bg border-brand-border">
          <CardContent className="p-8 text-center">
            <Shield className="w-12 h-12 text-brand-text-secondary mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-brand-text-primary mb-2">Access Restricted</h3>
            <p className="text-brand-text-secondary">You do not have permission to view the Incident Management Hub. Please contact your administrator if you believe this is an error.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const tabsConfig = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: BarChart3,
      badge: incidentCounts.total > 0 ? incidentCounts.total : null,
      content: (
        <div className="space-y-6">
          <IncidentStats /> {/* IncidentStats remains inside dashboard tab */}
          <div className="mt-6">
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-brand-red" />
              </div>
            ) : error ? (
              <div className="text-center py-12 text-red-400">
                <AlertCircle className="w-12 h-12 mx-auto mb-4" />
                <p>{error}</p>
              </div>
            ) : (
              <IncidentList 
                incidents={filteredIncidents} // Dashboard list uses globally filtered incidents
                onSelectIncident={setSelectedIncident}
              />
            )}
          </div>
        </div>
      )
    },
    {
      id: 'escalations',
      label: 'Escalations',
      icon: TrendingUp,
      badge: incidentCounts.escalated > 0 ? incidentCounts.escalated : null,
      content: (
        <div className="space-y-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-brand-text-primary mb-2">Escalation Management</h2>
            <p className="text-brand-text-secondary">Manage incident escalations and SLA breaches</p>
          </div>
          <IncidentList 
            // Escalation list now filters from globally filtered incidents
            incidents={filteredIncidents.filter(i => i.escalation_level > 0 || i.status === 'escalated')}
            onSelectIncident={setSelectedEscalationIncident}
          />
        </div>
      )
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: BarChart3,
      content: (
        <div className="space-y-6">
          <PredictiveAnalytics incidents={incidents} /> {/* PredictiveAnalytics uses all incidents */}
          <IncidentStats /> {/* IncidentStats remains here */}
        </div>
      )
    },
    {
      id: 'ai_classification',
      label: 'AI Engine',
      icon: Brain,
      content: <AIClassificationEngine incidents={incidents} onRetrain={loadIncidents} />
    },
    {
      id: 'integrations',
      label: 'Integrations',
      icon: Database,
      content: (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SharePointIntegration incident={selectedIncident} />
          <DOMOIntegration incidents={incidents} onDataPushed={() => console.log('Data pushed to DOMO')} />
        </div>
      ),
      // requiresAdmin: true removed - now visible to all staff
    }
  ];

  // Add executive tab if user has permission
  if (canViewExecutive) {
    tabsConfig.push({
      id: 'executive',
      label: 'Executive',
      icon: FileCheck,
      content: <ExecutiveDashboard incidents={incidents} />
    });
  }

  // The 'availableTabs' filtering is no longer necessary as 'requiresAdmin'
  // was removed from 'integrations' tab and 'executive' tab is conditionally added.

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-brand-text-primary flex items-center gap-3">
            <AlertCircle className="w-7 h-7 text-brand-red" />
            Unified Incident Management
          </h1>
          <p className="text-brand-text-secondary mt-1">
            Central hub for tracking, managing, and resolving all organizational incidents.
          </p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)} className="bg-brand-red hover:bg-red-700">
          <PlusCircle className="w-5 h-5 mr-2" />
          Create Incident
        </Button>
      </div>

      {/* New Card for global filters */}
      <Card className="bg-brand-card-bg border-brand-border p-4">
        <CardHeader className="p-0 pb-4">
          <CardTitle className="text-lg font-semibold text-brand-text-primary flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Global Filters
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <IncidentFilters 
            filters={filters}
            onFiltersChange={setFilters}
            activeFiltersCount={activeFiltersCount}
          />
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-6 bg-brand-card-bg border-brand-border">
          {tabsConfig.map((tab) => (
            <TabsTrigger 
              key={tab.id} 
              value={tab.id} 
              className="flex items-center gap-2"
            >
              <tab.icon className="w-4 h-4" />
              <span className="hidden sm:block">{tab.label}</span>
              {tab.badge && (
                <Badge className="bg-brand-red text-white text-xs ml-1">
                  {tab.badge > 99 ? '99+' : tab.badge}
                </Badge>
              )}
            </TabsTrigger>
          ))}
        </TabsList>

        {tabsConfig.map((tab) => (
          <TabsContent key={tab.id} value={tab.id} className="mt-6">
            {tab.content}
          </TabsContent>
        ))}
      </Tabs>

      {/* Modals */}
      <CreateIncidentModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onIncidentCreated={handleIncidentCreated}
      />

      {selectedIncident && (
        <IncidentDetailModal
          incident={selectedIncident}
          isOpen={!!selectedIncident}
          onClose={() => setSelectedIncident(null)}
          onUpdate={handleIncidentUpdated}
        />
      )}

      {selectedEscalationIncident && (
        <EscalationEngine
          incident={selectedEscalationIncident}
          onEscalate={handleIncidentUpdated}
          onClose={() => setSelectedEscalationIncident(null)}
        />
      )}
    </div>
  );
}
