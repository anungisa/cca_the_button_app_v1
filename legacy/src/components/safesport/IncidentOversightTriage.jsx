import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Incident } from '@/api/entities'; // Corrected import
import { TrendingUp, Users, Shield, Clock, Flag, Percent, AlertTriangle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const IncidentOversightTriage = ({ selectedRegion }) => {
  const [incidents, setIncidents] = useState([]);
  const [filteredIncidents, setFilteredIncidents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({});
  
  const [severityFilter, setSeverityFilter] = useState('all');

  // Updated severities to match the 'Incident' entity schema
  const severities = ['all', 'level_1', 'level_2', 'level_3', 'level_4'];
  
  useEffect(() => {
    loadIncidents();
  }, []);

  useEffect(() => {
    let tempIncidents = [...incidents];

    if (selectedRegion !== 'all') {
      tempIncidents = tempIncidents.filter(i => i.ma_region === selectedRegion);
    }
    if (severityFilter !== 'all') {
      tempIncidents = tempIncidents.filter(i => i.severity === severityFilter);
    }

    setFilteredIncidents(tempIncidents);
    calculateStats(tempIncidents);
  }, [selectedRegion, severityFilter, incidents]);

  const loadIncidents = async () => {
    setIsLoading(true);
    try {
      // Fetch only incidents categorized as 'safe_sport'
      const allIncidents = await Incident.filter({ category: 'safe_sport' });
      setIncidents(allIncidents);
    } catch (error) {
      console.error("Error loading incidents:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateStats = (data) => {
    if (data.length === 0) {
      setStats({ total: 0, escalatedPercent: 0, criticalCount: 0 });
      return;
    }
    const total = data.length;
    // Use `escalation_level` to determine if an incident was escalated
    const escalatedCount = data.filter(i => i.escalation_level && i.escalation_level > 0).length;
    // Use 'level_4' for critical incidents
    const criticalCount = data.filter(i => i.severity === 'level_4').length;

    setStats({
      total,
      escalatedPercent: total > 0 ? (escalatedCount / total) * 100 : 0,
      criticalCount
    });
  };
  
  const getSeverityColor = (severity) => {
    switch(severity) {
      case 'level_4': return 'bg-red-600 text-white';
      case 'level_3': return 'bg-red-400 text-black';
      case 'level_2': return 'bg-amber-400 text-black';
      case 'level_1': return 'bg-green-400 text-black';
      default: return 'bg-gray-400 text-black';
    }
  };
  
  const severityLabels = {
    level_1: "Level 1",
    level_2: "Level 2",
    level_3: "Level 3",
    level_4: "Critical"
  }

  const chartData = severities.slice(1).map(severity => ({
    name: severityLabels[severity],
    count: filteredIncidents.filter(i => i.severity === severity).length
  }));

  return (
    <Card className="bg-brand-card-bg border-brand-border">
      <CardHeader>
        <CardTitle className="text-xl">National Incident Oversight</CardTitle>
        <p className="text-brand-text-secondary">High-level trends and triage for Safe Sport incidents.</p>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className="flex gap-4 mb-6">
          <Select value={severityFilter} onValueChange={setSeverityFilter}>
            <SelectTrigger className="bg-brand-charcoal border-brand-border"><SelectValue /></SelectTrigger>
            <SelectContent>{severities.map(s => <SelectItem key={s} value={s} className="capitalize">{s === 'all' ? 'All Severities' : severityLabels[s] || s}</SelectItem>)}</SelectContent>
          </Select>
        </div>

        {/* Stats Grid - Adjusted to 3 columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="bg-brand-charcoal">
            <CardContent className="p-4"><Users className="w-6 h-6 text-blue-400 mb-2" /><h4 className="text-2xl font-bold">{stats.total || 0}</h4><p className="text-sm text-brand-text-secondary">Total Incidents</p></CardContent>
          </Card>
          <Card className="bg-brand-charcoal">
            <CardContent className="p-4"><Percent className="w-6 h-6 text-purple-400 mb-2" /><h4 className="text-2xl font-bold">{stats.escalatedPercent?.toFixed(1) || 0}%</h4><p className="text-sm text-brand-text-secondary">Escalated</p></CardContent>
          </Card>
          <Card className="bg-brand-charcoal">
            <CardContent className="p-4"><Flag className="w-6 h-6 text-red-400 mb-2" /><h4 className="text-2xl font-bold">{stats.criticalCount || 0}</h4><p className="text-sm text-brand-text-secondary">Critical Incidents</p></CardContent>
          </Card>
        </div>

        {/* Chart */}
        <Card className="bg-brand-charcoal mb-8">
            <CardHeader><CardTitle>Incidents by Severity</CardTitle></CardHeader>
            <CardContent>
                <div style={{ width: '100%', height: 300 }}>
                    <ResponsiveContainer>
                        <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                            <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} />
                            <YAxis stroke="#9ca3af" fontSize={12} />
                            <Tooltip cursor={{fill: '#374151'}} contentStyle={{backgroundColor: '#1f2937', border: 'none'}}/>
                            <Legend wrapperStyle={{fontSize: "14px"}}/>
                            <Bar dataKey="count" fill="#ED1C24" name="Incidents" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>

        {/* Red Flag Incidents */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-brand-text-primary">Systemic Risk Radar</h3>
          <div className="space-y-3">
            {filteredIncidents.filter(i => i.severity === 'level_3' || i.severity === 'level_4').slice(0, 5).map(incident => (
              <Card key={incident.id} className="bg-brand-charcoal border-l-4 border-red-500">
                <CardContent className="p-3 flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-brand-text-primary capitalize">{incident.sub_category} incident in {incident.ma_region}</p>
                    <p className="text-sm text-brand-text-secondary">Reported: {new Date(incident.created_date).toLocaleDateString()}</p>
                  </div>
                  <Badge className={getSeverityColor(incident.severity)}>{severityLabels[incident.severity] || incident.severity}</Badge>
                </CardContent>
              </Card>
            ))}
            {filteredIncidents.filter(i => i.severity === 'level_3' || i.severity === 'level_4').length === 0 && (
                <p className="text-center py-4 text-brand-text-secondary">
                  <Shield className="mx-auto h-8 w-8 text-green-400 mb-2" />
                  No high or critical incidents match the current filters.
                </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default IncidentOversightTriage;