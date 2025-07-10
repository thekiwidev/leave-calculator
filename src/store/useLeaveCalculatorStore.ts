//@store: Zustand store for application state management
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  PublicHoliday,
  NotPublicHolidayDate,
  LeaveType,
  GradeLevel,
  LeaveCalculationInput,
  LeaveCalculationResult,
  ApiHolidayResponse,
} from "@/types";
import {
  savePublicHolidays,
  loadPublicHolidays,
  saveLastUsedGL,
  saveLastSelectedLeaveType,
  loadLastUsedGL,
  loadLastSelectedLeaveType,
} from "@/utils/storage";

interface LeaveCalculatorState {
  // Public holidays
  publicHolidays: PublicHoliday[];
  isLoadingHolidays: boolean;
  holidayError: string | null;

  // Not public holiday dates (dates to exclude from holiday treatment)
  notPublicHolidayDates: NotPublicHolidayDate[];

  // Leave calculation
  leaveInput: LeaveCalculationInput;
  leaveResult: LeaveCalculationResult | null;
  isCalculating: boolean;
  calculationError: string | null;

  // User preferences
  lastUsedGL: GradeLevel | null;
  lastSelectedLeaveType: LeaveType | null;

  // Actions
  setPublicHolidays: (holidays: PublicHoliday[]) => void;
  addPublicHoliday: (holiday: PublicHoliday) => void;
  removePublicHoliday: (date: string) => void;
  removeMultiplePublicHolidays: (dates: string[]) => void;
  fetchPublicHolidays: () => Promise<void>;

  // Not public holiday actions
  addNotPublicHolidayDate: (date: NotPublicHolidayDate) => void;
  removeNotPublicHolidayDate: (date: string) => void;

  setLeaveInput: (input: Partial<LeaveCalculationInput>) => void;
  setLeaveResult: (result: LeaveCalculationResult | null) => void;
  setCalculationError: (error: string | null) => void;
  setIsCalculating: (isCalculating: boolean) => void;

  initializeStore: () => void;
}

