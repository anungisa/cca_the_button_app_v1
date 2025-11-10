// Main schema export file - Curling Canada App
// Aggregates all schema definitions for Drizzle ORM

// Legacy boilerplate schemas (to be deprecated)
export * from "./profiles-schema";
export * from "./pending-profiles-schema";

// Core entities
export * from "./users";
export * from "./clubs";
export * from "./events";
export * from "./teams";

// Competition and matches
export * from "./draws";

// Loyalty and gamification
export * from "./loyalty";

// Performance and rankings
export * from "./performance";

// Content and media
export * from "./content";

// Organization
export * from "./organization";

// Communications
export * from "./communications";

// Streaming and commerce
export * from "./streaming";

// Social features
export * from "./social";

// System and analytics
export * from "./system";
