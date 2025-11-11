// Secure DOMO Dashboard Registry
// Maps user roles to their corresponding DOMO dashboard IDs and configurations

export const dashboardMap = {
  athlete: {
    dashboardId: "abc123-athlete-dashboard",
    title: "My Performance Analytics",
    features: ["xp_tracking", "streak_analytics", "smart_broom", "challenge_progress"],
    refreshInterval: 300000, // 5 minutes
    exportEnabled: false, // Requires upgrade
    filters: ["dateRange", "activityType"]
  },
  
  club: {
    dashboardId: "def456-club-dashboard", 
    title: "Club Insights Dashboard",
    features: ["member_analytics", "safety_compliance", "engagement_metrics", "financial_overview"],
    refreshInterval: 600000, // 10 minutes
    exportEnabled: true,
    filters: ["dateRange", "memberType", "ageGroup", "program"]
  },
  
  ma_admin: {
    dashboardId: "ghi789-ma-dashboard",
    title: "Member Association Analytics",
    features: ["regional_overview", "club_performance", "safety_tracking", "youth_programs", "event_analytics"],
    refreshInterval: 900000, // 15 minutes
    exportEnabled: true,
    filters: ["dateRange", "club", "region", "eventType", "demographic"]
  },
  
  sponsor: {
    dashboardId: "jkl321-sponsor-dashboard",
    title: "Campaign Performance Analytics", 
    features: ["campaign_reach", "engagement_metrics", "conversion_tracking", "audience_insights"],
    refreshInterval: 1800000, // 30 minutes
    exportEnabled: true,
    filters: ["dateRange", "campaign", "demographic", "geography"]
  },
  
  parent: {
    dashboardId: "mno654-parent-dashboard",
    title: "Youth Development Tracker",
    features: ["child_progress", "safety_status", "program_participation", "skill_development"],
    refreshInterval: 600000, // 10 minutes
    exportEnabled: false,
    filters: ["dateRange", "child", "program"]
  }
};

export const getAnalyticsConfig = (userRole, userType) => {
  // Determine the appropriate dashboard based on role and type
  if (userRole === 'admin') return dashboardMap.ma_admin;
  if (userType === 'ma_admin') return dashboardMap.ma_admin;
  if (userType === 'club_admin') return dashboardMap.club;
  if (userType === 'sponsor') return dashboardMap.sponsor;
  if (userType === 'parent') return dashboardMap.parent;
  
  // Default to athlete dashboard for most users
  return dashboardMap.athlete;
};

export const getXPRewards = () => ({
  firstView: 50,
  weeklyEngagement: 100,
  shareStats: 25,
  completeTour: 75,
  exportReport: 10,
  adminDownload: { badge: "analytics_champion", xp: 200 }
});