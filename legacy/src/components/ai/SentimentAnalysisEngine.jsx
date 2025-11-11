import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  MessageSquare, 
  TrendingUp, 
  TrendingDown,
  Smile,
  Frown,
  Meh,
  Heart,
  AlertTriangle,
  BarChart3,
  Calendar
} from 'lucide-react';
import { Incident } from '@/api/entities';
import { CommunityPost } from '@/api/entities';

class SentimentAnalyzer {
  constructor() {
    this.positiveWords = [
      'great', 'excellent', 'amazing', 'wonderful', 'fantastic', 'love', 'awesome',
      'perfect', 'helpful', 'smooth', 'easy', 'quick', 'professional', 'friendly',
      'thank', 'appreciate', 'impressed', 'satisfied', 'happy', 'pleased'
    ];
    
    this.negativeWords = [
      'terrible', 'awful', 'horrible', 'worst', 'hate', 'disgusting', 'useless',
      'broken', 'slow', 'difficult', 'frustrated', 'angry', 'disappointed', 'confused',
      'problem', 'issue', 'bug', 'error', 'wrong', 'failed', 'crash', 'stuck'
    ];
    
    this.intensifiers = {
      'very': 1.3,
      'extremely': 1.5,
      'really': 1.2,
      'absolutely': 1.4,
      'completely': 1.3,
      'totally': 1.2
    };
  }

  analyzeSentiment(text) {
    if (!text || typeof text !== 'string') {
      return { sentiment: 'neutral', confidence: 0, score: 0 };
    }

    const words = text.toLowerCase().split(/\s+/);
    let score = 0;
    let wordCount = 0;
    let emotionalIntensity = 1;

    for (let i = 0; i < words.length; i++) {
      const word = words[i].replace(/[^\w]/g, '');
      
      // Check for intensifiers
      if (this.intensifiers[word]) {
        emotionalIntensity = this.intensifiers[word];
        continue;
      }
      
      // Check for positive words
      if (this.positiveWords.includes(word)) {
        score += 1 * emotionalIntensity;
        wordCount++;
      }
      
      // Check for negative words
      if (this.negativeWords.includes(word)) {
        score -= 1 * emotionalIntensity;
        wordCount++;
      }
      
      // Reset intensity after each emotional word
      emotionalIntensity = 1;
    }

    // Calculate normalized score
    const normalizedScore = wordCount > 0 ? score / Math.sqrt(wordCount) : 0;
    
    // Determine sentiment category
    let sentiment = 'neutral';
    let confidence = Math.min(Math.abs(normalizedScore) * 0.3, 0.95);
    
    if (normalizedScore > 0.5) {
      sentiment = 'positive';
    } else if (normalizedScore < -0.5) {
      sentiment = 'negative';
    }
    
    // Boost confidence for extreme scores
    if (Math.abs(normalizedScore) > 1.5) {
      confidence = Math.min(confidence * 1.2, 0.98);
    }

    return {
      sentiment,
      confidence,
      score: normalizedScore,
      wordCount: words.length,
      emotionalWords: wordCount
    };
  }

  async analyzeIncidentSentiments() {
    try {
      const incidents = await Incident.list('-created_date', 500);
      const results = [];

      incidents.forEach(incident => {
        const textToAnalyze = `${incident.title} ${incident.description}`;
        const analysis = this.analyzeSentiment(textToAnalyze);
        
        results.push({
          id: incident.id,
          category: incident.category,
          priority: incident.priority,
          department: incident.assigned_department,
          date: incident.created_date,
          ...analysis
        });
      });

      return results;
    } catch (error) {
      console.error('Failed to analyze incident sentiments:', error);
      return [];
    }
  }

  async analyzeCommunityPostSentiments() {
    try {
      const posts = await CommunityPost.list('-created_date', 200);
      const results = [];

      posts.forEach(post => {
        const analysis = this.analyzeSentiment(post.content);
        
        results.push({
          id: post.id,
          author_id: post.author_id,
          post_type: post.post_type,
          date: post.created_date,
          likes: post.likes?.length || 0,
          ...analysis
        });
      });

      return results;
    } catch (error) {
      console.error('Failed to analyze community post sentiments:', error);
      return [];
    }
  }

