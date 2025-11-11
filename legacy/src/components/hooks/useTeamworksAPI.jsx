import { useState, useEffect } from 'react';

/**
 * Custom hook for Teamworks API integration
 * Handles data fetching, syncing, and XP interactions
 */
export const useTeamworksAPI = (userId) => {
  const [teamworksData, setTeamworksData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastSync, setLastSync] = useState(null);
  const [error, setError] = useState(null);

  // Mock data structure for development
  const mockTeamworksData = {
    user_id: userId,
    upcoming_sessions: [
      {
        id: 'tw_001',
        title: 'Morning Training Session',
        type: 'training',
        start_time: '2024-02-20T09:00:00Z',
        end_time: '2024-02-20T11:00:00Z',
        location: 'Saville Community Sports Centre',
        coach: 'Sarah Johnson',
        has_conflict: false,
        smart_broom_enabled: true,
        status: 'confirmed'
      },
      {
        id: 'tw_002',
        title: 'Team Strategy Meeting',
        type: 'meeting',
        start_time: '2024-02-21T19:00:00Z',
        end_time: '2024-02-21T20:30:00Z',
        location: 'Virtual - Zoom',
        coach: 'Mike Chen',
        has_conflict: false,
        smart_broom_enabled: false,
        status: 'pending'
      },
      {
        id: 'tw_003',
        title: 'Provincial Championship',
        type: 'event',
        start_time: '2024-02-25T08:00:00Z',
        end_time: '2024-02-25T18:00:00Z',
        location: 'Edmonton Curling Club',
        coach: 'Sarah Johnson',
        has_conflict: false,
        smart_broom_enabled: true,
        status: 'confirmed'
      },
      {
        id: 'tw_004',
        title: 'Travel to Nationals',
        type: 'travel',
        start_time: '2024-03-01T06:00:00Z',
        end_time: '2024-03-01T22:00:00Z',
        location: 'Calgary to Thunder Bay',
        has_conflict: true,
        smart_broom_enabled: false,
        status: 'confirmed'
      }
    ],
    pending_assignments: [
      {
        id: 'assign_001',
        title: 'Pre-Competition Nutrition Plan',
        description: 'Complete your nutrition tracking for the week leading up to Provincials',
        due_date: '2024-02-23T23:59:59Z',
        is_overdue: false,
        type: 'form',
        xp_reward: 15
      },
      {
        id: 'assign_002',
        title: 'Equipment Check Form',
        description: 'Verify all equipment is competition-ready',
        due_date: '2024-02-20T18:00:00Z',
        is_overdue: true,
        type: 'checklist',
        xp_reward: 15
      }
    ],
    recent_messages: [
      {
        id: 'msg_001',
        sender_name: 'Sarah Johnson',
        content: 'Great job on yesterday\'s training session! Your delivery consistency has improved significantly.',
        timestamp: '2024-02-19T14:30:00Z',
        channel: 'team-updates'
      },
      {
        id: 'msg_002',
        sender_name: 'Mike Chen',
        content: 'Reminder: Team meeting tomorrow at 7 PM. We\'ll be reviewing strategy for Provincials.',
        timestamp: '2024-02-19T10:15:00Z',
        channel: 'general'
      },
      {
        id: 'msg_003',
        sender_name: 'Team Captain',
        content: 'Equipment bags need to be packed and ready by Friday morning. Don\'t forget your Smart Broom!',
        timestamp: '2024-02-18T16:45:00Z',
        channel: 'logistics'
      }
    ],
    coach_updates: [
      {
        id: 'update_001',
        title: 'Performance Analysis - Week 7',
        content: 'Your sweeping technique has shown marked improvement. Focus on maintaining consistent pressure throughout the stone\'s path.',
        created_date: '2024-02-18T12:00:00Z',
        coach_name: 'Sarah Johnson',
        acknowledged: false,
        file_url: 'https://teamworks.com/files/performance_analysis_week7.pdf'
      },
      {
        id: 'update_002',
        title: 'Nutrition Guidelines Update',
        content: 'New hydration protocol for competition days. Please review and confirm understanding.',
        created_date: '2024-02-17T09:30:00Z',
        coach_name: 'Mike Chen',
        acknowledged: true,
        file_url: null
      }
    ],
    smart_broom_sessions: [
      {
        id: 'sb_001',
        session_name: 'Morning Training - Feb 19',
        date: '2024-02-19T09:00:00Z',
        teamworks_session_id: 'tw_001',
        sync_status: 'synced',
        performance_score: 87
      },
      {
        id: 'sb_002',
        session_name: 'Practice Session - Feb 17',
        date: '2024-02-17T14:00:00Z',
        teamworks_session_id: null,
        sync_status: 'manual',
        performance_score: 91
      }
    ],
    unread_messages: 2,
    sync_status: 'active',
    last_sync: '2024-02-19T15:30:00Z'
  };

  useEffect(() => {
    if (userId) {
      loadTeamworksData();
      // Set up periodic sync every 15 minutes
      const syncInterval = setInterval(syncTeamworksData, 15 * 60 * 1000);
      return () => clearInterval(syncInterval);
    }
  }, [userId]);

  const loadTeamworksData = async () => {
    setIsLoading(true);
    try {
      // In production, this would make actual API calls to Teamworks
      // For now, we'll simulate the API call with mock data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setTeamworksData(mockTeamworksData);
      setLastSync(new Date().toISOString());
      setError(null);
    } catch (err) {
      console.error('Error loading Teamworks data:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const syncTeamworksData = async () => {
    try {
      // In production, this would sync with Teamworks API
      console.log('Syncing Teamworks data...');
      await loadTeamworksData();
    } catch (err) {
      console.error('Sync failed:', err);
    }
  };

  const syncNow = async () => {
    setIsLoading(true);
    await syncTeamworksData();
    setIsLoading(false);
  };

  const acknowledgeItem = async (itemId, itemType) => {
    try {
      // In production, this would call Teamworks API to acknowledge the item
      console.log(`Acknowledging ${itemType} ${itemId}`);
      
      // Update local state
      setTeamworksData(prev => {
        const updated = { ...prev };
        
        if (itemType === 'coach_note') {
          updated.coach_updates = updated.coach_updates.map(update =>
            update.id === itemId ? { ...update, acknowledged: true } : update
          );
        } else if (itemType === 'assignment') {
          updated.pending_assignments = updated.pending_assignments.filter(
            assignment => assignment.id !== itemId
          );
        }
        
        return updated;
      });
      
      return true;
    } catch (err) {
      console.error('Error acknowledging item:', err);
      throw err;
    }
  };

  return {
    teamworksData,
    isLoading,
    lastSync,
    error,
    syncNow,
    acknowledgeItem,
    refreshData: loadTeamworksData
  };
};