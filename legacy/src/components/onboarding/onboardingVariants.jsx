
// Themed Onboarding Configuration System
// Adapts welcome experience based on user role, province, and age

export const onboardingVariants = {
  FAN: {
    headline: "Welcome to The Button, your front row seat to Canadian curling.",
    subline: "Connect with the game you love and discover the stories behind every stone.",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=400&fit=crop",
    suggestedActions: [
      "Follow your favourite teams",
      "Earn Journey XP watching games", 
      "Predict live outcomes",
      "Join community discussions"
    ],
    starterXP: 50,
    ctaText: "Start My Curling Journey",
    badgeIcon: "👁️",
    primaryColor: "bg-blue-600",
    welcomeMessage: "Ready to dive into the world of curling? Let's get you connected!"
  },

  ATHLETE_CLUB: { // Renamed from ATHLETE
    headline: "Ready to sweep into your season?",
    subline: "Track your progress, connect with teammates, and take your game to the next level.",
    image: "https://images.unsplash.com/photo-1627993358399-52b3c2936a7e?w=800&h=400&fit=crop",
    suggestedActions: [
      "Confirm your home club affiliation",
      "Track your stats and Journey XP",
      "Connect with your team",
      "Sync your Smart Broom"
    ],
    starterXP: 100,
    ctaText: "Build My Athletic Profile",
    badgeIcon: "🥌",
    primaryColor: "bg-red-600",
    welcomeMessage: "Time to make your mark on the ice. Let's set up your athletic journey!"
  },
  
  ATHLETE_CASUAL: {
    headline: "Welcome to your curling home, wherever you play.",
    subline: "Track your skills, earn XP, and stay connected to the sport you love.",
    image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=400&fit=crop",
    suggestedActions: [
      "Log your curling activity for fun",
      "Earn Journey XP for milestones",
      "Join open competitions or learn-to-play events",
      "Discover clubs near you when you're ready"
    ],
    starterXP: 50,
    ctaText: "Start My Curling Journey",
    badgeIcon: "🎉",
    primaryColor: "bg-teal-600",
    welcomeMessage: "No club? No problem. Track your love for curling your way. Let's get started!",
  },

  COACH: {
    headline: "The Button supports your coaching journey.",
    subline: "Access training resources, track athlete progress, and build stronger teams.",
    image: "https://images.unsplash.com/photo-1594736797933-d0401ba0bf61?w=800&h=400&fit=crop",
    suggestedActions: [
      "Access coaching modules",
      "Invite athletes to join",
      "Review Smart Broom insights",
      "Plan team development"
    ],
    starterXP: 75,
    ctaText: "Set Up My Coaching Hub",
    badgeIcon: "🎯",
    primaryColor: "bg-purple-600",
    welcomeMessage: "Great coaches shape great athletes. Let's get your coaching tools ready!"
  },

  VOLUNTEER: {
    headline: "Thank you for helping our game grow.",
    subline: "Your dedication builds the curling community. Let's track your amazing contributions.",
    image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=400&fit=crop",
    suggestedActions: [
      "Find upcoming events to help with",
      "Log your volunteer hours",
      "Earn community Journey XP badges",
      "Connect with other volunteers"
    ],
    starterXP: 60,
    ctaText: "Join the Volunteer Community",
    badgeIcon: "🤝",
    primaryColor: "bg-green-600",
    welcomeMessage: "Volunteers like you are the heart of curling. Let's celebrate your service!"
  },

  CLUB_ADMIN: {
    headline: "Welcome to your club management hub.",
    subline: "Engage your members, track club growth, and strengthen your curling community.",
    image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=400&fit=crop",
    suggestedActions: [
      "Set up your club profile",
      "Review member engagement",
      "Create club challenges",
      "Access business resources"
    ],
    starterXP: 50,
    ctaText: "Manage My Club",
    badgeIcon: "🏠",
    primaryColor: "bg-indigo-600",
    welcomeMessage: "Strong clubs build strong curlers. Let's help your club thrive!"
  },

  MA_ADMIN: {
    headline: "Welcome to your regional dashboard.",
    subline: "Monitor provincial curling activity and support your Member Association's growth.",
    image: "https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=800&h=400&fit=crop",
    suggestedActions: [
      "Review club metrics across your region",
      "Monitor Journey XP activity",
      "Create regional challenges",
      "Access governance resources"
    ],
    starterXP: 25,
    ctaText: "Access My Regional Tools",
    badgeIcon: "📊",
    primaryColor: "bg-gray-700",
    welcomeMessage: "Leading curling at the provincial level. Let's dive into your dashboard!"
  },

  PARENT: {
    headline: "Supporting the next generation of curlers.",
    subline: "Track your young athlete's progress and stay connected to their curling journey.",
    image: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800&h=400&fit=crop",
    suggestedActions: [
      "Set up your child's profile",
      "Find youth programs nearby",
      "Track their skill development",
      "Connect with other curling families"
    ],
    starterXP: 40,
    ctaText: "Support My Young Curler",
    badgeIcon: "👨‍👩‍👧‍👦",
    primaryColor: "bg-amber-600",
    welcomeMessage: "Great curling careers start with great support. Let's help your young athlete thrive!"
  },
  
  STAFF: {
    headline: "Welcome to Staff HQ.",
    subline: "Access internal tools, dashboards, and platform management features.",
    image: "https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=800&h=400&fit=crop",
    suggestedActions: [
      "Review the latest platform analytics",
      "Access the Event Operations Toolkit",
      "Check the Compliance Dashboard",
      "Manage sponsor campaigns"
    ],
    starterXP: 0,
    ctaText: "Go to Staff HQ",
    badgeIcon: "💼",
    primaryColor: "bg-gray-800",
    welcomeMessage: "Let's get to work building the future of curling in Canada."
  },

  DEFAULT: {
    headline: "Welcome to The Button - Curling, Connected.",
    subline: "Join Canada's curling community and start your journey today.",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=400&fit=crop",
    suggestedActions: [
      "Explore the curling community",
      "Earn Journey XP",
      "Find your local club",
      "Connect with other curlers"
    ],
    starterXP: 30,
    ctaText: "Begin My Journey",
    badgeIcon: "🚀",
    primaryColor: "bg-brand-red",
    welcomeMessage: "Ready to discover the world of curling? Let's get started!"
  }
};

