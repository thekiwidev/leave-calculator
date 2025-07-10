//@utils: Date utility functions using date-fns
import { addDays, isWeekend, parseISO, format, startOfDay } from "date-fns";
import type { PublicHoliday } from "@/types";

/**
 * Check if a given date is a public holiday
 * @param date - Date to check (ISO string)
 * @param publicHolidays - Array of public holidays
 * @returns true if the date is a public holiday
 */
export const isPublicHoliday = (
  date: string,
  publicHolidays: PublicHoliday[]
): boolean => {
  return publicHolidays.some((holiday) => holiday.date === date);
};

/**
 * Check if a given date is a working day (not weekend or public holiday)
 * @param date - Date to check (ISO string)
 * @param publicHolidays - Array of public holidays
 * @returns true if the date is a working day
 */
export const isWorkingDay = (
  date: string,
  publicHolidays: PublicHoliday[]
): boolean => {
  const dateObj = parseISO(date);
  return !isWeekend(dateObj) && !isPublicHoliday(date, publicHolidays);
};

/**
 * Find the next working day after a given date
 * @param date - Starting date (ISO string)
 * @param publicHolidays - Array of public holidays
 * @returns Next working day (ISO string)
 */
export const getNextWorkingDay = (
  date: string,
  publicHolidays: PublicHoliday[]
): string => {
  let currentDate = parseISO(date);

  do {
    currentDate = addDays(currentDate, 1);
  } while (!isWorkingDay(format(currentDate, "yyyy-MM-dd"), publicHolidays));

  return format(currentDate, "yyyy-MM-dd");
};

/**
 * Format date for display
 * @param date - Date to format (ISO string)
 * @returns Formatted date string
 */
export const formatDate = (date: string): string => {
  return format(parseISO(date), "MMMM d, yyyy");
};

/**
 * Format date for date input
 * @param date - Date to format (ISO string)
 * @returns Date in YYYY-MM-DD format
 */
export const formatDateForInput = (date: string): string => {
  return format(parseISO(date), "yyyy-MM-dd");
};

/**
 * Get today's date in ISO format
 * @returns Today's date (YYYY-MM-DD)
 */
export const getTodayISO = (): string => {
  return format(startOfDay(new Date()), "yyyy-MM-dd");
};
