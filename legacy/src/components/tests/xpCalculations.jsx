
/**
 * @jest-environment jsdom
 */
import { describe, it, expect, beforeEach, jest } from 'vitest';
import { calculateTierProgress, calculateXPMultiplier, getTierName } from '../utils/xpCalculations';
import { XPEngine } from '../xp/XPEngine';

// Mocking dependencies
jest.mock('@/api/entities', () => ({
  PointTransaction: {
    create: jest.fn().mockResolvedValue({ id: 'txn123' }),
    filter: jest.fn().mockResolvedValue([]),
  },
  LoyaltyProgram: {
    update: jest.fn().mockResolvedValue({}),
    filter: jest.fn().mockResolvedValue([{ 
      id: 'lp1', 
      curl_points: 100,
      tier: 'granite_rookie',
      tier_progress: { current_xp: 100, next_tier_xp: 500 } 
    }]),
  },
  User: {
    filter: jest.fn().mockResolvedValue([{ id: 'user1', fan_pass_status: 'active' }])
  }
}));

// Mocking a simple cache for testing cooldowns
const cache = new Map();
XPEngine.getCachedValue = jest.fn(async (key) => cache.get(key));
XPEngine.setCachedValue = jest.fn(async (key, value) => cache.set(key, value));

describe('XP Calculations', () => {
  describe('calculateTierProgress', () => {
    it('should calculate tier progress correctly', () => {
      const result = calculateTierProgress(250, 'granite_rookie');
      expect(result.progress).toBe(50); // 250 out of 500
      expect(result.nextTier).toBe('sheet_star');
      expect(result.pointsToNext).toBe(250);
    });

    it('should handle max tier correctly', () => {
      const result = calculateTierProgress(30000, 'granite_legacy');
      expect(result.progress).toBe(100);
      expect(result.nextTier).toBe(null);
      expect(result.pointsToNext).toBe(0);
    });

    it('should handle tier boundaries', () => {
      const result = calculateTierProgress(500, 'granite_rookie');
      expect(result.progress).toBe(100);
      expect(result.pointsToNext).toBe(0);
    });

    it('should handle invalid tier', () => {
      const result = calculateTierProgress(100, 'invalid_tier');
      expect(result.progress).toBe(0);
      expect(result.nextTier).toBe(null);
    });
  });

  describe('calculateXPMultiplier', () => {
    it('should return correct multiplier for volunteers', () => {
      const multiplier = calculateXPMultiplier('volunteer');
      expect(multiplier).toBe(1.5);
    });

    it('should return correct multiplier for coaches', () => {
      const multiplier = calculateXPMultiplier('coach');
      expect(multiplier).toBe(1.25);
    });

    it('should apply Fan Pass multiplier correctly', () => {
      const multiplier = calculateXPMultiplier('fan', 'monthly');
      expect(multiplier).toBe(2); // 1 * 2 for Fan Pass
    });

    it('should combine role and Fan Pass multipliers', () => {
      const multiplier = calculateXPMultiplier('volunteer', 'annual');
      expect(multiplier).toBe(3); // 1.5 * 2 for volunteer with Fan Pass
    });
  });

  describe('getTierName', () => {
    it('should return correct tier names', () => {
      expect(getTierName('granite_rookie')).toBe('Granite Rookie');
      expect(getTierName('sheet_star')).toBe('Sheet Star');
      expect(getTierName('granite_legacy')).toBe('Granite Legacy');
    });

    it('should handle invalid tier', () => {
      expect(getTierName('invalid_tier')).toBe('Unknown Tier');
    });
  });
});

describe('XPEngine', () => {

  beforeEach(() => {
    jest.clearAllMocks();
    cache.clear();
  });

  it('should award base XP correctly', async () => {
    const result = await XPEngine.awardXP('user1', 50, 'trivia');
    expect(result.awarded).toBe(100); // 50 * 2x fan pass multiplier
    expect(XPEngine.setCachedValue).toHaveBeenCalledWith(expect.stringContaining('cooldown_user1_trivia'), expect.any(String), 300);
  });

  it('should respect cooldowns and rate limits', async () => {
    await XPEngine.awardXP('user1', 50, 'trivia');
    
    await expect(XPEngine.awardXP('user1', 50, 'trivia'))
      .rejects
      .toThrow('Rate limit exceeded: Cooldown active for 5 minutes');
  });

  it('should cap total multiplier at 5x', async () => {
    // Mocking a high multiplier scenario
    XPEngine.calculateMultipliers = jest.fn().mockResolvedValue({
      base: 1.0, fan_pass: 2.0, streak: 1.5, event: 2.0, total: 6.0
    });
    
    const result = await XPEngine.awardXP('user1', 10, 'patch_scan');
    expect(result.awarded).toBe(50); // 10 * 5 (capped)
  });

  it('should prevent XP awards beyond daily limit', async () => {
    XPEngine.getUserXPForPeriod = jest.fn().mockResolvedValue(480);
    
    await expect(XPEngine.awardXP('user1', 30, 'livestream')) // 30 * 2x = 60, total would be 540
      .rejects
      .toThrow('XP limit exceeded: Daily XP limit reached');
  });

  it('should handle XP redemption (negative points)', async () => {
    const result = await XPEngine.awardXP('user1', -100, 'redeem_merch');
    // Redemption should not be multiplied
    expect(result.awarded).toBe(-100);
  });
});
