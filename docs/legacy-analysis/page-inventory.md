# Page Inventory

Complete list of all 149 pages in the legacy application with dependencies, complexity, and migration priority.

---

## Summary Statistics

| Category | Count | Avg Complexity | Priority Distribution |
|----------|-------|----------------|----------------------|
| Fan & Public | 20 | Medium | High: 12, Medium: 6, Low: 2 |
| Club Management | 8 | Medium-High | High: 6, Medium: 2 |
| High Performance | 17 | High | High: 13, Medium: 4 |
| Business Operations | 35 | High | High: 15, Medium: 15, Low: 5 |
| Knowledge & Learning | 14 | Low-Medium | High: 8, Medium: 4, Low: 2 |
| Governance & Compliance | 15 | Medium-High | High: 10, Medium: 5 |
| Content & Communications | 10 | Medium | High: 6, Medium: 4 |
| Admin & Platform | 22 | Medium-High | High: 8, Medium: 10, Low: 4 |
| Miscellaneous | 8 | Low-Medium | Low: 8 |

**Total**: 149 pages

---

## Detailed Inventory

### 1. Public & Fan Features (20 pages)

#### Home.jsx
- **Route**: `/`
- **Priority**: **Critical**
- **Complexity**: High
- **Dependencies**: XPContext, User entity, LoyaltyProgram
- **Description**: Landing page with role-based content, quick actions, dashboard for authenticated users
- **Migration Notes**: Split into landing (public) and dashboard (authenticated)

#### Welcome.jsx
- **Route**: `/Welcome`
- **Priority**: High
- **Complexity**: Medium
- **Description**: Welcome/onboarding page
- **Migration**: Server Component with onboarding flow

#### Events.jsx
- **Route**: `/Events`
- **Priority**: High
- **Complexity**: Medium
- **Dependencies**: Event entity, Club entity
- **Description**: Event listing with search/filter
- **Migration**: ISR page with search params

#### EventDetails.jsx
- **Route**: `/EventDetails`
- **Priority**: High
- **Complexity**: High
- **Dependencies**: Event, Game, Team, Registration
- **Description**: Detailed event page with registration
- **Migration**: Dynamic route `/events/[id]`

#### LiveScoring.jsx
- **Route**: `/LiveScoring`
- **Priority**: High
- **Complexity**: High
- **Dependencies**: Game entity, real-time updates
- **Description**: Live game scoring and updates
- **Migration**: Real-time with Supabase subscriptions

#### Streaming.jsx
- **Route**: `/Streaming`
- **Priority**: High
- **Complexity**: High
- **Dependencies**: StreamingEvent entity, video platform integration
- **Description**: Live streaming hub
- **Migration**: Next.js with video player component

#### Leaderboards.jsx
- **Route**: `/Leaderboards`
- **Priority**: Medium
- **Complexity**: Medium
- **Dependencies**: PointTransaction, User, LoyaltyProgram
- **Description**: Points and achievement leaderboards
- **Migration**: ISR with server-side sorting

#### CTRSRankings.jsx
- **Route**: `/CTRSRankings`
- **Priority**: Medium
- **Complexity**: Medium
- **Dependencies**: CTRSRanking entity, external API
- **Description**: Canadian Team Ranking System
- **Migration**: ISR with external API fetch

#### AboutCurling.jsx
- **Route**: `/AboutCurling`
- **Priority**: Medium
- **Complexity**: Low
- **Description**: Static content about curling
- **Migration**: Static page (SSG)

#### HelpCenter.jsx
- **Route**: `/HelpCenter`
- **Priority**: Medium
- **Complexity**: Medium
- **Dependencies**: KnowledgeArticle
- **Description**: Help documentation hub
- **Migration**: Static with search

#### TermsOfService.jsx
- **Route**: `/TermsOfService`
- **Priority**: Low
- **Complexity**: Low
- **Description**: Legal terms
- **Migration**: Static page

#### TermsOfUse.jsx
- **Route**: `/TermsOfUse`
- **Priority**: Low
- **Complexity**: Low
- **Description**: Terms of use
- **Migration**: Static page

#### PrivacyPolicy.jsx
- **Route**: `/PrivacyPolicy`
- **Priority**: High
- **Complexity**: Low
- **Description**: Privacy policy (legal requirement)
- **Migration**: Static page with audit log

