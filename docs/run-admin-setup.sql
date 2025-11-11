-- Admin Setup for Curling Canada Users
-- Date: November 11, 2025
-- Test User: support@onelabtech.com
-- Admin User: aubert.nungisa@curling.ca

-- ============================================================================
-- STEP 1: Verify both users were created
-- ============================================================================
SELECT 
  id, 
  clerk_user_id, 
  email, 
  created_at,
  CASE 
    WHEN email = 'aubert.nungisa@curling.ca' THEN '🔑 Admin User'
    WHEN email = 'support@onelabtech.com' THEN '👤 Test User'
    ELSE '❓ Unknown'
  END as user_type
FROM users 
WHERE email IN ('support@onelabtech.com', 'aubert.nungisa@curling.ca')
ORDER BY created_at DESC;

-- Expected: 2 rows with clerk_user_id populated


-- ============================================================================
-- STEP 2: Grant admin permission to aubert.nungisa@curling.ca
-- ============================================================================
INSERT INTO user_permissions (user_id, permission, granted_by)
SELECT 
  id, 
  'admin', 
  id  -- Self-granted (using own user_id)
FROM users
WHERE email = 'aubert.nungisa@curling.ca'
  AND NOT EXISTS (
    SELECT 1 FROM user_permissions 
    WHERE user_id = users.id 
    AND permission = 'admin'
  );

-- Expected: 1 row inserted (or 0 if already exists)


-- ============================================================================
-- STEP 3: Verify admin permission was granted
-- ============================================================================
SELECT 
  u.email,
  u.clerk_user_id,
  up.permission,
  up.granted_by
FROM user_permissions up
JOIN users u ON u.id = up.user_id
WHERE u.email = 'aubert.nungisa@curling.ca';

-- Expected: 1 row showing 'admin' permission for aubert.nungisa@curling.ca


-- ============================================================================
-- STEP 4: View all users in system
-- ============================================================================
SELECT 
  email,
  clerk_user_id,
  created_at,
  CASE 
    WHEN email = 'aubert.nungisa@curling.ca' THEN '🔑 Admin'
    WHEN email = 'support@onelabtech.com' THEN '👤 Test User'
    ELSE '👥 Other User'
  END as user_type
FROM users
ORDER BY created_at DESC;


-- ============================================================================
-- STEP 5: Check if users have profiles
-- ============================================================================
SELECT 
  u.email,
  up.full_name,
  up.created_at as profile_created
FROM users u
LEFT JOIN user_profiles up ON u.id = up.user_id
WHERE u.email IN ('support@onelabtech.com', 'aubert.nungisa@curling.ca')
ORDER BY u.created_at DESC;


-- ============================================================================
-- STEP 6: Test RLS - Simulate regular user session
-- ============================================================================
-- Get clerk_user_id for support@onelabtech.com first
DO $$
DECLARE
  test_user_clerk_id TEXT;
BEGIN
  SELECT clerk_user_id INTO test_user_clerk_id 
  FROM users 
  WHERE email = 'support@onelabtech.com';
  
  RAISE NOTICE 'Test User Clerk ID: %', test_user_clerk_id;
  
  -- Set session to test user
  PERFORM set_config('request.jwt.claims', 
    json_build_object('sub', test_user_clerk_id)::text, 
    true);
END $$;

-- Try to view all users (should fail or return only self)
SELECT COUNT(*) as visible_users FROM users;

-- Try to view own profile (should work)
SELECT * FROM user_profiles 
WHERE user_id = (SELECT id FROM users WHERE email = 'support@onelabtech.com');

-- Reset session
RESET request.jwt.claims;


-- ============================================================================
-- STEP 7: Test RLS - Simulate admin user session
-- ============================================================================
-- Get clerk_user_id for aubert.nungisa@curling.ca
DO $$
DECLARE
  admin_user_clerk_id TEXT;
BEGIN
  SELECT clerk_user_id INTO admin_user_clerk_id 
  FROM users 
  WHERE email = 'aubert.nungisa@curling.ca';
  
  RAISE NOTICE 'Admin User Clerk ID: %', admin_user_clerk_id;
  
  -- Set session to admin user
  PERFORM set_config('request.jwt.claims', 
    json_build_object('sub', admin_user_clerk_id)::text, 
    true);
END $$;

-- View all users (should work for admin)
SELECT COUNT(*) as visible_users FROM users;

-- View all permissions (should work for admin)
SELECT 
  u.email,
  up.permission,
  up.granted_by
FROM user_permissions up
JOIN users u ON u.id = up.user_id
ORDER BY u.created_at DESC;

-- Reset session
RESET request.jwt.claims;


-- ============================================================================
-- STEP 8: Check seeded data is accessible
-- ============================================================================
SELECT 
  'Clubs' as table_name,
  COUNT(*) as record_count
FROM clubs
UNION ALL
SELECT 
  'Events' as table_name,
  COUNT(*) as record_count
FROM events
UNION ALL
SELECT 
  'Loyalty Tiers' as table_name,
  COUNT(*) as record_count
FROM loyalty_tiers
UNION ALL
SELECT 
  'Loyalty Rewards' as table_name,
  COUNT(*) as record_count
FROM loyalty_rewards
ORDER BY table_name;

-- Expected: 30 clubs, 20 events, 4 tiers, 15 rewards


-- ============================================================================
-- STEP 9: Verify RLS policies are active
-- ============================================================================
SELECT 
  tablename,
  policyname,
  CASE cmd
    WHEN 'r' THEN 'SELECT'
    WHEN 'a' THEN 'INSERT'
    WHEN 'w' THEN 'UPDATE'
    WHEN 'd' THEN 'DELETE'
    WHEN '*' THEN 'ALL'
  END as operation
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('users', 'user_profiles', 'user_permissions', 'event_registrations')
ORDER BY tablename, policyname;

-- Expected: Multiple policies per table


-- ============================================================================
-- SUMMARY REPORT
-- ============================================================================
SELECT 
  'Total Users' as metric,
  COUNT(*)::TEXT as value
FROM users
UNION ALL
SELECT 
  'Admin Users' as metric,
  COUNT(*)::TEXT as value
FROM user_permissions
WHERE permission = 'admin'
UNION ALL
SELECT 
  'RLS Enabled Tables' as metric,
  COUNT(*)::TEXT as value
FROM pg_tables
WHERE schemaname = 'public'
  AND rowsecurity = true
UNION ALL
SELECT 
  'Total RLS Policies' as metric,
  COUNT(*)::TEXT as value
FROM pg_policies
WHERE schemaname = 'public';
