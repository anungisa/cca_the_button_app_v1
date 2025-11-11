# Authentication Migration Guide

## Overview

Migrating from **Base44 built-in authentication** to **Clerk** authentication system.

---

## Base44 Authentication (Current)

### How It Works
```javascript
// Base44 handles auth automatically via SDK
import { createClient } from '@base44/sdk';

export const base44 = createClient({
  appId: "686ddd789691a323a1380fee",
  requiresAuth: true // SDK handles login redirects
});

// User state managed via XPContext
const { user } = useXP();
```

### Current User Flow
1. User visits app
2. Base44 SDK checks for session
3. If not authenticated → redirects to Base44 login page
4. After login → redirects back to app with token
5. SDK stores token (cookie/localStorage)
6. User data fetched and stored in XPContext

### User Object Structure (Base44)
```javascript
{
  id: "user_123...",
  email: "user@example.com",
  name: "John Doe",
  user_type: "athlete", // or "coach", "fan", "staff", etc.
  has_seen_onboarding: false,
  points: 1500,
  tier: "bronze",
  profile_image: "https://...",
  created_at: "2024-01-15T10:30:00Z",
  // ... other custom fields
}
```

---

## Clerk Authentication (Target)

### Setup

#### 1. Install Clerk
```bash
npm install @clerk/nextjs
```

#### 2. Environment Variables
```env
# .env.local
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/onboarding
```

#### 3. Wrap App with ClerkProvider
```typescript
// app/layout.tsx
import { ClerkProvider } from '@clerk/nextjs';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}
```

#### 4. Create Middleware
```typescript
// middleware.ts
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/profile(.*)',
  '/clubs(.*)',
  '/events/register(.*)',
  // ... add all protected routes
]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: ['/((?!_next|api/webhooks).*)'],
};
```

### New User Flow
1. User visits app
2. Clerk middleware checks for session
3. If not authenticated → redirects to `/sign-in`
4. User signs in via Clerk UI components
5. Clerk creates session (encrypted cookie)
6. Redirects to `/dashboard` or original destination
7. User metadata stored in Clerk + Supabase

---

## User Data Migration

### Strategy: Dual Storage

**Clerk** stores:
- Authentication credentials
- Basic profile (email, name, image)
- User metadata (role, preferences)
- Session management

**Supabase** stores:
- Extended user profile
- User-generated content
- Relationships (clubs, events, etc.)
- Points, rewards, achievements

### User Metadata in Clerk
```typescript
// Store custom data in Clerk metadata
interface ClerkUserMetadata {
  userType: 'athlete' | 'coach' | 'fan' | 'staff' | 'volunteer' | 'sponsor' | 'club_admin' | 'executive';
  hasSeenOnboarding: boolean;
  supabaseUserId: string; // Link to Supabase profile
  clubIds: string[]; // Quick access to user's clubs
  permissions: string[]; // e.g., ['staff_hq', 'admin_panel']
}

// Set metadata during sign-up or migration
await clerkClient.users.updateUserMetadata(userId, {
  publicMetadata: {
    userType: 'athlete',
    hasSeenOnboarding: false,
  },
  privateMetadata: {
    supabaseUserId: 'uuid-from-supabase',
    permissions: ['performance_center'],
  },
});
```

### Supabase User Profile Schema
```sql
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clerk_user_id TEXT UNIQUE NOT NULL, -- Link to Clerk
  email TEXT NOT NULL,
  full_name TEXT,
  user_type TEXT,
  
  -- Loyalty data
  total_points INTEGER DEFAULT 0,
  current_tier TEXT DEFAULT 'bronze',
  lifetime_points INTEGER DEFAULT 0,
  
  -- Profile details
  bio TEXT,
  avatar_url TEXT,
  phone TEXT,
  date_of_birth DATE,
  country TEXT,
  province TEXT,
  
  -- Preferences
  language TEXT DEFAULT 'en',
  timezone TEXT,
  email_notifications BOOLEAN DEFAULT true,
  push_notifications BOOLEAN DEFAULT false,
  
  -- Metadata
  has_seen_onboarding BOOLEAN DEFAULT false,
  last_login_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT
  USING (clerk_user_id = auth.jwt() ->> 'sub');

CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  USING (clerk_user_id = auth.jwt() ->> 'sub');
```

---

## Migration Steps

