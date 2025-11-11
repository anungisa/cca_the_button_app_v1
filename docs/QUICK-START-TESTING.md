# Quick Start - Testing Phase 0 🚀

**Status:** ✅ Deployed and Ready  
**Date:** November 11, 2025

---

## 🌐 Access Staging

**URL:** https://cca-staging.azurewebsites.net  
**Browser:** Opened to signup page for you

---

## 📝 Quick Testing Steps (15 minutes)

### 1. Create Test Users (5 min)

**Regular User:**
```
Email: test@example.com
Password: [Your secure password]
```

**Admin User:**
```
Email: admin@example.com
Password: [Your secure password]
```

Navigate to: https://cca-staging.azurewebsites.net/signup

### 2. Grant Admin Permission (3 min)

1. Open Supabase SQL Editor
2. Get the admin user's clerk_user_id:
   ```sql
   SELECT clerk_user_id FROM users WHERE email = 'admin@example.com';
   ```
3. Grant admin permission:
   ```sql
   INSERT INTO user_permissions (user_id, permission, granted_by)
   SELECT id, 'admin', 'system'
   FROM users
   WHERE clerk_user_id = 'user_XXXXXXXXXX'; -- Replace with actual ID
   ```

### 3. Test Key Features (7 min)

**Desktop:**
- ✅ Login to dashboard
- ✅ Collapse/expand sidebar
- ✅ Navigate through all 9 menu items
- ✅ Check active states (red highlight)
- ✅ Test UserButton (profile menu)

**Mobile (resize browser):**
- ✅ Open hamburger menu
- ✅ Navigate using drawer
- ✅ Verify responsive layout

**Public Pages:**
- ✅ Browse clubs (/clubs)
- ✅ View events (/events)
- ✅ Read privacy policy (/privacy)

---

## 🎯 What's Working

✅ **All 9 pages return 200 OK**
- Home, Signup, Login, Privacy, Terms, Accessibility, Clubs, Events, Dashboard

✅ **Features Deployed**
- Auth fixes (signup/login routes)
- 3 footer pages (800-900 lines each)
- Dashboard layout (collapsible sidebar)
- 30 clubs seeded
- 20 events seeded
- 48 RLS policies active

---

## 📚 Detailed Documentation

- **Full Testing Guide:** `docs/TESTING-GUIDE.md`
- **SQL Scripts:** `test-admin-setup.sql`
- **Completion Report:** `docs/PHASE-0-HIGH-PRIORITY-COMPLETE.md`

---

## 🐛 Report Issues

If you find bugs, note:
1. Page URL
2. User type (regular/admin)
3. Expected behavior
4. Actual behavior
5. Browser console errors (F12)

---

## ✨ Next Steps

After testing:
1. Review results
2. Fix any bugs found
3. Plan Phase 1 features:
   - Event registration flow
   - Stripe payments
   - Loyalty program UI
   - Email notifications

---

**Questions?** Check `docs/TESTING-GUIDE.md` for comprehensive instructions.

**Ready to test!** 🎉
