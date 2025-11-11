# Phase 1: Core Feature Development

**Target Start:** November 12, 2025  
**Estimated Duration:** 3-4 weeks  
**Status:** Ready to Begin

---

## 🎯 Phase 1 Objectives

Build out the core user-facing features that make The Button platform functional and valuable for curlers across Canada.

### Primary Goals
1. **Event Registration System** - Enable users to discover and register for curling events
2. **Loyalty Program Implementation** - Reward engagement with the Granite Circle program
3. **Performance Tracking** - Allow athletes to log and analyze their performance
4. **Team Management** - Facilitate team creation and management
5. **Content System** - News, articles, and learning resources

---

## 📋 Feature Breakdown

### 1. Event Registration & Management (Priority: HIGH)

**User Stories:**
- As a curler, I want to browse upcoming events by region and level
- As a curler, I want to register for events with my team
- As a curler, I want to make secure payments for event registration
- As an admin, I want to manage event details and registrations

**🔌 External Systems Integration (Critical):**

Event data comes from **multiple external sources** that must be synced into The Button platform:

1. **Curling.io API** (`https://api.curling.io/v1`)
   - Live scoring and competition data
   - Draw sheets and event schedules
   - API Key required: `CURLINGIO_API_KEY`
   - Rate limit: 100 requests/min
   - Sync: Event schedules, competition details, venue info

2. **CurlingZone XML Feeds** (Regional events)
   - XML feed parsing (no API key needed)
   - Regional filtering by province
   - Event schedules and results
   - Venue information
   - Sync method: Parse XML, filter by region/type/year

3. **CurlingReg Ecosystem** (`https://api.curlingreg.com/v1`)
   - Member registration data
   - Digital credentials (Apple/Google Wallet IDs)
   - Membership status verification
   - API Key required: `CURLINGREG_API_KEY`
   - Rate limit: 200 requests/min
   - **Integration with:**
     - **Interpodia**: Payment processing backend
     - **Uplifter**: Club operations and facility bookings

4. **TrustEvent** (`https://api.trustevents.com/v1`)
   - Event management platform
   - Registration handling
   - Ticketing integration
   - Bearer token auth: `TRUSTEVENTS_TOKEN`
   - Rate limit: 50 requests/min

**Database Schema Updates:**
- Add foreign key columns to `events` table:
  - `curling_io_id` (STRING, nullable)
  - `curlingzone_id` (STRING, nullable)
  - `trustevent_id` (STRING, nullable)
  - `curlingreg_id` (STRING, nullable)
- Create `event_sync_logs` table (track sync status)
- Create `event_registrations` (already exists, extend with payment data)
- Create `event_teams`, `event_participants`, `event_payments`

**Technical Requirements:**
- Event detail pages with dynamic routes (`/events/[id]`)
- Registration form with team selection
- Stripe payment integration (separate from Interpodia)
- Email confirmations
- QR code generation for event check-in
- Cancellation and refund handling
- **API sync service (Edge Function)**
- **Webhook handlers for real-time updates**
- **Rate limiting and error handling**
- **Conflict resolution (multiple sources for same event)**

**Estimated Time:** 3-4 weeks (extended due to external integrations)

---

### 2. Loyalty Program - Granite Circle (Priority: HIGH)

**User Stories:**
- As a curler, I want to earn points for participating in events
- As a curler, I want to see my tier status (Stone/Bronze/Silver/Gold)
- As a curler, I want to redeem points for rewards
- As a curler, I want to track my progress to the next tier

**Technical Requirements:**
- Loyalty dashboard page (`/dashboard/loyalty`)
- Points calculation engine
- Tier progression system
- Rewards catalog
- Redemption workflow
- Email notifications for tier upgrades

**Database Tables:**
- `loyalty_tiers` (Stone, Bronze, Silver, Gold)
- `loyalty_rewards` (rewards catalog)
- `user_loyalty_points` (user balances)
- `loyalty_transactions` (points earned/redeemed)
- `loyalty_redemptions` (reward claims)

**Estimated Time:** 1.5 weeks

---

### 3. Performance Tracking (Priority: MEDIUM)

**User Stories:**
- As an athlete, I want to log my shots after practice/games
- As an athlete, I want to see my performance trends over time
- As a coach, I want to review my athletes' performance
- As an athlete, I want to compare my stats with benchmarks

**Technical Requirements:**
- Shot logging interface
- Performance metrics calculations
- Charts and visualizations
- Historical data tracking
- Team performance aggregation

**Database Tables:**
- `performance_shots` (individual shot logs)
- `performance_sessions` (practice/game sessions)
- `performance_metrics` (calculated stats)
- `performance_goals` (user-set targets)

**Estimated Time:** 2 weeks

---

