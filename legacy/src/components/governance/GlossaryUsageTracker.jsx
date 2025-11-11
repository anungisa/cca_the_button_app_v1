import React, { useState, useEffect } from 'react';
import { BusinessGlossaryTerm, DataQualityRule } from '@/api/entities';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  TrendingUp, Database, Link2, Shield, ArrowRight,
  BarChart3, Eye, ExternalLink
} from 'lucide-react';

export default function GlossaryUsageTracker({ termId }) {
  const [term, setTerm] = useState(null);
  const [relatedRules, setRelatedRules] = useState([]);
  const [usageStats, setUsageStats] = useState({
    referenced_in_rules: 0,
    mapped_fields: 0,
    systems_coverage: 0,
    last_updated: null
  });

  useEffect(() => {
    loadTermUsage();
  }, [termId]);

  const loadTermUsage = async () => {
    try {
      const termData = await BusinessGlossaryTerm.filter({ id: termId });
      if (termData && termData.length > 0) {
        setTerm(termData[0]);
        
        const rules = await DataQualityRule.filter({});
        const linkedRules = rules.filter(r => 
          r.related_glossary_terms?.includes(termId)
        );
        setRelatedRules(linkedRules);

        setUsageStats({
          referenced_in_rules: linkedRules.length,
          mapped_fields: termData[0].data_sources?.length || 0,
          systems_coverage: [...new Set(termData[0].data_sources?.map(s => s.system) || [])].length,
          last_updated: termData[0].updated_date
        });
      }
    } catch (error) {
      console.error('Error loading term usage:', error);
    }
  };

  if (!term) {
    return (
      <div className="animate-pulse space-y-3">
        <div className="h-4 bg-brand-border rounded w-3/4"></div>
        <div className="h-4 bg-brand-border rounded w-1/2"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* ... keep existing code ... */}
    </div>
  );
}