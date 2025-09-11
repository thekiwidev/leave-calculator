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

    // Run a minimal query - just select 1 to check if database is responsive
    const { error } = await supabase
      .from("holidays") // Using existing table to avoid creating new ones
      .select("id")
      .limit(1);

    if (error) {
      console.warn("Keep-alive query failed:", error);
      return {
        success: false,
        message: `Database query failed: ${error.message}`,
        timestamp: new Date().toISOString(),
      };
    }

    // @comment: Successfully pinged database
    console.log("Supabase keep-alive ping successful");
    return {
      success: true,
      message: "Database keep-alive ping successful",
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