### 4. Team Management (Priority: MEDIUM)

**User Stories:**
- As a curler, I want to create and manage my teams
- As a skip, I want to invite teammates
- As a team member, I want to accept/decline invitations
- As a team, we want to view our collective schedule

**Technical Requirements:**
- Team creation wizard
- Invitation system with email notifications
- Team roster management
- Team event calendar
- Team messaging (Phase 2?)

**Database Tables:**
- `teams` (team information)
- `team_members` (roster)
- `team_invitations` (pending invites)
- `team_events` (team schedule)

**Estimated Time:** 1 week

---

### 5. Content Management System (Priority: LOW)

**User Stories:**
- As a user, I want to read news articles about curling
- As a user, I want to access learning resources
- As an admin, I want to publish and manage content
- As a user, I want to search for specific content

**Technical Requirements:**
- Article/post management
- Rich text editor for admins
- Image upload and optimization
- Content categorization
- Search functionality

**Database Tables:**
- `content_posts` (articles, news)
- `content_categories`
- `content_tags`
- `content_media` (images, videos)

**Estimated Time:** 1.5 weeks

---

## 🗓️ Phase 1 Sprint Plan

### Sprint 1 (Week 1-3): Event Registration & External Integrations
**Days 1-5:** External API integration infrastructure
- Create InteroperabilityService for unified API management
- Set up Supabase Edge Functions for API sync
- Configure rate limiting and error handling
- Test connections to Curling.io, CurlingZone, CurlingReg, TrustEvent

**Days 6-10:** Event data sync system
- Build sync service for Curling.io events
- Build XML parser for CurlingZone feeds
- Create event_sync_logs table
- Implement conflict resolution (multiple sources)
- Add foreign key columns (curling_io_id, curlingzone_id, etc.)
- Schedule automatic sync jobs

**Days 11-14:** Event detail pages
- Dynamic routing (`/events/[id]`)
- Event information display (synced from external sources)
- Registration button (check if event from TrustEvent or internal)

**Days 15-18:** Registration flow
- Team selection
- Registration form
- Validation
- Determine registration handler (TrustEvent vs internal)

**Days 19-21:** Payment integration
- Stripe setup (for internal events)
- TrustEvent webhook integration (for TrustEvent-managed events)
- Interpodia sync (for CurlingReg payments)
- Payment processing
- Confirmation emails
- QR codes

---

### Sprint 2 (Week 3): Loyalty Program
**Days 15-17:** Data model & logic
- Create loyalty tables
- RLS policies
- Points calculation engine
- Tier progression logic

**Days 18-21:** Loyalty dashboard
- Points balance display
- Tier progress visualization
- Recent transactions
- Available rewards catalog

**Days 22-24:** Redemption system
- Reward detail pages
- Redemption workflow
- Confirmation process
- Email notifications

---

### Sprint 3 (Week 4): Team Management & Performance
**Days 25-28:** Team features
- Team creation
- Invitation system
- Roster management
- Team pages

**Days 29-31:** Performance tracking (MVP)
- Shot logging interface
- Basic metrics display
- Performance history

---

### Sprint 4 (Week 5+): Polish & Content
- Content management system
- Performance tracking enhancements
- Bug fixes
- Testing
- Documentation

---

## 🛠️ Technical Implementation Details

### Event Data Integration Architecture

**The Button acts as a unified hub**, aggregating event data from multiple external sources:

```
┌─────────────────────────────────────────────────────────────┐
│                    THE BUTTON PLATFORM                       │
│  ┌──────────────────────────────────────────────────────┐  │
│  │          Unified Event Database (Supabase)           │  │
│  │  • events table (single source of truth)             │  │
│  │  • Foreign keys: curling_io_id, curlingzone_id, etc. │  │
│  │  • event_sync_logs (track sync status)              │  │
│  └────────────▲───────────▲──────────▲──────────▲───────┘  │
│               │           │          │          │           │
│  ┌────────────┴───────────┴──────────┴──────────┴───────┐  │
│  │     InteroperabilityService (Edge Functions)         │  │
│  │  • Rate limiting, error handling, retry logic        │  │
│  │  • Conflict resolution (same event, multiple sources)│  │
│  │  • Webhook handlers for real-time updates            │  │
│  └────────────┬───────────┬──────────┬──────────┬───────┘  │
└───────────────┼───────────┼──────────┼──────────┼──────────┘
                │           │          │          │
     ┌──────────▼─┐  ┌──────▼─────┐ ┌─▼────────┐ ┌▼─────────┐
     │ Curling.io │  │ CurlingZone│ │CurlingReg│ │TrustEvent│
     │    API     │  │  XML Feeds │ │Ecosystem │ │   API    │
     └────────────┘  └────────────┘ └──────────┘ └──────────┘
```

