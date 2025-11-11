import { usePermissions } from '../hooks/usePermissions';

export const useAnalyticsRole = () => {
  const { permissions, roles } = usePermissions();

  const getAnalyticsAccess = () => {
    // Define analytics access levels
    const accessLevels = {
      public: ['fan_engagement', 'event_attendance'],
      club: ['club_analytics', 'membership_trends', 'event_performance'],
      ma: ['regional_analytics', 'club_comparison', 'growth_metrics'],
      staff: ['operational_metrics', 'financial_dashboards', 'sponsor_roi'],
      executive: ['strategic_kpis', 'executive_summary', 'board_reporting']
    };

    // Determine user's access level
    let userAccessLevel = 'public';
    
    if (permissions?.canAccessExecutiveHub) {
      userAccessLevel = 'executive';
    } else if (permissions?.canAccessStaffHQ) {
      userAccessLevel = 'staff';
    } else if (permissions?.canViewMADashboard) {
      userAccessLevel = 'ma';
    } else if (permissions?.canAccessBusinessHub) {
      userAccessLevel = 'club';
    }

    return {
      accessLevel: userAccessLevel,
      availableDashboards: accessLevels[userAccessLevel] || accessLevels.public,
      canViewExecutive: userAccessLevel === 'executive',
      canViewStaff: ['executive', 'staff'].includes(userAccessLevel),
      canViewMA: ['executive', 'staff', 'ma'].includes(userAccessLevel),
      canViewClub: ['executive', 'staff', 'ma', 'club'].includes(userAccessLevel)
    };
  };

  const getDashboardConfig = (dashboardType) => {
    const configs = {
      executive_summary: {
        title: 'Executive Summary',
        description: 'High-level KPIs and strategic metrics',
        cardIds: ['exec_001', 'exec_002', 'exec_003'],
        refreshInterval: 300000 // 5 minutes
      },
      platform_adoption: {
        title: 'Platform Adoption',
        description: 'User engagement and feature adoption metrics',
        cardIds: ['adopt_001', 'adopt_002'],
        refreshInterval: 600000 // 10 minutes
      },
      financial_overview: {
        title: 'Financial Overview',
        description: 'Revenue, expenses, and financial health metrics',
        cardIds: ['fin_001', 'fin_002', 'fin_003'],
        refreshInterval: 3600000 // 1 hour
      },
      sponsor_performance: {
        title: 'Sponsor Performance',
        description: 'Sponsorship ROI and engagement metrics',
        cardIds: ['spon_001', 'spon_002'],
        refreshInterval: 1800000 // 30 minutes
      }
    };

    return configs[dashboardType] || null;
  };

  return {
    ...getAnalyticsAccess(),
    getDashboardConfig
  };
};