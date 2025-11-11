
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Database, Copy, CheckCircle, Info, ChevronDown, ChevronUp, Search
} from 'lucide-react';
import { useToast } from '../hooks/use-toast';

const ENTITY_SCHEMAS = {
  // CLUB & ORGANIZATION DATA
  Club: {
    name: 'Club',
    category: 'Club & Organization',
    description: 'Curling club information and facilities',
    columns: [
      { name: 'id', type: 'STRING' },
      { name: 'name', type: 'STRING' },
      { name: 'description', type: 'STRING' },
      { name: 'location_address', type: 'STRING' },
      { name: 'location_city', type: 'STRING' },
      { name: 'location_province', type: 'STRING' },
      { name: 'location_postal_code', type: 'STRING' },
      { name: 'location_latitude', type: 'DECIMAL' },
      { name: 'location_longitude', type: 'DECIMAL' },
      { name: 'contact_info_email', type: 'STRING' },
      { name: 'contact_info_phone', type: 'STRING' },
      { name: 'contact_info_website', type: 'STRING' },
      { name: 'ma_region', type: 'STRING' },
      { name: 'membership_count', type: 'LONG' },
      { name: 'status', type: 'STRING' },
      { name: 'facilities_num_sheets', type: 'LONG' },
      { name: 'facilities_lounge', type: 'STRING' },
      { name: 'facilities_pro_shop', type: 'STRING' },
      { name: 'created_date', type: 'DATETIME' },
      { name: 'updated_date', type: 'DATETIME' },
      { name: 'created_by', type: 'STRING' }
    ]
  },
  ClubMetrics: {
    name: 'ClubMetrics',
    category: 'Club & Organization',
    description: 'Monthly club performance metrics and KPIs',
    columns: [
      { name: 'id', type: 'STRING' },
      { name: 'club_id', type: 'STRING' },
      { name: 'reporting_period', type: 'DATE' },
      { name: 'membership_stats_total_members', type: 'LONG' },
      { name: 'membership_stats_new_members', type: 'LONG' },
      { name: 'membership_stats_retained_members', type: 'LONG' },
      { name: 'membership_stats_youth_members', type: 'LONG' },
      { name: 'financial_health_revenue', type: 'DECIMAL' },
      { name: 'financial_health_expenses', type: 'DECIMAL' },
      { name: 'engagement_metrics_volunteer_hours', type: 'DECIMAL' },
      { name: 'engagement_metrics_events_hosted', type: 'LONG' },
      { name: 'engagement_metrics_curl_points_earned', type: 'LONG' },
      { name: 'ma_region', type: 'STRING' },
      { name: 'created_date', type: 'DATETIME' }
    ]
  },
  
  // USER & ENGAGEMENT DATA
  User: {
    name: 'User',
    category: 'User & Engagement',
    description: 'User profiles and demographics (anonymized)',
    columns: [
      { name: 'id', type: 'STRING' },
      { name: 'user_type', type: 'STRING' },
      { name: 'ma_region', type: 'STRING' },
      { name: 'home_club_id', type: 'STRING' },
      { name: 'home_club_name', type: 'STRING' },
      { name: 'skill_level', type: 'STRING' },
      { name: 'hp_pathway_stage', type: 'STRING' },
      { name: 'safe_sport_status', type: 'STRING' },
      { name: 'coaching_status', type: 'STRING' },
      { name: 'created_date', type: 'DATETIME' },
      { name: 'last_login', type: 'DATETIME' }
    ]
  },
  LoyaltyProgram: {
    name: 'LoyaltyProgram',
    category: 'User & Engagement',
    description: 'User XP and engagement metrics (Granite Circle)',
    columns: [
      { name: 'id', type: 'STRING' },
      { name: 'user_id', type: 'STRING' },
      { name: 'curl_points', type: 'LONG' },
      { name: 'tier', type: 'STRING' },
      { name: 'tier_progress_current_xp', type: 'LONG' },
      { name: 'total_earned_points', type: 'LONG' },
      { name: 'total_redeemed_points', type: 'LONG' },
      { name: 'fan_pass_status', type: 'STRING' },
      { name: 'created_date', type: 'DATETIME' },
      { name: 'updated_date', type: 'DATETIME' }
    ]
  },
  PointTransaction: {
    name: 'PointTransaction',
    category: 'User & Engagement',
    description: 'XP point transactions and engagement activities',
    columns: [
      { name: 'id', type: 'STRING' },
      { name: 'user_id', type: 'STRING' },
      { name: 'points_amount', type: 'LONG' },
      { name: 'transaction_type', type: 'STRING' },
      { name: 'description', type: 'STRING' },
      { name: 'reference_id', type: 'STRING' },
      { name: 'source', type: 'STRING' },
      { name: 'multiplier', type: 'DECIMAL' },
      { name: 'created_date', type: 'DATETIME' }
    ]
  },

  // EVENT DATA
  Event: {
    name: 'Event',
    category: 'Events & Competitions',
    description: 'Curling events and competitions',
    columns: [
      { name: 'id', type: 'STRING' },
      { name: 'name', type: 'STRING' },
      { name: 'start_date', type: 'DATE' },
      { name: 'end_date', type: 'DATE' },
      { name: 'venue_name', type: 'STRING' },
      { name: 'venue_city', type: 'STRING' },
      { name: 'website', type: 'STRING' },
      { name: 'registration_fee', type: 'DECIMAL' },
      { name: 'curling_io_id', type: 'STRING' },
      { name: 'curlingzone_id', type: 'STRING' },
      { name: 'is_patch_party', type: 'STRING' },
      { name: 'venue_theme', type: 'STRING' },
      { name: 'created_date', type: 'DATETIME' },
      { name: 'updated_date', type: 'DATETIME' }
    ]
  },
  EventPlan: {
    name: 'EventPlan',
    category: 'Events & Competitions',
    description: 'Event planning and operational tracking',
    columns: [
      { name: 'id', type: 'STRING' },
      { name: 'event_id', type: 'STRING' },
      { name: 'event_name', type: 'STRING' },
      { name: 'event_date', type: 'DATE' },
      { name: 'venue', type: 'STRING' },
      { name: 'event_type', type: 'STRING' },
      { name: 'status', type: 'STRING' },
      { name: 'completion_stats_total_tasks', type: 'LONG' },
      { name: 'completion_stats_completed_tasks', type: 'LONG' },
      { name: 'completion_stats_overdue_tasks', type: 'LONG' },
      { name: 'budget_info_total_budget', type: 'DECIMAL' },
      { name: 'budget_info_spent_budget', type: 'DECIMAL' },
      { name: 'created_date', type: 'DATETIME' }
    ]
  },

  // FINANCIAL DATA
  Donation: {
    name: 'Donation',
    category: 'Financial & Revenue',
    description: 'FTLOC donations and fundraising',
    columns: [
      { name: 'id', type: 'STRING' },
      { name: 'amount', type: 'DECIMAL' },
      { name: 'type', type: 'STRING' },
      { name: 'donor_name', type: 'STRING' },
      { name: 'donor_email', type: 'STRING' },
      { name: 'anonymous', type: 'STRING' },
      { name: 'payment_status', type: 'STRING' },
      { name: 'campaign', type: 'STRING' },
      { name: 'category', type: 'STRING' },
      { name: 'ma_region', type: 'STRING' },
      { name: 'created_date', type: 'DATETIME' }
    ]
  },
  FinancialTransaction: {
    name: 'FinancialTransaction',
    category: 'Financial & Revenue',
    description: 'All financial transactions and revenue streams',
    columns: [
      { name: 'id', type: 'STRING' },
      { name: 'transaction_type', type: 'STRING' },
      { name: 'category', type: 'STRING' },
      { name: 'amount', type: 'DECIMAL' },
      { name: 'currency', type: 'STRING' },
      { name: 'description', type: 'STRING' },
      { name: 'payment_method', type: 'STRING' },
      { name: 'payment_status', type: 'STRING' },
      { name: 'approval_status', type: 'STRING' },
      { name: 'user_id', type: 'STRING' },
      { name: 'project_id', type: 'STRING' },
      { name: 'created_date', type: 'DATETIME' },
      { name: 'payment_date', type: 'DATE' }
    ]
  },
  Purchase: {
    name: 'Purchase',
    category: 'Financial & Revenue',
    description: 'Product purchases and subscriptions',
    columns: [
      { name: 'id', type: 'STRING' },
      { name: 'user_id', type: 'STRING' },
      { name: 'product_id', type: 'STRING' },
      { name: 'product_name', type: 'STRING' },
      { name: 'product_type', type: 'STRING' },
      { name: 'amount', type: 'DECIMAL' },
      { name: 'currency', type: 'STRING' },
      { name: 'status', type: 'STRING' },
      { name: 'payment_method', type: 'STRING' },
      { name: 'created_date', type: 'DATETIME' }
    ]
  },
  Subscription: {
    name: 'Subscription',
    category: 'Financial & Revenue',
    description: 'Fan Pass and Curling+ subscriptions',
    columns: [
      { name: 'id', type: 'STRING' },
      { name: 'user_id', type: 'STRING' },
      { name: 'subscription_type', type: 'STRING' },
      { name: 'plan_type', type: 'STRING' },
      { name: 'status', type: 'STRING' },
      { name: 'start_date', type: 'DATETIME' },
      { name: 'expiry_date', type: 'DATETIME' },
      { name: 'auto_renews', type: 'STRING' },
      { name: 'created_date', type: 'DATETIME' }
    ]
  },

  // SPONSORSHIP DATA
  SponsorCampaign: {
    name: 'SponsorCampaign',
    category: 'Sponsorship & Marketing',
    description: 'Sponsor quest campaigns and ROI tracking',
    columns: [
      { name: 'id', type: 'STRING' },
      { name: 'name', type: 'STRING' },
      { name: 'sponsor_name', type: 'STRING' },
      { name: 'description', type: 'STRING' },
      { name: 'quest_type', type: 'STRING' },
      { name: 'xp_reward', type: 'LONG' },
      { name: 'start_date', type: 'DATE' },
      { name: 'end_date', type: 'DATE' },
      { name: 'is_active', type: 'STRING' },
      { name: 'impressions', type: 'LONG' },
      { name: 'completions', type: 'LONG' },
      { name: 'created_date', type: 'DATETIME' }
    ]
  },
  SponsorDeal: {
    name: 'SponsorDeal',
    category: 'Sponsorship & Marketing',
    description: 'Sponsorship deals and pipeline',
    columns: [
      { name: 'id', type: 'STRING' },
      { name: 'deal_name', type: 'STRING' },
      { name: 'company_name', type: 'STRING' },
      { name: 'deal_value', type: 'DECIMAL' },
      { name: 'tier', type: 'STRING' },
      { name: 'stage', type: 'STRING' },
      { name: 'probability_percent', type: 'LONG' },
      { name: 'expected_close_date', type: 'DATE' },
      { name: 'owner', type: 'STRING' },
      { name: 'ma_region', type: 'STRING' },
      { name: 'created_date', type: 'DATETIME' }
    ]
  },
  SponsorContract: {
    name: 'SponsorContract',
    category: 'Sponsorship & Marketing',
    description: 'Active sponsorship contracts and deliverables',
    columns: [
      { name: 'id', type: 'STRING' },
      { name: 'deal_id', type: 'STRING' },
      { name: 'sponsor_name', type: 'STRING' },
      { name: 'contract_value', type: 'DECIMAL' },
      { name: 'start_date', type: 'DATE' },
      { name: 'end_date', type: 'DATE' },
      { name: 'payment_status', type: 'STRING' },
      { name: 'status', type: 'STRING' },
      { name: 'ma_region', type: 'STRING' },
      { name: 'created_date', type: 'DATETIME' }
    ]
  },
  MarketingCampaign: {
    name: 'MarketingCampaign',
    category: 'Sponsorship & Marketing',
    description: 'Marketing campaigns and performance',
    columns: [
      { name: 'id', type: 'STRING' },
      { name: 'campaign_name', type: 'STRING' },
      { name: 'campaign_type', type: 'STRING' },
      { name: 'status', type: 'STRING' },
      { name: 'priority', type: 'STRING' },
      { name: 'target_date', type: 'DATE' },
      { name: 'end_date', type: 'DATE' },
      { name: 'budget_allocated', type: 'DECIMAL' },
      { name: 'budget_spent', type: 'DECIMAL' },
      { name: 'metrics_impressions', type: 'LONG' },
      { name: 'metrics_engagement', type: 'LONG' },
      { name: 'metrics_clicks', type: 'LONG' },
      { name: 'metrics_conversions', type: 'LONG' },
      { name: 'created_date', type: 'DATETIME' }
    ]
  },

  // VOLUNTEER DATA
  Volunteer: {
    name: 'Volunteer',
    category: 'Volunteer & Community',
    description: 'Volunteer profiles and activity',
    columns: [
      { name: 'id', type: 'STRING' },
      { name: 'full_name', type: 'STRING' },
      { name: 'email', type: 'STRING' },
      { name: 'ma_region', type: 'STRING' },
      { name: 'source_system', type: 'STRING' },
      { name: 'compliance_respect_in_sport', type: 'STRING' },
      { name: 'compliance_policy_signed', type: 'STRING' },
      { name: 'compliance_background_check', type: 'STRING' },
      { name: 'xp_stats_total_xp', type: 'LONG' },
      { name: 'xp_stats_recognition_tier', type: 'STRING' },
      { name: 'last_active_date', type: 'DATE' },
      { name: 'created_date', type: 'DATETIME' }
    ]
  },
  VolunteerCampaign: {
    name: 'VolunteerCampaign',
    category: 'Volunteer & Community',
    description: 'Volunteer recruitment campaigns',
    columns: [
      { name: 'id', type: 'STRING' },
      { name: 'name', type: 'STRING' },
      { name: 'event_name', type: 'STRING' },
      { name: 'target_region', type: 'STRING' },
      { name: 'status', type: 'STRING' },
      { name: 'applications_received', type: 'LONG' },
      { name: 'start_date', type: 'DATE' },
      { name: 'end_date', type: 'DATE' },
      { name: 'created_date', type: 'DATETIME' }
    ]
  },
  CommunityProgram: {
    name: 'CommunityProgram',
    category: 'Volunteer & Community',
    description: 'Community programs and initiatives',
    columns: [
      { name: 'id', type: 'STRING' },
      { name: 'name', type: 'STRING' },
      { name: 'program_type', type: 'STRING' },
      { name: 'focus_area', type: 'STRING' },
      { name: 'ma_region', type: 'STRING' },
      { name: 'participant_count', type: 'LONG' },
      { name: 'start_date', type: 'DATE' },
      { name: 'end_date', type: 'DATE' },
      { name: 'status', type: 'STRING' },
      { name: 'created_date', type: 'DATETIME' }
    ]
  },

  // YOUTH & DEVELOPMENT
  HitDrawTap: {
    name: 'HitDrawTap',
    category: 'Youth & Development',
    description: 'Youth skill assessment scores',
    columns: [
      { name: 'id', type: 'STRING' },
      { name: 'user_id', type: 'STRING' },
      { name: 'age_division', type: 'STRING' },
      { name: 'totals_hit_total', type: 'LONG' },
      { name: 'totals_draw_total', type: 'LONG' },
      { name: 'totals_tap_total', type: 'LONG' },
      { name: 'totals_grand_total', type: 'LONG' },
      { name: 'event_id', type: 'STRING' },
      { name: 'club_id', type: 'STRING' },
      { name: 'coach_verified', type: 'STRING' },
      { name: 'is_personal_best', type: 'STRING' },
      { name: 'ma_region', type: 'STRING' },
      { name: 'submission_date', type: 'DATE' },
      { name: 'created_date', type: 'DATETIME' }
    ]
  },
  HDTEvent: {
    name: 'HDTEvent',
    category: 'Youth & Development',
    description: 'Hit Draw Tap competition events',
    columns: [
      { name: 'id', type: 'STRING' },
      { name: 'name', type: 'STRING' },
      { name: 'event_type', type: 'STRING' },
      { name: 'start_date', type: 'DATE' },
      { name: 'end_date', type: 'DATE' },
      { name: 'location_city', type: 'STRING' },
      { name: 'location_province', type: 'STRING' },
      { name: 'ma_region', type: 'STRING' },
      { name: 'max_participants', type: 'LONG' },
      { name: 'registered_participants', type: 'LONG' },
      { name: 'registration_fee', type: 'DECIMAL' },
      { name: 'is_active', type: 'STRING' },
      { name: 'created_date', type: 'DATETIME' }
    ]
  },
  NextGenAthlete: {
    name: 'NextGenAthlete',
    category: 'Youth & Development',
    description: 'NextGen program participants and progress',
    columns: [
      { name: 'id', type: 'STRING' },
      { name: 'athlete_id', type: 'STRING' },
      { name: 'program_year', type: 'LONG' },
      { name: 'current_status', type: 'STRING' },
      { name: 'mentor_coach_id', type: 'STRING' },
      { name: 'hp_center_id', type: 'STRING' },
      { name: 'assessment_scores_technical_skills', type: 'LONG' },
      { name: 'assessment_scores_tactical_awareness', type: 'LONG' },
      { name: 'assessment_scores_physical_fitness', type: 'LONG' },
      { name: 'assessment_scores_mental_performance', type: 'LONG' },
      { name: 'assessment_scores_leadership', type: 'LONG' },
      { name: 'created_date', type: 'DATETIME' }
    ]
  },

  // HIGH PERFORMANCE
  NationalTeam: {
    name: 'NationalTeam',
    category: 'High Performance',
    description: 'National team rosters and info',
    columns: [
      { name: 'id', type: 'STRING' },
      { name: 'team_name', type: 'STRING' },
      { name: 'display_name', type: 'STRING' },
      { name: 'season', type: 'STRING' },
      { name: 'skip_id', type: 'STRING' },
      { name: 'third_id', type: 'STRING' },
      { name: 'second_id', type: 'STRING' },
      { name: 'lead_id', type: 'STRING' },
      { name: 'coach_id', type: 'STRING' },
      { name: 'hp_center_id', type: 'STRING' },
      { name: 'selection_date', type: 'DATE' },
      { name: 'is_active', type: 'STRING' },
      { name: 'world_ranking', type: 'LONG' },
      { name: 'created_date', type: 'DATETIME' }
    ]
  },
  Achievement: {
    name: 'Achievement',
    category: 'High Performance',
    description: 'Athlete achievements and medals',
    columns: [
      { name: 'id', type: 'STRING' },
      { name: 'athlete_id', type: 'STRING' },
      { name: 'team_id', type: 'STRING' },
      { name: 'achievement_type', type: 'STRING' },
      { name: 'event_name', type: 'STRING' },
      { name: 'event_level', type: 'STRING' },
      { name: 'medal', type: 'STRING' },
      { name: 'year', type: 'LONG' },
      { name: 'location', type: 'STRING' },
      { name: 'verified', type: 'STRING' },
      { name: 'is_featured', type: 'STRING' },
      { name: 'created_date', type: 'DATETIME' }
    ]
  },
  CTRSRanking: {
    name: 'CTRSRanking',
    category: 'High Performance',
    description: 'Canadian Team Ranking System data',
    columns: [
      { name: 'id', type: 'STRING' },
      { name: 'team_name', type: 'STRING' },
      { name: 'skip_name', type: 'STRING' },
      { name: 'category', type: 'STRING' },
      { name: 'rank', type: 'LONG' },
      { name: 'points', type: 'DECIMAL' },
      { name: 'events_played', type: 'LONG' },
      { name: 'province', type: 'STRING' },
      { name: 'previous_rank', type: 'LONG' },
      { name: 'season', type: 'STRING' },
      { name: 'last_updated', type: 'DATETIME' },
      { name: 'created_date', type: 'DATETIME' }
    ]
  },
  SmartBroomSession: {
    name: 'SmartBroomSession',
    category: 'High Performance',
    description: 'Smart Broom training session data',
    columns: [
      { name: 'id', type: 'STRING' },
      { name: 'user_id', type: 'STRING' },
      { name: 'session_date', type: 'DATETIME' },
      { name: 'session_duration_minutes', type: 'LONG' },
      { name: 'total_sweeps', type: 'LONG' },
      { name: 'performance_metrics_avg_pressure', type: 'DECIMAL' },
      { name: 'performance_metrics_max_pressure', type: 'DECIMAL' },
      { name: 'performance_metrics_rhythm_score', type: 'LONG' },
      { name: 'performance_metrics_overall_score', type: 'LONG' },
      { name: 'session_type', type: 'STRING' },
      { name: 'is_personal_best', type: 'STRING' },
      { name: 'created_date', type: 'DATETIME' }
    ]
  },

  // KNOWLEDGE & TRAINING
  KnowledgeArticle: {
    name: 'KnowledgeArticle',
    category: 'Knowledge & Training',
    description: 'Knowledge base articles and resources',
    columns: [
      { name: 'id', type: 'STRING' },
      { name: 'title', type: 'STRING' },
      { name: 'category', type: 'STRING' },
      { name: 'content_type', type: 'STRING' },
      { name: 'status', type: 'STRING' },
      { name: 'difficulty_level', type: 'STRING' },
      { name: 'xp_reward', type: 'LONG' },
      { name: 'is_featured', type: 'STRING' },
      { name: 'view_count', type: 'LONG' },
      { name: 'created_by', type: 'STRING' },
      { name: 'author_name', type: 'STRING' },
      { name: 'created_date', type: 'DATETIME' }
    ]
  },
  KnowledgeProgress: {
    name: 'KnowledgeProgress',
    category: 'Knowledge & Training',
    description: 'User learning progress tracking',
    columns: [
      { name: 'id', type: 'STRING' },
      { name: 'user_id', type: 'STRING' },
      { name: 'article_id', type: 'STRING' },
      { name: 'status', type: 'STRING' },
      { name: 'completion_date', type: 'DATETIME' },
      { name: 'time_spent_minutes', type: 'LONG' },
      { name: 'rating', type: 'LONG' },
      { name: 'created_date', type: 'DATETIME' }
    ]
  },
  SafeSportCompletion: {
    name: 'SafeSportCompletion',
    category: 'Knowledge & Training',
    description: 'Safe Sport training completion tracking',
    columns: [
      { name: 'id', type: 'STRING' },
      { name: 'user_id', type: 'STRING' },
      { name: 'training_id', type: 'STRING' },
      { name: 'completion_date', type: 'DATETIME' },
      { name: 'expiry_date', type: 'DATETIME' },
      { name: 'score', type: 'LONG' },
      { name: 'status', type: 'STRING' },
      { name: 'ma_region', type: 'STRING' },
      { name: 'user_role', type: 'STRING' },
      { name: 'completion_method', type: 'STRING' },
      { name: 'created_date', type: 'DATETIME' }
    ]
  },

  // STREAMING & CONTENT
  StreamingEvent: {
    name: 'StreamingEvent',
    category: 'Streaming & Content',
    description: 'Curling+ streaming events and viewership',
    columns: [
      { name: 'id', type: 'STRING' },
      { name: 'name', type: 'STRING' },
      { name: 'event_type', type: 'STRING' },
      { name: 'start_time', type: 'DATETIME' },
      { name: 'end_time', type: 'DATETIME' },
      { name: 'ppv_price', type: 'DECIMAL' },
      { name: 'is_featured', type: 'STRING' },
      { name: 'created_date', type: 'DATETIME' }
    ]
  },

  // OPERATIONAL DATA
  Incident: {
    name: 'Incident',
    category: 'Operations & Governance',
    description: 'Case management and incident tracking',
    columns: [
      { name: 'id', type: 'STRING' },
      { name: 'title', type: 'STRING' },
      { name: 'category', type: 'STRING' },
      { name: 'sub_category', type: 'STRING' },
      { name: 'status', type: 'STRING' },
      { name: 'priority', type: 'STRING' },
      { name: 'severity', type: 'STRING' },
      { name: 'assigned_to_id', type: 'STRING' },
      { name: 'assigned_department', type: 'STRING' },
      { name: 'ma_region', type: 'STRING' },
      { name: 'club_id', type: 'STRING' },
      { name: 'source', type: 'STRING' },
      { name: 'is_confidential', type: 'STRING' },
      { name: 'escalation_level', type: 'LONG' },
      { name: 'created_date', type: 'DATETIME' }
    ]
  },
  Task: {
    name: 'Task',
    category: 'Operations & Governance',
    description: 'Staff task management and tracking',
    columns: [
      { name: 'id', type: 'STRING' },
      { name: 'title', type: 'STRING' },
      { name: 'status', type: 'STRING' },
      { name: 'priority', type: 'STRING' },
      { name: 'assigned_to', type: 'STRING' },
      { name: 'assigned_by', type: 'STRING' },
      { name: 'project_id', type: 'STRING' },
      { name: 'due_date', type: 'DATETIME' },
      { name: 'estimated_hours', type: 'DECIMAL' },
      { name: 'actual_hours', type: 'DECIMAL' },
      { name: 'department', type: 'STRING' },
      { name: 'created_date', type: 'DATETIME' }
    ]
  },
  Project: {
    name: 'Project',
    category: 'Operations & Governance',
    description: 'Project management and delivery tracking',
    columns: [
      { name: 'id', type: 'STRING' },
      { name: 'name', type: 'STRING' },
      { name: 'status', type: 'STRING' },
      { name: 'priority', type: 'STRING' },
      { name: 'project_manager', type: 'STRING' },
      { name: 'start_date', type: 'DATE' },
      { name: 'end_date', type: 'DATE' },
      { name: 'budget', type: 'DECIMAL' },
      { name: 'spent', type: 'DECIMAL' },
      { name: 'progress_percentage', type: 'LONG' },
      { name: 'department', type: 'STRING' },
      { name: 'created_date', type: 'DATETIME' }
    ]
  },
  ComplianceItem: {
    name: 'ComplianceItem',
    category: 'Operations & Governance',
    description: 'Compliance requirements and deadlines',
    columns: [
      { name: 'id', type: 'STRING' },
      { name: 'title', type: 'STRING' },
      { name: 'compliance_type', type: 'STRING' },
      { name: 'regulatory_body', type: 'STRING' },
      { name: 'due_date', type: 'DATE' },
      { name: 'frequency', type: 'STRING' },
      { name: 'risk_level', type: 'STRING' },
      { name: 'status', type: 'STRING' },
      { name: 'assigned_to', type: 'STRING' },
      { name: 'department', type: 'STRING' },
      { name: 'created_date', type: 'DATETIME' }
    ]
  },
  FormSubmission: {
    name: 'FormSubmission',
    category: 'Operations & Governance',
    description: 'Dynamic form submissions and workflows',
    columns: [
      { name: 'id', type: 'STRING' },
      { name: 'form_id', type: 'STRING' },
      { name: 'form_title', type: 'STRING' },
      { name: 'form_version', type: 'LONG' },
      { name: 'submitter_id', type: 'STRING' },
      { name: 'submitter_email', type: 'STRING' },
      { name: 'status', type: 'STRING' },
      { name: 'ma_region', type: 'STRING' },
      { name: 'club_id', type: 'STRING' },
      { name: 'priority', type: 'STRING' },
      { name: 'created_date', type: 'DATETIME' }
    ]
  },

  // SURVEY & RESEARCH
  SurveySubmission: {
    name: 'SurveySubmission',
    category: 'Research & Analytics',
    description: 'Club survey submissions and benchmarking',
    columns: [
      { name: 'id', type: 'STRING' },
      { name: 'club_id', type: 'STRING' },
      { name: 'club_name', type: 'STRING' },
      { name: 'year', type: 'LONG' },
      { name: 'is_complete', type: 'STRING' },
      { name: 'completion_percentage', type: 'LONG' },
      { name: 'submission_date', type: 'DATETIME' },
      { name: 'ma_region', type: 'STRING' },
      { name: 'created_date', type: 'DATETIME' }
    ]
  }
};

