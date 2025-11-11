import { useState, useCallback } from 'react';

const getApiConfig = () => ({
  zoom: {
    baseUrl: '/api/integrations/zoom'
  }
});

export const useZoomIntegration = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const config = getApiConfig();

  const zoomAPI = useCallback(async (endpoint, options = {}) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${config.zoom.baseUrl}/${endpoint}`, {
        method: options.method || 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        },
        body: options.body ? JSON.stringify(options.body) : undefined
      });
      
      if (!response.ok) throw new Error(`Zoom API error: ${response.statusText}`);
      return await response.json();
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [config.zoom.baseUrl]);

  const createMeeting = useCallback(async (meetingData) => {
    try {
      return await zoomAPI('users/me/meetings', {
        method: 'POST',
        body: {
          topic: meetingData.topic,
          type: meetingData.type || 2, // Scheduled meeting
          start_time: meetingData.startTime,
          duration: meetingData.duration,
          timezone: meetingData.timezone || 'America/Toronto',
          password: meetingData.password,
          agenda: meetingData.agenda,
          settings: {
            host_video: meetingData.hostVideo || false,
            participant_video: meetingData.participantVideo || false,
            cn_meeting: false,
            in_meeting: false,
            join_before_host: meetingData.joinBeforeHost || false,
            mute_upon_entry: meetingData.muteUponEntry || true,
            watermark: false,
            use_pmi: false,
            approval_type: meetingData.approvalType || 2,
            audio: meetingData.audio || 'both',
            auto_recording: meetingData.autoRecording || 'none'
          }
        }
      });
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, [zoomAPI]);

  const getMeetingRecordings = useCallback(async (meetingId) => {
    try {
      return await zoomAPI(`meetings/${meetingId}/recordings`);
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, [zoomAPI]);

  const getWebinarAttendees = useCallback(async (webinarId) => {
    try {
      return await zoomAPI(`webinars/${webinarId}/absentees`);
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, [zoomAPI]);

  return {
    zoomAPI,
    createMeeting,
    getMeetingRecordings,
    getWebinarAttendees,
    isLoading,
    error
  };
};