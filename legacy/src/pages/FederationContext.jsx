
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useXP } from '../components/XPContext';
import { XPEngine } from '../components/xp/XPEngine';
import { SurveySubmission, ClubMetrics, ClubLicense } from '@/api/entities';
import { 
  Building2, 
  FileText, 
  TrendingUp, 
  Award,
  AlertCircle,
  CheckCircle,
  BarChart3,
  Shield
} from 'lucide-react';
import MARegionInsightsPanel from '../components/survey/MARegionInsightsPanel';
import { usePermissions } from '../components/hooks/usePermissions';

const SurveyIncentiveCard = ({ survey, onComplete }) => {
  const progressPercent = survey.completion_rate * 100;
  
  return (
    <Card className="bg-brand-card-bg border-brand-border">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-brand-text-primary">{survey.title}</h3>
            <p className="text-brand-text-secondary mb-2">{survey.description}</p>
            <div className="flex items-center gap-4 text-sm">
              <span className="text-brand-text-secondary">Due: {survey.due_date}</span>
              <span className="text-brand-text-secondary">Estimated: {survey.estimated_time}</span>
            </div>
          </div>
          <Badge className="bg-brand-red text-white">
            +{survey.xp_reward} XP
          </Badge>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-brand-text-secondary">Completion Progress</span>
            <span className="text-brand-text-primary">{Math.round(progressPercent)}%</span>
          </div>
          <Progress value={progressPercent} className="h-2" />
          
          <Button 
            onClick={() => onComplete(survey)}
            className="w-full bg-brand-red hover:bg-red-700"
            disabled={survey.status === 'completed'}
          >
            {survey.status === 'completed' ? 'Completed' : 'Continue Survey'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const ClubLicensingPanel = ({ user }) => {
  const [licenses, setLicenses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadClubLicenses();
  }, [user]);

  const loadClubLicenses = async () => {
    if (!user || !user.home_club_id) {
      setIsLoading(false);
      return;
    }

    try {
      const clubLicenses = await ClubLicense.filter({ club_id: user.home_club_id });
      setLicenses(clubLicenses || []);
    } catch (error) {
      console.error('Failed to load club licenses:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="text-brand-text-secondary">Loading licensing information...</div>;
  }

  const licenseTypes = [
    { 
      id: 'smart_broom_team_pack', 
      name: 'Smart Broom Team Pack', 
      description: 'Advanced sweeping analytics for competitive teams',
      basePrice: '$299/year'
    },
    { 
      id: 'analytics_pro', 
      name: 'Analytics Pro', 
      description: 'Enhanced club analytics and member insights',
      basePrice: '$199/year'
    },
    { 
      id: 'business_hub_plus', 
      name: 'Business Hub Plus', 
      description: 'Advanced club management and financial tools',
      basePrice: '$399/year'
    }
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-brand-text-primary">Club Licensing Status</h3>
      
      {!user.home_club_id ? (
        <Card className="bg-amber-900/20 border-amber-500/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-amber-400">
              <AlertCircle className="w-5 h-5" />
              <span>Set your home club to view licensing options</span>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {licenseTypes.map(licenseType => {
            const activeLicense = licenses.find(l => l.license_type === licenseType.id && l.status === 'active');
            
            return (
              <Card key={licenseType.id} className="bg-brand-card-bg border-brand-border">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-brand-text-primary">{licenseType.name}</h4>
                      <p className="text-sm text-brand-text-secondary">{licenseType.description}</p>
                      <p className="text-sm text-brand-text-secondary mt-1">{licenseType.basePrice}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {activeLicense ? (
                        <>
                          <CheckCircle className="w-5 h-5 text-green-400" />
                          <Badge className="bg-green-600 text-white">Active</Badge>
                        </>
                      ) : (
                        <Badge variant="outline">Not Licensed</Badge>
                      )}
                    </div>
                  </div>
                  
                  {activeLicense && (
                    <div className="mt-3 text-xs text-brand-text-secondary">
                      <p>Seats: {activeLicense.seats_assigned}/{activeLicense.seats_total}</p>
                      <p>Expires: {new Date(activeLicense.expiry_date).toLocaleDateString()}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

const ComplianceDashboard = ({ user }) => {
  const [metrics, setMetrics] = useState({
    surveyCompliance: 85,
    safeSportCurrent: 12,
    safeSportExpired: 3,
    licenseRenewalsDue: 2,
    governanceUpdated: true
  });

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-brand-text-primary">Compliance Overview</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-brand-card-bg border-brand-border">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-400">{metrics.surveyCompliance}%</div>
            <div className="text-sm text-brand-text-secondary">Survey Compliance</div>
          </CardContent>
        </Card>
        
        <Card className="bg-brand-card-bg border-brand-border">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-400">{metrics.safeSportCurrent}</div>
            <div className="text-sm text-brand-text-secondary">Safe Sport Current</div>
          </CardContent>
        </Card>
        
        <Card className="bg-brand-card-bg border-brand-border">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-400">{metrics.safeSportExpired}</div>
            <div className="text-sm text-brand-text-secondary">Safe Sport Expired</div>
          </CardContent>
        </Card>
        
        <Card className="bg-brand-card-bg border-brand-border">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-amber-400">{metrics.licenseRenewalsDue}</div>
            <div className="text-sm text-brand-text-secondary">License Renewals Due</div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-brand-red" />
            Compliance Actions Required
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-red-900/20 border border-red-500/30 rounded-lg">
            <span className="text-red-300">3 coaches need Safe Sport renewal</span>
            <Button size="sm" variant="outline">Notify</Button>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-amber-900/20 border border-amber-500/30 rounded-lg">
            <span className="text-amber-300">Club survey deadline in 5 days</span>
            <Button size="sm" variant="outline">Complete</Button>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-green-900/20 border border-green-500/30 rounded-lg">
            <span className="text-green-300">All governance policies up to date</span>
            <CheckCircle className="w-5 h-5 text-green-400" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default function FederationContext() {
  const { user, awardPoints } = useXP();
  const permissions = usePermissions();
  const [activeTab, setActiveTab] = useState('surveys');
  const [surveys] = useState([
    {
      id: 'annual_club_2024',
      title: '2024 Annual Club Survey',
      description: 'Help us understand your club\'s needs and challenges for strategic planning.',
      due_date: 'March 31, 2024',
      estimated_time: '15 minutes',
      xp_reward: 200,
      completion_rate: 0.65,
      status: 'in_progress'
    },
    {
      id: 'coaching_development',
      title: 'Coaching Development Assessment',
      description: 'Share insights on coaching programs and development needs in your region.',
      due_date: 'April 15, 2024',
      estimated_time: '10 minutes',
      xp_reward: 150,
      completion_rate: 0.0,
      status: 'not_started'
    }
  ]);

  const handleCompleteSurvey = async (survey) => {
    try {
      // Simulate survey completion
      await XPEngine.awardXP(user.id, survey.xp_reward, 'survey_completion', {
        surveyId: survey.id,
        surveyType: 'federation_survey'
      });
      
      alert(`Survey completed! +${survey.xp_reward} XP earned.`);
    } catch (error) {
      alert(`Survey completed, but XP award failed: ${error.message}`);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-brand-red rounded-lg flex items-center justify-center">
            <Building2 className="w-7 h-7 text-white" />
        </div>
        <div>
            <h1 className="text-3xl font-bold text-brand-text-primary">Federation Context</h1>
            <p className="text-brand-text-secondary">Club survey incentives, dashboarding, and licensing controls.</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className={`grid w-full ${permissions.canViewRegionSurveyData ? 'grid-cols-4' : 'grid-cols-3'} bg-brand-card-bg border-brand-border`}>
          <TabsTrigger value="surveys">
            <FileText className="w-4 h-4 mr-2" />
            Club Surveys
          </TabsTrigger>
          <TabsTrigger value="licensing">
            <Award className="w-4 h-4 mr-2" />
            Licensing
          </TabsTrigger>
          <TabsTrigger value="compliance">
            <BarChart3 className="w-4 h-4 mr-2" />
            Compliance
          </TabsTrigger>
          {permissions.canViewRegionSurveyData && (
            <TabsTrigger value="ma_insights">
              <TrendingUp className="w-4 h-4 mr-2" />
              MA Insights
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="surveys" className="mt-6">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-brand-text-primary">Active Surveys</h2>
              <Badge className="bg-amber-500 text-white">
                Earn up to 350 XP
              </Badge>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {surveys.map(survey => (
                <SurveyIncentiveCard
                  key={survey.id}
                  survey={survey}
                  onComplete={handleCompleteSurvey}
                />
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="licensing" className="mt-6">
          <ClubLicensingPanel user={user} />
        </TabsContent>

        <TabsContent value="compliance" className="mt-6">
          <ComplianceDashboard user={user} />
        </TabsContent>

        {permissions.canViewRegionSurveyData && (
          <TabsContent value="ma_insights" className="mt-6">
            <MARegionInsightsPanel maRegion={user.ma_region} />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
