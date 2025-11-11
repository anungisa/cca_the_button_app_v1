
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '../hooks/use-toast';
import { 
  Wand2, CheckCircle, AlertTriangle, Info, FileText, 
  MapPin, Phone, Mail, Users, RefreshCw, Pause 
} from 'lucide-react';
import { Club } from '@/api/entities';
import { provinces } from '../utils/provinces';

const NormalizationRule = ({ rule, enabled, onChange, stats }) => (
  <div className="flex items-start gap-3 p-3 bg-brand-charcoal rounded-lg">
    <Checkbox 
      checked={enabled} 
      onCheckedChange={onChange}
      className="mt-1"
    />
    <div className="flex-1">
      <div className="flex items-center gap-2">
        {rule.icon}
        <h4 className="font-medium text-brand-text-primary">{rule.name}</h4>
        {stats && stats[rule.id] > 0 && (
          <Badge variant="outline" className="bg-blue-500/20 text-blue-300 border-blue-500/30">
            {stats[rule.id]} clubs affected
          </Badge>
        )}
      </div>
      <p className="text-sm text-brand-text-secondary mt-1">{rule.description}</p>
      {rule.examples && (
        <div className="text-xs text-brand-text-secondary mt-2 font-mono">
          <span className="text-red-400">{rule.examples.before}</span> → 
          <span className="text-green-400 ml-1">{rule.examples.after}</span>
        </div>
      )}
    </div>
  </div>
);

