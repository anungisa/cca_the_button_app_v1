import React from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { eachDayOfInterval, format, startOfWeek, endOfWeek, addDays, isSameMonth } from 'date-fns';

const TrainingHeatmap = ({ data }) => {
  const today = new Date();
  const yearAgo = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());
  
  const days = eachDayOfInterval({ start: yearAgo, end: today });
  const dataMap = new Map(data.map(d => [d.date, d.count]));

  const getColor = (count) => {
    if (count === 0) return 'bg-gray-700';
    if (count === 1) return 'bg-brand-red/40';
    if (count <= 3) return 'bg-brand-red/70';
    return 'bg-brand-red';
  };

  const weeks = [];
  let currentWeek = [];
  
  days.forEach((day, index) => {
    if (index === 0) {
      // Pad start of first week
      for (let i = 0; i < day.getDay(); i++) {
        currentWeek.push(null);
      }
    }
    
    currentWeek.push(day);
    
    if (day.getDay() === 6) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  });
  if (currentWeek.length > 0) weeks.push(currentWeek);

  const monthLabels = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun", 
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  return (
    <div className="bg-brand-card-bg p-4 rounded-xl border border-brand-border">
      <h3 className="text-lg font-semibold text-brand-text-primary mb-4">Training Activity</h3>
      <div className="flex gap-1 overflow-x-auto pb-2 scrollbar-hide">
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="grid grid-rows-7 gap-1">
            {week.map((day, dayIndex) => {
              if (!day) return <div key={`pad-${dayIndex}`} className="w-3.5 h-3.5" />;
              
              const dateString = format(day, 'yyyy-MM-dd');
              const count = dataMap.get(dateString) || 0;
              
              return (
                <TooltipProvider key={dateString} delayDuration={100}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className={`w-3.5 h-3.5 rounded-sm ${getColor(count)}`}></div>
                    </TooltipTrigger>
                    <TooltipContent className="bg-brand-charcoal text-white border-brand-border">
                      <p>{count} session(s) on {format(day, 'MMM d, yyyy')}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              );
            })}
          </div>
        ))}
      </div>
       <div className="flex justify-between text-xs text-brand-text-secondary mt-2">
        <span>Less</span>
        <div className="flex gap-1">
          <div className="w-3 h-3 bg-gray-700 rounded-sm"></div>
          <div className="w-3 h-3 bg-brand-red/40 rounded-sm"></div>
          <div className="w-3 h-3 bg-brand-red/70 rounded-sm"></div>
          <div className="w-3 h-3 bg-brand-red rounded-sm"></div>
        </div>
        <span>More</span>
      </div>
    </div>
  );
};

export default TrainingHeatmap;