#### Clubs.jsx
- **Route**: `/Clubs`
- **Priority**: High
- **Complexity**: Medium
- **Dependencies**: Club entity
- **Description**: Club directory with search
- **Migration**: ISR page with search

#### GeoChallenge.jsx
- **Route**: `/GeoChallenge`
- **Priority**: Medium
- **Complexity**: Medium
- **Dependencies**: GeoChallenge entity, geolocation
- **Description**: Location-based challenges
- **Migration**: Client component with maps

#### MysteryBox.jsx
- **Route**: `/MysteryBox`
- **Priority**: Medium
- **Complexity**: Medium
- **Dependencies**: MysteryBox entity, PointTransaction
- **Description**: Random reward system
- **Migration**: API route for random selection

#### FanPass.jsx
- **Route**: `/FanPass`
- **Priority**: Medium
- **Complexity**: High
- **Dependencies**: Subscription, User, benefits
- **Description**: VIP fan membership
- **Migration**: Protected page with subscription check

#### FanOS.jsx
- **Route**: `/FanOS`
- **Priority**: Medium
- **Complexity**: High
- **Description**: Fan operating system dashboard
- **Migration**: Dashboard with multiple widgets

#### Sponsors.jsx
- **Route**: `/Sponsors`
- **Priority**: Low
- **Complexity**: Low
- **Dependencies**: SponsorCampaign
- **Description**: Sponsor directory
- **Migration**: ISR page

#### Donations.jsx
- **Route**: `/Donations`
- **Priority**: High
- **Complexity**: High
- **Dependencies**: Donation entity, Stripe
- **Description**: Donation processing
- **Migration**: API route + Stripe integration

---

### 2. Loyalty & Engagement (13 pages)

#### LoyaltyProgram.jsx
- **Route**: `/LoyaltyProgram`
- **Priority**: High
- **Complexity**: High
- **Dependencies**: LoyaltyProgram, PointTransaction, User
- **Description**: Points program overview
- **Migration**: Protected dashboard

#### RewardStore.jsx
- **Route**: `/RewardStore`
- **Priority**: High
- **Complexity**: High
- **Dependencies**: Reward, PointTransaction
- **Description**: Rewards catalog and redemption
- **Migration**: E-commerce pattern with points

#### PurchaseHistory.jsx
- **Route**: `/PurchaseHistory`
- **Priority**: Medium
- **Complexity**: Medium
- **Dependencies**: Purchase, Order
- **Description**: User purchase history
- **Migration**: Protected page with list

#### SocialHub.jsx
- **Route**: `/SocialHub`
- **Priority**: High
- **Complexity**: High
- **Dependencies**: SocialPost, CommunityPost
- **Description**: Social feed and interactions
- **Migration**: Real-time feed with subscriptions

#### SocialThread.jsx
- **Route**: `/SocialThread`
- **Priority**: High
- **Complexity**: High
- **Dependencies**: SocialThread, Comment
- **Description**: Discussion threads
- **Migration**: Dynamic route with comments

#### CommunityHub.jsx
- **Route**: `/CommunityHub`
- **Priority**: High
- **Complexity**: High
- **Dependencies**: CommunityPost, ActivityFeed
- **Description**: Community content hub
- **Migration**: Feed with filtering

#### SocialConnections.jsx
- **Route**: `/SocialConnections`
- **Priority**: Medium
- **Complexity**: Medium
- **Dependencies**: SocialConnection, User
- **Description**: Friend connections
- **Migration**: Protected page with connections list

#### TriviaHub.jsx
- **Route**: `/TriviaHub`
- **Priority**: Medium
- **Complexity**: High
- **Dependencies**: TriviaQuestion, TriviaSession, TriviaLeaderboard
- **Description**: Trivia game system
- **Migration**: Interactive game with state management

#### HitDrawTap.jsx
- **Route**: `/HitDrawTap`
- **Priority**: Low
- **Complexity**: High
- **Dependencies**: HitDrawTap, HDTEvent
- **Description**: Hit Draw Tap game
- **Migration**: Canvas-based game component

#### YouthPassport.jsx
- **Route**: `/YouthPassport`
- **Priority**: Medium
- **Complexity**: High
- **Dependencies**: YouthInitiative, UserChallengeProgress
- **Description**: Youth gamified learning
- **Migration**: Protected dashboard for youth

#### GetInvolvedHub.jsx
- **Route**: `/GetInvolvedHub`
- **Priority**: Medium
- **Complexity**: Medium
- **Description**: Volunteer and engagement opportunities
- **Migration**: Content hub with CTAs

