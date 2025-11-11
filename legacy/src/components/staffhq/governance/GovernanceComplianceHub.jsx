
import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Shield,
  BookOpen,
  Users,
  CheckSquare,
  Clock,
  Globe,
  Loader2,
  FileText,
  AlertTriangle
} from 'lucide-react';
import { canadianProvincesAndTerritories, getProvinceNameByAbbreviation } from '../../utils/provinces';
import MeetingManagementPanel from './MeetingManagementPanel';
import DocumentApprovalPanel from './DocumentApprovalPanel';

// --- Sample Data Generation ---
const generateSamplePolicies = () => ([
  { id: 'pol-nat-01', title: 'National Code of Conduct', ma_region: null, version: '3.1', effective_date: '2024-01-01', approval_status: 'approved' },
  { id: 'pol-nat-02', title: 'National Whistleblower Policy', ma_region: null, version: '1.5', effective_date: '2024-01-01', approval_status: 'approved' },
  { id: 'pol-on-01', title: 'Ontario Concussion Protocol Addendum', ma_region: 'ON', version: '1.2', effective_date: '2024-03-01', approval_status: 'approved' },
  { id: 'pol-bc-01', title: 'BC Volunteer Screening Policy', ma_region: 'BC', version: '2.0', effective_date: '2024-02-15', approval_status: 'review' },
  { id: 'pol-nat-03', title: 'Data Privacy & Security Policy', ma_region: null, version: '2.0', effective_date: '2023-11-01', approval_status: 'approved' },
]);

const generateSampleComplianceData = () => {
  return canadianProvincesAndTerritories.map(province => ({
    id: `comp-${province.abbreviation}`,
    ma_region: province.abbreviation,
    ma_name: province.name,
    compliance_year: 2024,
    overall_compliance_score: Math.floor(Math.random() * (100 - 75 + 1) + 75),
    required_submissions: [
      { requirement_type: 'safe_sport_policy', status: 'approved' },
      { requirement_type: 'financial_statements', status: Math.random() > 0.5 ? 'approved' : 'submitted' },
      { requirement_type: 'governance_structure', status: 'approved' },
      { requirement_type: 'insurance_certificate', status: Math.random() > 0.2 ? 'approved' : 'rejected' },
    ],
    risk_flags: Math.random() > 0.8 ? [{ flag_type: 'missing_submission', severity: 'medium' }] : []
  }));
};

// --- Child Components ---

const LoadingFallback = () => (
  <div className="flex items-center justify-center p-12">
    <Loader2 className="w-8 h-8 animate-spin text-brand-red" />
  </div>
);

