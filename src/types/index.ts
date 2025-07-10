//@types: Core type definitions for the leave calculator application

/**
 * Represents a public holiday with name and date
 */
export interface PublicHoliday {
  name: string;
  date: string; // ISO 8601 format (YYYY-MM-DD)
}

/**
 * Available leave types in the system
 */
export type LeaveType =
  | "vacation"
  | "maternity"
  | "casual"
  | "study"
  | "sick"
  | "sabbatical";

/**
 * Grade levels for vacation/annual leave calculation
 */
export type GradeLevel = number; // 0-17

/**
 * Leave calculation input parameters
 */
export interface LeaveCalculationInput {
  leaveType: LeaveType;
  startDate: string; // ISO 8601 format (YYYY-MM-DD)
  gradeLevel?: GradeLevel; // Required for vacation leave
  numberOfDays?: number; // Required for casual, study, sick, sabbatical
}

/**
 * Leave calculation result
 */
export interface LeaveCalculationResult {
  leaveExpirationDate: string; // ISO 8601 format (YYYY-MM-DD)
  resumptionDate: string; // ISO 8601 format (YYYY-MM-DD)
  skippedHolidays: PublicHoliday[];
  totalWorkingDays: number;
}

/**
 * API response structure from api-ninjas.com
 */
export interface ApiHolidayResponse {
  name: string;
  local_name: string;
  date: string;
  country: string;
  year: number;
  regions: string[];
  federal: boolean;
}

/**
 * Local storage data model
 */
export interface LocalStorageData {
  publicHolidays: PublicHoliday[];
  lastUsedGL: GradeLevel | null;
  lastSelectedLeaveType: LeaveType | null;
}
