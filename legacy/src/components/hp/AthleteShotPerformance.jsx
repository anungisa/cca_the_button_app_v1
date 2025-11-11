// Replace existing AthleteShotPerformance with reference to new dashboard
import React from 'react';
import AthletePerformanceDashboard from './AthletePerformanceDashboard';

const AthleteShotPerformance = ({ athleteId, viewerRole = 'athlete' }) => {
  return (
    <AthletePerformanceDashboard 
      athleteId={athleteId} 
      viewerRole={viewerRole}
    />
  );
};

export default AthleteShotPerformance;