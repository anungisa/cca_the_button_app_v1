-- Quick Verification - Admin Permissions Setup
-- Run this in Supabase SQL Editor

-- ============================================================================
-- ✅ STEP 1: Verify both users exist
-- ============================================================================
SELECT 
  email,
  clerk_user_id,
  created_at,
  CASE 
    WHEN email = 'aubert.nungisa@curling.ca' THEN '🔑 Admin User'
    WHEN email = 'support@onelabtech.com' THEN '👤 Test User'
  END as user_type
FROM users 
WHERE email IN ('support@onelabtech.com', 'aubert.nungisa@curling.ca')
ORDER BY created_at DESC;


-- ============================================================================
-- ✅ STEP 2: Verify admin permission was granted
-- ============================================================================
SELECT 
  u.email,
  up.permission,
  up.granted_by,
  u.created_at
FROM user_permissions up
JOIN users u ON u.id = up.user_id
WHERE up.permission = 'admin';


-- ============================================================================
-- ✅ STEP 3: Show permissions for both users
-- ============================================================================
SELECT 
  u.email,
  COALESCE(up.permission, 'No admin permission') as permission_status
FROM users u
LEFT JOIN user_permissions up ON u.id = up.user_id AND up.permission = 'admin'
WHERE u.email IN ('support@onelabtech.com', 'aubert.nungisa@curling.ca')
ORDER BY u.email;


-- ============================================================================
-- ✅ STEP 4: Summary counts
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
  AND rowsecurity = true;


-- ============================================================================
-- ✅ STEP 5: Verify seeded data (check what exists)
-- ============================================================================
SELECT 
  'Clubs' as data_type,
  COUNT(*) as count
FROM clubs
UNION ALL
SELECT 
  'Events' as data_type,
  COUNT(*) as count
FROM events;


-- ============================================================================
-- ✅ SUCCESS INDICATORS
-- ============================================================================
-- Step 1: Should show 2 users with clerk_user_id populated
-- Step 2: Should show 1 row: aubert.nungisa@curling.ca with 'admin' permission
-- Step 3: Should show:
--   - aubert.nungisa@curling.ca: admin
--   - support@onelabtech.com: No admin permission
-- Step 4: Should show 2+ users, 1 admin, 13+ RLS enabled tables
-- Step 5: Should show 30 clubs, 20 events

-- ============================================================================
-- 🎉 IF ALL CHECKS PASS, YOU'RE READY TO TEST!
-- ============================================================================
-- Next: Login as both users and test the dashboard
-- - support@onelabtech.com: Regular user (limited access)
-- - aubert.nungisa@curling.ca: Admin user (full access)
