
export const ROLES = {
  FAN: 'fan',
  ATHLETE: 'athlete',
  COACH: 'coach',
  ADMIN: 'admin',
  SPONSOR: 'sponsor',
  MA_REP: 'ma_admin',
  STAFF: 'staff',
  CLUB_ADMIN: 'club_admin',
  DEVOPS: 'devops',
  SUPER_ADMIN: 'super_admin'
};

/**
 * Centralized permission checks.
 * Each function receives the user object and returns a boolean.
 */
export const PERMISSION_CHECKS = {
  // High-Performance & Teamworks
  canViewHP: (user) => user && (['admin', 'staff', 'coach', 'athlete'].includes(user.user_type) || user.role === 'admin'),
  
  // Executive Hub Access (preserved from original)
  canAccessExecutiveHub: (user) => {
    if (!user) return false;
    const allowed = ['admin', 'staff'];
    const executiveTitles = ['executive', 'director', 'manager'];
    const hasExecutiveTitle = user.job_title && executiveTitles.some(title => user.job_title.toLowerCase().includes(title));
    return allowed.includes(user.user_type) || allowed.includes(user.role) || hasExecutiveTitle;
  },
  
  // Sponsor & Admin Dashboards
  canManageSponsors: (user) => user && (['admin', 'staff'].includes(user.user_type) || user.role === 'admin'),
  canViewMADashboard: (user) => user && (['admin', 'ma_admin'].includes(user.user_type) || user.role === 'admin'),
  canViewCompliance: (user) => user && (['admin', 'staff'].includes(user.user_type) || user.role === 'admin'),

  // Business & Knowledge Hub
  canAccessBusinessHub: (user) => user && (['admin', 'club_admin'].includes(user.user_type) || user.role === 'admin'),
  canAccessKnowledgeCentre: (user) => user && (['admin', 'staff', 'coach', 'ma_admin', 'club_admin'].includes(user.user_type)),

  // Staff HQ Permission
  canAccessStaffHQ: (user) => user && (['admin', 'staff'].includes(user.user_type) || user.role === 'admin'),

  // API Manager Permission (preserved from original)
  canManageAPIs: (user) => user && [ROLES.ADMIN, ROLES.DEVOPS].includes(user.role),

  // Platform Settings Permission (Super Admin Only) (preserved from original)
  canAccessPlatformSettings: (user) => user && user.role === ROLES.ADMIN,
  
  // High-Performance Log Conflict Resolution (preserved from original)
  canResolveLogConflicts: (user) => user && [ROLES.ADMIN, ROLES.STAFF].includes(user.role),

  // Survey & Benchmark Permissions (preserved from original)
  canViewSurveyBenchmarks: (user, surveySubmission) => {
    return user && surveySubmission?.is_complete === true;
  },
  
  canViewRegionSurveyData: (user) => user && [ROLES.ADMIN, ROLES.MA_REP, ROLES.STAFF].includes(user.role),
  
  canAccessClubSurvey: (user) => user && [ROLES.ADMIN, ROLES.CLUB_ADMIN].includes(user.role),

  // Volunteer Management Permissions (preserved from original)
  canManageVolunteers: (user) => {
    if (!user) return false;
    const allowedRoles = [ROLES.ADMIN, ROLES.STAFF];
    const allowedUserTypes = ['ma_admin']; // MA leads can manage their region
    return allowedRoles.includes(user.role) || allowedUserTypes.includes(user.user_type);
  },

  canViewVolunteerIncidents: (user) => {
    if (!user) return false;
    const allowedRoles = [ROLES.ADMIN, ROLES.STAFF];
    return allowedRoles.includes(user.role) || user.user_type === 'safe_sport_officer';
  },

  canAuditHRCompliance: (user) => {
    if (!user) return false;
    const allowedRoles = [ROLES.ADMIN, ROLES.STAFF];
    return allowedRoles.includes(user.role) || user.job_title?.toLowerCase().includes('hr');
  },

  // New permissions from outline
  canAccessSponsorConsole: (user) => user && (['admin', 'staff', 'sponsor'].includes(user.user_type)),
  canAccessSystemManager: (user) => user && (['admin', 'devops'].includes(user.role)),
};
