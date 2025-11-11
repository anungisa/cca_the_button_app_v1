import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Download, Users, TrendingUp, Handshake } from 'lucide-react';
import { exportToCsv } from '../utils/export';
import { SponsorDeal, SponsorProspect, SponsorContract } from '@/api/entities';

const ReportCard = ({ title, description, icon: Icon, onGenerate }) => (
  <Card className="bg-brand-card-bg border-brand-border">
    <CardContent className="p-6">
      <div className="flex gap-4">
        <div className="p-3 bg-brand-charcoal rounded-lg">
          <Icon className="w-6 h-6 text-brand-red" />
        </div>
        <div>
          <h4 className="font-semibold text-brand-text-primary">{title}</h4>
          <p className="text-sm text-brand-text-secondary mt-1 mb-4">{description}</p>
          <Button onClick={onGenerate}>
            <Download className="w-4 h-4 mr-2" />
            Generate Report
          </Button>
        </div>
      </div>
    </CardContent>
  </Card>
);

export default function SponsorshipReportingToolkit() {

  const handleGenerateProspectsReport = async () => {
    try {
      const prospects = await SponsorProspect.list();
      if (!prospects || prospects.length === 0) {
        alert("No prospects to export.");
        return;
      }
      const dataToExport = prospects.map(p => ({
        CompanyName: p.company_name,
        ContactName: p.contact_name,
        Email: p.contact_email,
        Phone: p.contact_phone,
        Status: p.status,
        EstimatedValue: p.estimated_value,
        AssignedTo: p.assigned_to,
        LastContacted: p.last_contacted_date,
      }));
      exportToCsv(`sponsor_prospects_report_${new Date().toISOString().split('T')[0]}`, dataToExport);
    } catch(e) {
      alert("Failed to generate report.");
      console.error(e);
    }
  };

  const handleGenerateDealsReport = async () => {
    try {
      const deals = await SponsorDeal.list();
       if (!deals || deals.length === 0) {
        alert("No deals to export.");
        return;
      }
      const dataToExport = deals.map(d => ({
        DealName: d.deal_name,
        CompanyName: d.company_name,
        Value: d.deal_value,
        Stage: d.stage,
        Probability: d.probability_percent,
        ExpectedClose: d.expected_close_date,
        Owner: d.owner,
      }));
      exportToCsv(`sponsor_deals_report_${new Date().toISOString().split('T')[0]}`, dataToExport);
    } catch(e) {
      alert("Failed to generate report.");
      console.error(e);
    }
  };

  const handleGenerateContractsReport = async () => {
    try {
      const contracts = await SponsorContract.list();
       if (!contracts || contracts.length === 0) {
        alert("No contracts to export.");
        return;
      }
      const dataToExport = contracts.map(c => ({
        SponsorName: c.sponsor_name,
        Value: c.contract_value,
        Status: c.status,
        PaymentStatus: c.payment_status,
        StartDate: c.start_date,
        EndDate: c.end_date,
      }));
      exportToCsv(`sponsor_contracts_report_${new Date().toISOString().split('T')[0]}`, dataToExport);
    } catch(e) {
      alert("Failed to generate report.");
      console.error(e);
    }
  };

  const reports = [
    { 
      title: 'Full Prospect List', 
      description: 'Export a CSV of all current and past sponsorship prospects.', 
      icon: Users,
      onGenerate: handleGenerateProspectsReport
    },
    { 
      title: 'Active Deal Pipeline', 
      description: 'Get a detailed CSV of all deals currently in the sales pipeline.', 
      icon: TrendingUp,
      onGenerate: handleGenerateDealsReport
    },
    { 
      title: 'Partner Contract Summary', 
      description: 'Generate a report summarizing all active and past partner contracts.', 
      icon: Handshake,
      onGenerate: handleGenerateContractsReport
    }
  ];

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-brand-text-primary">Reporting Toolkit</h3>
      <p className="text-sm text-brand-text-secondary">Generate and download key sponsorship reports.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reports.map((report, index) => (
          <ReportCard key={index} {...report} />
        ))}
      </div>
    </div>
  );
}