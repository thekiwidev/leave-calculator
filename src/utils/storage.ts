//@utils: Local storage utilities for data persistence
import type { PublicHoliday, LeaveType, GradeLevel } from "@/types";

// Storage keys
const STORAGE_KEYS = {
  PUBLIC_HOLIDAYS: "leave-calculator-public-holidays",
  LAST_USED_GL: "leave-calculator-last-gl",
  LAST_SELECTED_LEAVE_TYPE: "leave-calculator-last-leave-type",
} as const;

/**
 * Save public holidays to local storage
 * @param holidays - Array of public holidays to save
 */
export const savePublicHolidays = (holidays: PublicHoliday[]): void => {
  try {
    localStorage.setItem(
      STORAGE_KEYS.PUBLIC_HOLIDAYS,
      JSON.stringify(holidays)
    );
  } catch (error) {
    console.error("Failed to save public holidays to localStorage:", error);
  }
};

/**
 * Load public holidays from local storage
 * @returns Array of public holidays or empty array if none found
 */
export const loadPublicHolidays = (): PublicHoliday[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.PUBLIC_HOLIDAYS);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Failed to load public holidays from localStorage:", error);
    return [];
  }
};

/**
 * Save last used grade level to local storage
 * @param gradeLevel - Grade level to save
 */
export const saveLastUsedGL = (gradeLevel: GradeLevel): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.LAST_USED_GL, gradeLevel.toString());
  } catch (error) {
    console.error("Failed to save last used GL to localStorage:", error);
  }
};

/**
 * Load last used grade level from local storage
 * @returns Last used grade level or null if none found
 */
export const loadLastUsedGL = (): GradeLevel | null => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.LAST_USED_GL);
    return stored ? parseInt(stored, 10) : null;
  } catch (error) {
    console.error("Failed to load last used GL from localStorage:", error);
    return null;
  }
};

/**
 * Save last selected leave type to local storage
 * @param leaveType - Leave type to save
 */
export const saveLastSelectedLeaveType = (leaveType: LeaveType): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.LAST_SELECTED_LEAVE_TYPE, leaveType);
  } catch (error) {
    console.error(
      "Failed to save last selected leave type to localStorage:",
      error
    );
  }
};

/**
 * Load last selected leave type from local storage
 * @returns Last selected leave type or null if none found
 */
export const loadLastSelectedLeaveType = (): LeaveType | null => {
  try {
    return localStorage.getItem(
      STORAGE_KEYS.LAST_SELECTED_LEAVE_TYPE
    ) as LeaveType | null;
  } catch (error) {
    console.error(
      "Failed to load last selected leave type from localStorage:",
      error
    );
    return null;
  }
};

/**
 * Clear all data from local storage
 */
export const clearAllStorageData = (): void => {
  try {
    Object.values(STORAGE_KEYS).forEach((key) => {
      localStorage.removeItem(key);
    });
  } catch (error) {
    console.error("Failed to clear storage data:", error);
  }
};
