// Database connection specifically for seeding
// This file loads environment variables before creating the connection
import dotenv from "dotenv";
import { resolve } from "path";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

// Load environment variables FIRST
dotenv.config({ path: resolve(__dirname, "../../.env.local") });

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL not found in environment variables!");
}

// Create postgres client for seeding
const client = postgres(process.env.DATABASE_URL, {
  max: 1,
  prepare: false,
});

// Create drizzle client
export const db = drizzle(client);

// Export cleanup function
export async function closeConnection() {
  await client.end();
}
