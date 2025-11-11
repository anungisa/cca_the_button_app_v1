# Azure Deployment Guide for Curling Canada App

## Overview

This guide provides complete Azure deployment strategy for staging and production environments, replacing Vercel references from the boilerplate.

---

## Architecture Overview

### Cloud Architecture Diagram
```
┌─────────────────────────────────────────────────────────────────┐
│                        Azure Front Door                         │
│                    (CDN + Load Balancer)                        │
└────────────────┬──────────────────────┬─────────────────────────┘
                 │                      │
         ┌───────▼────────┐    ┌───────▼────────┐
         │   Staging      │    │   Production   │
         │  Environment   │    │   Environment  │
         └───────┬────────┘    └───────┬────────┘
                 │                      │
     ┌───────────▼──────────┐ ┌────────▼───────────┐
     │  App Service (B1)    │ │ App Service (P1V2) │
     │  cca-staging         │ │ cca-prod           │
     │  Node.js 18          │ │ Node.js 18         │
     └───────────┬──────────┘ └────────┬───────────┘
                 │                      │
                 └──────────┬───────────┘
                            │
                 ┌──────────▼──────────┐
                 │  Supabase PostgreSQL │
                 │  (Shared DB)         │
                 │  qtrypzzcjebv...     │
                 └──────────────────────┘
                            │
         ┌──────────────────┴──────────────────┐
         │                                     │
┌────────▼────────┐              ┌────────────▼─────────┐
│ Azure Key Vault │              │ Application Insights │
│ (Secrets)       │              │ (Monitoring)         │
└─────────────────┘              └──────────────────────┘
```

---

## Azure Resources Needed

### Resource Group Setup

#### Staging Environment
```bash
# Create resource group
az group create \
  --name cca-staging-rg \
  --location canadacentral \
  --tags Environment=Staging Project=CurlingCanada

# Create App Service Plan (B1 tier - $13/mo)
az appservice plan create \
  --name cca-staging-plan \
  --resource-group cca-staging-rg \
  --sku B1 \
  --is-linux

# Create Web App
az webapp create \
  --name cca-staging \
  --resource-group cca-staging-rg \
  --plan cca-staging-plan \
  --runtime "NODE:18-lts"

# Create Key Vault
az keyvault create \
  --name cca-staging-vault \
  --resource-group cca-staging-rg \
  --location canadacentral

# Create Application Insights
az monitor app-insights component create \
  --app cca-staging-insights \
  --location canadacentral \
  --resource-group cca-staging-rg \
  --application-type web
```

#### Production Environment
```bash
# Create resource group
az group create \
  --name cca-prod-rg \
  --location canadacentral \
  --tags Environment=Production Project=CurlingCanada

# Create App Service Plan (P1V2 tier - $73/mo)
az appservice plan create \
  --name cca-prod-plan \
  --resource-group cca-prod-rg \
  --sku P1V2 \
  --is-linux

# Create Web App with auto-scaling
az webapp create \
  --name cca-prod \
  --resource-group cca-prod-rg \
  --plan cca-prod-plan \
  --runtime "NODE:18-lts"

# Enable auto-scaling (scale 1-3 instances based on CPU)
az monitor autoscale create \
  --resource-group cca-prod-rg \
  --resource cca-prod-plan \
  --resource-type Microsoft.Web/serverfarms \
  --name cca-autoscale \
  --min-count 1 \
  --max-count 3 \
  --count 1

az monitor autoscale rule create \
  --resource-group cca-prod-rg \
  --autoscale-name cca-autoscale \
  --condition "Percentage CPU > 70 avg 5m" \
  --scale out 1

az monitor autoscale rule create \
  --resource-group cca-prod-rg \
  --autoscale-name cca-autoscale \
  --condition "Percentage CPU < 30 avg 5m" \
  --scale in 1

# Create Key Vault
az keyvault create \
  --name cca-prod-vault \
  --resource-group cca-prod-rg \
  --location canadacentral

# Create Application Insights
az monitor app-insights component create \
  --app cca-prod-insights \
  --location canadacentral \
  --resource-group cca-prod-rg \
  --application-type web
```

