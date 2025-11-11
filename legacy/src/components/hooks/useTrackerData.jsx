import { useState, useEffect, useCallback } from 'react';
import { User, HighPerformanceLog, PerformanceBenchmark, SmartBroomSession } from '@/api/entities';
import { useXP } from '../XPContext';
import { subDays, format, eachDayOfInterval, isSameDay } from 'date-fns';

const MICRO_CHALLENGES = [
  { id: 'streak_3', description: 'Log training 3 days in a row', goal: 3, type: 'streak', xp: 50, badge: 'getting_warmer' },
  { id: 'strength_1', description: 'Log a strength session', goal: 1, type: 'log_type', logType: 'off_ice_training', xp: 25 },
  { id: 'sync_broom_1', description: 'Sync a Smart Broom session', goal: 1, type: 'log_type', logType: 'smart_broom', xp: 100, badge: 'tech_trained' },
  { id: 'beat_pb_split_time', description: 'Beat your best split time', goal: 1, type: 'personal_best', testType: 'split_time_T_to_hog', xp: 75, badge: 'speed_demon' },
  { id: 'streak_7', description: 'Log for a 7-day streak!', goal: 7, type: 'streak', xp: 150, badge: 'consistent_curler' }
];

export const useTrackerData = (userId) => {
  const [logs, setLogs] = useState([]);
  const [benchmarks, setBenchmarks] = useState([]);
  const [broomSessions, setBroomSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [heatmapData, setHeatmapData] = useState([]);
  const [insights, setInsights] = useState([]);
  const [challenges, setChallenges] = useState([]);
  const { awardPoints, awardBadge } = useXP();

  const processData = useCallback(async (logs, benchmarks, broomSessions) => {
    if (!logs) return;

    // --- 1. Process Heatmap Data ---
    const today = new Date();
    const startDate = subDays(today, 365);
    const dateRange = eachDayOfInterval({ start: startDate, end: today });
    const processedHeatmap = dateRange.map(date => {
      const logsForDay = logs.filter(log => isSameDay(new Date(log.date), date));
      const broomForDay = broomSessions.filter(s => isSameDay(new Date(s.session_date), date));
      const count = logsForDay.length + broomForDay.length;
      return { date: format(date, 'yyyy-MM-dd'), count };
    });
    setHeatmapData(processedHeatmap);

    // --- 2. Calculate Streaks & Generate Insights ---
    let currentStreak = 0;
    if (processedHeatmap.length > 0) {
      const reversedHeatmap = [...processedHeatmap].reverse();
      if (reversedHeatmap[0].count > 0 || (reversedHeatmap[1] && reversedHeatmap[1].count > 0)) {
         for(let i = (reversedHeatmap[0].count > 0 ? 0 : 1); i < reversedHeatmap.length; i++) {
           if(reversedHeatmap[i].count > 0) currentStreak++;
           else break;
         }
      }
    }
    
    const newInsights = [];
    newInsights.push(`You're on a ${currentStreak}-day training streak. Keep it up!`);
    if(currentStreak > 0 && currentStreak % 3 === 0) newInsights.push(`Great consistency! That's a ${currentStreak} day streak.`);

    // --- 3. Check Personal Bests ---
    const splitTimeTests = benchmarks.filter(b => b.test_type === 'split_time_T_to_hog').sort((a,b) => a.result_value - b.result_value);
    if(splitTimeTests.length > 0) {
        newInsights.push(`Your best split time is ${splitTimeTests[0].result_value}s. Elite tier! 💎`);
    }

    setInsights(newInsights);

    // --- 4. Process Challenges ---
    const processedChallenges = MICRO_CHALLENGES.map(challenge => {
      let progress = 0;
      switch (challenge.type) {
        case 'streak':
          progress = Math.min(currentStreak, challenge.goal);
          break;
        case 'log_type':
          if (challenge.logType === 'smart_broom') {
            progress = broomSessions.length > 0 ? 1 : 0;
          } else {
            progress = logs.some(l => l.activity_type === challenge.logType) ? 1 : 0;
          }
          break;
        case 'personal_best':
            // This is event-driven, so we check if a recent PB was set.
            const recentPB = benchmarks.find(b => b.is_personal_best && subDays(new Date(), 7) < new Date(b.test_date));
            if(recentPB && recentPB.test_type === challenge.testType) progress = 1;
            break;
        default:
          progress = 0;
      }
      const isComplete = progress >= challenge.goal;
      // In a real app, we'd check if the reward was already given.
      if (isComplete) {
        awardPoints(challenge.xp, 'challenge_complete', challenge.description);
        if (challenge.badge) awardBadge(challenge.badge, challenge.description, 'Challenge Completion');
      }
      return { ...challenge, progress, isComplete };
    });
    setChallenges(processedChallenges);

  }, [awardPoints, awardBadge]);

  useEffect(() => {
    if (userId) {
      const fetchData = async () => {
        setIsLoading(true);
        try {
          const [logData, benchmarkData, broomData] = await Promise.all([
            HighPerformanceLog.filter({ user_id: userId }),
            PerformanceBenchmark.filter({ user_id: userId }),
            SmartBroomSession.filter({ user_id: userId })
          ]);
          setLogs(logData);
          setBenchmarks(benchmarkData);
          setBroomSessions(broomData);
          await processData(logData, benchmarkData, broomData);
        } catch (error) {
          console.error("Error fetching tracker data:", error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchData();
    }
  }, [userId, processData]);
  
  const refreshData = useCallback(async () => {
     if (userId) {
      const [logData, benchmarkData, broomData] = await Promise.all([
        HighPerformanceLog.filter({ user_id: userId }),
        PerformanceBenchmark.filter({ user_id: userId }),
        SmartBroomSession.filter({ user_id: userId })
      ]);
      setLogs(logData);
      setBenchmarks(benchmarkData);
      setBroomSessions(broomData);
      await processData(logData, benchmarkData, broomData);
    }
  }, [userId, processData]);

  return { isLoading, logs, benchmarks, broomSessions, heatmapData, insights, challenges, refreshData };
};