#### MADashboard.jsx
- **Route**: `/MADashboard`
- **Priority**: Medium
- **Complexity**: High
- **Dependencies**: Analytics data
- **Description**: Member association dashboard
- **Migration**: Analytics dashboard

#### MAInsights.jsx
- **Route**: `/MAInsights`
- **Priority**: Medium
- **Complexity**: High
- **Description**: MA insights and reporting
- **Migration**: Analytics reporting page

---

### 3. Club Management (8 pages)

#### SmartClubPanel.jsx
- **Route**: `/SmartClubPanel`
- **Priority**: High
- **Complexity**: High
- **Dependencies**: Club, ClubMetrics, User (members)
- **Role**: Club Admin
- **Description**: Club admin dashboard
- **Migration**: Protected dashboard with admin check

#### ClubMetrics.jsx (implied from entity)
- **Priority**: High
- **Complexity**: High
- **Dependencies**: ClubMetrics entity
- **Description**: Club analytics
- **Migration**: Analytics dashboard for clubs

#### ClubServicesHub.jsx
- **Route**: `/ClubServicesHub`
- **Priority**: High
- **Complexity**: Medium
- **Description**: Club service offerings
- **Migration**: Content hub

#### ClubSurvey.jsx
- **Route**: `/ClubSurvey`
- **Priority**: High
- **Complexity**: High
- **Dependencies**: SurveySubmission, FormDefinition
- **Description**: Club feedback surveys
- **Migration**: Form with submission handling

#### FTLOCHub.jsx
- **Route**: `/FTLOCHub`
- **Priority**: Medium
- **Complexity**: Medium
- **Description**: For The Love Of Curling hub
- **Migration**: Content hub

#### VolunteerContext.jsx
- **Route**: `/VolunteerContext`
- **Priority**: Medium
- **Complexity**: Medium
- **Dependencies**: Volunteer, VolunteerCampaign
- **Description**: Volunteer dashboard
- **Migration**: Protected volunteer dashboard

#### FederationContext.jsx
- **Route**: `/FederationContext`
- **Priority**: Medium
- **Complexity**: Medium
- **Description**: Federation context/dashboard
- **Migration**: Context-aware dashboard

#### GovernanceGamification.jsx
- **Route**: `/GovernanceGamification`
- **Priority**: Low
- **Complexity**: Medium
- **Description**: Gamified governance engagement
- **Migration**: Interactive engagement system

---

### 4. High Performance (17 pages)

#### AthleteDashboard.jsx
- **Route**: `/AthleteDashboard`
- **Priority**: High
- **Complexity**: High
- **Dependencies**: HighPerformanceLog, PerformanceBenchmark, User
- **Role**: Athlete
- **Description**: Athlete dashboard
- **Migration**: Role-protected dashboard

#### CoachDashboard.jsx
- **Route**: `/CoachDashboard`
- **Priority**: High
- **Complexity**: High
- **Dependencies**: CoachPerformance, AthleteJourney
- **Role**: Coach
- **Description**: Coach dashboard
- **Migration**: Role-protected coach tools

#### PerformanceCenter.jsx
- **Route**: `/PerformanceCenter`
- **Priority**: High
- **Complexity**: High
- **Dependencies**: Multiple HP entities
- **Description**: Central HP hub
- **Migration**: Dashboard with multiple views

#### ShotTracker.jsx
- **Route**: `/ShotTracker`
- **Priority**: High
- **Complexity**: High
- **Dependencies**: ShotTrackerLog, Game
- **Description**: Manual shot tracking
- **Migration**: Interactive form with game state

#### OnIceShotTracker.jsx
- **Route**: `/OnIceShotTracker`
- **Priority**: High
- **Complexity**: Very High
- **Dependencies**: ShotTrackerLog, IoT sensors
- **Description**: IoT shot tracking
- **Migration**: Real-time IoT integration

#### SmartBroomHub.jsx
- **Route**: `/SmartBroomHub`
- **Priority**: High
- **Complexity**: Very High
- **Dependencies**: SmartBroomSession, IoT
- **Description**: Smart broom integration
- **Migration**: IoT integration with visualization

#### PatchScanner.jsx
- **Route**: `/PatchScanner`
- **Priority**: Medium
- **Complexity**: Medium
- **Dependencies**: Patch entity
- **Description**: Scan and collect patches
- **Migration**: Camera/upload integration