const SchemaCard = ({ entityName, schema, onCopy }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card className="bg-brand-card-bg border-brand-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Database className="w-5 h-5 text-brand-red" />
            <div>
              <CardTitle className="text-brand-text-primary">{schema.name}</CardTitle>
              <p className="text-sm text-brand-text-secondary">{schema.description}</p>
              <Badge variant="outline" className="mt-1">{schema.category}</Badge>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline">{schema.columns.length} fields</Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </CardHeader>
      {expanded && (
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-brand-text-primary">Field Definitions</h4>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onCopy(entityName, schema)} // Changed to pass entityName and schema
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Schema
                </Button>
              </div>
              <div className="bg-brand-charcoal rounded p-4 max-h-96 overflow-y-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left border-b border-brand-border">
                      <th className="pb-2 text-brand-text-secondary">Column Name</th>
                      <th className="pb-2 text-brand-text-secondary">Data Type</th>
                    </tr>
                  </thead>
                  <tbody className="font-mono text-xs">
                    {schema.columns.map((col, idx) => (
                      <tr key={idx} className="border-b border-brand-border/30">
                        <td className="py-2 text-brand-text-primary">{col.name}</td>
                        <td className="py-2 text-blue-400">{col.type}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            <Alert className="bg-blue-900/20 border-blue-500/50">
              <Info className="w-4 h-4" />
              <AlertDescription>
                <strong>DOMO Dataset Creation:</strong> When creating a dataset in DOMO, use these exact field names and data types for seamless integration with The Button.
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default function DOMOSchemaManager() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { toast } = useToast();

  const categories = ['all', ...new Set(Object.values(ENTITY_SCHEMAS).map(s => s.category))];

  const filteredSchemas = Object.entries(ENTITY_SCHEMAS).filter(([name, schema]) => {
    const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         schema.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || schema.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const copySchema = (entityName, schema) => {
    const schemaText = JSON.stringify(schema.columns, null, 2);
    navigator.clipboard.writeText(schemaText);
    toast({
      title: "Schema Copied",
      description: `${entityName} schema copied to clipboard`,
    });
  };

  return (
    <div className="space-y-6">
      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-6 h-6 text-brand-red" />
            DOMO Schema Reference
          </CardTitle>
          <p className="text-sm text-brand-text-secondary">
            Reference schemas for all The Button entities. Use these when creating datasets in DOMO 
            or configuring external data sources to match our structure.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              <strong>Best Practice:</strong> When creating datasets in DOMO, use "Create New Dataset" 
              in the sync tab - it will automatically generate the correct schema from live data.
              This reference is useful for manual setup or external integrations.
            </AlertDescription>
          </Alert>

          {/* Search and Filter */}
          <div className="flex gap-3">
            <div className="flex-1">
              <Input
                placeholder="Search entities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-brand-charcoal border-brand-border"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-64">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map(cat => (
                  <SelectItem key={cat} value={cat}>
                    {cat === 'all' ? 'All Categories' : cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="text-sm text-brand-text-secondary">
            Showing {filteredSchemas.length} of {Object.keys(ENTITY_SCHEMAS).length} entities
          </div>

          {/* Schema Cards */}
          <div className="space-y-3">
            {filteredSchemas.map(([entityName, schema]) => (
              <SchemaCard 
                key={entityName} 
                entityName={entityName} 
                schema={schema} 
                onCopy={copySchema}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
