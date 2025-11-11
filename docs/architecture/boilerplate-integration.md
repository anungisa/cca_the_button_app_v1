# Boilerplate Integration Guide

## Overview

The **CodeSpring Boilerplate** provides a pre-configured Next.js 14 foundation with Clerk, Drizzle ORM, Stripe, and shadcn/ui. This guide shows how to leverage it for the Curling Canada migration.

---

## What the Boilerplate Provides

### ✅ Already Configured
1. **Next.js 14 App Router** - Latest Next.js with Server Components
2. **Clerk Authentication** - Pre-wired with middleware
3. **Drizzle ORM** - Type-safe database ORM (PostgreSQL via Supabase)
4. **Stripe Integration** - Payment processing ready
5. **shadcn/ui Components** - All Radix UI components configured
6. **TypeScript** - Strict mode enabled
7. **Tailwind CSS** - With animations
8. **Database Scripts** - Migration commands ready

### 📦 Key Dependencies Included
```json
{
  "@clerk/nextjs": "^5.3.7",
  "@clerk/backend": "^1.9.0",
  "drizzle-orm": "^0.33.0",
  "postgres": "^3.4.4",
  "stripe": "^16.9.0",
  "@radix-ui/*": "All UI primitives",
  "react-hook-form": "^7.53.0",
  "zod": "^3.23.8",
  "recharts": "^2.12.7"
}
```

### 📁 Folder Structure
```
codespring-boilerplate/
├── app/              # Next.js App Router pages
│   ├── (auth)/      # Auth pages (sign-in, sign-up)
│   ├── (marketing)/ # Public pages
│   ├── dashboard/   # Protected dashboard
│   └── api/         # API routes
├── components/      # React components
│   ├── ui/          # shadcn/ui components (50+)
│   └── utilities/   # Helper components
├── db/
│   ├── schema/      # Drizzle schemas
│   ├── queries/     # Database queries
│   └── migrations/  # DB migrations
├── actions/         # Server Actions
├── lib/             # Utilities
└── types/           # TypeScript types
```

---

## Integration Strategy

### Step 1: Rename and Initialize
```bash
# Rename the boilerplate folder
cd d:/APPS/cca_the_button_app_v1
mv codespring-boilerplate curling-canada-app

# Update package.json name
cd curling-canada-app
# Edit package.json: "name": "curling-canada-app"

# Reconnect to your Git repo
git remote remove origin
git remote add origin https://github.com/anungisa/cca_the_button_app_v1.git
git branch -M main
git push -u origin main --force  # ⚠️ This overwrites existing repo!
```

### Step 2: Leverage Existing Structure

#### Use Pre-Built Components
The boilerplate includes 50+ shadcn/ui components:
```typescript
// Already available in components/ui/
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Dialog } from "@/components/ui/dialog"
import { Table } from "@/components/ui/table"
import { Tabs } from "@/components/ui/tabs"
// ... 45+ more
```

#### Extend Database Schema
```typescript
// db/schema/curling-entities.ts
import { pgTable, uuid, text, timestamp, integer } from "drizzle-orm/pg-core";

export const clubs = pgTable("clubs", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  province: text("province"),
  city: text("city"),
  memberCount: integer("member_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const events = pgTable("events", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  description: text("description"),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date"),
  venueId: uuid("venue_id").references(() => clubs.id),
  createdAt: timestamp("created_at").defaultNow(),
});

// Export from db/schema/index.ts
export * from "./curling-entities";
```

#### Use Existing Server Actions Pattern
```typescript
// actions/club-actions.ts
"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/db/db";
import { clubs } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getClubs() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  return await db.select().from(clubs).orderBy(clubs.name);
}

export async function createClub(data: { name: string; province: string }) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const [club] = await db.insert(clubs).values(data).returning();
  return club;
}
```

---

## Database Migration from Base44

### Option 1: Use Drizzle Migrations (Recommended)

#### Step 1: Define All Schemas
```typescript
// db/schema/index.ts
export * from "./users";
export * from "./clubs";
export * from "./events";
export * from "./loyalty";
export * from "./performance";
// ... all 166 entities
```

