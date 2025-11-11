# Phase 1: Legacy Page Migration - Kickoff

**Phase Duration**: 6-8 weeks  
**Start Date**: November 11, 2025  
**Target Completion**: January 5-19, 2026  
**Status**: 🟡 READY TO START

---

## Phase 1 Overview

With Phase 0 complete and the foundation deployed to staging, Phase 1 focuses on systematically migrating the 149 legacy pages from the Base44/Vite app to the new Next.js 14 + Clerk + Supabase architecture.

### Foundation Ready ✅
- ✅ Next.js 14.2.7 with standalone output
- ✅ Clerk authentication configured
- ✅ Supabase database with 98 tables (166+ entities)
- ✅ Custom Curling Canada UI theme
- ✅ 50+ shadcn/ui components
- ✅ Docker containerization
- ✅ Azure staging environment live
- ✅ Development environment working locally

---

## Migration Strategy

### Approach
1. **Prioritize by user impact** (high-traffic pages first)
2. **Batch by feature area** (e.g., all Events pages together)
3. **Incremental deployment** (deploy and test frequently)
4. **Parallel development** (multiple page migrations can happen simultaneously)

### Migration Process Per Page
1. **Analyze**: Review legacy component structure and data flow
2. **Design**: Plan Next.js app router structure
3. **Build**: Create new page with modern patterns
4. **Data**: Connect to Supabase schemas
5. **Auth**: Integrate Clerk for role-based access
6. **Test**: Local testing + staging deployment
7. **QA**: User acceptance testing
8. **Deploy**: Push to production

---

## Priority Batches

### Batch 1: Events & Competitions (Weeks 1-2) - HIGH PRIORITY
**Pages**: 12-15 pages  
**Business Impact**: Core functionality for users to discover and register for events

#### Pages to Migrate:
1. **Events Listing** (`/events`)
   - Filter by date, location, category
   - Search functionality
   - Paginated results
   - **Data**: events, competitions, venues tables

2. **Event Details** (`/events/[id]`)
   - Event information, schedule, venue
   - Registration CTA
   - Related events
   - **Data**: events, eventRegistrations, venues, draws tables

3. **Event Registration** (`/events/[id]/register`)
   - Multi-step registration form
   - Team selection/creation
   - Payment integration (if applicable)
   - **Data**: eventRegistrations, teams, teamMembers tables

4. **Competition Details** (`/competitions/[id]`)
   - Competition info and brackets
   - Teams competing
   - Schedule and results
   - **Data**: competitions, teams, draws, matches tables

5. **Event Calendar** (`/events/calendar`)
   - Month/week/day views
   - Filter by type and location
   - **Data**: events, competitions tables

6. **My Events** (`/dashboard/my-events`) [Authenticated]
   - User's registered events
   - Upcoming and past events
   - Registration status
   - **Data**: eventRegistrations, events, users tables

---

### Batch 2: Clubs & Membership (Weeks 3-4) - HIGH PRIORITY
**Pages**: 10-12 pages  
**Business Impact**: Connect users with clubs, manage memberships

#### Pages to Migrate:
1. **Clubs Directory** (`/clubs`)
   - Searchable/filterable club list
   - Map view of club locations
   - **Data**: clubs, venues tables

2. **Club Profile** (`/clubs/[id]`)
   - Club details, contact, facilities
   - Upcoming events at club
   - Membership options
   - **Data**: clubs, clubMemberships, clubOfficials, events tables

3. **Join Club** (`/clubs/[id]/join`)
   - Membership application form
   - Payment processing
   - **Data**: clubMemberships, users, clubs tables

4. **Club Dashboard** (`/dashboard/club`) [Club Admin]
   - Manage club info
   - View members
   - Post announcements
   - **Data**: clubs, clubMemberships, clubOfficials, announcements tables

5. **My Clubs** (`/dashboard/my-clubs`) [Authenticated]
   - User's club memberships
   - Membership status and renewal
   - **Data**: clubMemberships, clubs, users tables

---

### Batch 3: Teams & Athletes (Weeks 5-6) - MEDIUM PRIORITY
**Pages**: 15-18 pages  
**Business Impact**: Team management, athlete profiles, roster building

#### Pages to Migrate:
1. **Teams Directory** (`/teams`)
   - Browse teams by region, level
   - Search functionality
   - **Data**: teams, teamMembers, clubs tables

2. **Team Profile** (`/teams/[id]`)
   - Team details, roster, stats
   - Recent matches and results
   - **Data**: teams, teamMembers, athleteProfiles, teamSeasonStats tables

3. **Create Team** (`/teams/create`) [Authenticated]
   - Team creation wizard
   - Invite members
   - **Data**: teams, teamMembers tables

