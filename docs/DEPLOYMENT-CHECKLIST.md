# Deployment Checklist - Phase 0 Completion

## Current Status: 88% Complete
**Ready for First Deployment** ✅

---

## Prerequisites Completed ✅
- [x] Azure infrastructure provisioned (staging + production)
- [x] Database schema deployed (98 tables in Supabase)
- [x] UI components customized (Curling Canada branding)
- [x] Home page migrated (dual view implementation)
- [x] CI/CD workflow created (.github/workflows/azure-deploy.yml)
- [x] Azure publish profiles extracted (staging-publish-profile.xml, prod-publish-profile.xml)

---

## Step 1: Configure GitHub Secrets ⏳

### Required Secrets
Navigate to your GitHub repository → Settings → Secrets and variables → Actions → New repository secret

#### Database
- [ ] **DATABASE_URL**
  ```
  postgresql://postgres.ntqrqcmllkgrhwjreohn:@Cehyjygj001@aws-1-ca-central-1.pooler.supabase.com:6543/postgres
  ```

#### Clerk Authentication
- [ ] **NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY**
  ```
  pk_test_c3VtbWFyeS1ndWxsLTIwLmNsZXJrLmFjY291bnRzLmRldiQ
  ```
- [ ] **CLERK_SECRET_KEY**
  ```
  sk_test_QGP4B6fklxe5oQU598HCQiJG2WniwU12v8ERpv07ff
  ```

#### Supabase
- [ ] **NEXT_PUBLIC_SUPABASE_URL**
  ```
  https://ntqrqcmllkgrhwjreohn.supabase.co
  ```
- [ ] **NEXT_PUBLIC_SUPABASE_ANON_KEY**
  ```
  Get from: Supabase Dashboard → Project Settings → API → anon public key
  ```

#### Azure Publish Profiles
- [ ] **AZURE_WEBAPP_PUBLISH_PROFILE_STAGING**
  - Open `staging-publish-profile.xml` in the root directory
  - Copy the entire XML content
  - Paste into GitHub secret

- [ ] **AZURE_WEBAPP_PUBLISH_PROFILE_PROD**
  - Open `prod-publish-profile.xml` in the root directory
  - Copy the entire XML content
  - Paste into GitHub secret

### Verification
```powershell
# Count secrets (should show 7 total)
gh secret list
```

---

## Step 2: Create Staging Branch ⏳

```powershell
# Navigate to curling-canada-app
cd curling-canada-app

# Create staging branch
git checkout -b staging

# Push to remote
git push -u origin staging
```

**Expected Result:** GitHub Actions workflow triggers automatically

---

## Step 3: Monitor First Deployment ⏳

### Watch GitHub Actions
1. Go to repository → Actions tab
2. Find "Deploy to Azure" workflow run
3. Monitor each step:
   - ✅ Checkout code
   - ✅ Setup Node.js 20
   - ✅ Install dependencies
   - ✅ Build application
   - ✅ Run database migrations
   - ✅ Deploy to Azure

### Check Build Logs
Look for:
```
✓ Compiled successfully
✓ Build completed in X seconds
✓ Migrations applied
✓ Deployment successful
```

### Common Issues
| Issue | Solution |
|-------|----------|
| "Secret not found" | Verify all 7 secrets are added to GitHub |
| "Build failed" | Check build logs for TypeScript errors |
| "Migration failed" | Verify DATABASE_URL is correct |
| "Deployment failed" | Check publish profile XML is complete |

---

## Step 4: Verify Staging Deployment ⏳

### Test URLs
- **Staging App:** https://cca-staging.azurewebsites.net
- **Health Check:** https://cca-staging.azurewebsites.net/api/health (if created)

### Manual Testing Checklist
- [ ] Home page loads (non-authenticated view)
- [ ] Curling Canada branding displays correctly (red/blue/gold colors)
- [ ] Header navigation works
- [ ] Footer displays with social links
- [ ] "Get Started" button redirects to Clerk sign-up
- [ ] "Sign In" button redirects to Clerk login
- [ ] Sign up with test account
- [ ] Verify authenticated home view (welcome banner + quick actions)
- [ ] Sign out works
- [ ] Dashboard link appears for authenticated users