const MAComplianceMatrix = ({ selectedRegion }) => {
  const [complianceData, setComplianceData] = useState([]);

  useEffect(() => {
    setComplianceData(generateSampleComplianceData());
  }, []);

  const filteredData = useMemo(() => {
    if (selectedRegion === 'all') {
      return complianceData;
    }
    return complianceData.filter(item => item.ma_region === selectedRegion);
  }, [selectedRegion, complianceData]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved': return <CheckSquare className="w-4 h-4 text-green-500" />;
      case 'submitted': return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'rejected': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default: return <FileText className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <Card className="bg-brand-card-bg border-brand-border">
      <CardHeader>
        <CardTitle>MA Compliance Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {filteredData.map(item => (
            <div key={item.id} className="p-4 bg-brand-charcoal/30 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-semibold text-brand-text-primary">{item.ma_name}</h4>
                <Badge className={item.overall_compliance_score > 90 ? 'bg-green-600' : item.overall_compliance_score > 80 ? 'bg-yellow-600' : 'bg-red-600'}>
                  {item.overall_compliance_score}% Compliant
                </Badge>
              </div>
              <Progress value={item.overall_compliance_score} className="mb-3 h-2" />
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                {item.required_submissions.map((sub, index) => (
                  <div key={index} className="flex items-center gap-2">
                    {getStatusIcon(sub.status)}
                    <span className="text-brand-text-secondary capitalize">{sub.requirement_type.replace(/_/g, ' ')}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

const PolicyManagementPanel = ({ selectedRegion }) => {
  const [policies, setPolicies] = useState([]);

  useEffect(() => {
    setPolicies(generateSamplePolicies());
  }, []);

  const filteredPolicies = useMemo(() => {
    if (selectedRegion === 'all') return policies;
    // Show national policies (ma_region is null) PLUS policies for the selected region
    return policies.filter(p => !p.ma_region || p.ma_region === selectedRegion);
  }, [selectedRegion, policies]);

  const getStatusBadge = (status) => {
    const config = {
      approved: "bg-green-600",
      review: "bg-yellow-600",
      draft: "bg-gray-500",
    };
    return <Badge className={`${config[status] || 'bg-gray-500'} text-white`}>{status}</Badge>;
  };

  return (
    <Card className="bg-brand-card-bg border-brand-border">
      <CardHeader>
        <CardTitle>Policy Library</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {filteredPolicies.map(policy => (
            <div key={policy.id} className="flex items-center justify-between p-3 bg-brand-charcoal/30 rounded-lg">
              <div>
                <p className="font-medium text-brand-text-primary">{policy.title}</p>
                <p className="text-sm text-brand-text-secondary">
                  Version: {policy.version} | Effective: {policy.effective_date}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">{policy.ma_region || 'National'}</Badge>
                {getStatusBadge(policy.approval_status)}
                <Button size="sm" variant="ghost">View</Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

// Main Hub Component
export default function GovernanceComplianceHub() {
  const [selectedRegion, setSelectedRegion] = useState('all');

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Shield className="w-8 h-8 text-brand-red" />
          <div>
            <h2 className="text-2xl font-bold text-brand-text-primary">Governance & Compliance</h2>
            <p className="text-brand-text-secondary">
              {selectedRegion === 'all' ? 'National' : getProvinceNameByAbbreviation(selectedRegion)} Oversight
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Select value={selectedRegion} onValueChange={setSelectedRegion}>
            <SelectTrigger className="w-48 bg-brand-card-bg">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Regions</SelectItem>
              {canadianProvincesAndTerritories.map(province => (
                <SelectItem key={province.abbreviation} value={province.abbreviation}>
                  {province.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="compliance_matrix" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-brand-card-bg border-brand-border">
          <TabsTrigger value="compliance_matrix" className="flex items-center gap-2">
            <CheckSquare className="w-4 h-4" />MA Compliance
          </TabsTrigger>
          <TabsTrigger value="policies" className="flex items-center gap-2">
            <BookOpen className="w-4 h-4" />Policies
          </TabsTrigger>
          <TabsTrigger value="meetings" className="flex items-center gap-2">
            <Users className="w-4 h-4" />Meetings
          </TabsTrigger>
          <TabsTrigger value="approvals" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />Approvals
          </TabsTrigger>
        </TabsList>

        <TabsContent value="compliance_matrix" className="mt-6">
          <Suspense fallback={<LoadingFallback />}>
            <MAComplianceMatrix selectedRegion={selectedRegion} />
          </Suspense>
        </TabsContent>
        <TabsContent value="policies" className="mt-6">
          <Suspense fallback={<LoadingFallback />}>
            <PolicyManagementPanel selectedRegion={selectedRegion} />
          </Suspense>
        </TabsContent>
        <TabsContent value="meetings" className="mt-6">
          <Suspense fallback={<LoadingFallback />}>
            <MeetingManagementPanel selectedRegion={selectedRegion} />
          </Suspense>
        </TabsContent>
        <TabsContent value="approvals" className="mt-6">
          <Suspense fallback={<LoadingFallback />}>
            <DocumentApprovalPanel selectedRegion={selectedRegion} />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  );
}
