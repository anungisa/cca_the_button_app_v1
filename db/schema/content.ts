// Content, Media, and Knowledge Base Schema
import { pgTable, uuid, text, timestamp, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { users } from "./users";

// Articles/News
export const articles = pgTable("articles", {
  id: uuid("id").primaryKey().defaultRandom(),
  
  // Content
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  excerpt: text("excerpt"),
  content: text("content").notNull(),
  
  // Metadata
  authorId: uuid("author_id").references(() => users.id).notNull(),
  category: text("category").notNull(), // news, tutorial, interview, recap, analysis
  
  // Media
  featuredImage: text("featured_image"),
  thumbnailImage: text("thumbnail_image"),
  gallery: jsonb("gallery").$type<string[]>().default([]),
  
  // SEO
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  tags: jsonb("tags").$type<string[]>().default([]),
  
  // Status
  status: text("status").default("draft").notNull(), // draft, published, archived
  
  // Engagement
  viewCount: integer("view_count").default(0),
  likeCount: integer("like_count").default(0),
  commentCount: integer("comment_count").default(0),
  
  // Features
  isFeatured: boolean("is_featured").default(false),
  isPinned: boolean("is_pinned").default(false),
  
  // Dates
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Videos
export const videos = pgTable("videos", {
  id: uuid("id").primaryKey().defaultRandom(),
  
  // Content
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  
  // Video details
  videoUrl: text("video_url").notNull(), // YouTube, Vimeo, or direct
  platform: text("platform"), // youtube, vimeo, internal
  externalVideoId: text("external_video_id"),
  
  // Duration
  duration: integer("duration"), // seconds
  
  // Metadata
  uploadedBy: uuid("uploaded_by").references(() => users.id).notNull(),
  category: text("category").notNull(), // match_replay, tutorial, highlight, interview, documentary
  
  // Thumbnail
  thumbnailUrl: text("thumbnail_url"),
  
  // SEO
  tags: jsonb("tags").$type<string[]>().default([]),
  
  // Engagement
  viewCount: integer("view_count").default(0),
  likeCount: integer("like_count").default(0),
  
  // Features
  isFeatured: boolean("is_featured").default(false),
  isLive: boolean("is_live").default(false),
  
  // Status
  status: text("status").default("published").notNull(),
  
  // Dates
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Photo gallery
export const photos = pgTable("photos", {
  id: uuid("id").primaryKey().defaultRandom(),
  
  // Photo details
  title: text("title"),
  caption: text("caption"),
  
  // File
  imageUrl: text("image_url").notNull(),
  thumbnailUrl: text("thumbnail_url"),
  originalUrl: text("original_url"),
  
  // Metadata
  uploadedBy: uuid("uploaded_by").references(() => users.id).notNull(),
  
  // Dimensions
  width: integer("width"),
  height: integer("height"),
  fileSize: integer("file_size"), // bytes
  
  // Categorization
  albumId: uuid("album_id"),
  category: text("category"), // event, team, player, venue
  tags: jsonb("tags").$type<string[]>().default([]),
  
  // Engagement
  viewCount: integer("view_count").default(0),
  likeCount: integer("like_count").default(0),
  
  // Status
  status: text("status").default("published").notNull(),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Photo albums
export const albums = pgTable("albums", {
  id: uuid("id").primaryKey().defaultRandom(),
  
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  
  // Cover
  coverPhotoId: uuid("cover_photo_id"),
  
  // Metadata
  createdBy: uuid("created_by").references(() => users.id).notNull(),
  
  // Counts
  photoCount: integer("photo_count").default(0),
  
  // Privacy
  isPublic: boolean("is_public").default(true),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Knowledge base articles
export const knowledgeBase = pgTable("knowledge_base", {
  id: uuid("id").primaryKey().defaultRandom(),
  
  // Content
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  content: text("content").notNull(),
  excerpt: text("excerpt"),
  
  // Category
  category: text("category").notNull(), // rules, equipment, strategy, history, getting_started
  subcategory: text("subcategory"),
  
  // Metadata
  authorId: uuid("author_id").references(() => users.id).notNull(),
  
  // SEO
  keywords: jsonb("keywords").$type<string[]>().default([]),
  
  // Engagement
  viewCount: integer("view_count").default(0),
  helpfulCount: integer("helpful_count").default(0),
  notHelpfulCount: integer("not_helpful_count").default(0),
  
  // Status
  status: text("status").default("published").notNull(),
  
  // Display
  orderIndex: integer("order_index"),
  
  // Dates
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// FAQs
export const faqs = pgTable("faqs", {
  id: uuid("id").primaryKey().defaultRandom(),
  
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  
  // Category
  category: text("category").notNull(), // general, membership, events, technical, billing
  
  // Engagement
  viewCount: integer("view_count").default(0),
  helpfulCount: integer("helpful_count").default(0),
  
  // Display
  orderIndex: integer("order_index"),
  isFeatured: boolean("is_featured").default(false),
  
  // Status
  isActive: boolean("is_active").default(true),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Comments
export const comments = pgTable("comments", {
  id: uuid("id").primaryKey().defaultRandom(),
  
  // Content
  content: text("content").notNull(),
  
  // Author
  userId: uuid("user_id").references(() => users.id).notNull(),
  
  // Target
  targetType: text("target_type").notNull(), // article, video, photo
  targetId: uuid("target_id").notNull(),
  
  // Threading
  parentId: uuid("parent_id"), // For replies
  
  // Engagement
  likeCount: integer("like_count").default(0),
  
  // Moderation
  status: text("status").default("published").notNull(), // pending, published, flagged, removed
  
  // Flags
  isFlagged: boolean("is_flagged").default(false),
  flagReason: text("flag_reason"),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// User content engagement (likes, bookmarks)
export const contentEngagement = pgTable("content_engagement", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  
  // Target
  contentType: text("content_type").notNull(), // article, video, photo, comment
  contentId: uuid("content_id").notNull(),
  
  // Engagement type
  engagementType: text("engagement_type").notNull(), // like, bookmark, share, view
  
  // Metadata
  metadata: jsonb("metadata"),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Newsletters
export const newsletters = pgTable("newsletters", {
  id: uuid("id").primaryKey().defaultRandom(),
  
  // Content
  subject: text("subject").notNull(),
  preheader: text("preheader"),
  htmlContent: text("html_content").notNull(),
  textContent: text("text_content"),
  
  // Metadata
  createdBy: uuid("created_by").references(() => users.id).notNull(),
  
  // Status
  status: text("status").default("draft").notNull(), // draft, scheduled, sent
  
  // Sending
  scheduledFor: timestamp("scheduled_for"),
  sentAt: timestamp("sent_at"),
  
  // Recipients
  recipientCount: integer("recipient_count").default(0),
  
  // Analytics
  openCount: integer("open_count").default(0),
  clickCount: integer("click_count").default(0),
  openRate: integer("open_rate").default(0), // percentage
  clickRate: integer("click_rate").default(0), // percentage
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
