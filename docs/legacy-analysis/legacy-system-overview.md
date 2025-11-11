# Legacy System Overview

## Executive Summary

The legacy Curling Canada application is a **comprehensive sports federation management platform** built on Base44 (proprietary backend-as-a-service) and Vite + React. It serves multiple stakeholder groups including athletes, coaches, clubs, fans, sponsors, and federation staff.

### Key Statistics
- **Pages**: 149 unique pages
- **Entities**: 50+ database models
- **Backend Functions**: 70+ serverless functions
- **External Integrations**: 30+ services
- **User Roles**: 8+ distinct user types
- **Lines of Code**: ~100,000+ (estimated)

## Technology Stack

### Frontend
```json
{
  "framework": "Vite + React 18.2.0",
  "routing": "React Router DOM 7.2.0",
  "ui": "Radix UI + Tailwind CSS + Framer Motion",
  "forms": "React Hook Form + Zod",
  "state": "React Context API",
  "icons": "Lucide React"
}
```

### Backend
```json
{
  "platform": "Base44 SDK v0.1.2",
  "appId": "686ddd789691a323a1380fee",
  "auth": "Base44 built-in authentication",
  "database": "Base44 managed database",
  "storage": "Supabase (for files)",
  "functions": "Base44 serverless functions"
}
```

### Key Dependencies
- `@base44/sdk`: Core backend integration
- `@radix-ui/*`: Accessible UI primitives
- `react-router-dom`: Client-side routing
- `react-hook-form`: Form management
- `zod`: Schema validation
- `framer-motion`: Animations
- `recharts`: Data visualization
- `date-fns`: Date utilities

## Application Architecture

### Entry Point Flow
```
index.html
  ↓
main.jsx (ReactDOM.createRoot)
  ↓
App.jsx
  ↓
Pages/index.jsx (Router + Layout)
  ↓
Layout.jsx (XPProvider + Header + Sidebar + Content)
  ↓
149 Individual Page Components
```

### Context Providers
1. **XPProvider** (XPContext.jsx)
   - User authentication state
   - Loyalty/points data
   - XP (experience points) system
   - Performance monitoring
   - Health checks
   - Security services

2. **LanguageProvider** (i18n)
   - Multi-language support
   - Translation management

### Base44 Client Configuration
```javascript
// src/api/base44Client.js
import { createClient } from '@base44/sdk';

export const base44 = createClient({
  appId: "686ddd789691a323a1380fee",
  requiresAuth: true
});
```

## Feature Domains

### 1. Fan Engagement (20+ pages)
- Event browsing and registration
- Live scoring and streaming
- Leaderboards and competitions
- Social threads and community posts
- Loyalty program and rewards
- Mystery boxes and geo challenges
- Fan pass and youth passport

### 2. Club Management (15+ pages)
- Club directory and profiles
- Club metrics and analytics
- Smart club panel (admin)
- Club surveys and feedback
- Club licenses and subscriptions
- Service hub

### 3. High Performance (20+ pages)
- Athlete dashboard and tracking
- Coach dashboard and tools
- Performance center and analytics
- Shot tracker (on-ice and manual)
- Smart broom integration
- National team management
- HP centers and programs
- Team selection tools
- CTRS rankings

### 4. Business Operations (25+ pages)
- Executive dashboard
- Finance hub and reports
- Sponsorship management
- Marketing center
- Staff HQ and assessment
- Event planning and operations
- Partner registration
- Revenue analytics

### 5. Knowledge & Learning (15+ pages)
- Knowledge centre and articles
- Trivia hub
- About curling content
- Help center
- Onboarding wizard
- Educational pathways

### 6. Governance & Compliance (15+ pages)
- SafeSport hub (public and member)
- DEI (Diversity, Equity, Inclusion) hub
- Governance gamification
- Legal compliance hub
- Admin compliance dashboard
- Incident management
- Audit logs

### 7. Content & Communications (10+ pages)
- Streaming platform
- Social hub
- Communications center
- Content management hub
- Press releases
- Media contacts

### 8. Admin & Platform (20+ pages)
- Platform settings
- API manager
- Developer portal
- Trust center
- System health monitoring
- Universal dashboard
- Forms hub and builder
- Analytics center
- Research hub

