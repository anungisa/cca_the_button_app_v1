# 🚀 DEPLOYMENT QUICK START

## Phase 0: 90% Complete - Ready for First Deployment

---

## ⏰ **NEXT IMMEDIATE STEPS** (15 minutes total)

### 1️⃣ Get Supabase Anon Key (5 min)
```powershell
# Run this helper script for instructions:
.\get-supabase-keys.ps1

# Or go directly to:
# https://supabase.com/dashboard/project/ntqrqcmllkgrhwjreohn
# Settings → API → Copy "anon public" key
```

**Update local env:**
```bash
# curling-canada-app\.env.local
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc... (paste your key here)
```

---

### 2️⃣ Configure GitHub Secrets (5 min)

**Navigate to:** Your GitHub repo → Settings → Secrets and variables → Actions

**Add these 7 secrets:**

| Secret Name | Value | Where to Find |
|-------------|-------|---------------|
| `DATABASE_URL` | `postgresql://postgres.ntqrqcmllkgrhwjreohn:@Cehyjygj001@aws-1-ca-central-1.pooler.supabase.com:6543/postgres` | ✅ Provided |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | `pk_test_c3VtbWFyeS1ndWxsLTIwLmNsZXJrLmFjY291bnRzLmRldiQ` | ✅ Provided |
| `CLERK_SECRET_KEY` | `sk_test_QGP4B6fklxe5oQU598HCQiJG2WniwU12v8ERpv07ff` | ✅ Provided |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://ntqrqcmllkgrhwjreohn.supabase.co` | ✅ Provided |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | (from step 1 above) | Supabase dashboard |
| `AZURE_WEBAPP_PUBLISH_PROFILE_STAGING` | Copy entire XML | `staging-publish-profile.xml` in root |
| `AZURE_WEBAPP_PUBLISH_PROFILE_PROD` | Copy entire XML | `prod-publish-profile.xml` in root |

**Quick add via CLI:**
```powershell
# Example (requires gh CLI installed)
gh secret set DATABASE_URL --body "postgresql://postgres.ntqrqcmllkgrhwjreohn:@Cehyjygj001@aws-1-ca-central-1.pooler.supabase.com:6543/postgres"
```

---

### 3️⃣ Deploy to Staging (5 min)

```powershell
cd curling-canada-app

# Create staging branch
git checkout -b staging

# Commit any pending changes
git add .
git commit -m "Phase 0 complete - ready for staging deployment"

# Push to trigger deployment
git push -u origin staging
```

**Watch deployment:**
- Go to GitHub repo → Actions tab
- Click on "Deploy to Azure" workflow
- Monitor progress (should complete in 3-5 minutes)

---

## ✅ **VERIFICATION CHECKLIST**

After deployment completes:

### Test Staging Environment
- [ ] Visit https://cca-staging.azurewebsites.net
- [ ] Home page loads correctly
- [ ] Curling Canada branding visible (red/blue/gold colors)
- [ ] Header navigation works
- [ ] Footer displays correctly
- [ ] Click "Get Started" → redirects to Clerk sign-up
- [ ] Create test account
- [ ] Verify authenticated view (welcome banner + quick actions)
- [ ] Test quick action links
- [ ] Sign out and back in
- [ ] Check Application Insights for errors

### Monitor Health
```powershell
# Watch logs in real-time
az webapp log tail --name cca-staging --resource-group cca-staging-rg

# Check recent errors
az monitor app-insights metrics show `
  --app cca-staging-insights `
  --resource-group cca-staging-rg `
  --metrics "requests/failed"
```

---

## 📚 **DETAILED GUIDES**

- **Full deployment checklist:** `docs/DEPLOYMENT-CHECKLIST.md` (comprehensive 10-step guide)
- **CI/CD setup guide:** `docs/CI-CD-SETUP.md` (troubleshooting + security)
- **Azure infrastructure:** `docs/architecture/azure-deployment.md` (architecture overview)
- **Phase 0 progress:** `docs/PHASE-0-PROGRESS.md` (detailed progress tracking)

---

## 🎯 **SUCCESS CRITERIA**

Phase 0 is **100% complete** when:
- ✅ Staging deployed and accessible
- ✅ Authentication flow works end-to-end
- ✅ Database queries successful
- ✅ No errors in Application Insights
- ✅ Production deployment successful
- ✅ Monitoring alerts configured

**Current:** 90% → Target: 100% (estimated 2-3 hours remaining)

---

## 🚨 **TROUBLESHOOTING**

### Build Fails
```powershell
# Check for TypeScript errors locally
cd curling-canada-app
npm run build

# If errors found, fix them and commit
git add .
git commit -m "Fix build errors"
git push origin staging
```

### Deployment Fails in GitHub Actions
```powershell
# Verify all 7 secrets are configured
gh secret list

# Should see:
# DATABASE_URL
# NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
# CLERK_SECRET_KEY
# NEXT_PUBLIC_SUPABASE_URL
# NEXT_PUBLIC_SUPABASE_ANON_KEY
# AZURE_WEBAPP_PUBLISH_PROFILE_STAGING
# AZURE_WEBAPP_PUBLISH_PROFILE_PROD

