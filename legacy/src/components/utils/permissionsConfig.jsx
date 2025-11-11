
/**
 * @file permissionsConfig.js
 * @description Centralized configuration for the permission system used throughout the application.
 * This file defines all available permissions, role configurations, and external access roles.
 * It serves as the single source of truth for what different user types can access.
 *
 * IMPORTANT: Changes to this file affect authorization throughout the entire application.
 * Always test permission changes thoroughly across all user roles.
 */

/**
 * Base role configurations that define permissions for primary user types.
 * These are the foundational permissions that determine what users can access.
 */
export const rolesConfig = {
  /**
   * Fan role - Default permissions for public users and curling enthusiasts
   * Includes basic engagement features and public content access
   */
  fan: {
    canAccessStaffHQ: false,
    canAccessPlatformSettings: false,
    canAccessAPIManager: false,
    canViewPublicContent: true,
    canParticipateInCommunity: true,
    canEarnXP: true,
  },

  /**
   * Curler role - Active participants in the sport
   * Includes basic tracking and engagement
   */
  curler: {
    canAccessStaffHQ: false,
    canAccessPlatformSettings: false,
    canAccessAPIManager: false,
    canViewPublicContent: true,
    canParticipateInCommunity: true,
    canEarnXP: true,
    canTrackPerformance: true,
  },

  /**
   * Athlete role - High-performance competitors
   * Includes advanced performance tracking and coaching tools
   */
  athlete: {
    canAccessStaffHQ: false,
    canAccessPlatformSettings: false,
    canAccessAPIManager: false,
    canViewPublicContent: true,
    canAccessPerformanceCenter: true,
    canLogTraining: true,
    canViewCoachFeedback: true,
    canEarnXP: true,
  },

  /**
   * Coach role - Certified instructors and mentors
   * Includes athlete management and coaching tools
   */
  coach: {
    canAccessStaffHQ: false,
    canAccessPlatformSettings: false,
    canAccessAPIManager: false,
    canViewPublicContent: true,
    canAccessCoachDashboard: true,
    canLogShotData: true,
    canProvideFeedback: true,
    canViewAthleteData: true,
    canEarnXP: true,
  },

  /**
   * Parent role - For guardians of youth participants
   */
  parent: {
    canAccessStaffHQ: false,
    canAccessPlatformSettings: false,
    canAccessAPIManager: false,
    canViewPublicContent: true,
    canViewYouthPrograms: true,
    canEarnXP: true,
  },

  /**
   * Volunteer role - Community supporters and event helpers
   * Includes volunteer coordination and recognition features
   */
  volunteer: {
    canAccessStaffHQ: false,
    canAccessPlatformSettings: false,
    canAccessAPIManager: false,
    canViewPublicContent: true,
    canAccessVolunteerTools: true,
    canEarnXP: true,
  },

  /**
   * Donor role - Individuals or organizations contributing financially
   */
  donor: {
    canAccessStaffHQ: false,
    canAccessPlatformSettings: false,
    canAccessAPIManager: false,
    canViewPublicContent: true,
    canViewDonationImpact: true,
    canEarnXP: true,
  },

  /**
   * MA Admin role - Provincial/Territorial Association administrators
   */
  ma_admin: {
    canAccessStaffHQ: false,
    canAccessPlatformSettings: false,
    canAccessAPIManager: false,
    canAccessMADashboard: true,
    canAccessMAInsights: true,
    canViewRegionalData: true,
    canManageRegionalClubs: true,
    canEarnXP: true,
  },

  /**
   * Staff role - Curling Canada employees (base permissions)
   * All other staff roles inherit these base permissions.
   */
  staff: {
    canAccessStaffHQ: true,
    canAccessPlatformSettings: false,
    canAccessAPIManager: false,
    canViewStaffContent: true,
    canAccessMyWorkspace: true,
    canViewReports: true,
    canAccessYouthAndCommunity: true,
  },

  /**
   * Field Staff role - Employees primarily working with events and external stakeholders
   */
  field_staff: {
    canAccessStaffHQ: true,
    canAccessPlatformSettings: false,
    canAccessAPIManager: false,
    canManageEvents: true,
    canManageVolunteers: true,
    canAccessEventOps: true,
    canAccessYouthAndCommunity: true,
  },

  /**
   * HR role - Human resources staff
   * Includes employee management and organizational tools
   */
  hr: {
    canAccessStaffHQ: true,
    canAccessPlatformSettings: false,
    canAccessAPIManager: false,
    canAccessPeopleCultureHub: true,
    canManageStaff: true,
    canViewHRData: true,
    canManagePolicies: true,
    canAccessYouthAndCommunity: true,
  },

  /**
   * Governance role - Governance and compliance staff
   * Includes board support and compliance management
   */
  governance: {
    canAccessStaffHQ: true,
    canAccessPlatformSettings: false,
    canAccessAPIManager: false,
    canAccessGovernanceHub: true,
    canManagePolicies: true,
    canManageCompliance: true,
    canAccessBoardManagement: true,
    canAccessYouthAndCommunity: true,
  },

  /**
   * Executive role - Senior leadership
   * Includes strategic oversight and executive dashboards
   */
  executive: {
    canAccessStaffHQ: true,
    canAccessPlatformSettings: false,
    canAccessAPIManager: false,
    canAccessExecutiveHub: true,
    canViewAllData: true,
    canViewFinancials: true,
    canViewStrategicPlan: true,
    canAccessYouthAndCommunity: true,
  },

  /**
   * DevOps role - Technical operations and platform management
   * Includes system administration and technical oversight
   */
  devops: {
    canAccessStaffHQ: true,
    canAccessPlatformSettings: true,
    canAccessAPIManager: true,
    canManageIntegrations: true,
    canViewSystemHealth: true,
    canManageWorkflows: true,
    canAccessDeveloperPortal: true,
    canAccessYouthAndCommunity: true,
  },
};

