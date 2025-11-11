import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { User, LoyaltyProgram, PointTransaction } from '@/api/entities';

// Query Keys
export const QUERY_KEYS = {
  USER: ['user'],
  LOYALTY: ['loyalty'],
  TRANSACTIONS: ['transactions'],
  EVENTS: ['events'],
  CLUBS: ['clubs']
};

// User Queries
export const useUserQuery = () => {
  return useQuery({
    queryKey: QUERY_KEYS.USER,
    queryFn: () => User.me(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    retry: (failureCount, error) => {
      // Don't retry if user is not authenticated
      if (error?.message?.includes('not authenticated')) {
        return false;
      }
      return failureCount < 3;
    }
  });
};

export const useUpdateUserMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (userData) => User.updateMyUserData(userData),
    onSuccess: (updatedUser) => {
      // Optimistically update the cache
      queryClient.setQueryData(QUERY_KEYS.USER, updatedUser);
    },
    onError: () => {
      // Invalidate and refetch on error
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USER });
    }
  });
};

// Loyalty Queries
export const useLoyaltyQuery = (userId) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.LOYALTY, userId],
    queryFn: async () => {
      const profiles = await LoyaltyProgram.filter({ user_id: userId });
      return profiles[0] || null;
    },
    enabled: !!userId,
    staleTime: 2 * 60 * 1000, // 2 minutes - XP changes frequently
    cacheTime: 5 * 60 * 1000
  });
};

export const useAwardPointsMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ userId, points, source, description }) => {
      // Create transaction
      const transaction = await PointTransaction.create({
        user_id: userId,
        points_amount: points,
        transaction_type: source,
        description: description,
        source: 'app'
      });

      // Update loyalty data
      const loyaltyData = queryClient.getQueryData([...QUERY_KEYS.LOYALTY, userId]);
      if (loyaltyData) {
        const updatedProfile = await LoyaltyProgram.update(loyaltyData.id, {
          curl_points: loyaltyData.curl_points + points,
          total_earned_points: loyaltyData.total_earned_points + points
        });
        return updatedProfile;
      }
      return transaction;
    },
    onSuccess: (_, variables) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: [...QUERY_KEYS.LOYALTY, variables.userId] });
      queryClient.invalidateQueries({ queryKey: [...QUERY_KEYS.TRANSACTIONS, variables.userId] });
    }
  });
};

// Prefetch strategies
export const usePrefetchUserData = () => {
  const queryClient = useQueryClient();
  
  return {
    prefetchLoyaltyData: (userId) => {
      queryClient.prefetchQuery({
        queryKey: [...QUERY_KEYS.LOYALTY, userId],
        queryFn: async () => {
          const profiles = await LoyaltyProgram.filter({ user_id: userId });
          return profiles[0] || null;
        },
        staleTime: 2 * 60 * 1000
      });
    }
  };
};