### Database Connection Test
```powershell
# From Azure portal or CLI
az webapp log tail --name cca-staging --resource-group cca-staging-rg

# Look for database connection logs
# Should see: "Database connected successfully"
```

### Performance Check
```powershell
# Test response time
Measure-Command { Invoke-WebRequest -Uri "https://cca-staging.azurewebsites.net" }

# Should be < 3 seconds for cold start
# Should be < 500ms for warm requests
```

---

## Step 5: Configure Application Insights ⏳

### Enable Monitoring
```powershell
# Verify Application Insights is connected
az monitor app-insights component show `
  --app cca-staging-insights `
  --resource-group cca-staging-rg
```

### Set Up Alerts
1. Go to Azure Portal → Application Insights → cca-staging-insights
2. Create alerts for:
   - [ ] Response time > 5 seconds
   - [ ] Failed requests > 10/min
   - [ ] Availability < 99%
   - [ ] Exception rate > 5/min

### Check Metrics
- [ ] Page views tracking
- [ ] User sessions tracking
- [ ] Failed requests < 1%
- [ ] Average response time < 1s

---

## Step 6: Set Up Row Level Security (RLS) ⏳

### Supabase Dashboard Steps
1. Go to https://supabase.com/dashboard/project/ntqrqcmllkgrhwjreohn
2. Navigate to Authentication → Providers
3. Enable "JWT Verification" for Clerk
4. Add Clerk JWKS URL: `https://summary-gull-20.clerk.accounts.dev/.well-known/jwks.json`

### Enable RLS Policies
```sql
-- Enable RLS on all user-related tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

-- Create policy: Users can only read their own data
CREATE POLICY "Users can view own data" ON users
  FOR SELECT USING (auth.jwt() ->> 'sub' = id::text);

-- Create policy: Users can update their own data
CREATE POLICY "Users can update own data" ON users
  FOR UPDATE USING (auth.jwt() ->> 'sub' = id::text);

-- Repeat for all 98 tables as needed
```

### Test RLS
- [ ] Create test user in Clerk
- [ ] Attempt to query another user's data (should fail)
- [ ] Query own data (should succeed)
- [ ] Verify admin users can bypass RLS

---

## Step 7: Dynamic Event Listings ⏳

### Create Server Action
```typescript
// curling-canada-app/actions/events-actions.ts
'use server'

import { db } from '@/db/db'
import { events } from '@/db/schema'
import { desc } from 'drizzle-orm'

export async function getUpcomingEvents() {
  const upcomingEvents = await db
    .select()
    .from(events)
    .where(gte(events.startDate, new Date()))
    .orderBy(desc(events.startDate))
    .limit(3)
  
  return upcomingEvents
}
```

### Update Home Page
```typescript
// In page.tsx authenticated view
import { getUpcomingEvents } from '@/actions/events-actions'

// Replace placeholder events
const upcomingEvents = await getUpcomingEvents()
```

### Test
- [ ] Events display correctly
- [ ] Data comes from Supabase
- [ ] Pagination works (if implemented)
- [ ] Empty state shows when no events

---

## Step 8: User Migration from Base44 ⏳

### Export Base44 Users
```javascript
// Script to run on Base44 system
const users = await base44.users.getAll()
const exportData = users.map(user => ({
  id: user.id,
  email: user.email,
  firstName: user.firstName,
  lastName: user.lastName,
  role: user.role,
  metadata: user.metadata,
  createdAt: user.createdAt
}))

// Save to users-export.json
```

### Import to Clerk
```typescript
// migration-scripts/import-users-to-clerk.ts
import { clerkClient } from '@clerk/nextjs/server'
import usersData from './users-export.json'

for (const user of usersData) {
  await clerkClient.users.createUser({
    emailAddress: [user.email],
    firstName: user.firstName,
    lastName: user.lastName,
    publicMetadata: {
      legacy_user_id: user.id,
      role: user.role,
      ...user.metadata
    }
  })
}
```

### Sync to Supabase
- [ ] Create trigger to sync Clerk users to Supabase `users` table
- [ ] Map Clerk user IDs to Supabase user records
- [ ] Preserve legacy user IDs in metadata

