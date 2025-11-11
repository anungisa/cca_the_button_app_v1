import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { MACompliance } from '@/api/entities';
import { Search, Eye, Building } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';

export default function ComplianceOverviewPanel() {
  const [complianceData, setComplianceData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const sampleData = [
      { id: 'ma_on', ma_name: 'Ontario Curling Association', overall_compliance_score: 95 },
      { id: 'ma_ab', ma_name: 'Curling Alberta', overall_compliance_score: 98 },
      { id: 'ma_bc', ma_name: 'Curl BC', overall_compliance_score: 88 },
      { id: 'ma_sk', ma_name: 'CurlSask', overall_compliance_score: 91 },
      { id: 'ma_mb', ma_name: 'Curl Manitoba', overall_compliance_score: 85 },
  ];

  useEffect(() => {
    loadComplianceData();
  }, []);

  const loadComplianceData = async () => {
    setIsLoading(true);
    try {
      const data = await MACompliance.list();
      setComplianceData(data.length > 0 ? data : sampleData);
    } catch (error) {
      console.error('Failed to load compliance data:', error);
      setComplianceData(sampleData);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredData = complianceData.filter(c => c.ma_name.toLowerCase().includes(searchTerm.toLowerCase()));
  
  const getComplianceBadge = (score) => {
      const status = score >= 90 ? 'Compliant' : score >= 70 ? 'At Risk' : 'Non-Compliant';
      const color = score >= 90 ? 'bg-green-600' : score >= 70 ? 'bg-yellow-600' : 'bg-red-600';
      return <Badge className={`${color} text-white`}>{status}</Badge>;
  };
  
  return (
    <Card className="bg-brand-card-bg border-brand-border">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>MA Compliance Overview</CardTitle>
         <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-brand-text-secondary" />
            <Input placeholder="Search MAs..." className="pl-10" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
        </div>
      </CardHeader>
      <CardContent>
         <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Member Association</TableHead>
              <TableHead>Compliance Score</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
             {isLoading ? ([...Array(5)].map((_, i) => (
                <TableRow key={i}><TableCell colSpan="4" className="p-4"><div className="h-8 bg-brand-charcoal rounded animate-pulse" /></TableCell></TableRow>
            ))) : filteredData.length === 0 ? (
                <TableRow><TableCell colSpan="4" className="text-center py-8 text-brand-text-secondary"><Building className="w-12 h-12 mx-auto mb-4 opacity-50" /><p>No compliance data available</p></TableCell></TableRow>
            ) : filteredData.map(compliance => (
                <TableRow key={compliance.id}>
                    <TableCell className="font-medium text-brand-text-primary">{compliance.ma_name}</TableCell>
                    <TableCell>
                        <div className="flex items-center gap-2">
                           <Progress value={compliance.overall_compliance_score || 0} className="h-2 w-24" />
                           <span>{compliance.overall_compliance_score || 0}%</span>
                        </div>
                    </TableCell>
                    <TableCell>{getComplianceBadge(compliance.overall_compliance_score || 0)}</TableCell>
                    <TableCell><Button variant="outline" size="sm"><Eye className="w-4 h-4 mr-1"/>Details</Button></TableCell>
                </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}