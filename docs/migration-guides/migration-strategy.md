# Migration Strategy

## Overview

This document outlines the phased approach to migrating the Curling Canada application from **Base44 + Vite/React** to **Next.js 14 + Clerk + Supabase**.

### Migration Approach: **Incremental Strangler Pattern**

We will use the **strangler fig pattern** to gradually replace the legacy system:
- Run both applications in parallel during migration
- Migrate features incrementally by priority
- Route traffic based on feature completion
- Minimize risk and enable rollback at any point

## Timeline Overview

| Phase | Duration | Features | Status |
|-------|----------|----------|--------|
| Phase 0: Foundation | 4-6 weeks | Auth, DB, Core UI | Not Started |
| Phase 1: Public Features | 6-8 weeks | Events, Streaming, About | Not Started |
| Phase 2: Loyalty & Engagement | 6-8 weeks | Points, Rewards, Social | Not Started |
| Phase 3: Club Management | 4-6 weeks | Clubs, Metrics, Surveys | Not Started |
| Phase 4: High Performance | 8-10 weeks | Athletes, Coaches, Tracking | Not Started |
| Phase 5: Business Operations | 8-10 weeks | Finance, Sponsors, Staff | Not Started |
| Phase 6: Admin & Compliance | 6-8 weeks | Governance, Compliance, System | Not Started |
| Phase 7: Optimization | 4-6 weeks | Performance, Testing, Polish | Not Started |

**Total Estimated Duration**: 46-62 weeks (~11-15 months)

## Phase 0: Foundation (Weeks 1-6)

### Goals
- Establish new application infrastructure
- Migrate authentication system
- Set up database and core schemas
- Build component library
- Establish CI/CD pipeline

### Deliverables

#### 1. Project Setup
- [ ] Initialize Next.js 14 App Router project
- [ ] Configure TypeScript (strict mode)
- [ ] Set up Tailwind CSS + shadcn/ui
- [ ] Configure ESLint + Prettier
- [ ] Set up Git workflow and branching strategy

#### 2. Authentication (Clerk)
- [ ] Install and configure Clerk
- [ ] Create middleware for route protection
- [ ] Build sign-in/sign-up pages
- [ ] Implement user profile management
- [ ] Map Base44 user roles to Clerk metadata
- [ ] Test SSO if required
- [ ] Migration script for existing users

**Code Example:**
```typescript
// middleware.ts
import { clerkMiddleware } from '@clerk/nextjs/server';

export default clerkMiddleware();

export const config = {
  matcher: ['/((?!_next|api/webhooks).*)'],
};
```

#### 3. Database Setup (Supabase + Drizzle ORM)
- [ ] Create Supabase project (or use existing PostgreSQL connection)
- [ ] Define schemas using Drizzle ORM (leveraging boilerplate structure)
- [ ] Configure `drizzle.config.ts` with DATABASE_URL
- [ ] Generate initial migrations with `npm run db:generate`
- [ ] Apply migrations with `npm run db:migrate`
- [ ] Set up Row Level Security (RLS) policies in Supabase dashboard
- [ ] Create database migration scripts for legacy data import
- [ ] Set up backup strategy

**Drizzle ORM Benefits (Already in Boilerplate):**
- Type-safe queries with IntelliSense
- Automatic TypeScript types from schema
- Migration management built-in
- Lightweight with no runtime overhead

**Code Example:**
```typescript
// db/schema/clubs.ts
import { pgTable, uuid, text, timestamp, integer } from "drizzle-orm/pg-core";

export const clubs = pgTable("clubs", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  province: text("province"),
  city: text("city"),
  memberCount: integer("member_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// db/queries/clubs.ts
import { db } from "@/db/db";
import { clubs } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getClubById(id: string) {
  return await db.select().from(clubs).where(eq(clubs.id, id)).limit(1);
}

export async function getAllClubs() {
  return await db.select().from(clubs).orderBy(clubs.name);
}
```

#### 4. Core UI Components (Leverage Boilerplate)
- [ ] Review 50+ shadcn/ui components already in boilerplate
- [ ] Customize theme in `tailwind.config.ts` for Curling Canada branding
- [ ] Build Layout components (Header, Sidebar, Footer) using boilerplate patterns
- [ ] Create navigation system (reference `components/sidebar.tsx` and `components/header.tsx`)
- [ ] Build error boundaries
- [ ] Loading states and skeletons (use `components/ui/skeleton.tsx`)
- [ ] Toast notifications (sonner already included)

