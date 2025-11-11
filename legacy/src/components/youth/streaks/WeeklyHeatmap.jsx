import React from 'react';
import { subDays, format } from 'date-fns';

export default function WeeklyHeatmap({ sessionLogs }) {
  const today = new Date();
  const daysToShow = 90; // Approx 3 months
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Create a map of session dates for quick lookup
  const sessionDates = new Map(
    sessionLogs.map(log => [format(new Date(log.date), 'yyyy-MM-dd'), true])
  );

  const squares = Array.from({ length: daysToShow }).map((_, index) => {
    const date = subDays(today, daysToShow - 1 - index);
    const dateString = format(date, 'yyyy-MM-dd');
    const hasLog = sessionDates.has(dateString);
    
    let colorClass = 'bg-brand-border/30';
    if (hasLog) colorClass = 'bg-brand-red';

    return (
      <div 
        key={index}
        className={`w-4 h-4 rounded-sm ${colorClass}`}
        title={`${dateString}: ${hasLog ? 'Session logged' : 'No session'}`}
      />
    );
  });

  return (
    <div className="flex justify-center">
      <div className="grid grid-rows-7 grid-flow-col gap-1">
        {squares}
      </div>
    </div>
  );
}