import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { XPProvider, useXP } from '@/components/XPContext';

// Mock the entities
vi.mock('@/api/entities', () => ({
  User: {
    me: vi.fn()
  },
  LoyaltyProgram: {
    filter: vi.fn(),
    create: vi.fn(),
    update: vi.fn()
  },
  PointTransaction: {
    create: vi.fn()
  }
}));

const mockUser = {
  id: 'user123',
  full_name: 'Test User',
  user_type: 'fan'
};

const mockLoyaltyData = {
  id: 'loyalty123',
  user_id: 'user123',
  curl_points: 100,
  tier: 'granite_rookie',
  tier_progress: { current_xp: 100, next_tier_xp: 500 },
  badges: [],
  total_earned_points: 100,
  fan_pass_status: 'none'
};

describe('useXP Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should calculate XP multiplier correctly for different user types', async () => {
    const { User, LoyaltyProgram } = await import('@/api/entities');
    User.me.mockResolvedValue(mockUser);
    LoyaltyProgram.filter.mockResolvedValue([mockLoyaltyData]);

    const wrapper = ({ children }) => <XPProvider>{children}</XPProvider>;
    const { result } = renderHook(() => useXP(), { wrapper });

    // Wait for initial load
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
    });

    const multiplier = result.current.getRoleBasedXPMultiplier();
    expect(multiplier).toBe(1); // Fan gets base multiplier

    // Test volunteer multiplier
    User.me.mockResolvedValue({...mockUser, user_type: 'volunteer'});
    const volunteerMultiplier = result.current.getRoleBasedXPMultiplier();
    expect(volunteerMultiplier).toBe(1.5);
  });

  it('should award points with correct multiplier for Fan Pass users', async () => {
    const { User, LoyaltyProgram, PointTransaction } = await import('@/api/entities');
    
    const fanPassUser = {...mockLoyaltyData, fan_pass_status: 'monthly'};
    User.me.mockResolvedValue(mockUser);
    LoyaltyProgram.filter.mockResolvedValue([fanPassUser]);
    LoyaltyProgram.update.mockResolvedValue({...fanPassUser, curl_points: 200});
    PointTransaction.create.mockResolvedValue({});

    const wrapper = ({ children }) => <XPProvider>{children}</XPProvider>;
    const { result } = renderHook(() => useXP(), { wrapper });

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
    });

    await act(async () => {
      await result.current.awardPoints(50, 'volunteer', 'Test volunteering');
    });

    expect(PointTransaction.create).toHaveBeenCalledWith({
      user_id: 'user123',
      points_amount: 100, // 50 * 2 (Fan Pass multiplier)
      transaction_type: 'volunteer',
      description: 'Test volunteering',
      reference_id: null,
      multiplier: 2,
      source: 'app'
    });
  });

  it('should handle tier progression correctly', async () => {
    const { User, LoyaltyProgram } = await import('@/api/entities');
    
    const nearTierUp = {
      ...mockLoyaltyData,
      tier: 'granite_rookie',
      tier_progress: { current_xp: 480, next_tier_xp: 500 }
    };
    
    User.me.mockResolvedValue(mockUser);
    LoyaltyProgram.filter.mockResolvedValue([nearTierUp]);
    LoyaltyProgram.update.mockResolvedValue({
      ...nearTierUp,
      tier: 'sheet_star',
      curl_points: 150,
      tier_progress: { current_xp: 30, next_tier_xp: 2000 }
    });

    const wrapper = ({ children }) => <XPProvider>{children}</XPProvider>;
    const { result } = renderHook(() => useXP(), { wrapper });

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
    });

    await act(async () => {
      await result.current.awardPoints(50, 'donation', 'Test donation');
    });

    expect(LoyaltyProgram.update).toHaveBeenCalledWith(
      'loyalty123',
      expect.objectContaining({
        tier: 'sheet_star'
      })
    );
  });
});