#### Step 2: Generate Migration
```bash
npm run db:generate
# Creates migration files in db/migrations/
```

#### Step 3: Apply Migration
```bash
npm run db:migrate
# Applies to your Supabase database
```

#### Step 4: Import Legacy Data
```typescript
// scripts/import-legacy-data.ts
import { db } from "@/db/db";
import { users, clubs, events } from "@/db/schema";
import legacyData from "./exported-data.json";

async function importLegacyData() {
  // Import users
  for (const user of legacyData.users) {
    await db.insert(users).values({
      clerkUserId: user.clerkMappingId,
      email: user.email,
      fullName: user.name,
      userType: user.user_type,
      totalPoints: user.points || 0,
      currentTier: user.tier || "bronze",
    });
  }
  
  // Import clubs
  for (const club of legacyData.clubs) {
    await db.insert(clubs).values({
      name: club.name,
      province: club.province,
      city: club.city,
    });
  }
  
  console.log("✅ Legacy data imported");
}

importLegacyData();
```

### Option 2: Supabase Direct Import
```sql
-- Use Supabase SQL Editor for bulk imports
COPY clubs (id, name, province, city, created_at)
FROM '/path/to/clubs.csv'
DELIMITER ','
CSV HEADER;
```

---

## Azure Deployment Preparation

### Key Changes Needed

#### 1. Switch from Vercel to Azure
The boilerplate is Vercel-optimized. For Azure, adjust:

##### Update `next.config.mjs`
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone', // ✅ Enable for Azure Container Apps
  
  // Azure Static Web Apps specific
  // output: 'export', // Use this for Static Web Apps
  
  images: {
    unoptimized: true, // May be needed for Azure
    domains: [
      'qtrypzzcjebvfcihiynt.supabase.co', // Supabase storage
      'img.clerk.com', // Clerk avatars
    ],
  },
};

export default nextConfig;
```

#### 2. Add Azure Configuration Files

##### Create `azure-pipelines.yml`
```yaml
# Azure DevOps Pipeline for CI/CD
trigger:
  - main
  - staging

pool:
  vmImage: 'ubuntu-latest'

variables:
  nodeVersion: '18.x'

stages:
  - stage: Build
    jobs:
      - job: BuildAndTest
        steps:
          - task: NodeTool@0
            inputs:
              versionSpec: $(nodeVersion)
            displayName: 'Install Node.js'

          - script: |
              npm ci
              npm run lint
              npm run type-check
            displayName: 'Install and Lint'

          - script: |
              npm run build
            displayName: 'Build Next.js'
            env:
              NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: $(CLERK_PUBLISHABLE_KEY)
              CLERK_SECRET_KEY: $(CLERK_SECRET_KEY)
              DATABASE_URL: $(DATABASE_URL)
              NEXT_PUBLIC_SUPABASE_URL: $(SUPABASE_URL)
              NEXT_PUBLIC_SUPABASE_ANON_KEY: $(SUPABASE_ANON_KEY)

          - task: ArchiveFiles@2
            inputs:
              rootFolderOrFile: '$(System.DefaultWorkingDirectory)'
              includeRootFolder: false
              archiveType: 'zip'
              archiveFile: '$(Build.ArtifactStagingDirectory)/$(Build.BuildId).zip'
            displayName: 'Archive build'

          - task: PublishBuildArtifacts@1
            inputs:
              PathtoPublish: '$(Build.ArtifactStagingDirectory)'
              ArtifactName: 'drop'
            displayName: 'Publish artifacts'

  - stage: DeployStaging
    condition: and(succeeded(), eq(variables['Build.SourceBranch'], 'refs/heads/staging'))
    jobs:
      - deployment: DeployToStaging
        environment: 'Staging'
        strategy:
          runOnce:
            deploy:
              steps:
                - task: AzureWebApp@1
                  inputs:
                    azureSubscription: '<Azure-Service-Connection>'
                    appName: 'cca-staging'
                    package: '$(Pipeline.Workspace)/drop/$(Build.BuildId).zip'

  - stage: DeployProduction
    condition: and(succeeded(), eq(variables['Build.SourceBranch'], 'refs/heads/main'))
    jobs:
      - deployment: DeployToProduction
        environment: 'Production'
        strategy:
          runOnce:
            deploy:
              steps:
                - task: AzureWebApp@1
                  inputs:
                    azureSubscription: '<Azure-Service-Connection>'
                    appName: 'cca-prod'
                    package: '$(Pipeline.Workspace)/drop/$(Build.BuildId).zip'