---

## Deployment Methods

### Method 1: Azure DevOps Pipeline (Recommended)

#### Setup Azure DevOps Project
1. Create project at dev.azure.com
2. Connect to GitHub repo: `anungisa/cca_the_button_app_v1`
3. Create service connections to Azure subscriptions

#### Pipeline Configuration
Create `azure-pipelines.yml` in repo root:

```yaml
trigger:
  branches:
    include:
      - main
      - staging

pool:
  vmImage: 'ubuntu-latest'

variables:
  nodeVersion: '18.x'

stages:
  # ===== BUILD STAGE =====
  - stage: Build
    displayName: 'Build Application'
    jobs:
      - job: BuildJob
        displayName: 'Build Next.js App'
        steps:
          # Install Node.js
          - task: NodeTool@0
            inputs:
              versionSpec: $(nodeVersion)
            displayName: 'Install Node.js'

          # Install dependencies
          - script: |
              npm ci
            displayName: 'Install Dependencies'

          # Lint and type-check
          - script: |
              npm run lint
              npx tsc --noEmit
            displayName: 'Lint and Type Check'
            continueOnError: false

          # Build Next.js (standalone mode for Azure)
          - script: |
              npm run build
            displayName: 'Build Next.js'
            env:
              # Public env vars (embedded at build time)
              NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: $(NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY)
              NEXT_PUBLIC_SUPABASE_URL: $(NEXT_PUBLIC_SUPABASE_URL)
              NEXT_PUBLIC_SUPABASE_ANON_KEY: $(NEXT_PUBLIC_SUPABASE_ANON_KEY)
              NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: $(NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
              # Build-time only
              NODE_ENV: production

          # Archive standalone build
          - task: ArchiveFiles@2
            inputs:
              rootFolderOrFile: '$(System.DefaultWorkingDirectory)/.next/standalone'
              includeRootFolder: false
              archiveType: 'zip'
              archiveFile: '$(Build.ArtifactStagingDirectory)/app-$(Build.BuildId).zip'
            displayName: 'Archive Standalone Build'

          # Archive static assets
          - task: ArchiveFiles@2
            inputs:
              rootFolderOrFile: '$(System.DefaultWorkingDirectory)/.next/static'
              includeRootFolder: false
              archiveType: 'zip'
              archiveFile: '$(Build.ArtifactStagingDirectory)/static-$(Build.BuildId).zip'
            displayName: 'Archive Static Assets'

          # Archive public folder
          - task: ArchiveFiles@2
            inputs:
              rootFolderOrFile: '$(System.DefaultWorkingDirectory)/public'
              includeRootFolder: false
              archiveType: 'zip'
              archiveFile: '$(Build.ArtifactStagingDirectory)/public-$(Build.BuildId).zip'
            displayName: 'Archive Public Assets'

          # Publish artifacts
          - task: PublishBuildArtifacts@1
            inputs:
              PathtoPublish: '$(Build.ArtifactStagingDirectory)'
              ArtifactName: 'drop'
              publishLocation: 'Container'
            displayName: 'Publish Build Artifacts'

  # ===== STAGING DEPLOYMENT =====
  - stage: DeployStaging
    displayName: 'Deploy to Staging'
    condition: and(succeeded(), eq(variables['Build.SourceBranch'], 'refs/heads/staging'))
    dependsOn: Build
    jobs:
      - deployment: DeployToStaging
        displayName: 'Deploy to Azure App Service (Staging)'
        environment: 'Staging'
        strategy:
          runOnce:
            deploy:
              steps:
                # Download artifacts
                - download: current
                  artifact: drop

                # Extract artifacts to deployment folder
                - task: ExtractFiles@1
                  inputs:
                    archiveFilePatterns: '$(Pipeline.Workspace)/drop/app-$(Build.BuildId).zip'
                    destinationFolder: '$(Pipeline.Workspace)/deploy'
                  displayName: 'Extract App Files'

                - task: ExtractFiles@1
                  inputs:
                    archiveFilePatterns: '$(Pipeline.Workspace)/drop/static-$(Build.BuildId).zip'
                    destinationFolder: '$(Pipeline.Workspace)/deploy/.next/static'
                  displayName: 'Extract Static Assets'

                - task: ExtractFiles@1
                  inputs:
                    archiveFilePatterns: '$(Pipeline.Workspace)/drop/public-$(Build.BuildId).zip'
                    destinationFolder: '$(Pipeline.Workspace)/deploy/public'
                  displayName: 'Extract Public Assets'

                # Deploy to Azure App Service
                - task: AzureWebApp@1
                  inputs:
                    azureSubscription: 'Azure-Service-Connection-Staging'
                    appName: 'cca-staging'
                    package: '$(Pipeline.Workspace)/deploy'
                    appSettings: |
                      -WEBSITES_PORT 3000
                      -WEBSITE_NODE_DEFAULT_VERSION ~18
                      -NODE_ENV production
                  displayName: 'Deploy to Staging App Service'

                # Run database migrations
                - task: AzureCLI@2
                  inputs:
                    azureSubscription: 'Azure-Service-Connection-Staging'
                    scriptType: 'bash'
                    scriptLocation: 'inlineScript'
                    inlineScript: |
                      # Trigger migration via Kudu API
                      az webapp config appsettings set \
                        --name cca-staging \
                        --resource-group cca-staging-rg \
                        --settings RUN_MIGRATIONS=true
                      
                      # Wait for app restart
                      sleep 30
                      
                      # Health check
                      curl -f https://cca-staging.azurewebsites.net/api/health || exit 1
                  displayName: 'Run Database Migrations'

  # ===== PRODUCTION DEPLOYMENT =====
  - stage: DeployProduction
    displayName: 'Deploy to Production'
    condition: and(succeeded(), eq(variables['Build.SourceBranch'], 'refs/heads/main'))
    dependsOn: Build
    jobs:
      - deployment: DeployToProduction
        displayName: 'Deploy to Azure App Service (Production)'
        environment: 'Production'
        strategy:
          runOnce:
            deploy:
              steps:
                # Download artifacts
                - download: current
                  artifact: drop

                # Extract artifacts
                - task: ExtractFiles@1
                  inputs:
                    archiveFilePatterns: '$(Pipeline.Workspace)/drop/app-$(Build.BuildId).zip'
                    destinationFolder: '$(Pipeline.Workspace)/deploy'
                  displayName: 'Extract App Files'

                - task: ExtractFiles@1
                  inputs:
                    archiveFilePatterns: '$(Pipeline.Workspace)/drop/static-$(Build.BuildId).zip'
                    destinationFolder: '$(Pipeline.Workspace)/deploy/.next/static'
                  displayName: 'Extract Static Assets'

                - task: ExtractFiles@1
                  inputs:
                    archiveFilePatterns: '$(Pipeline.Workspace)/drop/public-$(Build.BuildId).zip'
                    destinationFolder: '$(Pipeline.Workspace)/deploy/public'
                  displayName: 'Extract Public Assets'

                # Slot deployment for zero-downtime
                - task: AzureWebApp@1
                  inputs:
                    azureSubscription: 'Azure-Service-Connection-Production'
                    appName: 'cca-prod'
                    slotName: 'staging-slot'
                    package: '$(Pipeline.Workspace)/deploy'
                    appSettings: |
                      -WEBSITES_PORT 3000
                      -WEBSITE_NODE_DEFAULT_VERSION ~18
                      -NODE_ENV production
                  displayName: 'Deploy to Staging Slot'

                # Smoke test staging slot
                - task: AzureCLI@2
                  inputs:
                    azureSubscription: 'Azure-Service-Connection-Production'
                    scriptType: 'bash'
                    scriptLocation: 'inlineScript'
                    inlineScript: |
                      # Health check on staging slot
                      curl -f https://cca-prod-staging-slot.azurewebsites.net/api/health || exit 1
                      
                      # Test critical endpoints
                      curl -f https://cca-prod-staging-slot.azurewebsites.net/ || exit 1
                  displayName: 'Smoke Test Staging Slot'

                # Swap slots (zero-downtime deployment)
                - task: AzureAppServiceManage@0
                  inputs:
                    azureSubscription: 'Azure-Service-Connection-Production'
                    Action: 'Swap Slots'
                    WebAppName: 'cca-prod'
                    ResourceGroupName: 'cca-prod-rg'
                    SourceSlot: 'staging-slot'
                  displayName: 'Swap Slots (Go Live)'

                # Post-deployment health check
                - task: AzureCLI@2
                  inputs:
                    azureSubscription: 'Azure-Service-Connection-Production'
                    scriptType: 'bash'
                    scriptLocation: 'inlineScript'
                    inlineScript: |
                      sleep 15
                      curl -f https://cca-prod.azurewebsites.net/api/health || exit 1
                  displayName: 'Production Health Check'
```

