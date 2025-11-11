/**
 * Demo data for streaming and live scoring when real APIs aren't available
 */
export const demoGames = [
  {
    id: "demo_game_1",
    event_id: "demo_event_1",
    draw: { name: "Draw 1", active: true },
    sheet: "Sheet A",
    status: "live",
    current_end: 6,
    team1: {
      name: "Team Gushue",
      club: "St. John's Curling Club",
      score: [2, 0, 1, 0, 3, 1, 0, 0],
      total_score: 7,
      has_hammer: false
    },
    team2: {
      name: "Team Bottcher",
      club: "Saville Community Sports Centre",
      score: [0, 1, 0, 2, 0, 0, 2, 0],
      total_score: 5,
      has_hammer: true
    }
  },
  {
    id: "demo_game_2",
    event_id: "demo_event_1",
    draw: { name: "Draw 2", active: true },
    sheet: "Sheet B",
    status: "live",
    current_end: 4,
    team1: {
      name: "Team Einarson",
      club: "East St. Paul Curling Club",
      score: [1, 0, 2, 1],
      total_score: 4,
      has_hammer: true
    },
    team2: {
      name: "Team Jones",
      club: "St. Vital Curling Club",
      score: [0, 2, 0, 0],
      total_score: 2,
      has_hammer: false
    }
  },
  {
    id: "demo_game_3",
    event_id: "demo_event_1",
    draw: { name: "Draw 3", active: false },
    sheet: "Sheet C",
    status: "final",
    current_end: 10,
    team1: {
      name: "Team Koe",
      club: "Calgary Curling Club",
      score: [0, 1, 0, 2, 0, 1, 0, 1, 0, 2],
      total_score: 7,
      has_hammer: false
    },
    team2: {
      name: "Team McEwen",
      club: "Fort Rouge Curling Club",
      score: [1, 0, 1, 0, 2, 0, 1, 0, 1, 0],
      total_score: 6,
      has_hammer: true
    }
  }
];

// Mock streaming data for demonstration
export const demoStreamingEvents = [
  {
    id: '1',
    name: 'Scotties Tournament of Hearts - Final',
    description: 'The championship final featuring Canada\'s best women\'s teams',
    event_type: 'live',
    start_time: new Date().toISOString(),
    end_time: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(),
    premium_url: 'https://example.com/premium/scotties-final',
    free_highlight_url: null,
    thumbnail_url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800',
    ppv_price: 9.99,
    tags: ['championship', 'women', 'final'],
    is_featured: true,
    quiz_id: null,
    related_game_id: 'game1'
  },
  {
    id: '2',
    name: 'Tim Hortons Brier - Semi-Final',
    description: 'Semi-final action from the men\'s championship',
    event_type: 'upcoming',
    start_time: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
    end_time: new Date(Date.now() + 5 * 60 * 60 * 1000).toISOString(),
    premium_url: 'https://example.com/premium/brier-semi',
    free_highlight_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnail_url: 'https://images.unsplash.com/photo-1516985080664-ed2fc6a32937?w=800',
    ppv_price: 7.99,
    tags: ['championship', 'men', 'semi-final'],
    is_featured: false,
    quiz_id: null,
    related_game_id: 'game2'
  },
  {
    id: '3',
    name: 'World Curling Championship Highlights',
    description: 'Best moments from the recent world championship',
    event_type: 'replay',
    start_time: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    end_time: new Date(Date.now() - 22 * 60 * 60 * 1000).toISOString(),
    premium_url: null,
    free_highlight_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnail_url: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800',
    ppv_price: 0,
    tags: ['highlights', 'world-championship'],
    is_featured: false,
    quiz_id: 'quiz1',
    related_game_id: null
  },
  {
    id: '4',
    name: 'Mixed Doubles Championship',
    description: 'Elite mixed doubles competition',
    event_type: 'live',
    start_time: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    end_time: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
    premium_url: 'https://example.com/premium/mixed-doubles',
    free_highlight_url: null,
    thumbnail_url: 'https://images.unsplash.com/photo-1578949266097-178b4b4cc58a?w=800',
    ppv_price: 5.99,
    tags: ['mixed-doubles', 'championship'],
    is_featured: true,
    quiz_id: null,
    related_game_id: 'game4'
  }
];

// Export the combined demo data as DemoStreamingData
export const DemoStreamingData = demoStreamingEvents;

// Also export it as default for easier importing
export default DemoStreamingData;