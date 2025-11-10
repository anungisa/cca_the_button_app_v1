// Draws, Matches, and Scoring Schema
import { pgTable, uuid, text, timestamp, integer, boolean, decimal, jsonb } from "drizzle-orm/pg-core";
import { events } from "./events";
import { teams } from "./teams";
import { users } from "./users";
import { clubs } from "./clubs";

// Draws (game sheets/time slots)
export const draws = pgTable("draws", {
  id: uuid("id").primaryKey().defaultRandom(),
  eventId: uuid("event_id").references(() => events.id).notNull(),
  
  // Draw info
  drawNumber: integer("draw_number").notNull(),
  drawName: text("draw_name"), // "Draw A", "Semifinal 1"
  
  // Scheduling
  scheduledStart: timestamp("scheduled_start").notNull(),
  scheduledEnd: timestamp("scheduled_end"),
  actualStart: timestamp("actual_start"),
  actualEnd: timestamp("actual_end"),
  
  // Status
  status: text("status").default("scheduled").notNull(), // scheduled, in_progress, completed, cancelled
  
  // Round info
  round: text("round"), // round_robin, quarter_final, semi_final, final
  roundNumber: integer("round_number"),
  
  isPlayoff: boolean("is_playoff").default(false),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Matches/Games
export const matches = pgTable("matches", {
  id: uuid("id").primaryKey().defaultRandom(),
  eventId: uuid("event_id").references(() => events.id).notNull(),
  drawId: uuid("draw_id").references(() => draws.id),
  
  // Match info
  matchNumber: integer("match_number"),
  matchName: text("match_name"),
  
  // Teams
  team1Id: uuid("team1_id").references(() => teams.id),
  team2Id: uuid("team2_id").references(() => teams.id),
  
  // Venue
  clubId: uuid("club_id").references(() => clubs.id),
  sheet: text("sheet"), // Sheet number/letter
  
  // Scoring
  team1Score: integer("team1_score").default(0),
  team2Score: integer("team2_score").default(0),
  winnerId: uuid("winner_id").references(() => teams.id),
  
  // Game details
  numberOfEnds: integer("number_of_ends").default(10),
  currentEnd: integer("current_end").default(1),
  
  hasHammer: integer("has_hammer"), // 1 or 2 (team number)
  
  // Timing
  scheduledStart: timestamp("scheduled_start").notNull(),
  scheduledEnd: timestamp("scheduled_end"),
  actualStart: timestamp("actual_start"),
  actualEnd: timestamp("actual_end"),
  
  // Status
  status: text("status").default("scheduled").notNull(), // scheduled, in_progress, completed, forfeited, cancelled
  
  // Playoff info
  isPlayoff: boolean("is_playoff").default(false),
  playoffRound: text("playoff_round"),
  
  // Additional data
  isFinal: boolean("is_final").default(false),
  isConsolation: boolean("is_consolation").default(false),
  
  // Stats
  totalShots: integer("total_shots"),
  gameTime: integer("game_time"), // minutes
  
  // Streaming
  liveStreamUrl: text("live_stream_url"),
  hasLiveScoring: boolean("has_live_scoring").default(true),
  
  // Notes
  notes: text("notes"),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// End scores
export const endScores = pgTable("end_scores", {
  id: uuid("id").primaryKey().defaultRandom(),
  matchId: uuid("match_id").references(() => matches.id).notNull(),
  
  endNumber: integer("end_number").notNull(),
  
  // Scoring
  team1Points: integer("team1_points").default(0),
  team2Points: integer("team2_points").default(0),
  
  blankEnd: boolean("blank_end").default(false),
  
  // Running totals
  team1RunningScore: integer("team1_running_score").default(0),
  team2RunningScore: integer("team2_running_score").default(0),
  
  // Hammer
  hadHammer: integer("had_hammer"), // 1 or 2
  
  // Timing
  startTime: timestamp("start_time"),
  endTime: timestamp("end_time"),
  duration: integer("duration"), // seconds
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Shot tracking (detailed)
export const shots = pgTable("shots", {
  id: uuid("id").primaryKey().defaultRandom(),
  matchId: uuid("match_id").references(() => matches.id).notNull(),
  endScoreId: uuid("end_score_id").references(() => endScores.id).notNull(),
  
  // Shot info
  endNumber: integer("end_number").notNull(),
  shotNumber: integer("shot_number").notNull(), // 1-16
  
  // Thrower
  teamId: uuid("team_id").references(() => teams.id).notNull(),
  playerId: uuid("player_id").references(() => users.id),
  
  // Shot details
  turn: text("turn"), // in_turn, out_turn
  weight: text("weight"), // hack_weight, normal, peel_weight
  shotType: text("shot_type"), // draw, hit, guard, freeze, peel, double
  
  // Outcome
  success: boolean("success"),
  rating: decimal("rating", { precision: 3, scale: 1 }), // 0-4 scale
  
  // Position
  initialPosition: jsonb("initial_position"), // {x, y} coordinates
  finalPosition: jsonb("final_position"),
  
  // Video
  videoTimestamp: integer("video_timestamp"), // seconds into stream
  
  notes: text("notes"),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Match statistics
export const matchStats = pgTable("match_stats", {
  id: uuid("id").primaryKey().defaultRandom(),
  matchId: uuid("match_id").references(() => matches.id).notNull(),
  teamId: uuid("team_id").references(() => teams.id).notNull(),
  
  // Team stats
  totalPoints: integer("total_points").default(0),
  endsWon: integer("ends_won").default(0),
  blankEnds: integer("blank_ends").default(0),
  stolenEnds: integer("stolen_ends").default(0),
  
  // Shot percentages
  team1ShootingPercentage: decimal("team1_shooting_percentage", { precision: 5, scale: 2 }),
  team2ShootingPercentage: decimal("team2_shooting_percentage", { precision: 5, scale: 2 }),
  
  // Power play
  powerPlaysUsed: integer("power_plays_used").default(0),
  powerPlaysSuccess: integer("power_plays_success").default(0),
  
  // Efficiency
  hammerEfficiency: decimal("hammer_efficiency", { precision: 5, scale: 2 }),
  forceEfficiency: decimal("force_efficiency", { precision: 5, scale: 2 }),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Player match performance
export const playerMatchStats = pgTable("player_match_stats", {
  id: uuid("id").primaryKey().defaultRandom(),
  matchId: uuid("match_id").references(() => matches.id).notNull(),
  playerId: uuid("player_id").references(() => users.id).notNull(),
  teamId: uuid("team_id").references(() => teams.id).notNull(),
  
  // Position
  position: text("position").notNull(),
  
  // Shot stats
  shotsThrown: integer("shots_thrown").default(0),
  shotPercentage: decimal("shot_percentage", { precision: 5, scale: 2 }),
  
  // By shot type
  drawPercentage: decimal("draw_percentage", { precision: 5, scale: 2 }),
  hitPercentage: decimal("hit_percentage", { precision: 5, scale: 2 }),
  guardPercentage: decimal("guard_percentage", { precision: 5, scale: 2 }),
  
  // Efficiency by end
  hammerEndPerformance: decimal("hammer_end_performance", { precision: 5, scale: 2 }),
  forceEndPerformance: decimal("force_end_performance", { precision: 5, scale: 2 }),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