```

##### Create `Dockerfile` (for Container Apps)
```dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build args for environment variables
ARG NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY

ENV NEXT_TELEMETRY_DISABLED 1
ENV NODE_ENV production

RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

##### Create `.dockerignore`
```
node_modules
.next
.git
*.md
.env.local
.env*.local
```

#### 3. Environment Variables in Azure

##### Azure App Service Configuration
```bash
# Set via Azure Portal > Configuration > Application Settings
# Or use Azure CLI:

az webapp config appsettings set \
  --name cca-staging \
  --resource-group cca-rg \
  --settings \
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..." \
    CLERK_SECRET_KEY="sk_test_..." \
    DATABASE_URL="postgresql://..." \
    NEXT_PUBLIC_SUPABASE_URL="https://..." \
    NEXT_PUBLIC_SUPABASE_ANON_KEY="..." \
    SUPABASE_SERVICE_ROLE_KEY="..." \
    STRIPE_SECRET_KEY="sk_test_..." \
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
```

---

## Leveraging Boilerplate Features

### 1. Authentication (Already Done!)
The boilerplate has Clerk fully configured:
- ✅ Middleware protecting routes
- ✅ Sign-in/Sign-up pages styled
- ✅ User button component
- ✅ Server-side auth helpers

**Just customize the protected routes:**
```typescript
// middleware.ts
const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/clubs(.*)',
  '/events/register(.*)',
  '/performance(.*)',
  '/staff-hq(.*)',
  // Add all your protected routes
]);
```

### 2. Database Layer (Extend, Don't Rebuild)
The boilerplate uses Drizzle ORM. Just add your schemas:

```typescript
// db/schema/loyalty.ts
import { pgTable, uuid, integer, text, timestamp } from "drizzle-orm/pg-core";
import { users } from "./users";

export const pointTransactions = pgTable("point_transactions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  points: integer("points").notNull(),
  reason: text("reason"),
  transactionType: text("transaction_type").notNull(), // 'earn' | 'spend'
  createdAt: timestamp("created_at").defaultNow(),
});

export const rewards = pgTable("rewards", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  description: text("description"),
  pointsCost: integer("points_cost").notNull(),
  imageUrl: text("image_url"),
  availableQuantity: integer("available_quantity"),
  createdAt: timestamp("created_at").defaultNow(),
});
```

### 3. Payment Processing (Stripe Ready)
The boilerplate has Stripe actions. Adapt for your use case:

```typescript
// actions/donation-actions.ts
"use server";

import { auth } from "@clerk/nextjs/server";
import { stripe } from "@/lib/stripe";
import { db } from "@/db/db";
import { donations } from "@/db/schema";

export async function createDonationCheckout(amount: number) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "cad",
          product_data: {
            name: "Donation to Curling Canada",
          },
          unit_amount: amount * 100, // Convert to cents
        },
        quantity: 1,
      },
    ],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/donations/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/donations`,
    metadata: {
      userId,
      type: "donation",
    },
  });

  return { url: session.url };
}

// Webhook handler already exists in app/api/stripe/webhooks/route.ts
```

### 4. UI Components (50+ Ready to Use)
Don't rebuild common components:

```typescript
// Example: Events listing page
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";

