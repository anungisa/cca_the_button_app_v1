
import { useState, useEffect, useCallback } from 'react';
import { SmartBroomSession } from '@/api/entities';
import { useXP } from '../XPContext';

export const useBroomData = (userId) => {
  const { awardPoints, awardBadge } = useXP();
  const [isConnected, setIsConnected] = useState(false);
  const [device, setDevice] = useState(null);
  const [currentSession, setCurrentSession] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [deviceInfo, setDeviceInfo] = useState(null);

  // BLE connection logic
  const connectToBroom = useCallback(async () => {
    try {
      setConnectionStatus('connecting');
      
      if (!navigator.bluetooth) {
        throw new Error('Bluetooth not supported on this device');
      }

      const device = await navigator.bluetooth.requestDevice({
        filters: [
          { namePrefix: 'SmartBroom' },
          { services: ['6e400001-b5a3-f393-e0a9-e50e24dcca9e'] } // UART service UUID
        ],
        optionalServices: ['6e400001-b5a3-f393-e0a9-e50e24dcca9e']
      });

      const server = await device.gatt.connect();
      const service = await server.getPrimaryService('6e400001-b5a3-f393-e0a9-e50e24dcca9e');
      const characteristic = await service.getCharacteristic('6e400002-b5a3-f393-e0a9-e50e24dcca9e');

      // Start notifications
      await characteristic.startNotifications();
      characteristic.addEventListener('characteristicvaluechanged', handleDataReceived);

      setDevice(device);
      setIsConnected(true);
      setConnectionStatus('connected');
      
      // Get device info
      setDeviceInfo({
        device_id: device.id || 'unknown',
        firmware_version: '1.0.0',
        battery_level: 85 // Mock data - would come from device
      });

    } catch (error) {
      console.error('Broom connection failed:', error);
      setConnectionStatus('error');
    }
  }, []);

  const handleDataReceived = useCallback((event) => {
    if (!isRecording) return;

    try {
      const decoder = new TextDecoder();
      const data = decoder.decode(event.target.value);
      const sensorData = JSON.parse(data);
      
      // Validate and process sensor data
      if (sensorData.timestamp && sensorData.pressure !== undefined) {
        setCurrentSession(prev => [...prev, {
          timestamp: new Date().toISOString(),
          pressure: parseFloat(sensorData.pressure),
          motionBurst: parseFloat(sensorData.motionBurst || 0),
          sweepTime: parseFloat(sensorData.sweepTime || 0)
        }]);
      }
    } catch (error) {
      console.error('Error parsing sensor data:', error);
    }
  }, [isRecording]);

  const startRecording = useCallback(() => {
    setIsRecording(true);
    setCurrentSession([]);
  }, []);

  const stopRecording = useCallback(async (sessionMeta = {}) => {
    setIsRecording(false);
    
    if (currentSession.length === 0) return null;

    // Calculate performance metrics
    const metrics = calculatePerformanceMetrics(currentSession);
    
    // Save session to database
    const sessionData = {
      user_id: userId,
      session_date: new Date().toISOString(),
      session_duration_minutes: (currentSession.length * 0.5) / 60, // Assuming 0.5s intervals
      total_sweeps: currentSession.length,
      session_data: currentSession,
      performance_metrics: metrics,
      device_info: deviceInfo,
      session_type: sessionMeta.type || 'training',
      session_tags: sessionMeta.tags || [],
    };

    try {
      const savedSession = await SmartBroomSession.create(sessionData);
      
      // Award XP and Badges
      await awardPoints(150, 'smart_broom', 'Completed a Smart Broom Session');
      
      const allSessions = await SmartBroomSession.filter({ user_id: userId });
      if (allSessions.length === 1) {
        await awardPoints(100, 'smart_broom_milestone', 'First Smart Broom Session!');
        await awardBadge('connected_curler', 'Connected Curler', 'Synced your first Smart Broom session');
      }
      if (allSessions.length === 10) {
        await awardPoints(300, 'smart_broom_milestone', 'Synced 10 sessions');
        await awardBadge('smart_consistency', 'Smart Consistency', 'Synced 10 Smart Broom sessions');
      }

      if (metrics.overall_score > 90) {
        await awardPoints(200, 'smart_broom_performance', 'Excellent session score!');
        await awardBadge('sweeping_machine', 'Sweeping Machine', 'Achieved an overall score of 90+');
      }
      
      if (metrics.pressure_consistency < 2.0) {
        await awardPoints(150, 'smart_broom_performance', 'Great sweeping consistency!');
        await awardBadge('technique_pro', 'Technique Pro', 'Achieved high form stability');
      }

      return savedSession;
    } catch (error) {
      console.error('Error saving session:', error);
      return null;
    }
  }, [currentSession, userId, deviceInfo, awardPoints, awardBadge]);

  const calculatePerformanceMetrics = (sessionData) => {
    if (sessionData.length === 0) return {};

    const pressures = sessionData.map(d => d.pressure).filter(p => p > 0);
    const sweepTimes = sessionData.map(d => d.sweepTime).filter(t => t > 0);
    
    const avgPressure = pressures.reduce((a, b) => a + b, 0) / pressures.length;
    const maxPressure = Math.max(...pressures);
    const pressureSD = Math.sqrt(pressures.reduce((a, b) => a + Math.pow(b - avgPressure, 2), 0) / pressures.length);
    
    const avgSweepTime = sweepTimes.reduce((a, b) => a + b, 0) / sweepTimes.length;
    
    // Scoring logic
    const consistencyScore = Math.max(0, 100 - (pressureSD * 10)); // Lower SD = higher score
    const pressureScore = Math.min(100, (avgPressure / 20) * 100); // Optimal pressure ~20N
    const rhythmScore = Math.min(100, (2.5 / avgSweepTime) * 100); // Optimal ~2.5s sweeps
    
    const overallScore = (consistencyScore + pressureScore + rhythmScore) / 3;

    return {
      avg_pressure: parseFloat(avgPressure.toFixed(2)),
      max_pressure: parseFloat(maxPressure.toFixed(2)),
      pressure_consistency: parseFloat(pressureSD.toFixed(2)),
      avg_sweep_time: parseFloat(avgSweepTime.toFixed(2)),
      rhythm_score: parseFloat(rhythmScore.toFixed(1)),
      overall_score: parseFloat(overallScore.toFixed(1))
    };
  };

  const disconnectBroom = useCallback(() => {
    if (device && device.gatt.connected) {
      device.gatt.disconnect();
    }
    setDevice(null);
    setIsConnected(false);
    setConnectionStatus('disconnected');
    setIsRecording(false);
  }, [device]);

  const importCSVSession = useCallback(async (csvData, sessionDate, sessionMeta = {}) => {
    try {
      // Parse CSV data
      const lines = csvData.split('\n').slice(1); // Skip header
      const sessionData = lines.map(line => {
        const [timestamp, pressure, motionBurst, sweepTime] = line.split(',');
        return {
          timestamp: new Date(timestamp).toISOString(),
          pressure: parseFloat(pressure),
          motionBurst: parseFloat(motionBurst),
          sweepTime: parseFloat(sweepTime)
        };
      }).filter(d => !isNaN(d.pressure));

      const metrics = calculatePerformanceMetrics(sessionData);
      
      const session = {
        user_id: userId,
        session_date: sessionDate,
        session_duration_minutes: sessionData.length * 0.5 / 60,
        total_sweeps: sessionData.length,
        session_data: sessionData,
        performance_metrics: metrics,
        session_type: sessionMeta.type || 'training',
        session_tags: sessionMeta.tags || [],
      };

      return await SmartBroomSession.create(session);
    } catch (error) {
      console.error('Error importing CSV:', error);
      throw error;
    }
  }, [userId]);

  return {
    isConnected,
    device,
    currentSession,
    isRecording,
    connectionStatus,
    deviceInfo,
    connectToBroom,
    startRecording,
    stopRecording,
    disconnectBroom,
    importCSVSession
  };
};
