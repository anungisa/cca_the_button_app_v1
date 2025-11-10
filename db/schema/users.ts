// Core User Schema for Curling Canada
import { pgTable, uuid, text, timestamp, integer, boolean, jsonb } from "drizzle-orm/pg-core";

// Main users table (synced with Clerk)
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  clerkUserId: text("clerk_user_id").notNull().unique(),
  email: text("email").notNull().unique(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  fullName: text("full_name"),
  profileImageUrl: text("profile_image_url"),
  
  // User type and roles
  userType: text("user_type").notNull().default("fan"), // fan, athlete, coach, official, staff, admin, volunteer, sponsor
  roles: jsonb("roles").$type<string[]>().default([]),
  
  // Loyalty program
  totalPoints: integer("total_points").default(0),
  currentTier: text("current_tier").default("bronze"), // bronze, silver, gold, platinum
  lifetimePoints: integer("lifetime_points").default(0),
  
  // Profile details
  phone: text("phone"),
  dateOfBirth: timestamp("date_of_birth"),
  gender: text("gender"),
  province: text("province"),
  city: text("city"),
  postalCode: text("postal_code"),
  
  // Preferences
  preferredLanguage: text("preferred_language").default("en"), // en, fr
  emailNotifications: boolean("email_notifications").default(true),
  smsNotifications: boolean("sms_notifications").default(false),
  pushNotifications: boolean("push_notifications").default(true),
  
  // Athlete-specific
  athleteId: text("athlete_id"), // External athlete ID if applicable
  sportLevel: text("sport_level"), // recreational, competitive, elite
  primaryPosition: text("primary_position"),
  
  // Social
  bio: text("bio"),
  instagramHandle: text("instagram_handle"),
  twitterHandle: text("twitter_handle"),
  facebookProfile: text("facebook_profile"),
  
  // Metadata
  lastLoginAt: timestamp("last_login_at"),
  isActive: boolean("is_active").default(true),
  isVerified: boolean("is_verified").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// User permissions and role assignments
export const userPermissions = pgTable("user_permissions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  permission: text("permission").notNull(), // view_admin, manage_events, manage_clubs, etc.
  resource: text("resource"), // events, clubs, competitions, etc.
  resourceId: uuid("resource_id"), // Specific resource ID if scoped
  grantedBy: uuid("granted_by").references(() => users.id),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// User preferences and settings
export const userSettings = pgTable("user_settings", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id).notNull().unique(),
  theme: text("theme").default("light"), // light, dark, auto
  timezone: text("timezone").default("America/Toronto"),
  notificationFrequency: text("notification_frequency").default("instant"), // instant, daily, weekly
  favoriteTeams: jsonb("favorite_teams").$type<string[]>().default([]),
  favoriteAthletes: jsonb("favorite_athletes").$type<string[]>().default([]),
  interests: jsonb("interests").$type<string[]>().default([]),
  privacySettings: jsonb("privacy_settings").default({}),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
