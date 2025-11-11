import { useState, useEffect } from 'react';

// Mock DOMO embed hook - in production this would integrate with actual DOMO API
export const useDomoEmbed = (dashboardId, filters = {}) => {
  const [embedData, setEmbedData] = useState({
    isLoading: true,
    error: null,
    embedUrl: null,
    data: null
  });

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setEmbedData(prev => ({ ...prev, isLoading: true }));
        
        // Simulate API call to DOMO
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Generate mock dashboard data based on dashboardId
        const mockData = generateMockData(dashboardId, filters);
        
        setEmbedData({
          isLoading: false,
          error: null,
          embedUrl: `https://public.domo.com/embed/pages/${dashboardId}`,
          data: mockData
        });
      } catch (error) {
        setEmbedData(prev => ({ 
          ...prev, 
          isLoading: false, 
          error: error.message 
        }));
      }
    };

    if (dashboardId) {
      loadDashboard();
    }
  }, [dashboardId, JSON.stringify(filters)]);

  return embedData;
};

const generateMockData = (dashboardId, filters) => {
  const baseData = {
    'executive-overview': {
      metrics: [
        { name: 'Total Members', value: 45720, change: 5.2, trend: 'up' },
        { name: 'Active Clubs', value: 892, change: -2.1, trend: 'down' },
        { name: 'Events This Year', value: 234, change: 12.4, trend: 'up' },
        { name: 'Revenue YTD', value: '$2.4M', change: 8.9, trend: 'up' }
      ],
      charts: [
        {
          type: 'line',
          title: 'Membership Growth',
          data: [
            { month: 'Jan', value: 42000 },
            { month: 'Feb', value: 42500 },
            { month: 'Mar', value: 43200 },
            { month: 'Apr', value: 44100 },
            { month: 'May', value: 44800 },
            { month: 'Jun', value: 45720 }
          ]
        },
        {
          type: 'bar',
          title: 'Regional Distribution',
          data: [
            { region: 'ON', clubs: 245, members: 12500 },
            { region: 'AB', clubs: 198, members: 9800 },
            { region: 'BC', clubs: 156, members: 8200 },
            { region: 'SK', clubs: 123, members: 6100 },
            { region: 'MB', clubs: 89, members: 4300 },
            { region: 'QC', clubs: 81, members: 4820 }
          ]
        }
      ]
    },
    'club-analytics': {
      metrics: [
        { name: 'Club Satisfaction', value: '4.2/5', change: 0.3, trend: 'up' },
        { name: 'Retention Rate', value: '87%', change: 2.1, trend: 'up' },
        { name: 'New Clubs (YTD)', value: 23, change: -15.2, trend: 'down' },
        { name: 'Survey Completion', value: '64%', change: 8.7, trend: 'up' }
      ],
      charts: [
        {
          type: 'doughnut',
          title: 'Club Size Distribution',
          data: [
            { label: 'Small (< 50)', value: 340 },
            { label: 'Medium (50-150)', value: 412 },
            { label: 'Large (150+)', value: 140 }
          ]
        },
        {
          type: 'heatmap',
          title: 'Geographic Distribution',
          data: generateHeatmapData()
        }
      ]
    },
    'sponsorship-roi': {
      metrics: [
        { name: 'Total Sponsorship', value: '$1.8M', change: 15.3, trend: 'up' },
        { name: 'Active Partners', value: 47, change: 4.4, trend: 'up' },
        { name: 'Renewal Rate', value: '89%', change: -3.2, trend: 'down' },
        { name: 'ROI Average', value: '3.2x', change: 12.1, trend: 'up' }
      ],
      charts: [
        {
          type: 'funnel',
          title: 'Sponsorship Pipeline',
          data: [
            { stage: 'Prospects', value: 156 },
            { stage: 'Qualified', value: 89 },
            { stage: 'Proposal', value: 34 },
            { stage: 'Negotiation', value: 18 },
            { stage: 'Closed', value: 12 }
          ]
        }
      ]
    },
    'financial-overview': {
      metrics: [
        { name: 'Revenue YTD', value: '$2.4M', change: 8.9, trend: 'up' },
        { name: 'Expenses YTD', value: '$1.9M', change: 6.2, trend: 'up' },
        { name: 'Net Income', value: '$520K', change: 18.4, trend: 'up' },
        { name: 'Cash Flow', value: '$340K', change: -5.1, trend: 'down' }
      ],
      charts: [
        {
          type: 'waterfall',
          title: 'Revenue Breakdown',
          data: [
            { category: 'Memberships', value: 890000 },
            { category: 'Sponsorships', value: 780000 },
            { category: 'Events', value: 450000 },
            { category: 'Merchandise', value: 120000 },
            { category: 'Other', value: 160000 }
          ]
        }
      ]
    }
  };

  return baseData[dashboardId] || baseData['executive-overview'];
};

const generateHeatmapData = () => {
  // Generate mock geographic heatmap data for Canadian provinces
  const provinces = ['AB', 'BC', 'MB', 'NB', 'NL', 'NT', 'NS', 'NU', 'ON', 'PE', 'QC', 'SK', 'YT'];
  return provinces.map(province => ({
    province,
    density: Math.floor(Math.random() * 100) + 1,
    clubs: Math.floor(Math.random() * 200) + 10
  }));
};