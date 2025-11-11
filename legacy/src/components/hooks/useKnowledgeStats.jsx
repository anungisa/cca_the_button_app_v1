import { useState, useEffect } from 'react';
import { KnowledgeArticle, KnowledgeProgress, ClubMetrics } from '@/api/entities';

export const useKnowledgeStats = (userId, userRole, clubId = null) => {
  const [stats, setStats] = useState({
    completed: 0,
    xp_earned: 0,
    top_category: 'business_operations'
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        if (!userId) {
          setStats({
            completed: 0,
            xp_earned: 0,
            top_category: 'business_operations'
          });
          setIsLoading(false);
          return;
        }

        // Get user's knowledge progress
        const userProgress = await KnowledgeProgress.filter({ user_id: userId });
        const completedArticles = userProgress.filter(p => p.status === 'completed');
        
        // Calculate XP from completed articles
        const articleIds = completedArticles.map(p => p.article_id);
        let totalXP = 0;
        
        if (articleIds.length > 0) {
          const articles = await KnowledgeArticle.filter({ id: articleIds });
          totalXP = articles.reduce((sum, article) => sum + (article.xp_reward || 25), 0);
        }
        
        // Find most popular category
        const categoryCount = {};
        completedArticles.forEach(article => {
          const category = article.category || 'business_operations';
          categoryCount[category] = (categoryCount[category] || 0) + 1;
        });
        
        const topCategory = Object.keys(categoryCount).reduce((a, b) => 
          categoryCount[a] > categoryCount[b] ? a : b, 'business_operations'
        );
        
        setStats({
          completed: completedArticles.length,
          xp_earned: totalXP,
          top_category: topCategory
        });
        
      } catch (error) {
        console.error('Error loading knowledge stats:', error);
        setStats({
          completed: 0,
          xp_earned: 0,
          top_category: 'business_operations'
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadStats();
  }, [userId, userRole, clubId]);

  return { stats, isLoading };
};

export const useClubMetrics = (clubId, timeframe = '12months') => {
  const [metrics, setMetrics] = useState(null);
  const [comparison, setComparison] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadMetrics = async () => {
      try {
        if (!clubId) return;
        
        // Get club's historical metrics
        const clubMetrics = await ClubMetrics.filter({ club_id: clubId }, '-reporting_period', 12);
        
        if (clubMetrics.length > 0) {
          const latest = clubMetrics[0];
          setMetrics(latest);
          
          // Get regional comparison
          const maRegion = latest.ma_region || 'unknown';
          const regionalMetrics = await ClubMetrics.filter({ 
            ma_region: maRegion,
            reporting_period: latest.reporting_period 
          });
          
          const avgMetrics = calculateAverageMetrics(regionalMetrics);
          setComparison(avgMetrics);
        }
        
      } catch (error) {
        console.error('Error loading club metrics:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadMetrics();
  }, [clubId, timeframe]);

  const calculateAverageMetrics = (metricsArray) => {
    if (!Array.isArray(metricsArray) || metricsArray.length === 0) return null;
    
    const totals = metricsArray.reduce((acc, metric) => {
      acc.totalMembers += metric.membership_stats?.total_members || 0;
      acc.volunteerHours += metric.engagement_metrics?.volunteer_hours || 0;
      acc.curlPoints += metric.engagement_metrics?.curl_points_earned || 0;
      acc.knowledgeCompleted += metric.engagement_metrics?.knowledge_articles_completed || 0;
      return acc;
    }, { totalMembers: 0, volunteerHours: 0, curlPoints: 0, knowledgeCompleted: 0 });
    
    const count = metricsArray.length;
    return {
      avgMembers: Math.round(totals.totalMembers / count),
      avgVolunteerHours: Math.round(totals.volunteerHours / count),
      avgCurlPoints: Math.round(totals.curlPoints / count),
      avgKnowledgeCompleted: Math.round(totals.knowledgeCompleted / count)
    };
  };

  return { metrics, comparison, isLoading };
};