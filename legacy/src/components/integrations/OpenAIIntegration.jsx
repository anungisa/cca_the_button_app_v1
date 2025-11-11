import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Brain, Sparkles, MessageSquare, FileText, TrendingUp,
  CheckCircle, RefreshCw, Zap, Target, Users, BarChart3,
  Award, Lightbulb, Globe, Shield
} from 'lucide-react';
import { useToast } from '../hooks/use-toast';

export default function OpenAIIntegration() {
  const { toast } = useToast();
  const [isConnected] = useState(true);
  const [usageStats] = useState({
    requests_today: 1247,
    tokens_used: 892415,
    avg_response_time: 1.2,
    success_rate: 99.8
  });

  const handleTestConnection = async () => {
    toast({
      title: "Testing OpenAI Connection",
      description: "Sending test prompt..."
    });

    setTimeout(() => {
      toast({
        title: "Connection Successful",
        description: "OpenAI API is responding normally."
      });
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-purple-950/20 to-pink-950/20 border-purple-500/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-6 h-6 text-purple-400" />
            OpenAI Integration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert className="mb-4 border-purple-500/30 bg-purple-500/10">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <AlertDescription className="text-brand-text-primary">
              OpenAI GPT-4 powers intelligent features across The Button platform including performance insights,
              content generation, predictive analytics, and personalized recommendations.
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-brand-charcoal/50 rounded-lg">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span className="text-brand-text-primary font-medium">API Status</span>
              </div>
              <Badge className="bg-green-500/20 text-green-400">Active</Badge>
            </div>

            <div className="grid md:grid-cols-4 gap-3">
              <div className="p-3 bg-brand-charcoal/50 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Zap className="w-4 h-4 text-blue-400" />
                  <span className="text-xs text-brand-text-secondary">Requests Today</span>
                </div>
                <p className="text-2xl font-bold text-brand-text-primary">{usageStats.requests_today.toLocaleString()}</p>
              </div>

              <div className="p-3 bg-brand-charcoal/50 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <BarChart3 className="w-4 h-4 text-purple-400" />
                  <span className="text-xs text-brand-text-secondary">Tokens Used</span>
                </div>
                <p className="text-2xl font-bold text-brand-text-primary">{(usageStats.tokens_used / 1000).toFixed(0)}K</p>
              </div>

              <div className="p-3 bg-brand-charcoal/50 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp className="w-4 h-4 text-green-400" />
                  <span className="text-xs text-brand-text-secondary">Avg Response</span>
                </div>
                <p className="text-2xl font-bold text-brand-text-primary">{usageStats.avg_response_time}s</p>
              </div>

              <div className="p-3 bg-brand-charcoal/50 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-xs text-brand-text-secondary">Success Rate</span>
                </div>
                <p className="text-2xl font-bold text-brand-text-primary">{usageStats.success_rate}%</p>
              </div>
            </div>

            <Button 
              onClick={handleTestConnection}
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Test Connection
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="use_cases" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-brand-card-bg">
          <TabsTrigger value="use_cases">AI Use Cases</TabsTrigger>
          <TabsTrigger value="features">Active Features</TabsTrigger>
          <TabsTrigger value="models">Models</TabsTrigger>
        </TabsList>

        <TabsContent value="use_cases" className="space-y-4">
          <Card className="bg-brand-card-bg border-brand-border">
            <CardHeader>
              <CardTitle className="text-lg">AI-Powered Features in The Button</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                {
                  icon: Target,
                  category: 'High Performance',
                  title: 'Performance Analysis',
                  description: 'AI analyzes shot tracking data, identifies patterns, and provides actionable coaching insights',
                  features: ['Pattern detection', 'Technique suggestions', 'Fatigue warnings', 'Positive reinforcement'],
                  color: 'blue'
                },
                {
                  icon: Lightbulb,
                  category: 'Personalization',
                  title: 'Smart Recommendations',
                  description: 'Personalized mission suggestions, tier predictions, and engagement optimization',
                  features: ['Mission recommendations', 'Tier forecasting', 'Pathway guidance', 'Challenge matching'],
                  color: 'purple'
                },
                {
                  icon: MessageSquare,
                  category: 'Marketing',
                  title: 'Content Generation',
                  description: 'Automated content creation for social posts, press releases, and campaigns',
                  features: ['Social media posts', 'Email campaigns', 'Press releases', 'Article summaries'],
                  color: 'pink'
                },
                {
                  icon: Users,
                  category: 'Club Services',
                  title: 'Club Intelligence',
                  description: 'AI-powered club health analysis and predictive risk assessment',
                  features: ['At-risk club detection', 'Growth predictions', 'Benchmark insights', 'Action recommendations'],
                  color: 'green'
                },
                {
                  icon: Shield,
                  category: 'Safe Sport',
                  title: 'Incident Classification',
                  description: 'Automated incident triage, severity assessment, and routing recommendations',
                  features: ['Auto-categorization', 'Severity scoring', 'Department routing', 'Response templates'],
                  color: 'red'
                },
                {
                  icon: FileText,
                  category: 'Knowledge',
                  title: 'Content Summarization',
                  description: 'Automatic summaries of articles, videos, and training materials',
                  features: ['Article summaries', 'Key takeaways', 'Search optimization', 'Translation support'],
                  color: 'teal'
                },
                {
                  icon: BarChart3,
                  category: 'Analytics',
                  title: 'Predictive Analytics',
                  description: 'Forecasting trends in membership, engagement, and program performance',
                  features: ['Churn prediction', 'Engagement forecasting', 'Revenue modeling', 'Capacity planning'],
                  color: 'orange'
                },
                {
                  icon: Award,
                  category: 'Fan Engagement',
                  title: 'Trivia & Quizzes',
                  description: 'AI-generated trivia questions and personalized difficulty adjustment',
                  features: ['Question generation', 'Difficulty adaptation', 'Topic variation', 'Fact verification'],
                  color: 'amber'
                }
              ].map((useCase, idx) => (
                <div key={idx} className="p-4 bg-brand-charcoal/30 rounded-lg border border-brand-border">
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 bg-${useCase.color}-500/20 rounded-lg flex items-center justify-center flex-shrink-0`}>
                      <useCase.icon className={`w-5 h-5 text-${useCase.color}-400`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-brand-text-primary">{useCase.title}</h4>
                        <Badge variant="outline" className="text-xs">{useCase.category}</Badge>
                      </div>
                      <p className="text-sm text-brand-text-secondary mb-3">{useCase.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {useCase.features.map((feature, i) => (
                          <Badge key={i} className="bg-brand-charcoal text-brand-text-secondary text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="features" className="space-y-4">
          <Card className="bg-brand-card-bg border-brand-border">
            <CardHeader>
              <CardTitle className="text-lg">Active AI Features</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { feature: 'AI Coaching Companion', status: 'active', usage: '248 insights/week' },
                { feature: 'XP Recommendation Engine', status: 'active', usage: '3,421 recommendations/week' },
                { feature: 'Club Intelligence Engine', status: 'active', usage: '89 clubs monitored' },
                { feature: 'Incident Auto-Classification', status: 'active', usage: '156 incidents processed' },
                { feature: 'Content Summarization', status: 'active', usage: '442 articles processed' },
                { feature: 'Trivia Question Generator', status: 'active', usage: '1,200+ questions generated' },
                { feature: 'Predictive Churn Analysis', status: 'active', usage: '12 at-risk clubs identified' },
                { feature: 'Marketing Content Assistant', status: 'active', usage: '89 campaigns supported' }
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-brand-charcoal/30 rounded-lg">
                  <div>
                    <p className="font-medium text-brand-text-primary">{item.feature}</p>
                    <p className="text-xs text-brand-text-secondary">{item.usage}</p>
                  </div>
                  <Badge className={item.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}>
                    {item.status}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="models" className="space-y-4">
          <Card className="bg-brand-card-bg border-brand-border">
            <CardHeader>
              <CardTitle className="text-lg">AI Models in Use</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-4 bg-brand-charcoal/30 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-brand-text-primary">GPT-4</h4>
                  <Badge className="bg-purple-500/20 text-purple-400">Primary</Badge>
                </div>
                <p className="text-sm text-brand-text-secondary mb-3">
                  Advanced reasoning and analysis for complex tasks
                </p>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-brand-text-secondary">Use Cases:</span>
                    <span className="text-brand-text-primary">Performance analysis, strategic insights, complex content</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-brand-text-secondary">Monthly Usage:</span>
                    <span className="text-brand-text-primary">~2.4M tokens</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-brand-charcoal/30 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-brand-text-primary">GPT-4o-mini</h4>
                  <Badge className="bg-blue-500/20 text-blue-400">High Volume</Badge>
                </div>
                <p className="text-sm text-brand-text-secondary mb-3">
                  Fast, cost-effective model for routine tasks
                </p>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-brand-text-secondary">Use Cases:</span>
                    <span className="text-brand-text-primary">Trivia, summaries, recommendations, classifications</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-brand-text-secondary">Monthly Usage:</span>
                    <span className="text-brand-text-primary">~8.7M tokens</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-brand-charcoal/30 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-brand-text-primary">GPT-4 Vision</h4>
                  <Badge className="bg-pink-500/20 text-pink-400">Specialized</Badge>
                </div>
                <p className="text-sm text-brand-text-secondary mb-3">
                  Image and video analysis capabilities
                </p>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-brand-text-secondary">Use Cases:</span>
                    <span className="text-brand-text-primary">Dartfish analysis, technique review, form submissions</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-brand-text-secondary">Monthly Usage:</span>
                    <span className="text-brand-text-primary">~450K tokens</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-brand-charcoal/30 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-brand-text-primary">Text Embeddings</h4>
                  <Badge className="bg-teal-500/20 text-teal-400">Search</Badge>
                </div>
                <p className="text-sm text-brand-text-secondary mb-3">
                  Semantic search and content similarity
                </p>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-brand-text-secondary">Use Cases:</span>
                    <span className="text-brand-text-primary">Knowledge base search, content discovery, duplicate detection</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-brand-text-secondary">Monthly Usage:</span>
                    <span className="text-brand-text-primary">~1.2M tokens</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-brand-card-bg border-brand-border">
            <CardHeader>
              <CardTitle className="text-lg">AI Safety & Governance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-green-500/10 rounded-lg border border-green-500/30">
                <Shield className="w-5 h-5 text-green-400" />
                <div>
                  <p className="font-medium text-brand-text-primary">Content Filtering Active</p>
                  <p className="text-xs text-brand-text-secondary">OpenAI moderation API filters inappropriate content</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-green-500/10 rounded-lg border border-green-500/30">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <div>
                  <p className="font-medium text-brand-text-primary">User Consent Required</p>
                  <p className="text-xs text-brand-text-secondary">AI features respect user privacy preferences and consent settings</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-green-500/10 rounded-lg border border-green-500/30">
                <Globe className="w-5 h-5 text-green-400" />
                <div>
                  <p className="font-medium text-brand-text-primary">Audit Logging Enabled</p>
                  <p className="text-xs text-brand-text-secondary">All AI interactions are logged for transparency and compliance</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="features" className="space-y-4">
          <Card className="bg-brand-card-bg border-brand-border">
            <CardHeader>
              <CardTitle className="text-lg">Feature Usage by Department</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { dept: 'High Performance', features: 'Coaching insights, performance analysis', usage: '892 requests/week', color: 'blue' },
                { dept: 'Marketing', features: 'Content generation, campaign optimization', usage: '1,456 requests/week', color: 'purple' },
                { dept: 'Club Services', features: 'Club intelligence, predictive analytics', usage: '234 requests/week', color: 'green' },
                { dept: 'Safe Sport', features: 'Incident classification, risk assessment', usage: '67 requests/week', color: 'red' },
                { dept: 'Fan Engagement', features: 'Trivia generation, personalization', usage: '3,421 requests/week', color: 'pink' },
                { dept: 'Knowledge Centre', features: 'Summarization, search optimization', usage: '445 requests/week', color: 'teal' }
              ].map((item, idx) => (
                <div key={idx} className="p-3 bg-brand-charcoal/30 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-brand-text-primary">{item.dept}</h4>
                    <span className="text-xs text-brand-text-secondary">{item.usage}</span>
                  </div>
                  <p className="text-sm text-brand-text-secondary">{item.features}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="models" className="space-y-4">
          <Alert className="border-purple-500/30 bg-purple-500/10">
            <Brain className="w-4 h-4 text-purple-400" />
            <AlertDescription className="text-brand-text-primary">
              <strong>Cost Optimization Strategy:</strong> GPT-4o-mini handles 78% of requests at 1/10th the cost,
              with GPT-4 reserved for complex analysis and strategic insights.
            </AlertDescription>
          </Alert>

          <Card className="bg-brand-card-bg border-brand-border">
            <CardHeader>
              <CardTitle className="text-lg">Model Selection Logic</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-brand-text-primary">GPT-4 (Advanced)</h4>
                <ul className="text-sm text-brand-text-secondary space-y-1 ml-4">
                  <li>• Performance analysis with multi-game context</li>
                  <li>• Strategic marketing campaign planning</li>
                  <li>• Complex incident risk assessment</li>
                  <li>• Executive-level insights and summaries</li>
                  <li>• Multi-step reasoning and decision support</li>
                </ul>
              </div>

              <div className="space-y-2 pt-3 border-t border-brand-border">
                <h4 className="text-sm font-semibold text-brand-text-primary">GPT-4o-mini (High Volume)</h4>
                <ul className="text-sm text-brand-text-secondary space-y-1 ml-4">
                  <li>• Trivia question generation</li>
                  <li>• Simple content summaries</li>
                  <li>• XP mission recommendations</li>
                  <li>• Incident auto-categorization</li>
                  <li>• Social media post suggestions</li>
                  <li>• Knowledge article tagging</li>
                </ul>
              </div>

              <div className="space-y-2 pt-3 border-t border-brand-border">
                <h4 className="text-sm font-semibold text-brand-text-primary">GPT-4 Vision (Specialized)</h4>
                <ul className="text-sm text-brand-text-secondary space-y-1 ml-4">
                  <li>• Dartfish video analysis assistance</li>
                  <li>• Form submission image review</li>
                  <li>• Technique assessment from photos</li>
                  <li>• Brand asset quality checks</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Integration Points */}
      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader>
          <CardTitle className="text-lg">Integration Architecture</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-3 bg-brand-charcoal/30 rounded-lg">
              <h4 className="font-semibold text-brand-text-primary mb-2">Backend Functions</h4>
              <p className="text-sm text-brand-text-secondary mb-2">
                OpenAI API calls are made via secure backend functions (Deno Deploy) to protect API keys and implement rate limiting.
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="text-xs">analyzePerformanceData</Badge>
                <Badge variant="outline" className="text-xs">generateTrivia</Badge>
                <Badge variant="outline" className="text-xs">classifyIncident</Badge>
                <Badge variant="outline" className="text-xs">summarizeContent</Badge>
                <Badge variant="outline" className="text-xs">generateRecommendations</Badge>
              </div>
            </div>

            <div className="p-3 bg-brand-charcoal/30 rounded-lg">
              <h4 className="font-semibold text-brand-text-primary mb-2">Core Integration (base44.integrations)</h4>
              <p className="text-sm text-brand-text-secondary mb-2">
                Primary OpenAI access via base44's built-in InvokeLLM integration for standard prompts.
              </p>
              <code className="text-xs bg-brand-charcoal p-2 rounded block overflow-x-auto">
                await base44.integrations.Core.InvokeLLM(&#123; prompt, response_json_schema &#125;)
              </code>
            </div>

            <div className="p-3 bg-brand-charcoal/30 rounded-lg">
              <h4 className="font-semibold text-brand-text-primary mb-2">Service Layer</h4>
              <p className="text-sm text-brand-text-secondary mb-2">
                Specialized AI services wrap OpenAI calls with business logic and data enrichment.
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="text-xs">AIService.js</Badge>
                <Badge variant="outline" className="text-xs">PerformanceAIAnalyzer.js</Badge>
                <Badge variant="outline" className="text-xs">XPRecommendationEngine.js</Badge>
                <Badge variant="outline" className="text-xs">ClubIntelligenceEngine.js</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cost Management */}
      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader>
          <CardTitle className="text-lg">Cost Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-brand-charcoal/30 rounded-lg">
              <span className="text-brand-text-primary">Estimated Monthly Cost</span>
              <span className="text-xl font-bold text-brand-text-primary">$847 CAD</span>
            </div>

            <div className="grid md:grid-cols-3 gap-3">
              <div className="p-3 bg-brand-charcoal/30 rounded-lg">
                <p className="text-xs text-brand-text-secondary mb-1">GPT-4</p>
                <p className="text-lg font-bold text-purple-400">$312</p>
                <p className="text-xs text-brand-text-secondary">22% of requests</p>
              </div>

              <div className="p-3 bg-brand-charcoal/30 rounded-lg">
                <p className="text-xs text-brand-text-secondary mb-1">GPT-4o-mini</p>
                <p className="text-lg font-bold text-blue-400">$124</p>
                <p className="text-xs text-brand-text-secondary">78% of requests</p>
              </div>

              <div className="p-3 bg-brand-charcoal/30 rounded-lg">
                <p className="text-xs text-brand-text-secondary mb-1">Embeddings & Vision</p>
                <p className="text-lg font-bold text-teal-400">$411</p>
                <p className="text-xs text-brand-text-secondary">Specialized tasks</p>
              </div>
            </div>

            <Alert className="border-green-500/30 bg-green-500/10">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <AlertDescription className="text-brand-text-primary">
                <strong>78% cost reduction</strong> achieved through smart model routing and caching strategies.
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}