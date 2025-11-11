# CI/CD Setup Guide - Curling Canada App

This document explains how to set up continuous deployment from GitHub to Azure App Service.

## Prerequisites

- Azure App Service (staging and production) already created ✅
- GitHub repository with admin access
- Azure CLI installed locally

## Setup Steps

### 1. Get Azure Publish Profiles

For **staging**:
```bash
az webapp deployment list-publishing-profiles \
  --name cca-staging \
  --resource-group cca-staging-rg \
  --xml
```

For **production**:
```bash
az webapp deployment list-publishing-profiles \
  --name cca-prod \
  --resource-group cca-prod-rg \
  --xml
```

Save the XML output for each environment.

### 2. Configure GitHub Secrets

Go to your GitHub repository → Settings → Secrets and variables → Actions

Add the following secrets:

#### Required Secrets

| Secret Name | Description | How to Get |
|-------------|-------------|------------|
| `AZURE_WEBAPP_PUBLISH_PROFILE_STAGING` | Staging publish profile | Copy XML from step 1 (staging) |
| `AZURE_WEBAPP_PUBLISH_PROFILE_PROD` | Production publish profile | Copy XML from step 1 (production) |
| `DATABASE_URL` | Supabase connection string | From Azure Key Vault or .env.local |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk public key | From Clerk Dashboard |
| `CLERK_SECRET_KEY` | Clerk secret key | From Clerk Dashboard |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase URL | From Supabase Dashboard |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key | From Supabase Dashboard |

#### Current Values (for reference)

- **DATABASE_URL**: `postgresql://postgres.ntqrqcmllkgrhwjreohn:@Cehyjygj001@aws-1-ca-central-1.pooler.supabase.com:6543/postgres`
- **NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY**: `pk_test_c3VtbWFyeS1ndWxsLTIwLmNsZXJrLmFjY291bnRzLmRldiQ`
- **CLERK_SECRET_KEY**: `sk_test_QGP4B6fklxe5oQU598HCQiJG2WniwU12v8ERpv07ff`
- **NEXT_PUBLIC_SUPABASE_URL**: `https://ntqrqcmllkgrhwjreohn.supabase.co`
- **NEXT_PUBLIC_SUPABASE_ANON_KEY**: Get from Supabase Dashboard → Settings → API

### 3. Branch Strategy

- **main** branch → Deploys to **production** (`cca-prod.azurewebsites.net`)
- **staging** branch → Deploys to **staging** (`cca-staging.azurewebsites.net`)

### 4. Workflow Triggers

The deployment workflow runs automatically when:
- Code is pushed to `main` or `staging` branches
- Manually triggered via GitHub Actions UI

### 5. Deployment Process

When code is pushed:

1. ✅ Checkout code
2. ✅ Set up Node.js 20
3. ✅ Install dependencies (`npm ci`)
4. ✅ Build Next.js app (`npm run build`)
5. ✅ Run database migrations (`npm run db:migrate`)
6. ✅ Deploy to Azure App Service
7. ✅ Notify success/failure

### 6. Testing the Workflow

#### Option A: Push to staging branch
```bash
git checkout -b staging
git push -u origin staging
```

#### Option B: Manual trigger
1. Go to GitHub repository
2. Click "Actions" tab
3. Select "Deploy to Azure App Service" workflow
4. Click "Run workflow"
5. Select branch
6. Click "Run workflow" button

### 7. Monitoring Deployments

#### View deployment logs
1. Go to GitHub repository → Actions
2. Click on the latest workflow run
3. Expand steps to see detailed logs

#### Check Azure deployment
```bash
# Check staging status
az webapp show --name cca-staging --resource-group cca-staging-rg --query state

# Check production status
az webapp show --name cca-prod --resource-group cca-prod-rg --query state

# View staging logs
az webapp log tail --name cca-staging --resource-group cca-staging-rg

# View production logs
az webapp log tail --name cca-prod --resource-group cca-prod-rg
```

### 8. Rollback Strategy

If a deployment fails or causes issues:

#### Option A: Revert commit
```bash
git revert HEAD
git push origin main  # or staging
```

#### Option B: Redeploy previous version
1. Go to GitHub Actions
2. Find the last successful workflow run
3. Click "Re-run all jobs"

#### Option C: Azure deployment slot swap (Production only)
```bash
# If using deployment slots (not configured yet)
az webapp deployment slot swap \
  --name cca-prod \
  --resource-group cca-prod-rg \
  --slot staging \
  --target-slot production
```

### 9. Deployment Slots (Optional Enhancement)

For zero-downtime deployments:

```bash
# Create staging slot for production
az webapp deployment slot create \
  --name cca-prod \
  --resource-group cca-prod-rg \
  --slot staging

# Configure slot settings
az webapp config appsettings set \
  --name cca-prod \
  --resource-group cca-prod-rg \
  --slot staging \
  --settings @staging-appsettings.json

# Test on staging slot: cca-prod-staging.azurewebsites.net
# Then swap to production
az webapp deployment slot swap \
  --name cca-prod \
  --resource-group cca-prod-rg \
  --slot staging
```

### 10. Post-Deployment Checks

After each deployment:

- ✅ Check app is accessible: https://cca-staging.azurewebsites.net or https://cca-prod.azurewebsites.net
- ✅ Verify authentication works (sign in/sign up)
- ✅ Check database connection (view dashboard)
- ✅ Monitor Application Insights for errors
- ✅ Check logs in Azure Portal

### 11. Security Best Practices

- ✅ Never commit secrets to Git
- ✅ Use GitHub Secrets for all sensitive data
- ✅ Rotate secrets regularly (every 90 days)
- ✅ Use Azure Key Vault references in production
- ✅ Enable branch protection on `main` branch
- ✅ Require pull request reviews before merging

### 12. Troubleshooting

#### Build fails
- Check Node.js version (must be 20.x)
- Verify all dependencies are in package.json
- Check for TypeScript errors locally first

#### Deployment fails
- Verify publish profile is correct
- Check Azure App Service status
- Ensure app is running (not stopped)

#### Database migration fails
- Verify DATABASE_URL secret is correct
- Check Supabase database is accessible
- Test connection locally first

#### App doesn't start
- Check Azure logs: `az webapp log tail`
- Verify environment variables in Azure
- Check Application Insights for startup errors

## Next Steps

1. Set up staging branch
2. Configure GitHub secrets
3. Test deployment to staging
4. Set up branch protection rules
5. Configure deployment notifications (Slack/Teams)
6. Set up deployment slots for production
7. Configure automated testing before deployment

## Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Azure App Service Deployment](https://docs.microsoft.com/en-us/azure/app-service/deploy-github-actions)
- [Next.js Deployment Best Practices](https://nextjs.org/docs/deployment)
