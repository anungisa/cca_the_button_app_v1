# Apply RLS Policies to Supabase
# Run this script to help apply RLS policies via Supabase Dashboard

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  RLS POLICY APPLICATION HELPER" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# Configuration
$supabaseUrl = "https://ntqrqcmllkgrhwjreohn.supabase.co"
$supabaseProjectRef = "ntqrqcmllkgrhwjreohn"
$clerkJwksUrl = "https://summary-gull-20.clerk.accounts.dev/.well-known/jwks.json"
$clerkIssuer = "https://summary-gull-20.clerk.accounts.dev"
$sqlFile = "db\rls-policies-phase1.sql"

Write-Host "📋 Configuration:" -ForegroundColor Yellow
Write-Host "   Supabase Project: $supabaseProjectRef" -ForegroundColor White
Write-Host "   Clerk JWKS URL: $clerkJwksUrl" -ForegroundColor White
Write-Host "   SQL File: $sqlFile`n" -ForegroundColor White

# Step 1: Verify Clerk JWKS
Write-Host "Step 1: Verifying Clerk JWKS URL..." -ForegroundColor Cyan
try {
    $jwksResponse = Invoke-WebRequest -Uri $clerkJwksUrl -UseBasicParsing
    $jwksData = ConvertFrom-Json $jwksResponse.Content
    Write-Host "   ✅ JWKS URL is accessible" -ForegroundColor Green
    Write-Host "   ✅ Found $($jwksData.keys.Count) key(s)`n" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Error accessing JWKS: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "   Please verify your Clerk configuration`n" -ForegroundColor Yellow
    exit 1
}

# Step 2: Check SQL file exists
Write-Host "Step 2: Checking SQL file..." -ForegroundColor Cyan
if (Test-Path $sqlFile) {
    $sqlContent = Get-Content $sqlFile -Raw
    $sqlSize = $sqlContent.Length
    Write-Host "   ✅ SQL file found" -ForegroundColor Green
    Write-Host "   ✅ Size: $sqlSize characters`n" -ForegroundColor Green
} else {
    Write-Host "   ❌ SQL file not found: $sqlFile" -ForegroundColor Red
    exit 1
}

# Step 3: Instructions
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  NEXT STEPS" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

Write-Host "🔐 Step A: Configure Supabase JWT Settings" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Open: https://supabase.com/dashboard/project/$supabaseProjectRef/settings/api" -ForegroundColor White
Write-Host ""
Write-Host "2. Scroll to 'JWT Settings' section" -ForegroundColor White
Write-Host ""
Write-Host "3. Click 'Add new JWT Verifier'" -ForegroundColor White
Write-Host ""
Write-Host "4. Configure:" -ForegroundColor White
Write-Host "   - Name: Clerk" -ForegroundColor Cyan
Write-Host "   - JWKS URI: $clerkJwksUrl" -ForegroundColor Cyan
Write-Host "   - Issuer: $clerkIssuer" -ForegroundColor Cyan
Write-Host ""
Write-Host "5. Click 'Save' and wait 30 seconds`n" -ForegroundColor White

Write-Host "📝 Step B: Apply RLS Policies" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Open: https://supabase.com/dashboard/project/$supabaseProjectRef/sql/new" -ForegroundColor White
Write-Host ""
Write-Host "2. Copy the SQL from: $sqlFile" -ForegroundColor White
Write-Host "   (Opening file in notepad...)" -ForegroundColor Cyan

# Open SQL file in notepad
Start-Process notepad $sqlFile

Start-Sleep -Seconds 2

Write-Host ""
Write-Host "3. Select ALL content (Ctrl+A) and Copy (Ctrl+C)" -ForegroundColor White
Write-Host ""
Write-Host "4. Paste into Supabase SQL Editor" -ForegroundColor White
Write-Host ""
Write-Host "5. Click 'Run' (or press Ctrl+Enter)" -ForegroundColor White
Write-Host ""
Write-Host "6. Wait for 'Success' message (~30 seconds)`n" -ForegroundColor White