### 9. Integrations & Data (15+ pages)
- Data navigation hub
- Self-serve analytics
- Survey analytics
- Constituent 360
- Integration monitoring
- Data quality dashboard
- Business glossary

## User Roles & Permissions

### Primary Roles
1. **Fan/Public** - General access, events, streaming
2. **Athlete** - Performance tracking, smart broom, competitions
3. **Coach** - Athlete management, analytics, planning
4. **Club Admin** - Club management, member coordination
5. **Volunteer** - Event support, community engagement
6. **Sponsor** - Campaign management, ROI tracking
7. **Staff** - Federation operations, business tools
8. **Executive** - Strategic dashboards, governance

### Permission System
- Implemented in XPContext and individual components
- Role-based access control (RBAC)
- Page-level and feature-level permissions
- Dynamic navigation based on role

## Core Features

### XP (Experience Points) System
```javascript
// Gamification layer across the platform
- Points earned for activities
- Tier progression (levels)
- Animated notifications
- Community recognition
- Reward unlocks
```

### Loyalty Program
- Points transactions
- Reward store
- Club-specific loyalty programs
- Youth passport (gamified learning)
- Fan pass (VIP benefits)

### Live Scoring
- Real-time game updates
- Live odds integration
- Event details and schedules
- Streaming integration

### Performance Tracking
- Shot tracking (manual and IoT)
- Smart broom data capture
- Performance benchmarks
- Analytics dashboards
- Coach-athlete collaboration

### Social Features
- Social threads (discussions)
- Community posts
- Activity feeds
- User messages
- Social connections

## Data Models (Key Entities)

### Core Entities
- **User** - User accounts and profiles
- **Club** - Curling clubs
- **Event** - Events and competitions
- **Game** - Individual games/matches

### Loyalty & Engagement
- **LoyaltyProgram** - Points programs
- **PointTransaction** - Point awards/redemptions
- **Reward** - Available rewards
- **ClubLoyalty** - Club-specific programs
- **GeoChallenge** - Location-based challenges
- **MysteryBox** - Random rewards
- **XPChallenge** - Experience challenges
- **UserChallengeProgress** - Challenge tracking

### High Performance
- **HighPerformanceLog** - Training logs
- **PerformanceBenchmark** - Performance standards
- **HighPerformanceContent** - Training materials
- **SmartBroomSession** - Smart broom data

### Business Operations
- **SponsorCampaign** - Sponsor activations
- **SponsorProspect** - Sales pipeline
- **SponsorDeal** - Agreements
- **SponsorContract** - Legal contracts
- **SponsorAsset** - Deliverables
- **MarketingCampaign** - Marketing efforts
- **PressRelease** - Media communications
- **MediaContact** - Press contacts

### Content & Knowledge
- **KnowledgeArticle** - Educational content
- **KnowledgeProgress** - Learning tracking
- **CommunityPost** - Social content
- **SocialThread** - Discussion threads
- **StreamingEvent** - Live streams

### Admin & Compliance
- **Consent** - User consents
- **AuditLog** - Activity logs
- **ApiConfiguration** - API settings
- **ApiLog** - API usage
- **WebhookLog** - Webhook history
- **PlatformSetting** - System config

### Events & Planning
- **EventPlan** - Event plans
- **EventPlanTemplate** - Plan templates
- **EventPlanActivity** - Plan tasks
- **SurveySubmission** - Survey data
- **SurveyBenchmark** - Survey analytics

## Backend Functions (70+)

### Core Functions
- `createNotification` - Push notifications
- `sendTeamsMessage` - MS Teams integration
- `workflowEngine` - Business logic automation
- `triggerWorkflows` - Workflow execution
- `analyzePerformanceData` - Analytics processing
- `getLiveOdds` - Betting odds integration

### Payment Functions
- `createCheckoutSession` - Stripe checkout
- `handleStripeWebhook` - Payment webhooks

### Data Sync Functions (30+ scheduled)
```javascript
// External system integrations
- syncCurlingIOData - CurlingIO API
- syncCurlingZoneData - CurlingZone platform
- syncCTRSData - CTRS rankings
- mongoSync - MongoDB integration
- domoSync - DOMO analytics
- herokuManage - Heroku deployments
- giveCloudSync - Donation platform
- syncMailchimpScheduled - Email marketing
- syncQuickBooksScheduled - Accounting
- syncStripeScheduled - Payments
- syncSafeSportScheduled - SafeSport data
- syncTeamworksScheduled - HP platform
- syncYouTubeAnalytics - Video analytics
- syncShopifyScheduled - E-commerce
- syncHubSpotScheduled - CRM
// ... 15+ more integrations
```

