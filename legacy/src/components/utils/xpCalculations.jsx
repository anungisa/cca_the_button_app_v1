// XP Calculation utilities
export const calculateTierProgress = (currentXP, tier) => {
  const tierThresholds = {
    granite_rookie: { min: 0, max: 500 },
    sheet_star: { min: 500, max: 2000 },
    house_hero: { min: 2000, max: 5000 },
    button_boss: { min: 5000, max: 10000 },
    hack_master: { min: 10000, max: 25000 },
    granite_legacy: { min: 25000, max: Infinity }
  };

  const current = tierThresholds[tier];
  if (!current) return { progress: 0, nextTier: null };

  const progress = ((currentXP - current.min) / (current.max - current.min)) * 100;
  const nextTierKey = Object.keys(tierThresholds).find(key => 
    tierThresholds[key].min === current.max
  );

  return {
    progress: Math.min(progress, 100),
    nextTier: nextTierKey || null,
    pointsToNext: Math.max(0, current.max - currentXP)
  };
};

export const calculateXPMultiplier = (userType, fanPassStatus = 'none') => {
  let baseMultiplier = 1;
  
  // Role-based multipliers
  switch (userType) {
    case 'volunteer':
      baseMultiplier = 1.5;
      break;
    case 'coach':
      baseMultiplier = 1.25;
      break;
    case 'athlete':
      baseMultiplier = 1;
      break;
    default:
      baseMultiplier = 1;
  }

  // Fan Pass multiplier
  if (fanPassStatus === 'monthly' || fanPassStatus === 'annual') {
    baseMultiplier *= 2;
  }

  return baseMultiplier;
};

export const getTierName = (tier) => {
  const tierNames = {
    granite_rookie: 'Granite Rookie',
    sheet_star: 'Sheet Star',
    house_hero: 'House Hero',
    button_boss: 'Button Boss',
    hack_master: 'Hack Master',
    granite_legacy: 'Granite Legacy'
  };
  
  return tierNames[tier] || 'Unknown Tier';
};