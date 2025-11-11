-- Quick Admin Setup - Run this in Supabase SQL Editor
-- User: aubert.nungisa@curling.ca (Admin)
-- User: support@onelabtech.com (Test User)

-- 1. Verify users exist
SELECT 
  id, 
  clerk_user_id, 
  email, 
  created_at
FROM users 
WHERE email IN ('support@onelabtech.com', 'aubert.nungisa@curling.ca')
ORDER BY created_at DESC;

-- 2. Grant admin permission to aubert.nungisa@curling.ca
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

-- 3. Verify admin permission
SELECT 
  u.email,
  up.permission,
  up.granted_by,
  u.created_at
FROM user_permissions up
JOIN users u ON u.id = up.user_id
WHERE u.email = 'aubert.nungisa@curling.ca';

-- ✅ Expected Result: 1 row showing admin permission for aubert.nungisa@curling.ca
