# GitHub Secrets - Copy and Paste Guide

## 📋 ALL SECRETS READY TO ADD

Go to: **GitHub Repository → Settings → Secrets and variables → Actions → New repository secret**

---

### Secret 1: DATABASE_URL
**Name:** `DATABASE_URL`  
**Value:**
```
postgresql://postgres.ntqrqcmllkgrhwjreohn:@Cehyjygj001@aws-1-ca-central-1.pooler.supabase.com:6543/postgres
```

---

### Secret 2: NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
**Name:** `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`  
**Value:**
```
pk_test_c3VtbWFyeS1ndWxsLTIwLmNsZXJrLmFjY291bnRzLmRldiQ
```

---

### Secret 3: CLERK_SECRET_KEY
**Name:** `CLERK_SECRET_KEY`  
**Value:**
```
sk_test_QGP4B6fklxe5oQU598HCQiJG2WniwU12v8ERpv07ff
```

---

### Secret 4: NEXT_PUBLIC_SUPABASE_URL
**Name:** `NEXT_PUBLIC_SUPABASE_URL`  
**Value:**
```
https://ntqrqcmllkgrhwjreohn.supabase.co
```

---

### Secret 5: NEXT_PUBLIC_SUPABASE_ANON_KEY
**Name:** `NEXT_PUBLIC_SUPABASE_ANON_KEY`  
**Value:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im50cXJxY21sbGtncmh3anJlb2huIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk4OTM0MTIsImV4cCI6MjA3NTQ2OTQxMn0.RZ5tqpasHEZ37rJUiUzSCyPrePOCr1s2YsB1XfVKMQo
```

---

### Secret 6: SUPABASE_SERVICE_ROLE_KEY
**Name:** `SUPABASE_SERVICE_ROLE_KEY`  
**Value:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im50cXJxY21sbGtncmh3anJlb2huIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTg5MzQxMiwiZXhwIjoyMDc1NDY5NDEyfQ.NUMiWZpXgiMgf73mggN_Ywls8gplA3Wl8uonyLyL62Y
```

---

### Secret 7: AZURE_WEBAPP_PUBLISH_PROFILE_STAGING
**Name:** `AZURE_WEBAPP_PUBLISH_PROFILE_STAGING`  
**Value:** Copy the **entire contents** of `staging-publish-profile.xml` in the root directory

**How to get it:**
```powershell
# Open file in notepad
notepad staging-publish-profile.xml

# Or display in terminal
Get-Content staging-publish-profile.xml
```
Select all XML content (starts with `<publishData>` and ends with `</publishData>`) and paste into GitHub secret.

---

### Secret 8: AZURE_WEBAPP_PUBLISH_PROFILE_PROD
**Name:** `AZURE_WEBAPP_PUBLISH_PROFILE_PROD`  
**Value:** Copy the **entire contents** of `prod-publish-profile.xml` in the root directory

**How to get it:**
```powershell
# Open file in notepad
notepad prod-publish-profile.xml

# Or display in terminal
Get-Content prod-publish-profile.xml
```
Select all XML content and paste into GitHub secret.

---

## ✅ Verification Checklist

After adding all secrets:

```powershell
# Install GitHub CLI if not already installed
# winget install GitHub.cli

# Verify all secrets are added
gh secret list
```

**Expected output (8 secrets):**
```
AZURE_WEBAPP_PUBLISH_PROFILE_PROD
AZURE_WEBAPP_PUBLISH_PROFILE_STAGING
CLERK_SECRET_KEY
DATABASE_URL
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
NEXT_PUBLIC_SUPABASE_ANON_KEY
NEXT_PUBLIC_SUPABASE_URL
SUPABASE_SERVICE_ROLE_KEY
```

---

## 🚀 Next Steps After Adding Secrets

1. **Commit current changes:**
```powershell
cd curling-canada-app
git add .
git commit -m "Phase 0 complete - ready for deployment"
git push origin main
```

2. **Create and deploy to staging:**
```powershell
git checkout -b staging
git push -u origin staging
```

3. **Monitor deployment:**
- Go to GitHub repository → Actions tab
- Click on "Deploy to Azure" workflow
- Watch deployment progress (~3-5 minutes)

4. **Verify staging:**
- Visit: https://cca-staging.azurewebsites.net
- Test authentication
- Verify home page loads correctly

---

## 📝 Quick Copy Commands (PowerShell)

```powershell
# Display staging publish profile for copy
Write-Host "`n=== STAGING PUBLISH PROFILE ===" -ForegroundColor Cyan
Get-Content staging-publish-profile.xml
Write-Host "`n"

# Display production publish profile for copy
Write-Host "`n=== PRODUCTION PUBLISH PROFILE ===" -ForegroundColor Cyan
Get-Content prod-publish-profile.xml
Write-Host "`n"
```

---

## 🔐 Security Notes

⚠️ **IMPORTANT:**
- Never commit `.env.local` to Git
- Never commit publish profile XML files to Git
- Service role key is server-only (never expose to client)
- Anon key is safe for client-side use
- Publish profiles contain deployment credentials

✅ **Safe to share:**
- Public Clerk key (NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY)
- Public Supabase URL (NEXT_PUBLIC_SUPABASE_URL)
- Public Supabase anon key (NEXT_PUBLIC_SUPABASE_ANON_KEY)

🔒 **Keep secret:**
- Clerk secret key
- Database URL with password
- Supabase service role key
- Azure publish profiles

---

## 🎯 You're Ready!

All secrets are prepared and ready to add to GitHub. This should take about 5-10 minutes total.

**After adding secrets, your deployment pipeline will be fully operational!** 🚀