### Worker Functions
- `processEmailQueue` - Async email sending
- `processAnalytics` - Background analytics

## Integration Ecosystem

### Payment Processing
- **Stripe** - Primary payment processor
- **GiveCloud** - Donations and fundraising

### Marketing & Communications
- **Mailchimp** - Email campaigns
- **HubSpot** - CRM and marketing automation
- **WordPress** - Content management

### Business Operations
- **QuickBooks** - Accounting
- **DocuSign** - Digital signatures
- **Ticketmaster** - Event ticketing
- **Shopify** - E-commerce

### Analytics & Data
- **DOMO** - Business intelligence
- **Google Analytics** - Web analytics
- **Brandwatch** - Social listening
- **MongoDB** - Data warehouse

### Sports-Specific
- **CurlingIO** - Curling data API
- **CurlingZone** - League management
- **CTRS** - Canadian Team Ranking System
- **CurlingReg** - Registration system
- **TrustEvent** - Event credentialing
- **Accredit** - Accreditation system

### High Performance
- **Teamworks** - Athlete management
- **Dartfish** - Video analysis
- **ADP** - HR/Payroll

### Video & Media
- **YouTube** - Video hosting
- **Streaming platforms** - Live streaming

### Other
- **SafeSport** - Athlete safety compliance
- **Microsoft Teams** - Internal communications
- **Heroku** - Hosting platform

## Performance Characteristics

### Current Issues (Likely)
- Large bundle size (149 pages)
- Client-side only rendering (no SSR/SSG)
- Base44 vendor lock-in
- Limited caching strategies
- No code splitting optimization
- Heavy context usage

### Monitoring Services (Built-in)
- `PerformanceMonitoringService` - Metrics tracking
- `HealthCheckService` - System health
- `SecurityService` - Security enforcement
- `RateLimiter` - API rate limiting
- `AuditLogger` - Activity logging
- `GracefulDegradationService` - Fallback handling

## Security Features

### Implemented
- Clickjacking prevention
- Audit logging
- Rate limiting
- Security service layer
- Required authentication for all operations

### Areas for Improvement
- Content Security Policy (CSP)
- CSRF protection
- Input sanitization
- API security hardening

## Known Technical Debt

1. **Vendor Lock-in**
   - Tightly coupled to Base44 SDK
   - Migration requires complete rewrite of data layer

2. **Monolithic Structure**
   - All 149 pages in one application
   - Difficult to maintain and test
   - No micro-frontend architecture

3. **State Management**
   - Over-reliance on Context API
   - XPContext doing too much
   - No state persistence strategy

4. **No TypeScript**
   - JavaScript only (some .jsx files)
   - Limited type safety
   - Prone to runtime errors

5. **Hard-coded Configuration**
   - App ID in source code
   - No environment-based config
   - Difficult to manage multiple environments

6. **Limited Testing**
   - No evidence of comprehensive test suite
   - Manual QA burden
   - High regression risk

## Migration Challenges

### High Priority
1. **Authentication** - Base44 auth → Clerk migration
2. **Data Layer** - 50+ entities to new database
3. **Backend Functions** - 70+ functions to API routes
4. **Routing** - React Router → Next.js App Router

### Medium Priority
5. **Integrations** - 30+ external services
6. **State Management** - Context → Server Components + state
7. **UI Components** - Radix UI (keep) + new patterns

### Lower Priority
8. **Performance** - Bundle optimization
9. **Testing** - Test suite creation
10. **Documentation** - Code documentation

## Success Criteria for Migration

- [ ] All user authentication flows work
- [ ] All 149 pages accessible and functional
- [ ] All integrations operational
- [ ] Data integrity maintained
- [ ] Performance improved (Lighthouse 95+)
- [ ] Security hardened
- [ ] Zero data loss
- [ ] <100ms additional latency
- [ ] Mobile responsive maintained
- [ ] Accessibility standards met (WCAG 2.1 AA)

---

**Last Updated**: November 10, 2025  
**Analyst**: Development Team
