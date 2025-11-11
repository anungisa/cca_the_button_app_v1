
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsTrigger, TabsList } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { PredictiveAnalyticsEngine } from '../components/analytics/PredictiveAnalyticsEngine';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Users, AlertTriangle, DollarSign, Target, Brain, Zap, RefreshCw } from 'lucide-react';

const ChurnRiskPanel = () => {
  const [churnAnalysis, setChurnAnalysis] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const analyzeChurnRisk = async (userId) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const analysis = await PredictiveAnalyticsEngine.calculateChurnRisk(userId);
      setChurnAnalysis([analysis]);
    } catch (error) {
      console.error('Failed to analyze churn risk:', error);
      setError('Failed to analyze churn risk. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const analyzeCurrentUser = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Analyze current user without specifying ID
      const analysis = await PredictiveAnalyticsEngine.calculateChurnRisk();
      setChurnAnalysis([analysis]);
    } catch (error) {
      console.error('Failed to analyze current user:', error);
      setError('Failed to analyze your account. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <Select value={selectedUserId} onValueChange={setSelectedUserId}>
          <SelectTrigger className="w-full sm:w-64">
            <SelectValue placeholder="Select user to analyze" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="demo_user_1">Demo User 1</SelectItem>
            <SelectItem value="demo_user_2">Demo User 2</SelectItem>
            <SelectItem value="demo_user_3">Demo User 3</SelectItem>
          </SelectContent>
        </Select>
        
        <div className="flex gap-2">
          <Button 
            onClick={() => analyzeChurnRisk(selectedUserId)} 
            disabled={!selectedUserId || isLoading}
            variant="outline"
          >
            <Brain className="w-4 h-4 mr-2" />
            {isLoading ? 'Analyzing...' : 'Analyze Demo User'}
          </Button>
          
          <Button 
            onClick={analyzeCurrentUser}
            disabled={isLoading}
            className="bg-brand-red hover:bg-red-700"
          >
            <Brain className="w-4 h-4 mr-2" />
            {isLoading ? 'Analyzing...' : 'Analyze My Account'}
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
          <p className="text-red-400">{error}</p>
        </div>
      )}

      {churnAnalysis.length > 0 && (
        <div className="space-y-4">
          {churnAnalysis.map((analysis, index) => (
            <Card key={index} className="bg-brand-card-bg border-brand-border">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Churn Risk Analysis</span>
                  <Badge className={
                    analysis.riskLevel === 'High' ? 'bg-red-600' :
                    analysis.riskLevel === 'Medium' ? 'bg-yellow-600' :
                    'bg-green-600'
                  }>
                    {analysis.riskLevel} Risk
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Risk Score</span>
                    <span>{analysis.riskScore}/100</span>
                  </div>
                  <Progress value={analysis.riskScore} className="h-2" />
                </div>

                {analysis.riskFactors.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Risk Factors:</h4>
                    <ul className="space-y-1">
                      {analysis.riskFactors.map((factor, factorIndex) => (
                        <li key={factorIndex} className="flex items-center gap-2 text-sm">
                          <AlertTriangle className="w-4 h-4 text-yellow-500" />
                          {factor}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {analysis.recommendations.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">AI Recommendations:</h4>
                    <ul className="space-y-1">
                      {analysis.recommendations.map((rec, recIndex) => (
                        <li key={recIndex} className="flex items-center gap-2 text-sm">
                          <Target className="w-4 h-4 text-blue-500" />
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

const ClubHealthDashboard = () => {
  const [clubAnalytics, setClubAnalytics] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadClubHealth();
  }, []);

  const loadClubHealth = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const analytics = await PredictiveAnalyticsEngine.analyzeClubHealth();
      setClubAnalytics(analytics);
    } catch (error) {
      console.error('Failed to load club health:', error);
      setError('Failed to load club health data. Using sample data.');
      // Set sample data as fallback
      setClubAnalytics([
        {
          clubId: 'sample_1',
          clubName: 'Sample Curling Club',
          healthScore: 75,
          healthLevel: 'Healthy',
          memberCount: 150,
          concerns: []
        },
        {
          clubId: 'sample_2',
          clubName: 'Risk-prone Hockey Club',
          healthScore: 40,
          healthLevel: 'At Risk',
          memberCount: 80,
          concerns: ['Low member engagement', 'Declining attendance']
        },
        {
          clubId: 'sample_3',
          clubName: 'Critical Chess Club',
          healthScore: 20,
          healthLevel: 'Critical',
          memberCount: 30,
          concerns: ['Budget issues', 'Leadership vacancies']
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="text-center p-8">Analyzing club health...</div>;
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4 flex items-center justify-between">
          <p className="text-yellow-400">{error}</p>
          <Button onClick={loadClubHealth} className="mt-2 sm:mt-0" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry
          </Button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-brand-card-bg border-brand-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-brand-text-secondary">Healthy Clubs</p>
                <p className="text-2xl font-bold text-brand-text-primary">
                  {clubAnalytics.filter(c => c.healthLevel === 'Healthy').length}
                </p>
              </div>
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <Users className="w-4 h-4 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-brand-card-bg border-brand-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-brand-text-secondary">At Risk</p>
                <p className="text-2xl font-bold text-brand-text-primary">
                  {clubAnalytics.filter(c => c.healthLevel === 'At Risk').length}
                </p>
              </div>
              <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-4 h-4 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-brand-card-bg border-brand-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-brand-text-secondary">Critical</p>
                <p className="text-2xl font-bold text-brand-text-primary">
                  {clubAnalytics.filter(c => c.healthLevel === 'Critical').length}
                </p>
              </div>
              <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-4 h-4 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader>
          <CardTitle>Club Health Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {clubAnalytics.slice(0, 10).map(club => (
              <div key={club.clubId} className="p-4 bg-brand-charcoal rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-brand-text-primary">{club.clubName}</h4>
                  <Badge className={
                    club.healthLevel === 'Healthy' ? 'bg-green-600' :
                    club.healthLevel === 'At Risk' ? 'bg-yellow-600' :
                    'bg-red-600'
                  }>
                    {club.healthLevel}
                  </Badge>
                </div>
                <div className="mb-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Health Score</span>
                    <span>{club.healthScore}/100</span>
                  </div>
                  <Progress value={club.healthScore} className="h-2" />
                </div>
                <div className="text-sm text-brand-text-secondary">
                  <p>Members: {club.memberCount}</p>
                  {club.concerns.length > 0 && (
                    <p>Concerns: {club.concerns.join(', ')}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const RevenuePredictionPanel = () => {
  const [revenueAnalysis, setRevenueAnalysis] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadRevenuePrediction();
  }, []);

  const loadRevenuePrediction = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const analysis = await PredictiveAnalyticsEngine.predictRevenueTrends();
      setRevenueAnalysis(analysis);
    } catch (error) {
      console.error('Failed to load revenue prediction:', error);
      setError('Failed to load revenue data. Using sample projections.');
      // Set fallback data
      setRevenueAnalysis({
        currentMonthly: 95000,
        averageMonthly: 92000,
        trend: 'Stable',
        predictedNext3Months: [96000, 94000, 98000],
        insights: ['Revenue projections based on historical data.']
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading || !revenueAnalysis) {
    return <div className="text-center p-8">Predicting revenue trends...</div>;
  }

  const chartData = [
    { month: 'Current', value: revenueAnalysis.currentMonthly },
    { month: 'Next Month', value: revenueAnalysis.predictedNext3Months[0] },
    { month: 'Month +2', value: revenueAnalysis.predictedNext3Months[1] },
    { month: 'Month +3', value: revenueAnalysis.predictedNext3Months[2] }
  ];

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4 flex items-center justify-between">
          <p className="text-yellow-400">{error}</p>
          <Button onClick={loadRevenuePrediction} className="mt-2 sm:mt-0" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry
          </Button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-brand-card-bg border-brand-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-brand-text-secondary">Current Monthly</p>
                <p className="text-2xl font-bold text-brand-text-primary">
                  ${revenueAnalysis.currentMonthly.toLocaleString()}
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-brand-card-bg border-brand-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-brand-text-secondary">Average Monthly</p>
                <p className="text-2xl font-bold text-brand-text-primary">
                  ${revenueAnalysis.averageMonthly.toLocaleString()}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-brand-card-bg border-brand-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-brand-text-secondary">Trend</p>
                <p className="text-2xl font-bold text-brand-text-primary">
                  {revenueAnalysis.trend}
                </p>
              </div>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                revenueAnalysis.trend === 'Growing' ? 'bg-green-500' :
                revenueAnalysis.trend === 'Declining' ? 'bg-red-500' :
                'bg-gray-500'
              }`}>
                <TrendingUp className="w-4 h-4 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader>
          <CardTitle>Revenue Prediction (Next 3 Months)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Revenue']} />
              <Line type="monotone" dataKey="value" stroke="#ef4444" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {revenueAnalysis.insights.length > 0 && (
        <Card className="bg-brand-card-bg border-brand-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-purple-500" />
              AI Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {revenueAnalysis.insights.map((insight, index) => (
                <li key={index} className="flex items-start gap-2">
                  <Zap className="w-4 h-4 text-yellow-500 mt-0.5" />
                  <span className="text-sm">{insight}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default function AnalyticsCenter() {
  return (
    <div className="min-h-screen bg-brand-charcoal">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
            <Brain className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-brand-text-primary">Advanced Analytics</h1>
            <p className="text-brand-text-secondary">AI-powered insights and predictive analytics.</p>
          </div>
        </div>

        <Tabs defaultValue="churn" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-brand-card-bg">
            <TabsTrigger value="churn">Churn Risk</TabsTrigger>
            <TabsTrigger value="clubs">Club Health</TabsTrigger>
            <TabsTrigger value="revenue">Revenue Prediction</TabsTrigger>
          </TabsList>

          <TabsContent value="churn">
            <ChurnRiskPanel />
          </TabsContent>

          <TabsContent value="clubs">
            <ClubHealthDashboard />
          </TabsContent>

          <TabsContent value="revenue">
            <RevenuePredictionPanel />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
