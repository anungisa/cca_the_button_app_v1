# Quick Start: Apply RLS Policies to Supabase

## 🚀 5-Minute Setup

### Step 1: Get Clerk JWKS URL (2 min)
1. Go to [Clerk Dashboard](https://dashboard.clerk.com)
2. Select your Curling Canada app
3. Navigate to **API Keys**
4. Copy your **JWKS URL** (looks like: `https://curling-canada-*.clerk.accounts.dev/.well-known/jwks.json`)

### Step 2: Configure Supabase (3 min)
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your Curling Canada project
3. Navigate to **Settings** → **API** → **JWT Settings**
4. Add Clerk as JWT provider:
   - **JWT Secret**: Use the JWKS URL from Step 1
   - **JWT Issuer**: Your Clerk domain (e.g., `https://curling-canada-*.clerk.accounts.dev`)
5. Click **Save**

### Step 3: Apply Phase 1 Policies (30 min)
1. In Supabase Dashboard, go to **SQL Editor**
2. Click **New Query**
3. Copy the entire contents of `curling-canada-app/db/rls-policies-phase1.sql`
4. Paste into SQL Editor
5. Click **Run** (⌘/Ctrl + Enter)
6. Wait for completion (should take ~30 seconds)

### Step 4: Verify Policies (5 min)
1. Go to **Authentication** → **Policies** in Supabase Dashboard
2. You should see policies for these 13 tables:
   - users
   - user_permissions
   - user_settings
   - clubs
   - club_officials
   - club_memberships
   - events
   - event_registrations
   - orders
   - order_items
   - cart_items
   - point_transactions
   - redemptions

3. Each table should show 2-4 policies (e.g., "users_select_own", "users_update_own")

### Step 5: Test RLS (15 min)

#### Create Test Admin User
1. Sign up on staging site: https://cca-staging.azurewebsites.net
2. Get your Clerk User ID from Clerk Dashboard → Users
3. In Supabase SQL Editor, run:
```sql
-- Give yourself admin permission
INSERT INTO user_permissions (user_id, permission_type, granted_by)
VALUES ('your-clerk-user-id-here', 'admin', 'system');
```

#### Test User Access
1. Create another test user (regular user)
2. In SQL Editor, test queries:
```sql
-- This should work (viewing own profile)
SELECT * FROM users WHERE clerk_user_id = auth.uid();

-- This should fail (viewing other user's orders)
SELECT * FROM orders WHERE user_id = 'different-user-id';
```

#### Test in Application
1. Log in as regular user
2. Go to dashboard
3. You should only see your own data
4. Log out

5. Log in as admin
6. You should see all data (if admin permissions are set)

### ✅ Success Criteria
- [x] Supabase accepts Clerk JWTs
- [x] Phase 1 policies applied without errors
- [x] Test user can view own data
- [x] Test user CANNOT view other users' data
- [x] Admin user can view all data
- [x] Public tables (clubs, events) are readable by all

## 🐛 Troubleshooting

### Error: "permission denied for table users"
**Cause**: RLS is enabled but JWT not configured  
**Fix**: Complete Step 2 (Configure Supabase for Clerk JWTs)

### Error: "auth.uid() returns null"
**Cause**: Clerk JWT not being sent or not configured correctly  
**Fix**: 
1. Check that `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` is set in environment
2. Verify JWT is in request headers (check Network tab in browser)
3. Re-check Supabase JWT configuration

### Policies not showing up
**Cause**: SQL script had errors  
**Fix**: 
1. Check Supabase SQL Editor for error messages
2. Try running policy sections one at a time
3. Verify table names match exactly

### Performance issues
**Cause**: Missing indexes for policy checks  
**Fix**: The indexes are included at the bottom of `rls-policies-phase1.sql`. Verify they were created:
```sql
SELECT * FROM pg_indexes WHERE tablename IN ('users', 'orders', 'events');
```

## 📋 Next Steps After Phase 1

1. **Monitor for 24 hours**
   - Check Supabase logs for errors
   - Monitor query performance
   - Verify no unauthorized access

2. **Apply Phase 2** (High-traffic tables)
   - Create `rls-policies-phase2.sql`
   - Cover: teams, matches, draws, notifications
   - Test thoroughly

3. **Apply Phase 3** (Remaining tables)
   - Cover all remaining 72 tables
   - Group by domain for easier testing
   - Full regression testing

4. **Create Seed Data**
   - Now that RLS is in place, safe to add test data
   - Seed clubs, events, users, teams
   - Test that RLS works with real data

## 📚 Reference Files

- `curling-canada-app/db/rls-policies-phase1.sql` - Phase 1 policies (13 critical tables)
- `curling-canada-app/db/rls-policies.sql` - All 98 tables (reference)
- `docs/RLS-IMPLEMENTATION-GUIDE.md` - Comprehensive guide with troubleshooting

## ⏱️ Time Commitment

- **Initial setup**: 40 minutes (Steps 1-4)
- **Testing**: 15 minutes (Step 5)
- **Total Phase 1**: ~1 hour
- **Full RLS (all 98 tables)**: 2-3 days

## 🔐 Security Notes

- **NEVER disable RLS on production** (only as temporary debugging measure on staging)
- **Test policies thoroughly** before going to production
- **Monitor unauthorized access attempts** via Supabase logs
- **Review policies quarterly** as features evolve
- **Document any policy changes** in migration files

## 🎯 Remember

RLS is your **first line of defense** against unauthorized data access. Even if your application code has bugs, RLS ensures database-level security. This is critical for:
- User privacy (GDPR compliance)
- Payment data (PCI compliance)
- Competition integrity (preventing cheating)
- Club data security (protecting member information)

Take the time to implement RLS properly now. It's much harder to add later!
