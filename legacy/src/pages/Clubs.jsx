import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Club } from '@/api/entities';
import { User } from '@/api/entities';
import { enhancedEntityService } from '../components/services/EnhancedEntityService';
import { useEnhancedEntity } from '../components/hooks/useEnhancedEntity';
import { Button } from '@/components/ui/button';
import { Loader2, List, Map, Grid3X3, Download, RefreshCw, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useXP } from "../components/XPContext";
import { usePermissions } from "../components/hooks/usePermissions";
import ClubSearchFilters from "../components/clubs/ClubSearchFilters";
import ClubCard from "../components/clubs/ClubCard";
import ClubGridCard from "../components/clubs/ClubGridCard";
import AffiliationModal from "../components/clubs/AffiliationModal";
import SkeletonLoader from "@/components/ui/SkeletonLoader";
import ClubDetailSheet from "../components/clubs/ClubDetailSheet";
import ClubAdminPanel from "../components/clubs/ClubAdminPanel";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { exportToCSV } from "../components/utils/export";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/components/utils/cn';
import LazyPageWrapper from '../components/LazyPageWrapper';
import { useDebounce } from "../components/hooks/useDebounce";
import { Suspense, lazy } from 'react';

const ClubMap = lazy(() => import('../components/clubs/ClubMap'));

const useResponsiveLayout = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640); 
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return { isMobile };
};

