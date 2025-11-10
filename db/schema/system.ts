// Analytics, Audits, and System Schema
import { pgTable, uuid, text, timestamp, integer, boolean, jsonb, decimal } from "drizzle-orm/pg-core";
import { users } from "./users";

// Analytics events
export const analyticsEvents = pgTable("analytics_events", {
  id: uuid("id").primaryKey().defaultRandom(),
  
  // User
  userId: uuid("user_id").references(() => users.id),
  
  // Event
  eventType: text("event_type").notNull(), // page_view, click, video_play, purchase, registration
  eventName: text("event_name").notNull(),
  
  // Context
  page: text("page"),
  referrer: text("referrer"),
  
  // Entity
  entityType: text("entity_type"),
  entityId: uuid("entity_id"),
  
  // Device/Browser
  userAgent: text("user_agent"),
  device: text("device"),
  browser: text("browser"),
  os: text("os"),
  
  // Location
  ipAddress: text("ip_address"),
  country: text("country"),
  region: text("region"),
  city: text("city"),
  
  // Session
  sessionId: text("session_id"),
  
  // Properties
  properties: jsonb("properties"),
  
  // Value
  value: decimal("value", { precision: 10, scale: 2 }),
  
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

// Page views
export const pageViews = pgTable("page_views", {
  id: uuid("id").primaryKey().defaultRandom(),
  
  userId: uuid("user_id").references(() => users.id),
  
  // Page info
  path: text("path").notNull(),
  title: text("title"),
  referrer: text("referrer"),
  
  // Session
  sessionId: text("session_id").notNull(),
  
  // Device
  device: text("device"),
  browser: text("browser"),
  
  // Duration
  timeOnPage: integer("time_on_page"), // seconds
  
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

// Audit logs
export const auditLogs = pgTable("audit_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  
  // Actor
  userId: uuid("user_id").references(() => users.id),
  userEmail: text("user_email"),
  
  // Action
  action: text("action").notNull(), // create, update, delete, login, logout
  entityType: text("entity_type").notNull(),
  entityId: uuid("entity_id"),
  
  // Changes
  changes: jsonb("changes"), // Before/after values
  
  // Context
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  
  // Metadata
  metadata: jsonb("metadata"),
  
  // Result
  success: boolean("success").default(true),
  errorMessage: text("error_message"),
  
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

// Error logs
export const errorLogs = pgTable("error_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  
  // User context
  userId: uuid("user_id").references(() => users.id),
  
  // Error details
  errorType: text("error_type").notNull(),
  errorMessage: text("error_message").notNull(),
  stackTrace: text("stack_trace"),
  
  // Context
  page: text("page"),
  action: text("action"),
  
  // Environment
  environment: text("environment"), // production, staging, development
  
  // Request
  method: text("method"),
  url: text("url"),
  requestBody: jsonb("request_body"),
  
  // Browser
  userAgent: text("user_agent"),
  browser: text("browser"),
  
  // Severity
  severity: text("severity").default("error"), // debug, info, warning, error, critical
  
  // Status
  isResolved: boolean("is_resolved").default(false),
  resolvedAt: timestamp("resolved_at"),
  
  // Count
  occurrenceCount: integer("occurrence_count").default(1),
  
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

// API logs
export const apiLogs = pgTable("api_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  
  // Request
  method: text("method").notNull(),
  path: text("path").notNull(),
  query: jsonb("query"),
  body: jsonb("body"),
  
  // Response
  statusCode: integer("status_code").notNull(),
  responseTime: integer("response_time"), // milliseconds
  
  // User
  userId: uuid("user_id").references(() => users.id),
  
  // IP
  ipAddress: text("ip_address"),
  
  // Headers
  userAgent: text("user_agent"),
  
  // Error
  errorMessage: text("error_message"),
  
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

// System health metrics
export const healthMetrics = pgTable("health_metrics", {
  id: uuid("id").primaryKey().defaultRandom(),
  
  // Metric
  metricType: text("metric_type").notNull(), // cpu, memory, disk, response_time, error_rate
  metricName: text("metric_name").notNull(),
  
  // Value
  value: decimal("value", { precision: 10, scale: 2 }).notNull(),
  unit: text("unit"), // percent, mb, ms, count
  
  // Thresholds
  warningThreshold: decimal("warning_threshold", { precision: 10, scale: 2 }),
  criticalThreshold: decimal("critical_threshold", { precision: 10, scale: 2 }),
  
  // Status
  status: text("status").default("normal"), // normal, warning, critical
  
  // Context
  environment: text("environment"),
  server: text("server"),
  
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

// Feature flags
export const featureFlags = pgTable("feature_flags", {
  id: uuid("id").primaryKey().defaultRandom(),
  
  // Flag info
  name: text("name").notNull().unique(),
  key: text("key").notNull().unique(),
  description: text("description"),
  
  // Status
  isEnabled: boolean("is_enabled").default(false),
  
  // Rollout
  rolloutPercentage: integer("rollout_percentage").default(0), // 0-100
  
  // Targeting
  targetUserIds: jsonb("target_user_ids").$type<string[]>().default([]),
  targetUserRoles: jsonb("target_user_roles").$type<string[]>().default([]),
  
  // Environment
  environments: jsonb("environments").$type<string[]>().default(["production"]),
  
  // Dates
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  
  // Metadata
  tags: jsonb("tags").$type<string[]>().default([]),
  
  // Management
  createdBy: uuid("created_by").references(() => users.id),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Scheduled jobs
export const scheduledJobs = pgTable("scheduled_jobs", {
  id: uuid("id").primaryKey().defaultRandom(),
  
  // Job info
  name: text("name").notNull(),
  type: text("type").notNull(), // email_digest, data_cleanup, backup, report_generation
  
  // Schedule
  schedule: text("schedule").notNull(), // Cron expression
  
  // Status
  isActive: boolean("is_active").default(true),
  
  // Last run
  lastRunAt: timestamp("last_run_at"),
  lastRunStatus: text("last_run_status"), // success, failed, running
  lastRunDuration: integer("last_run_duration"), // seconds
  lastRunError: text("last_run_error"),
  
  // Next run
  nextRunAt: timestamp("next_run_at"),
  
  // Stats
  totalRuns: integer("total_runs").default(0),
  successfulRuns: integer("successful_runs").default(0),
  failedRuns: integer("failed_runs").default(0),
  
  // Config
  config: jsonb("config"),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Job execution history
export const jobExecutions = pgTable("job_executions", {
  id: uuid("id").primaryKey().defaultRandom(),
  jobId: uuid("job_id").references(() => scheduledJobs.id).notNull(),
  
  // Execution
  startedAt: timestamp("started_at").notNull(),
  completedAt: timestamp("completed_at"),
  duration: integer("duration"), // seconds
  
  // Status
  status: text("status").notNull(), // running, success, failed
  
  // Result
  result: jsonb("result"),
  errorMessage: text("error_message"),
  stackTrace: text("stack_trace"),
  
  // Metadata
  metadata: jsonb("metadata"),
});

// Database migrations tracking (supplementary to Drizzle)
export const migrations = pgTable("migrations", {
  id: uuid("id").primaryKey().defaultRandom(),
  
  name: text("name").notNull().unique(),
  version: text("version").notNull(),
  
  appliedAt: timestamp("applied_at").defaultNow().notNull(),
  appliedBy: text("applied_by"),
  
  duration: integer("duration"), // milliseconds
  
  status: text("status").default("success"), // success, failed, rolled_back
  
  notes: text("notes"),
});

// System settings
export const systemSettings = pgTable("system_settings", {
  id: uuid("id").primaryKey().defaultRandom(),
  
  // Setting
  key: text("key").notNull().unique(),
  value: text("value").notNull(),
  
  // Type
  valueType: text("value_type").notNull(), // string, number, boolean, json
  
  // Category
  category: text("category").notNull(), // general, email, payments, features, integrations
  
  // Display
  label: text("label"),
  description: text("description"),
  
  // Validation
  isRequired: boolean("is_required").default(false),
  isSecret: boolean("is_secret").default(false),
  
  // Access
  isPublic: boolean("is_public").default(false),
  
  updatedBy: uuid("updated_by").references(() => users.id),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Webhooks
export const webhooks = pgTable("webhooks", {
  id: uuid("id").primaryKey().defaultRandom(),
  
  // Webhook info
  name: text("name").notNull(),
  url: text("url").notNull(),
  
  // Events
  events: jsonb("events").$type<string[]>().default([]), // match.completed, user.registered
  
  // Security
  secret: text("secret"),
  
  // Headers
  headers: jsonb("headers"),
  
  // Status
  isActive: boolean("is_active").default(true),
  
  // Stats
  totalCalls: integer("total_calls").default(0),
  successfulCalls: integer("successful_calls").default(0),
  failedCalls: integer("failed_calls").default(0),
  
  // Last call
  lastCalledAt: timestamp("last_called_at"),
  lastStatus: integer("last_status"),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Webhook logs
export const webhookLogs = pgTable("webhook_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  webhookId: uuid("webhook_id").references(() => webhooks.id).notNull(),
  
  // Event
  event: text("event").notNull(),
  payload: jsonb("payload").notNull(),
  
  // Response
  statusCode: integer("status_code"),
  responseBody: text("response_body"),
  responseTime: integer("response_time"), // milliseconds
  
  // Error
  errorMessage: text("error_message"),
  
  // Retry
  attemptNumber: integer("attempt_number").default(1),
  
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});
