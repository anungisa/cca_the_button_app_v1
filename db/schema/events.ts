// Events and Competitions Schema
import { pgTable, uuid, text, timestamp, integer, boolean, decimal, jsonb } from "drizzle-orm/pg-core";
import { users } from "./users";
import { clubs } from "./clubs";

// Events table
export const events = pgTable("events", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  
  // Event type
  eventType: text("event_type").notNull(), // competition, clinic, social, fundraiser, meeting, broadcast
  category: text("category"), // championship, bonspiel, league, skills, training
  level: text("level"), // recreational, club, provincial, national, international
  
  // Dates and times
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  registrationOpenDate: timestamp("registration_open_date"),
  registrationCloseDate: timestamp("registration_close_date"),
  
  // Location
  venueId: uuid("venue_id").references(() => clubs.id),
  venueName: text("venue_name"),
  venueAddress: text("venue_address"),
  city: text("city"),
  province: text("province"),
  isVirtual: boolean("is_virtual").default(false),
  virtualLink: text("virtual_link"),
  
  // Registration
  maxParticipants: integer("max_participants"),
  currentParticipants: integer("current_participants").default(0),
  waitlistEnabled: boolean("waitlist_enabled").default(false),
  requiresApproval: boolean("requires_approval").default(false),
  
  // Pricing
  registrationFee: decimal("registration_fee", { precision: 10, scale: 2 }),
  currency: text("currency").default("CAD"),
  earlyBirdFee: decimal("early_bird_fee", { precision: 10, scale: 2 }),
  earlyBirdDeadline: timestamp("early_bird_deadline"),
  
  // Media
  bannerImageUrl: text("banner_image_url"),
  thumbnailUrl: text("thumbnail_url"),
  
  // Details
  organizer: text("organizer"),
  organizerId: uuid("organizer_id").references(() => users.id),
  contactEmail: text("contact_email"),
  contactPhone: text("contact_phone"),
  website: text("website"),
  
  // Format
  format: text("format"), // round_robin, knockout, mixed, playoff
  numberOfEnds: integer("number_of_ends"),
  drawSchedule: jsonb("draw_schedule").default([]),
  
  // Features
  hasLiveScoring: boolean("has_live_scoring").default(false),
  hasLiveStream: boolean("has_live_stream").default(false),
  streamUrl: text("stream_url"),
  
  // Status
  status: text("status").default("draft"), // draft, published, registration_open, in_progress, completed, cancelled
  isPublic: boolean("is_public").default(true),
  isFeatured: boolean("is_featured").default(false),
  
  // Points and awards
  loyaltyPointsAwarded: integer("loyalty_points_awarded").default(0),
  prizeMoney: decimal("prize_money", { precision: 10, scale: 2 }),
  
  // Metadata
  tags: jsonb("tags").$type<string[]>().default([]),
  createdBy: uuid("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Event registrations
export const eventRegistrations = pgTable("event_registrations", {
  id: uuid("id").primaryKey().defaultRandom(),
  eventId: uuid("event_id").references(() => events.id).notNull(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  
  registrationType: text("registration_type").notNull(), // individual, team, volunteer, spectator
  status: text("status").default("pending"), // pending, confirmed, waitlist, cancelled, attended
  
  teamName: text("team_name"),
  teamMembers: jsonb("team_members").$type<string[]>().default([]),
  
  paymentStatus: text("payment_status").default("pending"), // pending, paid, refunded, waived
  amountPaid: decimal("amount_paid", { precision: 10, scale: 2 }),
  paymentDate: timestamp("payment_date"),
  
  checkInTime: timestamp("check_in_time"),
  
  notes: text("notes"),
  specialRequirements: text("special_requirements"),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Competitions (extends events)
export const competitions = pgTable("competitions", {
  id: uuid("id").primaryKey().defaultRandom(),
  eventId: uuid("event_id").references(() => events.id).notNull().unique(),
  
  sanctioningBody: text("sanctioning_body"), // CCA, Provincial, World Curling
  competitionLevel: text("competition_level").notNull(), // club, regional, provincial, national, world
  
  gender: text("gender"), // men, women, mixed, open
  ageGroup: text("age_group"), // junior, u21, open, senior, masters
  
  qualifyingEvent: boolean("qualifying_event").default(false),
  qualifiesFor: text("qualifies_for"),
  
  championshipPoints: integer("championship_points"),
  rankingPoints: integer("ranking_points"),
  
  rules: text("rules"),
  eligibilityRequirements: text("eligibility_requirements"),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