### Step 1: Export Base44 Users
```javascript
// scripts/export-users.js
import { base44 } from '../legacy/src/api/base44Client';
import { User } from '../legacy/src/api/entities';
import fs from 'fs';

async function exportUsers() {
  const users = await User.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      user_type: true,
      points: true,
      tier: true,
      has_seen_onboarding: true,
      created_at: true,
      // ... all fields
    },
  });
  
  fs.writeFileSync(
    'migration-data/users.json',
    JSON.stringify(users, null, 2)
  );
  
  console.log(`Exported ${users.length} users`);
}

exportUsers();
```

### Step 2: Create Clerk Users
```typescript
// scripts/import-to-clerk.ts
import { clerkClient } from '@clerk/nextjs/server';
import users from './migration-data/users.json';

async function importToClerk() {
  for (const user of users) {
    try {
      // Create user in Clerk
      const clerkUser = await clerkClient.users.createUser({
        emailAddress: [user.email],
        firstName: user.name?.split(' ')[0],
        lastName: user.name?.split(' ').slice(1).join(' '),
        publicMetadata: {
          userType: user.user_type,
          hasSeenOnboarding: user.has_seen_onboarding,
        },
        privateMetadata: {
          legacyUserId: user.id, // Keep reference to old ID
        },
      });
      
      console.log(`✓ Created Clerk user: ${user.email}`);
      
      // Store mapping for next step
      await saveUserMapping(user.id, clerkUser.id);
      
    } catch (error) {
      console.error(`✗ Failed to create ${user.email}:`, error);
    }
  }
}
```

### Step 3: Create Supabase Profiles
```typescript
// scripts/import-to-supabase.ts
import { createClient } from '@supabase/supabase-js';
import users from './migration-data/users.json';
import mappings from './migration-data/user-mappings.json';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function importToSupabase() {
  for (const user of users) {
    const clerkUserId = mappings[user.id];
    
    const { error } = await supabase
      .from('user_profiles')
      .insert({
        clerk_user_id: clerkUserId,
        email: user.email,
        full_name: user.name,
        user_type: user.user_type,
        total_points: user.points || 0,
        current_tier: user.tier || 'bronze',
        has_seen_onboarding: user.has_seen_onboarding || false,
        created_at: user.created_at,
      });
    
    if (error) {
      console.error(`✗ Failed to create profile for ${user.email}:`, error);
    } else {
      console.log(`✓ Created Supabase profile: ${user.email}`);
    }
  }
}
```

### Step 4: Send Password Reset Emails
```typescript
// scripts/send-migration-emails.ts
import { clerkClient } from '@clerk/nextjs/server';
import mappings from './migration-data/user-mappings.json';

async function sendMigrationEmails() {
  for (const [legacyId, clerkId] of Object.entries(mappings)) {
    try {
      // Send password reset email
      await clerkClient.users.sendPasswordResetEmail(clerkId);
      
      console.log(`✓ Sent password reset to user ${clerkId}`);
    } catch (error) {
      console.error(`✗ Failed to send email to ${clerkId}:`, error);
    }
  }
}
```

---

## Code Pattern Changes

### Before (Base44 + XPContext)
```javascript
// Component using Base44 auth
import { useXP } from '@/components/XPContext';

function MyComponent() {
  const { user, loyaltyData, isLoading } = useXP();
  
  if (isLoading) return <Loading />;
  if (!user) return <LoginPrompt />;
  
  return (
    <div>
      <h1>Welcome, {user.name}!</h1>
      <p>Points: {loyaltyData.points}</p>
      <p>Role: {user.user_type}</p>
    </div>
  );
}
```

### After (Clerk + Supabase)

#### Server Component (Recommended)
```typescript
// app/dashboard/page.tsx
import { auth, currentUser } from '@clerk/nextjs/server';
import { createServerClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId) redirect('/sign-in');
  
  // Get Clerk user
  const clerkUser = await currentUser();
  
  // Get Supabase profile
  const supabase = createServerClient();
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('clerk_user_id', userId)
    .single();
  
  return (
    <div>
      <h1>Welcome, {clerkUser?.firstName}!</h1>
      <p>Points: {profile?.total_points}</p>
      <p>Role: {profile?.user_type}</p>
    </div>
  );
}
```

