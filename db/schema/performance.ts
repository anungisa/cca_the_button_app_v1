// Performance Statistics, Rankings, and Achievements Schema
import { pgTable, uuid, text, timestamp, integer, boolean, decimal, jsonb } from "drizzle-orm/pg-core";
import { users } from "./users";
import { teams } from "./teams";
import { matches } from "./draws";
import { events } from "./events";

// Player season statistics
export const playerSeasonStats = pgTable("player_season_stats", {
  id: uuid("id").primaryKey().defaultRandom(),
  playerId: uuid("player_id").references(() => users.id).notNull(),
  teamId: uuid("team_id").references(() => teams.id),
  
  // Season
  season: text("season").notNull(), // "2024-2025"
  seasonType: text("season_type").notNull(), // competitive, recreational
  
  // Games
  gamesPlayed: integer("games_played").default(0),
  wins: integer("wins").default(0),
  losses: integer("losses").default(0),
  winPercentage: decimal("win_percentage", { precision: 5, scale: 2 }),
  
  // Shooting
  shotPercentage: decimal("shot_percentage", { precision: 5, scale: 2 }),
  drawPercentage: decimal("draw_percentage", { precision: 5, scale: 2 }),
  hitPercentage: decimal("hit_percentage", { precision: 5, scale: 2 }),
  guardPercentage: decimal("guard_percentage", { precision: 5, scale: 2 }),
  peelPercentage: decimal("peel_percentage", { precision: 5, scale: 2 }),
  
  // By position
  skipStats: jsonb("skip_stats"),
  viceStats: jsonb("vice_stats"),
  secondStats: jsonb("second_stats"),
  leadStats: jsonb("lead_stats"),
  
  // Ends
  hammerConversion: decimal("hammer_conversion", { precision: 5, scale: 2 }),
  stealPercentage: decimal("steal_percentage", { precision: 5, scale: 2 }),
  
  // Points
  totalPoints: integer("total_points").default(0),
  avgPointsPerGame: decimal("avg_points_per_game", { precision: 5, scale: 2 }),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Team season statistics
export const teamSeasonStats = pgTable("team_season_stats", {
  id: uuid("id").primaryKey().defaultRandom(),
  teamId: uuid("team_id").references(() => teams.id).notNull(),
  
  // Season
  season: text("season").notNull(),
  division: text("division"),
  
  // Record
  gamesPlayed: integer("games_played").default(0),
  wins: integer("wins").default(0),
  losses: integer("losses").default(0),
  ties: integer("ties").default(0),
  winPercentage: decimal("win_percentage", { precision: 5, scale: 2 }),
  
  // Ranking
  currentRank: integer("current_rank"),
  highestRank: integer("highest_rank"),
  
  // Performance
  teamShootingPercentage: decimal("team_shooting_percentage", { precision: 5, scale: 2 }),
  hammerEfficiency: decimal("hammer_efficiency", { precision: 5, scale: 2 }),
  forceEfficiency: decimal("force_efficiency", { precision: 5, scale: 2 }),
  
  // Scoring
  totalPointsFor: integer("total_points_for").default(0),
  totalPointsAgainst: integer("total_points_against").default(0),
  avgPointsFor: decimal("avg_points_for", { precision: 5, scale: 2 }),
  avgPointsAgainst: decimal("avg_points_against", { precision: 5, scale: 2 }),
  
  // Ends
  endsWon: integer("ends_won").default(0),
  endsLost: integer("ends_lost").default(0),
  blankEnds: integer("blank_ends").default(0),
  stolenEnds: integer("stolen_ends").default(0),
  
  // Home/Away
  homeWins: integer("home_wins").default(0),
  homeLosses: integer("home_losses").default(0),
  awayWins: integer("away_wins").default(0),
  awayLosses: integer("away_losses").default(0),
  
  // Streaks
  currentStreak: integer("current_streak"), // positive = win, negative = loss
  longestWinStreak: integer("longest_win_streak").default(0),
  longestLoseStreak: integer("longest_lose_streak").default(0),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Rankings
export const rankings = pgTable("rankings", {
  id: uuid("id").primaryKey().defaultRandom(),
  
  // Entity
  entityType: text("entity_type").notNull(), // player, team
  entityId: uuid("entity_id").notNull(),
  
  // Ranking details
  rankingType: text("ranking_type").notNull(), // national, provincial, world, regional
  division: text("division"), // mens, womens, mixed, senior
  
  // Position
  currentRank: integer("current_rank").notNull(),
  previousRank: integer("previous_rank"),
  peakRank: integer("peak_rank"),
  
  // Points
  points: integer("points").default(0),
  
  // Date
  season: text("season"),
  rankingDate: timestamp("ranking_date").notNull(),
  
  // Movement
  movement: integer("movement"), // +3, -2, 0
  
  isActive: boolean("is_active").default(true),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Achievements/Awards
export const achievements = pgTable("achievements", {
  id: uuid("id").primaryKey().defaultRandom(),
  
  // Basic info
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  
  // Category
  category: text("category").notNull(), // championship, milestone, performance, special
  type: text("type").notNull(), // player, team, coach
  
  // Display
  iconUrl: text("icon_url"),
  badgeUrl: text("badge_url"),
  color: text("color"),
  
  // Rarity
  rarity: text("rarity"), // common, rare, epic, legendary
  
  // Requirements
  requirements: jsonb("requirements"),
  
  // Points
  pointsValue: integer("points_value").default(0),
  
  isActive: boolean("is_active").default(true),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// User achievements
export const userAchievements = pgTable("user_achievements", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  achievementId: uuid("achievement_id").references(() => achievements.id).notNull(),
  
  // Context
  eventId: uuid("event_id").references(() => events.id),
  matchId: uuid("match_id").references(() => matches.id),
  teamId: uuid("team_id").references(() => teams.id),
  
  // Details
  earnedAt: timestamp("earned_at").defaultNow().notNull(),
  season: text("season"),
  
  // Display
  isDisplayed: boolean("is_displayed").default(true),
  displayOrder: integer("display_order"),
  
  // Additional data
  metadata: jsonb("metadata"),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Team achievements
export const teamAchievements = pgTable("team_achievements", {
  id: uuid("id").primaryKey().defaultRandom(),
  teamId: uuid("team_id").references(() => teams.id).notNull(),
  achievementId: uuid("achievement_id").references(() => achievements.id).notNull(),
  
  // Context
  eventId: uuid("event_id").references(() => events.id),
  season: text("season"),
  
  earnedAt: timestamp("earned_at").defaultNow().notNull(),
  
  metadata: jsonb("metadata"),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Records
export const records = pgTable("records", {
  id: uuid("id").primaryKey().defaultRandom(),
  
  // Record details
  recordType: text("record_type").notNull(), // highest_shot_percentage, most_wins, longest_streak
  category: text("category").notNull(), // player, team, match, season
  division: text("division"),
  
  // Holder
  holderType: text("holder_type").notNull(), // player, team
  holderId: uuid("holder_id").notNull(),
  holderName: text("holder_name").notNull(),
  
  // Value
  recordValue: text("record_value").notNull(), // "98.5%", "15 games", "3 championships"
  numericValue: decimal("numeric_value", { precision: 10, scale: 2 }),
  
  // Context
  eventId: uuid("event_id").references(() => events.id),
  matchId: uuid("match_id").references(() => matches.id),
  season: text("season"),
  
  // Dates
  setDate: timestamp("set_date").notNull(),
  brokenDate: timestamp("broken_date"),
  
  // Status
  isActive: boolean("is_active").default(true),
  
  // Previous record
  previousHolderId: uuid("previous_holder_id"),
  previousHolderName: text("previous_holder_name"),
  previousValue: text("previous_value"),
  
  description: text("description"),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Milestones
export const milestones = pgTable("milestones", {
  id: uuid("id").primaryKey().defaultRandom(),
  
  // Entity
  entityType: text("entity_type").notNull(), // player, team, coach
  entityId: uuid("entity_id").notNull(),
  
  // Milestone
  milestoneType: text("milestone_type").notNull(), // 100th_game, 500th_win, career_championship
  title: text("title").notNull(),
  description: text("description"),
  
  // Value
  milestoneValue: integer("milestone_value"), // 100, 500, etc
  
  // Context
  achievedAt: timestamp("achieved_at").notNull(),
  season: text("season"),
  eventId: uuid("event_id").references(() => events.id),
  matchId: uuid("match_id").references(() => matches.id),
  
  // Media
  imageUrl: text("image_url"),
  
  // Social
  isPublic: boolean("is_public").default(true),
  wasCelebrated: boolean("was_celebrated").default(false),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
