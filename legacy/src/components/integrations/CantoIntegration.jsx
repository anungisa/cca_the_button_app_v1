
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Image, RefreshCw, Loader2, CheckCircle, AlertTriangle, 
  ExternalLink, Database, Video, FileText, 
  Download, Upload, Search, FolderOpen, Tag, Users
} from 'lucide-react';
import { useToast } from '../hooks/use-toast';

export default function CantoIntegration() {
  const [isSyncing, setIsSyncing] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState({ connected: false, loading: false });
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  const handleSync = async (syncType) => {
    setIsSyncing(true);
    toast({
      title: "Coming Soon",
      description: `Canto ${syncType} sync is being developed.`,
    });
    setTimeout(() => setIsSyncing(false), 1000);
  };

  const testConnection = async () => {
    setConnectionStatus({ connected: false, loading: true });
    setTimeout(() => {
      setConnectionStatus({ connected: false, loading: false });
      toast({
        title: "Canto Integration",
        description: "Connection setup coming soon. Canto DAM API integration in development.",
      });
    }, 1500);
  };

  const handleSearch = () => {
    toast({
      title: "Coming Soon",
      description: "Asset search functionality is being developed.",
    });
  };

  return (
    <div className="space-y-6">
      {/* Overview */}
      <Card className="bg-gradient-to-br from-pink-950/20 to-purple-950/20 border-brand-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Image className="w-6 h-6 text-pink-400" />
            Canto Digital Asset Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-brand-text-secondary">
            Canto is Curling Canada's Digital Asset Management (DAM) system, storing brand assets, 
            event photos, videos, logos, and marketing materials for staff, media, and sponsors.
          </p>

          {/* Connection Status */}
          <div className="p-4 bg-brand-charcoal/50 rounded-lg border border-brand-border">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-pink-400" />
                <span className="font-medium text-brand-text-primary">Connection Status</span>
              </div>
              {connectionStatus.loading ? (
                <Loader2 className="w-4 h-4 animate-spin text-pink-400" />
              ) : connectionStatus.connected ? (
                <Badge className="bg-green-500/20 text-green-400">Connected</Badge>
              ) : (
                <Badge className="bg-gray-500/20 text-gray-400">Not Connected</Badge>
              )}
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={testConnection}
              disabled={connectionStatus.loading}
              className="w-full"
            >
              {connectionStatus.loading ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Testing Connection...</>
              ) : (
                <><RefreshCw className="w-4 h-4 mr-2" /> Test Connection</>
              )}
            </Button>
          </div>

          <Alert className="border-yellow-500/50 bg-yellow-500/10">
            <AlertTriangle className="h-4 w-4 text-yellow-400" />
            <AlertDescription className="text-yellow-200">
              <strong>Integration In Development:</strong> Canto API integration is currently being built. 
              Asset search, automatic tagging, and media library sync coming soon.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Asset Categories */}
      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader>
          <CardTitle>Digital Asset Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="photos" className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-5">
              <TabsTrigger value="photos">
                <Image className="w-4 h-4 mr-2" />
                Photos
              </TabsTrigger>
              <TabsTrigger value="videos">
                <Video className="w-4 h-4 mr-2" />
                Videos
              </TabsTrigger>
              <TabsTrigger value="brand">
                <Tag className="w-4 h-4 mr-2" />
                Brand Assets
              </TabsTrigger>
              <TabsTrigger value="documents">
                <FileText className="w-4 h-4 mr-2" />
                Documents
              </TabsTrigger>
              <TabsTrigger value="search">
                <Search className="w-4 h-4 mr-2" />
                Search
              </TabsTrigger>
            </TabsList>

            {/* Photos Tab */}
            <TabsContent value="photos" className="space-y-4 mt-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Image className="w-5 h-5 text-pink-400 mt-0.5" />
                  <div>
                    <div className="font-medium text-brand-text-primary">Event Photography</div>
                    <div className="text-sm text-brand-text-secondary">
                      High-resolution photos from Brier, Scotties, and other championships
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Users className="w-5 h-5 text-blue-400 mt-0.5" />
                  <div>
                    <div className="font-medium text-brand-text-primary">Athlete Headshots</div>
                    <div className="text-sm text-brand-text-secondary">
                      Official headshots and action shots of national team athletes
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <FolderOpen className="w-5 h-5 text-green-400 mt-0.5" />
                  <div>
                    <div className="font-medium text-brand-text-primary">Club & Facility Photos</div>
                    <div className="text-sm text-brand-text-secondary">
                      Images of curling clubs, HP centers, and facilities across Canada
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Tag className="w-5 h-5 text-purple-400 mt-0.5" />
                  <div>
                    <div className="font-medium text-brand-text-primary">Auto-Tagging</div>
                    <div className="text-sm text-brand-text-secondary">
                      AI-powered tagging by event, athlete, location, and content type
                    </div>
                  </div>
                </div>
              </div>
              <Button onClick={() => handleSync('Photos')} disabled={isSyncing} className="w-full">
                {isSyncing ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Syncing...</>
                ) : (
                  <><RefreshCw className="w-4 h-4 mr-2" /> Sync Photo Library</>
                )}
              </Button>
            </TabsContent>

            {/* Videos Tab */}
            <TabsContent value="videos" className="space-y-4 mt-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Video className="w-5 h-5 text-red-400 mt-0.5" />
                  <div>
                    <div className="font-medium text-brand-text-primary">Championship Highlights</div>
                    <div className="text-sm text-brand-text-secondary">
                      B-roll, highlight reels, and memorable moments from major events
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <FileText className="w-5 h-4 text-blue-400 mt-0.5" />
                  <div>
                    <div className="font-medium text-brand-text-primary">Training & Education</div>
                    <div className="text-sm text-brand-text-secondary">
                      Instructional videos for coaches, officials, and volunteers
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Tag className="w-5 h-5 text-purple-400 mt-0.5" />
                  <div>
                    <div className="font-medium text-brand-text-primary">Commercial Use Assets</div>
                    <div className="text-sm text-brand-text-secondary">
                      Licensed footage for sponsor activations and media partnerships
                    </div>
                  </div>
                </div>
              </div>
              <Button onClick={() => handleSync('Videos')} disabled={isSyncing} className="w-full">
                {isSyncing ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Syncing...</>
                ) : (
                  <><RefreshCw className="w-4 h-4 mr-2" /> Sync Video Library</>
                )}
              </Button>
            </TabsContent>

            {/* Brand Assets Tab */}
            <TabsContent value="brand" className="space-y-4 mt-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Image className="w-5 h-5 text-pink-400 mt-0.5" />
                  <div>
                    <div className="font-medium text-brand-text-primary">Logos & Wordmarks</div>
                    <div className="text-sm text-brand-text-secondary">
                      Official Curling Canada logos in all formats and variations
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <FileText className="w-5 h-5 text-blue-400 mt-0.5" />
                  <div>
                    <div className="font-medium text-brand-text-primary">Brand Guidelines</div>
                    <div className="text-sm text-brand-text-secondary">
                      Style guides, color palettes, typography, and usage rules
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <FileText className="w-5 h-5 text-green-400 mt-0.5" />
                  <div>
                    <div className="font-medium text-brand-text-primary">Templates</div>
                    <div className="text-sm text-brand-text-secondary">
                      PowerPoint, document, and social media templates
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Tag className="w-5 h-5 text-purple-400 mt-0.5" />
                  <div>
                    <div className="font-medium text-brand-text-primary">Event Branding</div>
                    <div className="text-sm text-brand-text-secondary">
                      Championship-specific logos, graphics, and promotional materials
                    </div>
                  </div>
                </div>
              </div>
              <Button onClick={() => handleSync('Brand Assets')} disabled={isSyncing} className="w-full">
                {isSyncing ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Syncing...</>
                ) : (
                  <><RefreshCw className="w-4 h-4 mr-2" /> Sync Brand Assets</>
                )}
              </Button>
            </TabsContent>

            {/* Documents Tab */}
            <TabsContent value="documents" className="space-y-4 mt-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <FileText className="w-5 h-5 text-blue-400 mt-0.5" />
                  <div>
                    <div className="font-medium text-brand-text-primary">Marketing Materials</div>
                    <div className="text-sm text-brand-text-secondary">
                      Brochures, fact sheets, and promotional PDFs
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <FileText className="w-5 h-5 text-green-400 mt-0.5" />
                  <div>
                    <div className="font-medium text-brand-text-primary">Press Kits</div>
                    <div className="text-sm text-brand-text-secondary">
                      Media kits for events, athlete bios, and championship packages
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <FileText className="w-5 h-5 text-purple-400 mt-0.5" />
                  <div>
                    <div className="font-medium text-brand-text-primary">Sponsor Assets</div>
                    <div className="text-sm text-brand-text-secondary">
                      Sponsor logos, activation materials, and partnership documents
                    </div>
                  </div>
                </div>
              </div>
              <Button onClick={() => handleSync('Documents')} disabled={isSyncing} className="w-full">
                {isSyncing ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Syncing...</>
                ) : (
                  <><RefreshCw className="w-4 h-4 mr-2" /> Sync Documents</>
                )}
              </Button>
            </TabsContent>

            {/* Search Tab */}
            <TabsContent value="search" className="space-y-4 mt-4">
              <div className="space-y-3">
                <div>
                  <Label htmlFor="asset-search">Search Canto Library</Label>
                  <div className="flex gap-2 mt-2">
                    <Input
                      id="asset-search"
                      placeholder="Search by keyword, tag, or event name..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="bg-brand-charcoal border-brand-border"
                    />
                    <Button onClick={handleSearch} disabled={!searchTerm}>
                      <Search className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <Alert className="bg-blue-500/10 border-blue-500/30">
                  <Search className="h-4 w-4 text-blue-400" />
                  <AlertDescription className="text-blue-200">
                    <strong>Smart Search:</strong> Search across all asset types, metadata, and AI-generated tags. 
                    Results filtered by your permissions and access level.
                  </AlertDescription>
                </Alert>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  <Button variant="outline" size="sm" onClick={() => setSearchTerm('Brier 2025')}>
                    <Tag className="w-3 h-3 mr-1" />
                    Brier 2025
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setSearchTerm('Team Gushue')}>
                    <Tag className="w-3 h-3 mr-1" />
                    Team Gushue
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setSearchTerm('Logo')}>
                    <Tag className="w-3 h-3 mr-1" />
                    Logos
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setSearchTerm('Highlight')}>
                    <Tag className="w-3 h-3 mr-1" />
                    Highlights
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Integration Benefits */}
      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader>
          <CardTitle>Integration Benefits</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 bg-green-500/10 rounded-lg">
              <h5 className="text-xs font-semibold text-green-400 mb-1 flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Centralized Asset Library
              </h5>
              <p className="text-xs text-brand-text-secondary">
                Single source of truth for all brand assets, accessible from The Button
              </p>
            </div>
            <div className="p-4 bg-blue-500/10 rounded-lg">
              <h5 className="text-xs font-semibold text-blue-400 mb-1 flex items-center gap-2">
                <Tag className="w-4 h-4" />
                Smart Tagging
              </h5>
              <p className="text-xs text-brand-text-secondary">
                AI-powered tagging makes assets discoverable by event, athlete, sponsor, or content type
              </p>
            </div>
            <div className="p-4 bg-purple-500/10 rounded-lg">
              <h5 className="text-xs font-semibold text-purple-400 mb-1 flex items-center gap-2">
                <Users className="w-4 h-4" />
                Media Distribution
              </h5>
              <p className="text-xs text-brand-text-secondary">
                Easily share approved assets with media contacts and sponsors
              </p>
            </div>
            <div className="p-4 bg-pink-500/10 rounded-lg">
              <h5 className="text-xs font-semibold text-pink-400 mb-1 flex items-center gap-2">
                <Database className="w-4 h-4" />
                Usage Tracking
              </h5>
              <p className="text-xs text-brand-text-secondary">
                Monitor which assets are being used, by whom, and in which campaigns
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Use Cases */}
      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader>
          <CardTitle>Key Use Cases</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-4 bg-brand-charcoal/50 rounded-lg border border-pink-500/30">
              <h4 className="font-medium text-pink-400 mb-2">Press Kit Automation</h4>
              <p className="text-sm text-brand-text-secondary">
                Automatically populate press releases with relevant event photos and videos from Canto
              </p>
            </div>
            <div className="p-4 bg-brand-charcoal/50 rounded-lg border border-blue-500/30">
              <h4 className="font-medium text-blue-400 mb-2">Sponsor Asset Portal</h4>
              <p className="text-sm text-brand-text-secondary">
                Give sponsors access to approved co-branded assets and activation materials
              </p>
            </div>
            <div className="p-4 bg-brand-charcoal/50 rounded-lg border border-green-500/30">
              <h4 className="font-medium text-green-400 mb-2">Social Media Content</h4>
              <p className="text-sm text-brand-text-secondary">
                Pull approved images and videos directly into social post scheduling
              </p>
            </div>
            <div className="p-4 bg-brand-charcoal/50 rounded-lg border border-purple-500/30">
              <h4 className="font-medium text-purple-400 mb-2">Event Page Enhancement</h4>
              <p className="text-sm text-brand-text-secondary">
                Automatically display event-specific photos on EventDetails pages
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Technical Details */}
      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader>
          <CardTitle>Technical Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-sm space-y-2">
            <div className="flex justify-between">
              <span className="text-brand-text-secondary">Integration Method:</span>
              <span className="text-brand-text-primary font-medium">REST API</span>
            </div>
            <div className="flex justify-between">
              <span className="text-brand-text-secondary">Authentication:</span>
              <span className="text-brand-text-primary font-medium">OAuth 2.0 + API Key</span>
            </div>
            <div className="flex justify-between">
              <span className="text-brand-text-secondary">Sync Frequency:</span>
              <span className="text-brand-text-primary font-medium">On-demand + Daily metadata sync</span>
            </div>
            <div className="flex justify-between">
              <span className="text-brand-text-secondary">Storage Strategy:</span>
              <span className="text-brand-text-primary font-medium">Reference URLs only (assets stay in Canto)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-brand-text-secondary">Asset Types:</span>
              <span className="text-brand-text-primary font-medium">Images, Videos, PDFs, Templates</span>
            </div>
          </div>

          <Button variant="outline" onClick={() => window.open('https://canto.com', '_blank')} className="w-full mt-4">
            <ExternalLink className="w-4 h-4 mr-2" />
            Visit Canto
          </Button>
        </CardContent>
      </Card>

      {/* Automation Workflows */}
      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader>
          <CardTitle>Automated Workflows</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-3 bg-pink-500/10 rounded-lg border border-pink-500/30">
              <div className="flex items-center gap-2 mb-2">
                <Image className="w-4 h-4 text-pink-400" />
                <span className="font-medium text-pink-400">Auto Event Gallery</span>
              </div>
              <p className="text-xs text-brand-text-secondary">
                When: New event created in The Button
                <br />
                Action: Query Canto for matching event assets + Auto-populate event photo gallery
              </p>
            </div>
            <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/30">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-4 h-4 text-blue-400" />
                <span className="font-medium text-blue-400">Athlete Profile Photos</span>
              </div>
              <p className="text-xs text-brand-text-secondary">
                When: National team athlete added
                <br />
                Action: Fetch official headshot from Canto + Set as athlete_photo_url
              </p>
            </div>
            <div className="p-3 bg-purple-500/10 rounded-lg border border-purple-500/30">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-4 h-4 text-purple-400" />
                <span className="font-medium text-purple-400">Press Release Assets</span>
              </div>
              <p className="text-xs text-brand-text-secondary">
                When: Press release created
                <br />
                Action: Suggest relevant assets from Canto + Auto-attach to media kit
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
