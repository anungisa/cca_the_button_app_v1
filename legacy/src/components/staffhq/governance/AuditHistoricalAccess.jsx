import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AuditLog, ApiLog } from '@/api/entities';
import { Search, Download, Filter, Eye } from 'lucide-react';

const AuditHistoricalAccess = () => {
  const [auditLogs, setAuditLogs] = useState([]);
  const [apiLogs, setApiLogs] = useState([]);
  const [activeTab, setActiveTab] = useState('audit');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('30');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAuditData();
  }, [dateFilter]);

  const loadAuditData = async () => {
    setIsLoading(true);
    try {
      const daysAgo = new Date();
      daysAgo.setDate(daysAgo.getDate() - parseInt(dateFilter));
      
      const [auditData, apiData] = await Promise.all([
        AuditLog.list('-timestamp', 100),
        ApiLog.list('-timestamp', 100)
      ]);
      
      setAuditLogs(auditData || []);
      setApiLogs(apiData || []);
    } catch (error) {
      console.error('Error loading audit data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredAuditLogs = auditLogs.filter(log =>
    log.feature.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (log.context?.source || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredApiLogs = apiLogs.filter(log =>
    log.api_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.endpoint.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (statusCode) => {
    if (statusCode >= 200 && statusCode < 300) {
      return <Badge className="bg-green-600 text-white">{statusCode}</Badge>;
    } else if (statusCode >= 400 && statusCode < 500) {
      return <Badge className="bg-yellow-600 text-yellow-950">{statusCode}</Badge>;
    } else if (statusCode >= 500) {
      return <Badge className="bg-red-600 text-white">{statusCode}</Badge>;
    }
    return <Badge className="bg-gray-600 text-white">{statusCode}</Badge>;
  };

  if (isLoading) {
    return <div className="text-center p-8"><p className="text-brand-text-secondary">Loading audit logs...</p></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold text-brand-text-primary">Audit & Historical Access</h3>
          <p className="text-brand-text-secondary">Review system activity logs and API access patterns</p>
        </div>
        <Button variant="outline" className="border-brand-border">
          <Download className="w-4 h-4 mr-2" />
          Export Logs
        </Button>
      </div>

      {/* Filters and Tabs */}
      <Card className="bg-brand-card-bg border-brand-border">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex gap-2">
              <Button
                variant={activeTab === 'audit' ? 'default' : 'outline'}
                onClick={() => setActiveTab('audit')}
                className={activeTab === 'audit' ? 'bg-brand-red hover:bg-red-700' : 'border-brand-border'}
              >
                Audit Logs
              </Button>
              <Button
                variant={activeTab === 'api' ? 'default' : 'outline'}
                onClick={() => setActiveTab('api')}
                className={activeTab === 'api' ? 'bg-brand-red hover:bg-red-700' : 'border-brand-border'}
              >
                API Logs
              </Button>
            </div>
            
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-brand-text-secondary w-4 h-4" />
              <Input
                placeholder="Search logs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-brand-charcoal border-brand-border"
              />
            </div>
            
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="w-48 bg-brand-charcoal border-brand-border">
                <SelectValue placeholder="Time range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Last 24 hours</SelectItem>
                <SelectItem value="7">Last 7 days</SelectItem>
                <SelectItem value="30">Last 30 days</SelectItem>
                <SelectItem value="90">Last 90 days</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Audit Logs */}
      {activeTab === 'audit' && (
        <Card className="bg-brand-card-bg border-brand-border">
          <CardHeader>
            <CardTitle>AI & System Audit Logs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-brand-text-secondary uppercase bg-brand-charcoal">
                  <tr>
                    <th scope="col" className="px-6 py-3">Timestamp</th>
                    <th scope="col" className="px-6 py-3">Feature</th>
                    <th scope="col" className="px-6 py-3">User Hash</th>
                    <th scope="col" className="px-6 py-3">Context</th>
                    <th scope="col" className="px-6 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAuditLogs.map(log => (
                    <tr key={log.id} className="bg-brand-card-bg border-b border-brand-border">
                      <td className="px-6 py-4">
                        {new Date(log.timestamp || log.created_date).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 font-medium text-brand-text-primary">
                        {log.feature}
                      </td>
                      <td className="px-6 py-4 font-mono text-xs">
                        {log.user_id_hash?.substring(0, 8)}...
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs">
                          {log.context?.source || 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <Button variant="outline" size="sm" className="border-brand-border">
                          <Eye className="w-4 h-4 mr-1" />
                          Details
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredAuditLogs.length === 0 && (
                <div className="text-center py-8 text-brand-text-secondary">
                  No audit logs found
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* API Logs */}
      {activeTab === 'api' && (
        <Card className="bg-brand-card-bg border-brand-border">
          <CardHeader>
            <CardTitle>API Access Logs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-brand-text-secondary uppercase bg-brand-charcoal">
                  <tr>
                    <th scope="col" className="px-6 py-3">Timestamp</th>
                    <th scope="col" className="px-6 py-3">API</th>
                    <th scope="col" className="px-6 py-3">Method</th>
                    <th scope="col" className="px-6 py-3">Endpoint</th>
                    <th scope="col" className="px-6 py-3">Status</th>
                    <th scope="col" className="px-6 py-3">Latency</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredApiLogs.map(log => (
                    <tr key={log.id} className="bg-brand-card-bg border-b border-brand-border">
                      <td className="px-6 py-4">
                        {new Date(log.timestamp || log.created_date).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 font-medium text-brand-text-primary">
                        {log.api_name}
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant="outline" className="border-brand-border">
                          {log.method}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 font-mono text-xs">
                        {log.endpoint}
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(log.status_code)}
                      </td>
                      <td className="px-6 py-4">
                        {log.latency_ms}ms
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredApiLogs.length === 0 && (
                <div className="text-center py-8 text-brand-text-secondary">
                  No API logs found
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AuditHistoricalAccess;