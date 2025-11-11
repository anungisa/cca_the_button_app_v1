// Main seed script - orchestrates all seeding operations
import { seedClubs } from "./clubs";
import { seedEvents } from "./events";
import { seedLoyalty } from "./loyalty";
import { closeConnection } from "./db-connection";

async function main() {
  console.log("\n🌱 Starting database seeding...\n");
  
  try {
    // Seed in order of dependencies
    
    // 1. Clubs (no dependencies)
    await seedClubs();
    
    // 2. Events (depends on clubs for venue_id, but it's optional)
    await seedEvents();
    
    // 3. Loyalty tiers and rewards (no dependencies on other seeded data)
    await seedLoyalty();
    
    console.log("\n✅ Database seeding completed successfully!\n");
    
    console.log("Summary:");
    console.log("  • 30 clubs across Canadian provinces");
    console.log("  • 20+ events (competitions, clinics, leagues)");
    console.log("  • 4 loyalty tiers (Stone, Bronze, Silver, Gold)");
    console.log("  • 15 rewards in catalog");
    console.log("\nYou can now:");
    console.log("  1. View clubs on the home page");
    console.log("  2. Browse events");
    console.log("  3. Test loyalty program");
    console.log("  4. Create test users and verify RLS policies\n");
    
    await closeConnection();
    process.exit(0);
  } catch (error) {
    console.error("\n❌ Seeding failed:", error);
    await closeConnection();
    process.exit(1);
  }
}

main();
