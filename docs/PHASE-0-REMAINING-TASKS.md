# Phase 0 Remaining Tasks - Action Plan

**Status**: Infrastructure Deployed ✅ | Critical Tasks Pending 🔴  
**Updated**: November 11, 2025  
**Priority**: Complete before Phase 1 page migration

---

## Overview

Phase 0 infrastructure is successfully deployed, but several **critical** tasks remain before we can safely begin Phase 1 page migration. This document outlines what needs to be done and why.

---

## 🔴 CRITICAL TASKS (Must Complete)

### 1. Row Level Security (RLS) Policies ⚠️ SECURITY RISK

**Status**: Not implemented  
**Priority**: 🔴 CRITICAL  
**Estimated Time**: 2-3 days  
**Risk**: Without RLS, any authenticated user can read/write all data

#### Why This Matters
Currently, Supabase tables have no access control. This means:
- Any logged-in user can read ALL data (including other users' private info)
- Any logged-in user can modify or delete ANY data
- No protection against malicious users or bugs
- **Cannot go to production without this**

#### Tasks Required
```sql
-- Example RLS policies needed for users table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Users can read their own profile
CREATE POLICY "Users can view own profile"
ON users FOR SELECT
USING (auth.uid() = clerk_user_id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
ON users FOR UPDATE
USING (auth.uid() = clerk_user_id);

-- Admin users can view all profiles
CREATE POLICY "Admins can view all profiles"
ON users FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM user_permissions
    WHERE user_id = auth.uid()
    AND permission = 'admin'
  )
);
```

#### Implementation Checklist
- [ ] Document RLS strategy for each table type:
  - [ ] Public tables (events, clubs) - everyone can read
  - [ ] User-owned tables (profiles, settings) - owner only
  - [ ] Admin tables (permissions, logs) - admins only
  - [ ] Restricted tables (payments, private data) - strict rules
- [ ] Write RLS policies for all 98 tables
- [ ] Test policies with different user roles
- [ ] Document policies in `docs/database/RLS-POLICIES.md`
- [ ] Add RLS checks to migration scripts

#### Resources
- [Supabase RLS Documentation](https://supabase.com/docs/guides/auth/row-level-security)
- [RLS Best Practices](https://supabase.com/docs/guides/auth/row-level-security#best-practices)

---

### 2. Database Seeding

**Status**: Empty tables  
**Priority**: 🔴 HIGH  
**Estimated Time**: 2 days  
**Risk**: Features don't work without data; can't test properly

#### Why This Matters
- Home page shows empty states (no events, no clubs)
- Can't test search, filters, or listings
- Can't demo to stakeholders
- Can't validate database queries

#### Data Needed

##### Clubs (20-30 records)
```typescript
// Example club data structure
{
  id: uuid,
  name: "Toronto Curling Club",
  slug: "toronto-curling-club",
  province: "ON",
  city: "Toronto",
  address: "123 Curling Lane",
  postal_code: "M5H 2N2",
  phone: "(416) 555-0100",
  email: "info@torontocurling.ca",
  website: "https://torontocurling.ca",
  num_sheets: 6,
  has_leagues: true,
  has_lessons: true,
  created_at: timestamp,
  updated_at: timestamp
}
```

##### Events (30-50 records)
```typescript
// Mix of past, current, and upcoming events
{
  id: uuid,
  title: "Provincial Playdowns 2025",
  slug: "provincial-playdowns-2025",
  event_type: "competition",
  start_date: "2025-12-01",
  end_date: "2025-12-03",
  registration_deadline: "2025-11-15",
  venue_id: uuid, // link to venues table
  description: "...",
  max_teams: 16,
  registration_fee: 250.00,
  status: "upcoming",
  created_at: timestamp
}
```

##### Venues (15-20 records)
```typescript
{
  id: uuid,
  name: "Rogers Centre",
  address: "1 Blue Jays Way",
  city: "Toronto",
  province: "ON",
  postal_code: "M5V 1J1",
  capacity: 50000,
  num_sheets: 8,
  type: "arena"
}
```

##### Test Users (5-10 users)
```typescript
// Different roles for testing
[
  { email: "admin@curling.ca", role: "admin" },
  { email: "clubmanager@curling.ca", role: "club_manager" },
  { email: "athlete@curling.ca", role: "athlete" },
  { email: "coach@curling.ca", role: "coach" },
  { email: "member@curling.ca", role: "member" }
]
```

#### Implementation Steps
1. **Create seed script** (`db/seeds/initial-data.ts`)
   ```typescript
   import { db } from '@/db/db';
   import { clubs, events, venues, users } from '@/db/schema';
   
   async function seed() {
     // Insert clubs
     await db.insert(clubs).values(clubsData);
     
     // Insert venues
     await db.insert(venues).values(venuesData);
     
     // Insert events
     await db.insert(events).values(eventsData);
   }
   
   seed().then(() => console.log('✅ Database seeded'));
   ```

2. **Run seed script locally** to test
3. **Run seed script on staging** Supabase
4. **Verify data** in Supabase dashboard
5. **Test home page** to ensure events/clubs display

#### Checklist
- [ ] Create seed data files
- [ ] Write seed script
- [ ] Test locally
- [ ] Seed staging database
- [ ] Verify home page shows data
- [ ] Document seeding process

---

### 3. User Migration from Base44

**Status**: Not started  
**Priority**: 🔴 HIGH  
**Estimated Time**: 3-4 days  
**Risk**: Can't onboard existing users; lose community

#### Why This Matters
Curling Canada has existing users in Base44 system:
- User profiles
- Membership data
- Historical registrations
- Preferences and settings
- Need to migrate to Clerk + Supabase

#### Migration Strategy

##### Step 1: Analyze Base44 User Structure (1 day)
- [ ] Export Base44 user data (CSV/JSON)
- [ ] Document Base44 user fields
- [ ] Map Base44 fields → Supabase `users` table
- [ ] Identify required vs. optional data
- [ ] Determine role mapping

##### Step 2: Design Migration Process (1 day)
```typescript
// Migration flow
1. Export users from Base44
2. Create Clerk accounts (via API)
3. Insert user data into Supabase users table
4. Link Clerk ID to Supabase user record
5. Send password reset emails
6. Verify migration success

// Clerk User Creation API
POST https://api.clerk.com/v1/users
{
  email_address: ["user@example.com"],
  first_name: "John",
  last_name: "Doe",
  public_metadata: {
    base44_id: "12345",
    migrated_at: "2025-11-15"
  },
  private_metadata: {
    legacy_role: "member"
  }
}
```

##### Step 3: Write Migration Script (1 day)
```typescript
// scripts/migrate-users.ts
import { clerkClient } from '@clerk/nextjs/server';
import { db } from '@/db/db';
import { users } from '@/db/schema/users';

async function migrateUsers() {
  const base44Users = await loadBase44Users();
  
  for (const base44User of base44Users) {
    try {
      // 1. Create Clerk account
      const clerkUser = await clerkClient.users.createUser({
        emailAddress: [base44User.email],
        firstName: base44User.first_name,
        lastName: base44User.last_name,
        publicMetadata: {
          base44_id: base44User.id,
          migrated: true
        }
      });
      
      // 2. Create Supabase record
      await db.insert(users).values({
        clerk_user_id: clerkUser.id,
        email: base44User.email,
        first_name: base44User.first_name,
        last_name: base44User.last_name,
        phone: base44User.phone,
        date_of_birth: base44User.dob,
        legacy_base44_id: base44User.id
      });
      
      console.log(`✅ Migrated: ${base44User.email}`);
    } catch (error) {
      console.error(`❌ Failed: ${base44User.email}`, error);
    }
  }
}
```

##### Step 4: Test Migration (1 day)
- [ ] Test with 5-10 sample users
- [ ] Verify Clerk accounts created
- [ ] Verify Supabase records created
- [ ] Test login flow
- [ ] Verify data integrity

##### Step 5: Production Migration
- [ ] Schedule maintenance window
- [ ] Run full migration
- [ ] Send notification emails
- [ ] Monitor for issues
- [ ] Provide support for login issues

#### Checklist
- [ ] Export Base44 user data
- [ ] Document field mapping
- [ ] Write migration script
- [ ] Test with sample users
- [ ] Plan production cutover
- [ ] Prepare user communication

---

## 🟡 HIGH PRIORITY TASKS (Should Complete)

### 4. Dashboard Layout & Components

**Status**: Basic pages exist, no layout  
**Priority**: 🟡 HIGH  
**Estimated Time**: 2 days  

#### What's Needed
Currently `/dashboard` route exists but has no proper layout:
- No sidebar navigation
- No consistent structure
- No dashboard widgets

#### Implementation

##### Create Dashboard Layout
```typescript
// app/(authenticated)/dashboard/layout.tsx
import { DashboardSidebar } from '@/components/dashboard-sidebar';

export default function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen">
      <DashboardSidebar />
      <main className="flex-1 overflow-y-auto p-8">
        {children}
      </main>
    </div>
  );
}
```

##### Create Sidebar Component
```typescript
// components/dashboard-sidebar.tsx
import { Home, Calendar, Users, Trophy, Settings } from 'lucide-react';

const navItems = [
  { href: '/dashboard', icon: Home, label: 'Overview' },
  { href: '/dashboard/events', icon: Calendar, label: 'My Events' },
  { href: '/dashboard/teams', icon: Users, label: 'My Teams' },
  { href: '/dashboard/performance', icon: Trophy, label: 'Performance' },
  { href: '/dashboard/settings', icon: Settings, label: 'Settings' }
];

export function DashboardSidebar() {
  return (
    <aside className="w-64 border-r bg-muted/10">
      {/* Logo */}
      <div className="p-6">
        <h1 className="text-xl font-bold">Curling Canada</h1>
      </div>
      
      {/* Navigation */}
      <nav className="space-y-1 px-3">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted"
          >
            <item.icon className="h-5 w-5" />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}
```

#### Checklist
- [ ] Create dashboard layout component
- [ ] Build sidebar navigation
- [ ] Add dashboard overview page
- [ ] Create stat cards/widgets
- [ ] Test responsive design
- [ ] Update existing dashboard pages

---

### 5. Logo & Branding Assets

**Status**: Using placeholder  
**Priority**: 🟡 MEDIUM  
**Estimated Time**: 1 day  

#### Tasks
- [ ] Obtain official Curling Canada logo (SVG preferred)
- [ ] Update header logo (`components/curling-canada-header.tsx`)
- [ ] Update favicon (`app/favicon.ico`)
- [ ] Add hero images for home page
- [ ] Optimize images (next/image)
- [ ] Update metadata with correct images

---

### 6. Missing Pages (Remove 404 Errors)

**Status**: Header links to non-existent pages  
**Priority**: 🟡 MEDIUM  
**Estimated Time**: 1 day  

#### Current 404s
- `/live` - Live streaming
- `/sign-in` - Clerk default works, but custom page would be better
- `/sign-up` - Clerk default works, but custom page would be better  
- `/store` - Merchandise store
- `/about` - About Curling Canada

#### Options
1. **Remove links** from header (quick fix)
2. **Create placeholder pages** (1-2 hours each)
3. **Build full pages** (Phase 1 work)

#### Recommendation
- Remove `/live` and `/store` from nav (not Phase 0 features)
- Keep `/sign-in` and `/sign-up` using Clerk defaults
- Create simple `/about` page (30 minutes)

---

## 🟢 NICE TO HAVE TASKS (Optional)

### 7. Monitoring & Alerts
- [ ] Configure Application Insights alerts
- [ ] Set up error tracking
- [ ] Create performance dashboards

### 8. Automated Backups
- [ ] Configure Supabase automated backups
- [ ] Set up backup notifications
- [ ] Test restore process

### 9. Testing Infrastructure
- [ ] Set up Jest for unit tests
- [ ] Configure Playwright for E2E tests
- [ ] Write first test suite

---

## 📋 Recommended Completion Order

### Week 1: Security & Data Foundation (CRITICAL)
**Days 1-2**: Row Level Security Policies
- Research RLS best practices
- Write policies for all 98 tables
- Test thoroughly

**Days 3-4**: Database Seeding
- Create seed data
- Write seed scripts
- Populate staging database

**Day 5**: Testing & Validation
- Test RLS policies
- Verify seeded data
- Test queries and permissions

### Week 2: UI & User Experience
**Days 1-2**: Dashboard Layout
- Build sidebar and layout
- Create dashboard widgets
- Update existing dashboard pages

**Day 3**: Branding & Polish
- Update logo
- Add images
- Polish UI details

**Day 4**: Missing Pages
- Create/update pages
- Remove unnecessary nav links
- Test navigation

**Day 5**: User Migration Planning
- Document migration strategy
- Start migration script
- Test with sample data

---

## ✅ Definition of "Phase 0 Complete"

Phase 0 will be truly complete when:

1. **Security**: ✅ RLS policies implemented and tested
2. **Data**: ✅ Database seeded with realistic data
3. **UI**: ✅ Dashboard layout functional and branded
4. **Users**: ✅ Migration strategy documented and tested
5. **Testing**: ✅ Core functionality verified with real data
6. **Documentation**: ✅ All processes documented

**Then we can confidently begin Phase 1 page migration.**

---

## 🚀 Getting Started

### Next Immediate Action
1. **Review this document** with stakeholders
2. **Prioritize tasks** based on timeline
3. **Start with RLS policies** (most critical)
4. **Seed database** while working on RLS
5. **Build dashboard layout** in parallel
6. **Track progress** in PHASE-0-PROGRESS.md

### Questions to Answer
- Do we have access to Base44 user data for migration?
- What's the official Curling Canada logo and brand assets?
- What's the priority: security (RLS) or functionality (seeded data)?
- Should we wait to complete all tasks or proceed to Phase 1 incrementally?

---

**Last Updated**: November 11, 2025  
**Next Review**: After RLS implementation complete
