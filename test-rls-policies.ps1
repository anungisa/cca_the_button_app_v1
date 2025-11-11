# Test RLS Policies
# Run this after applying RLS policies to verify they work

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  RLS POLICY TEST SUITE" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

$dbUrl = "postgresql://postgres.ntqrqcmllkgrhwjreohn:@Cehyjygj001@aws-1-ca-central-1.pooler.supabase.com:6543/postgres"

Write-Host "This script will help you test RLS policies.`n" -ForegroundColor Yellow

Write-Host "📋 Test Checklist:" -ForegroundColor Yellow
Write-Host ""
Write-Host "[ ] 1. JWT Settings configured in Supabase" -ForegroundColor White
Write-Host "[ ] 2. Phase 1 RLS policies applied" -ForegroundColor White
Write-Host "[ ] 3. At least one test user created on staging site`n" -ForegroundColor White

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  TEST 1: Check RLS Enabled" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

Write-Host "Run this in Supabase SQL Editor:" -ForegroundColor Yellow
Write-Host ""
$query1 = @"
SELECT 
  schemaname,
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables
WHERE tablename IN (
  'users', 'user_permissions', 'clubs', 'events', 
  'orders', 'cart_items', 'point_transactions'
)
ORDER BY tablename;
"@

Write-Host $query1 -ForegroundColor Cyan
Write-Host ""
Write-Host "Expected: All tables should have rls_enabled = true`n" -ForegroundColor Green

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  TEST 2: Count Policies" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

Write-Host "Run this in Supabase SQL Editor:" -ForegroundColor Yellow
Write-Host ""
$query2 = @"
SELECT 
  tablename,
  COUNT(*) as policy_count
FROM pg_policies
WHERE tablename IN (
  'users', 'user_permissions', 'user_settings', 'clubs', 
  'club_officials', 'club_memberships', 'events', 'event_registrations',
  'orders', 'order_items', 'cart_items', 'point_transactions', 'redemptions'
)
GROUP BY tablename
ORDER BY tablename;
"@

Write-Host $query2 -ForegroundColor Cyan
Write-Host ""
Write-Host "Expected: Should see 13 tables with policies" -ForegroundColor Green
Write-Host "Total policies: ~47 across all tables`n" -ForegroundColor Green

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  TEST 3: List All Policies" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

Write-Host "Run this in Supabase SQL Editor:" -ForegroundColor Yellow
Write-Host ""
$query3 = @"
SELECT 
  tablename,
  policyname,
  cmd as operation
FROM pg_policies
WHERE tablename = 'users'
ORDER BY policyname;
"@

Write-Host $query3 -ForegroundColor Cyan
Write-Host ""
Write-Host "Expected: Should see policies like:" -ForegroundColor Green
Write-Host "  • users_select_own (SELECT)" -ForegroundColor Cyan
Write-Host "  • users_update_own (UPDATE)" -ForegroundColor Cyan
Write-Host "  • users_select_admin (SELECT)" -ForegroundColor Cyan
Write-Host "  • users_update_admin (UPDATE)`n" -ForegroundColor Cyan

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  TEST 4: Check Indexes" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

Write-Host "Run this in Supabase SQL Editor:" -ForegroundColor Yellow
Write-Host ""
$query4 = @"
SELECT 
  tablename,
  indexname
FROM pg_indexes
WHERE tablename IN ('users', 'orders', 'events', 'cart_items')
  AND indexname LIKE 'idx_%'
ORDER BY tablename, indexname;
"@

Write-Host $query4 -ForegroundColor Cyan
Write-Host ""
Write-Host "Expected: Should see indexes for performance optimization`n" -ForegroundColor Green

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  TEST 5: Create Test Admin User" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

Write-Host "Steps:" -ForegroundColor Yellow
Write-Host "1. Go to: https://cca-staging.azurewebsites.net" -ForegroundColor White
Write-Host "2. Sign up with email: admin@test.curling.ca" -ForegroundColor White
Write-Host "3. Complete verification" -ForegroundColor White
Write-Host "4. Go to Clerk Dashboard and copy the User ID" -ForegroundColor White
Write-Host "5. Run this SQL (replace YOUR_CLERK_USER_ID):" -ForegroundColor White
Write-Host ""

$query5 = @"
-- Give admin permissions to your test user
INSERT INTO user_permissions (user_id, permission_type, granted_by)
VALUES ('YOUR_CLERK_USER_ID', 'admin', 'system');

-- Verify insertion
SELECT * FROM user_permissions WHERE user_id = 'YOUR_CLERK_USER_ID';
"@

Write-Host $query5 -ForegroundColor Cyan
Write-Host ""

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  TEST 6: Verify Authentication" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

Write-Host "After logging in on staging site, run this:" -ForegroundColor Yellow
Write-Host ""
$query6 = @"
-- This should return your Clerk user ID
SELECT 
  auth.uid() as current_user_id,
  auth.email() as current_email;
"@

