import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  BookOpen, Shield, Database, Users, CheckCircle,
  AlertTriangle, TrendingUp, FileText, Key, ExternalLink
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function DataGovernanceHub() {
  const [selectedTab, setSelectedTab] = useState('overview');

  const governanceComponents = [
    {
      id: 'glossary',
      name: 'Business Glossary',
      description: 'Official definitions and data standards',
      status: 'in_progress',
      progress: 25,
      icon: BookOpen,
      link: createPageUrl('BusinessGlossary'),
      bdoNeed: 'N7.2'
    },
    {
      id: 'quality',
      name: 'Data Quality Rules',
      description: 'Automated quality monitoring and validation',
      status: 'in_progress',
      progress: 30,
      icon: Shield,
      link: createPageUrl('DataQualityDashboard'),
      bdoNeed: 'N7.3'
    },
    {
      id: 'stewardship',
      name: 'Data Stewardship',
      description: 'Assign owners and responsibilities',
      status: 'planned',
      progress: 10,
      icon: Users,
      link: null,
      bdoNeed: 'N12.2'
    },
    {
      id: 'policies',
      name: 'Data Policies',
      description: 'Governance policies and procedures',
      status: 'draft',
      progress: 15,
      icon: FileText,
      link: createPageUrl('GovernanceComplianceHub'),
      bdoNeed: 'N12.3'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-brand-text-primary flex items-center gap-2">
            <Database className="w-7 h-7" />
            Data Governance Hub
          </h2>
          <p className="text-brand-text-secondary mt-1">
            N7 & N12: Data Management, Governance Solutions & Implementation
          </p>
        </div>
      </div>

      {/* HubSpot CRM Notice */}
      <Card className="bg-gradient-to-br from-orange-950/20 to-purple-950/20 border-orange-500/30">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-bold text-brand-text-primary mb-1">
                Strategic Platform Decision: HubSpot CRM
              </h4>
              <p className="text-sm text-brand-text-secondary mb-3">
                HubSpot has been selected as the unified CRM platform per BDO's rationalization recommendation. 
                Business Glossary and Data Quality tools will ensure clean data flows to HubSpot.
              </p>
              <div className="flex gap-2">
                <Badge className="bg-orange-500/20 text-orange-400">CRM Platform</Badge>
                <Badge className="bg-green-500/20 text-green-400">Consolidates: KIT, Donor Management, Sponsorship</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Governance Components */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {governanceComponents.map((component) => {
          const IconComponent = component.icon;
          return (
            <Card key={component.id} className="bg-brand-card-bg border-brand-border hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <IconComponent className="w-6 h-6 text-blue-400" />
                    <CardTitle className="text-lg">{component.name}</CardTitle>
                  </div>
                  <Badge className="bg-brand-red">{component.bdoNeed}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-brand-text-secondary">{component.description}</p>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-brand-text-secondary">Implementation Progress</span>
                    <span className={`font-bold ${
                      component.progress >= 70 ? 'text-green-400' :
                      component.progress >= 30 ? 'text-yellow-400' :
                      'text-red-400'
                    }`}>
                      {component.progress}%
                    </span>
                  </div>
                  <Progress value={component.progress} className="h-2" />
                </div>

                {component.link ? (
                  <Link to={component.link}>
                    <Button className="w-full bg-brand-red">
                      Open {component.name}
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                ) : (
                  <Button className="w-full" variant="outline" disabled>
                    Coming Soon
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Next Steps */}
      <Card className="bg-gradient-to-br from-red-950/20 to-orange-950/20 border-red-500/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Recommended Next Steps (N7 & N12)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-3 bg-brand-charcoal/30 rounded border border-red-500/30">
              <div className="flex items-start gap-3">
                <span className="text-red-400 font-bold text-lg">1.</span>
                <div className="flex-1">
                  <h5 className="font-bold text-brand-text-primary mb-1">Complete Business Glossary</h5>
                  <p className="text-sm text-brand-text-secondary">
                    Define top 100 critical business terms across all departments. Target: 50 terms by end of Q1 2025.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-3 bg-brand-charcoal/30 rounded border border-orange-500/30">
              <div className="flex items-start gap-3">
                <span className="text-orange-400 font-bold text-lg">2.</span>
                <div className="flex-1">
                  <h5 className="font-bold text-brand-text-primary mb-1">Establish Data Quality Framework</h5>
                  <p className="text-sm text-brand-text-secondary">
                    Create 20-30 critical quality rules for Club, User, Event, and Financial entities.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-3 bg-brand-charcoal/30 rounded border border-yellow-500/30">
              <div className="flex items-start gap-3">
                <span className="text-yellow-400 font-bold text-lg">3.</span>
                <div className="flex-1">
                  <h5 className="font-bold text-brand-text-primary mb-1">Appoint Data Stewards</h5>
                  <p className="text-sm text-brand-text-secondary">
                    Assign data stewards for each major entity and department to own definitions and quality.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-3 bg-brand-charcoal/30 rounded border border-blue-500/30">
              <div className="flex items-start gap-3">
                <span className="text-blue-400 font-bold text-lg">4.</span>
                <div className="flex-1">
                  <h5 className="font-bold text-brand-text-primary mb-1">Integrate with HubSpot</h5>
                  <p className="text-sm text-brand-text-secondary">
                    Map glossary terms to HubSpot custom properties and implement quality rules before data sync.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}