// Helper function to add delay between API calls
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export default function ClubDataNormalizer() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isNormalizing, setIsNormalizing] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentClub, setCurrentClub] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [results, setResults] = useState([]); // Changed to array for detailed results
  const [stats, setStats] = useState({ processed: 0, updated: 0, failed: 0, skipped: 0 }); // New state for summary stats
  const [enabledRules, setEnabledRules] = useState({
    provinces: true,
    cities: true,
    postalCodes: true,
    phoneNumbers: true,
    emails: true,
    memberCounts: true,
    maRegions: true,
    duplicates: false, // Disable duplicates by default (read-only)
    addresses: true,
    facilities: true
  });
  const { toast } = useToast();

  const normalizationRules = [
    {
      id: 'provinces',
      name: 'Standardize Province Names',
      description: 'Convert province variations to standard 2-letter codes (AB, ON, BC, etc.)',
      icon: <MapPin className="w-4 h-4 text-blue-400" />,
      examples: { before: '"alberta"', after: '"AB"' }
    },
    {
      id: 'cities',
      name: 'Clean City Names',
      description: 'Fix capitalization, remove extra spaces, standardize formatting',
      icon: <MapPin className="w-4 h-4 text-green-400" />,
      examples: { before: '"  TORONTO  "', after: '"Toronto"' }
    },
    {
      id: 'postalCodes',
      name: 'Format Postal Codes',
      description: 'Standardize to Canadian format: A1A 1A1 (uppercase with space)',
      icon: <Mail className="w-4 h-4 text-purple-400" />,
      examples: { before: '"t5k2j1"', after: '"T5K 2J1"' }
    },
    {
      id: 'phoneNumbers',
      name: 'Format Phone Numbers',
      description: 'Standardize to (XXX) XXX-XXXX format',
      icon: <Phone className="w-4 h-4 text-yellow-400" />,
      examples: { before: '"7801234567"', after: '"(780) 123-4567"' }
    },
    {
      id: 'emails',
      name: 'Validate & Clean Emails',
      description: 'Lowercase, trim spaces, validate format',
      icon: <Mail className="w-4 h-4 text-red-400" />,
      examples: { before: '" INFO@CLUB.COM "', after: '"info@club.com"' }
    },
    {
      id: 'memberCounts',
      name: 'Validate Member Counts',
      description: 'Ensure numeric, remove negatives, set defaults for missing',
      icon: <Users className="w-4 h-4 text-teal-400" />,
      examples: { before: '"null"', after: '0' }
    },
    {
      id: 'maRegions',
      name: 'Assign MA Regions',
      description: 'Auto-assign Member Association based on province',
      icon: <MapPin className="w-4 h-4 text-orange-400" />,
      examples: { before: '"null"', after: '"CCA-AB"' }
    },
    {
      id: 'duplicates',
      name: 'Detect Duplicates (Read-Only)',
      description: 'Find clubs with similar names or same location (analysis only)',
      icon: <AlertTriangle className="w-4 h-4 text-amber-400" />,
      examples: { before: '"Edmonton CC" + "Edmonton Curling"', after: 'Flag for review' }
    },
    {
      id: 'addresses',
      name: 'Clean Addresses',
      description: 'Standardize street abbreviations (St., Ave., Rd.)',
      icon: <MapPin className="w-4 h-4 text-indigo-400" />,
      examples: { before: '"123 main street"', after: '"123 Main St."' }
    },
    {
      id: 'facilities',
      name: 'Normalize Facility Data',
      description: 'Ensure valid sheet counts, boolean flags',
      icon: <CheckCircle className="w-4 h-4 text-pink-400" />,
      examples: { before: 'num_sheets: "5"', after: 'num_sheets: 5' }
    }
  ];

  const analyzeData = async () => {
    setIsAnalyzing(true);
    setProgress(0);
    
    try {
      const clubs = await Club.list('', 1000);
      const stats = {};

      // Analyze each rule
      normalizationRules.forEach(rule => {
        stats[rule.id] = 0;
      });

      clubs.forEach(club => {
        // Province issues
        if (club.location?.province && club.location.province.length > 2) {
          stats.provinces++;
        }

        // City issues
        if (club.location?.city && (
          club.location.city !== club.location.city.trim() ||
          club.location.city === club.location.city.toUpperCase()
        )) {
          stats.cities++;
        }

        // Postal code issues
        if (club.location?.postal_code && 
            !/^[A-Z]\d[A-Z]\s\d[A-Z]\d$/.test(club.location.postal_code)) {
          stats.postalCodes++;
        }

        // Phone issues
        if (club.contact_info?.phone && 
            !/^\(\d{3}\)\s\d{3}-\d{4}$/.test(club.contact_info.phone)) {
          stats.phoneNumbers++;
        }

        // Email issues
        if (club.contact_info?.email && 
            (club.contact_info.email !== club.contact_info.email.toLowerCase().trim())) {
          stats.emails++;
        }

        // Member count issues
        if (club.membership_count === null || club.membership_count === undefined || club.membership_count < 0) {
          stats.memberCounts++;
        }

        // MA region missing
        if (!club.ma_region) {
          stats.maRegions++;
        }

        // Address issues (simple check, can be more complex)
        if (club.location?.address && (
          /street/i.test(club.location.address) ||
          /avenue/i.test(club.location.address) ||
          /road/i.test(club.location.address) ||
          /drive/i.test(club.location.address) ||
          /boulevard/i.test(club.location.address)
        )) {
          stats.addresses++;
        }

        // Facility data issues
        if (club.facilities) {
          if (typeof club.facilities.num_sheets === 'string' && !isNaN(parseInt(club.facilities.num_sheets))) {
            stats.facilities++;
          }
          // Check for non-boolean facility flags
          ['lounge', 'pro_shop', 'equipment_rental'].forEach(field => {
            if (club.facilities[field] !== undefined && typeof club.facilities[field] !== 'boolean') {
              stats.facilities++;
            }
          });
        }
      });

      setAnalysis({ totalClubs: clubs.length, stats });
      
      toast({
        title: 'Analysis Complete',
        description: `Found issues in ${Object.values(stats).reduce((a, b) => a + b, 0)} club records`
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Analysis Failed',
        description: error.message
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const normalizeClub = (club, rules) => {
    const normalized = { ...club };
    let changes = [];

    // Province normalization
    if (rules.provinces && normalized.location?.province) {
      const province = provinces.find(p => 
        p.name.toLowerCase() === normalized.location.province.toLowerCase() ||
        p.abbreviation === normalized.location.province.toUpperCase()
      );
      if (province && normalized.location.province !== province.abbreviation) {
        normalized.location.province = province.abbreviation;
        changes.push('province');
      }
    }

    // City normalization
    if (rules.cities && normalized.location?.city) {
      const cleaned = normalized.location.city
        .trim()
        .split(' ')
        .map(word => word.length > 0 ? word.charAt(0).toUpperCase() + word.slice(1).toLowerCase() : '')
        .join(' ');
      if (cleaned !== normalized.location.city) {
        normalized.location.city = cleaned;
        changes.push('city');
      }
    }

    // Postal code normalization
    if (rules.postalCodes && normalized.location?.postal_code) {
      const postal = normalized.location.postal_code.replace(/\s/g, '').toUpperCase();
      if (postal.length === 6 && !/^[A-Z]\d[A-Z]\s\d[A-Z]\d$/.test(normalized.location.postal_code)) {
        normalized.location.postal_code = `${postal.slice(0, 3)} ${postal.slice(3)}`;
        changes.push('postal_code');
      }
    }

    // Phone normalization
    if (rules.phoneNumbers && normalized.contact_info?.phone) {
      const digits = normalized.contact_info.phone.replace(/\D/g, '');
      if (digits.length === 10 && !/^\(\d{3}\)\s\d{3}-\d{4}$/.test(normalized.contact_info.phone)) {
        normalized.contact_info.phone = `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
        changes.push('phone');
      }
    }

    // Email normalization
    if (rules.emails && normalized.contact_info?.email) {
      const cleaned = normalized.contact_info.email.toLowerCase().trim();
      if (cleaned !== normalized.contact_info.email) {
        normalized.contact_info.email = cleaned;
        changes.push('email');
      }
    }

    // Member count normalization
    if (rules.memberCounts) {
      if (normalized.membership_count === null || normalized.membership_count === undefined || normalized.membership_count < 0) {
        normalized.membership_count = 0;
        changes.push('membership_count');
      }
    }

    // MA region assignment
    if (rules.maRegions && !normalized.ma_region && normalized.location?.province) {
      const provinceCode = normalized.location.province;
      const maRegionMap = {
        'AB': 'CCA-AB', 'BC': 'CCA-BC', 'MB': 'CCA-MB',
        'NB': 'CCA-NB', 'NL': 'CCA-NL', 'NS': 'CCA-NS',
        'NT': 'CCA-NT', 'NU': 'CCA-NU', 'ON': 'CCA-ON',
        'PE': 'CCA-PE', 'QC': 'CCA-QC', 'SK': 'CCA-SK',
        'YT': 'CCA-YT'
      };
      if (maRegionMap[provinceCode]) {
        normalized.ma_region = maRegionMap[provinceCode];
        changes.push('ma_region');
      }
    }

    // Address normalization
    if (rules.addresses && normalized.location?.address) {
      let address = normalized.location.address;
      const replacements = {
        ' street': ' St.', ' Street': ' St.',
        ' avenue': ' Ave.', ' Avenue': ' Ave.',
        ' road': ' Rd.', ' Road': ' Rd.',
        ' drive': ' Dr.', ' Drive': ' Dr.',
        ' boulevard': ' Blvd.', ' Boulevard': ' Blvd.'
      };
      let addressChanged = false;
      Object.entries(replacements).forEach(([from, to]) => {
        const regex = new RegExp(from, 'gi'); // Case-insensitive global replacement
        if (regex.test(address)) {
          address = address.replace(regex, to);
          addressChanged = true;
        }
      });
      if (addressChanged) {
        normalized.location.address = address;
        changes.push('address');
      }
    }

    // Facility data normalization
    if (rules.facilities && normalized.facilities) {
      let facilityChanged = false;
      if (typeof normalized.facilities.num_sheets === 'string' && !isNaN(parseInt(normalized.facilities.num_sheets))) {
        const parsedSheets = parseInt(normalized.facilities.num_sheets);
        if (normalized.facilities.num_sheets !== parsedSheets) {
          normalized.facilities.num_sheets = parsedSheets;
          facilityChanged = true;
        }
      }
      // Ensure booleans
      ['lounge', 'pro_shop', 'equipment_rental'].forEach(field => {
        if (normalized.facilities[field] !== undefined && typeof normalized.facilities[field] !== 'boolean') {
          normalized.facilities[field] = normalized.facilities[field] === true || normalized.facilities[field] === 'true' || normalized.facilities[field] === 1 || normalized.facilities[field] === '1';
          facilityChanged = true;
        }
      });
      if (facilityChanged) {
        changes.push('facilities');
      }
    }

    return { normalized, changes: [...new Set(changes)] }; // Use Set to ensure unique changes
  };

  const runNormalization = async () => {
    setIsNormalizing(true);
    setIsPaused(false);
    setProgress(0);
    setResults([]); // Clear previous results
    setStats({ processed: 0, updated: 0, failed: 0, skipped: 0 }); // Reset stats

    try {
      const allClubs = await Club.list('-created_date', 1000);
      const clubsToNormalize = allClubs; // Assuming 'rules.selectedClubs' is not yet implemented, process all

      for (let i = 0; i < clubsToNormalize.length; i++) {
        if (isPaused) {
          toast({
            title: 'Normalization Paused',
            description: `Paused at club ${i + 1} of ${clubsToNormalize.length}`
          });
          break; // Exit the loop if paused
        }

        const club = clubsToNormalize[i];
        setCurrentClub(club.name);
        
        const { normalized, changes } = normalizeClub(club, enabledRules);

        // Remove system fields that shouldn't be sent in updates
        const cleanedData = { ...normalized };
        delete cleanedData.id;
        delete cleanedData.created_date;
        delete cleanedData.updated_date;
        delete cleanedData.created_by;
        delete cleanedData.created_by_id;
        delete cleanedData.is_sample;

        try {
          if (changes.length > 0) {
            await Club.update(club.id, cleanedData);
            
            setResults(prev => [...prev, {
              clubId: club.id,
              clubName: club.name,
              status: 'success',
              changes: changes,
              timestamp: new Date().toISOString()
            }]);
            
            setStats(prev => ({ ...prev, processed: prev.processed + 1, updated: prev.updated + 1 }));
          } else {
            setResults(prev => [...prev, {
              clubId: club.id,
              clubName: club.name,
              status: 'skipped',
              changes: [],
              message: 'No changes needed',
              timestamp: new Date().toISOString()
            }]);
            
            setStats(prev => ({ ...prev, processed: prev.processed + 1, skipped: prev.skipped + 1 }));
          }
        } catch (error) {
          console.error(`Failed to normalize club ${club.id}:`, error);
          
          setResults(prev => [...prev, {
            clubId: club.id,
            clubName: club.name,
            status: 'error',
            error: error.message,
            timestamp: new Date().toISOString()
          }]);
          
          setStats(prev => ({ ...prev, processed: prev.processed + 1, failed: prev.failed + 1 }));
        }

        setProgress(Math.round(((i + 1) / clubsToNormalize.length) * 100));
        
        // Small delay to prevent overwhelming the API, as per outline
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      if (!isPaused) {
        toast({
          title: 'Normalization Complete!',
          description: `✅ ${stats.updated} clubs updated, ${stats.skipped} already clean, ${stats.failed} errors`
        });
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Normalization Failed',
        description: error.message
      });
    } finally {
      setIsNormalizing(false);
      setCurrentClub('');
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Wand2 className="w-5 h-5 text-purple-400" />
                Club Data Normalization
              </CardTitle>
              <CardDescription>
                Clean and standardize club data for consistency
              </CardDescription>
            </div>
            <Button onClick={analyzeData} disabled={isAnalyzing} variant="outline">
              {isAnalyzing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-brand-red mr-2" />
                  Analyzing...
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4 mr-2" />
                  Analyze Data
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert className="border-blue-500/50 bg-blue-500/10">
            <Info className="h-4 w-4" />
            <AlertDescription>
              <strong>Rate Limit Protection:</strong> Each club is processed with a 100ms delay to avoid API limits. 
              Large datasets will take time depending on the number of clubs.
            </AlertDescription>
          </Alert>

          {analysis && (
            <Alert className="border-blue-500/50 bg-blue-500/10">
              <Info className="h-4 w-4" />
              <AlertDescription>
                <div className="flex justify-between items-center">
                  <span>Analyzed {analysis.totalClubs} clubs</span>
                  <span className="font-medium">
                    {Object.values(analysis.stats).reduce((a, b) => a + b, 0)} issues found
                  </span>
                </div>
              </AlertDescription>
            </Alert>
          )}

          <div>
            <h3 className="text-lg font-semibold text-brand-text-primary mb-3">
              Normalization Rules
            </h3>
            <div className="space-y-2">
              {normalizationRules.map(rule => (
                <NormalizationRule
                  key={rule.id}
                  rule={rule}
                  enabled={enabledRules[rule.id]}
                  onChange={(checked) => setEnabledRules({...enabledRules, [rule.id]: checked})}
                  stats={analysis?.stats}
                />
              ))}
            </div>
          </div>

          {isNormalizing && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-brand-text-secondary">
                  Processing: {currentClub || 'Starting...'}
                </span>
                <span className="text-brand-text-primary font-medium">{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
              <p className="text-xs text-brand-text-secondary">
                Processing with 100ms delay per club to avoid rate limits
              </p>
            </div>
          )}

          {stats.processed > 0 && !isNormalizing && ( // Show results if processing finished and some clubs were processed
            <Alert className="border-green-500/50 bg-green-500/10">
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-2">
                  <div className="font-medium">Normalization Summary:</div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                    <div>
                      <span className="text-brand-text-secondary">Processed:</span>
                      <span className="ml-2 font-medium">{stats.processed}</span>
                    </div>
                    <div>
                      <span className="text-brand-text-secondary">Updated:</span>
                      <span className="ml-2 font-medium text-green-400">{stats.updated}</span>
                    </div>
                    <div>
                      <span className="text-brand-text-secondary">Skipped:</span>
                      <span className="ml-2 font-medium">{stats.skipped}</span>
                    </div>
                    <div>
                      <span className="text-brand-text-secondary">Errors:</span>
                      <span className="ml-2 font-medium text-red-400">{stats.failed}</span>
                    </div>
                  </div>
                  {/* Detailed results can be displayed here, e.g., in a table or list */}
                  {/* Example:
                  {results.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-brand-border">
                      <div className="text-sm font-medium mb-2">Detailed Results:</div>
                      {results.map((r, index) => (
                        <div key={index} className="text-xs text-brand-text-secondary">
                          {r.clubName} - Status: {r.status} {r.changes.length > 0 && `(Changes: ${r.changes.join(', ')})`} {r.error && `(Error: ${r.error})`}
                        </div>
                      ))}
                    </div>
                  )}
                  */}
                </div>
              </AlertDescription>
            </Alert>
          )}

          <div className="flex gap-3">
            <Button
              onClick={runNormalization}
              disabled={isNormalizing || !analysis}
              className="flex-1 bg-brand-red hover:bg-red-700"
            >
              {isNormalizing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Normalizing...
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4 mr-2" />
                  Run Normalization
                </>
              )}
            </Button>
            {isNormalizing && (
              <Button
                variant="outline"
                onClick={() => setIsPaused(true)}
              >
                <Pause className="w-4 h-4 mr-2" />
                Pause
              </Button>
            )}
            <Button
              variant="outline"
              onClick={() => {
                setAnalysis(null);
                setResults([]); // Clear results array
                setStats({ processed: 0, updated: 0, failed: 0, skipped: 0 }); // Clear stats
              }}
              disabled={isNormalizing}
            >
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