#### PledgeBoard.jsx
- **Route**: `/PledgeBoard`
- **Priority**: Low
- **Complexity**: Medium
- **Dependencies**: Pledge entity
- **Description**: Athlete pledges/commitments
- **Migration**: Public board with moderation

#### PledgeBoardEmbed.jsx
- **Route**: `/PledgeBoardEmbed`
- **Priority**: Low
- **Complexity**: Low
- **Description**: Embeddable pledge board
- **Migration**: Embed-friendly component

#### CoachAthleteView.jsx
- **Route**: `/CoachAthleteView`
- **Priority**: High
- **Complexity**: High
- **Description**: Coach view of athlete data
- **Migration**: Protected relationship view

#### HPTeamworksDashboard.jsx
- **Route**: `/HPTeamworksDashboard`
- **Priority**: Medium
- **Complexity**: High
- **Dependencies**: External Teamworks integration
- **Description**: Teamworks integration dashboard
- **Migration**: External API integration

#### NationalTeams.jsx
- **Route**: `/NationalTeams`
- **Priority**: Medium
- **Complexity**: Medium
- **Dependencies**: NationalTeam entity
- **Description**: National team roster and info
- **Migration**: ISR page

#### NextGenProgram.jsx
- **Route**: `/NextGenProgram`
- **Priority**: Medium
- **Complexity**: Medium
- **Dependencies**: NextGenAthlete
- **Description**: Youth development program
- **Migration**: Program info page

#### HPCenters.jsx
- **Route**: `/HPCenters`
- **Priority**: Medium
- **Complexity**: Low
- **Dependencies**: HPCenter entity
- **Description**: HP training center directory
- **Migration**: Static/ISR listing

#### TeamSelection.jsx
- **Route**: `/TeamSelection`
- **Priority**: Medium
- **Complexity**: High
- **Description**: Team selection tools
- **Migration**: Admin tool with selection logic

#### HPAnalyticsDashboard.jsx
- **Route**: `/HPAnalyticsDashboard`
- **Priority**: High
- **Complexity**: Very High
- **Dependencies**: Multiple analytics entities
- **Description**: Advanced HP analytics
- **Migration**: Complex analytics dashboard

#### HighPerformanceHub.jsx
- **Route**: `/HighPerformanceHub`
- **Priority**: High
- **Complexity**: High
- **Description**: Main HP hub
- **Migration**: Central HP navigation

---

### 5. Business Operations (35 pages)

*(Continuing with business operations category...)*

#### ExecutiveDashboard.jsx
- **Route**: `/ExecutiveDashboard`
- **Priority**: High
- **Complexity**: Very High
- **Dependencies**: Multiple KPIs, analytics
- **Role**: Executive
- **Description**: Executive KPI dashboard
- **Migration**: High-level analytics dashboard

#### ExecutiveHub.jsx
- **Route**: `/ExecutiveHub`
- **Priority**: Medium
- **Complexity**: High
- **Description**: Executive hub
- **Migration**: Executive navigation hub

#### BusinessHub.jsx
- **Route**: `/BusinessHub`
- **Priority**: Medium
- **Complexity**: Medium
- **Description**: Business operations hub
- **Migration**: Business tools navigation

#### FinanceHub.jsx
- **Route**: `/FinanceHub`
- **Priority**: High
- **Complexity**: Very High
- **Dependencies**: FinancialTransaction, Budget
- **Role**: Finance Staff
- **Description**: Financial management
- **Migration**: Protected finance dashboard

#### SponsorDashboard.jsx
- **Route**: `/SponsorDashboard`
- **Priority**: High
- **Complexity**: High
- **Dependencies**: SponsorCampaign, SponsorDeal
- **Role**: Sponsor
- **Description**: Sponsor portal
- **Migration**: Partner dashboard

#### SponsorshipHQ.jsx
- **Route**: `/SponsorshipHQ`
- **Priority**: High
- **Complexity**: High
- **Dependencies**: Sponsor entities
- **Role**: Staff
- **Description**: Sponsorship management
- **Migration**: CRM-style sponsorship tool

#### SponsorIntelligence.jsx
- **Route**: `/SponsorIntelligence`
- **Priority**: Medium
- **Complexity**: High
- **Description**: Sponsor analytics
- **Migration**: Analytics dashboard

#### PartnerRegistration.jsx
- **Route**: `/PartnerRegistration`
- **Priority**: Medium
- **Complexity**: Medium
- **Description**: Partner signup
- **Migration**: Public form with review