export const useLeaveCalculatorStore = create<LeaveCalculatorState>()(
  persist(
    (set, get) => ({
      // Initial state
      publicHolidays: [],
      isLoadingHolidays: false,
      holidayError: null,

      notPublicHolidayDates: [],

      leaveInput: {
        leaveType: "vacation",
        startDate: "",
        gradeLevel: undefined,
        numberOfDays: undefined,
      },
      leaveResult: null,
      isCalculating: false,
      calculationError: null,

      lastUsedGL: null,
      lastSelectedLeaveType: null,

      // Actions
      setPublicHolidays: (holidays) => {
        // Preserve manually added holidays
        const currentHolidays = get().publicHolidays;
        const manualHolidays = currentHolidays.filter((h) => h.isManual);

        // Merge API holidays with manual holidays, avoiding duplicates
        const apiHolidays = holidays.filter((h) => !h.isManual);
        const allHolidays = [...manualHolidays];

        apiHolidays.forEach((apiHoliday) => {
          const exists = allHolidays.some((h) => h.date === apiHoliday.date);
          if (!exists) {
            allHolidays.push(apiHoliday);
          }
        });

        const sortedHolidays = allHolidays.sort((a, b) =>
          a.date.localeCompare(b.date)
        );

        set({ publicHolidays: sortedHolidays });
        savePublicHolidays(sortedHolidays);
      },

      addPublicHoliday: (holiday) => {
        const currentHolidays = get().publicHolidays;

        // Check for duplicate dates
        const isDuplicate = currentHolidays.some(
          (h) => h.date === holiday.date
        );
        if (isDuplicate) {
          set({ holidayError: "A holiday already exists on this date" });
          return;
        }

        const newHoliday = { ...holiday, isManual: true };
        const newHolidays = [...currentHolidays, newHoliday].sort((a, b) =>
          a.date.localeCompare(b.date)
        );

        set({
          publicHolidays: newHolidays,
          holidayError: null,
        });
        savePublicHolidays(newHolidays);
      },

      removePublicHoliday: (date) => {
        const currentHolidays = get().publicHolidays;
        const newHolidays = currentHolidays.filter((h) => h.date !== date);

        set({ publicHolidays: newHolidays });
        savePublicHolidays(newHolidays);
      },

      removeMultiplePublicHolidays: (dates) => {
        const currentHolidays = get().publicHolidays;
        const newHolidays = currentHolidays.filter(
          (h) => !dates.includes(h.date)
        );

        set({ publicHolidays: newHolidays });
        savePublicHolidays(newHolidays);
      },

      // Not public holiday date actions
      addNotPublicHolidayDate: (dateEntry) => {
        const currentDates = get().notPublicHolidayDates;

        // Check for duplicate dates
        const isDuplicate = currentDates.some((d) => d.date === dateEntry.date);
        if (isDuplicate) {
          set({ holidayError: "This date is already in the exclusion list" });
          return;
        }

        const newDates = [...currentDates, dateEntry].sort((a, b) =>
          a.date.localeCompare(b.date)
        );

        set({
          notPublicHolidayDates: newDates,
          holidayError: null,
        });
        // Save to localStorage
        localStorage.setItem("notPublicHolidayDates", JSON.stringify(newDates));
      },

      removeNotPublicHolidayDate: (date) => {
        const currentDates = get().notPublicHolidayDates;
        const newDates = currentDates.filter((d) => d.date !== date);

        set({ notPublicHolidayDates: newDates });
        // Save to localStorage
        localStorage.setItem("notPublicHolidayDates", JSON.stringify(newDates));
      },

      fetchPublicHolidays: async () => {
        set({ isLoadingHolidays: true, holidayError: null });

        try {
          // Check if we have an API key in environment variables
          const apiKey = import.meta.env.VITE_API_NINJAS_KEY;

          if (!apiKey) {
            throw new Error("API key not configured. Using local data only.");
          }

          const response = await fetch(
            "https://api.api-ninjas.com/v1/publicholidays?country=Nigeria",
            {
              headers: {
                "X-Api-Key": apiKey,
              },
            }
          );

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data: ApiHolidayResponse[] = await response.json();

          // Transform API response to our format
          const holidays: PublicHoliday[] = data
            .map((holiday) => ({
              name: holiday.name,
              date: holiday.date,
              isManual: false, // Mark as API-sourced
            }))
            .sort((a, b) => a.date.localeCompare(b.date));

          // Use setPublicHolidays to preserve manual holidays
          const { setPublicHolidays } = get();
          setPublicHolidays(holidays);

          set({
            isLoadingHolidays: false,
            holidayError: null,
          });
        } catch (error) {
          console.error("Failed to fetch public holidays:", error);

          // Fall back to local data
          const localHolidays = loadPublicHolidays();
          set({
            publicHolidays: localHolidays,
            isLoadingHolidays: false,
            holidayError:
              error instanceof Error
                ? error.message
                : "Failed to fetch holidays",
          });
        }
      },

      setLeaveInput: (input) => {
        const currentInput = get().leaveInput;
        const newInput = { ...currentInput, ...input };

        set({ leaveInput: newInput });

        // Save user preferences
        if (input.gradeLevel !== undefined) {
          set({ lastUsedGL: input.gradeLevel });
          saveLastUsedGL(input.gradeLevel);
        }
        if (input.leaveType !== undefined) {
          set({ lastSelectedLeaveType: input.leaveType });
          saveLastSelectedLeaveType(input.leaveType);
        }
      },

      setLeaveResult: (result) => {
        set({ leaveResult: result });
      },

      setCalculationError: (error) => {
        set({ calculationError: error });
      },

      setIsCalculating: (isCalculating) => {
        set({ isCalculating });
      },

      initializeStore: () => {
        // Load data from localStorage
        const savedHolidays = loadPublicHolidays();
        const savedGL = loadLastUsedGL();
        const savedLeaveType = loadLastSelectedLeaveType();

        // Load not public holiday dates
        const savedNotPublicDates = JSON.parse(
          localStorage.getItem("notPublicHolidayDates") || "[]"
        );

        set({
          publicHolidays: savedHolidays,
          notPublicHolidayDates: savedNotPublicDates,
          lastUsedGL: savedGL,
          lastSelectedLeaveType: savedLeaveType,
          leaveInput: {
            leaveType: savedLeaveType || "vacation",
            startDate: "",
            gradeLevel: savedGL || undefined,
            numberOfDays: undefined,
          },
        });

        // Fetch fresh holidays if we don't have any
        if (savedHolidays.length === 0) {
          get().fetchPublicHolidays();
        }
      },
    }),
    {
      name: "leave-calculator-store",
      // Only persist user preferences, not the entire state
      partialize: (state) => ({
        lastUsedGL: state.lastUsedGL,
        lastSelectedLeaveType: state.lastSelectedLeaveType,
      }),
    }
  )
);
