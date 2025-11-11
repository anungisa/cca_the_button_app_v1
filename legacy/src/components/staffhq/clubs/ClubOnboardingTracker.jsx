
import React, { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  CheckCircle,
  Clock,
  AlertTriangle,
  Users,
  FileText,
  Shield,
  CreditCard,
  Settings,
  Phone,
  Mail,
  Loader2
} from 'lucide-react';
import { Club } from '@/api/entities';

const ONBOARDING_STEPS = [
  { id: 'registration', name: 'Initial Registration', icon: FileText, weight: 10 },
  { id: 'contact_verification', name: 'Contact Verification', icon: Phone, weight: 15 },
  { id: 'safe_sport_setup', name: 'Safe Sport Setup', icon: Shield, weight: 20 },
  { id: 'financial_setup', name: 'Financial Information', icon: CreditCard, weight: 15 },
  { id: 'platform_training', name: 'Platform Training', icon: Settings, weight: 25 },
  { id: 'first_event', name: 'First Event Created', icon: Users, weight: 15 }
];

export default function ClubOnboardingTracker() {
  const [clubs, setClubs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [clubsPerPage, setClubsPerPage] = useState(10);

  useEffect(() => {
    const loadClubs = async () => {
      setIsLoading(true);
      try {
        const clubsData = await Club.list();
        setClubs(clubsData || []);
      } catch (error) {
        console.error("Failed to load clubs for onboarding tracker:", error);
        setClubs([]);
      } finally {
        setIsLoading(false);
      }
    };
    loadClubs();
  }, []);

  const clubsWithOnboarding = useMemo(() => {
    if (!clubs || clubs.length === 0) return [];
    return clubs.map(club => {
      // Simulate onboarding progress
      const completedSteps = ONBOARDING_STEPS.filter(() => Math.random() > 0.3);
      const totalWeight = ONBOARDING_STEPS.reduce((sum, step) => sum + step.weight, 0);
      const completedWeight = completedSteps.reduce((sum, step) => sum + step.weight, 0);
      const progress = Math.round((completedWeight / totalWeight) * 100);
      
      let status = 'not_started';
      if (progress === 100) status = 'completed';
      else if (progress > 0) status = 'in_progress';
      
      return {
        ...club,
        onboarding: {
          progress,
          status,
          completedSteps: completedSteps.map(s => s.id),
          currentStep: completedSteps.length < ONBOARDING_STEPS.length 
            ? ONBOARDING_STEPS[completedSteps.length].id 
            : null
        }
      };
    });
  }, [clubs]);

  const filteredClubs = useMemo(() => {
    let filtered = clubsWithOnboarding;
    
    // The previous 'selectedRegion' filter is removed as the component no longer receives that prop
    
    if (filterStatus !== 'all') {
      filtered = filtered.filter(club => club.onboarding.status === filterStatus);
    }
    
    return filtered;
  }, [clubsWithOnboarding, filterStatus]);

  const totalPages = Math.ceil(filteredClubs.length / clubsPerPage);

  const paginatedClubs = useMemo(() => {
    const indexOfLastClub = currentPage * clubsPerPage;
    const indexOfFirstClub = indexOfLastClub - clubsPerPage;
    return filteredClubs.slice(indexOfFirstClub, indexOfLastClub);
  }, [filteredClubs, currentPage, clubsPerPage]);

  const onboardingStats = useMemo(() => {
    const total = clubsWithOnboarding.length;
    const completed = clubsWithOnboarding.filter(c => c.onboarding.status === 'completed').length;
    const inProgress = clubsWithOnboarding.filter(c => c.onboarding.status === 'in_progress').length;
    const notStarted = clubsWithOnboarding.filter(c => c.onboarding.status === 'not_started').length;
    const avgProgress = total > 0 
      ? Math.round(clubsWithOnboarding.reduce((sum, c) => sum + c.onboarding.progress, 0) / total)
      : 0;

    return { total, completed, inProgress, notStarted, avgProgress };
  }, [clubsWithOnboarding]);

  const getStatusBadge = (status) => {
    const config = {
      completed: { color: 'bg-green-500', text: 'Completed' },
      in_progress: { color: 'bg-blue-500', text: 'In Progress' },
      not_started: { color: 'bg-gray-500', text: 'Not Started' }
    };
    const { color, text } = config[status];
    return <Badge className={`${color} text-white`}>{text}</Badge>;
  };
  
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleClubsPerPageChange = (value) => {
    setClubsPerPage(Number(value));
    setCurrentPage(1); // Reset to first page when clubs per page changes
  };
  
  const handleFilterChange = (value) => {
    setFilterStatus(value);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-64"><Loader2 className="w-8 h-8 animate-spin" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-brand-card-bg border-brand-border">
          <CardContent className="p-4 text-center">
            <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-brand-text-primary">{onboardingStats.completed}</p>
            <p className="text-sm text-brand-text-secondary">Completed</p>
          </CardContent>
        </Card>
        <Card className="bg-brand-card-bg border-brand-border">
          <CardContent className="p-4 text-center">
            <Clock className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-brand-text-primary">{onboardingStats.inProgress}</p>
            <p className="text-sm text-brand-text-secondary">In Progress</p>
          </CardContent>
        </Card>
        <Card className="bg-brand-card-bg border-brand-border">
          <CardContent className="p-4 text-center">
            <AlertTriangle className="w-8 h-8 text-orange-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-brand-text-primary">{onboardingStats.notStarted}</p>
            <p className="text-sm text-brand-text-secondary">Not Started</p>
          </CardContent>
        </Card>
        <Card className="bg-brand-card-bg border-brand-border">
          <CardContent className="p-4 text-center">
            <Users className="w-8 h-8 text-purple-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-brand-text-primary">{onboardingStats.avgProgress}%</p>
            <p className="text-sm text-brand-text-secondary">Average Progress</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Club Onboarding Progress</CardTitle>
            <Select value={filterStatus} onValueChange={handleFilterChange}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="not_started">Not Started</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {paginatedClubs.map(club => (
              <div key={club.id} className="p-4 border border-brand-border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-brand-text-primary">{club.name}</h4>
                    <p className="text-sm text-brand-text-secondary">{club.location?.city}, {club.ma_region}</p>
                  </div>
                  {getStatusBadge(club.onboarding.status)}
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-brand-text-secondary">Progress</span>
                    <span className="text-sm font-medium text-brand-text-primary">{club.onboarding.progress}%</span>
                  </div>
                  <Progress value={club.onboarding.progress} className="h-2" />
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-3">
                  {ONBOARDING_STEPS.map(step => {
                    const isCompleted = club.onboarding.completedSteps.includes(step.id);
                    const isCurrent = club.onboarding.currentStep === step.id;
                    
                    return (
                      <div
                        key={step.id}
                        className={`flex items-center gap-2 p-2 rounded text-xs ${
                          isCompleted
                            ? 'bg-green-900/30 text-green-400'
                            : isCurrent
                            ? 'bg-blue-900/30 text-blue-400'
                            : 'bg-gray-900/30 text-gray-500'
                        }`}
                      >
                        <step.icon className="w-3 h-3" />
                        <span className="truncate">{step.name}</span>
                      </div>
                    );
                  })}
                </div>
                
                <div className="flex gap-2 mt-3">
                  <Button size="sm" variant="outline">
                    <Mail className="w-4 h-4 mr-1" />
                    Contact
                  </Button>
                  <Button size="sm" variant="outline">
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
          
          {/* Pagination Controls */}
          {totalPages > 0 && (
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-6 pt-4 border-t border-brand-border">
              <div className="flex items-center gap-2">
                  <span className="text-sm text-brand-text-secondary">Show:</span>
                  <Select value={String(clubsPerPage)} onValueChange={handleClubsPerPageChange}>
                      <SelectTrigger className="w-[80px] bg-brand-charcoal border-brand-border">
                          <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                          <SelectItem value="10">10</SelectItem>
                          <SelectItem value="20">20</SelectItem>
                          <SelectItem value="50">50</SelectItem>
                      </SelectContent>
                  </Select>
                  <span className="text-sm text-brand-text-secondary">per page</span>
              </div>

              {totalPages > 1 && (
                  <div className="flex items-center gap-2">
                      <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                      >
                          Previous
                      </Button>
                      <span className="text-sm text-brand-text-secondary w-20 text-center">
                          Page {currentPage} of {totalPages}
                      </span>
                      <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalPages}
                      >
                          Next
                      </Button>
                  </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
