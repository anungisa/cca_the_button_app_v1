-- Admin Setup & Testing Script
-- Run these queries in Supabase SQL Editor after creating test users

-- ============================================================================
-- STEP 1: Verify test users were created
-- ============================================================================
SELECT 
  id, 
  clerk_user_id, 
  email, 
  created_at,
  CASE 
    WHEN email LIKE '%admin%' THEN '🔑 Admin User'
    ELSE '👤 Regular User'
  END as user_type
FROM users 
WHERE email IN ('test@example.com', 'admin@example.com')
ORDER BY created_at DESC;

-- Expected: 2 rows returned with clerk_user_id populated


-- ============================================================================
-- STEP 2: Grant admin permission to admin user
-- ============================================================================
-- Replace 'YOUR_ADMIN_CLERK_USER_ID' with the actual clerk_user_id from step 1

INSERT INTO user_permissions (user_id, permission, granted_by)
SELECT 
  id, 
  'admin', 
  'system'
FROM users
WHERE clerk_user_id = 'YOUR_ADMIN_CLERK_USER_ID'; -- Replace this!

-- Expected: 1 row inserted


-- ============================================================================
-- STEP 3: Verify admin permission was granted
-- ============================================================================
SELECT 
  u.email,
  u.clerk_user_id,
  up.permission,
  up.granted_at,
  up.granted_by
FROM user_permissions up
JOIN users u ON u.id = up.user_id
WHERE up.permission = 'admin';

-- Expected: 1 row showing admin permission for admin@example.com


-- ============================================================================
-- STEP 4: Test regular user permissions (simulate regular user session)
-- ============================================================================
-- Replace with actual clerk_user_id for test@example.com

-- Set session to regular user
SET LOCAL request.jwt.claims TO '{"sub": "YOUR_TEST_USER_CLERK_USER_ID"}';

-- Try to view own profile (should succeed)
SELECT * FROM user_profiles 
WHERE user_id = (
  SELECT id FROM users WHERE clerk_user_id = 'YOUR_TEST_USER_CLERK_USER_ID'
);
-- Expected: 1 row (own profile)

-- Try to view ALL profiles (should fail or return only own)
SELECT COUNT(*) FROM user_profiles;
-- Expected: 1 (only own profile visible)

-- View public events (should succeed)
SELECT COUNT(*) FROM events WHERE is_public = true;
-- Expected: 20 (all public events)

-- Try to view all event registrations (should only see own)
SELECT COUNT(*) FROM event_registrations;
-- Expected: 0 or only own registrations

-- Try to view all users (should fail)
SELECT COUNT(*) FROM users;
-- Expected: Error or 1 (only self visible)


-- ============================================================================
-- STEP 5: Test admin user permissions (simulate admin session)
-- ============================================================================
-- Replace with actual clerk_user_id for admin@example.com

-- Set session to admin user
SET LOCAL request.jwt.claims TO '{"sub": "YOUR_ADMIN_CLERK_USER_ID"}';

-- View all users (should succeed for admin)
SELECT COUNT(*) FROM users;
-- Expected: 2+ (all users visible)

-- View all user profiles (should succeed)
SELECT COUNT(*) FROM user_profiles;
-- Expected: 2+ (all profiles visible)

-- View all event registrations (should succeed)
SELECT COUNT(*) FROM event_registrations;
-- Expected: All registrations visible

-- View all permissions (should succeed)
SELECT 
  u.email,
  up.permission,
  up.granted_at
FROM user_permissions up
JOIN users u ON u.id = up.user_id
ORDER BY up.granted_at DESC;
-- Expected: All permissions visible including admin permission


-- ============================================================================
-- STEP 6: Verify RLS policies are working
-- ============================================================================
-- Reset session
RESET request.jwt.claims;

-- Check which tables have RLS enabled
SELECT 
  schemaname,
  tablename,
  rowsecurity as "RLS Enabled"
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN (
    'users', 'user_profiles', 'user_permissions', 
    'event_registrations', 'cart_items', 'orders',
    'user_loyalty_points', 'loyalty_redemptions',
    'clubs', 'events', 'teams', 'team_members',
    'notifications'
  )
