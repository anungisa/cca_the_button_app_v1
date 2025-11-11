// The Button Brand Ethos System
// "Curling, Connected" - Supporting every journey from first rock to national stage

export const ETHOS_PILLARS = {
  CONNECTION: 'connection',
  PERSONAL_JOURNEY: 'personal_journey', 
  LEGACY_TRUST: 'legacy_trust',
  MODERN_ENERGY: 'modern_energy'
};

// Granite Circle Tier Configuration
export const tierConfig = {
  granite_rookie: {
    name: 'Granite Rookie',
    minXP: 0,
    maxXP: 499,
    color: '#94a3b8',
    bgColor: 'bg-slate-400',
    textColor: 'text-slate-400',
    icon: '🥌',
    benefits: [
      'Access to basic club features',
      'Earn XP for participation',
      'Join community discussions'
    ]
  },
  sheet_star: {
    name: 'Sheet Star',
    minXP: 500,
    maxXP: 1999,
    color: '#3b82f6',
    bgColor: 'bg-blue-500',
    textColor: 'text-blue-500',
    icon: '⭐',
    benefits: [
      'All Granite Rookie benefits',
      'Exclusive club merchandise discounts',
      'Priority event registration'
    ]
  },
  house_hero: {
    name: 'House Hero',
    minXP: 2000,
    maxXP: 4999,
    color: '#8b5cf6',
    bgColor: 'bg-purple-500',
    textColor: 'text-purple-500',
    icon: '🏆',
    benefits: [
      'All Sheet Star benefits',
      'Access to premium rewards',
      'Recognition in club leaderboards'
    ]
  },
  button_boss: {
    name: 'Button Boss',
    minXP: 5000,
    maxXP: 9999,
    color: '#f59e0b',
    bgColor: 'bg-amber-500',
    textColor: 'text-amber-500',
    icon: '👑',
    benefits: [
      'All House Hero benefits',
      'VIP event access',
      'Exclusive coaching opportunities'
    ]
  },
  hack_master: {
    name: 'Hack Master',
    minXP: 10000,
    maxXP: 24999,
    color: '#ef4444',
    bgColor: 'bg-red-500',
    textColor: 'text-red-500',
    icon: '🔥',
    benefits: [
      'All Button Boss benefits',
      'Lifetime recognition',
      'Special event invitations'
    ]
  },
  granite_legacy: {
    name: 'Granite Legacy',
    minXP: 25000,
    maxXP: 999999,
    color: '#a855f7',
    bgColor: 'bg-purple-600',
    textColor: 'text-purple-600',
    icon: '💎',
    benefits: [
      'All Hack Master benefits',
      'Hall of Fame recognition',
      'Exclusive legacy merchandise',
      'Annual gala invitation'
    ]
  }
};

// Helper function to get tier from XP
export const getTierFromXP = (xp) => {
  const tierKeys = Object.keys(tierConfig);
  for (const key of tierKeys) {
    const tier = tierConfig[key];
    if (xp >= tier.minXP && xp <= tier.maxXP) {
      return { key, ...tier };
    }
  }
  return { key: 'granite_rookie', ...tierConfig.granite_rookie };
};

// Helper function to calculate progress to next tier
export const getTierProgress = (currentXP) => {
  const currentTier = getTierFromXP(currentXP);
  const progress = ((currentXP - currentTier.minXP) / (currentTier.maxXP - currentTier.minXP)) * 100;
  return {
    current: currentTier,
    progress: Math.min(100, Math.max(0, progress)),
    xpToNext: currentTier.maxXP - currentXP,
    nextTier: getNextTier(currentTier.key)
  };
};

// Helper to get the next tier
const getNextTier = (currentTierKey) => {
  const tierKeys = ['granite_rookie', 'sheet_star', 'house_hero', 'button_boss', 'hack_master', 'granite_legacy'];
  const currentIndex = tierKeys.indexOf(currentTierKey);
  if (currentIndex === -1 || currentIndex === tierKeys.length - 1) {
    return null; // Already at max tier
  }
  const nextKey = tierKeys[currentIndex + 1];
  return { key: nextKey, ...tierConfig[nextKey] };
};

export const welcomeMessages = [
  "Curling, Connected.",
  "One Button. Your Game.", 
  "Where Tradition Meets Tomorrow.",
  "Your curling story starts here.",
  "Connected to the game. Connected to each other."
];

export const streamingTaglines = [
  "Legends in the making.",
  "Catch history, live.",
  "Witness greatness unfold.",
  "Every end tells a story.",
  "This is where champions rise."
];

export const xpCelebrations = {
  badge_earned: [
    "Another chapter in your curling journey unlocked.",
    "Your dedication is showing - well earned!",
    "Building your legacy, one achievement at a time."
  ],
  tier_advanced: [
    "Congratulations! Your curling journey reaches new heights.",
    "Rising through the ranks - the community notices.",
    "Your commitment to the game keeps growing stronger."
  ],
  milestone_reached: [
    "A moment worth celebrating in your curling story.",
    "Milestones like this make the journey special.",
    "Another proud moment in your curling legacy."
  ]
};

export const communityMessages = {
  club_joined: "Welcome to your curling home - where every story begins.",
  shared_achievement: (count) => `You and ${count} others earned this badge today - the community grows stronger together.`,
  club_milestone: (club, points) => `${club} just passed ${points} XP! Celebrate together.`,
  first_affiliation: "Help us get to know your curling roots. Pick your home club."
};

export const emptyStateMessages = {
  no_games: "No games yet, but every journey starts with a draw.",
  no_events: "Great events are coming - your next curling adventure awaits.",
  no_sessions: "Ready to track your first session? Every sweep counts.",
  no_achievements: "Your first achievement is just around the corner."
};

export const roleBasedGreetings = {
  curler: (name) => `Welcome back, ${name}! Ready to step on the ice?`,
  coach: (name) => `Welcome back, Coach ${name}! Your team awaits.`,
  fan: (name) => `Welcome back, ${name}! The game you love is calling.`,
  athlete: (name) => `Welcome back, ${name}! Champions are made every day.`,
  volunteer: (name) => `Welcome back, ${name}! Your service builds our community.`,
  parent: (name) => `Welcome back, ${name}! Supporting the next generation.`,
  admin: (name) => `Welcome back, ${name}! Leading the curling community forward.`
};

export const getRandomWelcomeMessage = () => {
  return welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)];
};

export const getRandomStreamingTagline = () => {
  return streamingTaglines[Math.floor(Math.random() * streamingTaglines.length)];
};

export const getRoleBasedGreeting = (user) => {
  if (!user?.full_name) return getRandomWelcomeMessage();
  
  const firstName = user.full_name.split(' ')[0];
  const userType = user.user_type || 'fan';
  
  return roleBasedGreetings[userType] 
    ? roleBasedGreetings[userType](firstName)
    : `Welcome back, ${firstName}! Ready to connect with curling?`;
};