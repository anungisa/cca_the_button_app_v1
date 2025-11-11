# Entity Catalog

Complete list of all Base44 entities in the legacy system with migration mapping to Supabase tables.

**Total Entities**: 166

---

## Entity Categories

### 1. Core Entities (8)
| Base44 Entity | Description | Migration Priority | Supabase Table |
|---------------|-------------|-------------------|----------------|
| `User` | User accounts | **Critical** | `user_profiles` |
| `Club` | Curling clubs | **High** | `clubs` |
| `Event` | Events and competitions | **High** | `events` |
| `Game` | Individual games | **High** | `games` |
| `Team` | Teams and rosters | **High** | `teams` |
| `Notification` | Push notifications | **High** | `notifications` |
| `Comment` | Comments system | **Medium** | `comments` |
| `Task` | Task management | **Medium** | `tasks` |

### 2. Loyalty & Gamification (15)
| Base44 Entity | Description | Migration Priority | Supabase Table |
|---------------|-------------|-------------------|----------------|
| `LoyaltyProgram` | Points programs | **High** | `loyalty_programs` |
| `PointTransaction` | Point awards/redemptions | **High** | `point_transactions` |
| `Reward` | Available rewards | **High** | `rewards` |
| `ClubLoyalty` | Club-specific programs | **High** | `club_loyalty_programs` |
| `GeoChallenge` | Location challenges | **Medium** | `geo_challenges` |
| `MysteryBox` | Random rewards | **Medium** | `mystery_boxes` |
| `XPChallenge` | Experience challenges | **Medium** | `xp_challenges` |
| `UserChallengeProgress` | Challenge tracking | **Medium** | `user_challenge_progress` |
| `KudosTransaction` | Social recognition | **Medium** | `kudos_transactions` |
| `UserPrediction` | Game predictions | **Low** | `user_predictions` |
| `SponsorQuest` | Sponsor challenges | **Medium** | `sponsor_quests` |
| `UserStreak` | Activity streaks | **Low** | `user_streaks` |
| `UserMilestone` | Achievements | **Medium** | `user_milestones` |
| `Achievement` | Achievement definitions | **Medium** | `achievements` |
| `Pledge` | User pledges | **Low** | `pledges` |

### 3. Social & Community (10)
| Base44 Entity | Description | Migration Priority | Supabase Table |
|---------------|-------------|-------------------|----------------|
| `SocialThread` | Discussion threads | **High** | `social_threads` |
| `CommunityPost` | Community content | **High** | `community_posts` |
| `SocialPost` | Social posts | **High** | `social_posts` |
| `UserMessage` | Direct messages | **High** | `user_messages` |
| `ActivityFeed` | Activity streams | **Medium** | `activity_feeds` |
| `SocialConnection` | Friend connections | **Medium** | `social_connections` |
| `CommunityProgram` | Community initiatives | **Low** | `community_programs` |
| `LiveInteraction` | Live event interactions | **Medium** | `live_interactions` |
| `LivePoll` | Live polls | **Medium** | `live_polls` |
| `ExternalAuth` | OAuth connections | **Low** | `external_auth` |

### 4. High Performance & Training (20)
| Base44 Entity | Description | Migration Priority | Supabase Table |
|---------------|-------------|-------------------|----------------|
| `HighPerformanceLog` | Training logs | **High** | `hp_logs` |
| `PerformanceBenchmark` | Performance standards | **High** | `performance_benchmarks` |
| `HighPerformanceContent` | Training materials | **Medium** | `hp_content` |
| `SmartBroomSession` | Smart broom data | **High** | `smart_broom_sessions` |
| `ShotTrackerLog` | Shot tracking | **High** | `shot_tracker_logs` |
| `DrillLog` | Drill logs | **Medium** | `drill_logs` |
| `DrillLibrary` | Drill templates | **Medium** | `drill_library` |
| `AthleteJourney` | Athlete progress | **Medium** | `athlete_journeys` |
| `CoachPerformance` | Coach stats | **Medium** | `coach_performance` |
| `UnifiedGameLog` | Game performance | **High** | `unified_game_logs` |
| `CoachPerformanceLog` | Coach logs | **Medium** | `coach_performance_logs` |
| `GameReport` | Game reports | **Medium** | `game_reports` |
| `CoachFeedback` | Coach feedback | **Medium** | `coach_feedback` |
| `VideoRef` | Video references | **Medium** | `video_refs` |
| `UnifiedPerformanceLog` | Combined perf logs | **High** | `unified_performance_logs` |
| `NationalTeam` | National teams | **High** | `national_teams` |
| `HPCenter` | HP training centers | **Medium** | `hp_centers` |
| `NextGenAthlete` | Youth athletes | **Medium** | `next_gen_athletes` |
| `CTRSRanking` | CTRS rankings | **High** | `ctrs_rankings` |
| `AIInsight` | AI-generated insights | **Low** | `ai_insights` |

