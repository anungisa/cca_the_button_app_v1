import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { BrainCircuit } from 'lucide-react';

const InsightCarousel = ({ insights }) => {
  const scrollRef = useRef(null);

  useEffect(() => {
    const scroller = scrollRef.current;
    if (!scroller) return;

    let scrollInterval = setInterval(() => {
      if (scroller.scrollLeft + scroller.clientWidth >= scroller.scrollWidth) {
        scroller.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        scroller.scrollBy({ left: scroller.clientWidth, behavior: 'smooth' });
      }
    }, 5000);

    return () => clearInterval(scrollInterval);
  }, [insights]);

  if (!insights || insights.length === 0) {
    return (
        <Card className="bg-brand-card-bg border-brand-border">
            <CardContent className="p-4 text-center text-brand-text-secondary">
                <p>Log your first session to unlock personalized insights!</p>
            </CardContent>
        </Card>
    )
  }

  return (
    <div className="relative">
       <h3 className="text-lg font-semibold text-brand-text-primary mb-2 flex items-center gap-2">
        <BrainCircuit className="w-5 h-5 text-brand-red" />
        Athlete Insights
      </h3>
      <div 
        ref={scrollRef}
        className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide"
      >
        {insights.map((insight, index) => (
          <div key={index} className="flex-shrink-0 w-full snap-center">
            <Card className="bg-brand-card-bg/50 m-1 border-brand-border">
              <CardContent className="p-4">
                <p className="text-brand-text-primary">{insight}</p>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InsightCarousel;