**Data Flow:**

1. **Scheduled Sync** (every 6 hours):
   - Edge Function fetches events from all sources
   - Compares with existing data (by external IDs)
   - Creates new events or updates existing
   - Logs sync status to `event_sync_logs`

2. **Real-time Updates** (webhooks):
   - Curling.io pushes live score updates
   - TrustEvent pushes registration changes
   - Webhook handlers validate and update database

3. **Conflict Resolution**:
   - If same event exists in multiple sources, prioritize by:
     1. TrustEvent (if registration managed there)
     2. Curling.io (for live scoring events)
     3. CurlingZone (for regional events)
     4. Manual entry (staff override)

**InteroperabilityService Pattern:**

```typescript
// lib/services/interoperability-service.ts
class InteroperabilityService {
  private apis: Map<string, APIConfig> = new Map();
  
  registerAPI(name: string, config: APIConfig) {
    this.apis.set(name, {
      ...config,
      rateLimit: new RateLimiter(config.rateLimit),
      retryPolicy: config.retryPolicy || defaultRetry
    });
  }
  
  async fetch(apiName: string, endpoint: string, options?: RequestOptions) {
    const api = this.apis.get(apiName);
    await api.rateLimit.wait(); // Respect rate limits
    
    try {
      const response = await fetch(`${api.baseUrl}${endpoint}`, {
        headers: this.buildHeaders(api),
        ...options
      });
      
      return await this.handleResponse(response);
    } catch (error) {
      return await this.retry(api, endpoint, options);
    }
  }
  
  async syncEvents(source: 'curlingio' | 'curlingzone' | 'curlingreg' | 'trustevent') {
    switch(source) {
      case 'curlingio':
        return await this.syncCurlingIO();
      case 'curlingzone':
        return await this.syncCurlingZone();
      // ... etc
    }
  }
}

export const interop = new InteroperabilityService();
```

### Event Registration Architecture

```typescript
// /app/(marketing)/events/[id]/page.tsx
export default async function EventDetailPage({ params }) {
  const event = await getEventById(params.id);
  const userTeams = await getUserTeams();
  
  return (
    <EventDetailLayout event={event}>
      <EventInfo />
      <EventSchedule />
      <RegistrationSection teams={userTeams} />
    </EventDetailLayout>
  );
}
```

### Loyalty Points Calculation

```typescript
// lib/loyalty/points-calculator.ts
export function calculateEventPoints(event: Event) {
  const basePoints = 100;
  const tierMultiplier = event.tier === 'national' ? 2 : 1;
  const completionBonus = 50;
  
  return basePoints * tierMultiplier + completionBonus;
}

export function determineTier(totalPoints: number): LoyaltyTier {
  if (totalPoints >= 10000) return 'gold';
  if (totalPoints >= 5000) return 'silver';
  if (totalPoints >= 2000) return 'bronze';
  return 'stone';
}
```

### Payment Processing Flow

```
1. User clicks "Register" → Validation
2. Stripe Checkout Session created
3. Redirect to Stripe Payment Page
4. Payment success → Webhook received
5. Registration confirmed in database
6. Email sent with QR code
7. User redirected to confirmation page
```

---

## 🔐 Security Considerations

### RLS Policies Needed

**Event Registrations:**
```sql
-- Users can view their own registrations
CREATE POLICY "Users can view own registrations"
  ON event_registrations FOR SELECT
  USING (user_id = current_user_id());

-- Users can create registrations
CREATE POLICY "Users can create registrations"
  ON event_registrations FOR INSERT
  WITH CHECK (user_id = current_user_id());

-- Admins can view all registrations
CREATE POLICY "Admins can view all registrations"
  ON event_registrations FOR SELECT
  USING (is_admin());
```

**Loyalty Points:**
```sql
-- Users can view their own loyalty data
CREATE POLICY "Users can view own loyalty"
  ON user_loyalty_points FOR SELECT
  USING (user_id = current_user_id());

-- System can update points (through service role)
-- Users cannot directly modify points
```

**Teams:**
```sql
-- Users can view teams they're members of
CREATE POLICY "Users can view own teams"
  ON teams FOR SELECT
  USING (
    id IN (
      SELECT team_id FROM team_members
      WHERE user_id = current_user_id()
    )
  );

-- Skip (position = 'skip') can manage team
CREATE POLICY "Skips can manage teams"
  ON teams FOR UPDATE
  USING (
    id IN (
      SELECT team_id FROM team_members
      WHERE user_id = current_user_id()
      AND position = 'skip'
    )
  );
```

---

## 📊 Success Metrics

### Event Registration
- ✅ 100% of existing events can be browsed
- ✅ Registration flow <5 steps
- ✅ Payment success rate >95%
- ✅ Email delivery rate 100%

