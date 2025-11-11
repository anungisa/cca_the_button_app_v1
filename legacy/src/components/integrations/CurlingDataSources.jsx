/**
 * Integration points for external curling data sources
 * - CurlingZone: Tournament results, player statistics
 * - CTRS: Team rankings, qualification points
 * - WCF: International results, world rankings
 */

export const CURLING_DATA_SOURCES = {
  curlingzone: {
    name: 'CurlingZone',
    baseUrl: 'https://www.curlingzone.com',
    endpoints: {
      tournaments: '/tournaments',
      results: '/results',
      teams: '/teams',
      players: '/players'
    },
    scrapeTargets: [
      'tournament_results',
      'team_standings',
      'player_statistics',
      'upcoming_events'
    ]
  },
  ctrs: {
    name: 'Canadian Team Ranking System',
    baseUrl: 'https://www.curling.ca/ctrs',
    endpoints: {
      rankings: '/rankings',
      points: '/points',
      teams: '/teams'
    },
    scrapeTargets: [
      'team_rankings',
      'qualification_points',
      'season_standings'
    ]
  },
  wcf: {
    name: 'World Curling Federation',
    baseUrl: 'https://worldcurling.org',
    endpoints: {
      rankings: '/rankings',
      results: '/results',
      events: '/events'
    },
    scrapeTargets: [
      'world_rankings',
      'championship_results',
      'international_events'
    ]
  }
};

export const INTEGRATION_POINTS = {
  // Live Scoring - Real-time tournament data
  liveScoring: {
    sources: ['curlingzone', 'ctrs'],
    frequency: 'real-time',
    dataTypes: ['scores', 'standings', 'schedule']
  },
  
  // Team Performance - Rankings and statistics
  teamPerformance: {
    sources: ['ctrs', 'wcf'],
    frequency: 'daily',
    dataTypes: ['rankings', 'points', 'win_loss_records']
  },
  
  // Event Management - Tournament scheduling
  eventManagement: {
    sources: ['curlingzone', 'wcf'],
    frequency: 'hourly',
    dataTypes: ['events', 'registration', 'results']
  },
  
  // Analytics - Historical performance data
  analytics: {
    sources: ['curlingzone', 'ctrs', 'wcf'],
    frequency: 'weekly',
    dataTypes: ['historical_results', 'trends', 'statistics']
  }
};