#### Pipeline Variables Configuration
In Azure DevOps > Pipelines > Library > Variable Groups:

**Staging Variable Group** (`staging-env-vars`):
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = pk_test_...
CLERK_SECRET_KEY = sk_test_... (Secret)
DATABASE_URL = postgresql://... (Secret)
NEXT_PUBLIC_SUPABASE_URL = https://qtrypzzcjebvfcihiynt.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJh... (Secret)
SUPABASE_SERVICE_ROLE_KEY = eyJh... (Secret)
STRIPE_SECRET_KEY = sk_test_... (Secret)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = pk_test_...
NEXT_PUBLIC_APP_URL = https://cca-staging.azurewebsites.net
```

**Production Variable Group** (`production-env-vars`):
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = pk_live_...
CLERK_SECRET_KEY = sk_live_... (Secret)
DATABASE_URL = postgresql://... (Secret)
NEXT_PUBLIC_SUPABASE_URL = https://qtrypzzcjebvfcihiynt.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJh... (Secret)
SUPABASE_SERVICE_ROLE_KEY = eyJh... (Secret)
STRIPE_SECRET_KEY = sk_live_... (Secret)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = pk_live_...
NEXT_PUBLIC_APP_URL = https://cca-prod.azurewebsites.net
```

---

### Method 2: GitHub Actions (Alternative)

