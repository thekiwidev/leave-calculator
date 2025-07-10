//@lib: Supabase client configuration and database types
import { createClient } from "@supabase/supabase-js";
import type { PublicHoliday, NotPublicHolidayDate } from "@/types";

// Get Supabase credentials from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing Supabase environment variables. Please check your .env file."
  );
}

// Create and export the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Define a type for our holiday table row as it exists in the database
export type HolidayRow = {
  id: number;
  created_at: string;
  name: string;
  date: string; // YYYY-MM-DD format
};

// Helper function to map Supabase row to our app's PublicHoliday type
export const mapRowToHoliday = (row: HolidayRow): PublicHoliday => ({
  name: row.name,
  date: row.date,
  isManual: true, // All holidays in Supabase are considered manual/permanent
});

// Helper function to map our PublicHoliday type to database insert format
export const mapHolidayToRow = (
  holiday: PublicHoliday
): Pick<HolidayRow, "name" | "date"> => ({
  name: holiday.name,
  date: holiday.date,
});

// Define a type for our not_public_holidays table row as it exists in the database
export type NotPublicHolidayRow = {
  id: number;
  created_at: string;
  name: string;
  date: string; // YYYY-MM-DD format
};

// Helper function to map Supabase row to our app's NotPublicHolidayDate type
export const mapRowToNotPublicHoliday = (
  row: NotPublicHolidayRow
): NotPublicHolidayDate => ({
  name: row.name,
  date: row.date,
});

// Helper function to map our NotPublicHolidayDate type to database insert format
export const mapNotPublicHolidayToRow = (
  notHoliday: NotPublicHolidayDate
): Pick<NotPublicHolidayRow, "name" | "date"> => ({
  name: notHoliday.name,
  date: notHoliday.date,
});
