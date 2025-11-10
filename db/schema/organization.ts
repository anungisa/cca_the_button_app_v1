// Venues, Sponsors, and Organization Schema
import { pgTable, uuid, text, timestamp, integer, boolean, decimal, jsonb } from "drizzle-orm/pg-core";
import { users } from "./users";
import { clubs } from "./clubs";

// Venues (extends clubs, for specific facilities)
export const venues = pgTable("venues", {
  id: uuid("id").primaryKey().defaultRandom(),
  clubId: uuid("club_id").references(() => clubs.id),
  
  // Basic info
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  venueName: text("venue_name"), // Different from club name if needed
  
  // Type
  venueType: text("venue_type").notNull(), // curling_club, arena, stadium, outdoor
  
  // Location
  address: text("address").notNull(),
  city: text("city").notNull(),
  province: text("province").notNull(),
  postalCode: text("postal_code"),
  country: text("country").default("Canada"),
  
  // Coordinates
  latitude: decimal("latitude", { precision: 10, scale: 7 }),
  longitude: decimal("longitude", { precision: 10, scale: 7 }),
  
  // Contact
  phone: text("phone"),
  email: text("email"),
  website: text("website"),
  
  // Facilities
  numberOfSheets: integer("number_of_sheets").notNull(),
  sheetNames: jsonb("sheet_names").$type<string[]>().default([]),
  
  hasLounge: boolean("has_lounge").default(false),
  hasProShop: boolean("has_pro_shop").default(false),
  hasRestaurant: boolean("has_restaurant").default(false),
  hasParking: boolean("has_parking").default(false),
  parkingSpaces: integer("parking_spaces"),
  
  // Accessibility
  isWheelchairAccessible: boolean("is_wheelchair_accessible").default(false),
  accessibilityFeatures: jsonb("accessibility_features").$type<string[]>().default([]),
  
  // Capacity
  seatingCapacity: integer("seating_capacity"),
  standingCapacity: integer("standing_capacity"),
  
  // Media
  images: jsonb("images").$type<string[]>().default([]),
  virtualTourUrl: text("virtual_tour_url"),
  
  // Features
  features: jsonb("features").$type<string[]>().default([]),
  
  // Ice details
  iceType: text("ice_type"), // dedicated, arena_ice
  iceMaintenance: text("ice_maintenance"),
  
  // Status
  isActive: boolean("is_active").default(true),
  
  // Admin
  managerId: uuid("manager_id").references(() => users.id),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Sponsors
export const sponsors = pgTable("sponsors", {
  id: uuid("id").primaryKey().defaultRandom(),
  
  // Basic info
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  
  // Type
  sponsorType: text("sponsor_type").notNull(), // title, presenting, major, supporting, media, in_kind
  
  // Contact
  website: text("website"),
  contactName: text("contact_name"),
  contactEmail: text("contact_email"),
  contactPhone: text("contact_phone"),
  
  // Media
  logoUrl: text("logo_url"),
  description: text("description"),
  
  // Social
  instagramHandle: text("instagram_handle"),
  twitterHandle: text("twitter_handle"),
  facebookPage: text("facebook_page"),
  linkedinPage: text("linkedin_page"),
  
  // Status
  isActive: boolean("is_active").default(true),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Sponsorships (relationships between sponsors and entities)
export const sponsorships = pgTable("sponsorships", {
  id: uuid("id").primaryKey().defaultRandom(),
  sponsorId: uuid("sponsor_id").references(() => sponsors.id).notNull(),
  
  // Sponsored entity
  entityType: text("entity_type").notNull(), // event, team, venue, league
  entityId: uuid("entity_id").notNull(),
  
  // Sponsorship details
  sponsorshipLevel: text("sponsorship_level").notNull(), // title, platinum, gold, silver, bronze
  
  // Duration
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date"),
  
  // Value
  value: decimal("value", { precision: 10, scale: 2 }),
  currency: text("currency").default("CAD"),
  
  // Benefits
  benefits: jsonb("benefits").$type<string[]>().default([]),
  
  // Display
  displayOrder: integer("display_order"),
  logoPlacement: text("logo_placement"), // banner, sidebar, footer, exclusive
  
  // Status
  status: text("status").default("active").notNull(), // active, pending, expired, cancelled
  
  // Contract
  contractUrl: text("contract_url"),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Staff roles
export const staffRoles = pgTable("staff_roles", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  
  // Role
  role: text("role").notNull(), // admin, event_coordinator, content_manager, technical_staff
  title: text("title").notNull(), // "Director of Communications"
  department: text("department"), // operations, marketing, technical, governance
  
  // Scope
  scope: text("scope").notNull(), // national, provincial, regional, club
  scopeId: uuid("scope_id"), // ID of province, region, or club
  
  // Contact
  email: text("email"),
  phone: text("phone"),
  
  // Status
  isActive: boolean("is_active").default(true),
  
  // Dates
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date"),
  
  // Bio
  bio: text("bio"),
  photoUrl: text("photo_url"),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Volunteers
export const volunteers = pgTable("volunteers", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  
  // Volunteer profile
  interests: jsonb("interests").$type<string[]>().default([]), // officiating, event_help, coaching, marketing
  availability: jsonb("availability"), // days/times available
  
  // Skills
  skills: jsonb("skills").$type<string[]>().default([]),
  certifications: jsonb("certifications").$type<string[]>().default([]),
  
  // Experience
  yearsVolunteering: integer("years_volunteering"),
  hoursContributed: integer("hours_contributed").default(0),
  
  // Preferences
  preferredRoles: jsonb("preferred_roles").$type<string[]>().default([]),
  preferredLocations: jsonb("preferred_locations").$type<string[]>().default([]),
  
  // Emergency contact
  emergencyContactName: text("emergency_contact_name"),
  emergencyContactPhone: text("emergency_contact_phone"),
  
  // Status
  isActive: boolean("is_active").default(true),
  backgroundCheckCompleted: boolean("background_check_completed").default(false),
  backgroundCheckDate: timestamp("background_check_date"),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Volunteer assignments
export const volunteerAssignments = pgTable("volunteer_assignments", {
  id: uuid("id").primaryKey().defaultRandom(),
  volunteerId: uuid("volunteer_id").references(() => volunteers.id).notNull(),
  
  // Assignment
  assignmentType: text("assignment_type").notNull(), // event, ongoing, one_time
  role: text("role").notNull(), // official, scorekeeper, usher, technical, coordinator
  
  // Entity
  entityType: text("entity_type"), // event, club, committee
  entityId: uuid("entity_id"),
  
  // Schedule
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date"),
  
  // Hours
  estimatedHours: integer("estimated_hours"),
  actualHours: integer("actual_hours"),
  
  // Status
  status: text("status").default("pending").notNull(), // pending, confirmed, completed, cancelled
  
  // Completion
  completedAt: timestamp("completed_at"),
  feedbackGiven: boolean("feedback_given").default(false),
  
  notes: text("notes"),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Officials
export const officials = pgTable("officials", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  
  // Certification
  certificationLevel: text("certification_level").notNull(), // level_1, level_2, level_3, national, international
  certificationNumber: text("certification_number").unique(),
  certificationDate: timestamp("certification_date").notNull(),
  certificationExpiry: timestamp("certification_expiry"),
  
  // Specialization
  specializations: jsonb("specializations").$type<string[]>().default([]), // umpire, chief_umpire, ice_technician
  
  // Experience
  yearsOfficiating: integer("years_officiating"),
  eventsOfficiated: integer("events_officiated").default(0),
  
  // Availability
  isAvailable: boolean("is_available").default(true),
  availabilityNotes: text("availability_notes"),
  
  // Compensation
  compensationRate: decimal("compensation_rate", { precision: 10, scale: 2 }),
  
  // Status
  isActive: boolean("is_active").default(true),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Official assignments
export const officialAssignments = pgTable("official_assignments", {
  id: uuid("id").primaryKey().defaultRandom(),
  officialId: uuid("official_id").references(() => officials.id).notNull(),
  
  // Assignment
  eventId: uuid("event_id"),
  role: text("role").notNull(), // chief_umpire, umpire, ice_technician
  
  // Status
  status: text("status").default("pending").notNull(), // pending, confirmed, completed, declined
  
  // Dates
  assignmentDate: timestamp("assignment_date").notNull(),
  
  // Compensation
  compensation: decimal("compensation", { precision: 10, scale: 2 }),
  isPaid: boolean("is_paid").default(false),
  
  notes: text("notes"),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