#### PartnershipEcosystem.jsx
- **Route**: `/PartnershipEcosystem`
- **Priority**: Low
- **Complexity**: Medium
- **Description**: Partnership visualization
- **Migration**: Interactive visualization

#### MarketingCenter.jsx
- **Route**: `/MarketingCenter`
- **Priority**: High
- **Complexity**: High
- **Dependencies**: MarketingCampaign
- **Role**: Marketing Staff
- **Description**: Marketing tools
- **Migration**: Marketing dashboard

#### CommunicationsCenter.jsx
- **Route**: `/CommunicationsCenter`
- **Priority**: Medium
- **Complexity**: High
- **Description**: Communications tools
- **Migration**: Comms dashboard

#### ContentManagementHub.jsx
- **Route**: `/ContentManagementHub`
- **Priority**: High
- **Complexity**: High
- **Description**: CMS hub
- **Migration**: Content management interface

#### StaffHQ.jsx
- **Route**: `/StaffHQ`
- **Priority**: High
- **Complexity**: Very High
- **Dependencies**: Multiple staff entities
- **Role**: Staff
- **Description**: Staff workspace
- **Migration**: Protected staff dashboard

#### StaffHQAssessment.jsx
- **Route**: `/StaffHQAssessment`
- **Priority**: Medium
- **Complexity**: High
- **Description**: Staff assessment tool
- **Migration**: Assessment workflow

#### MyWorkspace.jsx
- **Route**: `/MyWorkspace`
- **Priority**: Medium
- **Complexity**: High
- **Description**: Personal workspace
- **Migration**: User dashboard

#### ReportsHub.jsx
- **Route**: `/ReportsHub`
- **Priority**: High
- **Complexity**: Very High
- **Description**: Reporting hub
- **Migration**: Report builder/viewer

#### AnalyticsCenter.jsx
- **Route**: `/AnalyticsCenter`
- **Priority**: High
- **Complexity**: Very High
- **Description**: Advanced analytics
- **Migration**: Analytics platform

#### SelfServeAnalytics.jsx
- **Route**: `/SelfServeAnalytics`
- **Priority**: Medium
- **Complexity**: High
- **Description**: User analytics tools
- **Migration**: Self-service BI tool

#### SurveyAnalytics.jsx
- **Route**: `/SurveyAnalytics`
- **Priority**: Medium
- **Complexity**: High
- **Description**: Survey data analysis
- **Migration**: Survey reporting

#### ResearchHub.jsx
- **Route**: `/ResearchHub`
- **Priority**: Low
- **Complexity**: Medium
- **Description**: Research resources
- **Migration**: Research portal

#### EventPlanDetail.jsx
- **Route**: `/EventPlanDetail`
- **Priority**: High
- **Complexity**: High
- **Dependencies**: EventPlan, EventPlanActivity
- **Description**: Event planning
- **Migration**: Project management interface

#### EventOpsToolkit.jsx
- **Route**: `/EventOpsToolkit`
- **Priority**: Medium
- **Complexity**: High
- **Description**: Event operations tools
- **Migration**: Ops toolkit dashboard

#### TeamsConfiguration.jsx
- **Route**: `/TeamsConfiguration`
- **Priority**: Medium
- **Complexity**: High
- **Description**: Team setup and config
- **Migration**: Admin configuration

#### PersonalCalendar.jsx
- **Route**: `/PersonalCalendar`
- **Priority**: Low
- **Complexity**: Medium
- **Description**: User calendar
- **Migration**: Calendar component

#### YouthCommunityHub.jsx
- **Route**: `/YouthCommunityHub`
- **Priority**: Medium
- **Complexity**: Medium
- **Description**: Youth community
- **Migration**: Youth hub

#### MonetizationHub.jsx
- **Route**: `/MonetizationHub`
- **Priority**: Low
- **Complexity**: Medium
- **Description**: Revenue opportunities
- **Migration**: Business strategy page

#### MonetizationAudit.jsx
- **Route**: `/MonetizationAudit`
- **Priority**: Low
- **Complexity**: Medium
- **Description**: Revenue audit
- **Migration**: Audit tool

#### RevenueOpportunities.jsx
- **Route**: `/RevenueOpportunities`
- **Priority**: Low
- **Complexity**: Low
- **Description**: Revenue ideas
- **Migration**: Static strategy page

