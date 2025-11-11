import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Heart, 
  Users, 
  TrendingUp, 
  MapPin, 
  Building,
  ExternalLink,
  MessageSquare,
  Sparkles
} from 'lucide-react';
import PledgeCard from '../components/pledge/PledgeCard';
import PledgeForm from '../components/pledge/PledgeForm';

export default function PledgeBoard() {
  const [pledges, setPledges] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    loadPledges();
  }, []);

  const loadPledges = async () => {
    setIsLoading(true);
    try {
      const data = await base44.entities.Pledge.filter(
        { status: 'approved' },
        '-created_date',
        100
      );
      setPledges(data || []);
    } catch (error) {
      console.error('Error loading pledges:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePledgeSubmitted = () => {
    setShowForm(false);
    loadPledges();
  };

  const filteredPledges = pledges.filter(pledge => {
    if (filter === 'all') return true;
    return pledge.pledge_type === filter;
  });

  const stats = {
    total: pledges.length,
    individuals: pledges.filter(p => p.pledge_by === 'Individual').length,
    organizations: pledges.filter(p => p.pledge_by === 'Organization').length,
    provinces: new Set(pledges.map(p => p.province)).size
  };

  return (
    <div className="min-h-screen bg-brand-charcoal">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-brand-text-primary uppercase mb-4">
            Pledge Board
          </h1>
          <p className="text-xl text-brand-text-secondary max-w-3xl mx-auto">
            Join Canadians from coast to coast to coast in growing the game we love.
          </p>
        </div>

        {/* Kudoboard Embed */}
        <Card className="mb-12 bg-brand-card-bg border-brand-border overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-brand-red/10 to-transparent">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-brand-red" />
                Grow the Game - Community Board
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open('https://curlingcanada.kudoboard.com/boards/growthegame', '_blank')}
                className="border-brand-border text-brand-text-secondary hover:bg-brand-border"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Open Full Board
              </Button>
            </div>
            <p className="text-brand-text-secondary mt-2">
              Share your curling story, memories, and support for growing the game across Canada
            </p>
          </CardHeader>
          <CardContent className="p-0">
            <div className="relative w-full" style={{ paddingBottom: '75%' }}>
              <iframe
                src="https://curlingcanada.kudoboard.com/boards/growthegame"
                className="absolute top-0 left-0 w-full h-full border-0"
                style={{ minHeight: '600px' }}
                title="Grow the Game Kudoboard"
                allowFullScreen
              />
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card className="bg-brand-card-bg border-brand-border">
            <CardContent className="p-6 text-center">
              <Heart className="w-8 h-8 text-brand-red mx-auto mb-2" />
              <div className="text-3xl font-bold text-brand-text-primary">{stats.total}</div>
              <div className="text-sm text-brand-text-secondary">Total Pledges</div>
            </CardContent>
          </Card>

          <Card className="bg-brand-card-bg border-brand-border">
            <CardContent className="p-6 text-center">
              <Users className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <div className="text-3xl font-bold text-brand-text-primary">{stats.individuals}</div>
              <div className="text-sm text-brand-text-secondary">Individuals</div>
            </CardContent>
          </Card>

          <Card className="bg-brand-card-bg border-brand-border">
            <CardContent className="p-6 text-center">
              <Building className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <div className="text-3xl font-bold text-brand-text-primary">{stats.organizations}</div>
              <div className="text-sm text-brand-text-secondary">Organizations</div>
            </CardContent>
          </Card>

          <Card className="bg-brand-card-bg border-brand-border">
            <CardContent className="p-6 text-center">
              <MapPin className="w-8 h-8 text-purple-500 mx-auto mb-2" />
              <div className="text-3xl font-bold text-brand-text-primary">{stats.provinces}</div>
              <div className="text-sm text-brand-text-secondary">Provinces & Territories</div>
            </CardContent>
          </Card>
        </div>

        {/* Make Your Pledge CTA */}
        {!showForm && (
          <Card className="mb-8 bg-gradient-to-r from-brand-red/10 to-transparent border-brand-red/30">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold text-brand-text-primary mb-4">
                Make Your Pledge to Grow the Game
              </h3>
              <p className="text-brand-text-secondary mb-6 max-w-2xl mx-auto">
                Whether you're trying curling for the first time, volunteering at your local club, or bringing a friend to the ice, every action helps grow our sport.
              </p>
              <Button 
                onClick={() => setShowForm(true)}
                className="bg-brand-red hover:bg-red-700"
                size="lg"
              >
                <Heart className="w-5 h-5 mr-2" />
                Make Your Pledge
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Pledge Form */}
        {showForm && (
          <Card className="mb-8 bg-brand-card-bg border-brand-border">
            <CardHeader>
              <CardTitle>Share Your Commitment</CardTitle>
            </CardHeader>
            <CardContent>
              <PledgeForm 
                onSuccess={handlePledgeSubmitted}
                onCancel={() => setShowForm(false)}
              />
            </CardContent>
          </Card>
        )}

        {/* Filters */}
        <Tabs value={filter} onValueChange={setFilter} className="mb-8">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="try_curling">Try Curling</TabsTrigger>
            <TabsTrigger value="volunteer">Volunteer</TabsTrigger>
            <TabsTrigger value="bring_a_friend">Bring a Friend</TabsTrigger>
            <TabsTrigger value="support_ftloc">Support FTLOC</TabsTrigger>
            <TabsTrigger value="become_a_coach">Become a Coach</TabsTrigger>
            <TabsTrigger value="become_an_official">Become an Official</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Pledge Grid */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-red mx-auto"></div>
          </div>
        ) : filteredPledges.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPledges.map((pledge) => (
              <PledgeCard key={pledge.id} pledge={pledge} />
            ))}
          </div>
        ) : (
          <Card className="bg-brand-card-bg border-brand-border">
            <CardContent className="text-center py-12">
              <Heart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-brand-text-secondary">No pledges yet in this category.</p>
              <p className="text-brand-text-secondary text-sm">Be the first to make a pledge!</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}