Create `.github/workflows/azure-deploy.yml`:

```yaml
name: Deploy to Azure

on:
  push:
    branches:
      - main
      - staging

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Lint and type-check
        run: |
          npm run lint
          npx tsc --noEmit
      
      - name: Build
        run: npm run build
        env:
          NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: ${{ secrets.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY }}
          NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.NEXT_PUBLIC_SUPABASE_URL }}
          NEXT_PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.NEXT_PUBLIC_SUPABASE_ANON_KEY }}
      
      - name: Upload artifact
        uses: actions/upload-artifact@v4
        with:
          name: nextjs-build
          path: .next/

  deploy-staging:
    if: github.ref == 'refs/heads/staging'
    needs: build
    runs-on: ubuntu-latest
    environment: staging
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Download artifact
        uses: actions/download-artifact@v4
        with:
          name: nextjs-build
          path: .next/
      
      - name: Deploy to Azure Web App (Staging)
        uses: azure/webapps-deploy@v2
        with:
          app-name: 'cca-staging'
          publish-profile: ${{ secrets.AZURE_WEBAPP_PUBLISH_PROFILE_STAGING }}
          package: .

  deploy-production:
    if: github.ref == 'refs/heads/main'
    needs: build
    runs-on: ubuntu-latest
    environment: production
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Download artifact
        uses: actions/download-artifact@v4
        with:
          name: nextjs-build
          path: .next/
      
      - name: Deploy to Azure Web App (Production)
        uses: azure/webapps-deploy@v2
        with:
          app-name: 'cca-prod'
          slot-name: 'staging-slot'
          publish-profile: ${{ secrets.AZURE_WEBAPP_PUBLISH_PROFILE_PROD }}
          package: .
      
      - name: Swap slots
        uses: azure/cli@v1
        with:
          inlineScript: |
            az webapp deployment slot swap \
              --name cca-prod \
              --resource-group cca-prod-rg \
              --slot staging-slot \
              --target-slot production
```

