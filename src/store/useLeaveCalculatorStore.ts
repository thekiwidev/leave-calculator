//@store: Zustand store for application state management
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  PublicHoliday,
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
  fetchPublicHolidays: () => Promise<void>;

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
        set({ publicHolidays: holidays });
        savePublicHolidays(holidays);
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

        const newHolidays = [...currentHolidays, holiday].sort((a, b) =>
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
            }))
            .sort((a, b) => a.date.localeCompare(b.date));

          set({
            publicHolidays: holidays,
            isLoadingHolidays: false,
            holidayError: null,
          });
          savePublicHolidays(holidays);
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

        set({
          publicHolidays: savedHolidays,
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
