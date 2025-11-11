import React, { useState, useEffect } from 'react';
import { BusinessGlossaryTerm, DataQualityRule } from '@/api/entities';
import { User } from '@/api/entities';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar } from '@/components/ui/avatar';
import {
  Users, Shield, TrendingUp, AlertTriangle, CheckCircle,
  Award, Target, BarChart3, BookOpen, Database
} from 'lucide-react';

export default function DataStewardshipPanel() {
  const [stewards, setStewards] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStewardshipData();
  }, []);

  const loadStewardshipData = async () => {
    setIsLoading(true);
    try {
      const [glossaryTerms, qualityRules] = await Promise.all([
        BusinessGlossaryTerm.list('-updated_date', 500),
        DataQualityRule.list('-created_date', 500)
      ]);

      // Group by data steward
      const stewardMap = new Map();

      glossaryTerms.forEach(term => {
        if (term.owner_user_id) {
          if (!stewardMap.has(term.owner_user_id)) {
            stewardMap.set(term.owner_user_id, {
              user_id: term.owner_user_id,
              department: term.owner_department,
              glossary_terms: [],
              quality_rules: [],
              categories: new Set()
            });
          }
          const steward = stewardMap.get(term.owner_user_id);
          steward.glossary_terms.push(term);
          steward.categories.add(term.category);
        }
      });

      qualityRules.forEach(rule => {
        if (rule.data_steward_id && stewardMap.has(rule.data_steward_id)) {
          stewardMap.get(rule.data_steward_id).quality_rules.push(rule);
        }
      });

      setStewards(Array.from(stewardMap.values()));
    } catch (error) {
      console.error('Error loading stewardship data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStewardScore = (steward) => {
    const approvedTerms = steward.glossary_terms.filter(t => t.status === 'approved').length;
    const totalTerms = steward.glossary_terms.length;
    const activeRules = steward.quality_rules.filter(r => r.is_active).length;
    const avgPassRate = steward.quality_rules.length > 0
      ? steward.quality_rules.reduce((sum, r) => sum + (r.pass_rate || 0), 0) / steward.quality_rules.length
      : 0;

    return Math.round(
      (approvedTerms / Math.max(totalTerms, 1)) * 30 +
      (activeRules / Math.max(totalTerms, 5)) * 30 +
      avgPassRate * 0.4
    );
  };

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-red mx-auto mb-2"></div>
        <p className="text-brand-text-secondary text-sm">Loading stewardship data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-indigo-950/20 to-purple-950/20 border-indigo-500/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-indigo-400" />
            Data Stewardship Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-indigo-400 mb-1">{stewards.length}</div>
              <p className="text-xs text-brand-text-secondary">Active Stewards</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400 mb-1">
                {stewards.reduce((sum, s) => sum + s.glossary_terms.length, 0)}
              </div>
              <p className="text-xs text-brand-text-secondary">Terms Managed</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400 mb-1">
                {stewards.reduce((sum, s) => sum + s.quality_rules.length, 0)}
              </div>
              <p className="text-xs text-brand-text-secondary">Quality Rules</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400 mb-1">
                {stewards.length > 0 ? Math.round(stewards.reduce((sum, s) => sum + getStewardScore(s), 0) / stewards.length) : 0}%
              </div>
              <p className="text-xs text-brand-text-secondary">Avg Performance</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Steward Leaderboard */}
      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Award className="w-5 h-5" />
            Data Stewardship Leaderboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {stewards
              .sort((a, b) => getStewardScore(b) - getStewardScore(a))
              .map((steward, idx) => {
                const score = getStewardScore(steward);
                const approvedTerms = steward.glossary_terms.filter(t => t.status === 'approved').length;
                const pendingTerms = steward.glossary_terms.filter(t => t.status === 'review').length;
                
                return (
                  <div key={steward.user_id} className="p-4 bg-brand-charcoal/30 rounded-lg border border-brand-border">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-brand-red rounded-full flex items-center justify-center text-white font-bold text-lg">
                          #{idx + 1}
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <h4 className="font-medium text-brand-text-primary">
                              {steward.department.charAt(0).toUpperCase() + steward.department.slice(1)} Steward
                            </h4>
                            <p className="text-xs text-brand-text-secondary">
                              {Array.from(steward.categories).join(', ')}
                            </p>
                          </div>
                          <Badge className={
                            score >= 80 ? 'bg-green-500/20 text-green-400' :
                            score >= 60 ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-red-500/20 text-red-400'
                          }>
                            {score}% Score
                          </Badge>
                        </div>

                        <div className="grid grid-cols-4 gap-3 mb-3">
                          <div>
                            <p className="text-xs text-brand-text-secondary">Terms</p>
                            <p className="text-sm font-bold text-brand-text-primary">
                              {steward.glossary_terms.length}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-brand-text-secondary">Approved</p>
                            <p className="text-sm font-bold text-green-400">
                              {approvedTerms}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-brand-text-secondary">Pending</p>
                            <p className="text-sm font-bold text-yellow-400">
                              {pendingTerms}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-brand-text-secondary">Rules</p>
                            <p className="text-sm font-bold text-blue-400">
                              {steward.quality_rules.length}
                            </p>
                          </div>
                        </div>

                        <Progress value={score} className="h-2" />
                      </div>
                    </div>
                  </div>
                );
              })}

            {stewards.length === 0 && (
              <div className="text-center py-8">
                <Users className="w-12 h-12 mx-auto mb-3 text-brand-text-secondary opacity-50" />
                <p className="text-brand-text-secondary">No data stewards assigned yet.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}