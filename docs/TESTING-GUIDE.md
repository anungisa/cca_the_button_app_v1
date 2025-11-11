# Testing Guide - Phase 0 Complete

**Date:** November 11, 2025  
**Status:** Ready for Testing  
**Staging URL:** https://cca-staging.azurewebsites.net

## ✅ Deployment Status

All Phase 0 high-priority features successfully deployed:
- ✅ Auth link fixes (/signup, /login)
- ✅ Footer pages (privacy, terms, accessibility)
- ✅ Dashboard layout (collapsible sidebar, mobile responsive)
- ✅ 13 route pages (clubs, events, teams, etc.)
- ✅ RLS policies (48 policies across 13 tables)
- ✅ Database seeding (30 clubs, 20 events, loyalty program)

## 📋 Testing Checklist

### Step 1: Create Test Users (5 minutes)

#### Regular User
1. Navigate to: https://cca-staging.azurewebsites.net/signup
2. Create account with:
   - **Email:** test@example.com (or your preferred test email)
   - **Password:** Strong password (save it!)
3. Complete Clerk registration flow
4. Verify redirect to dashboard
5. Test navigation:
   - Click through all sidebar items
   - Test collapse/expand sidebar (desktop)
   - Test mobile drawer menu (responsive)
   - Verify active states highlight correctly

#### Admin User
1. Navigate to: https://cca-staging.azurewebsites.net/signup
2. Create account with:
   - **Email:** admin@example.com (or your preferred admin email)
   - **Password:** Strong password (save it!)
3. Complete registration
4. Navigate to dashboard

### Step 2: Grant Admin Permission (5 minutes)

1. Open Supabase SQL Editor: https://supabase.com/dashboard/project/YOUR_PROJECT/sql
2. Get the Clerk user ID for admin user:
   ```sql
   SELECT id, clerk_user_id, email, created_at 
   FROM users 
   WHERE email = 'admin@example.com';
   ```
3. Copy the `clerk_user_id` value
4. Grant admin permission:
   ```sql
   INSERT INTO user_permissions (user_id, permission, granted_by)
   SELECT id, 'admin', 'system'
   FROM users
   WHERE clerk_user_id = 'user_XXXXXXXXXX'; -- Replace with actual clerk_user_id
   ```
5. Verify permission was granted:
   ```sql
   SELECT u.email, up.permission, up.granted_at
   FROM user_permissions up
   JOIN users u ON u.id = up.user_id
   WHERE up.permission = 'admin';
   ```

### Step 3: Test RLS Policies - Regular User (15 minutes)

**Login as:** test@example.com

#### Test Own Data Access (Should Succeed)
1. Navigate to Dashboard → My Events
2. Check browser DevTools Network tab for API calls
3. Verify you can view your own data

#### Test Database Queries in Supabase
Switch to test user's role in Supabase SQL Editor:
```sql
-- Set session to test user (get their user_id first)
SET LOCAL request.jwt.claims TO '{"sub": "YOUR_CLERK_USER_ID"}';

-- Try to view own profile (should work)
SELECT * FROM user_profiles 
WHERE user_id = (SELECT id FROM users WHERE clerk_user_id = 'YOUR_CLERK_USER_ID');

-- Try to view other users' profiles (should fail or return empty)
SELECT * FROM user_profiles 
WHERE user_id != (SELECT id FROM users WHERE clerk_user_id = 'YOUR_CLERK_USER_ID');

-- View public events (should work)
SELECT * FROM events 
WHERE is_public = true;

-- Try to view all event registrations (should only see own)
SELECT * FROM event_registrations;
```

#### Test Create Operations
1. Navigate to Events page
2. Try to register for an event (if registration is implemented)
3. Verify registration appears in your dashboard
4. Check in Supabase:
   ```sql
   SELECT * FROM event_registrations 
   WHERE user_id = (SELECT id FROM users WHERE clerk_user_id = 'YOUR_CLERK_USER_ID');
   ```

### Step 4: Test RLS Policies - Admin User (15 minutes)

**Login as:** admin@example.com

#### Test Admin Access (Should Succeed)
1. Navigate through dashboard
2. Admin should see additional data/features

#### Test Database Queries in Supabase
```sql
-- Set session to admin user
SET LOCAL request.jwt.claims TO '{"sub": "YOUR_ADMIN_CLERK_USER_ID"}';

-- View all users (should work for admin)
SELECT COUNT(*) FROM users;
-- Expected: 2+ users

-- View all event registrations (should work for admin)
SELECT COUNT(*) FROM event_registrations;
-- Expected: All registrations visible

-- View all user_permissions (should work for admin)
SELECT u.email, up.permission, up.granted_at
FROM user_permissions up
JOIN users u ON u.id = up.user_id;
-- Expected: At least admin permission visible

-- Admin can read/modify data across tables
SELECT * FROM clubs LIMIT 5;
SELECT * FROM events LIMIT 5;
SELECT * FROM loyalty_tiers;
SELECT * FROM loyalty_rewards;
```

