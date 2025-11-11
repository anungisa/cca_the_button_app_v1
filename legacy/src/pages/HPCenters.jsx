import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  MapPin, Phone, Mail, ExternalLink, CheckCircle, 
  Target, Activity, Users, Video, Dumbbell, Brain,
  Calendar, Award, Globe
} from 'lucide-react';
import { HPCenter } from '@/api/entities';
import { createPageUrl } from '@/utils';

const FacilityIcon = ({ facility }) => {
  const icons = {
    gym: <Dumbbell className="w-5 h-5" />,
    video_analysis: <Video className="w-5 h-5" />,
    smart_broom_available: <Target className="w-5 h-5" />,
    sports_medicine: <Activity className="w-5 h-5" />,
    dartfish_available: <Video className="w-5 h-5" />
  };
  return icons[facility] || <CheckCircle className="w-5 h-5" />;
};

const HPCenterCard = ({ center }) => {
  return (
    <Card className="bg-brand-card-bg border-brand-border hover:border-brand-red transition-all">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-xl">{center.name}</CardTitle>
            <CardDescription className="flex items-center gap-2 mt-2">
              <MapPin className="w-4 h-4" />
              {center.location.city}, {center.location.province}
            </CardDescription>
          </div>
          <Badge className={center.is_active ? 'bg-green-500/10 text-green-400' : 'bg-gray-500/10 text-gray-400'}>
            {center.is_active ? 'Active' : 'Inactive'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {center.image_url && (
          <div className="aspect-video rounded-lg overflow-hidden">
            <img src={center.image_url} alt={center.name} className="w-full h-full object-cover" />
          </div>
        )}

        <p className="text-sm text-brand-text-secondary">{center.description}</p>

        <div>
          <h4 className="font-semibold text-brand-text-primary mb-3 flex items-center gap-2">
            <Target className="w-4 h-4 text-brand-red" />
            Facilities & Equipment
          </h4>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2 text-sm text-brand-text-secondary">
              <Target className="w-4 h-4 text-brand-red" />
              <span>{center.facilities.num_sheets} Sheets</span>
            </div>
            {center.facilities.gym && (
              <div className="flex items-center gap-2 text-sm text-green-400">
                <Dumbbell className="w-4 h-4" />
                <span>Gym</span>
              </div>
            )}
            {center.facilities.video_analysis && (
              <div className="flex items-center gap-2 text-sm text-green-400">
                <Video className="w-4 h-4" />
                <span>Video Analysis</span>
              </div>
            )}
            {center.facilities.smart_broom_available && (
              <div className="flex items-center gap-2 text-sm text-green-400">
                <Activity className="w-4 h-4" />
                <span>Smart Broom</span>
              </div>
            )}
            {center.facilities.dartfish_available && (
              <div className="flex items-center gap-2 text-sm text-green-400">
                <Video className="w-4 h-4" />
                <span>Dartfish</span>
              </div>
            )}
            {center.facilities.sports_medicine && (
              <div className="flex items-center gap-2 text-sm text-green-400">
                <Brain className="w-4 h-4" />
                <span>Sports Medicine</span>
              </div>
            )}
          </div>
        </div>

        {center.programs_offered && center.programs_offered.length > 0 && (
          <div>
            <h4 className="font-semibold text-brand-text-primary mb-3 flex items-center gap-2">
              <Award className="w-4 h-4 text-brand-red" />
              Programs Offered
            </h4>
            <div className="flex flex-wrap gap-2">
              {center.programs_offered.map((program, index) => (
                <Badge key={index} variant="outline" className="border-brand-border">
                  {program.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {center.staff && center.staff.length > 0 && (
          <div>
            <h4 className="font-semibold text-brand-text-primary mb-3 flex items-center gap-2">
              <Users className="w-4 h-4 text-brand-red" />
              Staff ({center.staff.length})
            </h4>
            <div className="space-y-2">
              {center.staff.slice(0, 3).map((staffMember, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-brand-charcoal rounded">
                  <div>
                    <p className="text-sm font-medium text-brand-text-primary">{staffMember.name}</p>
                    <p className="text-xs text-brand-text-secondary capitalize">{staffMember.role.replace(/_/g, ' ')}</p>
                  </div>
                </div>
              ))}
              {center.staff.length > 3 && (
                <p className="text-xs text-brand-text-secondary">+ {center.staff.length - 3} more</p>
              )}
            </div>
          </div>
        )}

        <div className="pt-4 border-t border-brand-border space-y-2">
          {center.contact_info.email && (
            <div className="flex items-center gap-2 text-sm text-brand-text-secondary">
              <Mail className="w-4 h-4" />
              <a href={`mailto:${center.contact_info.email}`} className="hover:text-brand-red transition-colors">
                {center.contact_info.email}
              </a>
            </div>
          )}
          {center.contact_info.phone && (
            <div className="flex items-center gap-2 text-sm text-brand-text-secondary">
              <Phone className="w-4 h-4" />
              <a href={`tel:${center.contact_info.phone}`} className="hover:text-brand-red transition-colors">
                {center.contact_info.phone}
              </a>
            </div>
          )}
          {center.contact_info.website && (
            <div className="flex items-center gap-2 text-sm text-brand-text-secondary">
              <Globe className="w-4 h-4" />
              <a href={center.contact_info.website} target="_blank" rel="noopener noreferrer" className="hover:text-brand-red transition-colors flex items-center gap-1">
                Visit Website <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          )}
        </div>

        <Button className="w-full" variant="outline">
          View Full Details
        </Button>
      </CardContent>
    </Card>
  );
};

export default function HPCenters() {
  const [centers, setCenters] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRegion, setSelectedRegion] = useState('all');

  useEffect(() => {
    loadCenters();
  }, []);

  const loadCenters = async () => {
    setIsLoading(true);
    try {
      const centerData = await HPCenter.filter({ is_active: true });
      setCenters(centerData);
    } catch (error) {
      console.error('Error loading HP Centers:', error);
      setCenters([
        {
          id: '1',
          name: 'Saville Community Sports Centre',
          location: { city: 'Edmonton', province: 'AB', address: '11610 65 Street NW' },
          ma_region: 'AB',
          facilities: {
            num_sheets: 6,
            gym: true,
            video_analysis: true,
            smart_broom_available: true,
            dartfish_available: true,
            sports_medicine: true
          },
          programs_offered: ['national_team_training', 'nextgen', 'provincial_development', 'coaching_education'],
          staff: [
            { name: 'John Smith', role: 'director' },
            { name: 'Sarah Johnson', role: 'coach' }
          ],
          contact_info: {
            email: 'edmonton@curling.ca',
            phone: '(780) 555-0100',
            website: 'https://curling.ca'
          },
          description: 'Premier high performance training facility in Western Canada, home to multiple national team athletes.',
          is_active: true
        },
        {
          id: '2',
          name: 'Curl Moncton',
          location: { city: 'Moncton', province: 'NB', address: '150 Edmonton St' },
          ma_region: 'NB',
          facilities: {
            num_sheets: 4,
            gym: true,
            video_analysis: true,
            smart_broom_available: false,
            dartfish_available: true,
            sports_medicine: false
          },
          programs_offered: ['nextgen', 'provincial_development'],
          staff: [
            { name: 'Mike Brown', role: 'coordinator' }
          ],
          contact_info: {
            email: 'moncton@curling.ca',
            phone: '(506) 555-0200'
          },
          description: 'Atlantic Canada premier training center for developing athletes.',
          is_active: true
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredCenters = selectedRegion === 'all' 
    ? centers 
    : centers.filter(c => c.ma_region === selectedRegion);

  const regions = [...new Set(centers.map(c => c.ma_region))].sort();

  return (
    <div className="min-h-screen bg-brand-charcoal p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-brand-text-primary flex items-center gap-3">
            <MapPin className="w-8 h-8 text-brand-red" />
            High Performance Centers
          </h1>
          <p className="text-brand-text-secondary mt-2">
            World-class training facilities across Canada
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-brand-card-bg border-brand-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-brand-text-secondary">Total Centers</p>
                  <p className="text-3xl font-bold text-brand-text-primary mt-1">{centers.length}</p>
                </div>
                <MapPin className="w-8 h-8 text-brand-red" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-brand-card-bg border-brand-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-brand-text-secondary">Total Sheets</p>
                  <p className="text-3xl font-bold text-brand-text-primary mt-1">
                    {centers.reduce((sum, c) => sum + (c.facilities.num_sheets || 0), 0)}
                  </p>
                </div>
                <Target className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-brand-card-bg border-brand-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-brand-text-secondary">Staff Members</p>
                  <p className="text-3xl font-bold text-brand-text-primary mt-1">
                    {centers.reduce((sum, c) => sum + (c.staff?.length || 0), 0)}
                  </p>
                </div>
                <Users className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-brand-card-bg border-brand-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-brand-text-secondary">Regions</p>
                  <p className="text-3xl font-bold text-brand-text-primary mt-1">{regions.length}</p>
                </div>
                <Globe className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex gap-2 flex-wrap">
          <Button
            variant={selectedRegion === 'all' ? 'default' : 'outline'}
            onClick={() => setSelectedRegion('all')}
          >
            All Regions
          </Button>
          {regions.map(region => (
            <Button
              key={region}
              variant={selectedRegion === region ? 'default' : 'outline'}
              onClick={() => setSelectedRegion(region)}
            >
              {region}
            </Button>
          ))}
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin w-8 h-8 border-4 border-brand-red border-t-transparent rounded-full mx-auto" />
            <p className="text-brand-text-secondary mt-4">Loading HP Centers...</p>
          </div>
        ) : filteredCenters.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredCenters.map(center => (
              <HPCenterCard key={center.id} center={center} />
            ))}
          </div>
        ) : (
          <Card className="bg-brand-card-bg border-brand-border">
            <CardContent className="p-12 text-center">
              <MapPin className="w-12 h-12 text-brand-text-secondary mx-auto mb-4" />
              <p className="text-brand-text-secondary">No HP Centers found in this region</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}