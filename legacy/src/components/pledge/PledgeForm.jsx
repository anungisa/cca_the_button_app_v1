import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Pledge } from '@/api/entities';
import { Club } from '@/api/entities';
import { UploadFile } from '@/api/integrations';
import { useXP } from '@/components/XPContext';
import { Heart, Upload, X, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const PLEDGE_TYPES = [
  {
    id: 'try_curling',
    title: 'Try Curling',
    description: 'Commit to trying curling for the first time',
    icon: '🥌'
  },
  {
    id: 'volunteer',
    title: 'Volunteer',
    description: 'Help out at local curling events',
    icon: '🤝'
  },
  {
    id: 'bring_a_friend',
    title: 'Bring a Friend',
    description: 'Introduce someone new to curling',
    icon: '👥'
  },
  {
    id: 'support_ftloc',
    title: 'Support FTLOC',
    description: 'Make a donation to youth curling',
    icon: '💝'
  },
  {
    id: 'become_a_coach',
    title: 'Become a Coach',
    description: 'Get certified to teach curling',
    icon: '📚'
  },
  {
    id: 'become_an_official',
    title: 'Become an Official',
    description: 'Train to officiate curling matches',
    icon: '👔'
  }
];

const PROVINCES = [
  'Alberta', 'British Columbia', 'Manitoba', 'New Brunswick',
  'Newfoundland and Labrador', 'Northwest Territories', 'Nova Scotia',
  'Nunavut', 'Ontario', 'Prince Edward Island', 'Quebec', 'Saskatchewan', 'Yukon'
];

export default function PledgeForm({ onSubmissionComplete }) {
  const [formData, setFormData] = useState({
    name: '',
    organization_name: '',
    province: '',
    club_id: '',
    club_name: '',
    pledge_by: 'Individual',
    pledge_type: '',
    pledge_statement: '',
    reason: '',
    logo_url: '',
    website_url: '',
    display_publicly: true,
    email: ''
  });

  const [clubs, setClubs] = useState([]);
  const [mediaFiles, setMediaFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);

  const { user } = useXP();

  // Load clubs when province changes
  React.useEffect(() => {
    if (formData.province) {
      loadClubsForProvince(formData.province);
    }
  }, [formData.province]);

  const loadClubsForProvince = async (province) => {
    try {
      const clubData = await Club.filter({ 'location.province': province });
      setClubs(clubData);
    } catch (error) {
      console.error('Failed to load clubs:', error);
      setClubs([]);
    }
  };

  const handleFileUpload = async (file) => {
    if (!file) return;
    
    setUploadingFile(true);
    try {
      const { file_url } = await UploadFile({ file });
      
      if (formData.pledge_by === 'Organization') {
        setFormData({ ...formData, logo_url: file_url });
      } else {
        setMediaFiles([...mediaFiles, {
          type: file.type.startsWith('image/') ? 'image' : 'video',
          url: file_url,
          name: file.name
        }]);
      }
    } catch (error) {
      console.error('File upload failed:', error);
      alert('Failed to upload file. Please try again.');
    } finally {
      setUploadingFile(false);
    }
  };

  const removeMediaFile = (index) => {
    const newFiles = mediaFiles.filter((_, i) => i !== index);
    setMediaFiles(newFiles);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const pledgeData = {
        ...formData,
        media_attachments: mediaFiles,
        user_id: user?.id || null,
        status: 'pending_review'
      };

      await Pledge.create(pledgeData);
      setIsSubmitted(true);
      
      if (onSubmissionComplete) {
        onSubmissionComplete();
      }
    } catch (error) {
      console.error('Failed to submit pledge:', error);
      alert('Failed to submit pledge. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl mx-auto"
      >
        <Card className="bg-brand-card-bg border-brand-border text-center">
          <CardContent className="p-12">
            <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-brand-text-primary mb-4">
              Pledge Submitted Successfully! 🎉
            </h2>
            <p className="text-brand-text-secondary mb-6">
              Thank you for your commitment to growing curling in Canada. Your pledge is now under review and will appear on the public board once approved.
            </p>
            <Button onClick={() => window.location.href = '/pledge-board'}>
              View All Pledges
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-3 text-2xl">
            <Heart className="w-8 h-8 text-brand-red" />
            Make Your Pledge to Curling
          </CardTitle>
          <p className="text-brand-text-secondary">
            Join thousands of Canadians committed to growing our sport
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-brand-text-primary mb-2">
                  Name / Organization *
                </label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Your name or organization name"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-brand-text-primary mb-2">
                  Province / Territory *
                </label>
                <Select 
                  value={formData.province} 
                  onValueChange={(value) => setFormData({...formData, province: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select province" />
                  </SelectTrigger>
                  <SelectContent>
                    {PROVINCES.map(province => (
                      <SelectItem key={province} value={province}>
                        {province}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Pledge Type Selection */}
            <div>
              <label className="block text-sm font-medium text-brand-text-primary mb-4">
                What is your pledge? *
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {PLEDGE_TYPES.map((pledgeType) => (
                  <motion.div
                    key={pledgeType.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        formData.pledge_type === pledgeType.id
                          ? 'border-brand-red bg-brand-red/10'
                          : 'border-brand-border hover:border-brand-red/50'
                      }`}
                      onClick={() => setFormData({...formData, pledge_type: pledgeType.id})}
                    >
                      <div className="text-2xl mb-2">{pledgeType.icon}</div>
                      <h3 className="font-semibold text-brand-text-primary">{pledgeType.title}</h3>
                      <p className="text-sm text-brand-text-secondary">{pledgeType.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Club Selection */}
            {clubs.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-brand-text-primary mb-2">
                  Associated Club (Optional)
                </label>
                <Select 
                  value={formData.club_id} 
                  onValueChange={(value) => {
                    const selectedClub = clubs.find(c => c.id === value);
                    setFormData({
                      ...formData, 
                      club_id: value,
                      club_name: selectedClub?.name || ''
                    });
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your club" />
                  </SelectTrigger>
                  <SelectContent>
                    {clubs.map(club => (
                      <SelectItem key={club.id} value={club.id}>
                        {club.name} - {club.location?.city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Pledge Statement */}
            <div>
              <label className="block text-sm font-medium text-brand-text-primary mb-2">
                Your Pledge Statement *
              </label>
              <Textarea
                value={formData.pledge_statement}
                onChange={(e) => setFormData({...formData, pledge_statement: e.target.value})}
                placeholder="Describe your commitment to curling..."
                rows={4}
                required
              />
            </div>

            {/* Reason */}
            <div>
              <label className="block text-sm font-medium text-brand-text-primary mb-2">
                Why are you making this pledge?
              </label>
              <Textarea
                value={formData.reason}
                onChange={(e) => setFormData({...formData, reason: e.target.value})}
                placeholder="Share your motivation..."
                rows={3}
              />
            </div>

            {/* Media Upload */}
            <div>
              <label className="block text-sm font-medium text-brand-text-primary mb-2">
                Add a Photo or Video (Optional)
              </label>
              <div className="border-2 border-dashed border-brand-border rounded-lg p-6 text-center">
                <input
                  type="file"
                  accept="image/*,video/*"
                  onChange={(e) => handleFileUpload(e.target.files[0])}
                  className="hidden"
                  id="media-upload"
                />
                <label htmlFor="media-upload" className="cursor-pointer">
                  {uploadingFile ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-brand-red" />
                      <span>Uploading...</span>
                    </div>
                  ) : (
                    <div>
                      <Upload className="w-8 h-8 text-brand-text-secondary mx-auto mb-2" />
                      <p className="text-brand-text-secondary">Click to upload a photo or video</p>
                    </div>
                  )}
                </label>
              </div>

              {/* Display uploaded media */}
              {mediaFiles.length > 0 && (
                <div className="mt-4 space-y-2">
                  {mediaFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-brand-charcoal rounded-lg">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline">{file.type}</Badge>
                        <span className="text-sm text-brand-text-primary">{file.name}</span>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeMediaFile(index)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Privacy Settings */}
            <div className="flex items-center justify-between p-4 bg-brand-charcoal rounded-lg">
              <div>
                <h4 className="font-medium text-brand-text-primary">Display publicly</h4>
                <p className="text-sm text-brand-text-secondary">
                  Show your pledge on the public Pledge Board
                </p>
              </div>
              <Switch
                checked={formData.display_publicly}
                onCheckedChange={(checked) => setFormData({...formData, display_publicly: checked})}
              />
            </div>

            {/* Contact Information */}
            <div>
              <label className="block text-sm font-medium text-brand-text-primary mb-2">
                Email (Optional - for follow-up and XP rewards)
              </label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder="your.email@example.com"
              />
            </div>

            {/* Submit Button */}
            <div className="text-center pt-6">
              <Button
                type="submit"
                size="lg"
                disabled={isSubmitting || !formData.name || !formData.province || !formData.pledge_type || !formData.pledge_statement}
                className="bg-brand-red hover:bg-red-700 text-white px-8 py-3"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                    Submitting...
                  </div>
                ) : (
                  <>
                    <Heart className="w-5 h-5 mr-2" />
                    Submit My Pledge
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}