### 5. Events & Streaming (5)
| Base44 Entity | Description | Migration Priority | Supabase Table |
|---------------|-------------|-------------------|----------------|
| `EventPlan` | Event planning | **High** | `event_plans` |
| `EventPlanTemplate` | Plan templates | **Medium** | `event_plan_templates` |
| `EventPlanActivity` | Plan tasks | **High** | `event_plan_activities` |
| `StreamingEvent` | Live streams | **High** | `streaming_events` |
| `EventStandings` | Event standings | **High** | `event_standings` |

### 6. Sponsorship & Marketing (12)
| Base44 Entity | Description | Migration Priority | Supabase Table |
|---------------|-------------|-------------------|----------------|
| `SponsorCampaign` | Sponsor activations | **High** | `sponsor_campaigns` |
| `SponsorProspect` | Sales pipeline | **Medium** | `sponsor_prospects` |
| `SponsorDeal` | Agreements | **High** | `sponsor_deals` |
| `SponsorContract` | Legal contracts | **High** | `sponsor_contracts` |
| `SponsorAsset` | Deliverables | **Medium** | `sponsor_assets` |
| `MarketingCampaign` | Marketing efforts | **Medium** | `marketing_campaigns` |
| `PressRelease` | Media communications | **Low** | `press_releases` |
| `MediaContact` | Press contacts | **Low** | `media_contacts` |
| `BrandAsset` | Brand materials | **Low** | `brand_assets` |
| `CommunicationAsset` | Comms materials | **Low** | `communication_assets` |
| `StakeholderEngagement` | Stakeholder tracking | **Low** | `stakeholder_engagement` |
| `CRMIntegration` | CRM data sync | **Low** | `crm_integrations` |

### 7. Knowledge & Content (8)
| Base44 Entity | Description | Migration Priority | Supabase Table |
|---------------|-------------|-------------------|----------------|
| `KnowledgeArticle` | Educational content | **High** | `knowledge_articles` |
| `KnowledgeProgress` | Learning tracking | **Medium** | `knowledge_progress` |
| `ArticleCategory` | Content categories | **Medium** | `article_categories` |
| `ArticleFeedback` | Article ratings | **Low** | `article_feedback` |
| `TriviaQuestion` | Trivia questions | **Medium** | `trivia_questions` |
| `TriviaChallenge` | Trivia games | **Medium** | `trivia_challenges` |
| `TriviaSession` | Trivia sessions | **Medium** | `trivia_sessions` |
| `TriviaLeaderboard` | Trivia rankings | **Medium** | `trivia_leaderboards` |

### 8. Club Management (3)
| Base44 Entity | Description | Migration Priority | Supabase Table |
|---------------|-------------|-------------------|----------------|
| `ClubMetrics` | Club analytics | **High** | `club_metrics` |
| `ClubLicense` | Club subscriptions | **High** | `club_licenses` |
| `Patch` | Club patches/badges | **Low** | `patches` |

### 9. Youth & Development (3)
| Base44 Entity | Description | Migration Priority | Supabase Table |
|---------------|-------------|-------------------|----------------|
| `YouthInitiative` | Youth programs | **Medium** | `youth_initiatives` |
| `ScholarshipApplication` | Scholarships | **Medium** | `scholarship_applications` |
| `GrantApplication` | Grant requests | **Medium** | `grant_applications` |

### 10. SafeSport & Compliance (10)
| Base44 Entity | Description | Migration Priority | Supabase Table |
|---------------|-------------|-------------------|----------------|
| `SafeSportPolicy` | Safety policies | **High** | `safesport_policies` |
| `SafeSportTraining` | Training modules | **High** | `safesport_training` |
| `SafeSportCompletion` | Training completion | **High** | `safesport_completion` |
| `SafeSportCommunication` | SafeSport comms | **Medium** | `safesport_communications` |
| `Consent` | User consents | **High** | `consents` |
| `ComplianceItem` | Compliance tracking | **High** | `compliance_items` |
| `MACompliance` | Member assoc compliance | **Medium** | `ma_compliance` |
| `DataPrivacyAudit` | Privacy audits | **Medium** | `data_privacy_audits` |
| `PolicyAcknowledgment` | Policy acceptance | **High** | `policy_acknowledgments` |
| `Incident` | Incident reports | **High** | `incidents` |

