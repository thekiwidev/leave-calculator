//@service: Supabase service functions for holiday management
import {
  supabase,
  mapRowToHoliday,
  mapHolidayToRow,
  mapRowToNotPublicHoliday,
  mapNotPublicHolidayToRow,
} from "./supabase";
import type { PublicHoliday, NotPublicHolidayDate } from "@/types";

/**
 * Fetch all public holidays from Supabase
 */
export const fetchHolidaysFromSupabase = async (): Promise<PublicHoliday[]> => {
  try {
    const { data, error } = await supabase
      .from("public_holidays")
      .select("*")
      .order("date", { ascending: true });

    if (error) {
      console.error("Error fetching holidays from Supabase:", error);
      throw new Error(`Failed to fetch holidays: ${error.message}`);
    }

    return data ? data.map(mapRowToHoliday) : [];
  } catch (error) {
    console.error("Error in fetchHolidaysFromSupabase:", error);
    throw error;
  }
};

/**
 * Add a new public holiday to Supabase
 * @param holiday - The holiday to add
 * @returns The added holiday with database ID
 */
export const addHolidayToSupabase = async (
  holiday: PublicHoliday
): Promise<PublicHoliday> => {
  try {
    // Check for duplicates first
    const { data: existingHolidays, error: checkError } = await supabase
      .from("public_holidays")
      .select("date")
      .eq("date", holiday.date);

    if (checkError) {
      throw new Error(`Failed to check for duplicates: ${checkError.message}`);
    }

    if (existingHolidays && existingHolidays.length > 0) {
      throw new Error("A holiday already exists on this date");
    }

    // Insert the new holiday
    const { data, error } = await supabase
      .from("public_holidays")
      .insert([mapHolidayToRow(holiday)])
      .select()
      .single();

    if (error) {
      console.error("Error adding holiday to Supabase:", error);

      // Check if it's an RLS policy error
      if (
        error.message.includes("row-level security policy") ||
        error.code === "42501"
      ) {
        throw new Error(
          `Database access denied: Please configure Row Level Security policies for the public_holidays table.`
        );
      }

      throw new Error(`Failed to add holiday: ${error.message}`);
    }

    return mapRowToHoliday(data);
  } catch (error) {
    console.error("Error in addHolidayToSupabase:", error);
    throw error;
  }
};

/**
 * Remove a public holiday from Supabase by date
 * @param date - The date of the holiday to remove (YYYY-MM-DD)
 */
export const removeHolidayFromSupabase = async (
  date: string
): Promise<void> => {
  try {
    const { error } = await supabase
      .from("public_holidays")
      .delete()
      .eq("date", date);

    if (error) {
      console.error("Error removing holiday from Supabase:", error);
      throw new Error(`Failed to remove holiday: ${error.message}`);
    }
  } catch (error) {
    console.error("Error in removeHolidayFromSupabase:", error);
    throw error;
  }
};

/**
 * Remove multiple public holidays from Supabase by dates
 * @param dates - Array of dates to remove (YYYY-MM-DD format)
 */
export const removeMultipleHolidaysFromSupabase = async (
  dates: string[]
): Promise<void> => {
  try {
    const { error } = await supabase
      .from("public_holidays")
      .delete()
      .in("date", dates);

    if (error) {
      console.error("Error removing multiple holidays from Supabase:", error);
      throw new Error(`Failed to remove holidays: ${error.message}`);
    }
  } catch (error) {
    console.error("Error in removeMultipleHolidaysFromSupabase:", error);
    throw error;
  }
};

/**
 * Sync API holidays to Supabase (avoiding duplicates)
 * @param apiHolidays - Holidays fetched from external API
 * @returns Number of new holidays added
 */