Write-Host "✅ Step C: Verify Policies" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Open: https://supabase.com/dashboard/project/$supabaseProjectRef/auth/policies" -ForegroundColor White
Write-Host ""
Write-Host "2. Verify policies exist for these tables:" -ForegroundColor White
Write-Host "   • users (4 policies)" -ForegroundColor Cyan
Write-Host "   • user_permissions (3 policies)" -ForegroundColor Cyan
Write-Host "   • user_settings (1 policy)" -ForegroundColor Cyan
Write-Host "   • clubs (4 policies)" -ForegroundColor Cyan
Write-Host "   • club_officials (3 policies)" -ForegroundColor Cyan
Write-Host "   • club_memberships (5 policies)" -ForegroundColor Cyan
Write-Host "   • events (6 policies)" -ForegroundColor Cyan
Write-Host "   • event_registrations (5 policies)" -ForegroundColor Cyan
Write-Host "   • orders (5 policies)" -ForegroundColor Cyan
Write-Host "   • order_items (3 policies)" -ForegroundColor Cyan
Write-Host "   • cart_items (1 policy)" -ForegroundColor Cyan
Write-Host "   • point_transactions (3 policies)" -ForegroundColor Cyan
Write-Host "   • redemptions (4 policies)`n" -ForegroundColor Cyan

Write-Host "🧪 Step D: Test RLS (Optional)" -ForegroundColor Yellow
Write-Host ""
Write-Host "Run test queries in SQL Editor:" -ForegroundColor White
Write-Host ""
Write-Host "-- Check RLS is enabled" -ForegroundColor Cyan
Write-Host "SELECT tablename, rowsecurity FROM pg_tables" -ForegroundColor Cyan
Write-Host "WHERE tablename IN ('users', 'orders', 'events');" -ForegroundColor Cyan
Write-Host ""
Write-Host "-- Count policies created" -ForegroundColor Cyan
Write-Host "SELECT tablename, COUNT(*) as policy_count" -ForegroundColor Cyan
Write-Host "FROM pg_policies" -ForegroundColor Cyan
Write-Host "GROUP BY tablename ORDER BY tablename;" -ForegroundColor Cyan
Write-Host ""

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  QUICK LINKS" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

Write-Host "Supabase Dashboard:" -ForegroundColor Yellow
Write-Host "  https://supabase.com/dashboard/project/$supabaseProjectRef`n" -ForegroundColor White

Write-Host "JWT Settings:" -ForegroundColor Yellow
Write-Host "  https://supabase.com/dashboard/project/$supabaseProjectRef/settings/api`n" -ForegroundColor White

Write-Host "SQL Editor:" -ForegroundColor Yellow
Write-Host "  https://supabase.com/dashboard/project/$supabaseProjectRef/sql/new`n" -ForegroundColor White

Write-Host "Auth Policies:" -ForegroundColor Yellow
Write-Host "  https://supabase.com/dashboard/project/$supabaseProjectRef/auth/policies`n" -ForegroundColor White

Write-Host "Documentation:" -ForegroundColor Yellow
Write-Host "  ..\docs\RLS-QUICK-START.md" -ForegroundColor White
Write-Host "  ..\docs\RLS-APPLICATION-CHECKLIST.md`n" -ForegroundColor White

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  Press any key to open Supabase Dashboard..." -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

# Open Supabase dashboard
Start-Process "https://supabase.com/dashboard/project/$supabaseProjectRef/settings/api"

Write-Host "`n✅ Dashboard opened! Follow the steps above.`n" -ForegroundColor Green
Write-Host "After completing the steps, run:" -ForegroundColor Yellow
Write-Host "  .\test-rls-policies.ps1" -ForegroundColor Cyan
Write-Host "to verify the policies are working.`n" -ForegroundColor Yellow
