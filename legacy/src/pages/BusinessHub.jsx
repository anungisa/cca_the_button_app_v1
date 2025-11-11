import React, { useState, useEffect } from 'react';
import { Club } from '@/api/entities';
import { User } from '@/api/entities';
import { SurveySubmission } from '@/api/entities';
import { KnowledgeArticle } from '@/api/entities';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building2, FileText, BarChart3, Users, BookOpen, ChevronRight } from 'lucide-react';
import { usePermissions } from '../components/hooks/usePermissions';
import { useXP } from '../components/XPContext';
import KnowledgeArticleCard from '../components/knowledge/KnowledgeArticleCard';
import HubCard from '../components/staffhq/HubCard';
import SkeletonLoader from '@/components/ui/SkeletonLoader';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';


const MyClubDashboard = ({ club, survey }) => {
  if (!club) {
    return (
      <Card className="bg-brand-card-bg border-brand-border">
        <CardContent className="p-6 text-center">
          <p className="text-brand-text-secondary">Affiliate with a club to see your dashboard.</p>
          <Link to={createPageUrl('Clubs')}>
            <Button variant="outline" className="mt-4">Find Your Club</Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  const surveyStatus = survey ? (survey.is_complete ? 'Complete' : `${survey.completion_percentage}% Done`) : 'Not Started';
  const surveyColor = survey?.is_complete ? 'text-green-400' : 'text-amber-400';

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Members</CardTitle>
          <Users className="h-4 w-4 text-brand-text-secondary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{club.membership_count || 0}</div>
          <p className="text-xs text-brand-text-secondary">in {club.name}</p>
        </CardContent>
      </Card>
      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Annual Survey</CardTitle>
          <FileText className="h-4 w-4 text-brand-text-secondary" />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${surveyColor}`}>{surveyStatus}</div>
          <p className="text-xs text-brand-text-secondary">for the {new Date().getFullYear()} season</p>
        </CardContent>
      </Card>
      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Club Engagement</CardTitle>
          <BarChart3 className="h-4 w-4 text-brand-text-secondary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{club.engagement_metrics?.xp_total || 0} XP</div>
          <p className="text-xs text-brand-text-secondary">Total points earned</p>
        </CardContent>
      </Card>
    </div>
  );
};


export default function BusinessHub() {
  const [myClub, setMyClub] = useState(null);
  const [mySurvey, setMySurvey] = useState(null);
  const [featuredArticles, setFeaturedArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { hasPermission } = usePermissions();
  const { user } = useXP();

  useEffect(() => {
    const loadData = async () => {
      if (!user || !hasPermission('canAccessBusinessHub')) {
        setIsLoading(false);
        return;
      }
      
      try {
        if (user.home_club_id) {
          const [clubData, surveyData] = await Promise.all([
            Club.get(user.home_club_id),
            SurveySubmission.filter({ club_id: user.home_club_id, year: new Date().getFullYear() }, '-last_saved', 1)
          ]);
          setMyClub(clubData);
          if (surveyData && surveyData.length > 0) {
            setMySurvey(surveyData[0]);
          }
        }

        const articles = await KnowledgeArticle.filter({ is_featured: true }, '-last_updated', 4);
        const clientFacingArticles = articles.filter(
            article => article.target_roles.includes('all') || article.target_roles.includes('club_admin')
        );
        setFeaturedArticles(clientFacingArticles || []);
      } catch (error) {
        console.error('Error loading Business Hub data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if(user && hasPermission) {
      loadData();
    }
  }, [user, hasPermission]);
  
  if (!hasPermission('canAccessBusinessHub')) {
    return (
      <div className="flex items-center justify-center h-full p-8">
        <Card className="bg-brand-card-bg border-brand-border text-center p-6">
          <CardTitle className="text-xl">Access Denied</CardTitle>
          <CardContent className="mt-4">
            <p className="text-brand-text-secondary">You do not have permission to access the Business Hub.</p>
            <p className="text-xs text-brand-text-secondary mt-2">This area is for affiliated club administrators.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return <div className="text-center py-8"><SkeletonLoader className="h-64 w-full" /></div>;
  }
  
  const businessTools = [
    { id: 'knowledge-base', title: 'Knowledge Base', description: 'Find guides, templates, and best practices.', icon: BookOpen, href: 'KnowledgeBase' },
    { id: 'annual-survey', title: 'Annual Club Survey', description: 'Complete your survey to help us grow the sport.', icon: FileText, href: 'ClubSurvey' },
    { id: 'club-analytics', title: 'Club Analytics', description: 'Dive deep into your club\'s performance data.', icon: BarChart3, href: 'MADashboard' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-brand-text-primary">Business Hub</h2>
        <p className="text-brand-text-secondary mt-2">Your portal for club management, resources, and insights.</p>
      </div>
      
      <section>
        <h3 className="text-xl font-semibold text-brand-text-primary mb-4">My Club Dashboard</h3>
        <MyClubDashboard club={myClub} survey={mySurvey} />
      </section>

      <section>
        <h3 className="text-xl font-semibold text-brand-text-primary mb-4">Business Tools</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {businessTools.map(tool => <HubCard key={tool.id} {...tool} />)}
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-brand-text-primary">Featured Resources</h3>
          <Link to={createPageUrl('KnowledgeBase')}>
            <Button variant="ghost" className="text-brand-red">
              View All <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </div>
        {featuredArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {featuredArticles.map(article => <KnowledgeArticleCard key={article.id} article={article} />)}
          </div>
        ) : (
          <p className="text-brand-text-secondary">No featured resources available at this time.</p>
        )}
      </section>
    </div>
  );
}