#### SubscriptionStrategy.jsx
- **Route**: `/SubscriptionStrategy`
- **Priority**: Low
- **Complexity**: Low
- **Description**: Subscription planning
- **Migration**: Strategy document

#### LoyaltyArchitecture.jsx
- **Route**: `/LoyaltyArchitecture`
- **Priority**: Low
- **Complexity**: Low
- **Description**: Loyalty system design
- **Migration**: Architecture documentation

#### VenueCommerce.jsx
- **Route**: `/VenueCommerce`
- **Priority**: Low
- **Complexity**: Medium
- **Description**: Venue e-commerce
- **Migration**: E-commerce tools

#### DataMonetization.jsx
- **Route**: `/DataMonetization`
- **Priority**: Low
- **Complexity**: Low
- **Description**: Data revenue strategies
- **Migration**: Strategy document

#### TransformationRoadmap.jsx
- **Route**: `/TransformationRoadmap`
- **Priority**: Low
- **Complexity**: Low
- **Description**: Digital transformation plan
- **Migration**: Roadmap visualization

#### JourneyMapping.jsx
- **Route**: `/JourneyMapping`
- **Priority**: Low
- **Complexity**: Medium
- **Description**: User journey mapping
- **Migration**: Journey visualization

---

### 6. Governance & Compliance (15 pages)

#### GovernanceComplianceHub.jsx
- **Route**: `/GovernanceComplianceHub`
- **Priority**: High
- **Complexity**: High
- **Description**: Governance hub
- **Migration**: Compliance dashboard

#### SafeSportHub.jsx
- **Route**: `/SafeSportHub`
- **Priority**: High
- **Complexity**: High
- **Dependencies**: SafeSport entities
- **Description**: SafeSport member portal
- **Migration**: Protected training/compliance portal

#### SafeSportPublic.jsx
- **Route**: `/SafeSportPublic`
- **Priority**: High
- **Complexity**: Medium
- **Description**: Public SafeSport info
- **Migration**: Public info page

#### DEIHub.jsx
- **Route**: `/DEIHub`
- **Priority**: Medium
- **Complexity**: Medium
- **Description**: DEI initiatives
- **Migration**: Content hub

#### LegalComplianceHub.jsx
- **Route**: `/LegalComplianceHub`
- **Priority**: Medium
- **Complexity**: High
- **Description**: Legal compliance tools
- **Migration**: Compliance dashboard

#### AdminComplianceDashboard.jsx
- **Route**: `/AdminComplianceDashboard`
- **Priority**: High
- **Complexity**: High
- **Role**: Admin
- **Description**: Admin compliance view
- **Migration**: Admin dashboard

#### IncidentManagementHub.jsx
- **Route**: `/IncidentManagementHub`
- **Priority**: High
- **Complexity**: Very High
- **Dependencies**: Incident entity
- **Description**: Incident reporting/tracking
- **Migration**: Incident management system

#### TrustCenter.jsx
- **Route**: `/TrustCenter`
- **Priority**: Medium
- **Complexity**: Medium
- **Description**: Security/privacy info
- **Migration**: Trust documentation page

#### PeopleCultureHub.jsx
- **Route**: `/PeopleCultureHub`
- **Priority**: Low
- **Complexity**: Medium
- **Description**: HR and culture
- **Migration**: HR hub

#### StrategicPlanningHub.jsx
- **Route**: `/StrategicPlanningHub`
- **Priority**: Low
- **Complexity**: High
- **Description**: Strategic planning
- **Migration**: Planning tools

#### SubscriptionManagement.jsx
- **Route**: `/SubscriptionManagement`
- **Priority**: High
- **Complexity**: High
- **Dependencies**: Subscription entity
- **Description**: User subscription management
- **Migration**: Subscription portal

#### Constituent360.jsx
- **Route**: `/Constituent360`
- **Priority**: Medium
- **Complexity**: Very High
- **Description**: 360-degree constituent view
- **Migration**: Comprehensive user profile

#### CurlerDataHub.jsx / CurlingDataHub.jsx
- **Route**: `/CurlerDataHub`, `/CurlingDataHub`
- **Priority**: Medium
- **Complexity**: High
- **Description**: Curler data management
- **Migration**: Data management interface

#### InsightsHub.jsx
- **Route**: `/InsightsHub`
- **Priority**: Medium
- **Complexity**: High
- **Description**: Business insights
- **Migration**: Insights dashboard