---

## Environment Configuration

### App Service Configuration

#### Staging App Settings
```bash
az webapp config appsettings set \
  --name cca-staging \
  --resource-group cca-staging-rg \
  --settings \
    WEBSITES_PORT=3000 \
    WEBSITE_NODE_DEFAULT_VERSION="~18" \
    NODE_ENV="production" \
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="@Microsoft.KeyVault(SecretUri=https://cca-staging-vault.vault.azure.net/secrets/clerk-pub-key/)" \
    CLERK_SECRET_KEY="@Microsoft.KeyVault(SecretUri=https://cca-staging-vault.vault.azure.net/secrets/clerk-secret/)" \
    DATABASE_URL="@Microsoft.KeyVault(SecretUri=https://cca-staging-vault.vault.azure.net/secrets/database-url/)" \
    NEXT_PUBLIC_SUPABASE_URL="https://qtrypzzcjebvfcihiynt.supabase.co" \
    NEXT_PUBLIC_SUPABASE_ANON_KEY="@Microsoft.KeyVault(SecretUri=https://cca-staging-vault.vault.azure.net/secrets/supabase-anon/)" \
    SUPABASE_SERVICE_ROLE_KEY="@Microsoft.KeyVault(SecretUri=https://cca-staging-vault.vault.azure.net/secrets/supabase-service/)" \
    STRIPE_SECRET_KEY="@Microsoft.KeyVault(SecretUri=https://cca-staging-vault.vault.azure.net/secrets/stripe-secret/)" \
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..." \
    NEXT_PUBLIC_APP_URL="https://cca-staging.azurewebsites.net"
```

#### Production App Settings
Same structure but with `cca-prod` resources and live keys.

---

## Secrets Management with Azure Key Vault

### Store Secrets in Key Vault
```bash
# Staging secrets
az keyvault secret set \
  --vault-name cca-staging-vault \
  --name clerk-secret \
  --value "sk_test_..."

az keyvault secret set \
  --vault-name cca-staging-vault \
  --name database-url \
  --value "postgresql://..."

az keyvault secret set \
  --vault-name cca-staging-vault \
  --name stripe-secret \
  --value "sk_test_..."

# Production secrets (repeat with cca-prod-vault and live keys)
```

### Grant App Service Access to Key Vault
```bash
# Enable managed identity for App Service
az webapp identity assign \
  --name cca-staging \
  --resource-group cca-staging-rg

# Get the principal ID
PRINCIPAL_ID=$(az webapp identity show \
  --name cca-staging \
  --resource-group cca-staging-rg \
  --query principalId -o tsv)

# Grant access to Key Vault
az keyvault set-policy \
  --name cca-staging-vault \
  --object-id $PRINCIPAL_ID \
  --secret-permissions get list
```

---

## Monitoring & Logging

### Application Insights Integration

#### Add SDK to Next.js
```typescript
// lib/azure-monitoring.ts
import { ApplicationInsights } from '@microsoft/applicationinsights-web';

let appInsights: ApplicationInsights | null = null;

export function initAppInsights() {
  if (typeof window === 'undefined') return;
  
  if (!appInsights) {
    appInsights = new ApplicationInsights({
      config: {
        connectionString: process.env.NEXT_PUBLIC_APPLICATIONINSIGHTS_CONNECTION_STRING,
        enableAutoRouteTracking: true,
        enableCorsCorrelation: true,
        enableRequestHeaderTracking: true,
        enableResponseHeaderTracking: true,
      }
    });
    
    appInsights.loadAppInsights();
    appInsights.trackPageView();
  }
  
  return appInsights;
}

export function trackEvent(name: string, properties?: Record<string, any>) {
  appInsights?.trackEvent({ name }, properties);
}

export function trackError(error: Error, properties?: Record<string, any>) {
  appInsights?.trackException({ exception: error }, properties);
}
```