#### Client Component
```typescript
// components/user-profile.tsx
'use client';

import { useUser } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import { createBrowserClient } from '@/lib/supabase/client';

export function UserProfile() {
  const { user, isLoaded } = useUser();
  const [profile, setProfile] = useState(null);
  
  useEffect(() => {
    if (user) {
      const supabase = createBrowserClient();
      supabase
        .from('user_profiles')
        .select('*')
        .eq('clerk_user_id', user.id)
        .single()
        .then(({ data }) => setProfile(data));
    }
  }, [user]);
  
  if (!isLoaded) return <LoadingSkeleton />;
  if (!user) return <SignInPrompt />;
  
  return (
    <div>
      <h1>Welcome, {user.firstName}!</h1>
      {profile && (
        <>
          <p>Points: {profile.total_points}</p>
          <p>Tier: {profile.current_tier}</p>
        </>
      )}
    </div>
  );
}
```

---

## Authentication Patterns

### Protect API Routes
```typescript
// app/api/user/profile/route.ts
import { auth } from '@clerk/nextjs/server';
import { createServerClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const { userId } = await auth();
  
  if (!userId) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('clerk_user_id', userId)
    .single();
  
  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
  
  return Response.json(data);
}
```

### Role-Based Access
```typescript
// lib/auth/permissions.ts
export async function requireRole(
  userId: string,
  allowedRoles: string[]
): Promise<boolean> {
  const user = await clerkClient.users.getUser(userId);
  const userType = user.publicMetadata.userType as string;
  
  return allowedRoles.includes(userType);
}

// Usage in API route
export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) return Response.json({ error: 'Unauthorized' }, { status: 401 });
  
  const hasAccess = await requireRole(userId, ['staff', 'admin']);
  if (!hasAccess) {
    return Response.json({ error: 'Forbidden' }, { status: 403 });
  }
  
  // ... staff-only logic
}
```

### Check Permissions in Components
```typescript
// components/staff-only-feature.tsx
import { auth } from '@clerk/nextjs/server';
import { requireRole } from '@/lib/auth/permissions';

export async function StaffOnlyFeature() {
  const { userId } = await auth();
  if (!userId) return null;
  
  const isStaff = await requireRole(userId, ['staff', 'admin']);
  if (!isStaff) return null;
  
  return (
    <div>
      <h2>Staff Only Content</h2>
      {/* ... */}
    </div>
  );
}
```

---

## Session Management

### Clerk Session
- Stored as encrypted HTTP-only cookie
- Automatic refresh on activity
- Configurable session lifetime
- Multi-session support (multiple devices)

### Configuration
```typescript
// middleware.ts
export default clerkMiddleware(async (auth, req) => {
  // Session options can be configured via Clerk Dashboard
  // or passed here as needed
  await auth.protect();
});

// In Clerk Dashboard, configure:
// - Session token lifetime: 1 hour (default)
// - Session lifetime: 7 days
// - Multi-session mode: enabled
```

---

## Testing Checklist

### Authentication Flows
- [ ] Sign up with email/password
- [ ] Sign in with email/password
- [ ] Sign out
- [ ] Password reset
- [ ] Email verification
- [ ] Social sign-in (Google, GitHub, etc.) - if enabled
- [ ] Session expiration handling
- [ ] Multi-device sign-in

### Authorization
- [ ] Protected routes redirect to sign-in
- [ ] API routes return 401 for unauthenticated
- [ ] Role-based access works correctly
- [ ] Permissions checked in all components

### Data Integrity
- [ ] Clerk user linked to Supabase profile
- [ ] User metadata synced correctly
- [ ] Points and tier preserved
- [ ] Onboarding status maintained
- [ ] User relationships (clubs, etc.) intact

### Edge Cases
- [ ] User tries to access after sign-out
- [ ] Session expires during activity
- [ ] Multiple tabs open
- [ ] Rapid sign-in/sign-out
- [ ] Network interruption during auth

---

## Rollback Plan

If Clerk migration fails:

1. **Switch DNS/routing back to Base44 app**
2. **Keep both systems running in parallel** during transition
3. **Data sync**: New data from Clerk → Base44 during parallel period
4. **User communication**: Inform users of temporary Base44 usage

---

## Support Resources

- [Clerk Documentation](https://clerk.com/docs)
- [Clerk Next.js Quickstart](https://clerk.com/docs/quickstarts/nextjs)
- [Clerk Migration Guide](https://clerk.com/docs/authentication/migration)

---

**Last Updated**: November 10, 2025  
**Status**: Ready for implementation