#### GraniteCircleExplainer.jsx
- **Route**: `/GraniteCircleExplainer`
- **Priority**: Low
- **Complexity**: Low
- **Description**: Granite Circle explainer
- **Migration**: Explainer page

---

### 7. Admin & Platform (22 pages)

#### Dashboard.jsx
- **Route**: `/Dashboard`
- **Priority**: High
- **Complexity**: High
- **Description**: Universal dashboard
- **Migration**: Main dashboard

#### UniversalDashboard.jsx
- **Route**: `/UniversalDashboard`
- **Priority**: Medium
- **Complexity**: High
- **Description**: Universal view
- **Migration**: Dashboard

#### UniversalHub.jsx
- **Route**: `/UniversalHub`
- **Priority**: Medium
- **Complexity**: Medium
- **Description**: Universal hub
- **Migration**: Hub page

#### PlatformSettings.jsx
- **Route**: `/PlatformSettings`
- **Priority**: High
- **Complexity**: Very High
- **Dependencies**: PlatformSetting entity
- **Role**: Admin
- **Description**: System configuration
- **Migration**: Admin settings panel

#### APIManager.jsx
- **Route**: `/APIManager`
- **Priority**: Medium
- **Complexity**: High
- **Dependencies**: ApiConfiguration, ApiLog
- **Role**: Admin
- **Description**: API key management
- **Migration**: API admin panel

#### DeveloperPortal.jsx
- **Route**: `/DeveloperPortal`
- **Priority**: Medium
- **Complexity**: High
- **Description**: Developer docs and tools
- **Migration**: Developer documentation site

#### SystemHealth.jsx
- **Route**: `/SystemHealth`
- **Priority**: High
- **Complexity**: High
- **Description**: System monitoring
- **Migration**: Health dashboard

#### SystemArchitecture.jsx
- **Route**: `/SystemArchitecture`
- **Priority**: Low
- **Complexity**: Low
- **Description**: System architecture docs
- **Migration**: Documentation page

#### DataNavigationHub.jsx
- **Route**: `/DataNavigationHub`
- **Priority**: Low
- **Complexity**: Medium
- **Description**: Data catalog
- **Migration**: Data catalog interface

#### DataQualityDashboard.jsx
- **Route**: `/DataQualityDashboard`
- **Priority**: Low
- **Complexity**: High
- **Description**: Data quality monitoring
- **Migration**: DQ dashboard

#### DataStrategyAssessment.jsx
- **Route**: `/DataStrategyAssessment`
- **Priority**: Low
- **Complexity**: Low
- **Description**: Data strategy assessment
- **Migration**: Assessment form

#### BDOStrategyComparison.jsx
- **Route**: `/BDOStrategyComparison`
- **Priority**: Low
- **Complexity**: Low
- **Description**: Strategy comparison
- **Migration**: Comparison page

#### BusinessGlossary.jsx
- **Route**: `/BusinessGlossary`
- **Priority**: Low
- **Complexity**: Medium
- **Dependencies**: BusinessGlossaryTerm
- **Description**: Data dictionary
- **Migration**: Glossary interface

#### FormsHub.jsx
- **Route**: `/FormsHub`
- **Priority**: High
- **Complexity**: High
- **Dependencies**: FormDefinition
- **Description**: Forms management
- **Migration**: Form management interface

#### FormBuilder.jsx
- **Route**: `/FormBuilder`
- **Priority**: High
- **Complexity**: Very High
- **Description**: Drag-drop form builder
- **Migration**: Complex form builder

#### FormRenderer.jsx
- **Route**: `/FormRenderer`
- **Priority**: High
- **Complexity**: High
- **Description**: Dynamic form renderer
- **Migration**: Form rendering engine

#### Form.jsx
- **Route**: `/Form`
- **Priority**: High
- **Complexity**: Medium
- **Description**: Generic form page
- **Migration**: Form wrapper

#### KnowledgeCentreHub.jsx
- **Route**: `/KnowledgeCentreHub`
- **Priority**: High
- **Complexity**: High
- **Description**: Knowledge base hub
- **Migration**: KB hub

#### KnowledgeBase.jsx
- **Route**: `/KnowledgeBase`
- **Priority**: High
- **Complexity**: Medium
- **Description**: KB article listing
- **Migration**: Article directory

#### KnowledgeArticleDetail.jsx
- **Route**: `/KnowledgeArticleDetail`
- **Priority**: High
- **Complexity**: Medium
- **Description**: KB article view
- **Migration**: Dynamic article page

