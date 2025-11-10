// Notifications, Messages, and Communications Schema
import { pgTable, uuid, text, timestamp, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { users } from "./users";

// Notifications
export const notifications = pgTable("notifications", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  
  // Content
  type: text("type").notNull(), // event_reminder, team_invite, achievement, score_update, message, system
  title: text("title").notNull(),
  message: text("message").notNull(),
  
  // Action
  actionType: text("action_type"), // view_event, accept_invite, view_profile
  actionUrl: text("action_url"),
  
  // Related entity
  entityType: text("entity_type"), // event, team, user, match
  entityId: uuid("entity_id"),
  
  // Priority
  priority: text("priority").default("normal"), // low, normal, high, urgent
  
  // Status
  isRead: boolean("is_read").default(false),
  readAt: timestamp("read_at"),
  
  // Channels
  channels: jsonb("channels").$type<string[]>().default(["app"]), // app, email, sms, push
  emailSent: boolean("email_sent").default(false),
  pushSent: boolean("push_sent").default(false),
  smsSent: boolean("sms_sent").default(false),
  
  // Grouping
  groupKey: text("group_key"), // For collapsing similar notifications
  
  // Expiry
  expiresAt: timestamp("expires_at"),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// User notification preferences
export const notificationPreferences = pgTable("notification_preferences", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id).notNull().unique(),
  
  // Event notifications
  eventReminders: boolean("event_reminders").default(true),
  eventUpdates: boolean("event_updates").default(true),
  eventCancellations: boolean("event_cancellations").default(true),
  
  // Team notifications
  teamInvites: boolean("team_invites").default(true),
  teamUpdates: boolean("team_updates").default(true),
  matchReminders: boolean("match_reminders").default(true),
  
  // Score notifications
  liveScores: boolean("live_scores").default(true),
  matchResults: boolean("match_results").default(true),
  
  // Social
  newFollowers: boolean("new_followers").default(true),
  comments: boolean("comments").default(true),
  likes: boolean("likes").default(true),
  mentions: boolean("mentions").default(true),
  
  // Loyalty
  pointsEarned: boolean("points_earned").default(true),
  rewardsAvailable: boolean("rewards_available").default(true),
  tierChanges: boolean("tier_changes").default(true),
  
  // Marketing
  newsletter: boolean("newsletter").default(true),
  promotions: boolean("promotions").default(true),
  partnerOffers: boolean("partner_offers").default(false),
  
  // Channels per type
  emailEnabled: boolean("email_enabled").default(true),
  pushEnabled: boolean("push_enabled").default(true),
  smsEnabled: boolean("sms_enabled").default(false),
  
  // Frequency
  digestFrequency: text("digest_frequency").default("daily"), // realtime, hourly, daily, weekly
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Direct messages
export const messages = pgTable("messages", {
  id: uuid("id").primaryKey().defaultRandom(),
  
  // Participants
  senderId: uuid("sender_id").references(() => users.id).notNull(),
  recipientId: uuid("recipient_id").references(() => users.id).notNull(),
  
  // Conversation
  conversationId: uuid("conversation_id").notNull(),
  
  // Content
  content: text("content").notNull(),
  
  // Attachments
  attachments: jsonb("attachments").$type<Array<{url: string, type: string, name: string}>>().default([]),
  
  // Status
  isRead: boolean("is_read").default(false),
  readAt: timestamp("read_at"),
  
  // Metadata
  replyToId: uuid("reply_to_id"), // For threading
  
  // Flags
  isDeleted: boolean("is_deleted").default(false),
  deletedAt: timestamp("deleted_at"),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Conversations
export const conversations = pgTable("conversations", {
  id: uuid("id").primaryKey().defaultRandom(),
  
  // Participants (for 1-on-1, this is just 2 users)
  participant1Id: uuid("participant1_id").references(() => users.id).notNull(),
  participant2Id: uuid("participant2_id").references(() => users.id).notNull(),
  
  // Last message
  lastMessageAt: timestamp("last_message_at"),
  lastMessagePreview: text("last_message_preview"),
  
  // Unread counts
  unreadCountUser1: integer("unread_count_user1").default(0),
  unreadCountUser2: integer("unread_count_user2").default(0),
  
  // Status
  isArchived: boolean("is_archived").default(false),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Announcement banners
export const announcements = pgTable("announcements", {
  id: uuid("id").primaryKey().defaultRandom(),
  
  // Content
  title: text("title").notNull(),
  message: text("message").notNull(),
  
  // Type
  type: text("type").default("info").notNull(), // info, warning, error, success
  
  // Action
  actionText: text("action_text"),
  actionUrl: text("action_url"),
  
  // Display
  placement: text("placement").default("top"), // top, bottom, modal
  isDismissible: boolean("is_dismissible").default(true),
  
  // Targeting
  targetAudience: text("target_audience").default("all"), // all, members, specific_role
  targetRoles: jsonb("target_roles").$type<string[]>().default([]),
  
  // Schedule
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date"),
  
  // Status
  isActive: boolean("is_active").default(true),
  
  // Stats
  viewCount: integer("view_count").default(0),
  clickCount: integer("click_count").default(0),
  
  // Author
  createdBy: uuid("created_by").references(() => users.id).notNull(),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Email templates
export const emailTemplates = pgTable("email_templates", {
  id: uuid("id").primaryKey().defaultRandom(),
  
  // Template info
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  
  // Type
  type: text("type").notNull(), // transactional, marketing, notification
  
  // Content
  subject: text("subject").notNull(),
  htmlContent: text("html_content").notNull(),
  textContent: text("text_content"),
  
  // Variables
  variables: jsonb("variables").$type<string[]>().default([]), // ["{user_name}", "{event_name}"]
  
  // Status
  isActive: boolean("is_active").default(true),
  
  // Version
  version: integer("version").default(1),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Email logs
export const emailLogs = pgTable("email_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  
  // Recipient
  recipientId: uuid("recipient_id").references(() => users.id),
  recipientEmail: text("recipient_email").notNull(),
  
  // Template
  templateId: uuid("template_id").references(() => emailTemplates.id),
  
  // Content
  subject: text("subject").notNull(),
  
  // Status
  status: text("status").default("pending").notNull(), // pending, sent, delivered, bounced, failed
  
  // Tracking
  sentAt: timestamp("sent_at"),
  deliveredAt: timestamp("delivered_at"),
  openedAt: timestamp("opened_at"),
  clickedAt: timestamp("clicked_at"),
  
  // Errors
  errorMessage: text("error_message"),
  
  // Metadata
  metadata: jsonb("metadata"),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Push notification tokens
export const pushTokens = pgTable("push_tokens", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  
  // Token
  token: text("token").notNull().unique(),
  
  // Device info
  platform: text("platform").notNull(), // ios, android, web
  deviceId: text("device_id"),
  deviceName: text("device_name"),
  
  // Status
  isActive: boolean("is_active").default(true),
  
  // Last used
  lastUsedAt: timestamp("last_used_at"),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// SMS logs
export const smsLogs = pgTable("sms_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  
  // Recipient
  recipientId: uuid("recipient_id").references(() => users.id),
  recipientPhone: text("recipient_phone").notNull(),
  
  // Content
  message: text("message").notNull(),
  
  // Status
  status: text("status").default("pending").notNull(), // pending, sent, delivered, failed
  
  // Provider
  provider: text("provider"), // twilio, etc
  providerId: text("provider_id"),
  
  // Tracking
  sentAt: timestamp("sent_at"),
  deliveredAt: timestamp("delivered_at"),
  
  // Errors
  errorMessage: text("error_message"),
  
  // Cost
  cost: integer("cost"), // in cents
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
