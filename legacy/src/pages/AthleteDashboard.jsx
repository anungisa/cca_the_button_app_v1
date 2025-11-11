
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Target, TrendingUp, User, FlaskConical } from 'lucide-react';
import RecentGamesSummary from '@/components/hp/RecentGamesSummary';
import DrillLogFeed from '@/components/hp/DrillLogFeed';
import CoachFeedbackFeed from '@/components/hp/CoachFeedbackFeed';
import { useXP } from '@/components/XPContext';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Mocking external dependencies for demonstration purposes.
// In a real application, these would be imported from a models/services directory.
const UnifiedPerformanceLog = {
  filter: async ({ athlete_id, status }) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    if (athlete_id === 'user123' && status === 'pending_analysis') {
      return [
        { id: 'log1', session_date: '2024-11-20T10:00:00Z', status: 'pending_analysis' },
        { id: 'log2', session_date: '2024-11-21T11:30:00Z', status: 'pending_analysis' },
      ];
    }
    return [];
  },
};

const AIInsight = {
  filter: async ({ athlete_id }, orderBy, limit) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 300));
    if (athlete_id === 'user123') {
      return [
        { id: 'insight1', title: 'Improved Draw Weight', description: 'Your draw weight has shown significant improvement over the last 3 sessions. Focus on maintaining consistency.', date: '2024-11-22' },
        { id: 'insight2', title: 'Hit Accuracy Dip', description: 'Notice a slight dip in hit accuracy. Consider drills focusing on takeout weight and line.', date: '2024-11-21' },
      ];
    }
    return [];
  },
};

const PerformanceAIAnalyzer = {
  analyzeLog: async (logId) => {
    // Simulate AI analysis delay and potential success/failure
    await new Promise(resolve => setTimeout(resolve, 2000));
    if (logId === 'log1' || logId === 'log2') {
      // In a real application, this would trigger creation of an AIInsight record
      return { success: true, insightId: `new_insight_${logId}` };
    }
    throw new Error(`Mock analysis failed for log ${logId}`);
  },
};

// Mock the AIInsightCard component as it's not part of the original file.
const AIInsightCard = ({ insight }) => (
    <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader>
            <CardTitle className="text-brand-text-primary">{insight.title}</CardTitle>
        </CardHeader>
        <CardContent>
            <p className="text-brand-text-secondary text-sm">{insight.description}</p>
            <p className="text-xs text-brand-text-secondary mt-2">Generated: {new Date(insight.date).toLocaleDateString()}</p>
        </CardContent>
    </Card>
);

// DEMO DATA - Keep existing demo data
const demoGames = [
  { opponent: "Team Bottcher", event: "Provincial Playdowns", accuracy: 88, date: "2024-11-20" },
  { opponent: "Team Koe", event: "Winter Classic", accuracy: 82, date: "2024-11-15" }
];
const demoDrills = [
  { title: "Draw to the Button", score: 4, date: "2024-11-18" },
  { title: "Lite-Weight Hits", score: 5, date: "2024-11-18" }
];
const demoFeedback = [
  { coach_name: "Coach Randy", feedback_text: "Great work on your out-turn draw weight. Let's focus on line calling next session.", date: "2024-11-19" }
];