**Components Already Available:**
- Button, Card, Dialog, Dropdown, Table, Tabs, Form, Input, Select, Badge, Avatar
- Calendar, Carousel, Checkbox, Collapsible, Command, Context Menu, Data Table
- Date Picker, Drawer, Alert, Accordion, Breadcrumb, Chart, Combobox, Toggle
- And 30+ more Radix UI primitives

#### 5. Core Infrastructure (Update for Azure)
- [ ] Set up environment variables management (.env.local, Azure Key Vault)
- [ ] Use Server Actions pattern from boilerplate (see `actions/` folder examples)
- [ ] Implement error handling middleware
- [ ] Set up logging (winston or pino)
- [ ] Performance monitoring (Application Insights for Azure instead of Vercel Analytics)
- [ ] Security headers configuration
- [ ] Configure Azure deployment pipeline (see Azure Deployment Guide)

**Server Actions Pattern from Boilerplate:**
```typescript
// actions/club-actions.ts (example)
"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/db/db";
import { clubs } from "@/db/schema";

export async function getClubs() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");
  
  return await db.select().from(clubs).orderBy(clubs.name);
}

export async function createClub(data: { name: string; province: string }) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");
  
  const [club] = await db.insert(clubs).values(data).returning();
  return club;
}
```

#### 6. Home Page Migration
- [ ] Migrate Home.jsx → app/(marketing)/page.tsx (use boilerplate structure)
- [ ] Rebuild landing page for non-authenticated users
- [ ] Build dashboard → app/dashboard/page.tsx (structure exists in boilerplate)
- [ ] Test role-based content rendering
- [ ] Leverage existing payment components if needed

### Success Criteria
- ✅ Users can sign up and sign in via Clerk
- ✅ Home page renders correctly for all user types
- ✅ Database connection established via Drizzle ORM
- ✅ Boilerplate components documented and customized
- ✅ Azure staging environment deployed
- ✅ CI/CD pipeline operational
- ✅ CI/CD pipeline deploying to staging

---

## Phase 1: Public Features (Weeks 7-14)

### Goals
- Migrate public-facing pages
- Establish patterns for data fetching
- Build event and streaming infrastructure

### Features to Migrate

#### Events (4 pages)
- [ ] Events listing page
- [ ] Event details page
- [ ] Event registration flow
- [ ] Live scoring page

#### Streaming (2 pages)
- [ ] Streaming hub
- [ ] Live stream player page

#### Content Pages (8 pages)
- [ ] About Curling
- [ ] Help Center
- [ ] Knowledge Base
- [ ] Knowledge Article Detail
- [ ] Terms of Service
- [ ] Terms of Use
- [ ] Privacy Policy
- [ ] Welcome page

#### Leaderboards & Competitions (4 pages)
- [ ] Leaderboards
- [ ] CTRSRankings
- [ ] LiveScoring (enhanced)
- [ ] Geo Challenge

### Technical Tasks
- [ ] Create Event entity API routes
- [ ] Implement streaming infrastructure
- [ ] Build search functionality
- [ ] Create SEO components (metadata)
- [ ] Implement ISR for content pages

### API Routes
```typescript
// app/api/events/route.ts
export async function GET(request: Request) {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .order('start_date', { ascending: true });
  
  if (error) return Response.json({ error }, { status: 500 });
  return Response.json(data);
}
```

### Success Criteria
- ✅ All public pages SEO-optimized (metadata, sitemap)
- ✅ Events searchable and filterable
- ✅ Streaming works on all devices
- ✅ Lighthouse score >95 for public pages

---

## Phase 2: Loyalty & Engagement (Weeks 15-22)

### Goals
- Migrate gamification system
- Build loyalty program infrastructure
- Implement social features

### Features to Migrate

#### Loyalty System (6 pages)
- [ ] Loyalty Program overview
- [ ] Reward Store
- [ ] Point Transaction history
- [ ] Leaderboards (enhanced)
- [ ] Mystery Box
- [ ] Youth Passport

#### Social Features (6 pages)
- [ ] Social Hub
- [ ] Social Thread (discussions)
- [ ] Community Hub
- [ ] Community Posts
- [ ] Social Connections
- [ ] Activity Feeds

#### Gamification (4 pages)
- [ ] XP Challenges
- [ ] Trivia Hub
- [ ] Hit Draw Tap game
- [ ] Governance Gamification