#### Initialize in Layout
```typescript
// app/layout.tsx
import { initAppInsights } from '@/lib/azure-monitoring';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    initAppInsights();
  }, []);
  
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

### Azure Monitor Alerts
```bash
# Create alert for high error rate
az monitor metrics alert create \
  --name high-error-rate \
  --resource-group cca-prod-rg \
  --scopes /subscriptions/{sub-id}/resourceGroups/cca-prod-rg/providers/Microsoft.Web/sites/cca-prod \
  --condition "count exceptions > 10" \
  --window-size 5m \
  --evaluation-frequency 1m \
  --action-group alerts-action-group

# Create alert for high response time
az monitor metrics alert create \
  --name slow-response \
  --resource-group cca-prod-rg \
  --scopes /subscriptions/{sub-id}/resourceGroups/cca-prod-rg/providers/Microsoft.Web/sites/cca-prod \
  --condition "avg requests/duration > 3000" \
  --window-size 5m \
  --evaluation-frequency 1m
```

---

## Custom Domain & SSL

### Add Custom Domain
```bash
# Add custom domain
az webapp config hostname add \
  --webapp-name cca-prod \
  --resource-group cca-prod-rg \
  --hostname app.curling.ca

# Bind SSL certificate (managed)
az webapp config ssl bind \
  --certificate-thumbprint auto \
  --ssl-type SNI \
  --name cca-prod \
  --resource-group cca-prod-rg \
  --certificate-name app.curling.ca
```

### DNS Configuration
Add CNAME record in your DNS provider:
```
Type: CNAME
Name: app
Value: cca-prod.azurewebsites.net
TTL: 3600
```

---

## Scaling & Performance

### Auto-Scaling Rules
```bash
# Scale out when CPU > 70%
az monitor autoscale rule create \
  --resource-group cca-prod-rg \
  --autoscale-name cca-prod-autoscale \
  --condition "Percentage CPU > 70 avg 10m" \
  --scale out 1 \
  --cooldown 5

# Scale in when CPU < 30%
az monitor autoscale rule create \
  --resource-group cca-prod-rg \
  --autoscale-name cca-prod-autoscale \
  --condition "Percentage CPU < 30 avg 10m" \
  --scale in 1 \
  --cooldown 5

# Scale based on HTTP queue length
az monitor autoscale rule create \
  --resource-group cca-prod-rg \
  --autoscale-name cca-prod-autoscale \
  --condition "Http Queue Length > 100 avg 5m" \
  --scale out 1
```

### Azure CDN Setup
```bash
# Create Azure Front Door profile
az afd profile create \
  --profile-name cca-cdn \
  --resource-group cca-prod-rg \
  --sku Standard_AzureFrontDoor

# Create endpoint
az afd endpoint create \
  --profile-name cca-cdn \
  --endpoint-name cca-app \
  --resource-group cca-prod-rg \
  --enabled-state Enabled

# Add origin
az afd origin create \
  --profile-name cca-cdn \
  --origin-group-name default-origin-group \
  --origin-name app-service-origin \
  --resource-group cca-prod-rg \
  --host-name cca-prod.azurewebsites.net \
  --origin-host-header cca-prod.azurewebsites.net \
  --priority 1 \
  --weight 1000 \
  --enabled-state Enabled \
  --http-port 80 \
  --https-port 443
```

---

## Disaster Recovery

### Backup Strategy
```bash
# Enable automatic backups
az webapp config backup update \
  --resource-group cca-prod-rg \
  --webapp-name cca-prod \
  --container-url "https://ccabackups.blob.core.windows.net/backups?<SAS-token>" \
  --frequency 1d \
  --retention 30
