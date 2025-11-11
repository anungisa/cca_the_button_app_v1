-- Verification Script - Check Admin Permissions
-- Run this in Supabase SQL Editor to verify setup

-- ============================================================================
-- 1. Check both users exist
-- ============================================================================
SELECT 
  email,
  clerk_user_id,
  created_at,
  CASE 
    WHEN email = 'aubert.nungisa@curling.ca' THEN '🔑 Should have admin'
    WHEN email = 'support@onelabtech.com' THEN '👤 Regular user'
  END as expected_role
FROM users 
WHERE email IN ('support@onelabtech.com', 'aubert.nungisa@curling.ca')
ORDER BY created_at DESC;

-- Expected: 2 rows


-- ============================================================================
-- 2. Check admin permission granted
-- ============================================================================
SELECT 
  u.email,
  up.permission,
  up.granted_by,
  u.created_at
FROM user_permissions up
JOIN users u ON u.id = up.user_id
WHERE up.permission = 'admin';

-- Expected: 1 row showing aubert.nungisa@curling.ca with 'admin' permission


-- ============================================================================
-- 3. Show all permissions for both users
-- ============================================================================
SELECT 
  u.email,
  COALESCE(up.permission, 'No permissions') as permission,
  up.granted_by
FROM users u
LEFT JOIN user_permissions up ON u.id = up.user_id
WHERE u.email IN ('support@onelabtech.com', 'aubert.nungisa@curling.ca')
ORDER BY u.email;

-- Expected: 
-- aubert.nungisa@curling.ca: admin
-- support@onelabtech.com: No permissions (or other permissions)


-- ============================================================================
-- 4. Verify RLS helper function works
-- ============================================================================
-- Test the current_user_id() function
SELECT current_user_id() as helper_function_result;

-- Expected: Should return NULL (no JWT in current session)


-- ============================================================================
-- 5. Count all users and admins
-- ============================================================================
SELECT 
  (SELECT COUNT(*) FROM users) as total_users,
  (SELECT COUNT(*) FROM user_permissions WHERE permission = 'admin') as admin_users,
  (SELECT COUNT(*) FROM users WHERE email LIKE '%@curling.ca') as curling_emails;

-- Expected: 2+ users, 1 admin, 1+ curling emails


-- ============================================================================
-- 6. Check if RLS is enabled on key tables
-- ============================================================================
SELECT 
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN ('users', 'user_profiles', 'user_permissions', 'event_registrations')
ORDER BY tablename;

-- Expected: All should show rls_enabled = true


-- ============================================================================
-- 7. Verify seeded data is accessible
-- ============================================================================
SELECT 
  'Clubs' as data_type,
  COUNT(*) as count
FROM clubs
UNION ALL
SELECT 
  'Events' as data_type,
  COUNT(*) as count
FROM events
UNION ALL
SELECT 
  'Loyalty Tiers' as data_type,
  COUNT(*) as count
FROM loyalty_tiers
UNION ALL
SELECT 
  'Loyalty Rewards' as data_type,
  COUNT(*) as count
FROM loyalty_rewards;

-- Expected: 30 clubs, 20 events, 4 tiers, 15 rewards


-- ============================================================================
-- ✅ SUCCESS CRITERIA
-- ============================================================================
-- If all queries return expected results:
-- ✅ Both users exist with clerk_user_id
-- ✅ aubert.nungisa@curling.ca has admin permission
-- ✅ support@onelabtech.com has no admin permission
-- ✅ RLS is enabled on all protected tables
-- ✅ Seeded data is accessible
-- ✅ Ready to test RLS policies with both users!
