# GitHub Secrets Configuration Script
# Run this to get all the values needed for GitHub Secrets

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "GitHub Secrets Configuration Helper" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

Write-Host "Copy these values to your GitHub repository:" -ForegroundColor Yellow
Write-Host "Go to: Settings → Secrets and variables → Actions → New repository secret`n" -ForegroundColor Gray

# Database URL
Write-Host "1. DATABASE_URL" -ForegroundColor Green
Write-Host "   Value: postgresql://postgres.ntqrqcmllkgrhwjreohn:@Cehyjygj001@aws-1-ca-central-1.pooler.supabase.com:6543/postgres`n" -ForegroundColor White

# Clerk Keys
Write-Host "2. NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY" -ForegroundColor Green
Write-Host "   Value: pk_test_c3VtbWFyeS1ndWxsLTIwLmNsZXJrLmFjY291bnRzLmRldiQ`n" -ForegroundColor White

Write-Host "3. CLERK_SECRET_KEY" -ForegroundColor Green
Write-Host "   Value: sk_test_QGP4B6fklxe5oQU598HCQiJG2WniwU12v8ERpv07ff`n" -ForegroundColor White

# Supabase Keys
Write-Host "4. NEXT_PUBLIC_SUPABASE_URL" -ForegroundColor Green
Write-Host "   Value: https://ntqrqcmllkgrhwjreohn.supabase.co`n" -ForegroundColor White

Write-Host "5. NEXT_PUBLIC_SUPABASE_ANON_KEY" -ForegroundColor Green
Write-Host "   Value: [Get from Supabase Dashboard → Settings → API]`n" -ForegroundColor Yellow

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "Azure Publish Profiles (Get these next)" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

Write-Host "Run these commands to get publish profiles:`n" -ForegroundColor Yellow

Write-Host "For STAGING:" -ForegroundColor Green
Write-Host "az webapp deployment list-publishing-profiles \
  --name cca-staging \
  --resource-group cca-staging-rg \
  --xml`n" -ForegroundColor White

Write-Host "For PRODUCTION:" -ForegroundColor Green
Write-Host "az webapp deployment list-publishing-profiles \
  --name cca-prod \
  --resource-group cca-prod-rg \
  --xml`n" -ForegroundColor White

Write-Host "Copy the XML output and add as:" -ForegroundColor Yellow
Write-Host "  - AZURE_WEBAPP_PUBLISH_PROFILE_STAGING (for staging)" -ForegroundColor White
Write-Host "  - AZURE_WEBAPP_PUBLISH_PROFILE_PROD (for production)`n" -ForegroundColor White

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Next Steps" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

Write-Host "1. Add all secrets to GitHub repository" -ForegroundColor White
Write-Host "2. Create 'staging' branch: git checkout -b staging" -ForegroundColor White
Write-Host "3. Push to staging: git push -u origin staging" -ForegroundColor White
Write-Host "4. Watch deployment in GitHub Actions" -ForegroundColor White
Write-Host "5. Test at: https://cca-staging.azurewebsites.net`n" -ForegroundColor White

Write-Host "Documentation: docs/CI-CD-SETUP.md" -ForegroundColor Gray
