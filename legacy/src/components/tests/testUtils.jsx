import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { BrowserRouter } from 'react-router-dom';
import { XPProvider } from '../XPContext';

// Create a test wrapper that provides all necessary contexts
const AllTheProviders = ({ children }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <XPProvider>
          {children}
        </XPProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

// Custom render function that includes providers
const customRender = (ui, options) =>
  render(ui, { wrapper: AllTheProviders, ...options });

// Re-export everything
export * from '@testing-library/react';
export { customRender as render };

// Common test utilities
export const mockUser = {
  id: 'test-user-1',
  email: 'test@example.com',
  full_name: 'Test User',
  user_type: 'curler',
  role: 'user'
};

export const mockLoyaltyData = {
  user_id: 'test-user-1',
  curl_points: 150,
  tier: 'granite_rookie',
  badges: [],
  total_earned_points: 150
};

// Mock entity operations
export const mockEntityOperations = (entityName) => ({
  list: () => Promise.resolve([]),
  create: () => Promise.resolve({}),
  update: () => Promise.resolve({}),
  delete: () => Promise.resolve({}),
  filter: () => Promise.resolve([]),
  me: () => Promise.resolve(mockUser)
});

// Mock XP context
export const mockXPContext = {
  user: mockUser,
  loyaltyData: mockLoyaltyData,
  isLoading: false,
  awardPoints: () => Promise.resolve(),
  awardBadge: () => Promise.resolve(),
  refreshXPData: () => Promise.resolve()
};