Write-Host $query6 -ForegroundColor Cyan
Write-Host ""
Write-Host "Expected: Should show your Clerk user ID and email" -ForegroundColor Green
Write-Host "If returns NULL, JWT configuration needs attention`n" -ForegroundColor Yellow

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  TEST 7: Test User Access" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

Write-Host "Create a regular test user on staging site" -ForegroundColor Yellow
Write-Host "Email: user@test.curling.ca" -ForegroundColor White
Write-Host ""
Write-Host "Then run these queries while logged in as that user:" -ForegroundColor Yellow
Write-Host ""

$query7 = @"
-- Should return YOUR profile only
SELECT * FROM users WHERE clerk_user_id = auth.uid();

-- Should return EMPTY (can't see other users)
SELECT * FROM users WHERE clerk_user_id != auth.uid();

-- Should see public events
SELECT * FROM events WHERE status = 'published' LIMIT 5;
"@

Write-Host $query7 -ForegroundColor Cyan
Write-Host ""

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  QUICK COPY: All Queries" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

Write-Host "Copy all queries at once:" -ForegroundColor Yellow
Write-Host ""

$allQueries = @"
-- TEST 1: Check RLS Enabled
SELECT schemaname, tablename, rowsecurity as rls_enabled
FROM pg_tables
WHERE tablename IN ('users', 'user_permissions', 'clubs', 'events', 'orders', 'cart_items', 'point_transactions')
ORDER BY tablename;

-- TEST 2: Count Policies
SELECT tablename, COUNT(*) as policy_count
FROM pg_policies
WHERE tablename IN ('users', 'user_permissions', 'user_settings', 'clubs', 'club_officials', 'club_memberships', 'events', 'event_registrations', 'orders', 'order_items', 'cart_items', 'point_transactions', 'redemptions')
GROUP BY tablename
ORDER BY tablename;

-- TEST 3: List Users Table Policies
SELECT tablename, policyname, cmd as operation
FROM pg_policies
WHERE tablename = 'users'
ORDER BY policyname;

-- TEST 4: Check Indexes
SELECT tablename, indexname
FROM pg_indexes
WHERE tablename IN ('users', 'orders', 'events', 'cart_items')
AND indexname LIKE 'idx_%'
ORDER BY tablename, indexname;

-- TEST 6: Verify Auth (run while logged in)
SELECT auth.uid() as current_user_id, auth.email() as current_email;
"@

Write-Host $allQueries -ForegroundColor Cyan
Set-Clipboard -Value $allQueries
Write-Host ""
Write-Host "✅ All test queries copied to clipboard!" -ForegroundColor Green
Write-Host "Paste into Supabase SQL Editor and run.`n" -ForegroundColor Green

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Results Analysis" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

Write-Host "✅ SUCCESS CRITERIA:" -ForegroundColor Green
Write-Host "  • All 13 tables have RLS enabled (rowsecurity = true)" -ForegroundColor White
Write-Host "  • ~47 policies created across tables" -ForegroundColor White
Write-Host "  • Performance indexes exist" -ForegroundColor White
Write-Host "  • auth.uid() returns valid Clerk user ID" -ForegroundColor White
Write-Host "  • Users can only see their own data" -ForegroundColor White
Write-Host "  • Public tables (events, clubs) accessible to all`n" -ForegroundColor White

Write-Host "❌ COMMON ISSUES:" -ForegroundColor Red
Write-Host "  • auth.uid() returns NULL:" -ForegroundColor White
Write-Host "    → Check JWT settings in Supabase Dashboard" -ForegroundColor Cyan
Write-Host "    → Verify JWKS URL is correct" -ForegroundColor Cyan
Write-Host "    → Log out and back in to get fresh token" -ForegroundColor Cyan
Write-Host ""
Write-Host "  • 'permission denied' errors:" -ForegroundColor White
Write-Host "    → This is expected! Means RLS is working" -ForegroundColor Cyan
Write-Host "    → Users should NOT access other users' data" -ForegroundColor Cyan
Write-Host ""
Write-Host "  • No policies showing:" -ForegroundColor White
Write-Host "    → Re-run the SQL file in SQL Editor" -ForegroundColor Cyan
Write-Host "    → Check for error messages in output" -ForegroundColor Cyan
Write-Host ""

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  Next Steps" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

Write-Host "After verifying RLS works:" -ForegroundColor Yellow
Write-Host "1. Create database seed data" -ForegroundColor White
Write-Host "2. Test with real data scenarios" -ForegroundColor White
Write-Host "3. Apply Phase 2 RLS policies (teams, matches, notifications)" -ForegroundColor White
Write-Host "4. Complete dashboard layout" -ForegroundColor White
Write-Host "5. Update branding`n" -ForegroundColor White

Write-Host "Documentation:" -ForegroundColor Yellow
Write-Host "  ..\docs\RLS-APPLICATION-CHECKLIST.md" -ForegroundColor Cyan
Write-Host "  ..\docs\RLS-QUICK-START.md`n" -ForegroundColor Cyan

Write-Host "========================================`n" -ForegroundColor Cyan
