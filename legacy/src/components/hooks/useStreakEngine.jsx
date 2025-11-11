import { useState, useEffect, useCallback } from 'react';
import { HighPerformanceLog, SmartBroomSession } from '@/api/entities';
import { useXP } from '../XPContext';
import { isSameDay, subDays, differenceInDays } from 'date-fns';

export const useStreakEngine = (userId) => {
  const { awardPoints, awardBadge } = useXP();
  const [sessionLogs, setSessionLogs] = useState([]);
  const [streakData, setStreakData] = useState({
    currentStreak: 0,
    longestStreak: 0,
    lastLogDate: null,
  });
  const [isLoading, setIsLoading] = useState(true);

  const fetchSessionData = useCallback(async () => {
    if (!userId) return;
    setIsLoading(true);
    try {
      const hpLogs = await HighPerformanceLog.filter({ user_id: userId });
      const broomLogs = await SmartBroomSession.filter({ user_id: userId });
      
      const allLogs = [
        ...hpLogs.map(log => ({ date: new Date(log.date), type: log.activity_type })),
        ...broomLogs.map(log => ({ date: new Date(log.session_date), type: 'smart_broom' }))
      ];

      const sortedLogs = allLogs.sort((a, b) => b.date - a.date);
      setSessionLogs(sortedLogs);
      calculateStreaks(sortedLogs);

    } catch (error) {
      console.error("Error fetching session data for streak engine:", error);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchSessionData();
  }, [fetchSessionData]);

  const calculateStreaks = (logs) => {
    if (logs.length === 0) {
      setStreakData({ currentStreak: 0, longestStreak: 0, lastLogDate: null });
      return;
    }

    const uniqueLogDays = [...new Set(logs.map(log => log.date.toDateString()))]
      .map(dateStr => new Date(dateStr))
      .sort((a, b) => b - a);

    if (uniqueLogDays.length === 0) return;

    let currentStreak = 0;
    let longestStreak = 0;
    
    const today = new Date();
    const yesterday = subDays(today, 1);
    
    // Check if the most recent log is today or yesterday to start the streak
    if (isSameDay(uniqueLogDays[0], today) || isSameDay(uniqueLogDays[0], yesterday)) {
      currentStreak = 1;
      for (let i = 0; i < uniqueLogDays.length - 1; i++) {
        const diff = differenceInDays(uniqueLogDays[i], uniqueLogDays[i+1]);
        if (diff === 1) {
          currentStreak++;
        } else {
          break;
        }
      }
    }
    
    // Find longest streak in history
    if (uniqueLogDays.length > 0) {
        let max = 1;
        let currentMax = 1;
        for (let i = 0; i < uniqueLogDays.length - 1; i++) {
            if (differenceInDays(uniqueLogDays[i], uniqueLogDays[i+1]) === 1) {
                currentMax++;
            } else {
                max = Math.max(max, currentMax);
                currentMax = 1;
            }
        }
        longestStreak = Math.max(max, currentMax);
    } else {
        longestStreak = currentStreak;
    }


    setStreakData({
      currentStreak,
      longestStreak,
      lastLogDate: uniqueLogDays[0]
    });
  };

  const evaluateChallengesOnNewLog = async () => {
    // This is called after a new session is logged
    await fetchSessionData(); // Refresh data first

    // Sample Challenge: Log 3 sessions in a week
    const oneWeekAgo = subDays(new Date(), 7);
    const recentSessions = sessionLogs.filter(log => log.date >= oneWeekAgo);
    if (recentSessions.length === 3) {
      const success = await awardPoints(75, 'challenge', 'Logged 3 sessions in one week');
      if (success) await awardBadge('week_warrior', 'Week Warrior', 'Logged 3 sessions in a week');
    }

    // Streak Challenge
    if (streakData.currentStreak === 5) {
      const success = await awardPoints(150, 'challenge', 'Achieved a 5-day training streak!');
      if(success) await awardBadge('hot_streak', 'Hot Streak', 'Logged 5 days in a row');
    }
  };

  return { streakData, sessionLogs, isLoading, evaluateChallengesOnNewLog, refreshStreakData: fetchSessionData };
};