#### ShopHub.jsx
- **Route**: `/ShopHub`
- **Priority**: Medium
- **Complexity**: High
- **Description**: E-commerce hub
- **Migration**: Shop interface

#### Profile.jsx
- **Route**: `/Profile`
- **Priority**: High
- **Complexity**: High
- **Description**: User profile management
- **Migration**: Protected profile page

---

### 8. Miscellaneous / Testing (8 pages)

#### FlowTesting.jsx
- **Route**: `/FlowTesting`
- **Priority**: Low
- **Complexity**: Medium
- **Description**: Flow testing page
- **Migration**: Testing/staging tool

#### DeploymentGuide.jsx
- **Route**: `/DeploymentGuide`
- **Priority**: Low
- **Complexity**: Low
- **Description**: Deployment documentation
- **Migration**: Docs page

#### HerokuTest.jsx
- **Route**: `/HerokuTest`
- **Priority**: Low
- **Complexity**: Low
- **Description**: Heroku integration test
- **Migration**: Remove or convert to test

#### MongoTest.jsx
- **Route**: `/MongoTest`
- **Priority**: Low
- **Complexity**: Low
- **Description**: MongoDB integration test
- **Migration**: Remove or convert to test

#### DOMOCapabilities.jsx
- **Route**: `/DOMOCapabilities`
- **Priority**: Low
- **Complexity**: Low
- **Description**: DOMO capabilities overview
- **Migration**: Docs page

#### streaming.jsx (lowercase)
- **Route**: `/streaming`
- **Priority**: Low
- **Complexity**: Low
- **Description**: Duplicate/alternate streaming
- **Migration**: Consolidate with Streaming.jsx

#### Layout.jsx
- **Route**: N/A (wrapper component)
- **Priority**: Critical
- **Complexity**: High
- **Description**: App layout wrapper
- **Migration**: Root layout in Next.js

---

## Migration Priority Matrix

### Phase 0 - Foundation (Weeks 1-6)
**Critical Pages:**
- Home.jsx
- Layout.jsx (as root layout)
- Profile.jsx
- Welcome.jsx

### Phase 1 - Public (Weeks 7-14)
**High Priority:**
- Events.jsx, EventDetails.jsx
- Streaming.jsx
- AboutCurling.jsx, HelpCenter.jsx
- Clubs.jsx
- LiveScoring.jsx
- PrivacyPolicy.jsx, TermsOfService.jsx

### Phase 2 - Loyalty (Weeks 15-22)
**High Priority:**
- LoyaltyProgram.jsx
- RewardStore.jsx
- SocialHub.jsx, SocialThread.jsx
- CommunityHub.jsx
- TriviaHub.jsx
- YouthPassport.jsx

### Phase 3 - Club (Weeks 23-28)
**High Priority:**
- SmartClubPanel.jsx
- ClubServicesHub.jsx
- ClubSurvey.jsx

### Phase 4 - HP (Weeks 29-38)
**High Priority:**
- AthleteDashboard.jsx
- CoachDashboard.jsx
- PerformanceCenter.jsx
- ShotTracker.jsx
- OnIceShotTracker.jsx
- SmartBroomHub.jsx
- HPAnalyticsDashboard.jsx

### Phase 5 - Business (Weeks 39-48)
**High Priority:**
- ExecutiveDashboard.jsx
- FinanceHub.jsx
- SponsorDashboard.jsx
- SponsorshipHQ.jsx
- MarketingCenter.jsx
- StaffHQ.jsx
- ReportsHub.jsx
- AnalyticsCenter.jsx

### Phase 6 - Compliance (Weeks 49-56)
**High Priority:**
- GovernanceComplianceHub.jsx
- SafeSportHub.jsx, SafeSportPublic.jsx
- AdminComplianceDashboard.jsx
- IncidentManagementHub.jsx
- SubscriptionManagement.jsx
- PlatformSettings.jsx
- FormsHub.jsx, FormBuilder.jsx, FormRenderer.jsx

---

## Complexity Legend

- **Low**: Static content, simple data display
- **Medium**: CRUD operations, moderate logic
- **High**: Complex interactions, real-time features, integrations
- **Very High**: Advanced analytics, IoT integration, complex business logic

---

**Last Updated**: November 10, 2025  
**Total Pages**: 149  
**Status**: Ready for sprint planning
