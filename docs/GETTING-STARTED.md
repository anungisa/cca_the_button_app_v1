# 🚀 Getting Started - Curling Canada App

**Quick start guide for developers joining the migration project**

---

## Prerequisites

- [x] Node.js 20 LTS installed
- [x] Git installed
- [x] VS Code (or preferred IDE)
- [x] Azure CLI installed
- [x] Access to Curling Canada Azure subscription

---

## 1️⃣ Clone & Setup

```powershell
# Clone the repository
git clone https://github.com/anungisa/cca_the_button_app_v1.git
cd cca_the_button_app_v1

# Navigate to the app
cd curling-canada-app

# Install dependencies
npm install

# Copy environment variables
cp .env.local.example .env.local

# Edit .env.local with your keys (ask team lead)
```

---

## 2️⃣ Environment Variables

Ask the team lead for:
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - From Supabase dashboard
- `SUPABASE_SERVICE_ROLE_KEY` - From Supabase dashboard (sensitive!)

Already configured:
- ✅ `DATABASE_URL` - Supabase PostgreSQL connection
- ✅ `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` - Clerk auth (test)
- ✅ `CLERK_SECRET_KEY` - Clerk auth (test)

---

## 3️⃣ Run Locally

```powershell
# Start development server
npm run dev

# App will run on http://localhost:3000 (or next available port)
```

**Expected Output**:
```
✓ Ready in 5s
Local: http://localhost:3004
```

---

## 4️⃣ Database Commands

```powershell
# Generate new migration (after schema changes)
npm run db:generate

# Apply migrations to database
npm run db:migrate

# Type check
npm run type-check
```

---

## 5️⃣ Project Structure

```
curling-canada-app/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Authentication pages
│   ├── (marketing)/       # Public pages (home, about, etc.)
│   ├── dashboard/         # Protected dashboard
│   └── api/               # API routes
├── components/            # React components
│   ├── ui/               # shadcn/ui components (50+)
│   └── utilities/        # Helper components
├── db/
│   ├── schema/           # Drizzle ORM schemas (ADD YOUR ENTITIES HERE)
│   ├── queries/          # Database queries
│   └── migrations/       # DB migrations
├── actions/              # Server Actions (use this pattern!)
├── lib/                  # Utilities
└── types/                # TypeScript types
```

---

## 6️⃣ Creating Your First Entity

### Step 1: Define Schema

Create `db/schema/clubs.ts`:

```typescript
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
```

### Step 2: Export Schema

Update `db/schema/index.ts`:

```typescript
export * from "./users";
export * from "./clubs";  // Add this line
```

### Step 3: Generate Migration

```powershell
npm run db:generate
# Creates a migration file in db/migrations/
```

### Step 4: Apply Migration

```powershell
npm run db:migrate
# Applies to your Supabase database
```

### Step 5: Create Server Action

Create `actions/club-actions.ts`:

```typescript
"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/db/db";
import { clubs } from "@/db/schema";

export async function getClubs() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");
  
  return await db.select().from(clubs).orderBy(clubs.name);
}
```

---

## 7️⃣ Azure Deployment

```powershell
# Login to Azure
az login

# Set subscription
az account set --subscription "Subscription 1_the button"

# Deploy to staging
npm run build
# (Full CI/CD pipeline coming soon)
```

**Staging URL**: https://cca-staging.azurewebsites.net  
**Production URL**: https://cca-prod.azurewebsites.net

---

## 8️⃣ Common Tasks

### Add a New Page

```typescript
// app/(marketing)/about/page.tsx
export default function AboutPage() {
  return <h1>About Curling Canada</h1>;
}
```

### Use a UI Component

```typescript
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function MyPage() {
  return (
    <Card>
      <Button>Click me</Button>
    </Card>
  );
}
```

### Query Database

```typescript
// In a Server Component
import { db } from "@/db/db";
import { clubs } from "@/db/schema";

export default async function ClubsPage() {
  const allClubs = await db.select().from(clubs);
  
  return (
    <div>
      {allClubs.map(club => (
        <div key={club.id}>{club.name}</div>
      ))}
    </div>
  );
}
```

---

## 9️⃣ Useful Commands

```powershell
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run lint             # Run ESLint
npm run type-check       # Check TypeScript

# Database
npm run db:generate      # Generate migration
npm run db:migrate       # Apply migrations

# Azure
az login                 # Login to Azure
az account show          # Show current subscription
az webapp restart        # Restart web app
```

---

## 🔟 Getting Help

**Documentation**:
- 📖 [Phase 0 Progress](./PHASE-0-PROGRESS.md)
- 🏗️ [Boilerplate Integration](./architecture/boilerplate-integration.md)
- ☁️ [Azure Deployment](./architecture/azure-deployment.md)
- 🗺️ [Migration Strategy](./migration-guides/migration-strategy.md)

**Team Contacts**:
- Technical Lead: [Name]
- Azure Admin: [Name]
- Database Admin: [Name]

**Resources**:
- Next.js Docs: https://nextjs.org/docs
- Drizzle ORM: https://orm.drizzle.team/docs
- Clerk Docs: https://clerk.com/docs
- shadcn/ui: https://ui.shadcn.com/

---

## ✅ Checklist for New Developers

- [ ] Cloned repository
- [ ] Installed dependencies
- [ ] Configured .env.local
- [ ] Started dev server successfully
- [ ] Read Phase 0 Progress document
- [ ] Read Boilerplate Integration guide
- [ ] Created test entity schema
- [ ] Generated and applied test migration
- [ ] Deployed to staging (with team)
- [ ] Joined team communication channels

---

**Welcome to the team!** 🏒

If you get stuck, check the documentation or ask the team lead.

---

**Last Updated**: November 10, 2025
