// Clubs and Organizations Schema
import { pgTable, uuid, text, timestamp, integer, boolean, decimal, jsonb } from "drizzle-orm/pg-core";
import { users } from "./users";

// Clubs table
export const clubs = pgTable("clubs", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  displayName: text("display_name"),
  slug: text("slug").notNull().unique(),
  
  // Location
  province: text("province").notNull(),
  city: text("city").notNull(),
  address: text("address"),
  postalCode: text("postal_code"),
  latitude: decimal("latitude", { precision: 10, scale: 7 }),
  longitude: decimal("longitude", { precision: 10, scale: 7 }),
  
  // Contact
  email: text("email"),
  phone: text("phone"),
  website: text("website"),
  
  // Details
  description: text("description"),
  logoUrl: text("logo_url"),
  bannerUrl: text("banner_url"),
  establishedYear: integer("established_year"),
  
  // Membership
  memberCount: integer("member_count").default(0),
  activeMembers: integer("active_members").default(0),
  membershipTypes: jsonb("membership_types").$type<string[]>().default([]),
  
  // Facilities
  numberOfSheets: integer("number_of_sheets"),
  hasLounge: boolean("has_lounge").default(false),
  hasProShop: boolean("has_pro_shop").default(false),
  facilityType: text("facility_type"), // dedicated, arena, community_center
  
  // Social media
  facebookPage: text("facebook_page"),
  instagramHandle: text("instagram_handle"),
  twitterHandle: text("twitter_handle"),
  
  // Status
  isActive: boolean("is_active").default(true),
  isVerified: boolean("is_verified").default(false),
  affiliationStatus: text("affiliation_status").default("pending"), // pending, active, suspended
  
  // Metadata
  createdBy: uuid("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Club memberships
export const clubMemberships = pgTable("club_memberships", {
  id: uuid("id").primaryKey().defaultRandom(),
  clubId: uuid("club_id").references(() => clubs.id).notNull(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  
  membershipType: text("membership_type").notNull(), // full, social, junior, senior, student
  role: text("role").default("member"), // member, manager, admin, coach, board
  
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date"),
  isActive: boolean("is_active").default(true),
  
  membershipNumber: text("membership_number"),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Club officials and staff
export const clubOfficials = pgTable("club_officials", {
  id: uuid("id").primaryKey().defaultRandom(),
  clubId: uuid("club_id").references(() => clubs.id).notNull(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  
  position: text("position").notNull(), // president, vice_president, secretary, treasurer, manager
  title: text("title"),
  department: text("department"),
  
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date"),
  isActive: boolean("is_active").default(true),
  
  contactEmail: text("contact_email"),
  contactPhone: text("contact_phone"),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
