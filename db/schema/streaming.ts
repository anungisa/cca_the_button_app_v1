// Streaming, Broadcasts, and Merchandise Schema
import { pgTable, uuid, text, timestamp, integer, boolean, decimal, jsonb } from "drizzle-orm/pg-core";
import { users } from "./users";
import { events } from "./events";
import { matches } from "./draws";

// Live streams
export const streams = pgTable("streams", {
  id: uuid("id").primaryKey().defaultRandom(),
  
  // Stream info
  title: text("title").notNull(),
  description: text("description"),
  
  // Related entity
  eventId: uuid("event_id").references(() => events.id),
  matchId: uuid("match_id").references(() => matches.id),
  
  // Stream URLs
  streamUrl: text("stream_url").notNull(),
  embedUrl: text("embed_url"),
  chatUrl: text("chat_url"),
  
  // Platform
  platform: text("platform").notNull(), // youtube, twitch, custom
  externalStreamId: text("external_stream_id"),
  
  // Thumbnail
  thumbnailUrl: text("thumbnail_url"),
  
  // Status
  status: text("status").default("scheduled").notNull(), // scheduled, live, ended, cancelled
  
  // Schedule
  scheduledStart: timestamp("scheduled_start").notNull(),
  scheduledEnd: timestamp("scheduled_end"),
  actualStart: timestamp("actual_start"),
  actualEnd: timestamp("actual_end"),
  
  // Features
  hasChat: boolean("has_chat").default(true),
  hasLiveScoring: boolean("has_live_scoring").default(false),
  isPublic: boolean("is_public").default(true),
  
  // Access
  requiresSubscription: boolean("requires_subscription").default(false),
  subscriptionTier: text("subscription_tier"),
  
  // Analytics
  viewCount: integer("view_count").default(0),
  peakViewers: integer("peak_viewers").default(0),
  totalWatchTime: integer("total_watch_time").default(0), // minutes
  
  // Quality
  resolution: text("resolution"), // 1080p, 720p, 480p
  bitrate: integer("bitrate"), // kbps
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Stream viewers (tracking)
export const streamViewers = pgTable("stream_viewers", {
  id: uuid("id").primaryKey().defaultRandom(),
  streamId: uuid("stream_id").references(() => streams.id).notNull(),
  userId: uuid("user_id").references(() => users.id),
  
  // Session
  sessionId: text("session_id").notNull(),
  
  // Timing
  joinedAt: timestamp("joined_at").notNull(),
  leftAt: timestamp("left_at"),
  watchTime: integer("watch_time"), // seconds
  
  // Device
  device: text("device"), // desktop, mobile, tablet
  platform: text("platform"), // web, ios, android
  
  // Quality
  avgQuality: text("avg_quality"),
  bufferingTime: integer("buffering_time"), // seconds
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Merchandise products
export const products = pgTable("products", {
  id: uuid("id").primaryKey().defaultRandom(),
  
  // Basic info
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  
  // Category
  category: text("category").notNull(), // apparel, equipment, accessories, collectibles
  subcategory: text("subcategory"),
  
  // Pricing
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  compareAtPrice: decimal("compare_at_price", { precision: 10, scale: 2 }),
  cost: decimal("cost", { precision: 10, scale: 2 }),
  currency: text("currency").default("CAD"),
  
  // Inventory
  sku: text("sku").unique(),
  barcode: text("barcode"),
  stockQuantity: integer("stock_quantity").default(0),
  lowStockThreshold: integer("low_stock_threshold").default(10),
  
  // Variants
  hasVariants: boolean("has_variants").default(false),
  
  // Media
  images: jsonb("images").$type<string[]>().default([]),
  primaryImage: text("primary_image"),
  
  // Details
  brand: text("brand"),
  weight: decimal("weight", { precision: 10, scale: 2 }), // kg
  dimensions: jsonb("dimensions"), // {length, width, height}
  
  // Features
  features: jsonb("features").$type<string[]>().default([]),
  materials: text("materials"),
  careInstructions: text("care_instructions"),
  
  // SEO
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  tags: jsonb("tags").$type<string[]>().default([]),
  
  // Status
  status: text("status").default("active").notNull(), // draft, active, archived
  isPublished: boolean("is_published").default(true),
  isFeatured: boolean("is_featured").default(false),
  
  // Loyalty
  pointsValue: integer("points_value"), // Points earned on purchase
  
  // Stats
  viewCount: integer("view_count").default(0),
  salesCount: integer("sales_count").default(0),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Product variants
export const productVariants = pgTable("product_variants", {
  id: uuid("id").primaryKey().defaultRandom(),
  productId: uuid("product_id").references(() => products.id).notNull(),
  
  // Variant details
  name: text("name").notNull(), // "Large / Blue"
  sku: text("sku").unique(),
  
  // Options
  option1: text("option1"), // Size
  option1Value: text("option1_value"), // Large
  option2: text("option2"), // Color
  option2Value: text("option2_value"), // Blue
  option3: text("option3"),
  option3Value: text("option3_value"),
  
  // Pricing
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  compareAtPrice: decimal("compare_at_price", { precision: 10, scale: 2 }),
  
  // Inventory
  stockQuantity: integer("stock_quantity").default(0),
  
  // Media
  image: text("image"),
  
  // Status
  isAvailable: boolean("is_available").default(true),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Orders
export const orders = pgTable("orders", {
  id: uuid("id").primaryKey().defaultRandom(),
  orderNumber: text("order_number").notNull().unique(),
  
  // Customer
  userId: uuid("user_id").references(() => users.id).notNull(),
  
  // Pricing
  subtotal: decimal("subtotal", { precision: 10, scale: 2 }).notNull(),
  tax: decimal("tax", { precision: 10, scale: 2 }).default("0"),
  shipping: decimal("shipping", { precision: 10, scale: 2 }).default("0"),
  discount: decimal("discount", { precision: 10, scale: 2 }).default("0"),
  total: decimal("total", { precision: 10, scale: 2 }).notNull(),
  currency: text("currency").default("CAD"),
  
  // Payment
  paymentStatus: text("payment_status").default("pending").notNull(), // pending, paid, failed, refunded
  paymentMethod: text("payment_method"),
  paymentIntentId: text("payment_intent_id"),
  paidAt: timestamp("paid_at"),
  
  // Fulfillment
  fulfillmentStatus: text("fulfillment_status").default("unfulfilled").notNull(), // unfulfilled, partial, fulfilled, cancelled
  
  // Shipping
  shippingAddress: jsonb("shipping_address").notNull(),
  billingAddress: jsonb("billing_address").notNull(),
  shippingMethod: text("shipping_method"),
  trackingNumber: text("tracking_number"),
  trackingUrl: text("tracking_url"),
  shippedAt: timestamp("shipped_at"),
  deliveredAt: timestamp("delivered_at"),
  
  // Loyalty points
  pointsEarned: integer("points_earned").default(0),
  pointsRedeemed: integer("points_redeemed").default(0),
  
  // Notes
  customerNotes: text("customer_notes"),
  internalNotes: text("internal_notes"),
  
  // Cancellation
  cancelledAt: timestamp("cancelled_at"),
  cancelReason: text("cancel_reason"),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Order items
export const orderItems = pgTable("order_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  orderId: uuid("order_id").references(() => orders.id).notNull(),
  
  // Product
  productId: uuid("product_id").references(() => products.id),
  variantId: uuid("variant_id").references(() => productVariants.id),
  
  // Details (snapshot at order time)
  productName: text("product_name").notNull(),
  variantName: text("variant_name"),
  sku: text("sku"),
  
  // Pricing
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  quantity: integer("quantity").notNull(),
  subtotal: decimal("subtotal", { precision: 10, scale: 2 }).notNull(),
  
  // Fulfillment
  fulfillmentStatus: text("fulfillment_status").default("unfulfilled"),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Shopping cart
export const cartItems = pgTable("cart_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  
  // Product
  productId: uuid("product_id").references(() => products.id).notNull(),
  variantId: uuid("variant_id").references(() => productVariants.id),
  
  // Quantity
  quantity: integer("quantity").notNull().default(1),
  
  // Session (for guest users)
  sessionId: text("session_id"),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Subscriptions (for premium content access)
export const subscriptions = pgTable("subscriptions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  
  // Plan
  planType: text("plan_type").notNull(), // basic, premium, elite
  planName: text("plan_name").notNull(),
  
  // Pricing
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  currency: text("currency").default("CAD"),
  billingInterval: text("billing_interval").notNull(), // monthly, yearly
  
  // Status
  status: text("status").default("active").notNull(), // active, cancelled, expired, past_due
  
  // Dates
  startDate: timestamp("start_date").notNull(),
  currentPeriodStart: timestamp("current_period_start").notNull(),
  currentPeriodEnd: timestamp("current_period_end").notNull(),
  cancelledAt: timestamp("cancelled_at"),
  endedAt: timestamp("ended_at"),
  
  // Payment
  stripeSubscriptionId: text("stripe_subscription_id").unique(),
  stripeCustomerId: text("stripe_customer_id"),
  
  // Features
  features: jsonb("features").$type<string[]>().default([]),
  
  // Trial
  trialStart: timestamp("trial_start"),
  trialEnd: timestamp("trial_end"),
  
  // Auto-renewal
  cancelAtPeriodEnd: boolean("cancel_at_period_end").default(false),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
