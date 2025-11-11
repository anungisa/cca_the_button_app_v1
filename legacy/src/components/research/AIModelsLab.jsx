import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import {
  Brain,
  TrendingUp,
  Database,
  Zap,
  Activity,
  BarChart3,
  Users,
  Target,
  Play,
  Pause,
  Settings
} from 'lucide-react';
import { canadianProvincesAndTerritories, getProvinceNameByAbbreviation } from '../utils/provinces';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const generateSampleModels = () => {
  const models = [];
  const modelTypes = [
    'club_analytics', 'fan_churn', 'retention_scoring', 'win_probability', 
    'patch_forecasting', 'sentiment_analysis', 'workload_prediction'
  ];
  const useCases = ['high_performance', 'fan_engagement', 'club_analytics', 'sponsorship_roi'];
  const statuses = ['development', 'testing', 'production'];

  modelTypes.forEach((type, index) => {
    models.push({
      id: `model-${index}`,
      name: `${type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} Model`,
      model_type: type,
      use_case: useCases[index % useCases.length],
      status: statuses[index % statuses.length],
      version: `v${Math.floor(Math.random() * 5) + 1}.${Math.floor(Math.random() * 10)}`,
      accuracy_metrics: {
        accuracy: Math.random() * 0.2 + 0.8, // 80-100%
        precision: Math.random() * 0.15 + 0.82,
        recall: Math.random() * 0.18 + 0.78,
        f1_score: Math.random() * 0.16 + 0.81
      },
      training_data: {
        size: Math.floor(Math.random() * 50000) + 10000,
        source: 'CurlingOS Platform Data',
        date_range: '2023-01 to 2024-02'
      },
      regional_performance: canadianProvincesAndTerritories.map(p => ({
        ma_region: p.abbreviation,
        accuracy: Math.random() * 0.15 + 0.8,
        sample_size: Math.floor(Math.random() * 1000) + 100
      })),
      created_by: 'Research Team',
      last_updated: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
    });
  });

  return models;
};