---

## Step 9: Production Deployment Prep ⏳

### Pre-Production Checklist
- [ ] All staging tests passed
- [ ] RLS policies configured and tested
- [ ] User migration completed and verified
- [ ] Dynamic data loading working
- [ ] Performance metrics acceptable (< 1s page load)
- [ ] No errors in Application Insights
- [ ] SEO metadata verified (Open Graph, Twitter cards)
- [ ] Accessibility testing passed (WCAG 2.1 AA)
- [ ] Mobile responsiveness verified
- [ ] Cross-browser testing (Chrome, Firefox, Safari, Edge)

### Merge to Production
```powershell
# Switch to main branch
git checkout main

# Merge staging
git merge staging

# Push to trigger production deployment
git push origin main
```

### Post-Deployment Verification
- [ ] Visit https://cca-prod.azurewebsites.net
- [ ] Verify all functionality works
- [ ] Monitor Application Insights for errors
- [ ] Check database connection
- [ ] Test authentication flow
- [ ] Verify DNS (if custom domain configured)

---

## Step 10: Complete Phase 0 ⏳

### Final Documentation Updates
- [ ] Update PHASE-0-PROGRESS.md to 100%
- [ ] Create PHASE-1-PLAN.md with page migration priority
- [ ] Document any production issues encountered
- [ ] Update README.md with deployment URLs

### Handoff to Phase 1
- [ ] Celebrate Phase 0 completion! 🎉
- [ ] Review 149 legacy pages to migrate
- [ ] Prioritize critical user flows (Events, Clubs, Teams)
- [ ] Set up page migration template
- [ ] Begin systematic migration of core pages

---

## Rollback Plan

### If Staging Deployment Fails
```powershell
# Revert last commit
git revert HEAD
git push origin staging

# Or reset to previous working commit
git reset --hard <previous-commit-sha>
git push --force origin staging
```

### If Production Issues Occur
```powershell
# Immediate rollback
git revert HEAD
git push origin main

# Monitor workflow completion
# Verify old version restored
```

### Azure Portal Rollback
1. Go to Azure Portal → App Service → cca-prod
2. Deployment Center → Deployment History
3. Select previous successful deployment
4. Click "Redeploy"

---

## Success Criteria

### Phase 0 Complete When:
- ✅ Staging environment fully functional
- ✅ Production environment deployed
- ✅ Home page working with authentication
- ✅ Database queries returning real data
- ✅ RLS policies protecting user data
- ✅ Users migrated from Base44 to Clerk
- ✅ Monitoring and alerts configured
- ✅ Documentation complete

### Metrics to Track:
- Page load time: < 1 second
- Uptime: > 99.5%
- Error rate: < 0.1%
- User satisfaction: Positive feedback from initial testing
- Database response time: < 100ms

---

## Next Steps After Phase 0

1. **Phase 1: Core Pages** (Estimated: 2-3 weeks)
   - Events listing and details pages
   - Clubs directory and profiles
   - Teams management
   - User dashboard enhancements

2. **Phase 2: Performance Tools** (Estimated: 2-3 weeks)
   - Shot Tracker migration
   - Performance Center rebuild
   - Statistics and analytics pages

3. **Phase 3: Admin Tools** (Estimated: 1-2 weeks)
   - Staff HQ functionality
   - Content management
   - User administration

4. **Phase 4: Specialty Features** (Estimated: 2-3 weeks)
   - SmartBroom integration
   - Live streaming pages
   - Social features

5. **Phase 5: Testing & Polish** (Estimated: 1 week)
   - QA testing
   - Performance optimization
   - Bug fixes
   - UAT with stakeholders

---

## Support & Resources

- **Documentation:** `docs/` directory
- **CI/CD Guide:** `docs/CI-CD-SETUP.md`
- **Azure Guide:** `docs/architecture/azure-deployment.md`
- **Migration Strategy:** `docs/migration-guides/migration-strategy.md`
- **Legacy Analysis:** `docs/legacy-analysis/legacy-system-overview.md`

**Questions or Issues?** Review documentation or check Application Insights logs.