```

### Database Backups
```sql
-- Supabase has automatic backups
-- For point-in-time recovery, use Supabase dashboard or CLI

-- Manual backup export:
pg_dump -h db.qtrypzzcjebvfcihiynt.supabase.co \
  -U postgres \
  -d postgres \
  --no-owner \
  --no-acl \
  -f backup-$(date +%Y%m%d).sql
```

---

## Cost Management

### Expected Monthly Costs

#### Staging Environment
| Resource | Tier | Cost/Month |
|----------|------|------------|
| App Service Plan | B1 | $13 |
| Application Insights | Pay-as-you-go | $5-10 |
| Key Vault | Standard | $0.03/10k ops |
| **Total** | | **~$20** |

#### Production Environment
| Resource | Tier | Cost/Month |
|----------|------|------------|
| App Service Plan | P1V2 (1-3 instances) | $73-219 |
| Azure Front Door | Standard | $35 + data transfer |
| Application Insights | Pay-as-you-go | $20-50 |
| Key Vault | Standard | $0.03/10k ops |
| **Total** | | **~$150-350** |

### Cost Optimization Tips
1. Use B1 tier for staging (sufficient for testing)
2. Enable auto-scaling in production only during peak times
3. Use Supabase free/pro tier instead of Azure Database for PostgreSQL ($free-$25 vs $100+)
4. Consider Azure Front Door only if you need global CDN
5. Set spending limits and alerts

---

## Deployment Workflow Summary

### Branch Strategy
```
main (production)
 ├── staging (staging environment)
 └── feature/* (local development)
```

### Deployment Flow
1. **Developer** creates feature branch from `staging`
2. **Developer** pushes to `feature/*` → No deployment
3. **Developer** creates PR to `staging`
4. **Team** reviews PR
5. **Merge** to `staging` → Auto-deploys to **Staging Environment**
6. **QA** tests on https://cca-staging.azurewebsites.net
7. **Team** creates PR from `staging` to `main`
8. **Merge** to `main` → Auto-deploys to **Production Environment**

### Rollback Procedure
```bash
# Option 1: Swap slots back (instant)
az webapp deployment slot swap \
  --name cca-prod \
  --resource-group cca-prod-rg \
  --slot staging-slot \
  --target-slot production

# Option 2: Redeploy previous version
az webapp deployment source config-zip \
  --name cca-prod \
  --resource-group cca-prod-rg \
  --src backup-build-12345.zip
```

---

## Health Check & Monitoring

### Create Health Check Endpoint
```typescript
// app/api/health/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/db/db';
import { sql } from 'drizzle-orm';

export async function GET() {
  try {
    // Check database connection
    await db.execute(sql`SELECT 1`);
    
    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: 'connected',
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: error.message,
      },
      { status: 503 }
    );
  }
}
```

### Configure Health Check in Azure
```bash
az webapp config set \
  --name cca-prod \
  --resource-group cca-prod-rg \
  --health-check-path /api/health
```

---

## Quick Start Checklist

### Initial Setup (One-Time)
- [ ] Create Azure resource groups (staging + production)
- [ ] Create App Service Plans and Web Apps
- [ ] Create Key Vaults
- [ ] Create Application Insights
- [ ] Store secrets in Key Vault
- [ ] Configure managed identities
- [ ] Set up Azure DevOps or GitHub Actions
- [ ] Configure deployment pipeline
- [ ] Set up custom domains and SSL
- [ ] Configure monitoring alerts

### Per Deployment
- [ ] Push code to `staging` branch
- [ ] Pipeline builds and deploys to staging
- [ ] Test on staging environment
- [ ] Merge to `main` branch
- [ ] Pipeline deploys to production slot
- [ ] Smoke tests pass
- [ ] Slots swap (zero-downtime)
- [ ] Monitor Application Insights

---

**Last Updated**: November 10, 2025  
**Status**: Ready for Azure deployment
