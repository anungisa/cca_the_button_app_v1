# Row Level Security (RLS) Implementation Guide

## Overview
Implementing Row Level Security for 98 tables in Curling Canada database.

## ⚠️ CRITICAL: Clerk + Supabase Integration

### Authentication Flow
1. **Clerk** handles user authentication in Next.js app
2. **Clerk JWT** is sent to Supabase with each request
3. **Supabase** validates JWT and extracts user ID
4. **RLS policies** check user permissions

### Supabase + Clerk Configuration Required

Before applying RLS policies, you MUST configure Supabase to accept Clerk JWTs:

#### Step 1: Get Clerk JWKS URL
Your Clerk JWKS URL: `https://[YOUR_CLERK_DOMAIN]/.well-known/jwks.json`

For your app: Check Clerk Dashboard → API Keys → JWKS Endpoint

#### Step 2: Configure Supabase JWT Secret
In Supabase Dashboard:
1. Go to **Settings** → **API** → **JWT Settings**
2. Add Clerk as JWT provider:
   - Set **JWT Secret** to Clerk's public key (from JWKS)
   - Or configure custom JWT verification

#### Step 3: Update RLS Policies
Supabase provides these helper functions for Clerk:
- `auth.uid()` - Gets user ID from JWT (Clerk's `sub` claim)
- `auth.jwt()` - Full JWT payload access
- `auth.email()` - Gets email from JWT

### Table Mapping: Clerk User ID → Database
Your database uses: `clerk_user_id` column in `users` table

RLS policies will use:
```sql
-- Get current user's database record
WHERE clerk_user_id = auth.uid()
```

## Implementation Strategy

### Phase 1: Critical Tables (TODAY - 4 hours)
**Security Priority**: Tables with sensitive user data

1. **users** (30 min)
   - Users can view/edit own profile
   - Admins can view all users
   
2. **user_permissions** (30 min)
   - Users can view own permissions
   - Admins can manage all permissions
   
3. **clubs** (30 min)
   - Public read access
   - Club managers can edit their club
   
4. **events** (30 min)
   - Public read for published events
   - Organizers can manage their events
   
5. **orders** (30 min)
   - Users can only see their own orders
   
6. **point_transactions** (30 min)
   - Users can only see their own transactions

7. **cart_items** (30 min)
   - Users can only access their own cart

8. **Test Policies** (1 hour)
   - Create test users with different roles
   - Verify access controls work correctly

### Phase 2: High-Traffic Tables (DAY 2 - 4 hours)
**Performance Priority**: Tables accessed frequently

9. **teams** (1 hour)
10. **matches** (1 hour)
11. **draws** (1 hour)
12. **notifications** (1 hour)

### Phase 3: Remaining Tables (DAY 3 - Full Day)
All remaining tables grouped by domain:
- Content (articles, videos, photos)
- Statistics (player_stats, team_stats)
- Social (follows, posts, comments)
- System (analytics, logs, webhooks)

## How to Apply RLS Policies

### Method 1: Supabase SQL Editor (RECOMMENDED)
1. Go to Supabase Dashboard → **SQL Editor**
2. Create new query
3. Copy relevant sections from `rls-policies.sql`
4. Execute for each table group
5. Verify in **Authentication** → **Policies**

### Method 2: Direct Database Connection
```powershell
# Connect using psql
psql $env:DATABASE_URL

# Run policy file sections
\i db/rls-policies.sql
```

### Method 3: Drizzle Migration (FUTURE)
Create a migration file that can be version-controlled:
```typescript
// db/migrations/0001_add_rls_policies.ts
import { sql } from 'drizzle-orm';

export async function up(db) {
  await db.execute(sql`
    ALTER TABLE users ENABLE ROW LEVEL SECURITY;
    CREATE POLICY "Users can view own profile" ON users...
  `);
}
```

## Testing RLS Policies

### Test Scenario 1: User Can Access Own Data
```sql
-- Set session to test user
SET request.jwt.claims TO '{"sub": "user_123"}';

-- Should return user's own data
SELECT * FROM users WHERE clerk_user_id = auth.uid();

-- Should return empty (other user's data)
SELECT * FROM users WHERE clerk_user_id = 'user_456';
```

### Test Scenario 2: Admin Can Access All Data
```sql
-- Set session to admin user
SET request.jwt.claims TO '{"sub": "admin_1"}';

-- Should return all users (if admin_1 has admin permission)
SELECT * FROM users;
```

### Test Scenario 3: Public Read Access
```sql
-- No authentication
-- Should return published events
SELECT * FROM events WHERE status = 'published';

-- Should return empty (unpublished events)
SELECT * FROM events WHERE status = 'draft';
```

## Common Issues & Solutions

### Issue 1: "permission denied for table X"
**Cause**: RLS is enabled but no policies allow access
**Solution**: Verify policies are created correctly
```sql
-- Check existing policies
SELECT * FROM pg_policies WHERE tablename = 'users';
```

### Issue 2: "auth.uid() returns null"
**Cause**: JWT not properly configured or Clerk token not sent
**Solution**: 
- Verify Clerk JWT is in request headers
- Check Supabase JWT configuration
- Test with: `SELECT auth.uid(), auth.email();`

### Issue 3: "Infinite loops in policy checks"
**Cause**: Policy references same table it's on
**Solution**: Use `security_invoker` views or restructure policy
```sql
-- BAD: Can cause infinite loop
CREATE POLICY ... USING (
  EXISTS (SELECT 1 FROM users WHERE ...)
);

-- GOOD: Direct check
CREATE POLICY ... USING (clerk_user_id = auth.uid());
```

### Issue 4: "Performance degradation"
**Cause**: Complex policy checks on every query
**Solution**: 
- Add indexes on columns used in policies
- Simplify policy logic
- Cache permission checks in application layer

## Performance Optimization

### Index Recommendations
```sql
-- Speed up user lookups in policies
CREATE INDEX idx_users_clerk_id ON users(clerk_user_id);
CREATE INDEX idx_user_permissions_user_id ON user_permissions(user_id);
CREATE INDEX idx_club_officials_user_id ON club_officials(user_id, club_id);
CREATE INDEX idx_events_organizer ON events(organizer_id);
CREATE INDEX idx_orders_user_id ON orders(user_id);
```

### Policy Optimization
```sql
-- SLOW: Multiple subqueries
CREATE POLICY ... USING (
  EXISTS (SELECT 1...) OR
  EXISTS (SELECT 1...) OR
  EXISTS (SELECT 1...)
);

-- FAST: Single check with JOIN
CREATE POLICY ... USING (
  id IN (
    SELECT resource_id FROM permissions WHERE user_id = auth.uid()
  )
);
```

## Rollback Plan

If RLS causes issues, you can disable it temporarily:

```sql
-- Disable RLS on specific table
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- Drop all policies on table
DROP POLICY IF EXISTS "policy_name" ON users;

-- Re-enable after fixing
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
```

## Verification Checklist

After applying RLS policies:

- [ ] All 98 tables have RLS enabled
- [ ] Test user can access own data
- [ ] Test user CANNOT access other users' data
- [ ] Admin can access all data
- [ ] Public tables (events, clubs) are readable by all
- [ ] Protected tables (orders, transactions) are user-only
- [ ] Performance is acceptable (< 100ms for typical queries)
- [ ] No authentication errors in application logs
- [ ] Staging environment tested with real user flows

## Next Steps After RLS

1. **Database Seeding** (2 days)
   - Create realistic test data
   - Populate clubs, events, users
   - Test RLS with real data scenarios

2. **User Migration Planning** (3-4 days)
   - Map Base44 users to Clerk
   - Plan data migration strategy
   - Test migration with sample users

3. **Monitoring & Alerts** (1 day)
   - Set up RLS violation alerts
   - Monitor query performance
   - Log unauthorized access attempts

## Resources

- [Supabase RLS Documentation](https://supabase.com/docs/guides/auth/row-level-security)
- [Clerk + Supabase Integration](https://clerk.com/docs/integrations/databases/supabase)
- [PostgreSQL RLS Policies](https://www.postgresql.org/docs/current/ddl-rowsecurity.html)
- [Testing RLS Policies](https://supabase.com/docs/guides/auth/row-level-security#testing-policies)

## Time Estimate

- **Phase 1** (Critical tables): 4 hours
- **Phase 2** (High-traffic tables): 4 hours  
- **Phase 3** (Remaining tables): 8 hours
- **Testing & Verification**: 4-6 hours
- **Total**: 2-3 days (with testing)

## Contact for Help

If you encounter issues:
1. Check Supabase logs: Dashboard → Logs
2. Test policies in SQL Editor
3. Verify Clerk JWT configuration
4. Review this guide's troubleshooting section
