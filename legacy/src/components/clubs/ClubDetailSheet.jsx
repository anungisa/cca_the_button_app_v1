
import React, { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Home, CheckCircle, Users, MapPin, Mail, Phone, Globe, Calendar, Loader2, 
  Trophy, Star, Target, BarChart3, AlertTriangle, Settings 
} from 'lucide-react';

export default function ClubDetailSheet({ 
  club, 
  isOpen, 
  onClose, 
  onSetHomeClub, 
  isAffiliationDisabled, 
  isProcessingAffiliation,
  showAdminView = false 
}) {
  const [activeTab, setActiveTab] = useState('overview');

  if (!club) return null;

  const {
    name,
    logo_url,
    description,
    location,
    contact_info,
    facilities,
    programs,
    membership_count,
    established_year,
    engagement_metrics,
    system_integrations,
    status,
    admin_fields
  } = club;

  const metrics = engagement_metrics || {};
  const integrations = system_integrations || {};
  const adminData = admin_fields || {};

  // CRITICAL FIX: Ensure facilities and programs are treated as arrays to prevent .map errors
  const safeFacilities = facilities || {};
  const safePrograms = Array.isArray(programs) ? programs : [];

  // Mock data for demonstration
  const mockEvents = [
    { name: 'Learn to Curl Night', date: '2024-01-15', type: 'beginner' },
    { name: 'Winter League Championship', date: '2024-01-20', type: 'competitive' },
    { name: 'Youth Bonspiel', date: '2024-01-25', type: 'youth' }
  ];

  const mockLeaderboard = [
    { name: 'Sarah Johnson', xp: 1250, rank: 1 },
    { name: 'Mike Chen', xp: 980, rank: 2 },
    { name: 'Emma Wilson', xp: 875, rank: 3 },
    { name: 'David Kim', xp: 720, rank: 4 },
    { name: 'Lisa Anderson', xp: 650, rank: 5 }
  ];

  const transparentCardStyle = "bg-white/5 backdrop-blur-sm border border-white/10";
  const transparentBackgroundCardStyle = "bg-white/5 backdrop-blur-sm"; // For things like the member list items

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="bg-brand-charcoal/95 backdrop-blur-xl border-white/10 text-brand-text-primary overflow-y-auto w-full sm:max-w-2xl">
        <SheetHeader className="mb-6">
          <div className="flex items-start gap-4">
            {logo_url && (
              <img 
                src={logo_url} 
                alt={`${name} logo`} 
                className="w-16 h-16 object-cover rounded-lg border border-white/10"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            )}
            <div className="flex-1">
              <SheetTitle className="text-2xl font-bold flex items-center gap-2">
                {name}
                {status === 'featured' && <Star className="w-5 h-5 text-amber-400" />}
              </SheetTitle>
              <SheetDescription className="text-brand-text-secondary flex items-center gap-2">
                <MapPin className="w-4 h-4"/>
                {location?.city}, {location?.province}
                {location?.address && ` • ${location.address}`}
              </SheetDescription>
              
              {/* Status and Integration Badges */}
              <div className="flex flex-wrap gap-2 mt-2">
                {metrics.ftloc_participating && (
                  <Badge className="bg-red-500/20 text-red-300 border-red-500/30">✅ FTLOC Participating</Badge>
                )}
                {metrics.survey_completed && (
                  <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                    🧾 Survey Complete {metrics.survey_completion_date && `(${new Date(metrics.survey_completion_date).toLocaleDateString()})`}
                  </Badge>
                )}
                {integrations.smart_coach_enabled && (
                  <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">🧠 Smart Coach</Badge>
                )}
                {integrations.interpodia_connected && (
                  <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">📦 Interpodia</Badge>
                )}
                {integrations.safe_sport_compliant && (
                  <Badge className="bg-green-500/20 text-green-300 border-green-500/30">🔒 Safe Sport</Badge>
                )}
                {metrics.monthly_rank_in_region && metrics.monthly_rank_in_region <= 10 && (
                  <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/30">
                    🏆 Top {metrics.monthly_rank_in_region} in Region
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </SheetHeader>
        
        {/* Action Button */}
        <div className="mb-6">
          {club.isHomeClub ? (
            <Button disabled className="w-full bg-green-500/20 text-green-300 border-green-500/30">
              <CheckCircle className="w-4 h-4 mr-2" />
              Your Home Club
            </Button>
          ) : (
            <Button 
              onClick={onSetHomeClub} 
              disabled={isAffiliationDisabled || isProcessingAffiliation} 
              className="w-full bg-brand-red/90 hover:bg-brand-red text-white backdrop-blur-sm disabled:bg-gray-500/20 disabled:cursor-not-allowed"
            >
              {isProcessingAffiliation ? <Loader2 className="w-4 h-4 mr-2 animate-spin"/> : <Home className="w-4 h-4 mr-2" />}
              Set as Home Club
            </Button>
          )}
          {isAffiliationDisabled && !club.isHomeClub && (
            <p className="text-xs text-center mt-2 text-brand-text-secondary">Sign in to affiliate.</p>
          )}
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-5 bg-white/5 backdrop-blur-sm border-white/10">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="leaderboard">XP Leaders</TabsTrigger>
            <TabsTrigger value="community">Community</TabsTrigger>
            <TabsTrigger value="facilities">Facilities</TabsTrigger>
            {showAdminView && (
              <TabsTrigger value="admin" className="col-span-full lg:col-span-1">
                <Settings className="w-4 h-4 mr-1" />
                Admin
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            {/* Club Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className={transparentCardStyle}>
                <CardContent className="p-4 text-center">
                  <Users className="w-6 h-6 mx-auto mb-2 text-brand-text-secondary" />
                  <p className="text-xl font-bold text-brand-text-primary">{membership_count || 0}</p>
                  <p className="text-xs text-brand-text-secondary">Members</p>
                </CardContent>
              </Card>
              
              {established_year && (
                <Card className={transparentCardStyle}>
                  <CardContent className="p-4 text-center">
                    <Calendar className="w-6 h-6 mx-auto mb-2 text-brand-text-secondary" />
                    <p className="text-xl font-bold text-brand-text-primary">{established_year}</p>
                    <p className="text-xs text-brand-text-secondary">Established</p>
                  </CardContent>
                </Card>
              )}
              
              {metrics.xp_total > 0 && (
                <Card className={transparentCardStyle}>
                  <CardContent className="p-4 text-center">
                    <Trophy className="w-6 h-6 mx-auto mb-2 text-amber-400" />
                    <p className="text-xl font-bold text-brand-text-primary">{metrics.xp_total}</p>
                    <p className="text-xs text-brand-text-secondary">Total XP</p>
                  </CardContent>
                </Card>
              )}
              
              {metrics.event_frequency_6mo > 0 && (
                <Card className={transparentCardStyle}>
                  <CardContent className="p-4 text-center">
                    <BarChart3 className="w-6 h-6 mx-auto mb-2 text-green-400" />
                    <p className="text-xl font-bold text-brand-text-primary">{metrics.event_frequency_6mo}</p>
                    <p className="text-xs text-brand-text-secondary">Events (6mo)</p>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Description */}
            {description && (
              <Card className={transparentCardStyle}>
                <CardHeader>
                  <CardTitle className="text-lg">About {name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-brand-text-secondary">{description}</p>
                </CardContent>
              </Card>
            )}

            {/* Contact Info */}
            {contact_info && Object.keys(contact_info).length > 0 && (
              <Card className={transparentCardStyle}>
                <CardHeader>
                  <CardTitle className="text-lg">Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {contact_info.email && (
                    <a href={`mailto:${contact_info.email}`} className="flex items-center gap-3 hover:text-brand-red">
                      <Mail className="w-4 h-4" /> <span>{contact_info.email}</span>
                    </a>
                  )}
                  {contact_info.phone && (
                    <a href={`tel:${contact_info.phone}`} className="flex items-center gap-3 hover:text-brand-red">
                      <Phone className="w-4 h-4" /> <span>{contact_info.phone}</span>
                    </a>
                  )}
                  {contact_info.website && (
                    <a href={contact_info.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-brand-red">
                      <Globe className="w-4 h-4" /> <span>Visit Website</span>
                    </a>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="events" className="space-y-4">
            <Card className={transparentCardStyle}>
              <CardHeader>
                <CardTitle>Upcoming Events</CardTitle>
              </CardHeader>
              <CardContent>
                {mockEvents.length > 0 ? (
                  <div className="space-y-3">
                    {mockEvents.map((event, idx) => (
                      <div key={idx} className={`flex items-center justify-between p-3 rounded-lg ${transparentBackgroundCardStyle}`}>
                        <div>
                          <p className="font-medium text-brand-text-primary">{event.name}</p>
                          <p className="text-sm text-brand-text-secondary">{new Date(event.date).toLocaleDateString()}</p>
                        </div>
                        <Badge variant="outline">{event.type}</Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-brand-text-secondary">No upcoming events scheduled.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="leaderboard" className="space-y-4">
            <Card className={transparentCardStyle}>
              <CardHeader>
                <CardTitle>Top Community Members</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockLeaderboard.map((member, idx) => (
                    <div key={idx} className={`flex items-center justify-between p-3 rounded-lg ${transparentBackgroundCardStyle}`}>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-brand-red rounded-full flex items-center justify-center text-white font-bold text-sm">
                          {member.rank}
                        </div>
                        <span className="font-medium text-brand-text-primary">{member.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Trophy className="w-4 h-4 text-amber-400" />
                        <span className="font-bold text-brand-text-primary">{member.xp} XP</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="community" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className={transparentCardStyle}>
                <CardHeader>
                  <CardTitle className="text-lg">Community Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-brand-text-secondary">FTLOC Participation</span>
                    <span className={metrics.ftloc_participating ? 'text-green-400' : 'text-gray-400'}>
                      {metrics.ftloc_participating ? 'Active' : 'Not Participating'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-brand-text-secondary">Survey Status</span>
                    <span className={metrics.survey_completed ? 'text-green-400' : 'text-gray-400'}>
                      {metrics.survey_completed ? 'Complete' : 'Pending'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-brand-text-secondary">Regional Rank</span>
                    <span className="text-brand-text-primary">
                      {metrics.monthly_rank_in_region ? `#${metrics.monthly_rank_in_region}` : 'N/A'}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card className={transparentCardStyle}>
                <CardHeader>
                  <CardTitle className="text-lg">Member Demographics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-brand-text-secondary">Total Members</span>
                    <span className="text-brand-text-primary">{membership_count || 0}</span>
                  </div>
                  {club.youth_member_percentage && (
                    <div className="flex justify-between">
                      <span className="text-brand-text-secondary">Youth Members</span>
                      <span className="text-brand-text-primary">{club.youth_member_percentage}%</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="facilities" className="space-y-4">
            <Card className={transparentCardStyle}>
              <CardHeader>
                <CardTitle>Facilities & Amenities</CardTitle>
              </CardHeader>
              <CardContent>
                {Object.values(safeFacilities).some(v => v) ? (
                  <div className="grid grid-cols-2 gap-4">
                    {safeFacilities.num_sheets && (
                      <div className="flex items-center gap-2">
                        <Target className="w-5 h-5 text-blue-400" />
                        <span>{safeFacilities.num_sheets} Ice Sheets</span>
                      </div>
                    )}
                    {safeFacilities.lounge && (
                      <div className="flex items-center gap-2">
                        <span className="text-lg">🧼</span>
                        <span>Lounge</span>
                      </div>
                    )}
                    {safeFacilities.pro_shop && (
                      <div className="flex items-center gap-2">
                        <span className="text-lg">🛍️</span>
                        <span>Pro Shop</span>
                      </div>
                    )}
                    {safeFacilities.equipment_rental && (
                      <div className="flex items-center gap-2">
                        <span className="text-lg">🎯</span>
                        <span>Equipment Rental</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-brand-text-secondary">No facility information available.</p>
                )}
              </CardContent>
            </Card>

            {/* Programs */}
            {safePrograms.length > 0 && (
              <Card className={transparentCardStyle}>
                <CardHeader>
                  <CardTitle>Programs Offered</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {safePrograms.map((program, idx) => (
                      <div key={idx} className={`p-3 rounded-lg ${transparentBackgroundCardStyle}`}>
                        <p className="font-medium text-brand-text-primary capitalize">
                          {program.name || (program.type ? program.type.replace('_', ' ') : 'Unnamed Program')}
                        </p>
                        {program.skill_level && (
                          <p className="text-sm text-brand-text-secondary capitalize">{program.skill_level}</p>
                        )}
                        {program.age_range && (
                          <p className="text-sm text-brand-text-secondary">Ages: {program.age_range}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {showAdminView && (
            <TabsContent value="admin" className="space-y-4">
              <Card className={transparentCardStyle}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-amber-400" />
                    Admin Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-brand-text-secondary">Status</label>
                      <p className="text-brand-text-primary capitalize">{status || 'Unknown'}</p>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-brand-text-secondary">Verification</label>
                      <p className="text-brand-text-primary capitalize">
                        {adminData.verification_status || 'Unverified'}
                      </p>
                    </div>
                    
                    {adminData.last_admin_login && (
                      <div>
                        <label className="text-sm font-medium text-brand-text-secondary">Last Admin Login</label>
                        <p className="text-brand-text-primary">
                          {new Date(adminData.last_admin_login).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                    
                    {integrations.curling_reg_synced && (
                      <div>
                        <label className="text-sm font-medium text-brand-text-secondary">Last CurlingReg Sync</label>
                        <p className="text-brand-text-primary">
                          {new Date(integrations.curling_reg_synced).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                  </div>
                  
                  {adminData.admin_notes && (
                    <div>
                      <label className="text-sm font-medium text-brand-text-secondary">Admin Notes</label>
                      <p className={`text-brand-text-primary p-3 rounded-lg mt-1 ${transparentBackgroundCardStyle}`}>
                        {adminData.admin_notes}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}