### Step 5: Test UI/UX Features (10 minutes)

#### Desktop Testing
- ✅ Sidebar expands/collapses smoothly
- ✅ Active menu items highlighted in red
- ✅ Descriptions appear on hover/when active
- ✅ Red dot indicator on active item
- ✅ UserButton (profile menu) works
- ✅ "View Site" button navigates to home
- ✅ All navigation links work

#### Mobile Testing (Resize browser to <768px)
- ✅ Sidebar hidden on mobile
- ✅ Hamburger menu appears
- ✅ Sheet drawer opens/closes
- ✅ Navigation works in drawer
- ✅ Drawer closes after navigation
- ✅ Responsive layout looks good

#### Footer Pages
- ✅ Privacy policy loads with proper formatting
- ✅ Terms of service loads with sections
- ✅ Accessibility statement loads completely
- ✅ All use consistent Card design
- ✅ Contact information visible

#### Public Pages
- ✅ Home page loads with CTAs
- ✅ Clubs page shows 30 clubs grouped by province
- ✅ Events page shows upcoming/past events
- ✅ Navigation header works
- ✅ Footer links work

### Step 6: Performance Testing (5 minutes)

1. Open Chrome DevTools → Lighthouse
2. Run audit on key pages:
   - Home: https://cca-staging.azurewebsites.net/
   - Dashboard: https://cca-staging.azurewebsites.net/dashboard
   - Clubs: https://cca-staging.azurewebsites.net/clubs
3. Target scores:
   - Performance: >80
   - Accessibility: >90
   - Best Practices: >90
   - SEO: >90

## 🐛 Known Issues / Limitations

- Dashboard sub-pages (events, teams, loyalty, etc.) are placeholders
- No actual event registration flow yet
- No payment processing yet
- No email notifications yet
- Loyalty points display is placeholder
- Performance analytics not implemented

## 📊 Expected Results

### Successful Test Criteria
- ✅ All pages return 200 status
- ✅ Test users created successfully
- ✅ Admin permission granted
- ✅ Regular user can only see own data
- ✅ Admin user can see all data
- ✅ Dashboard navigation smooth
- ✅ Mobile responsive works
- ✅ No console errors
- ✅ RLS policies enforcing security

### RLS Policy Verification
Regular users should:
- ✅ See own user profile
- ✅ See own event registrations
- ✅ See own cart items
- ✅ See own orders
- ❌ NOT see other users' data
- ✅ See public events/clubs

Admin users should:
- ✅ See all users
- ✅ See all registrations
- ✅ See all orders
- ✅ See all permissions
- ✅ Modify any data

## 🚀 Next Steps After Testing

### Immediate (Phase 0 Cleanup)
1. Fix any bugs found during testing
2. Optimize slow queries
3. Add loading states where needed
4. Improve error handling

### Short-term (Phase 1 Features)
1. Build event registration flow
2. Implement Stripe payment processing
3. Create loyalty points display
4. Add email notifications
5. Build performance analytics dashboard
6. Implement team management features

### Medium-term (Phase 2 Features)
1. Live streaming integration
2. E-commerce store (merchandise)
3. Content management system
4. Mobile app (React Native)
5. Advanced analytics
6. Social features

## 📝 Test Results Log

### Test Date: _______________
**Tester:** _______________

#### Page Load Tests
- [ ] Home page (/)
- [ ] Signup (/signup)
- [ ] Login (/login)
- [ ] Privacy (/privacy)
- [ ] Terms (/terms)
- [ ] Accessibility (/accessibility)
- [ ] Clubs (/clubs)
- [ ] Events (/events)
- [ ] Dashboard (/dashboard)

#### User Creation
- [ ] Regular user created: _______________
- [ ] Admin user created: _______________
- [ ] Admin permission granted
- [ ] Both users can login

#### RLS Testing
- [ ] Regular user sees only own data
- [ ] Admin user sees all data
- [ ] Public data visible to all
- [ ] Unauthorized access blocked

#### UI/UX
- [ ] Desktop navigation works
- [ ] Mobile drawer works
- [ ] Sidebar collapse/expand
- [ ] Active states correct
- [ ] UserButton works

#### Notes:
_______________________________________________
_______________________________________________
_______________________________________________

## 🔗 Quick Links

- **Staging Site:** https://cca-staging.azurewebsites.net
- **Supabase Dashboard:** https://supabase.com/dashboard
- **Azure Portal:** https://portal.azure.com
- **Clerk Dashboard:** https://dashboard.clerk.com
- **GitHub Repo:** https://github.com/anungisa/cca_the_button_app_v1

## 📞 Support

If you encounter issues:
1. Check browser console for errors
2. Check Network tab for failed requests
3. Check Supabase logs for database errors
4. Review RLS policies in Supabase
5. Document issue in testing notes above