  generateInsights(sentimentData) {
    const insights = {
      overall: { positive: 0, negative: 0, neutral: 0 },
      trends: [],
      departments: {},
      categories: {},
      recommendations: []
    };

    // Calculate overall sentiment distribution
    sentimentData.forEach(item => {
      insights.overall[item.sentiment]++;
      
      // Department breakdown
      if (item.department) {
        if (!insights.departments[item.department]) {
          insights.departments[item.department] = { positive: 0, negative: 0, neutral: 0 };
        }
        insights.departments[item.department][item.sentiment]++;
      }
      
      // Category breakdown
      if (item.category) {
        if (!insights.categories[item.category]) {
          insights.categories[item.category] = { positive: 0, negative: 0, neutral: 0 };
        }
        insights.categories[item.category][item.sentiment]++;
      }
    });

    // Generate recommendations
    const negativePercentage = (insights.overall.negative / sentimentData.length) * 100;
    
    if (negativePercentage > 30) {
      insights.recommendations.push({
        type: 'alert',
        message: `High negative sentiment detected (${negativePercentage.toFixed(1)}%). Consider reviewing recent incidents and communication strategies.`,
        priority: 'high'
      });
    }

    // Department-specific recommendations
    Object.entries(insights.departments).forEach(([dept, sentiments]) => {
      const total = sentiments.positive + sentiments.negative + sentiments.neutral;
      const negativeRate = (sentiments.negative / total) * 100;
      
      if (negativeRate > 40) {
        insights.recommendations.push({
          type: 'department_alert',
          message: `${dept} department shows high negative sentiment (${negativeRate.toFixed(1)}%). Consider additional training or process improvements.`,
          priority: 'medium',
          department: dept
        });
      }
    });

    return insights;
  }
}

