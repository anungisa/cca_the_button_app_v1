
import React, { useState, useEffect, Suspense, useCallback } from 'react';
import { User } from '@/api/entities';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, User as UserIcon, Shield, Bell, KeyRound, Zap, BarChart3, Target, Trophy, Users } from 'lucide-react';
import ProfileHeader from '@/components/profile_v2/ProfileHeader';
import ProfileStats from '@/components/profile_v2/ProfileStats';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/hooks/use-toast';
import { AnimatePresence, motion } from 'framer-motion';
import { createPageUrl } from '@/utils';
import { Link } from 'react-router-dom'; // Assuming react-router-dom for Link component

const EditProfileForm = React.lazy(() => import('@/components/profile_v2/EditProfileForm'));
const ProfileDetailsView = React.lazy(() => import('@/components/profile_v2/ProfileDetailsView'));
const MembershipTab = React.lazy(() => import('@/components/profile/MembershipTab'));
const NotificationSettings = React.lazy(() => import('@/components/profile/NotificationSettings'));
const SSOManager = React.lazy(() => import('@/components/profile_v2/SSOManager'));

export default function ProfilePage() {
    const [user, setUser] = useState(null);
    const [loyaltyData, setLoyaltyData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({});
    const [errors, setErrors] = useState({});
    const [isSaving, setIsSaving] = useState(false);
    const { toast } = useToast();

    const loadUserData = useCallback(async () => {
        setIsLoading(true);
        try {
            const userData = await User.me();
            if (!userData) {
                // Redirect to login if no user
                window.location.href = createPageUrl('Home');
                return;
            }
            setUser(userData);
            setEditForm({
                full_name: userData.full_name || '',
                phone: userData.phone || '',
                home_club_id: userData.home_club_id || '',
                home_club_name: userData.home_club_name || '',
                preferred_position: userData.preferred_position || '',
                skill_level: userData.skill_level || '',
            });
            // Mock loyalty data for now
            setLoyaltyData({
                curl_points: 150,
                tier: 'granite_rookie',
                tier_progress: { current_xp: 150, next_tier_xp: 500 },
                badges: [
                    { badge_id: 'welcome', badge_name: 'Welcome Badge' }
                ],
            });
        } catch (error) {
            console.error("Error loading user data", error);
            toast({
                title: "Error",
                description: "Could not load your profile. Please try again.",
                variant: "destructive"
            });
            // Redirect to home on error
            setTimeout(() => {
                window.location.href = createPageUrl('Home');
            }, 2000);
        } finally {
            setIsLoading(false);
        }
    }, [toast]);

    useEffect(() => {
        loadUserData();
    }, [loadUserData]);

    const handleEditToggle = () => {
        if (!isEditing && user) {
            // Entering edit mode, ensure form is synced with latest user data
            setEditForm({
                full_name: user.full_name || '',
                phone: user.phone || '',
                home_club_id: user.home_club_id || '',
                home_club_name: user.home_club_name || '',
                preferred_position: user.preferred_position || '',
                skill_level: user.skill_level || '',
            });
            setErrors({});
        }
        setIsEditing(!isEditing);
    };

    const validateForm = () => {
        const newErrors = {};
        if (!editForm.full_name) {
            newErrors.full_name = "Full name is required.";
        }
        // Basic phone validation example
        const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/im;
        if (editForm.phone && !phoneRegex.test(editForm.phone)) {
            newErrors.phone = "Please enter a valid phone number.";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = async () => {
        if (!validateForm()) {
            toast({
                title: "Validation Error",
                description: "Please fix the errors before saving.",
                variant: "destructive"
            });
            return;
        }

        setIsSaving(true);
        try {
            await User.updateMyUserData(editForm);
            toast({
                title: "Profile Updated",
                description: "Your changes have been saved successfully."
            });
            setIsEditing(false);
            // Refresh data from server to show the latest state
            await loadUserData(); 
        } catch (error) {
            console.error("Error saving user data", error);
            toast({
                title: "Save Failed",
                description: "There was a problem saving your profile. Please try again.",
                variant: "destructive"
            });
        } finally {
            setIsSaving(false);
        }
    };


    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    if (!user) {
        return (
            <div className="text-center py-10">
                <p>Could not load user profile. Redirecting...</p>
            </div>
        );
    }
    
    return (
        <div className="space-y-6 p-4 md:p-6">
            <ProfileHeader 
                user={user} 
                setUser={setUser} 
                loyaltyData={loyaltyData}
                isEditing={isEditing}
                setIsEditing={handleEditToggle}
            />
            <ProfileStats loyaltyData={loyaltyData} />

            {/* Quick Access to Tools */}
            {user && (
              <Card className="bg-brand-card-bg border-brand-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-brand-red" />
                    Your Tools
                  </CardTitle>
                  <CardDescription>Quick access to training and performance features</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <Button asChild variant="outline" className="h-auto py-4 flex flex-col gap-2">
                      <Link to={createPageUrl('PerformanceCenter')}>
                        <BarChart3 className="w-6 h-6 text-brand-red" />
                        <span className="text-sm">Performance Center</span>
                      </Link>
                    </Button>
                    <Button asChild variant="outline" className="h-auto py-4 flex flex-col gap-2">
                      <Link to={createPageUrl('ShotTracker')}>
                        <Target className="w-6 h-6 text-brand-red" />
                        <span className="text-sm">Shot Tracker</span>
                      </Link>
                    </Button>
                    <Button asChild variant="outline" className="h-auto py-4 flex flex-col gap-2">
                      <Link to={createPageUrl('SmartBroomHub')}>
                        <Zap className="w-6 h-6 text-brand-red" />
                        <span className="text-sm">Smart Broom</span>
                      </Link>
                    </Button>
                    {(user.user_type === 'athlete' || user.user_type === 'coach') && (
                      <Button asChild variant="outline" className="h-auto py-4 flex flex-col gap-2">
                        <Link to={createPageUrl('AthleteDashboard')}>
                          <Trophy className="w-6 h-6 text-brand-red" />
                          <span className="text-sm">Athlete Dashboard</span>
                        </Link>
                      </Button>
                    )}
                    {user.user_type === 'coach' && (
                      <Button asChild variant="outline" className="h-auto py-4 flex flex-col gap-2">
                        <Link to={createPageUrl('CoachDashboard')}>
                          <Users className="w-6 h-6 text-brand-red" />
                          <span className="text-sm">Coach Dashboard</span>
                        </Link>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="overview"><UserIcon className="w-4 h-4 mr-2" />Profile</TabsTrigger>
                    <TabsTrigger value="membership"><Shield className="w-4 h-4 mr-2" />Membership & Compliance</TabsTrigger>
                    <TabsTrigger value="notifications"><Bell className="w-4 h-4 mr-2" />Notifications</TabsTrigger>
                    <TabsTrigger value="security"><KeyRound className="w-4 h-4 mr-2" />Security</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="mt-6">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={isEditing ? 'editing' : 'viewing'}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.2 }}
                        >
                            <Suspense fallback={<Loader2 className="h-8 w-8 animate-spin mx-auto mt-8" />}>
                                {isEditing ? (
                                    <div className="space-y-6">
                                        <EditProfileForm 
                                            editForm={editForm} 
                                            setEditForm={setEditForm} 
                                            errors={errors} 
                                        />
                                        <div className="flex justify-end gap-3">
                                            <Button variant="outline" onClick={handleEditToggle} disabled={isSaving}>
                                                Cancel
                                            </Button>
                                            <Button onClick={handleSave} disabled={isSaving}>
                                                {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                                Save Changes
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <ProfileDetailsView user={user} />
                                )}
                            </Suspense>
                        </motion.div>
                    </AnimatePresence>
                </TabsContent>

                <TabsContent value="membership" className="mt-6">
                     <Suspense fallback={<Loader2 className="h-8 w-8 animate-spin mx-auto mt-8" />}>
                        <MembershipTab user={user} />
                    </Suspense>
                </TabsContent>
                <TabsContent value="notifications" className="mt-6">
                     <Suspense fallback={<Loader2 className="h-8 w-8 animate-spin mx-auto mt-8" />}>
                        <NotificationSettings />
                    </Suspense>
                </TabsContent>
                <TabsContent value="security" className="mt-6">
                    <Suspense fallback={<Loader2 className="h-8 w-8 animate-spin mx-auto mt-8" />}>
                        <SSOManager />
                    </Suspense>
                </TabsContent>
            </Tabs>
        </div>
    );
}
