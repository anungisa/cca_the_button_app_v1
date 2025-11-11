import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { KudosTransaction } from '@/api/entities';
import { Heart, Award, Users, Star } from 'lucide-react';

export default function KudosManagement() {
  const [kudosData, setKudosData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadKudos = async () => {
      setIsLoading(true);
      try {
        const data = await KudosTransaction.list('-created_date', 20);
        setKudosData(data);
      } catch (error) {
        console.error('Error loading kudos data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadKudos();
  }, []);

  const kudosTypeColors = {
    great_shot: 'bg-blue-100 text-blue-800',
    team_spirit: 'bg-green-100 text-green-800',
    sportsmanship: 'bg-purple-100 text-purple-800',
    mentorship: 'bg-yellow-100 text-yellow-800',
    dedication: 'bg-red-100 text-red-800',
    improvement: 'bg-indigo-100 text-indigo-800'
  };

  const KudosCard = ({ kudos }) => (
    <Card className="bg-brand-card-bg border-brand-border">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Heart className="w-5 h-5 text-brand-red mt-1" />
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge className={kudosTypeColors[kudos.kudos_type] || 'bg-gray-100 text-gray-800'}>
                {kudos.kudos_type.replace('_', ' ')}
              </Badge>
              <span className="text-xs text-brand-text-muted">
                {new Date(kudos.created_date).toLocaleDateString()}
              </span>
            </div>
            <p className="text-sm font-medium text-brand-text-primary mb-1">
              From: {kudos.sender_id} → To: {kudos.receiver_id}
            </p>
            {kudos.message && (
              <p className="text-sm text-brand-text-secondary">{kudos.message}</p>
            )}
            <div className="flex items-center gap-2 mt-2 text-xs text-brand-text-muted">
              <Award className="w-3 h-3" />
              {kudos.xp_awarded} XP awarded
              {kudos.context && <span>• {kudos.context}</span>}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-brand-card-bg border-brand-border">
          <CardContent className="p-6 text-center">
            <Heart className="w-8 h-8 text-brand-red mx-auto mb-2" />
            <p className="text-2xl font-bold text-brand-text-primary">{kudosData.length}</p>
            <p className="text-sm text-brand-text-secondary">Total Kudos</p>
          </CardContent>
        </Card>
        <Card className="bg-brand-card-bg border-brand-border">
          <CardContent className="p-6 text-center">
            <Users className="w-8 h-8 text-brand-red mx-auto mb-2" />
            <p className="text-2xl font-bold text-brand-text-primary">
              {new Set([...kudosData.map(k => k.sender_id), ...kudosData.map(k => k.receiver_id)]).size}
            </p>
            <p className="text-sm text-brand-text-secondary">Active Participants</p>
          </CardContent>
        </Card>
        <Card className="bg-brand-card-bg border-brand-border">
          <CardContent className="p-6 text-center">
            <Star className="w-8 h-8 text-brand-red mx-auto mb-2" />
            <p className="text-2xl font-bold text-brand-text-primary">
              {kudosData.reduce((sum, k) => sum + (k.xp_awarded || 0), 0)}
            </p>
            <p className="text-sm text-brand-text-secondary">Total XP Distributed</p>
          </CardContent>
        </Card>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-brand-text-primary mb-4">Recent Kudos Activity</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {kudosData.map(kudos => (
            <KudosCard key={kudos.id} kudos={kudos} />
          ))}
        </div>
      </div>
    </div>
  );
}