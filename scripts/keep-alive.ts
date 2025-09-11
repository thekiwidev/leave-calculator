#!/usr/bin/env bun

//@script: Standalone keep-alive script for GitHub Actions
import { pingSupabaseKeepAlive } from "../src/utils/keepAlive.ts";

// @comment: Main function to run keep-alive ping
async function main() {
  console.log("🏃 Running Supabase keep-alive ping...");
  console.log("⏰ Timestamp:", new Date().toISOString());

  try {
    const result = await pingSupabaseKeepAlive();

    if (result.success) {
      console.log("✅ Keep-alive ping successful!");
      console.log("📅 Timestamp:", result.timestamp);
      console.log("📝 Message:", result.message);
      process.exit(0);
    } else {
      console.error("❌ Keep-alive ping failed!");
      console.error("📅 Timestamp:", result.timestamp);
      console.error("📝 Message:", result.message);
      process.exit(1);
    }
  } catch (error) {
    console.error("💥 Unexpected error during keep-alive ping:");
    console.error(error);
    process.exit(1);
  }
}

// @comment: Run the script
main();
