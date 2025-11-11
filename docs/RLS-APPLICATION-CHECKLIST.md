# RLS Application Checklist

Use this checklist when applying RLS policies to Supabase.

---

## Pre-Application Setup

### 1. Clerk Configuration
- [ ] Log into [Clerk Dashboard](https://dashboard.clerk.com)
- [ ] Navigate to your Curling Canada app
- [ ] Go to **API Keys** section
- [ ] Copy **JWKS URL**: `_____________________________________`
- [ ] Copy **Issuer URL**: `_____________________________________`

### 2. Supabase Configuration
- [ ] Log into [Supabase Dashboard](https://supabase.com/dashboard)
- [ ] Select Curling Canada project
- [ ] Go to **Settings** → **API** → **JWT Settings**
- [ ] Enter Clerk JWKS URL in **JWT Secret** field
- [ ] Enter Clerk Issuer URL in **JWT Issuer** field
- [ ] Click **Save**
- [ ] Wait 30 seconds for configuration to propagate

### 3. Backup (Safety First!)
- [ ] In Supabase, go to **Settings** → **Database**
- [ ] Click **Create Backup**
- [ ] Note backup name: `_____________________________________`
- [ ] Wait for backup to complete (green checkmark)

---

## Phase 1: Critical Tables (13 tables)

### Apply Policies
- [ ] Open **SQL Editor** in Supabase
- [ ] Click **New Query**
- [ ] Open `curling-canada-app/db/rls-policies-phase1.sql` locally
- [ ] Copy **entire file contents** (Ctrl+A, Ctrl+C)
- [ ] Paste into Supabase SQL Editor
- [ ] Click **Run** (or press Ctrl+Enter)
- [ ] Wait for "Success" message (~30 seconds)
- [ ] Check for any error messages (red text)

### Verify Policies Created
- [ ] Go to **Authentication** → **Policies**
- [ ] Verify policies exist for:
  - [ ] `users` (4 policies)
  - [ ] `user_permissions` (3 policies)
  - [ ] `user_settings` (1 policy)
  - [ ] `clubs` (4 policies)
  - [ ] `club_officials` (3 policies)
  - [ ] `club_memberships` (5 policies)
  - [ ] `events` (6 policies)
  - [ ] `event_registrations` (5 policies)
  - [ ] `orders` (5 policies)
  - [ ] `order_items` (3 policies)
  - [ ] `cart_items` (1 policy)
  - [ ] `point_transactions` (3 policies)
  - [ ] `redemptions` (4 policies)

### Verify Indexes Created
- [ ] In SQL Editor, run:
```sql
SELECT indexname, tablename 
FROM pg_indexes 
WHERE tablename IN ('users', 'orders', 'events', 'cart_items')
AND indexname LIKE 'idx_%'
ORDER BY tablename;
```
- [ ] Should see ~13 indexes starting with `idx_`

---

## Testing Phase

### Create Test Users

#### Admin User
- [ ] Go to https://cca-staging.azurewebsites.net
- [ ] Sign up with email: `admin@test.curling.ca`
- [ ] Verify email in Clerk
- [ ] Copy Clerk User ID from Clerk Dashboard → Users
- [ ] In Supabase SQL Editor, run:
```sql
INSERT INTO user_permissions (user_id, permission_type, granted_by)
VALUES ('YOUR-CLERK-USER-ID-HERE', 'admin', 'system');
```
- [ ] Verify insertion succeeded
- [ ] Note Admin User ID: `_____________________________________`

#### Regular User
- [ ] Sign up with email: `user@test.curling.ca`
- [ ] Verify email in Clerk
- [ ] Copy Clerk User ID: `_____________________________________`
- [ ] Do NOT add to user_permissions (regular user)

#### Club Manager User
- [ ] Sign up with email: `manager@test.curling.ca`
- [ ] Verify email in Clerk
- [ ] Copy Clerk User ID: `_____________________________________`
- [ ] Will assign to club later (need seed data first)

### Test Authentication
- [ ] In SQL Editor, test auth function:
```sql
SELECT 
  auth.uid() as user_id,
  auth.email() as email;
```
- [ ] Should return your current user's Clerk ID and email
- [ ] If returns null, check JWT configuration in Step 2

### Test User Access (Regular User)

Log in as `user@test.curling.ca`, then test:

- [ ] **Can view own profile**: Open browser console, check Network tab for `/api/profile` or similar
- [ ] **Can view public events**: Go to home page, events should load
- [ ] **Can view clubs**: Public club list should be visible
- [ ] **Can add to cart**: Try adding a product (if e-commerce is set up)
- [ ] **CANNOT view other users**: Try accessing admin endpoints (should fail)

### Test Admin Access

Log in as `admin@test.curling.ca`, then test:

- [ ] **Can view all users**: Check if admin panel shows user list
- [ ] **Can view all orders**: Admin should see all orders (if any exist)
- [ ] **Can manage events**: Should be able to create/edit any event
- [ ] **Can manage clubs**: Should be able to edit any club

### SQL-Based Testing

Run these in SQL Editor while logged in as regular user:

```sql
-- Should return YOUR profile only
SELECT * FROM users WHERE clerk_user_id = auth.uid();
```
- [ ] Returns your profile: ✅

```sql
-- Should return EMPTY (can't see other users)
SELECT * FROM users WHERE clerk_user_id != auth.uid();
```
- [ ] Returns empty: ✅

```sql
-- Should return YOUR orders only
SELECT * FROM orders WHERE user_id = auth.uid();
```
- [ ] Returns your orders (or empty if none): ✅

```sql
-- Should return public events
SELECT * FROM events WHERE status = 'published';
```
- [ ] Returns events (or empty if none seeded yet): ✅

---

## Troubleshooting

### Issue: "permission denied for table users"
**What it means**: RLS is enabled but your JWT isn't configured  
**Actions**:
- [ ] Verified Clerk JWKS URL in Supabase? (Go back to Step 2)
- [ ] Waited 30 seconds after saving JWT settings?
- [ ] Logged out and back in to get fresh JWT?
- [ ] Checked browser console for JWT errors?

**Fix**:
- [ ] Re-check Supabase JWT Settings (Settings → API → JWT)
- [ ] Copy JWKS URL exactly from Clerk (no extra spaces)
- [ ] Restart your Next.js app to refresh Clerk connection
- [ ] Clear browser cookies and log in again

### Issue: "auth.uid() returns null"
**What it means**: Clerk JWT not being sent or not recognized  
**Actions**:
- [ ] Check NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY in .env
- [ ] Verify Clerk is loaded (check for Clerk badge in console)
- [ ] Check Network tab: look for Authorization header in requests
- [ ] Verify user is actually logged in (not just visiting public pages)

**Fix**:
- [ ] Log out completely from staging site
- [ ] Clear all cookies for cca-staging.azurewebsites.net
- [ ] Log in again
- [ ] Test auth.uid() in SQL Editor immediately after login

### Issue: "policies not showing up in dashboard"
**What it means**: SQL script had errors during execution  
**Actions**:
- [ ] Scroll up in SQL Editor output to find error message (red text)
- [ ] Common errors:
  - Table doesn't exist → Check table names match exactly
  - Syntax error → Missing semicolon or quote
  - Policy already exists → Tried to run script twice

**Fix**:
- [ ] Drop failed policies: `DROP POLICY IF EXISTS "policy_name" ON table_name;`
- [ ] Fix the error in SQL
- [ ] Re-run just the affected section (not entire file)

### Issue: "query performance is slow"
**What it means**: Indexes not created or policy is complex  
**Actions**:
- [ ] Check indexes exist: `SELECT * FROM pg_indexes WHERE tablename = 'users';`
- [ ] Run EXPLAIN on slow queries to see execution plan
- [ ] Check if policy has nested subqueries

**Fix**:
- [ ] Re-run index creation section of phase1 file
- [ ] Simplify policy logic if possible
- [ ] Consider caching permission checks in app layer

---

## Post-Application Monitoring

### First Hour
- [ ] Monitor Supabase logs: **Dashboard** → **Logs** → **Postgres Logs**
- [ ] Look for:
  - [ ] "permission denied" errors (expected for unauthorized access attempts)
  - [ ] "RLS check" messages (normal)
  - [ ] Any unexpected errors (investigate)
- [ ] Test basic user flows on staging site
- [ ] Verify no errors in browser console

### First 24 Hours
- [ ] Check Supabase logs twice (morning, evening)
- [ ] Monitor query performance: **Dashboard** → **Reports** → **Query Performance**
- [ ] Test with 2-3 real users (ask team to try staging site)
- [ ] Collect feedback on any access issues

### First Week
- [ ] Review all authorization errors in logs
- [ ] Identify any false positives (users blocked incorrectly)
- [ ] Adjust policies if needed (document changes)
- [ ] Verify performance is acceptable

---

## Phase 2 & 3 Planning

After Phase 1 is stable (24-48 hours), proceed with:

### Phase 2: High-Traffic Tables
- [ ] Create `rls-policies-phase2.sql` for:
  - teams, team_members
  - matches, draws
  - notifications, notification_preferences
  - messages, conversations
- [ ] Test in dev environment (if available)
- [ ] Apply to staging
- [ ] Monitor for 24 hours

### Phase 3: Remaining Tables
- [ ] Create `rls-policies-phase3.sql` for all remaining tables
- [ ] Group by domain (content, social, analytics, system)
- [ ] Apply section by section
- [ ] Full regression testing

---

## Success Criteria

### Phase 1 Complete When:
- [x] All 13 tables have RLS enabled
- [x] All policies applied without errors
- [x] Test users can access own data
- [x] Test users CANNOT access other users' data
- [x] Admin can access all data
- [x] Public tables accessible to all
- [x] No performance degradation
- [x] No errors in Supabase logs (except expected "permission denied")
- [x] Staging site works normally for authenticated users
- [x] 24-hour monitoring complete with no issues

### Ready for Next Steps:
- [ ] Phase 1 success criteria met
- [ ] Database seeding scripts created
- [ ] Seed data ready to apply
- [ ] Dashboard layout component designed
- [ ] Branding assets collected

---

## Emergency Rollback

**ONLY USE IF CRITICAL ISSUES**

### Disable RLS on All Phase 1 Tables
```sql
DO $$
DECLARE
  tbl text;
BEGIN
  FOR tbl IN 
    SELECT unnest(ARRAY[
      'users', 'user_permissions', 'user_settings', 'clubs', 
      'club_officials', 'club_memberships', 'events', 
      'event_registrations', 'orders', 'order_items', 
      'cart_items', 'point_transactions', 'redemptions'
    ])
  LOOP
    EXECUTE format('ALTER TABLE %I DISABLE ROW LEVEL SECURITY', tbl);
  END LOOP;
END $$;
```

### After Rollback
- [ ] Document what went wrong
- [ ] Fix policies in local file
- [ ] Test fixes in dev environment
- [ ] Re-apply when ready

---

## Completion Sign-Off

**Phase 1 RLS Applied By**: ______________________ **Date**: __________  
**Testing Completed By**: ______________________ **Date**: __________  
**Issues Encountered**: _____________________________________________  
**Resolution**: _____________________________________________________  
**Monitoring Period**: __________ to __________  
**Ready for Phase 2**: ☐ Yes  ☐ No (Reason: ________________________)

---

**Next Step**: Create database seed data (see PHASE-0-REMAINING-TASKS.md)