### Loyalty Program
- ✅ Points awarded within 1 hour of event completion
- ✅ Tier progression visible in real-time
- ✅ Reward redemption <3 clicks
- ✅ 80% user engagement with loyalty dashboard

### Performance Tracking
- ✅ Shot logging <30 seconds
- ✅ Performance trends visible immediately
- ✅ Coach access to athlete data with permissions

### Team Management
- ✅ Team creation <2 minutes
- ✅ Invitation acceptance rate >70%
- ✅ Team roster accuracy 100%

---

## 🚀 Deployment Strategy

### Incremental Rollout
1. **Event Registration** - Deploy to staging, test with 10 internal users
2. **Loyalty Program** - Beta test with 50 curlers
3. **Performance Tracking** - Pilot with one high-performance team
4. **Team Management** - Open to all users
5. **Content System** - Admin-only testing first

### Testing Checklist
- [ ] Unit tests for all business logic
- [ ] Integration tests for payment flow
- [ ] E2E tests for registration journey
- [ ] Load testing (100 concurrent users)
- [ ] Security audit (RLS policies)
- [ ] Accessibility testing (WCAG 2.1 AA)

---

## 📝 Documentation Requirements

### User Documentation
- Event registration guide
- Loyalty program explainer
- Performance tracking tutorial
- Team management how-to

### Admin Documentation
- Event creation guide
- Loyalty rewards management
- User support procedures
- Content publishing guide

### Developer Documentation
- API endpoints
- Database schema
- RLS policy reference
- Testing procedures

---

## 🔄 Dependencies & Prerequisites

### From Phase 0 (Complete ✅)
- [x] RLS policies active
- [x] JWT authentication working
- [x] Database seeded
- [x] Dashboard layout deployed
- [x] Admin permissions configured

### External Services Needed
- [ ] **Curling.io API account**
  - API key for live scoring/events
  - Webhook endpoint for real-time updates
- [ ] **CurlingZone XML feeds**
  - No auth required
  - Document XML schema for parsing
- [ ] **CurlingReg API access**
  - API key for member data
  - Coordinate with Interpodia for payment sync
  - Coordinate with Uplifter for club operations
- [ ] **TrustEvent API access**
  - Bearer token authentication
  - Webhook endpoint for registration events
- [ ] Stripe account setup
- [ ] Stripe webhook configuration
- [ ] Email service (SendGrid/Mailgun)
- [ ] QR code generator service
- [ ] Image CDN (Cloudinary?)

### Environment Variables Needed
```env
# Event Data Sources
CURLINGIO_API_KEY=...
CURLINGIO_WEBHOOK_SECRET=...
CURLINGZONE_BASE_URL=https://curlingzone.com/feeds/...
CURLINGREG_API_KEY=...
TRUSTEVENT_TOKEN=...
TRUSTEVENT_WEBHOOK_SECRET=...

# Payments
STRIPE_PUBLIC_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
INTERPODIA_API_KEY=...

# Services
EMAIL_SERVICE_API_KEY=...
QR_CODE_SERVICE_URL=...
CLOUDINARY_URL=...
```

---

## 💡 Phase 1 vs Phase 2 Decisions

### Phase 1 (MVP)
- Basic event registration
- Simple loyalty points
- Manual shot logging
- Text-based content

### Phase 2 (Enhancements)
- Advanced event features (waitlists, discounts)
- Gamification (badges, leaderboards)
- AI shot analysis
- Rich media content
- Team messaging
- Live scoring integration

---

## 🎨 Design Mockups Needed

### Priority Pages
1. Event detail page with registration
2. Loyalty dashboard with tier progress
3. Shot logging interface
4. Team roster management
5. Content article layout

**Design System:** Continue using Curling Canada brand colors (red #E31837, blue #003DA5)

---

## 📞 Stakeholder Communication

### Weekly Updates
- Progress on event registration
- Loyalty program beta testing results
- User feedback from performance tracking
- Team creation statistics

### Key Decisions Needed
- Loyalty tier point thresholds (confirmed in seeding)
- Event registration cancellation policy
- Performance metrics to track (shots, accuracy, etc.)
- Content categories and taxonomy

---

## ✅ Phase 1 Completion Criteria

Phase 1 is complete when:
- [x] Users can browse and register for events
- [x] Payments process successfully through Stripe
- [x] Loyalty points are earned automatically
- [x] Users can view their tier and rewards
- [x] Athletes can log shots and view trends
- [x] Teams can be created and managed
- [x] Content can be published and viewed
- [x] All features pass security audit
- [x] 100% test coverage for critical paths
- [x] Documentation complete

---

**Next:** Kick off Sprint 1 with event registration implementation! 🚀