export default function SentimentAnalysisEngine() {
  const [sentimentData, setSentimentData] = useState([]);
  const [insights, setInsights] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [analyzer] = useState(() => new SentimentAnalyzer());
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    loadSentimentAnalysis();
  }, []);

  const loadSentimentAnalysis = async () => {
    setIsLoading(true);
    try {
      const [incidentSentiments, communitySentiments] = await Promise.all([
        analyzer.analyzeIncidentSentiments(),
        analyzer.analyzeCommunityPostSentiments()
      ]);
      
      const allSentiments = [...incidentSentiments, ...communitySentiments];
      const generatedInsights = analyzer.generateInsights(allSentiments);
      
      setSentimentData(allSentiments);
      setInsights(generatedInsights);
    } catch (error) {
      console.error('Failed to load sentiment analysis:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getSentimentIcon = (sentiment) => {
    switch (sentiment) {
      case 'positive': return <Smile className="w-4 h-4 text-green-400" />;
      case 'negative': return <Frown className="w-4 h-4 text-red-400" />;
      default: return <Meh className="w-4 h-4 text-gray-400" />;
    }
  };

  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case 'positive': return 'text-green-400';
      case 'negative': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <MessageSquare className="w-8 h-8 animate-pulse text-brand-red" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-brand-text-primary flex items-center gap-2">
          <MessageSquare className="w-6 h-6 text-blue-400" />
          Sentiment Analysis Engine
        </h2>
        <p className="text-brand-text-secondary">
          AI-powered analysis of communication sentiment across incidents and community posts
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="departments">By Department</TabsTrigger>
          <TabsTrigger value="categories">By Category</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Overall Sentiment Distribution */}
          <Card className="bg-brand-card-bg border-brand-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Overall Sentiment Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              {insights && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Smile className="w-6 h-6 text-green-400" />
                      <span className="text-2xl font-bold text-green-400">
                        {insights.overall.positive}
                      </span>
                    </div>
                    <div className="text-sm text-brand-text-secondary">Positive</div>
                    <Progress 
                      value={(insights.overall.positive / sentimentData.length) * 100}
                      className="mt-2 h-2"
                    />
                  </div>
                  
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Meh className="w-6 h-6 text-gray-400" />
                      <span className="text-2xl font-bold text-gray-400">
                        {insights.overall.neutral}
                      </span>
                    </div>
                    <div className="text-sm text-brand-text-secondary">Neutral</div>
                    <Progress 
                      value={(insights.overall.neutral / sentimentData.length) * 100}
                      className="mt-2 h-2"
                    />
                  </div>
                  
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Frown className="w-6 h-6 text-red-400" />
                      <span className="text-2xl font-bold text-red-400">
                        {insights.overall.negative}
                      </span>
                    </div>
                    <div className="text-sm text-brand-text-secondary">Negative</div>
                    <Progress 
                      value={(insights.overall.negative / sentimentData.length) * 100}
                      className="mt-2 h-2"
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recommendations */}
          {insights?.recommendations.length > 0 && (
            <Card className="bg-brand-card-bg border-brand-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-orange-400" />
                  AI Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {insights.recommendations.map((rec, index) => (
                  <div key={index} className={`p-3 rounded-lg border ${
                    rec.priority === 'high' ? 'bg-red-900/20 border-red-500/30' :
                    rec.priority === 'medium' ? 'bg-orange-900/20 border-orange-500/30' :
                    'bg-blue-900/20 border-blue-500/30'
                  }`}>
                    <div className="flex items-start gap-2">
                      <AlertTriangle className={`w-4 h-4 mt-0.5 ${
                        rec.priority === 'high' ? 'text-red-400' :
                        rec.priority === 'medium' ? 'text-orange-400' :
                        'text-blue-400'
                      }`} />
                      <div>
                        <Badge className={`mb-2 ${
                          rec.priority === 'high' ? 'bg-red-600' :
                          rec.priority === 'medium' ? 'bg-orange-600' :
                          'bg-blue-600'
                        }`}>
                          {rec.priority} Priority
                        </Badge>
                        <p className="text-brand-text-primary">{rec.message}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="departments">
          <Card className="bg-brand-card-bg border-brand-border">
            <CardHeader>
              <CardTitle>Sentiment by Department</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {insights && Object.entries(insights.departments).map(([dept, sentiments]) => {
                  const total = sentiments.positive + sentiments.negative + sentiments.neutral;
                  return (
                    <div key={dept} className="p-4 bg-brand-charcoal rounded-lg">
                      <h4 className="font-semibold text-brand-text-primary mb-3 capitalize">
                        {dept.replace('_', ' ')}
                      </h4>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="text-center">
                          <div className="text-lg font-bold text-green-400">{sentiments.positive}</div>
                          <div className="text-xs text-brand-text-secondary">
                            {((sentiments.positive / total) * 100).toFixed(1)}%
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-gray-400">{sentiments.neutral}</div>
                          <div className="text-xs text-brand-text-secondary">
                            {((sentiments.neutral / total) * 100).toFixed(1)}%
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-red-400">{sentiments.negative}</div>
                          <div className="text-xs text-brand-text-secondary">
                            {((sentiments.negative / total) * 100).toFixed(1)}%
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories">
          <Card className="bg-brand-card-bg border-brand-border">
            <CardHeader>
              <CardTitle>Sentiment by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {insights && Object.entries(insights.categories).map(([category, sentiments]) => {
                  const total = sentiments.positive + sentiments.negative + sentiments.neutral;
                  return (
                    <div key={category} className="p-4 bg-brand-charcoal rounded-lg">
                      <h4 className="font-semibold text-brand-text-primary mb-3 capitalize">
                        {category.replace('_', ' ')}
                      </h4>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="text-center">
                          <div className="text-lg font-bold text-green-400">{sentiments.positive}</div>
                          <div className="text-xs text-brand-text-secondary">
                            {((sentiments.positive / total) * 100).toFixed(1)}%
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-gray-400">{sentiments.neutral}</div>
                          <div className="text-xs text-brand-text-secondary">
                            {((sentiments.neutral / total) * 100).toFixed(1)}%
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-red-400">{sentiments.negative}</div>
                          <div className="text-xs text-brand-text-secondary">
                            {((sentiments.negative / total) * 100).toFixed(1)}%
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timeline">
          <Card className="bg-brand-card-bg border-brand-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Recent Sentiment Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {sentimentData.slice(0, 50).map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-brand-charcoal rounded">
                    <div className="flex items-center gap-3">
                      {getSentimentIcon(item.sentiment)}
                      <span className="text-sm text-brand-text-primary">
                        {item.category && `${item.category.replace('_', ' ')} - `}
                        Confidence: {(item.confidence * 100).toFixed(0)}%
                      </span>
                    </div>
                    <div className="text-xs text-brand-text-secondary">
                      {new Date(item.date).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}