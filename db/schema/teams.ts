// Teams and Athletes Schema
import { pgTable, uuid, text, timestamp, integer, boolean, decimal, jsonb } from "drizzle-orm/pg-core";
import { users } from "./users";
import { clubs } from "./clubs";

// Teams
export const teams = pgTable("teams", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  displayName: text("display_name"),
  slug: text("slug").notNull().unique(),
  
  // Team details
  teamType: text("team_type").notNull(), // competitive, recreational, corporate, youth
  division: text("division"), // mens, womens, mixed, senior, junior
  level: text("level"), // club, regional, provincial, national, international
  
  // Affiliation
  clubId: uuid("club_id").references(() => clubs.id),
  province: text("province"),
  
  // Captain and coach
  captainId: uuid("captain_id").references(() => users.id),
  coachId: uuid("coach_id").references(() => users.id),
  
  // Media
  logoUrl: text("logo_url"),
  bannerUrl: text("banner_url"),
  
  // Performance
  currentRanking: integer("current_ranking"),
  totalWins: integer("total_wins").default(0),
  totalLosses: integer("total_losses").default(0),
  winPercentage: decimal("win_percentage", { precision: 5, scale: 2 }),
  
  // Details
  bio: text("bio"),
  achievements: jsonb("achievements").default([]),
  sponsors: jsonb("sponsors").default([]),
  
  // Social
  website: text("website"),
  instagramHandle: text("instagram_handle"),
  twitterHandle: text("twitter_handle"),
  facebookPage: text("facebook_page"),
  
  // Status
  isActive: boolean("is_active").default(true),
  seasonYear: text("season_year"),
  
  // Metadata
  createdBy: uuid("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Team members
export const teamMembers = pgTable("team_members", {
  id: uuid("id").primaryKey().defaultRandom(),
  teamId: uuid("team_id").references(() => teams.id).notNull(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  
  position: text("position").notNull(), // skip, vice, second, lead, alternate
  role: text("role"), // player, coach, manager
  
  jerseyNumber: integer("jersey_number"),
  
  joinDate: timestamp("join_date").notNull(),
  leaveDate: timestamp("leave_date"),
  isActive: boolean("is_active").default(true),
  
  gamesPlayed: integer("games_played").default(0),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Athlete profiles (extends users)
export const athleteProfiles = pgTable("athlete_profiles", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id).notNull().unique(),
  
  // Career info
  yearsPlaying: integer("years_playing"),
  startedPlayingYear: integer("started_playing_year"),
  currentTeamId: uuid("current_team_id").references(() => teams.id),
  
  // Position and style
  primaryPosition: text("primary_position").notNull(), // skip, vice, second, lead
  throwingHand: text("throwing_hand"), // right, left
  deliveryStyle: text("delivery_style"),
  
  // Performance stats
  careerWins: integer("career_wins").default(0),
  careerLosses: integer("career_losses").default(0),
  shotPercentage: decimal("shot_percentage", { precision: 5, scale: 2 }),
  
  // Rankings
  nationalRanking: integer("national_ranking"),
  provincialRanking: integer("provincial_ranking"),
  worldRanking: integer("world_ranking"),
  
  // Achievements
  championships: jsonb("championships").default([]),
  awards: jsonb("awards").default([]),
  records: jsonb("records").default([]),
  
  // Physical
  height: text("height"),
  weight: text("weight"),
  
  // Professional
  isProf: boolean("is_professional").default(false),
  isProfCoach: boolean("is_professional_coach").default(false),
  coachingCertifications: jsonb("coaching_certifications").default([]),
  
  // Availability
  availableForSpare: boolean("available_for_spare").default(false),
  seekingTeam: boolean("seeking_team").default(false),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Coaches
export const coaches = pgTable("coaches", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id).notNull().unique(),
  
  // Credentials
  certificationLevel: text("certification_level"), // level_1, level_2, level_3, master
  certificationNumber: text("certification_number"),
  certificationDate: timestamp("certification_date"),
  certificationExpiry: timestamp("certification_expiry"),
  
  // Specialization
  specializations: jsonb("specializations").$type<string[]>().default([]),
  ageGroups: jsonb("age_groups").$type<string[]>().default([]),
  
  // Experience
  yearsCoaching: integer("years_coaching"),
  teamsCoached: integer("teams_coached").default(0),
  
  // Achievements
  championships: jsonb("championships").default([]),
  awards: jsonb("awards").default([]),
  
  // Business
  hourlyRate: decimal("hourly_rate", { precision: 10, scale: 2 }),
  acceptingClients: boolean("accepting_clients").default(true),
  
  bio: text("bio"),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
