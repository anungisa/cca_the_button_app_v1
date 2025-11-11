import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Pencil, MapPin, Calendar, Mail, Phone, User, Camera } from 'lucide-react';
import { motion } from 'framer-motion';
import ProfileImageUpload from './ProfileImageUpload';

export default function ProfileHeader({
  user,
  setUser,
  loyaltyData,
  isEditing,
  setIsEditing
}) {
  const [showImageUpload, setShowImageUpload] = useState(false);

  // Guard against null user
  if (!user) {
    return (
      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
        <CardContent className="p-8">
          <div className="text-center text-brand-text-secondary">
            Loading profile...
          </div>
        </CardContent>
      </Card>
    );
  }

  const handleImageUpdate = (newImageUrl) => {
    setUser({ ...user, profile_image_url: newImageUrl });
    setShowImageUpload(false);
  };

  const formatUserType = (userType) => {
    if (!userType || typeof userType !== 'string') return 'Member';
    return userType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const formatRole = (role) => {
    if (!role || typeof role !== 'string') return '';
    if (role === 'admin') return 'Administrator';
    return role.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const formatTierName = (tier) => {
    if (!tier || typeof tier !== 'string') return 'Granite Rookie';
    return tier.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const formatLocation = (user) => {
    const parts = [];
    if (user.home_club_name) parts.push(user.home_club_name);
    if (user.ma_region) parts.push(user.ma_region);
    return parts.length > 0 ? parts.join(', ') : 'Location not set';
  };

  const formatJoinDate = (dateString) => {
    if (!dateString) return 'Recently joined';
    try {
      return `Member since ${new Date(dateString).getFullYear()}`;
    } catch {
      return 'Recently joined';
    }
  };

  // Safe access to user properties
  const userName = user.full_name || 'Curling Enthusiast';
  const userEmail = user.email || '';
  const userInitial = userName.charAt(0).toUpperCase();

  return (
    <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all duration-300">
      <CardContent className="p-8">
        <div className="flex flex-col lg:flex-row items-start gap-6">
          <div className="flex flex-col items-center gap-4">
            {showImageUpload ? (
              <ProfileImageUpload
                user={user}
                onImageUpdate={handleImageUpdate}
              />
            ) : (
              <>
                <div className="relative group">
                  <Avatar className="w-32 h-32 border-4 border-brand-red">
                    <AvatarImage src={user.profile_image_url} alt={userName} />
                    <AvatarFallback className="text-2xl bg-brand-red text-white">
                      {userInitial}
                    </AvatarFallback>
                  </Avatar>

                  <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                       onClick={() => setShowImageUpload(true)}>
                    <Camera className="w-8 h-8 text-white" />
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowImageUpload(true)}
                  className="border-white/30 hover:bg-white/20 hover:text-white"
                >
                  <Camera className="w-4 h-4 mr-2" />
                  Change Photo
                </Button>
              </>
            )}

            {loyaltyData && (
              <Badge className="bg-gradient-to-r from-amber-500 to-amber-600 text-white px-4 py-1">
                {formatTierName(loyaltyData.tier)}
              </Badge>
            )}
          </div>

          <div className="flex-1 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-brand-text-primary">
                  {userName}
                </h1>
                <p className="text-lg text-brand-text-secondary">
                  {formatUserType(user.user_type)}
                  {user.role && user.role !== user.user_type && (
                    <span className="ml-2 text-brand-red">• {formatRole(user.role)}</span>
                  )}
                </p>
              </div>
              <Button
                onClick={() => setIsEditing(!isEditing)}
                variant="outline"
                className="border-white/30 hover:bg-white/20 hover:text-white"
              >
                <Pencil className="w-4 h-4 mr-2" />
                {isEditing ? 'Cancel Edit' : 'Edit Profile'}
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2 text-brand-text-secondary">
                <MapPin className="w-4 h-4" />
                <span>{formatLocation(user)}</span>
              </div>

              {userEmail && (
                <div className="flex items-center gap-2 text-brand-text-secondary">
                  <Mail className="w-4 h-4" />
                  <span>{userEmail}</span>
                </div>
              )}

              <div className="flex items-center gap-2 text-brand-text-secondary">
                <Calendar className="w-4 h-4" />
                <span>{formatJoinDate(user.created_date)}</span>
              </div>

              {user.phone && (
                <div className="flex items-center gap-2 text-brand-text-secondary">
                  <Phone className="w-4 h-4" />
                  <span>{user.phone}</span>
                </div>
              )}
            </div>

            {(user.skill_level || user.preferred_position) && (
              <div className="flex flex-wrap gap-2 pt-2">
                {user.skill_level && (
                  <Badge variant="outline" className="border-white/30 text-brand-text-secondary bg-white/10">
                    {formatUserType(user.skill_level)} Level
                  </Badge>
                )}
                {user.preferred_position && (
                  <Badge variant="outline" className="border-white/30 text-brand-text-secondary bg-white/10">
                    Prefers {formatUserType(user.preferred_position)}
                  </Badge>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}