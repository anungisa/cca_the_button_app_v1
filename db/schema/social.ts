// Social features and Activity Feed Schema
import { pgTable, uuid, text, timestamp, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { users } from "./users";
import { teams } from "./teams";

// User follows
export const follows = pgTable("follows", {
  id: uuid("id").primaryKey().defaultRandom(),
  
  followerId: uuid("follower_id").references(() => users.id).notNull(),
  followingId: uuid("following_id").references(() => users.id).notNull(),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Team follows
export const teamFollows = pgTable("team_follows", {
  id: uuid("id").primaryKey().defaultRandom(),
  
  userId: uuid("user_id").references(() => users.id).notNull(),
  teamId: uuid("team_id").references(() => teams.id).notNull(),
  
  // Preferences
  notifyOnMatches: boolean("notify_on_matches").default(true),
  notifyOnNews: boolean("notify_on_news").default(true),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Activity feed
export const activities = pgTable("activities", {
  id: uuid("id").primaryKey().defaultRandom(),
  
  // Actor
  userId: uuid("user_id").references(() => users.id).notNull(),
  
  // Activity type
  activityType: text("activity_type").notNull(), // match_result, achievement_earned, team_joined, event_registered
  
  // Content
  title: text("title").notNull(),
  description: text("description"),
  
  // Related entities
  entityType: text("entity_type"), // match, team, event, achievement
  entityId: uuid("entity_id"),
  
  // Media
  imageUrl: text("image_url"),
  
  // Engagement
  likeCount: integer("like_count").default(0),
  commentCount: integer("comment_count").default(0),
  
  // Visibility
  visibility: text("visibility").default("public").notNull(), // public, followers, private
  
  // Metadata
  metadata: jsonb("metadata"),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Activity likes
export const activityLikes = pgTable("activity_likes", {
  id: uuid("id").primaryKey().defaultRandom(),
  activityId: uuid("activity_id").references(() => activities.id).notNull(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Posts (user-generated content)
export const posts = pgTable("posts", {
  id: uuid("id").primaryKey().defaultRandom(),
  
  // Author
  userId: uuid("user_id").references(() => users.id).notNull(),
  
  // Content
  content: text("content").notNull(),
  
  // Media
  images: jsonb("images").$type<string[]>().default([]),
  videoUrl: text("video_url"),
  
  // Related entity
  entityType: text("entity_type"), // team, event, match
  entityId: uuid("entity_id"),
  
  // Engagement
  likeCount: integer("like_count").default(0),
  commentCount: integer("comment_count").default(0),
  shareCount: integer("share_count").default(0),
  
  // Visibility
  visibility: text("visibility").default("public").notNull(),
  
  // Flags
  isPinned: boolean("is_pinned").default(false),
  isFlagged: boolean("is_flagged").default(false),
  
  // Status
  status: text("status").default("published").notNull(), // draft, published, removed
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Post likes
export const postLikes = pgTable("post_likes", {
  id: uuid("id").primaryKey().defaultRandom(),
  postId: uuid("post_id").references(() => posts.id).notNull(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Post comments
export const postComments = pgTable("post_comments", {
  id: uuid("id").primaryKey().defaultRandom(),
  postId: uuid("post_id").references(() => posts.id).notNull(),
  
  // Author
  userId: uuid("user_id").references(() => users.id).notNull(),
  
  // Content
  content: text("content").notNull(),
  
  // Threading
  parentId: uuid("parent_id"),
  
  // Engagement
  likeCount: integer("like_count").default(0),
  
  // Status
  status: text("status").default("published").notNull(),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// User badges (visual achievements)
export const badges = pgTable("badges", {
  id: uuid("id").primaryKey().defaultRandom(),
  
  // Badge details
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  
  // Display
  imageUrl: text("image_url").notNull(),
  color: text("color"),
  
  // Category
  category: text("category").notNull(), // participation, achievement, special, seasonal
  
  // Rarity
  rarity: text("rarity"), // common, rare, epic, legendary
  
  // Requirements
  requirements: text("requirements"),
  
  isActive: boolean("is_active").default(true),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// User badges
export const userBadges = pgTable("user_badges", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  badgeId: uuid("badge_id").references(() => badges.id).notNull(),
  
  // Display
  isDisplayed: boolean("is_displayed").default(true),
  displayOrder: integer("display_order"),
  
  earnedAt: timestamp("earned_at").defaultNow().notNull(),
});

// Leaderboards
export const leaderboards = pgTable("leaderboards", {
  id: uuid("id").primaryKey().defaultRandom(),
  
  // Leaderboard info
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  
  // Type
  type: text("type").notNull(), // player, team, points, wins
  
  // Scope
  scope: text("scope").notNull(), // global, provincial, club, seasonal
  scopeId: uuid("scope_id"),
  
  // Time period
  period: text("period").notNull(), // all_time, season, monthly, weekly
  season: text("season"),
  
  // Status
  isActive: boolean("is_active").default(true),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Leaderboard entries
export const leaderboardEntries = pgTable("leaderboard_entries", {
  id: uuid("id").primaryKey().defaultRandom(),
  leaderboardId: uuid("leaderboard_id").references(() => leaderboards.id).notNull(),
  
  // Entity
  entityType: text("entity_type").notNull(), // user, team
  entityId: uuid("entity_id").notNull(),
  entityName: text("entity_name").notNull(),
  
  // Position
  rank: integer("rank").notNull(),
  previousRank: integer("previous_rank"),
  
  // Score
  score: integer("score").notNull(),
  
  // Display
  metadata: jsonb("metadata"), // Additional context (win/loss record, etc)
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// User stories (Instagram-style)
export const stories = pgTable("stories", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  
  // Media
  mediaType: text("media_type").notNull(), // image, video
  mediaUrl: text("media_url").notNull(),
  thumbnailUrl: text("thumbnail_url"),
  
  // Duration (for video)
  duration: integer("duration"), // seconds
  
  // Caption
  caption: text("caption"),
  
  // Engagement
  viewCount: integer("view_count").default(0),
  
  // Status
  isActive: boolean("is_active").default(true),
  
  // Expiry (24 hours default)
  expiresAt: timestamp("expires_at").notNull(),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Story views
export const storyViews = pgTable("story_views", {
  id: uuid("id").primaryKey().defaultRandom(),
  storyId: uuid("story_id").references(() => stories.id).notNull(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  
  viewedAt: timestamp("viewed_at").defaultNow().notNull(),
});

// User mentions
export const mentions = pgTable("mentions", {
  id: uuid("id").primaryKey().defaultRandom(),
  
  // Mentioned user
  userId: uuid("user_id").references(() => users.id).notNull(),
  
  // Mentioning user
  mentionedBy: uuid("mentioned_by").references(() => users.id).notNull(),
  
  // Context
  entityType: text("entity_type").notNull(), // post, comment, article
  entityId: uuid("entity_id").notNull(),
  
  // Status
  isRead: boolean("is_read").default(false),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Reports (content moderation)
export const reports = pgTable("reports", {
  id: uuid("id").primaryKey().defaultRandom(),
  
  // Reporter
  reportedBy: uuid("reported_by").references(() => users.id).notNull(),
  
  // Reported entity
  entityType: text("entity_type").notNull(), // post, comment, user
  entityId: uuid("entity_id").notNull(),
  
  // Report details
  reason: text("reason").notNull(), // spam, harassment, inappropriate, other
  details: text("details"),
  
  // Status
  status: text("status").default("pending").notNull(), // pending, reviewing, resolved, dismissed
  
  // Resolution
  resolvedBy: uuid("resolved_by").references(() => users.id),
  resolvedAt: timestamp("resolved_at"),
  resolution: text("resolution"),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