export default function Clubs() {
  // ✅ USE ENHANCED ENTITY HOOK
  const { 
    data: clubs, 
    isLoading: clubsLoading, 
    error: clubsError,
    refresh: refreshClubs 
  } = useEnhancedEntity(Club, {
    autoLoad: true,
    sortBy: '-membership_count',
    limit: 1000,
    cacheTTL: 10
  });

  const { user, isLoading: userLoading } = useXP();
  const [filteredClubs, setFilteredClubs] = useState([]);
  const [filters, setFilters] = useState({ 
    searchTerm: '', 
    province: 'all', 
    city: 'all', 
    sortBy: 'members',
    locationData: null,
    programTypes: [],
    clubStatus: 'all',
    integrationStatus: 'all'
  });
  const [isAffiliating, setIsAffiliating] = useState(false);
  const [clubToAffiliate, setClubToAffiliate] = useState(null);
  const [selectedClub, setSelectedClub] = useState(null);
  const [viewMode, setViewMode] = useState('list');
  const [showAdminView, setShowAdminView] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [clubsPerPage, setClubsPerPage] = useState(10);
  const { permissions } = usePermissions();
  const { isMobile } = useResponsiveLayout();
  const debouncedSearchTerm = useDebounce(filters.searchTerm, 300);

  const isLoading = clubsLoading || userLoading;

  // Apply filters
  useEffect(() => {
    let newFiltered = [...clubs];
    
    if (showAdminView && permissions.canAccessStaffHQ) {
      // Admin view shows all
    } else {
      newFiltered = newFiltered.filter(c => 
        !['hidden', 'suspended'].includes(c.status)
      );
    }
    
    if (debouncedSearchTerm) {
      const term = debouncedSearchTerm.toLowerCase();
      newFiltered = newFiltered.filter(c => 
        c.name.toLowerCase().includes(term) ||
        (c.location?.city && c.location.city.toLowerCase().includes(term))
      );
    }
    
    if (filters.province && filters.province !== 'all') {
      newFiltered = newFiltered.filter(c => c.location?.province === filters.province);
    }
    
    if (filters.city && filters.city !== 'all') {
      newFiltered = newFiltered.filter(c => c.location?.city === filters.city);
    }

    if (filters.clubStatus && filters.clubStatus !== 'all') {
      newFiltered = newFiltered.filter(c => c.status === filters.clubStatus);
    }

    if (filters.programTypes && filters.programTypes.length > 0) {
      newFiltered = newFiltered.filter(c => 
        c.programs?.some(p => filters.programTypes.includes(p.type))
      );
    }

    if (filters.integrationStatus && filters.integrationStatus !== 'all') {
      switch (filters.integrationStatus) {
        case 'curling_reg':
          newFiltered = newFiltered.filter(c => c.system_integrations?.curling_reg_id);
          break;
        case 'interpodia':
          newFiltered = newFiltered.filter(c => c.system_integrations?.interpodia_connected);
          break;
        case 'safe_sport':
          newFiltered = newFiltered.filter(c => c.system_integrations?.safe_sport_compliant);
          break;
      }
    }

    if (filters.sortBy === 'distance' && filters.locationData?.hasPermission) {
      const nearbyClubIds = new Set((filters.locationData?.nearbyClubs || []).map(c => c.id));
      const prioritizedNearbyClubs = (filters.locationData?.nearbyClubs || []).filter(club => 
        newFiltered.some(filteredClub => filteredClub.id === club.id)
      );
      const otherClubs = newFiltered.filter(club => !nearbyClubIds.has(club.id));
      newFiltered = [...prioritizedNearbyClubs, ...otherClubs];
    } else if (filters.sortBy === 'name') {
      newFiltered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (filters.sortBy === 'xp') {
      newFiltered.sort((a, b) => (b.engagement_metrics?.xp_total || 0) - (a.engagement_metrics?.xp_total || 0));
    } else {
      newFiltered.sort((a, b) => (b.membership_count || 0) - (a.membership_count || 0));
    }

    setFilteredClubs(newFiltered);
    setCurrentPage(1);
  }, [debouncedSearchTerm, filters, clubs, showAdminView, permissions]);
  
  const sortedClubs = useMemo(() => {
    let clubsCopy = [...filteredClubs];
    if (user?.home_club_id) {
        const homeClubIndex = clubsCopy.findIndex(c => c.id === user.home_club_id);
        if (homeClubIndex > -1) {
            const [homeClub] = clubsCopy.splice(homeClubIndex, 1);
            return [homeClub, ...clubsCopy];
        }
    }
    return clubsCopy;
  }, [filteredClubs, user?.home_club_id]);

  const paginatedClubs = useMemo(() => {
    const indexOfLastClub = currentPage * clubsPerPage;
    const indexOfFirstClub = indexOfLastClub - clubsPerPage;
    return sortedClubs.slice(indexOfFirstClub, indexOfLastClub);
  }, [sortedClubs, currentPage, clubsPerPage]);

  const totalPages = Math.ceil(sortedClubs.length / clubsPerPage);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleClubsPerPageChange = (value) => {
    setClubsPerPage(Number(value));
    setCurrentPage(1);
  };

  const handleSetHomeClub = async () => {
    if (!user || !clubToAffiliate) return;
    setIsAffiliating(true);
    
    try {
      // ✅ Use enhanced service with idempotency
      await enhancedEntityService.update(
        User,
        user.id,
        {
          home_club_id: clubToAffiliate.id,
          home_club_name: clubToAffiliate.name,
        },
        { idempotencyKey: `set-home-club-${user.id}-${clubToAffiliate.id}` }
      );

      setSelectedClub(prev => prev ? { ...prev, isHomeClub: true } : null);
      
      // Force refresh to get updated user
      window.location.reload();

    } catch (error) {
      console.error("Error setting home club:", error);
    } finally {
      setClubToAffiliate(null);
      setIsAffiliating(false);
    }
  };
  
  const handleOpenAffiliationModal = (club) => {
    if (user) {
      setClubToAffiliate(club);
    }
  };

  const handleSelectClub = (club) => {
    const isHomeClub = user?.home_club_id === club.id;
    setSelectedClub({ ...club, isHomeClub });
  };

  const handleExportClubs = () => {
    const exportData = filteredClubs.map(club => ({
      name: club.name,
      city: club.location?.city,
      province: club.location?.province,
      members: club.membership_count,
      status: club.status,
      ma_region: club.ma_region,
      xp_total: club.engagement_metrics?.xp_total || 0
    }));
    
    exportToCSV(exportData, `clubs-export-${new Date().toISOString().split('T')[0]}.csv`);
  };

  if (clubsError) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">Error loading clubs: {clubsError.message}</p>
        <Button onClick={refreshClubs} className="mt-4">
          <RefreshCw className="w-4 h-4 mr-2" />
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-charcoal">
      <main className="max-w-7xl mx-auto space-y-4 md:space-y-6 p-3 sm:p-4 md:p-6">
        
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-brand-text-primary tracking-tight">Find Your Club</h1>
          <p className="mt-2 text-lg text-brand-text-secondary">Explore curling clubs across Canada</p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
          {permissions.canAccessStaffHQ && (
            <Button
              variant={showAdminView ? "default" : "outline"}
              onClick={() => setShowAdminView(!showAdminView)}
              className={cn(
                "w-full sm:w-auto",
                showAdminView ? "bg-brand-red text-white hover:bg-brand-red/90" : ""
              )}
            >
              {showAdminView ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
              {showAdminView ? 'Exit Admin' : 'Admin View'}
            </Button>
          )}
          
          <Button 
            variant="outline"
            onClick={() => refreshClubs()}
            className="w-full sm:w-auto"
            disabled={isLoading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>

          {showAdminView && (
            <Button 
              variant="outline" 
              onClick={handleExportClubs}
              className="w-full sm:w-auto"
            >
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
          )}
        </div>
        
        <ClubSearchFilters 
          onFilterChange={setFilters} 
          clubs={clubs} 
          filters={filters}
          showAdminFilters={showAdminView}
        />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="text-sm text-brand-text-secondary">
            {filteredClubs.length} club{filteredClubs.length !== 1 ? 's' : ''} found
          </p>
          
          {!isMobile && (
            <ToggleGroup 
              type="single" 
              value={viewMode} 
              onValueChange={(value) => value && setViewMode(value)} 
              className="bg-brand-card-bg border border-brand-border rounded-lg p-1"
            >
              <ToggleGroupItem value="list" aria-label="List view" className="data-[state=on]:bg-brand-red">
                <List className="h-4 w-4" />
              </ToggleGroupItem>
              <ToggleGroupItem value="grid" aria-label="Grid view" className="data-[state=on]:bg-brand-red">
                <Grid3X3 className="h-4 w-4" />
              </ToggleGroupItem>
              <ToggleGroupItem value="map" aria-label="Map view" className="data-[state=on]:bg-brand-red">
                <Map className="h-4 w-4" />
              </ToggleGroupItem>
            </ToggleGroup>
          )}
        </div>

        {totalPages > 1 && (
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-brand-card-bg p-3 rounded-lg border border-brand-border">
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
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
              <span className="text-sm text-brand-text-secondary">per page</span>
            </div>

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
          </div>
        )}
        
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => <SkeletonLoader key={i} className="h-72" />)}
          </div>
        ) : filteredClubs.length > 0 ? (
          <>
            {(viewMode === 'list' || isMobile) && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {paginatedClubs.map((club) => (
                  <ClubCard
                    key={club.id}
                    club={club}
                    isHomeClub={user?.home_club_id === club.id}
                    onSetHomeClub={() => handleOpenAffiliationModal(club)}
                    onViewDetails={() => handleSelectClub(club)}
                    isAffiliationDisabled={!user}
                    showAdminView={showAdminView}
                  />
                ))}
              </div>
            )}
            
            {viewMode === 'grid' && !isMobile && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {paginatedClubs.map((club) => (
                  <ClubGridCard
                    key={club.id}
                    club={club}
                    isHomeClub={user?.home_club_id === club.id}
                    onSetHomeClub={() => handleOpenAffiliationModal(club)}
                    onViewDetails={() => handleSelectClub(club)}
                    isAffiliationDisabled={!user}
                  />
                ))}
              </div>
            )}
            
            {viewMode === 'map' && !isMobile && (
              <div className="h-[400px] md:h-[600px] bg-brand-card-bg rounded-lg overflow-hidden">
                <Suspense fallback={<div className="flex items-center justify-center h-full"><Loader2 className="w-8 h-8 animate-spin" /></div>}>
                  <ClubMap clubs={filteredClubs} onSelectClub={handleSelectClub} />
                </Suspense>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12 text-brand-text-secondary">
            <h3 className="text-lg font-medium text-brand-text-primary mb-2">No clubs found</h3>
            <p className="text-sm">Try adjusting your search criteria.</p>
          </div>
        )}

        {showAdminView && permissions.canAccessStaffHQ && (
          <ClubAdminPanel clubs={filteredClubs} />
        )}

        {selectedClub && (
          <ClubDetailSheet 
            club={selectedClub}
            isOpen={!!selectedClub}
            onClose={() => setSelectedClub(null)}
            onSetHomeClub={() => handleOpenAffiliationModal(selectedClub)}
            isAffiliationDisabled={!user}
            isProcessingAffiliation={isAffiliating}
            showAdminView={showAdminView}
          />
        )}

        {clubToAffiliate && (
          <AffiliationModal 
            club={clubToAffiliate}
            isOpen={!!clubToAffiliate}
            onConfirm={handleSetHomeClub}
            onCancel={() => setClubToAffiliate(null)}
            isProcessing={isAffiliating}
          />
        )}
      </main>
    </div>
  );
}