export const regionalFlavors = {
  alberta: {
    flag: "🏔️",
    greeting: "Welcome from Curling Alberta!",
    localColor: "bg-blue-700"
  },
  bc: {
    flag: "🌲", 
    greeting: "Welcome from Curl BC!",
    localColor: "bg-green-700"
  },
  manitoba: {
    flag: "🌾",
    greeting: "Welcome from CurlManitoba!",
    localColor: "bg-yellow-700"
  },
  ontario: {
    flag: "🍁",
    greeting: "Welcome from the Ontario Curling Association!",
    localColor: "bg-red-700"
  },
  quebec: {
    flag: "⚜️",
    greeting: "Bienvenue de Curling Québec!",
    localColor: "bg-blue-800"
  },
  saskatchewan: {
    flag: "🌾",
    greeting: "Welcome from Curl Saskatchewan!",
    localColor: "bg-green-800"
  },
  atlantic: {
    flag: "🌊",
    greeting: "Welcome from Atlantic Canada!",
    localColor: "bg-blue-600"
  },
  territories: {
    flag: "❄️",
    greeting: "Welcome from Canada's North!",
    localColor: "bg-gray-600"
  }
};

export const ageGroupAdjustments = {
  youth: {
    tone: "fun",
    removeSponsors: true,
    extraBadges: ["Young Curler", "Future Star"],
    specialMessage: "Ready to sweep up some points and have fun?"
  },
  young_adult: {
    tone: "energetic", 
    emphasizeCompetition: true,
    socialFeatures: true
  },
  established: {
    tone: "professional",
    emphasizeProgress: true,
    clubFocus: true
  },
  senior: {
    tone: "respectful",
    emphasizeTradition: true,
    communityFocus: true
  }
};

/**
 * Determines which onboarding configuration to use based on user properties.
 * Includes logic for previewing specific roles via URL params.
 * @param {object} user - The user object from User.me().
 * @param {string|null} forcedRole - A role string from URL param to force a variant for preview.
 * @returns {{config: object, variant: string}} - The configuration object and the variant key.
 */
export const getOnboardingConfig = (user, forcedRole = null) => {
  let variantKey;

  // Prioritize forcedRole for previewing
  if (forcedRole && onboardingVariants[forcedRole]) {
    variantKey = forcedRole;
  } else {
    // Determine user role based on user_type, defaulting to FAN
    let baseUserType = (user?.user_type || 'FAN').toUpperCase();
    variantKey = baseUserType; // Start with the base user type

    // Special handling for Athletes to differentiate between club-affiliated and casual.
    if (variantKey === 'ATHLETE') {
      variantKey = user?.home_club_id ? 'ATHLETE_CLUB' : 'ATHLETE_CASUAL';
    }
    
    // Ensure specific admin and staff roles map correctly, overriding general user_type if needed.
    // user.role implies higher-level permission, user.user_type is a general category
    if (user?.role === 'admin') { // This could be for MA_ADMIN or other high-level admins
        if (user.user_type !== 'staff') { // Staff admin handled separately
            variantKey = 'MA_ADMIN';
        }
    }
    if (user?.user_type === 'club_admin') {
        variantKey = 'CLUB_ADMIN';
    }
    if (user?.user_type === 'staff') {
        variantKey = 'STAFF';
    }
  }

  // Get the base configuration for the determined variant
  let config = onboardingVariants[variantKey] || onboardingVariants.DEFAULT;

  // Add regional flavor
  const region = user?.ma_region;
  if (region && regionalFlavors[region]) {
    config = {
      ...config,
      regionalFlavor: regionalFlavors[region]
    };
  }

  // Age-based adjustments
  if (user?.birthdate) {
    const age = new Date().getFullYear() - new Date(user.birthdate).getFullYear();
    let ageGroup = 'established';
    
    if (age < 18) ageGroup = 'youth';
    else if (age < 35) ageGroup = 'young_adult';
    else if (age >= 65) ageGroup = 'senior';
    
    config = {
      ...config,
      ageAdjustments: ageGroupAdjustments[ageGroup]
    };
  }

  return { config, variant: variantKey };
};
