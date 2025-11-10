// Loyalty and Rewards Program Schema
import { pgTable, uuid, text, timestamp, integer, boolean, decimal, jsonb } from "drizzle-orm/pg-core";
import { users } from "./users";
import { events } from "./events";

// Loyalty tiers
export const loyaltyTiers = pgTable("loyalty_tiers", {
  id: uuid("id").primaryKey().defaultRandom(),
  
  name: text("name").notNull().unique(), // Bronze, Silver, Gold, Platinum, Elite
  slug: text("slug").notNull().unique(),
  
  // Tier requirements
  minPoints: integer("min_points").notNull(),
  maxPoints: integer("max_points"),
  
  // Benefits
  pointsMultiplier: decimal("points_multiplier", { precision: 3, scale: 2 }).default("1.00"),
  discountPercentage: decimal("discount_percentage", { precision: 5, scale: 2 }).default("0.00"),
  
  perks: jsonb("perks").$type<string[]>().default([]),
  
  // Display
  color: text("color"),
  badgeUrl: text("badge_url"),
  description: text("description"),
  
  // Order
  orderIndex: integer("order_index").notNull(),
  
  isActive: boolean("is_active").default(true),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Point transactions
export const pointTransactions = pgTable("point_transactions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  
  // Transaction type
  type: text("type").notNull(), // earn, redeem, expire, adjust, bonus, refund
  points: integer("points").notNull(), // positive for earn, negative for redeem
  
  // Source
  source: text("source").notNull(), // event_registration, merchandise, streaming, referral, admin
  sourceId: uuid("source_id"), // ID of event, product, etc.
  
  // Details
  description: text("description").notNull(),
  metadata: jsonb("metadata"),
  
  // Balance tracking
  balanceBefore: integer("balance_before").notNull(),
  balanceAfter: integer("balance_after").notNull(),
  
  // Expiry
  expiresAt: timestamp("expires_at"),
  isExpired: boolean("is_expired").default(false),
  
  // Processing
  processedAt: timestamp("processed_at").defaultNow().notNull(),
  processedBy: uuid("processed_by").references(() => users.id),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Rewards catalog
export const rewards = pgTable("rewards", {
  id: uuid("id").primaryKey().defaultRandom(),
  
  // Basic info
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  
  // Category
  category: text("category").notNull(), // merchandise, discounts, experiences, event_perks, digital_content
  
  // Cost
  pointsCost: integer("points_cost").notNull(),
  
  // Availability
  isActive: boolean("is_active").default(true),
  stock: integer("stock"), // null = unlimited
  maxRedemptionsPerUser: integer("max_redemptions_per_user"),
  
  // Eligibility
  minTierRequired: text("min_tier_required"), // References loyaltyTiers.slug
  
  // Media
  imageUrl: text("image_url"),
  thumbnailUrl: text("thumbnail_url"),
  
  // Details
  features: jsonb("features").$type<string[]>().default([]),
  termsAndConditions: text("terms_and_conditions"),
  
  // Redemption
  redemptionType: text("redemption_type").notNull(), // code, physical, digital, discount
  redemptionInstructions: text("redemption_instructions"),
  
  // Tracking
  totalRedemptions: integer("total_redemptions").default(0),
  
  // Validity
  validFrom: timestamp("valid_from"),
  validUntil: timestamp("valid_until"),
  
  // SEO
  tags: jsonb("tags").$type<string[]>().default([]),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Reward redemptions
export const redemptions = pgTable("redemptions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  rewardId: uuid("reward_id").references(() => rewards.id).notNull(),
  
  // Transaction
  pointsSpent: integer("points_spent").notNull(),
  
  // Status
  status: text("status").default("pending").notNull(), // pending, confirmed, fulfilled, cancelled, expired
  
  // Fulfillment
  redemptionCode: text("redemption_code").unique(),
  redemptionDetails: jsonb("redemption_details"),
  
  // Dates
  redeemedAt: timestamp("redeemed_at").defaultNow().notNull(),
  fulfilledAt: timestamp("fulfilled_at"),
  expiresAt: timestamp("expires_at"),
  
  // Shipping (if physical)
  shippingAddress: jsonb("shipping_address"),
  trackingNumber: text("tracking_number"),
  
  // Notes
  userNotes: text("user_notes"),
  adminNotes: text("admin_notes"),
  
  // Processing
  processedBy: uuid("processed_by").references(() => users.id),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Challenges (gamification)
export const challenges = pgTable("challenges", {
  id: uuid("id").primaryKey().defaultRandom(),
  
  // Basic info
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull(),
  
  // Type
  type: text("type").notNull(), // event_attendance, watch_streams, refer_friends, social_share, profile_completion
  
  // Requirements
  goalCount: integer("goal_count").notNull(), // e.g., attend 5 events
  goalMetric: text("goal_metric").notNull(), // events_attended, minutes_watched, friends_referred
  
  // Rewards
  pointsReward: integer("points_reward").notNull(),
  badgeUrl: text("badge_url"),
  
  // Difficulty
  difficulty: text("difficulty"), // easy, medium, hard
  
  // Availability
  isActive: boolean("is_active").default(true),
  isRecurring: boolean("is_recurring").default(false),
  recurringPeriod: text("recurring_period"), // daily, weekly, monthly, seasonal
  
  // Dates
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  
  // Display
  featured: boolean("featured").default(false),
  category: text("category"),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// User challenge progress
export const userChallenges = pgTable("user_challenges", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  challengeId: uuid("challenge_id").references(() => challenges.id).notNull(),
  
  // Progress
  currentProgress: integer("current_progress").default(0),
  goalCount: integer("goal_count").notNull(),
  
  // Status
  status: text("status").default("in_progress").notNull(), // in_progress, completed, expired, claimed
  
  // Dates
  startedAt: timestamp("started_at").defaultNow().notNull(),
  completedAt: timestamp("completed_at"),
  claimedAt: timestamp("claimed_at"),
  expiresAt: timestamp("expires_at"),
  
  // Reward
  pointsEarned: integer("points_earned"),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Referrals
export const referrals = pgTable("referrals", {
  id: uuid("id").primaryKey().defaultRandom(),
  
  referrerId: uuid("referrer_id").references(() => users.id).notNull(),
  referredId: uuid("referred_id").references(() => users.id),
  
  // Code
  referralCode: text("referral_code").notNull().unique(),
  
  // Status
  status: text("status").default("pending").notNull(), // pending, completed, expired
  
  // Rewards
  referrerPointsEarned: integer("referrer_points_earned").default(0),
  referredPointsEarned: integer("referred_points_earned").default(0),
  
  // Dates
  createdAt: timestamp("created_at").defaultNow().notNull(),
  completedAt: timestamp("completed_at"),
  expiresAt: timestamp("expires_at"),
});