### 11. Governance (7)
| Base44 Entity | Description | Migration Priority | Supabase Table |
|---------------|-------------|-------------------|----------------|
| `GovernancePolicy` | Governance docs | **Medium** | `governance_policies` |
| `BoardMember` | Board directory | **Low** | `board_members` |
| `GovernanceMeeting` | Meeting records | **Low** | `governance_meetings` |
| `DocumentApproval` | Approval tracking | **Medium** | `document_approvals` |
| `StrategicGoal` | Strategic goals | **Low** | `strategic_goals` |
| `StrategicInitiative` | Strategic projects | **Low** | `strategic_initiatives` |
| `StrategicKPI` | KPI tracking | **Low** | `strategic_kpis` |

### 12. Finance & E-commerce (11)
| Base44 Entity | Description | Migration Priority | Supabase Table |
|---------------|-------------|-------------------|----------------|
| `Subscription` | Subscriptions | **High** | `subscriptions` |
| `CurlingPlusSubscription` | Premium subs | **High** | `curlingplus_subscriptions` |
| `CurlingPlusPayment` | Premium payments | **High** | `curlingplus_payments` |
| `Donation` | Donations | **High** | `donations` |
| `Purchase` | Purchases | **High** | `purchases` |
| `Product` | Products catalog | **High** | `products` |
| `CartItem` | Shopping cart | **High** | `cart_items` |
| `Order` | Orders | **High** | `orders` |
| `FinancialTransaction` | Transactions | **High** | `financial_transactions` |
| `Budget` | Budget tracking | **Medium** | `budgets` |
| `VendorContract` | Vendor contracts | **Low** | `vendor_contracts` |
| `AuctionItem` | Auction items | **Low** | `auction_items` |

### 13. HR & Staff (10)
| Base44 Entity | Description | Migration Priority | Supabase Table |
|---------------|-------------|-------------------|----------------|
| `HRPolicy` | HR policies | **Low** | `hr_policies` |
| `StaffProfile` | Staff profiles | **Medium** | `staff_profiles` |
| `OnboardingChecklist` | Staff onboarding | **Low** | `onboarding_checklists` |
| `EmployeeFeedback` | Employee feedback | **Low** | `employee_feedback` |
| `LearningTrack` | Learning paths | **Low** | `learning_tracks` |
| `LearningProgress` | Learning tracking | **Low** | `learning_progress` |
| `HRDocument` | HR documents | **Low** | `hr_documents` |
| `Project` | Project management | **Medium** | `projects` |
| `TimeEntry` | Time tracking | **Low** | `time_entries` |
| `Volunteer` | Volunteers | **Medium** | `volunteers` |
| `VolunteerCampaign` | Volunteer campaigns | **Medium** | `volunteer_campaigns` |

### 14. Platform Administration (15)
| Base44 Entity | Description | Migration Priority | Supabase Table |
|---------------|-------------|-------------------|----------------|
| `PlatformSetting` | System config | **Critical** | `platform_settings` |
| `AuditLog` | Activity logs | **High** | `audit_logs` |
| `ApiConfiguration` | API settings | **Medium** | `api_configurations` |
| `ApiLog` | API usage | **Low** | `api_logs` |
| `WebhookLog` | Webhook history | **Low** | `webhook_logs` |
| `PlatformAdoption` | Usage metrics | **Low** | `platform_adoption` |
| `WorkflowDefinition` | Workflow templates | **Medium** | `workflow_definitions` |
| `WorkflowInstance` | Workflow executions | **Medium** | `workflow_instances` |
| `FormDefinition` | Form schemas | **High** | `form_definitions` |
| `FormSubmission` | Form responses | **High** | `form_submissions` |
| `FormTemplate` | Form templates | **Medium** | `form_templates` |
| `SurveySubmission` | Survey responses | **High** | `survey_submissions` |
| `SurveyBenchmark` | Survey analytics | **Medium** | `survey_benchmarks` |
| `AIModel` | AI model configs | **Low** | `ai_models` |
| `ProductRoadmapItem` | Roadmap items | **Low** | `product_roadmap_items` |

### 15. Research & Innovation (3)
| Base44 Entity | Description | Migration Priority | Supabase Table |
|---------------|-------------|-------------------|----------------|
| `ResearchPartnership` | Research collabs | **Low** | `research_partnerships` |
| `InnovationRequest` | Innovation ideas | **Low** | `innovation_requests` |
| `ResearchResource` | Research materials | **Low** | `research_resources` |