export const syncApiHolidaysToSupabase = async (
  apiHolidays: PublicHoliday[]
): Promise<number> => {
  try {
    // Get existing holidays from Supabase
    const existingHolidays = await fetchHolidaysFromSupabase();
    const existingDates = new Set(existingHolidays.map((h) => h.date));

    // Filter out holidays that already exist
    const newHolidays = apiHolidays.filter(
      (holiday) => !existingDates.has(holiday.date)
    );

    if (newHolidays.length === 0) {
      console.log("No new holidays to sync");
      return 0;
    }

    // Insert new holidays in batch
    const { error } = await supabase
      .from("public_holidays")
      .insert(newHolidays.map(mapHolidayToRow));

    if (error) {
      console.error("Error syncing holidays to Supabase:", error);

      // Check if it's an RLS policy error
      if (
        error.message.includes("row-level security policy") ||
        error.code === "42501"
      ) {
        throw new Error(
          `Database access denied: Please configure Row Level Security policies for the public_holidays table. See the documentation for setup instructions.`
        );
      }

      throw new Error(`Failed to sync holidays: ${error.message}`);
    }

    console.log(
      `Successfully synced ${newHolidays.length} new holidays to Supabase`
    );
    return newHolidays.length;
  } catch (error) {
    console.error("Error in syncApiHolidaysToSupabase:", error);
    throw error;
  }
};

/**
 * Subscribe to real-time changes in the public_holidays table
 * @param callback - Function to call when data changes
 * @returns Unsubscribe function
 */
export const subscribeToHolidayChanges = (
  callback: (holidays: PublicHoliday[]) => void
): (() => void) => {
  console.log("Setting up real-time subscription for holidays");

  // Initial fetch
  fetchHolidaysFromSupabase()
    .then(callback)
    .catch((error) => {
      console.error("Error in initial holiday fetch:", error);
    });

  // Set up real-time subscription with specific handlers for each event type
  const channel = supabase
    .channel("public_holidays_changes")
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "public_holidays",
      },
      (payload) => {
        console.log("Holiday added:", payload);
        // For inserts, just fetch all to maintain sorted order
        fetchHolidaysFromSupabase()
          .then(callback)
          .catch((error) => {
            console.error("Error refetching holidays after insert:", error);
          });
      }
    )
    .on(
      "postgres_changes",
      {
        event: "DELETE",
        schema: "public",
        table: "public_holidays",
      },
      (payload) => {
        console.log("Holiday deleted:", payload);
        // For deletes, just fetch all to ensure consistency
        fetchHolidaysFromSupabase()
          .then(callback)
          .catch((error) => {
            console.error("Error refetching holidays after delete:", error);
          });
      }
    )
    .on(
      "postgres_changes",
      {
        event: "UPDATE",
        schema: "public",
        table: "public_holidays",
      },
      (payload) => {
        console.log("Holiday updated:", payload);
        fetchHolidaysFromSupabase()
          .then(callback)
          .catch((error) => {
            console.error("Error refetching holidays after update:", error);
          });
      }
    )
    .subscribe();

  // Return cleanup function
  return () => {
    console.log("Unsubscribing from holiday changes");
    supabase.removeChannel(channel);
  };
};

// ============ NOT PUBLIC HOLIDAY FUNCTIONS ============

/**
 * Fetch all not public holiday dates from Supabase
 */
export const fetchNotPublicHolidaysFromSupabase = async (): Promise<
  NotPublicHolidayDate[]
> => {
  try {
    const { data, error } = await supabase
      .from("not_public_holidays")
      .select("*")
      .order("date", { ascending: true });

    if (error) {
      console.error("Error fetching not public holidays from Supabase:", error);
      throw new Error(`Failed to fetch not public holidays: ${error.message}`);
    }

    return data ? data.map(mapRowToNotPublicHoliday) : [];
  } catch (error) {
    console.error("Error in fetchNotPublicHolidaysFromSupabase:", error);
    throw error;
  }
};

/**
 * Add a new not public holiday date to Supabase
 * @param notHoliday - The not public holiday to add
 * @returns The added not public holiday with database ID
 */
