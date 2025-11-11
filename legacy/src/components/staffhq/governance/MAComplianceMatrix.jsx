
import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { MACompliance } from '@/api/entities';
import { Building2, AlertTriangle, CheckCircle, Download, Loader2 } from 'lucide-react';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { provinces } from '@/components/utils/provinces';

export default function MAComplianceMatrix() {
  const [complianceData, setComplianceData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    const loadComplianceData = async () => {
      setIsLoading(true);
      try {
        const data = await MACompliance.filter({ compliance_year: year });
        setComplianceData(data || []);
      } catch (error) {
        console.error("Failed to load MA compliance data:", error);
        setComplianceData([]);
      } finally {
        setIsLoading(false);
      }
    };
    loadComplianceData();
  }, [year]);

  const matrixData = useMemo(() => {
    const safeData = Array.isArray(complianceData) ? complianceData : [];
    return provinces.map(province => {
      const maData = safeData.find(d => d.ma_region === province.abbreviation);
      return {
        ma_name: province.name,
        ma_region: province.abbreviation,
        score: maData?.overall_compliance_score ?? null,
        status: maData?.required_submissions?.every(s => s.status === 'approved') ? 'Compliant' : 'Pending',
        submissions: maData?.required_submissions || [],
      };
    });
  }, [complianceData]);

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-400';
    if (score >= 70) return 'text-yellow-400';
    return 'text-red-400';
  };

  // Removed getRiskBadge and overallStats as they are no longer used in the new UI structure.

  if (isLoading) {
    return <div className="h-96 flex justify-center items-center"><Loader2 className="w-8 h-8 animate-spin" /></div>;
  }

  return (
    <Card className="bg-brand-card-bg border-brand-border">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Member Association Compliance Status</CardTitle>
            <p className="text-sm text-brand-text-secondary">Overview of compliance status by Member Association</p>
          </div>
          <select
            value={year}
            onChange={(e) => setYear(parseInt(e.target.value))}
            className="px-3 py-2 bg-brand-charcoal border border-brand-border rounded text-brand-text-primary"
          >
            {[2024, 2023, 2022].map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Member Association</TableHead>
                <TableHead>Overall Score</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-center">Submissions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {matrixData.map((row) => (
                <TableRow key={row.ma_region}>
                  <TableCell className="font-medium text-brand-text-primary">{row.ma_name}</TableCell>
                  <TableCell>
                    {row.score !== null ? (
                      <div className="flex items-center gap-2">
                        <Progress value={row.score} className="w-24 h-2 bg-brand-border" indicatorClassName={row.score >= 90 ? 'bg-green-500' : row.score >= 70 ? 'bg-yellow-500' : 'bg-red-500'} />
                        <span className={`font-bold ${getScoreColor(row.score)}`}>{row.score}%</span>
                      </div>
                    ) : (
                      <span className="text-brand-text-secondary">N/A</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant={row.status === 'Compliant' ? 'success' : 'outline'} className={row.status === 'Compliant' ? 'bg-green-600 text-white' : 'bg-yellow-600 text-yellow-950'}>{row.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-center gap-2">
                      {(row.submissions || []).map((sub, index) => (
                        <TooltipProvider key={index}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className={`w-5 h-5 rounded-full cursor-help ${
                                sub.status === 'approved' ? 'bg-green-500' :
                                sub.status === 'submitted' ? 'bg-yellow-500' :
                                sub.status === 'rejected' ? 'bg-red-500' :
                                'bg-gray-500'
                              }`}></div>
                            </TooltipTrigger>
                            <TooltipContent className="bg-brand-card-bg text-brand-text-primary border-brand-border">
                              <p>{sub.requirement_type.replace(/_/g, ' ')}: {sub.status}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      ))}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {matrixData.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-brand-text-secondary">
                    No compliance data found for {year}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