# Re-run deployment manually
gh workflow run azure-deploy.yml --ref staging
```

### Can't Access Staging URL
```powershell
# Check if app is running
az webapp show --name cca-staging --resource-group cca-staging-rg --query "state"

# Expected output: "Running"

# If stopped, restart
az webapp restart --name cca-staging --resource-group cca-staging-rg

# Check deployment logs
az webapp log tail --name cca-staging --resource-group cca-staging-rg
```

### Database Connection Issues
```powershell
# Test connection from local machine
cd ..
python test_db_connection.py

# Should see: "Connection successful!"

# If GitHub Actions shows database errors:
# 1. Verify DATABASE_URL secret is correct (no typos)
# 2. Check Supabase project is active
# 3. Verify pooler URL is accessible from Azure
```

### Authentication Not Working
- Verify Clerk keys in GitHub secrets match .env.local
- Check Clerk dashboard for allowed domains (add `*.azurewebsites.net`)
- Test sign-in locally first
- Check browser console for errors

---

## 🎉 **AFTER SUCCESSFUL STAGING DEPLOYMENT**

### 1. QA Testing (30 min)
- [ ] Test all home page features
- [ ] Create multiple test accounts with different roles
- [ ] Verify responsive design on mobile/tablet/desktop
- [ ] Check browser compatibility (Chrome, Firefox, Safari, Edge)
- [ ] Test navigation menu
- [ ] Verify all links work
- [ ] Check for console errors

### 2. Set Up Monitoring (15 min)
```powershell
# Application Insights - Create availability test
az monitor app-insights web-test create `
  --resource-group cca-staging-rg `
  --name "cca-staging-health-check" `
  --location "canadacentral" `
  --kind "standard" `
  --enabled true `
  --url "https://cca-staging.azurewebsites.net" `
  --frequency 300

# Set up alert for failed requests
az monitor metrics alert create `
  --name "staging-failed-requests" `
  --resource-group cca-staging-rg `
  --scopes "/subscriptions/594b74d1-5daa-43b6-a2f9-b001025aef96/resourceGroups/cca-staging-rg/providers/Microsoft.Web/sites/cca-staging" `
  --condition "count requests/failed > 10" `
  --description "Alert when failed requests exceed 10 per 5 minutes"
```

### 3. Production Deployment (10 min)
```powershell
# Only after staging is fully tested!
git checkout main
git merge staging
git push origin main

# Monitor production deployment in GitHub Actions
# Verify at: https://cca-prod.azurewebsites.net
```

### 4. Complete Phase 0 (5 min)
- [ ] Update PHASE-0-PROGRESS.md to 100%
- [ ] Document any issues encountered
- [ ] Create Phase 1 kickoff document
- [ ] Schedule team review/training session
- [ ] Celebrate Phase 0 completion! 🎊

---

## 💡 **PRO TIPS**

✅ **Security:**
- Keep `staging-publish-profile.xml` and `prod-publish-profile.xml` secure
- Never commit these files to Git (they contain deployment credentials)
- Add to `.gitignore` if not already there

✅ **Testing:**
- Always test on staging before merging to main
- Use staging for all experimental work
- Production should only receive tested, stable code

✅ **Monitoring:**
- Check Application Insights daily for errors
- Set up Slack/Teams notifications for alerts
- Monitor page load times and performance metrics

✅ **Development Workflow:**
- Feature branches → staging → testing → main → production
- Never push directly to main
- Use pull requests for code review

---

## 📞 **HELPER SCRIPTS**

All located in root directory:

```powershell
# Get Supabase keys with instructions
.\get-supabase-keys.ps1

# Setup GitHub secrets (lists all required secrets)
.\setup-github-secrets.ps1

# Test database connection
python test_db_connection.py

# Verify schema deployment
python verify_schema.py
```

---

## 📈 **WHAT'S NEXT AFTER PHASE 0**

### Phase 1: Core Pages Migration (2-3 weeks)
**Priority pages to migrate:**
1. Events listing and details pages
2. Clubs directory and club profiles
3. Teams management and team profiles
4. User dashboard enhancements
5. Search functionality

### Phase 2: Performance Tools (2-3 weeks)
6. Shot Tracker migration
7. Performance Center rebuild
8. Statistics and analytics pages
9. Personal records tracking

### Phase 3: Admin Tools (1-2 weeks)
10. Staff HQ functionality
11. Content management system
12. User administration
13. Reports and analytics

### Phase 4: Specialty Features (2-3 weeks)
14. SmartBroom integration
15. Live streaming pages
16. Social features (follows, posts, badges)
17. Loyalty program (Granite Circle)

### Phase 5: Testing & Polish (1 week)
18. Comprehensive QA testing
19. Performance optimization
20. Bug fixes
21. UAT with stakeholders

---

## 🏁 **YOU'RE 90% THERE!**

**Remaining Steps to 100%:**
1. Get Supabase anon key (5 min)
2. Configure GitHub secrets (5 min)
3. Deploy to staging (5 min)
4. QA testing (30 min)
5. Production deployment (10 min)
6. Set up monitoring (15 min)

**Total Time: ~1.5 hours** 🚀

**Let's finish Phase 0 strong!**
