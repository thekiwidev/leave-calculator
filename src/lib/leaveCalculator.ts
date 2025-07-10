//@logic: Core leave calculation engine following PRD specifications
import { addDays, parseISO, format } from "date-fns";
import type {
  LeaveCalculationInput,
  LeaveCalculationResult,
  PublicHoliday,
  LeaveType,
  NotPublicHolidayDate,
} from "@/types";
import {
  isWorkingDay,
  getNextWorkingDayWithDetails,
  processPublicHolidays,
} from "@/utils/dateUtils";

/**
 * Determine number of leave days based on leave type and grade level
 * @param leaveType - Type of leave
 * @param gradeLevel - Grade level (required for vacation leave)
 * @param numberOfDays - Number of days (required for some leave types)
 * @returns Number of leave days
 */
const getLeaveEntitlement = (
  leaveType: LeaveType,
  gradeLevel?: number,
  numberOfDays?: number
): number => {
  switch (leaveType) {
    case "vacation":
      if (gradeLevel === undefined) {
        throw new Error("Grade level is required for vacation leave");
      }
      // GL 0-06: 21 working days, GL 07+: 30 working days
      return gradeLevel <= 6 ? 21 : 30;

    case "maternity":
      // Fixed duration: 112 working days
      return 112;

    case "casual":
    case "study":
    case "sick":
    case "sabbatical":
      if (numberOfDays === undefined) {
        throw new Error(`Number of days is required for ${leaveType} leave`);
      }
      return numberOfDays;

    default:
      throw new Error(`Unknown leave type: ${leaveType}`);
  }
};

/**
 * Calculate leave dates based on the PRD core logic
 * @param input - Leave calculation input parameters
 * @param publicHolidays - Array of public holidays
 * @param notPublicHolidayDates - Array of dates to exclude from holiday treatment
 * @returns Leave calculation result
 */
export const calculateLeave = (
  input: LeaveCalculationInput,
  publicHolidays: PublicHoliday[],
  notPublicHolidayDates: NotPublicHolidayDate[] = []
): LeaveCalculationResult => {
  // Process public holidays to handle weekend shifts
  const processedHolidays = processPublicHolidays(publicHolidays);

  // Filter out dates that are marked as "not public holidays"
  const notPublicHolidayDateStrings = notPublicHolidayDates.map(d => d.date);
  const filteredHolidays = processedHolidays.filter(
    holiday => !notPublicHolidayDateStrings.includes(holiday.date)
  );

  // Get the number of leave days based on leave type
  const totalLeaveDays = getLeaveEntitlement(
    input.leaveType,
    input.gradeLevel,
    input.numberOfDays
  );

  // Initialize variables for the core logic
  let currentDate = parseISO(input.startDate);
  let workingDaysCount = 0;
  const skippedHolidays: PublicHoliday[] = [];

  // Core logic: Loop while workingDaysCount < totalLeaveDays
  while (workingDaysCount < totalLeaveDays) {
    const currentDateISO = format(currentDate, "yyyy-MM-dd");

    // Check if current date is a working day
    if (isWorkingDay(currentDateISO, filteredHolidays)) {
      // It's a working day, count it
      workingDaysCount++;
    } else {
      // Check if it's a public holiday (not just weekend)
      const holiday = filteredHolidays.find((h) => h.date === currentDateISO);
      if (holiday) {
        // Add to skipped holidays list
        skippedHolidays.push(holiday);
      }
      // Note: weekends are automatically excluded by isWorkingDay but not added to skipped list
    }

    // Move to next day
    currentDate = addDays(currentDate, 1);
  }

  // At this point, currentDate is the day AFTER the leave expires
  // Leave expiration date is the day before currentDate
  const leaveExpirationDate = format(addDays(currentDate, -1), "yyyy-MM-dd");

  // Resumption date is the first working day after leave expiration
  const resumptionDetails = getNextWorkingDayWithDetails(
    leaveExpirationDate,
    filteredHolidays
  );

  return {
    leaveExpirationDate,
    resumptionDate: resumptionDetails.nextWorkingDay,
    skippedHolidays,
    totalWorkingDays: totalLeaveDays,
    resumptionAdjustment: resumptionDetails.wasAdjusted ? {
      originalDate: format(addDays(parseISO(leaveExpirationDate), 1), "yyyy-MM-dd"),
      reason: resumptionDetails.reason,
      adjustedHolidays: resumptionDetails.adjustedHolidays,
    } : undefined,
  };
};

/**
 * Validate leave calculation input
 * @param input - Input to validate
 * @returns Array of validation errors (empty if valid)
 */
export const validateLeaveInput = (input: LeaveCalculationInput): string[] => {
  const errors: string[] = [];

  // Validate start date
  if (!input.startDate) {
    errors.push("Start date is required");
  } else {
    const startDate = parseISO(input.startDate);
    if (isNaN(startDate.getTime())) {
      errors.push("Invalid start date format");
    }
  }

  // Validate leave type specific requirements
  switch (input.leaveType) {
    case "vacation":
      if (input.gradeLevel === undefined) {
        errors.push("Grade level is required for vacation leave");
      } else if (input.gradeLevel < 0 || input.gradeLevel > 17) {
        errors.push("Grade level must be between 0 and 17");
      }
      break;

    case "casual":
    case "study":
    case "sick":
    case "sabbatical":
      if (input.numberOfDays === undefined) {
        errors.push(`Number of days is required for ${input.leaveType} leave`);
      } else if (input.numberOfDays <= 0) {
        errors.push("Number of days must be greater than 0");
      } else if (input.numberOfDays > 365) {
        errors.push("Number of days cannot exceed 365");
      }
      break;

    case "maternity":
      // No additional validation needed for maternity leave
      break;

    default:
      errors.push("Invalid leave type");
  }

  return errors;
};