### 16. Data Quality (4)
| Base44 Entity | Description | Migration Priority | Supabase Table |
|---------------|-------------|-------------------|----------------|
| `BusinessGlossaryTerm` | Data dictionary | **Low** | `business_glossary_terms` |
| `DataQualityRule` | Quality rules | **Low** | `data_quality_rules` |
| `DataQualityIssue` | Quality issues | **Low** | `data_quality_issues` |

### 17. International & Federation (5)
| Base44 Entity | Description | Migration Priority | Supabase Table |
|---------------|-------------|-------------------|----------------|
| `WCFInitiative` | WCF programs | **Low** | `wcf_initiatives` |
| `GlobalPartnership` | Global partners | **Low** | `global_partnerships` |
| `InternationalEvent` | Intl events | **Low** | `international_events` |
| `Delegation` | Event delegations | **Low** | `delegations` |

### 18. Hit Draw Tap Game (2)
| Base44 Entity | Description | Migration Priority | Supabase Table |
|---------------|-------------|-------------------|----------------|
| `HitDrawTap` | Game data | **Low** | `hit_draw_tap` |
| `HDTEvent` | Game events | **Low** | `hdt_events` |

---

## Migration Priority Legend

- **Critical**: Must migrate first (authentication, core config)
- **High**: Priority 1-2 phases (core features)
- **Medium**: Priority 3-4 phases (important but not blocking)
- **Low**: Priority 5+ phases (nice-to-have, can be deferred)

---

## Relationships Overview

### Core Relationships
```
User ──┬── Club (membership)
       ├── Team (membership)
       ├── PointTransaction
       ├── HighPerformanceLog
       ├── SocialPost
       └── Notification

Club ──┬── ClubMetrics
       ├── ClubLoyalty
       ├── ClubLicense
       └── User (members)

Event ──┬── Game
        ├── EventPlan
        ├── StreamingEvent
        └── Team (participants)

Game ──┬── ShotTrackerLog
       ├── GameReport
       └── EventStandings
```

### Complex Relationships
- User-to-User: `SocialConnection`, `CoachFeedback`, `UserMessage`
- User-to-Content: `KnowledgeProgress`, `TriviaSession`, `ArticleFeedback`
- Sponsor-to-Campaign: `SponsorCampaign`, `SponsorDeal`, `SponsorContract`
- Compliance: `SafeSportCompletion`, `PolicyAcknowledgment`, `ComplianceItem`

---

## Special Considerations

### Large Volume Tables
These will require special migration strategies:
- `AuditLog` - Millions of rows, archive old data
- `PointTransaction` - Hundreds of thousands
- `ShotTrackerLog` - IoT data, high volume
- `ActivityFeed` - Real-time data, consider retention policy

### Real-Time Tables
Require Supabase Realtime subscriptions:
- `LiveInteraction`
- `LivePoll`
- `SocialPost`
- `Notification`
- `UserMessage`

### External Integration Tables
Sync with external systems:
- `CTRSRanking` - CTRS system
- `StreamingEvent` - Video platform
- `CRMIntegration` - HubSpot/Salesforce
- `SafeSportCompletion` - SafeSport platform

---

## Supabase Schema Example

```sql
-- Example: Core user profile table
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clerk_user_id TEXT UNIQUE NOT NULL,
  email TEXT NOT NULL,
  full_name TEXT,
  user_type TEXT CHECK (user_type IN ('athlete', 'coach', 'fan', 'staff', 'volunteer', 'sponsor', 'club_admin', 'executive')),
  total_points INTEGER DEFAULT 0,
  current_tier TEXT DEFAULT 'bronze',
  avatar_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Example: Points transactions
CREATE TABLE point_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  points INTEGER NOT NULL,
  reason TEXT,
  transaction_type TEXT CHECK (transaction_type IN ('earn', 'spend', 'bonus', 'refund')),
  reference_type TEXT, -- 'event', 'challenge', 'reward', etc.
  reference_id UUID,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_point_transactions_user ON point_transactions(user_id);
CREATE INDEX idx_point_transactions_date ON point_transactions(created_at DESC);

-- Example: Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT
  USING (clerk_user_id = auth.jwt() ->> 'sub');

CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  USING (clerk_user_id = auth.jwt() ->> 'sub');
```

---

**Last Updated**: November 10, 2025  
**Total Entities**: 166  
**Status**: Ready for schema design