export default function AthleteDashboard() {
  const { user } = useXP();
  
  const [unifiedLogs, setUnifiedLogs] = useState([]);
  const [aiInsights, setAiInsights] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    loadUnifiedLogs();
    loadInsights();
  }, [user]);

  const loadUnifiedLogs = async () => {
    if (!user) return;
    try {
      // Assuming user.id exists, or using a placeholder if useXP returns a mock user without ID
      const athleteId = user.id || 'user123'; // Placeholder for mock if user.id is not available
      const logs = await UnifiedPerformanceLog.filter({ 
        athlete_id: athleteId,
        status: 'pending_analysis'
      });
      setUnifiedLogs(logs);
    } catch (error) {
      console.error("Error loading unified logs:", error);
    }
  };

  const loadInsights = async () => {
    if (!user) return;
    try {
      // Assuming user.id exists, or using a placeholder if useXP returns a mock user without ID
      const athleteId = user.id || 'user123'; // Placeholder for mock if user.id is not available
      const insights = await AIInsight.filter({ athlete_id: athleteId }, '-created_date', 5);
      setAiInsights(insights);
    } catch (error) {
      console.error("Error loading AI insights:", error);
    }
  };
  
  const handleAnalyzeLog = async (logId) => {
    setIsAnalyzing(true);
    try {
      await PerformanceAIAnalyzer.analyzeLog(logId);
      // Refresh data
      loadUnifiedLogs();
      loadInsights();
    } catch (error) {
      console.error("Error during analysis:", error);
      alert(`Analysis failed: ${error.message}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-charcoal text-brand-text-primary p-4 md:p-8">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 bg-brand-red rounded-lg flex items-center justify-center">
            <Target className="w-7 h-7 text-white" />
        </div>
        <div>
            <h1 className="text-3xl font-bold text-brand-text-primary">Athlete Dashboard</h1>
            <p className="text-brand-text-secondary">Welcome, {user?.full_name || 'Athlete'}. Track your progress here.</p>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full space-y-6">
        <TabsList className="bg-brand-card-bg border-brand-border">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          {/* Add more TabsTrigger components here for other sections as needed */}
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* New AI Insights Section */}
              <Card className="bg-brand-card-bg border-brand-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FlaskConical className="w-5 h-5 text-purple-400" />
                    AI Performance Insights
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {unifiedLogs.length > 0 && (
                    <div className="p-4 bg-purple-900/20 border border-purple-500/30 rounded-lg">
                      <h4 className="font-semibold text-brand-text-primary mb-2">New Sessions Ready for Analysis</h4>
                      <p className="text-sm text-brand-text-secondary mb-3">You have {unifiedLogs.length} new session(s) that can be analyzed by the AI coach.</p>
                      {unifiedLogs.map(log => (
                        <div key={log.id} className="flex items-center justify-between py-2 border-b border-purple-500/10 last:border-b-0">
                           <p className="text-sm text-brand-text-primary">Session from {new Date(log.session_date).toLocaleDateString()}</p>
                           <Button onClick={() => handleAnalyzeLog(log.id)} disabled={isAnalyzing} size="sm">
                             {isAnalyzing ? 'Analyzing...' : 'Analyze Now'}
                           </Button>
                        </div>
                      ))}
                    </div>
                  )}

                  {aiInsights.length > 0 ? (
                    aiInsights.map(insight => <AIInsightCard key={insight.id} insight={insight} />)
                  ) : (
                    <p className="text-center text-brand-text-secondary py-4">No AI insights yet. Complete a session and run the analysis to get started.</p>
                  )}
                </CardContent>
              </Card>

              {/* Existing Performance Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-brand-card-bg border-brand-border">
                  <CardHeader><CardTitle>Overall Accuracy</CardTitle></CardHeader>
                  <CardContent>
                    <p className="text-4xl font-bold text-green-400">85%</p>
                    <p className="text-sm text-brand-text-secondary">Last 10 games</p>
                  </CardContent>
                </Card>
                <Card className="bg-brand-card-bg border-brand-border">
                  <CardHeader><CardTitle>Draw Accuracy</CardTitle></CardHeader>
                  <CardContent>
                    <p className="text-4xl font-bold text-blue-400">88%</p>
                    <p className="text-sm text-brand-text-secondary">Draws to the button</p>
                  </CardContent>
                </Card>
                <Card className="bg-brand-card-bg border-brand-border">
                  <CardHeader><CardTitle>Hit Accuracy</CardTitle></CardHeader>
                  <CardContent>
                    <p className="text-4xl font-bold text-red-400">82%</p>
                    <p className="text-sm text-brand-text-secondary">Takeouts and peels</p>
                  </CardContent>
                </Card>
              </div>

              {/* Existing Recent Activity */}
              <RecentGamesSummary games={demoGames} />
            </div>

            <div className="space-y-6">
              {/* Existing Drill Log Feed */}
              <DrillLogFeed drills={demoDrills} />
              {/* Existing Coach Feedback Feed */}
              <CoachFeedbackFeed feedback={demoFeedback} />
            </div>
          </div>
        </TabsContent>

        {/* Other TabsContent components would go here if defined in TabsList */}
      </Tabs>
    </div>
  );
}