#### Fan Features (3 pages)
- [ ] Fan Pass
- [ ] FanOS dashboard
- [ ] Get Involved Hub

### Technical Tasks
- [ ] Design points/rewards schema
- [ ] Implement XP calculation engine
- [ ] Build notification system
- [ ] Create social post API
- [ ] Implement real-time features (Supabase Realtime)

### Database Schema
```sql
-- Loyalty Program
CREATE TABLE loyalty_programs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  points_multiplier DECIMAL DEFAULT 1.0,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE point_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  points INTEGER NOT NULL,
  reason TEXT,
  transaction_type TEXT, -- 'earn', 'spend', 'bonus'
  created_at TIMESTAMP DEFAULT NOW()
);

-- Social
CREATE TABLE social_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  content TEXT NOT NULL,
  post_type TEXT, -- 'thread', 'comment', 'post'
  parent_id UUID REFERENCES social_posts(id),
  likes_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Success Criteria
- ✅ Points earned and spent correctly
- ✅ Social posts real-time updates
- ✅ Gamification engaging and bug-free
- ✅ Mobile-optimized social feed

---

## Phase 3: Club Management (Weeks 23-28)

### Goals
- Enable club administrators
- Implement club-specific features
- Build membership management

### Features to Migrate

#### Club Pages (8 pages)
- [ ] Clubs directory
- [ ] Club profile/detail
- [ ] Smart Club Panel (admin)
- [ ] Club Metrics
- [ ] Club Services Hub
- [ ] Club Survey
- [ ] Club Licenses management
- [ ] FTLOC Hub (For The Love Of Curling)

### Technical Tasks
- [ ] Create Club entity and relationships
- [ ] Implement club membership management
- [ ] Build club admin permissions
- [ ] Create survey builder
- [ ] Club metrics dashboard
- [ ] License/subscription management

### Success Criteria
- ✅ Club admins can manage their clubs
- ✅ Members can join/leave clubs
- ✅ Surveys collect and display data
- ✅ Club metrics accurate and real-time

---

## Phase 4: High Performance (Weeks 29-38)

### Goals
- Migrate athlete and coach tools
- Implement performance tracking
- Integrate IoT devices (Smart Broom)

### Features to Migrate

#### Athlete Tools (8 pages)
- [ ] Athlete Dashboard
- [ ] Performance Center
- [ ] Shot Tracker (manual)
- [ ] On-Ice Shot Tracker (IoT)
- [ ] Smart Broom Hub
- [ ] HP Analytics Dashboard
- [ ] Coach-Athlete View
- [ ] National Teams

#### Coach Tools (5 pages)
- [ ] Coach Dashboard
- [ ] HP Teamworks integration
- [ ] Team Selection tools
- [ ] Next Gen Program
- [ ] HP Centers

#### Additional (4 pages)
- [ ] High Performance Hub
- [ ] Performance Benchmarks
- [ ] Patch Scanner
- [ ] Pledge Board

### Technical Tasks
- [ ] Design performance tracking schema
- [ ] Build shot tracking API
- [ ] Integrate Smart Broom API
- [ ] Create analytics dashboards (recharts)
- [ ] Implement coach-athlete relationships
- [ ] Build export features (CSV, PDF)

### Success Criteria
- ✅ Athletes can track all performance metrics
- ✅ Coaches can view athlete data
- ✅ Smart Broom data syncs correctly
- ✅ Analytics dashboards load <2s

---

## Phase 5: Business Operations (Weeks 39-48)

### Goals
- Migrate business and admin tools
- Enable federation operations
- Implement financial management

### Features to Migrate

#### Executive & Strategy (7 pages)
- [ ] Executive Dashboard
- [ ] Executive Hub
- [ ] Strategic Planning Hub
- [ ] Business Hub
- [ ] Dashboard (universal)
- [ ] Universal Dashboard
- [ ] Universal Hub

#### Finance (4 pages)
- [ ] Finance Hub
- [ ] Purchase History
- [ ] Subscription Management
- [ ] Donations

#### Sponsorship (8 pages)
- [ ] Sponsors directory
- [ ] Sponsor Dashboard
- [ ] Sponsorship HQ
- [ ] Sponsor Intelligence
- [ ] Partner Registration
- [ ] Partnership Ecosystem
- [ ] Revenue Opportunities
- [ ] Monetization Hub

#### Marketing & Communications (6 pages)
- [ ] Marketing Center
- [ ] Communications Center
- [ ] Content Management Hub
- [ ] Forms Hub
- [ ] Form Builder
- [ ] Form Renderer

#### Staff & Operations (7 pages)
- [ ] Staff HQ
- [ ] Staff HQ Assessment
- [ ] My Workspace
- [ ] Event Planning
- [ ] Event Plan Detail
- [ ] Event Ops Toolkit
- [ ] Teams Configuration

#### Reports & Analytics (5 pages)
- [ ] Reports Hub
- [ ] Analytics Center
- [ ] Self-Serve Analytics
- [ ] Survey Analytics
- [ ] MA Dashboard
- [ ] MA Insights

### Technical Tasks
- [ ] Create business entity schemas
- [ ] Implement sponsorship CRM
- [ ] Build financial reporting
- [ ] Create form builder (React Hook Form)
- [ ] Implement event planning tools
- [ ] Advanced analytics dashboards

### Success Criteria
- ✅ All business workflows functional
- ✅ Reports generate correctly
- ✅ Forms builder intuitive
- ✅ Financial data secure and accurate

---

## Phase 6: Admin & Compliance (Weeks 49-56)

### Goals
- Implement governance features
- Build compliance tools
- Create platform administration

### Features to Migrate

#### Governance & Compliance (9 pages)
- [ ] Governance & Compliance Hub
- [ ] SafeSport Hub (member)
- [ ] SafeSport Public
- [ ] DEI Hub
- [ ] Legal Compliance Hub
- [ ] Admin Compliance Dashboard
- [ ] Incident Management Hub
- [ ] Governance Gamification
- [ ] Trust Center

#### Platform Administration (11 pages)
- [ ] Platform Settings
- [ ] API Manager
- [ ] Developer Portal
- [ ] System Health
- [ ] System Architecture viewer
- [ ] Data Quality Dashboard
- [ ] Data Navigation Hub
- [ ] Data Strategy Assessment
- [ ] Business Glossary
- [ ] Deployment Guide
- [ ] Research Hub

#### People & Culture (3 pages)
- [ ] People & Culture Hub
- [ ] Personal Calendar
- [ ] Volunteer Context
- [ ] Federation Context

#### User Management (2 pages)
- [ ] Profile management
- [ ] Constituent 360 view

### Technical Tasks
- [ ] Implement audit logging
- [ ] Build incident management system
- [ ] Create API key management
- [ ] System health monitoring
- [ ] Data quality checks
- [ ] Platform settings UI
- [ ] Advanced permissions system

### Success Criteria
- ✅ All compliance workflows implemented
- ✅ Audit trails comprehensive
- ✅ Platform admin tools functional
- ✅ API management secure

---

## Phase 7: Optimization & Launch (Weeks 57-62)

### Goals
- Optimize performance
- Complete testing
- Plan launch and cutover

### Tasks

#### Performance Optimization
- [ ] Bundle size analysis and optimization
- [ ] Image optimization (next/image)
- [ ] Route prefetching strategy
- [ ] Database query optimization
- [ ] Implement caching strategy (Redis?)
- [ ] CDN configuration
- [ ] Lazy loading components

#### Testing
- [ ] Unit tests (Jest + React Testing Library)
- [ ] Integration tests (Playwright)
- [ ] E2E tests for critical flows
- [ ] Performance testing (Lighthouse CI)
- [ ] Security audit (OWASP)
- [ ] Accessibility audit (axe, WAVE)
- [ ] Load testing (k6)

#### Data Migration
- [ ] Export all Base44 data
- [ ] Transform data to new schema
- [ ] Import to Supabase
- [ ] Verify data integrity
- [ ] Test data relationships
- [ ] Migration rollback plan

#### Launch Preparation
- [ ] User acceptance testing (UAT)
- [ ] Staff training materials
- [ ] User migration guides
- [ ] DNS and routing configuration
- [ ] Monitoring and alerting setup
- [ ] Incident response plan
- [ ] Communication plan

### Success Criteria
- ✅ All tests passing (>90% coverage)
- ✅ Lighthouse score >95 across all pages
- ✅ Data migration successful (100% integrity)
- ✅ UAT approved by stakeholders
- ✅ Launch plan documented and approved

---

## Integration Migration Strategy

### Priority 1: Critical (Week 1-4 of each phase)
- Stripe payments
- Email (Mailchimp/transactional)
- Authentication (Clerk)
- File storage (Supabase Storage)

### Priority 2: High (Week 5-8 of relevant phases)
- CurlingIO data sync
- CTRS rankings
- YouTube video embedding
- SafeSport data

### Priority 3: Medium (Week 9-12)
- QuickBooks
- HubSpot CRM
- Teamworks
- Analytics platforms

### Priority 4: Lower (Post-launch)
- MongoDB sync
- DOMO sync
- Other analytics
- Legacy integrations

### Integration Pattern
```typescript
// app/api/integrations/curlingio/sync/route.ts
export async function POST(request: Request) {
  // 1. Authenticate request
  const session = await auth();
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 });
  
  // 2. Fetch from external API
  const data = await fetch('https://api.curlingio.com/v1/events', {
    headers: { 'Authorization': `Bearer ${process.env.CURLINGIO_API_KEY}` }
  });
  
  // 3. Transform data
  const transformed = transformCurlingIOData(await data.json());
  
  // 4. Upsert to Supabase
  const supabase = createServerClient();
  const { error } = await supabase
    .from('events')
    .upsert(transformed);
  
  // 5. Return result
  if (error) return Response.json({ error }, { status: 500 });
  return Response.json({ success: true, count: transformed.length });
}
```

---

## Risk Management

### High Risks

#### 1. Data Loss During Migration
**Mitigation:**
- Comprehensive backups before migration
- Parallel run period (both systems active)
- Real-time data sync during transition
- Rollback plan with data snapshots

#### 2. Authentication Issues
**Mitigation:**
- Thorough Clerk testing before user migration
- Support for legacy auth during transition
- Clear user communication
- Password reset flows tested

#### 3. Performance Degradation
**Mitigation:**
- Performance testing at each phase
- Load testing before launch
- CDN and caching strategy
- Monitoring and alerting

#### 4. Integration Failures
**Mitigation:**
- Test all integrations in staging
- Fallback mechanisms for each integration
- Clear error handling and logging
- Vendor communication plan

### Medium Risks

#### 5. User Adoption
**Mitigation:**
- User training materials
- In-app guidance and tooltips
- Gradual rollout by user group
- Feedback collection mechanism

#### 6. Timeline Overruns
**Mitigation:**
- Buffer time in estimates (20%)
- Weekly sprint reviews
- Priority-based feature delivery
- Scope management

---

## Success Metrics

### Technical Metrics
- **Performance**: Lighthouse score >95
- **Uptime**: 99.9% availability
- **Load Time**: <2s for 95th percentile
- **Bundle Size**: <500KB initial load
- **Test Coverage**: >85%

### User Metrics
- **Authentication Success Rate**: >99%
- **User Satisfaction**: >4.5/5
- **Support Tickets**: <10% increase during transition
- **User Retention**: >95% month-over-month

### Business Metrics
- **Zero Data Loss**: 100% data integrity
- **Feature Parity**: 100% of critical features
- **Cost Reduction**: Target 30% infrastructure savings
- **Time to Market**: New features 50% faster post-migration

---

## Rollback Plan

### Triggers for Rollback
- Critical security vulnerability discovered
- >5% data loss or corruption
- >50% increase in support tickets
- System downtime >4 hours
- Executive decision

### Rollback Procedure
1. **Immediate**: Switch DNS back to Base44 app
2. **Within 1 hour**: Restore latest database backup
3. **Within 4 hours**: Sync any new data back to Base44
4. **Within 24 hours**: Analyze root cause
5. **Within 1 week**: Create remediation plan

### Rollback Testing
- Monthly rollback drills during migration
- Document lessons learned
- Update runbooks

---

## Communication Plan

### Stakeholders
- Executive team: Monthly updates
- Development team: Daily standups
- End users: Bi-weekly emails
- Support team: Weekly training

### Channels
- Email updates
- In-app notifications
- Documentation site
- Slack/Teams announcements

### Key Messages
- Benefits of new system
- Timeline and expectations
- Training resources available
- Support contact information

---

## Post-Launch

### Week 1-2: Hypercare
- 24/7 monitoring
- Rapid response team
- Daily status updates
- Bug triage and fixes

### Month 1-3: Stabilization
- Performance optimization
- User feedback incorporation
- Minor feature enhancements
- Documentation updates

### Month 3-6: Enhancement
- New feature development
- Advanced integrations
- User experience improvements
- Technical debt reduction

---

**Last Updated**: November 10, 2025  
**Document Owner**: Development Lead  
**Review Cycle**: Weekly during migration
