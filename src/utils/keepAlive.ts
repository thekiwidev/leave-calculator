//@utility: Supabase keep-alive functionality
import { createClient } from "@supabase/supabase-js";

//@helper: Create a server-side Supabase client for keep-alive operations
// This function creates a Supabase client with service role key for administrative operations
const createServerClient = () => {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseServiceKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error(
      "Missing Supabase environment variables for server operations"
    );
  }

  return createClient(supabaseUrl, supabaseServiceKey);
};

//@helper: Perform a minimal database query to keep Supabase active
// This function runs a lightweight query to prevent database auto-pause
export const pingSupabaseKeepAlive = async (): Promise<{
  success: boolean;
  message: string;
  timestamp: string;
}> => {
  try {
    const supabase = createServerClient();

    // Try multiple fallback queries to ensure at least one works
    let lastError: Error | { message: string } | null = null;

    // Option 1: Try to query existing tables if they exist
    try {
      const { error } = await supabase.from("holidays").select("id").limit(1);
      if (!error) {
        console.log("✅ Keep-alive successful using holidays table");
        return {
          success: true,
          message: "Database keep-alive ping successful (holidays table)",
          timestamp: new Date().toISOString(),
        };
      }
      lastError = error || { message: "Unknown error" };
    } catch (err) {
      lastError = err instanceof Error ? err : { message: String(err) };
    }

    // Option 2: Try not_public_holidays table
    try {
      const { error } = await supabase
        .from("not_public_holidays")
        .select("id")
        .limit(1);
      if (!error) {
        console.log("✅ Keep-alive successful using not_public_holidays table");
        return {
          success: true,
          message:
            "Database keep-alive ping successful (not_public_holidays table)",
          timestamp: new Date().toISOString(),
        };
      }
      lastError = error || { message: "Unknown error" };
    } catch (err) {
      lastError = err instanceof Error ? err : { message: String(err) };
    }

    // Option 3: Use raw SQL query that should work in any PostgreSQL instance
    try {
      const { error } = await supabase.rpc("version");
      if (!error) {
        console.log("✅ Keep-alive successful using version() function");
        return {
          success: true,
          message: "Database keep-alive ping successful (version function)",
          timestamp: new Date().toISOString(),
        };
      }
      lastError = error || { message: "Unknown error" };
    } catch (err) {
      lastError = err instanceof Error ? err : { message: String(err) };
    }

    // Option 4: Last resort - try a simple SELECT 1 query
    try {
      const { error } = await supabase
        .from("_supabase_tables") // This is a system table that should exist
        .select("*")
        .limit(1);
      if (!error) {
        console.log("✅ Keep-alive successful using system table");
        return {
          success: true,
          message: "Database keep-alive ping successful (system table)",
          timestamp: new Date().toISOString(),
        };
      }
      lastError = error || { message: "Unknown error" };
    } catch (err) {
      lastError = err instanceof Error ? err : { message: String(err) };
    }

    // If all options failed, return the last error
    console.error("All keep-alive query options failed");
    return {
      success: false,
      message: `All database queries failed. Last error: ${
        lastError?.message || "Unknown error"
      }`,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error("Keep-alive ping error:", error);
    return {
      success: false,
      message: `Keep-alive failed: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
      timestamp: new Date().toISOString(),
    };
  }
};

//@helper: Schedule automatic keep-alive pings
// This function sets up periodic pings to keep database active
export const scheduleKeepAlive = (intervalHours: number = 24 * 6) => {
  // Run initial ping
  pingSupabaseKeepAlive();

  // Schedule recurring pings every 6 days by default (well before 7-day timeout)
  const intervalMs = intervalHours * 60 * 60 * 1000;

  const intervalId = setInterval(() => {
    pingSupabaseKeepAlive();
  }, intervalMs);

  // @comment: Return cleanup function to stop the scheduled pings
  return () => {
    clearInterval(intervalId);
  };
};

//@helper: Manual keep-alive ping for testing purposes
// This function allows manual testing of the keep-alive functionality
export const testKeepAlive = async (): Promise<void> => {
  console.log("Testing Supabase keep-alive...");
  const result = await pingSupabaseKeepAlive();

  if (result.success) {
    console.log("✅ Keep-alive test successful:", result);
  } else {
    console.error("❌ Keep-alive test failed:", result);
  }
};