export default async function EventsPage() {
  const events = await getEvents();
  
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {events.map(event => (
        <Card key={event.id}>
          <CardHeader>
            <CardTitle>{event.title}</CardTitle>
            <CardDescription>
              {format(event.startDate, "PPP")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Badge>{event.eventType}</Badge>
            <Button className="mt-4" asChild>
              <Link href={`/events/${event.id}`}>View Details</Link>
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
```

---

## Modified Migration Timeline

### Phase 0: Foundation (2-3 weeks instead of 4-6)
**Savings**: Boilerplate eliminates setup work

- [x] ✅ Next.js project setup
- [x] ✅ Clerk authentication
- [x] ✅ Database ORM configured
- [x] ✅ UI component library
- [x] ✅ TypeScript configured
- [ ] Define Curling Canada schemas
- [ ] Set up Azure pipelines
- [ ] Configure staging environment
- [ ] Migrate Home page content

---

## Azure-Specific Considerations

### 1. Azure Services Needed

#### Staging Environment
```
Resource Group: cca-staging-rg
├── App Service Plan: cca-staging-plan (B1 or S1)
├── App Service: cca-staging
├── Application Insights: cca-staging-insights
└── Key Vault: cca-staging-vault (for secrets)
```

#### Production Environment
```
Resource Group: cca-prod-rg
├── App Service Plan: cca-prod-plan (P1V2 or P2V2)
├── App Service: cca-prod
├── Application Insights: cca-prod-insights
├── Azure Front Door: cca-cdn (optional, for CDN)
└── Key Vault: cca-prod-vault
```

### 2. Database Hosting
**Options:**
1. **Keep Supabase** (Recommended)
   - Already integrated in boilerplate
   - Includes auth, storage, real-time
   - Global edge network
   - No Azure hosting needed for DB

2. **Azure Database for PostgreSQL**
   - Fully managed PostgreSQL
   - Private endpoint support
   - Update `DATABASE_URL` to Azure connection string

### 3. Monitoring & Logging
```typescript
// lib/azure-insights.ts
import { ApplicationInsights } from "@azure/applicationinsights-web";

export const appInsights = new ApplicationInsights({
  config: {
    connectionString: process.env.APPLICATIONINSIGHTS_CONNECTION_STRING,
    enableAutoRouteTracking: true,
    enableCorsCorrelation: true,
    enableRequestHeaderTracking: true,
    enableResponseHeaderTracking: true,
  }
});

if (typeof window !== 'undefined') {
  appInsights.loadAppInsights();
  appInsights.trackPageView();
}
```

### 4. Azure CDN for Assets
```javascript
// next.config.mjs
const nextConfig = {
  assetPrefix: process.env.NODE_ENV === 'production' 
    ? 'https://cca-cdn.azureedge.net' 
    : undefined,
};
```

---

## Cost Optimization

### Development/Staging
- App Service: B1 tier (~$13/month)
- Supabase: Free tier
- Clerk: Free tier (up to 10k MAU)
- Stripe: Pay per transaction

### Production
- App Service: P1V2 tier (~$73/month)
- Azure Front Door: Pay per GB (~$0.25/GB)
- Application Insights: Pay per GB
- Supabase: Pro tier ($25/month) or Team ($599/mo)

**Estimated Monthly Cost**: $150-250 for staging + production

---

## Quick Start Checklist

### Using the Boilerplate
- [ ] Rename `codespring-boilerplate` to `curling-canada-app`
- [ ] Update `package.json` name field
- [ ] Configure Supabase connection (already has structure)
- [ ] Add Curling Canada database schemas
- [ ] Generate and run migrations
- [ ] Customize middleware protected routes
- [ ] Replace placeholder content
- [ ] Configure Azure DevOps pipeline
- [ ] Set up staging environment in Azure
- [ ] Deploy and test

### Time Savings
**Original Estimate**: 4-6 weeks for Phase 0  
**With Boilerplate**: 2-3 weeks for Phase 0  
**Savings**: ~50% reduction in foundation setup time

---

## Next Steps

1. **Review** this document with team
2. **Decide** on Azure vs Vercel (or hybrid)
3. **Set up** Azure resources (staging first)
4. **Extend** boilerplate schemas with Curling entities
5. **Start** migrating high-priority pages

---

**Last Updated**: November 10, 2025  
**Status**: Ready for implementation with boilerplate
