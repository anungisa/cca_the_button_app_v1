// This hook is deprecated - use direct entity queries instead
export const useCurlingDataIntegration = () => {
  return {
    data: null,
    loading: false,
    error: 'This integration method is deprecated. Use CTRSRanking entity directly.',
    lastUpdated: null,
    refresh: () => console.warn('useCurlingDataIntegration is deprecated')
  };
};