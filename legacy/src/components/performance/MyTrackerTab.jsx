
import React, { useState } from 'react';
import { useTrackerData } from '../hooks/useTrackerData';
import TrainingHeatmap from '../tracker/TrainingHeatmap';
import InsightCarousel from '../tracker/InsightCarousel';
import MicroChallengeBoard from '../tracker/MicroChallengeBoard';
import PerformanceTrendGraphs from '../tracker/PerformanceTrendGraphs';
import SmartBroomSessionView from '../tracker/SmartBroomSessionView';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import AthleteShotPerformance from '../hp/AthleteShotPerformance'; // New import
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"; // New imports

export default function MyTrackerTab({ user }) {
  const { 
    isLoading, 
    logs, 
    benchmarks, 
    broomSessions, 
    heatmapData, 
    insights, 
    challenges,
    refreshData 
  } = useTrackerData(user?.id);

  const [selectedBroomSession, setSelectedBroomSession] = useState(null);
  const [activeTab, setActiveTab] = useState('overview'); // New state

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-red"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="overview">Performance Overview</TabsTrigger>
          <TabsTrigger value="shots">Shot Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
              <TrainingHeatmap data={heatmapData} />
              <PerformanceTrendGraphs benchmarks={benchmarks} broomSessions={broomSessions} />
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <Card className="bg-brand-card-bg border-brand-border">
                <CardContent className="p-4">
                    <Button className="w-full bg-brand-red hover:bg-red-700">
                        <PlusCircle className="w-5 h-5 mr-2" />
                        Log New Session
                    </Button>
                </CardContent>
              </Card>
              <InsightCarousel insights={insights} />
              <MicroChallengeBoard challenges={challenges} />
            </div>
          </div>
          
          {/* Smart Broom Sessions List */}
          {broomSessions.length > 0 && (
              <Card className="bg-brand-card-bg border-brand-border">
                  <CardContent className="p-4">
                      <h3 className="font-semibold mb-2">Recent Smart Broom Sessions</h3>
                      <div className="space-y-2">
                          {broomSessions.slice(0,5).map(session => (
                              <div key={session.id} className="flex justify-between items-center p-2 bg-brand-charcoal rounded-lg">
                                  <p>Session on {new Date(session.session_date).toLocaleDateString()}</p>
                                  <Button variant="outline" size="sm" onClick={() => setSelectedBroomSession(session)}>View Details</Button>
                              </div>
                          ))}
                      </div>
                  </CardContent>
              </Card>
          )}

          <SmartBroomSessionView 
            session={selectedBroomSession}
            isOpen={!!selectedBroomSession}
            onClose={() => setSelectedBroomSession(null)}
          />
        </TabsContent>

        <TabsContent value="shots" className="mt-6">
          <AthleteShotPerformance athleteId={user?.id} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
