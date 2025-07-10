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
 * Format date with day of the week for display
 * @param date - Date to format (ISO string)
 * @returns Formatted date string with day of the week
 */
export const formatDateWithDay = (date: string): string => {
  return format(parseISO(date), "EEEE, MMMM d, yyyy");
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

/**
 * Get the next working day with adjustment information
 * @param date - Starting date (ISO string)
 * @param publicHolidays - Array of public holidays
 * @returns Object with next working day and adjustment details
 */
export const getNextWorkingDayWithDetails = (
  date: string,
  publicHolidays: PublicHoliday[]
): {
  nextWorkingDay: string;
  wasAdjusted: boolean;
  adjustedHolidays: PublicHoliday[];
  reason: string;
} => {
  let currentDate = parseISO(date);
  const originalDate = format(currentDate, "yyyy-MM-dd");
  const adjustedHolidays: PublicHoliday[] = [];
  let hasWeekend = false;

  // Check if we need to move to the next day
  do {
    currentDate = addDays(currentDate, 1);
    const currentDateISO = format(currentDate, "yyyy-MM-dd");

    // Check if this day is a holiday
    const holiday = publicHolidays.find((h) => h.date === currentDateISO);
    if (holiday) {
      adjustedHolidays.push(holiday);
    }

    // Check if this day is a weekend
    const dayOfWeek = currentDate.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      hasWeekend = true;
    }
  } while (!isWorkingDay(format(currentDate, "yyyy-MM-dd"), publicHolidays));

  const nextWorkingDay = format(currentDate, "yyyy-MM-dd");
  const wasAdjusted =
    nextWorkingDay !==
    addDays(parseISO(originalDate), 1).toISOString().split("T")[0];

  let reason = "";
  if (adjustedHolidays.length > 0 && hasWeekend) {
    reason = "Public Holiday and Weekend";
  } else if (adjustedHolidays.length > 0) {
    reason = "Public Holiday";
  } else if (hasWeekend) {
    reason = "Weekend";
  }

  return {
    nextWorkingDay,
    wasAdjusted,
    adjustedHolidays,
    reason,
  };
};
