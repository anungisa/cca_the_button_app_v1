# Admin Setup Instructions ⚡

**Date:** November 11, 2025  
**Users Created:**
- ✅ **Test User:** support@onelabtech.com
- ✅ **Admin User:** aubert.nungisa@curling.ca

---

## 🚀 Quick Setup (2 minutes)

### Step 1: Open Supabase SQL Editor
Navigate to: https://supabase.com/dashboard/project/YOUR_PROJECT_ID/sql

### Step 2: Run the Quick Setup Script
Copy and paste this SQL (from `ADMIN-SETUP-QUICK.sql`):

```sql
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
  'system'
FROM users
WHERE email = 'aubert.nungisa@curling.ca'
ON CONFLICT (user_id, permission) DO NOTHING;

-- 3. Verify admin permission
SELECT 
  u.email,
  up.permission,
  up.granted_at,
  up.granted_by
FROM user_permissions up
JOIN users u ON u.id = up.user_id
WHERE u.email = 'aubert.nungisa@curling.ca';
```

### Step 3: Verify Results

**Expected Output from Query 1:**
```
id  | clerk_user_id      | email                        | created_at
----|-------------------|------------------------------|------------
xxx | user_xxxxxxxxxxxxx | aubert.nungisa@curling.ca   | 2025-11-11...
xxx | user_xxxxxxxxxxxxx | support@onelabtech.com      | 2025-11-11...
```

**Expected Output from Query 2:**
```
Inserted 1 row
```
(Or "0 rows" if admin permission already exists)

**Expected Output from Query 3:**
```
email                      | permission | granted_at           | granted_by
---------------------------|-----------|----------------------|------------
aubert.nungisa@curling.ca | admin     | 2025-11-11 HH:MM:SS | system
```

---

## ✅ Success Criteria

After running the script:
- ✅ Both users appear in users table
- ✅ Both have clerk_user_id populated
- ✅ aubert.nungisa@curling.ca has 'admin' permission
- ✅ support@onelabtech.com remains regular user (no admin permission)

---

## 🧪 Test RLS Policies (Next Step)

### Test as Regular User (support@onelabtech.com)
1. Login at: https://cca-staging.azurewebsites.net/login
2. Navigate to dashboard
3. Try to view different sections
4. **Expected:** Can only see own data

### Test as Admin User (aubert.nungisa@curling.ca)
1. Login at: https://cca-staging.azurewebsites.net/login
2. Navigate to dashboard
3. Browse all sections
4. **Expected:** Can see all data across the system

### Run Comprehensive Tests
For detailed RLS testing, use the full script: `run-admin-setup.sql`

This includes:
- User verification queries
- RLS policy tests (simulating both user sessions)
- Seeded data verification
- Policy count validation
- Summary report

---

## 📊 What Happens After Admin Setup

### For aubert.nungisa@curling.ca (Admin):
- ✅ Access to all dashboard sections
- ✅ Can view all users in system
- ✅ Can view all event registrations
- ✅ Can view all orders and cart items
- ✅ Can manage permissions
- ✅ Can view all teams and members

### For support@onelabtech.com (Regular User):
- ✅ Access to own dashboard
- ✅ Can view own profile
- ✅ Can view own event registrations
- ✅ Can view own cart and orders
- ✅ Can view own teams
- ❌ Cannot see other users' data
- ❌ Cannot manage permissions
- ❌ Cannot access admin features

---

## 🔍 Troubleshooting

### Issue: Users not found
**Problem:** Query 1 returns no rows  
**Solution:** 
1. Check if users completed Clerk signup
2. Verify email addresses are correct
3. Check if webhook from Clerk to Supabase triggered
4. Manually check users table: `SELECT * FROM users;`

### Issue: clerk_user_id is NULL
**Problem:** User exists but clerk_user_id is empty  
**Solution:**
1. Check Clerk webhook configuration
2. Verify JWT configuration in Supabase
3. User may need to re-login to trigger webhook

### Issue: Admin permission not inserted
**Problem:** Query 2 fails with error  
**Solution:**
1. Check if user_permissions table exists
2. Verify user_id exists in users table
3. Check for unique constraint violations
4. Review error message for details

---

## 📁 Available Scripts

1. **`ADMIN-SETUP-QUICK.sql`** - Fast 3-query setup (use this first)
2. **`run-admin-setup.sql`** - Comprehensive testing suite (9 steps)
3. **`test-admin-setup.sql`** - Original generic template

---

## 🎯 Next Steps After Setup

1. ✅ Run ADMIN-SETUP-QUICK.sql in Supabase
2. ✅ Verify admin permission granted
3. ⏳ Login as both users and test navigation
4. ⏳ Test RLS policies (regular vs admin access)
5. ⏳ Verify seeded data is visible
6. ⏳ Test dashboard features
7. ⏳ Run comprehensive tests from run-admin-setup.sql

---

## 📞 Quick Links

- **Staging Site:** https://cca-staging.azurewebsites.net
- **Login:** https://cca-staging.azurewebsites.net/login
- **Supabase Dashboard:** https://supabase.com/dashboard
- **Clerk Dashboard:** https://dashboard.clerk.com

---

**Ready to run!** Open Supabase SQL Editor and paste the queries from `ADMIN-SETUP-QUICK.sql`. 🚀