4. **Team Dashboard** (`/dashboard/team`) [Team Captain]
   - Manage roster
   - View schedule
   - Team stats
   - **Data**: teams, teamMembers, matches, teamSeasonStats tables

5. **Athlete Profile** (`/athletes/[id]`)
   - Athlete bio and stats
   - Team history
   - Achievements
   - **Data**: athleteProfiles, teamMembers, playerSeasonStats, achievements tables

6. **My Profile** (`/dashboard/profile`) [Authenticated]
   - Edit athlete profile
   - View personal stats
   - Manage privacy settings
   - **Data**: users, athleteProfiles, userSettings tables

---

### Batch 4: Draws & Scoring (Weeks 7-8) - MEDIUM PRIORITY
**Pages**: 12-15 pages  
**Business Impact**: Real-time scoring, match tracking, live updates

#### Pages to Migrate:
1. **Draw Schedule** (`/draws`)
   - Event draw schedules
   - Filter by sheet, time
   - **Data**: draws, matches, venues tables

2. **Live Scoring** (`/draws/[id]/score`)
   - End-by-end scoring
   - Shot-by-shot tracking
   - Real-time updates
   - **Data**: matches, endScores, shots tables

3. **Match Details** (`/matches/[id]`)
   - Final scores and stats
   - Shot-by-shot replay
   - Team/player stats
   - **Data**: matches, endScores, shots, matchStats, playerMatchStats tables

4. **Scorekeeper Dashboard** (`/dashboard/scorekeeper`) [Scorekeeper]
   - Active matches to score
   - Quick scoring interface
   - **Data**: matches, endScores, shots tables

---

### Batch 5: Performance Tools (Weeks 9-10) - SPECIALIZED
**Pages**: 10-12 pages  
**Business Impact**: Advanced analytics, Shot Tracker, Performance Center

#### Pages to Migrate:
1. **Performance Center** (`/performance`)
   - Personal performance dashboard
   - Stats comparison
   - Training insights
   - **Data**: playerSeasonStats, teamSeasonStats, rankings tables

2. **Shot Tracker** (`/performance/shot-tracker`)
   - Record practice shots
   - Shot accuracy analysis
   - Progress over time
   - **Data**: shots, playerMatchStats tables

3. **Rankings** (`/rankings`)
   - Player and team rankings
   - Filter by category, region
   - **Data**: rankings, playerSeasonStats, teamSeasonStats tables

4. **Achievements** (`/achievements`)
   - Personal and team achievements
   - Badges and milestones
   - **Data**: achievements, userAchievements, teamAchievements, badges tables

---

### Batch 6: Content & Community (Weeks 11-12) - LOWER PRIORITY
**Pages**: 15-20 pages  
**Business Impact**: News, articles, videos, social features

#### Pages to Migrate:
1. **News Hub** (`/news`)
   - Latest articles and updates
   - Filter by category
   - **Data**: articles, contentEngagement tables

2. **Article Page** (`/news/[slug]`)
   - Full article with media
   - Comments and reactions
   - **Data**: articles, comments, contentEngagement tables

3. **Video Library** (`/videos`)
   - Browse videos by category
   - Embedded player
   - **Data**: videos, contentEngagement tables

4. **Photo Gallery** (`/photos`)
   - Browse albums and photos
   - Lightbox view
   - **Data**: photos, albums tables

5. **Knowledge Base** (`/help`)
   - Searchable help articles
   - FAQs
   - **Data**: knowledgeBase, faqs tables

6. **Community Feed** (`/community`) [Authenticated]
   - User posts and activities
   - Follow users and teams
   - **Data**: posts, follows, activities, postLikes tables

---

### Remaining Batches (Weeks 13-16)
- **Batch 7**: Loyalty & Rewards (8-10 pages)
- **Batch 8**: Streaming & E-commerce (8-10 pages)
- **Batch 9**: Administration (10-12 pages)
- **Batch 10**: System & Settings (8-10 pages)

---

## Technical Implementation Patterns

### Page Structure Template
```typescript
// app/(authenticated)/[feature]/[page]/page.tsx
import { auth } from "@clerk/nextjs/server";
import { db } from "@/db/db";
import { featureTable } from "@/db/schema/feature";
import { eq } from "drizzle-orm";

export default async function Page({ params }: { params: { id: string } }) {
  const { userId } = await auth();
  
  // Fetch data from Supabase via Drizzle
  const data = await db
    .select()
    .from(featureTable)
    .where(eq(featureTable.id, params.id));

  return (
    <div>
      {/* Page content */}
    </div>
  );
}
```

### Data Fetching Strategy
- **Server Components**: Fetch data on server (preferred for SEO, performance)
- **Client Components**: Use for interactive features (forms, real-time updates)
- **API Routes**: For mutations, webhooks, third-party integrations
- **SWR/React Query**: For client-side data fetching and caching