/**
 * External access role permissions for non-staff users who need special access.
 * These are layered on top of the user's primary role permissions.
 */
export const externalRolePermissions = {
  /**
   * Board members - Governance access for board members
   */
  board_member: {
    canAccessStaffHQ: false,
    canAccessPlatformSettings: false,
    canViewGovernance: true,
    canViewFinancials: true,
    canViewStrategicPlan: true,
    canAccessBoardPortal: true,
  },

  /**
   * Sponsor contacts - Limited dashboard access for sponsors
   */
  sponsor_contact: {
    canAccessStaffHQ: false,
    canAccessPlatformSettings: false,
    canManageSponsorship: false, // Explicitly false, as outlined
    canViewSponsorDashboard: true,
    canViewSponsorAnalytics: true,
  },

  /**
   * Club presidents - Enhanced club management capabilities
   */
  club_president: {
    canAccessStaffHQ: false,
    canAccessPlatformSettings: false,
    canManageClub: true,
    canAccessBusinessHub: true,
    canAccessSmartClubPanel: true,
    canViewClubAnalytics: true,
    canSubmitClubSurvey: true,
  },

  /**
   * Volunteer leads - Volunteer coordination tools
   */
  volunteer_lead: {
    canAccessStaffHQ: false,
    canAccessPlatformSettings: false,
    canManageVolunteers: true,
    canAccessVolunteerContext: true,
  },

  /**
   * No specific external permissions
   */
  none: {}
};

/**
 * Utility function to get all permissions for a given set of roles.
 * Used by the usePermissions hook to calculate final permission set.
 * @param {string[]} roles - Array of role names
 * @returns {object} Combined permissions object
 */
export const calculatePermissions = (roles) => {
  let combinedPermissions = {};

  // Apply base role permissions
  // Note: The new rolesConfig structure explicitly lists all permissions for each role
  // without relying on internal 'this' inheritance spreads.
  roles.forEach(role => {
    if (rolesConfig[role]) {
      combinedPermissions = { ...combinedPermissions, ...rolesConfig[role] };
    }
    if (externalRolePermissions[role]) { // Also apply external role permissions
      combinedPermissions = { ...combinedPermissions, ...externalRolePermissions[role] };
    }
  });

  return combinedPermissions;
};

/**
 * List of all available permissions in the system.
 * Used for documentation and validation purposes.
 */
export const ALL_PERMISSIONS = [
  // Core system access permissions
  'canAccessStaffHQ',
  'canAccessPlatformSettings',
  'canAccessAPIManager',
  'canViewPublicContent',
  'canParticipateInCommunity',
  'canEarnXP',

  // User-specific features
  'canTrackPerformance',
  'canAccessPerformanceCenter',
  'canLogTraining',
  'canViewCoachFeedback',
  'canAccessCoachDashboard',
  'canLogShotData',
  'canProvideFeedback',
  'canViewAthleteData',
  'canViewYouthPrograms',
  'canAccessVolunteerTools',
  'canViewDonationImpact',
  'canAccessMADashboard',
  'canAccessMAInsights',
  'canViewRegionalData',
  'canManageRegionalClubs',

  // Staff and internal tools
  'canViewStaffContent',
  'canAccessMyWorkspace',
  'canViewReports',
  'canManageEvents',
  'canManageVolunteers',
  'canAccessEventOps',
  'canAccessPeopleCultureHub',
  'canManageStaff',
  'canViewHRData',
  'canManagePolicies',
  'canAccessGovernanceHub',
  'canManageCompliance',
  'canAccessBoardManagement',
  'canAccessExecutiveHub',
  'canViewAllData',
  'canViewFinancials',
  'canViewStrategicPlan',
  'canManageIntegrations',
  'canViewSystemHealth',
  'canManageWorkflows',
  'canAccessDeveloperPortal',
  'canAccessYouthAndCommunity', // Added this permission

  // External access roles permissions
  'canViewGovernance',
  'canAccessBoardPortal',
  'canManageSponsorship',
  'canViewSponsorDashboard',
  'canViewSponsorAnalytics',
  'canManageClub',
  'canAccessBusinessHub',
  'canAccessSmartClubPanel',
  'canViewClubAnalytics',
  'canSubmitClubSurvey',
  'canAccessVolunteerContext',
];
