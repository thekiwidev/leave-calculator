//@utils: Date utility functions using date-fns
import {
  addDays,
  isWeekend,
  parseISO,
  format,
  startOfDay,
  getDay,
} from "date-fns";
import type { PublicHoliday } from "@/types";

/**
 * Process public holidays to shift weekend holidays to next working day
 * @param publicHolidays - Array of public holidays
 * @returns Processed array with weekend holidays shifted to working days
 */
export const processPublicHolidays = (
  publicHolidays: PublicHoliday[]
): PublicHoliday[] => {
  const processedHolidays: PublicHoliday[] = [];

  for (const holiday of publicHolidays) {
    const holidayDate = parseISO(holiday.date);
    const dayOfWeek = getDay(holidayDate); // 0 = Sunday, 6 = Saturday

    if (dayOfWeek === 0 || dayOfWeek === 6) {
      // Weekend
      // Find the next Monday (working day)
      let nextWorkingDay = holidayDate;
      do {
        nextWorkingDay = addDays(nextWorkingDay, 1);
      } while (isWeekend(nextWorkingDay));

      processedHolidays.push({
        ...holiday,
        date: format(nextWorkingDay, "yyyy-MM-dd"),
        name: `${holiday.name} (observed)`, // Mark as observed
      });
    } else {
      // Keep the original holiday
      processedHolidays.push(holiday);
    }
  }

  // Remove duplicates that might occur when multiple holidays shift to the same day
  const uniqueHolidays = processedHolidays.filter(
    (holiday, index, self) =>
      index === self.findIndex((h) => h.date === holiday.date)
  );

  return uniqueHolidays.sort((a, b) => a.date.localeCompare(b.date));
};

/**
 * Check if a given date is a public holiday (including processed weekend holidays)
 * @param date - Date to check (ISO string)
 * @param publicHolidays - Array of public holidays
 * @returns true if the date is a public holiday
 */
export const isPublicHoliday = (
  date: string,
  publicHolidays: PublicHoliday[]
): boolean => {
  const processedHolidays = processPublicHolidays(publicHolidays);
  return processedHolidays.some((holiday) => holiday.date === date);
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