const ModelCard = ({ model, selectedRegion, onDeploy, onRetrain }) => {
  const getStatusBadge = (status) => {
    const config = {
      development: { color: 'bg-yellow-500', text: 'Development' },
      testing: { color: 'bg-blue-500', text: 'Testing' },
      production: { color: 'bg-green-500', text: 'Production' },
      deprecated: { color: 'bg-red-500', text: 'Deprecated' }
    };
    const { color, text } = config[status] || { color: 'bg-gray-500', text: 'Unknown' };
    return <Badge className={`${color} text-white`}>{text}</Badge>;
  };

  const regionalData = selectedRegion === 'all' 
    ? model.regional_performance 
    : model.regional_performance.filter(r => r.ma_region === selectedRegion);

  const avgRegionalAccuracy = regionalData.reduce((sum, r) => sum + r.accuracy, 0) / regionalData.length;

  return (
    <Card className="bg-brand-card-bg border-brand-border">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <Brain className="w-5 h-5 text-purple-500" />
              {model.name}
            </CardTitle>
            <p className="text-sm text-brand-text-secondary mt-1">
              {model.model_type.replace(/_/g, ' ')} • {model.use_case.replace(/_/g, ' ')}
            </p>
          </div>
          {getStatusBadge(model.status)}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="text-center">
            <p className="text-sm text-brand-text-secondary">Accuracy</p>
            <p className="text-lg font-bold text-green-500">
              {(model.accuracy_metrics.accuracy * 100).toFixed(1)}%
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-brand-text-secondary">Precision</p>
            <p className="text-lg font-bold text-blue-500">
              {(model.accuracy_metrics.precision * 100).toFixed(1)}%
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-brand-text-secondary">Version</p>
            <p className="text-lg font-bold text-brand-text-primary">{model.version}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-brand-text-secondary">Regional Avg</p>
            <p className="text-lg font-bold text-purple-500">
              {(avgRegionalAccuracy * 100).toFixed(1)}%
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-brand-text-secondary">Training Data</span>
            <span className="text-brand-text-primary">
              {model.training_data.size.toLocaleString()} samples
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-brand-text-secondary">Data Range</span>
            <span className="text-brand-text-primary">{model.training_data.date_range}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-brand-text-secondary">Last Updated</span>
            <span className="text-brand-text-primary">
              {new Date(model.last_updated).toLocaleDateString()}
            </span>
          </div>
        </div>

        <div className="flex gap-2 pt-2 border-t border-brand-border">
          <Button 
            size="sm" 
            variant="outline" 
            onClick={() => onRetrain(model)}
            className="flex-1"
          >
            <Activity className="w-4 h-4 mr-1" />
            Retrain
          </Button>
          <Button 
            size="sm" 
            onClick={() => onDeploy(model)}
            className="flex-1 bg-brand-red hover:bg-red-700"
            disabled={model.status === 'production'}
          >
            <Play className="w-4 h-4 mr-1" />
            {model.status === 'production' ? 'Deployed' : 'Deploy'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const ModelPerformanceChart = ({ models, selectedRegion }) => {
  const chartData = useMemo(() => {
    return models.map(model => {
      const regionalData = selectedRegion === 'all' 
        ? model.regional_performance 
        : model.regional_performance.filter(r => r.ma_region === selectedRegion);
      
      const avgAccuracy = regionalData.reduce((sum, r) => sum + r.accuracy, 0) / regionalData.length;
      
      return {
        name: model.name.split(' ').slice(0, 2).join(' '), // Shorter names for chart
        accuracy: (avgAccuracy * 100).toFixed(1),
        precision: (model.accuracy_metrics.precision * 100).toFixed(1),
        recall: (model.accuracy_metrics.recall * 100).toFixed(1)
      };
    });
  }, [models, selectedRegion]);

  return (
    <Card className="bg-brand-card-bg border-brand-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-green-500" />
          Model Performance Comparison
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
            <XAxis dataKey="name" stroke="#888" />
            <YAxis stroke="#888" domain={[70, 100]} />
            <Tooltip contentStyle={{ backgroundColor: '#333', border: '1px solid #555' }} />
            <Line type="monotone" dataKey="accuracy" stroke="#10B981" strokeWidth={2} name="Accuracy %" />
            <Line type="monotone" dataKey="precision" stroke="#3B82F6" strokeWidth={2} name="Precision %" />
            <Line type="monotone" dataKey="recall" stroke="#8B5CF6" strokeWidth={2} name="Recall %" />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

const ABTestingPanel = ({ selectedRegion }) => {
  const generateABTests = () => {
    return [
      {
        id: 'ab-1',
        name: 'Fan Churn Model v2.1 vs v2.0',
        status: 'running',
        regions: selectedRegion === 'all' ? ['BC', 'AB', 'ON'] : [selectedRegion],
        variants: {
          control: { name: 'v2.0', performance: 84.2, sample_size: 1250 },
          test: { name: 'v2.1', performance: 87.1, sample_size: 1180 }
        },
        confidence: 92.5,
        start_date: '2024-01-15',
        estimated_completion: '2024-02-28'
      },
      {
        id: 'ab-2',
        name: 'Club Analytics Model - Feature Set A vs B',
        status: 'completed',
        regions: selectedRegion === 'all' ? ['QC', 'NS', 'MB'] : [selectedRegion],
        variants: {
          control: { name: 'Feature Set A', performance: 79.8, sample_size: 890 },
          test: { name: 'Feature Set B', performance: 82.4, sample_size: 910 }
        },
        confidence: 95.2,
        start_date: '2024-01-01',
        estimated_completion: '2024-02-15'
      }
    ];
  };

  const abTests = generateABTests();

  return (
    <div className="space-y-4">
      {abTests.map(test => (
        <Card key={test.id} className="bg-brand-card-bg border-brand-border">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-lg">{test.name}</CardTitle>
                <p className="text-sm text-brand-text-secondary">
                  Regions: {test.regions.join(', ')} • {test.start_date} to {test.estimated_completion}
                </p>
              </div>
              <Badge className={test.status === 'running' ? 'bg-blue-500' : 'bg-green-500'}>
                {test.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="text-center p-3 bg-brand-charcoal rounded">
                <p className="text-sm text-brand-text-secondary">Control ({test.variants.control.name})</p>
                <p className="text-xl font-bold text-blue-500">
                  {test.variants.control.performance}%
                </p>
                <p className="text-xs text-brand-text-secondary">
                  {test.variants.control.sample_size} samples
                </p>
              </div>
              <div className="text-center p-3 bg-brand-charcoal rounded">
                <p className="text-sm text-brand-text-secondary">Test ({test.variants.test.name})</p>
                <p className="text-xl font-bold text-green-500">
                  {test.variants.test.performance}%
                </p>
                <p className="text-xs text-brand-text-secondary">
                  {test.variants.test.sample_size} samples
                </p>
              </div>
              <div className="text-center p-3 bg-brand-charcoal rounded">
                <p className="text-sm text-brand-text-secondary">Confidence</p>
                <p className="text-xl font-bold text-purple-500">{test.confidence}%</p>
                <p className="text-xs text-brand-text-secondary">Statistical significance</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>{test.status === 'completed' ? '100%' : '67%'}</span>
              </div>
              <Progress value={test.status === 'completed' ? 100 : 67} className="h-2" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default function AIModelsLab({ selectedRegion }) {
  const [models, setModels] = useState([]);
  const [activeTab, setActiveTab] = useState('models');
  const [isLoading, setIsLoading] = useState(true);

  React.useEffect(() => {
    // Simulate loading models
    const loadModels = async () => {
      setIsLoading(true);
      try {
        // In a real app, this would fetch from AIModel entity
        setModels(generateSampleModels());
      } catch (error) {
        console.error('Error loading AI models:', error);
        setModels(generateSampleModels());
      } finally {
        setIsLoading(false);
      }
    };
    loadModels();
  }, []);

  const handleDeployModel = (model) => {
    // Update model status to production
    setModels(prev => prev.map(m => 
      m.id === model.id ? { ...m, status: 'production' } : m
    ));
    console.log('Deploying model:', model.name);
  };

  const handleRetrainModel = (model) => {
    console.log('Retraining model:', model.name);
    // In a real app, this would trigger a retraining job
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-red"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-4">
        <Brain className="w-6 h-6 text-purple-500" />
        <div>
          <h3 className="text-xl font-bold text-brand-text-primary">AI Models Laboratory</h3>
          <p className="text-brand-text-secondary">
            Develop, test, and deploy machine learning models
            {selectedRegion !== 'all' && ` - ${getProvinceNameByAbbreviation(selectedRegion)} View`}
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-brand-card-bg">
          <TabsTrigger value="models">
            <Database className="w-4 h-4 mr-2" />
            Models
          </TabsTrigger>
          <TabsTrigger value="performance">
            <TrendingUp className="w-4 h-4 mr-2" />
            Performance
          </TabsTrigger>
          <TabsTrigger value="testing">
            <Zap className="w-4 h-4 mr-2" />
            A/B Testing
          </TabsTrigger>
        </TabsList>

        <TabsContent value="models" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {models.map(model => (
              <ModelCard
                key={model.id}
                model={model}
                selectedRegion={selectedRegion}
                onDeploy={handleDeployModel}
                onRetrain={handleRetrainModel}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="performance" className="mt-6">
          <ModelPerformanceChart models={models} selectedRegion={selectedRegion} />
        </TabsContent>

        <TabsContent value="testing" className="mt-6">
          <ABTestingPanel selectedRegion={selectedRegion} />
        </TabsContent>
      </Tabs>
    </div>
  );
}