### Authentication Patterns
```typescript
// Check if user is authenticated
const { userId } = await auth();
if (!userId) redirect("/login");

// Check user role (from Clerk metadata)
const { sessionClaims } = await auth();
const role = sessionClaims?.metadata?.role;

// Protect routes in middleware.ts
export default clerkMiddleware((auth, req) => {
  if (isProtectedRoute(req)) auth().protect();
});
```

---

## Migration Checklist (Per Page)

### Planning
- [ ] Analyze legacy component structure
- [ ] Identify data dependencies (which tables)
- [ ] Define route structure in Next.js app router
- [ ] Plan authentication requirements
- [ ] List required shadcn/ui components

### Development
- [ ] Create page file in app router
- [ ] Set up data fetching (Drizzle queries)
- [ ] Implement UI with shadcn/ui components
- [ ] Apply Curling Canada theme/branding
- [ ] Add authentication guards (if needed)
- [ ] Implement client-side interactions
- [ ] Add error handling and loading states
- [ ] Write basic tests (optional in Phase 1)

### Testing
- [ ] Test locally (http://localhost:3004)
- [ ] Verify data fetching works
- [ ] Test authentication flows
- [ ] Check responsive design (mobile, tablet, desktop)
- [ ] Test with different user roles
- [ ] Verify navigation and links

### Deployment
- [ ] Commit changes to git
- [ ] Build Docker image (if changed)
- [ ] Deploy to staging
- [ ] Smoke test on staging
- [ ] User acceptance testing
- [ ] Deploy to production (when ready)

---

## Success Metrics

### Phase 1 Goals
- Migrate **minimum 80 pages** (54% of 149 pages)
- Maintain **100% uptime** on staging
- Keep **page load times < 2 seconds**
- Achieve **zero data migration issues**
- Complete **Priority Batches 1-4** (core functionality)

### Weekly Targets
- **Week 1-2**: Events & Competitions (12-15 pages) ✅
- **Week 3-4**: Clubs & Membership (10-12 pages) ✅
- **Week 5-6**: Teams & Athletes (15-18 pages) ✅
- **Week 7-8**: Draws & Scoring (12-15 pages) ✅
- **Weeks 9-16**: Remaining batches as capacity allows

---

## Resources & Tools

### Documentation
- [Next.js App Router Docs](https://nextjs.org/docs/app)
- [Drizzle ORM Docs](https://orm.drizzle.team/)
- [Clerk Authentication Docs](https://clerk.com/docs)
- [shadcn/ui Components](https://ui.shadcn.com/)
- [Supabase Docs](https://supabase.com/docs)

### Development Environment
- **Local**: http://localhost:3004
- **Staging**: https://cca-staging.azurewebsites.net
- **Database**: Supabase Dashboard (ntqrqcmllkgrhwjreohn)
- **Auth**: Clerk Dashboard (summary-gull-20)

### Code References
- **Legacy App**: `/legacy/src/` folder
- **Database Schemas**: `/curling-canada-app/db/schema/`
- **Components**: `/curling-canada-app/components/`
- **Documentation**: `/docs/` folder

---

## Risk Management

### Potential Challenges
1. **Complex data migrations**: Some legacy features may require custom data transformation
2. **Authentication migration**: Moving users from Base44 to Clerk requires careful planning
3. **Real-time features**: Scoring and live updates need WebSocket or polling strategy
4. **Performance**: Large datasets (rankings, stats) need optimization
5. **Mobile responsiveness**: Ensure all pages work on mobile devices

### Mitigation Strategies
- **Incremental deployment**: Deploy small batches, get feedback early
- **Parallel environments**: Keep legacy app running during migration
- **Data validation**: Test all database queries thoroughly
- **Performance monitoring**: Use Application Insights to track page load times
- **User testing**: Involve stakeholders in UAT for each batch

---

## Next Steps (Week 1)

### Immediate Actions
1. **Review legacy Events pages** (analyze structure and data flow)
2. **Plan Events Listing page** (route, data queries, UI components)
3. **Create first migration** (`app/(marketing)/events/page.tsx`)
4. **Set up development workflow** (git branching strategy)
5. **Establish testing process** (local → staging → production)

### Week 1 Deliverables
- [ ] Events Listing page (`/events`) - Browse and filter events
- [ ] Event Details page (`/events/[id]`) - View event information
- [ ] Event Calendar view (`/events/calendar`) - Calendar interface
- [ ] Basic navigation between pages
- [ ] Deploy to staging for feedback

---

**Ready to Start Phase 1!** 🚀

The foundation is solid, the infrastructure is ready, and we have a clear roadmap. Let's begin migrating the 149 pages systematically, starting with the highest-impact features.