ORDER BY tablename;
-- Expected: All tables show "RLS Enabled = true"


-- ============================================================================
-- STEP 7: View all RLS policies
-- ============================================================================
SELECT 
  schemaname,
  tablename,
  policyname,
  CASE cmd
    WHEN 'r' THEN 'SELECT'
    WHEN 'a' THEN 'INSERT'
    WHEN 'w' THEN 'UPDATE'
    WHEN 'd' THEN 'DELETE'
    WHEN '*' THEN 'ALL'
  END as operation,
  roles,
  qual as "USING expression",
  with_check as "WITH CHECK expression"
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
-- Expected: 48 policies across 13 tables


-- ============================================================================
-- STEP 8: Check seeded data
-- ============================================================================
-- Clubs by province
SELECT 
  province,
  COUNT(*) as club_count
FROM clubs
GROUP BY province
ORDER BY club_count DESC;
-- Expected: 30 clubs across provinces

-- Events by status
SELECT 
  CASE 
    WHEN start_date > NOW() THEN 'Upcoming'
    ELSE 'Past'
  END as event_status,
  COUNT(*) as event_count
FROM events
GROUP BY event_status;
-- Expected: Mix of upcoming and past events (20 total)

-- Loyalty tiers
SELECT 
  name,
  min_points,
  benefits
FROM loyalty_tiers
ORDER BY min_points;
-- Expected: 4 tiers (Stone, Bronze, Silver, Gold)

-- Loyalty rewards
SELECT 
  name,
  points_cost,
  tier_required,
  is_active
FROM loyalty_rewards
WHERE is_active = true
ORDER BY points_cost;
-- Expected: 15 active rewards


-- ============================================================================
-- STEP 9: Test user data operations
-- ============================================================================
-- Create a test event registration as regular user
-- (Run this after setting session to test user)

-- First, get an event ID
SELECT id, name, start_date 
FROM events 
WHERE start_date > NOW() 
  AND is_public = true 
LIMIT 1;

-- Register for event (replace with actual event_id and user_id)
-- INSERT INTO event_registrations (
--   event_id,
--   user_id,
--   team_name,
--   payment_status
-- ) VALUES (
--   'EVENT_ID_HERE',
--   (SELECT id FROM users WHERE clerk_user_id = 'YOUR_TEST_USER_CLERK_USER_ID'),
--   'Test Team',
--   'pending'
-- );


-- ============================================================================
-- STEP 10: Clean up test data (optional - run at end of testing)
-- ============================================================================
-- Uncomment to delete test users and their data

-- Delete test event registrations
-- DELETE FROM event_registrations 
-- WHERE user_id IN (
--   SELECT id FROM users WHERE email IN ('test@example.com', 'admin@example.com')
-- );

-- Delete test user permissions
-- DELETE FROM user_permissions 
-- WHERE user_id IN (
--   SELECT id FROM users WHERE email IN ('test@example.com', 'admin@example.com')
-- );

-- Delete test user profiles
-- DELETE FROM user_profiles 
-- WHERE user_id IN (
--   SELECT id FROM users WHERE email IN ('test@example.com', 'admin@example.com')
-- );

-- Delete test users (Clerk users must be deleted separately in Clerk Dashboard)
-- DELETE FROM users 
-- WHERE email IN ('test@example.com', 'admin@example.com');


-- ============================================================================
-- HELPER QUERIES
-- ============================================================================

-- Get current user context
SELECT current_setting('request.jwt.claims', true) as jwt_claims;

-- View all active sessions
SELECT 
  pid,
  usename,
  application_name,
  client_addr,
  state,
  query_start,
  LEFT(query, 100) as current_query
FROM pg_stat_activity
WHERE datname = current_database()
  AND state = 'active'
ORDER BY query_start DESC;

-- Check table sizes
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC
LIMIT 20;