export const addNotPublicHolidayToSupabase = async (
  notHoliday: NotPublicHolidayDate
): Promise<NotPublicHolidayDate> => {
  try {
    // Check for duplicates first
    const { data: existingDates, error: checkError } = await supabase
      .from("not_public_holidays")
      .select("date")
      .eq("date", notHoliday.date);

    if (checkError) {
      throw new Error(`Failed to check for duplicates: ${checkError.message}`);
    }

    if (existingDates && existingDates.length > 0) {
      throw new Error("This date is already in the exclusion list");
    }

    // Insert the new not public holiday
    const { data, error } = await supabase
      .from("not_public_holidays")
      .insert([mapNotPublicHolidayToRow(notHoliday)])
      .select()
      .single();

    if (error) {
      console.error("Error adding not public holiday to Supabase:", error);

      // Check if it's an RLS policy error
      if (
        error.message.includes("row-level security policy") ||
        error.code === "42501"
      ) {
        throw new Error(
          `Database access denied: Please configure Row Level Security policies for the not_public_holidays table.`
        );
      }

      throw new Error(`Failed to add not public holiday: ${error.message}`);
    }

    return mapRowToNotPublicHoliday(data);
  } catch (error) {
    console.error("Error in addNotPublicHolidayToSupabase:", error);
    throw error;
  }
};

/**
 * Remove a not public holiday from Supabase by date
 * @param date - The date of the not public holiday to remove (YYYY-MM-DD)
 */
export const removeNotPublicHolidayFromSupabase = async (
  date: string
): Promise<void> => {
  try {
    const { error } = await supabase
      .from("not_public_holidays")
      .delete()
      .eq("date", date);

    if (error) {
      console.error("Error removing not public holiday from Supabase:", error);
      throw new Error(`Failed to remove not public holiday: ${error.message}`);
    }
  } catch (error) {
    console.error("Error in removeNotPublicHolidayFromSupabase:", error);
    throw error;
  }
};

/**
 * Remove multiple not public holidays from Supabase by dates
 * @param dates - Array of dates to remove (YYYY-MM-DD format)
 */
export const removeMultipleNotPublicHolidaysFromSupabase = async (
  dates: string[]
): Promise<void> => {
  try {
    const { error } = await supabase
      .from("not_public_holidays")
      .delete()
      .in("date", dates);

    if (error) {
      console.error(
        "Error removing multiple not public holidays from Supabase:",
        error
      );
      throw new Error(`Failed to remove not public holidays: ${error.message}`);
    }
  } catch (error) {
    console.error(
      "Error in removeMultipleNotPublicHolidaysFromSupabase:",
      error
    );
    throw error;
  }
};

/**
 * Subscribe to real-time changes in the not_public_holidays table
 * @param callback - Function to call when data changes
 * @returns Unsubscribe function
 */
export const subscribeToNotPublicHolidayChanges = (
  callback: (notHolidays: NotPublicHolidayDate[]) => void
): (() => void) => {
  console.log("Setting up real-time subscription for not public holidays");

  // Initial fetch
  fetchNotPublicHolidaysFromSupabase()
    .then(callback)
    .catch((error) => {
      console.error("Error in initial not public holiday fetch:", error);
    });

  // Set up real-time subscription with specific handlers for each event type
  const channel = supabase
    .channel("not_public_holidays_changes")
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "not_public_holidays",
      },
      (payload) => {
        console.log("Not public holiday added:", payload);
        // For inserts, fetch all to maintain sorted order
        fetchNotPublicHolidaysFromSupabase()
          .then(callback)
          .catch((error) => {
            console.error("Error refetching not public holidays after insert:", error);
          });
      }
    )
    .on(
      "postgres_changes",
      {
        event: "DELETE",
        schema: "public",
        table: "not_public_holidays",
      },
      (payload) => {
        console.log("Not public holiday deleted:", payload);
        // For deletes, fetch all to ensure consistency
        fetchNotPublicHolidaysFromSupabase()
          .then(callback)
          .catch((error) => {
            console.error("Error refetching not public holidays after delete:", error);
          });
      }
    )
    .on(
      "postgres_changes",
      {
        event: "UPDATE",
        schema: "public",
        table: "not_public_holidays",
      },
      (payload) => {
        console.log("Not public holiday updated:", payload);
        fetchNotPublicHolidaysFromSupabase()
          .then(callback)
          .catch((error) => {
            console.error("Error refetching not public holidays after update:", error);
          });
      }
    )
    .subscribe();

  // Return cleanup function
  return () => {
    console.log("Unsubscribing from not public holiday changes");
    supabase.removeChannel(channel);
  };
};
