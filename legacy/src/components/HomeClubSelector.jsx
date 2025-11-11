import React, { useState, useEffect } from 'react';
import { Club } from '@/api/entities';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  MapPin, 
  Building, 
  Heart, 
  Star,
  Check,
  X,
  Users,
  ChevronDown
} from 'lucide-react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

export default function HomeClubSelector({ 
  selectedClub, 
  onClubSelect, 
  userRegion = null,
  isOnboarding = false,
  showPrivacyNote = true 
}) {
  const [clubs, setClubs] = useState([]);
  const [filteredClubs, setFilteredClubs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showPreferNotToSay, setShowPreferNotToSay] = useState(false);

  useEffect(() => {
    const loadClubs = async () => {
      try {
        // Load clubs, prioritizing user's region
        const allClubs = await Club.list('name', 500);
        
        // Sort clubs - user's region first, then alphabetically
        const sortedClubs = allClubs.sort((a, b) => {
          if (userRegion) {
            if (a.ma_region === userRegion && b.ma_region !== userRegion) return -1;
            if (b.ma_region === userRegion && a.ma_region !== userRegion) return 1;
          }
          return a.name.localeCompare(b.name);
        });
        
        setClubs(sortedClubs);
        setFilteredClubs(sortedClubs.slice(0, 50)); // Show top 50 initially
      } catch (error) {
        console.error('Error loading clubs:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadClubs();
  }, [userRegion]);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredClubs(clubs.slice(0, 50));
    } else {
      const filtered = clubs.filter(club =>
        club.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        club.location?.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        club.ma_region?.toLowerCase().includes(searchTerm.toLowerCase())
      ).slice(0, 20);
      setFilteredClubs(filtered);
    }
  }, [searchTerm, clubs]);

  const handleClubSelect = (club) => {
    onClubSelect(club);
    setIsOpen(false);
    setSearchTerm('');
  };

  const handlePreferNotToSay = () => {
    onClubSelect(null);
    setShowPreferNotToSay(true);
    setIsOpen(false);
  };

  const regionalClubs = filteredClubs.filter(club => club.ma_region === userRegion);
  const otherClubs = filteredClubs.filter(club => club.ma_region !== userRegion);

  return (
    <div className="space-y-4">
      {isOnboarding && (
        <div className="text-center mb-6">
          <Building className="w-12 h-12 text-brand-red mx-auto mb-3" />
          <h3 className="text-xl font-bold text-brand-charcoal mb-2">
            Where do you most often curl?
          </h3>
          <p className="text-gray-600 max-w-md mx-auto">
            This helps us personalize your curling experience and connect you with your local community.
          </p>
        </div>
      )}

      <div className="space-y-3">
        <Label htmlFor="club-selector" className="text-sm font-medium">
          {isOnboarding ? 'Select Your Home Club' : 'Home Club'}
          <span className="text-gray-500 font-normal ml-2">(Optional)</span>
        </Label>

        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={isOpen}
              className="w-full justify-between h-12"
              disabled={isLoading}
            >
              {selectedClub ? (
                <div className="flex items-center gap-2">
                  <Building className="w-4 h-4 text-brand-red" />
                  <div className="text-left">
                    <div className="font-medium">{selectedClub.name}</div>
                    <div className="text-xs text-gray-500">
                      {selectedClub.location?.city}, {selectedClub.location?.province}
                    </div>
                  </div>
                </div>
              ) : showPreferNotToSay ? (
                <span className="text-gray-600">Prefer not to say</span>
              ) : (
                <span className="text-gray-500">
                  {isLoading ? 'Loading clubs...' : 'Search for your club...'}
                </span>
              )}
              <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0" align="start">
            <Command>
              <CommandInput 
                placeholder="Search clubs by name or city..." 
                value={searchTerm}
                onValueChange={setSearchTerm}
              />
              <CommandList className="max-h-64">
                <CommandEmpty>
                  <div className="text-center py-4">
                    <Building className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">No clubs found</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Try searching by club name or city
                    </p>
                  </div>
                </CommandEmpty>

                {/* User's Region Clubs First */}
                {regionalClubs.length > 0 && userRegion && (
                  <CommandGroup heading={`${userRegion} Clubs`}>
                    {regionalClubs.map((club) => (
                      <CommandItem
                        key={club.id}
                        value={club.name}
                        onSelect={() => handleClubSelect(club)}
                        className="flex items-center gap-3 p-3"
                      >
                        <Building className="w-4 h-4 text-brand-red" />
                        <div className="flex-1">
                          <div className="font-medium">{club.name}</div>
                          <div className="text-xs text-gray-500">
                            {club.location?.city}, {club.location?.province}
                            {club.membership_count && (
                              <span className="ml-2">• {club.membership_count} members</span>
                            )}
                          </div>
                        </div>
                        {selectedClub?.id === club.id && (
                          <Check className="w-4 h-4 text-brand-red" />
                        )}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )}

                {/* Other Clubs */}
                {otherClubs.length > 0 && (
                  <CommandGroup heading={regionalClubs.length > 0 ? "Other Clubs" : "Clubs"}>
                    {otherClubs.map((club) => (
                      <CommandItem
                        key={club.id}
                        value={club.name}
                        onSelect={() => handleClubSelect(club)}
                        className="flex items-center gap-3 p-3"
                      >
                        <Building className="w-4 h-4 text-gray-400" />
                        <div className="flex-1">
                          <div className="font-medium">{club.name}</div>
                          <div className="text-xs text-gray-500">
                            {club.location?.city}, {club.location?.province}
                            <Badge variant="outline" className="ml-2 text-xs">
                              {club.ma_region}
                            </Badge>
                          </div>
                        </div>
                        {selectedClub?.id === club.id && (
                          <Check className="w-4 h-4 text-brand-red" />
                        )}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )}

                {/* Prefer Not to Say Option */}
                <CommandGroup>
                  <CommandItem
                    onSelect={handlePreferNotToSay}
                    className="flex items-center gap-3 p-3 text-gray-600"
                  >
                    <X className="w-4 h-4" />
                    <span>Prefer not to say</span>
                  </CommandItem>
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      {/* Selected Club Info */}
      {selectedClub && (
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-brand-red rounded-full flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-brand-charcoal">
                  Great choice! You'll represent {selectedClub.name}
                </h4>
                <p className="text-sm text-gray-600">
                  Earn +50 XP for selecting your home club
                </p>
              </div>
              <Badge className="bg-green-500 text-white flex items-center gap-1">
                <Star className="w-3 h-3" />
                +50 XP
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Privacy Note */}
      {showPrivacyNote && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <Users className="w-3 h-3 text-white" />
            </div>
            <div className="text-sm">
              <h4 className="font-medium text-blue-800 mb-1">Your Privacy Matters</h4>
              <ul className="text-blue-700 space-y-1 text-xs">
                <li>• This doesn't connect you to your club's member systems</li>
                <li>• No data is shared with your club without your permission</li>
                <li>• Used only to personalize your app experience</li>
                <li>• You can change or remove this anytime</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Benefits Preview */}
      {isOnboarding && (
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium text-brand-charcoal mb-3">
            What you'll get:
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-brand-red" />
              <span>Local event notifications</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-brand-red" />
              <span>Club community updates</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-brand-red" />
              <span>Bonus XP for club activities</span>
            </div>
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-brand-red" />
              <span>Targeted FTLOC opportunities</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}