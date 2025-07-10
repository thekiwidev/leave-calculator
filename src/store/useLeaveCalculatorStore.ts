//@store: Zustand store for application state management with Supabase integration
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
  saveLastUsedGL,
  saveLastSelectedLeaveType,
  loadLastUsedGL,
  loadLastSelectedLeaveType,
} from "@/utils/storage";
import {
  loadPublicHolidays,
  loadNotPublicHolidays,
  savePublicHolidays,
  saveNotPublicHolidays,
  addPublicHolidayLocally,
  addNotPublicHolidayLocally,
  removePublicHolidayLocally,
  removeNotPublicHolidayLocally,
  getPendingSyncItems,
  clearPendingSync,
  setupConnectivityListener,
  isOnline,
} from "@/utils/offlineStorage";
import {
  fetchHolidaysFromSupabase,
  addHolidayToSupabase,
  removeHolidayFromSupabase,
  removeMultipleHolidaysFromSupabase,
  syncApiHolidaysToSupabase,
  subscribeToHolidayChanges,
  addNotPublicHolidayToSupabase,
  removeNotPublicHolidayFromSupabase,
  removeMultipleNotPublicHolidaysFromSupabase,
  subscribeToNotPublicHolidayChanges,
} from "@/lib/supabaseService";

interface LeaveCalculatorState {
  // Public holidays
  publicHolidays: PublicHoliday[];
  isLoadingHolidays: boolean;
  holidayError: string | null;

  // Not public holiday dates (dates to exclude from holiday treatment)
  notPublicHolidayDates: NotPublicHolidayDate[];
  isLoadingNotPublicHolidays: boolean;
  notPublicHolidayError: string | null;

  // Leave calculation
  leaveInput: LeaveCalculationInput;
  leaveResult: LeaveCalculationResult | null;
  isCalculating: boolean;
  calculationError: string | null;

  // User preferences
  lastUsedGL: GradeLevel | null;
  lastSelectedLeaveType: LeaveType | null;

  // Real-time subscription cleanup
  unsubscribeFromHolidays: (() => void) | null;
  unsubscribeFromNotPublicHolidays: (() => void) | null;

  // Actions
  setPublicHolidays: (holidays: PublicHoliday[]) => void;
  addPublicHoliday: (holiday: PublicHoliday) => Promise<void>;
  removePublicHoliday: (date: string) => Promise<void>;
  removeMultiplePublicHolidays: (dates: string[]) => Promise<void>;
  fetchPublicHolidays: () => Promise<void>;
  initializeHolidaySubscription: () => void;
  cleanupHolidaySubscription: () => void;

  // Not public holiday actions
  setNotPublicHolidayDates: (dates: NotPublicHolidayDate[]) => void;
  addNotPublicHolidayDate: (date: NotPublicHolidayDate) => Promise<void>;
  removeNotPublicHolidayDate: (date: string) => Promise<void>;
  removeMultipleNotPublicHolidayDates: (dates: string[]) => Promise<void>;
  initializeNotPublicHolidaySubscription: () => void;
  cleanupNotPublicHolidaySubscription: () => void;

  setLeaveInput: (input: Partial<LeaveCalculationInput>) => void;
  setLeaveResult: (result: LeaveCalculationResult | null) => void;
  setCalculationError: (error: string | null) => void;
  setIsCalculating: (isCalculating: boolean) => void;

  syncPendingChanges: () => Promise<void>;
  initializeStore: () => void;
}

export const useLeaveCalculatorStore = create<LeaveCalculatorState>()(
  persist(
    (set, get) => ({
      // Initial state
      publicHolidays: loadPublicHolidays(), // Load from local storage initially
      isLoadingHolidays: false,
      holidayError: null,

      notPublicHolidayDates: loadNotPublicHolidays(), // Load from local storage initially
      isLoadingNotPublicHolidays: false,
      notPublicHolidayError: null,

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
      unsubscribeFromHolidays: null,
      unsubscribeFromNotPublicHolidays: null,

      // Actions
      setPublicHolidays: (holidays) => {
        // Sort holidays by date
        const sortedHolidays = holidays.sort((a, b) =>
          a.date.localeCompare(b.date)
        );
        set({ publicHolidays: sortedHolidays });
      },

      addPublicHoliday: async (holiday) => {
        set({ isLoadingHolidays: true, holidayError: null });

        try {
          // Save locally first
          const updatedHolidays = addPublicHolidayLocally(
            holiday,
            get().publicHolidays
          );
          set({ publicHolidays: updatedHolidays });

          // If online, sync with Supabase
          if (isOnline()) {
            await addHolidayToSupabase(holiday);
            // Update local storage to remove pending sync status
            const synced = updatedHolidays.map((h) =>
              h.date === holiday.date
                ? { ...h, pendingSync: false, action: undefined }
                : h
            );
            savePublicHolidays(synced);
            set({ publicHolidays: synced });
          }
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : "Failed to add holiday";
          set({ holidayError: errorMessage });
          throw error;
        } finally {
          set({ isLoadingHolidays: false });
        }
      },

      removePublicHoliday: async (date) => {
        set({ isLoadingHolidays: true, holidayError: null });

        try {
          // Remove locally first
          const updatedHolidays = removePublicHolidayLocally(
            date,
            get().publicHolidays
          );
          set({ publicHolidays: updatedHolidays });

          // If online, sync with Supabase
          if (isOnline()) {
            await removeHolidayFromSupabase(date);
            // Update local storage to remove pending sync status
            const synced = updatedHolidays.filter((h) => h.date !== date);
            savePublicHolidays(synced);
            set({ publicHolidays: synced });
          }
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : "Failed to remove holiday";
          set({ holidayError: errorMessage });
          throw error;
        } finally {
          set({ isLoadingHolidays: false });
        }
      },

      removeMultiplePublicHolidays: async (dates) => {
        set({ isLoadingHolidays: true, holidayError: null });

        try {
          // Remove each holiday locally first
          let updatedHolidays = get().publicHolidays;
          for (const date of dates) {
            updatedHolidays = removePublicHolidayLocally(date, updatedHolidays);
          }
          set({ publicHolidays: updatedHolidays });

          // If online, sync with Supabase
          if (isOnline()) {
            await removeMultipleHolidaysFromSupabase(dates);
            // Update local storage to remove pending sync status
            const synced = updatedHolidays.filter(
              (h) => !dates.includes(h.date)
            );
            savePublicHolidays(synced);
            set({ publicHolidays: synced });
          }
        } catch (error) {
          const errorMessage =
            error instanceof Error
              ? error.message
              : "Failed to remove holidays";
          set({ holidayError: errorMessage });
          throw error;
        } finally {
          set({ isLoadingHolidays: false });
        }
      },

      initializeHolidaySubscription: () => {
        // Clean up any existing subscription
        const { cleanupHolidaySubscription } = get();
        cleanupHolidaySubscription();

        // Set up new subscription
        const unsubscribe = subscribeToHolidayChanges((holidays) => {
          get().setPublicHolidays(holidays);
          set({ isLoadingHolidays: false, holidayError: null });
        });

        set({ unsubscribeFromHolidays: unsubscribe });
      },

      cleanupHolidaySubscription: () => {
        const { unsubscribeFromHolidays } = get();
        if (unsubscribeFromHolidays) {
          unsubscribeFromHolidays();
          set({ unsubscribeFromHolidays: null });
        }
      },

      // Not public holiday date actions
      setNotPublicHolidayDates: (dates) => {
        // Sort dates by date
        const sortedDates = dates.sort((a, b) => a.date.localeCompare(b.date));
        set({ notPublicHolidayDates: sortedDates });
      },

      addNotPublicHolidayDate: async (dateEntry) => {
        set({ isLoadingNotPublicHolidays: true, notPublicHolidayError: null });

        try {
          // Save locally first
          const updatedHolidays = addNotPublicHolidayLocally(
            dateEntry,
            get().notPublicHolidayDates
          );
          set({ notPublicHolidayDates: updatedHolidays });

          // If online, sync with Supabase
          if (isOnline()) {
            await addNotPublicHolidayToSupabase(dateEntry);
            // Update local storage to remove pending sync status
            const synced = updatedHolidays.map((h) =>
              h.date === dateEntry.date
                ? { ...h, pendingSync: false, action: undefined }
                : h
            );
            saveNotPublicHolidays(synced);
            set({ notPublicHolidayDates: synced });
          }
        } catch (error) {
          const errorMessage =
            error instanceof Error
              ? error.message
              : "Failed to add not public holiday";
          set({ notPublicHolidayError: errorMessage });
          throw error;
        } finally {
          set({ isLoadingNotPublicHolidays: false });
        }
      },

      removeNotPublicHolidayDate: async (date) => {
        set({ isLoadingNotPublicHolidays: true, notPublicHolidayError: null });

        try {
          // Remove locally first
          const updatedHolidays = removeNotPublicHolidayLocally(
            date,
            get().notPublicHolidayDates
          );
          set({ notPublicHolidayDates: updatedHolidays });

          // If online, sync with Supabase
          if (isOnline()) {
            await removeNotPublicHolidayFromSupabase(date);
            // Update local storage to remove pending sync status
            const synced = updatedHolidays.filter((h) => h.date !== date);
            saveNotPublicHolidays(synced);
            set({ notPublicHolidayDates: synced });
          }
        } catch (error) {
          const errorMessage =
            error instanceof Error
              ? error.message
              : "Failed to remove not public holiday";
          set({ notPublicHolidayError: errorMessage });
          throw error;
        } finally {
          set({ isLoadingNotPublicHolidays: false });
        }
      },

      removeMultipleNotPublicHolidayDates: async (dates) => {
        set({ isLoadingNotPublicHolidays: true, notPublicHolidayError: null });

        try {
          // Remove each holiday locally first
          let updatedHolidays = get().notPublicHolidayDates;
          for (const date of dates) {
            updatedHolidays = removeNotPublicHolidayLocally(
              date,
              updatedHolidays
            );
          }
          set({ notPublicHolidayDates: updatedHolidays });

          // If online, sync with Supabase
          if (isOnline()) {
            await removeMultipleNotPublicHolidaysFromSupabase(dates);
            // Update local storage to remove pending sync status
            const synced = updatedHolidays.filter(
              (h) => !dates.includes(h.date)
            );
            saveNotPublicHolidays(synced);
            set({ notPublicHolidayDates: synced });
          }
        } catch (error) {
          const errorMessage =
            error instanceof Error
              ? error.message
              : "Failed to remove not public holidays";
          set({ notPublicHolidayError: errorMessage });
          throw error;
        } finally {
          set({ isLoadingNotPublicHolidays: false });
        }
      },

      initializeNotPublicHolidaySubscription: () => {
        // Clean up any existing subscription
        const { cleanupNotPublicHolidaySubscription } = get();
        cleanupNotPublicHolidaySubscription();

        // Set up new subscription
        const unsubscribe = subscribeToNotPublicHolidayChanges(
          (notHolidays) => {
            get().setNotPublicHolidayDates(notHolidays);
            set({
              isLoadingNotPublicHolidays: false,
              notPublicHolidayError: null,
            });
          }
        );

        set({ unsubscribeFromNotPublicHolidays: unsubscribe });
      },

      cleanupNotPublicHolidaySubscription: () => {
        const { unsubscribeFromNotPublicHolidays } = get();
        if (unsubscribeFromNotPublicHolidays) {
          unsubscribeFromNotPublicHolidays();
          set({ unsubscribeFromNotPublicHolidays: null });
        }
      },

      fetchPublicHolidays: async () => {
        set({ isLoadingHolidays: true, holidayError: null });

        try {
          // Check if we have an API key in environment variables
          const apiKey = import.meta.env.VITE_API_NINJAS_KEY;

          if (!apiKey) {
            console.warn("API key not configured. Using Supabase data only.");
            // Just fetch from Supabase without API sync
            const holidays = await fetchHolidaysFromSupabase();
            get().setPublicHolidays(holidays);
            set({ isLoadingHolidays: false });
            return;
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
          const apiHolidays: PublicHoliday[] = data
            .map((holiday) => ({
              name: holiday.name,
              date: holiday.date,
              isManual: false, // Mark as API-sourced
            }))
            .sort((a, b) => a.date.localeCompare(b.date));

          // Sync API holidays to Supabase (this will handle duplicates)
          try {
            const newHolidaysCount = await syncApiHolidaysToSupabase(
              apiHolidays
            );
            console.log(
              `Synced ${newHolidaysCount} new holidays from API to Supabase`
            );
          } catch (syncError) {
            console.warn("Failed to sync API holidays to Supabase:", syncError);
            // Continue execution - we can still use existing Supabase data
          }

          // The real-time subscription will automatically update our state
          set({
            isLoadingHolidays: false,
            holidayError: null,
          });
        } catch (error) {
          console.error("Failed to fetch public holidays:", error);

          // Fall back to Supabase data only
          try {
            const holidays = await fetchHolidaysFromSupabase();
            get().setPublicHolidays(holidays);
          } catch (supabaseError) {
            console.error("Failed to fetch from Supabase:", supabaseError);
          }

          set({
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

      // Sync pending changes when online
      syncPendingChanges: async () => {
        if (!isOnline()) return;

        const { publicHolidays, notPublicHolidays } = getPendingSyncItems();

        // Sync public holidays
        for (const holiday of publicHolidays) {
          try {
            if (holiday.action === "add") {
              await addHolidayToSupabase(holiday);
            } else if (holiday.action === "delete") {
              await removeHolidayFromSupabase(holiday.date);
            }
          } catch (error) {
            console.error("Failed to sync holiday:", holiday, error);
          }
        }

        // Sync not public holidays
        for (const holiday of notPublicHolidays) {
          try {
            if (holiday.action === "add") {
              await addNotPublicHolidayToSupabase(holiday);
            } else if (holiday.action === "delete") {
              await removeNotPublicHolidayFromSupabase(holiday.date);
            }
          } catch (error) {
            console.error("Failed to sync not public holiday:", holiday, error);
          }
        }

        // Clear sync flags for successfully synced items
        clearPendingSync(
          publicHolidays.map((h) => h.date),
          notPublicHolidays.map((h) => h.date)
        );
      },

      initializeStore: () => {
        // Load user preferences from localStorage
        const savedGL = loadLastUsedGL();
        const savedLeaveType = loadLastSelectedLeaveType();

        set({
          lastUsedGL: savedGL,
          lastSelectedLeaveType: savedLeaveType,
          leaveInput: {
            leaveType: savedLeaveType || "vacation",
            startDate: "",
            gradeLevel: savedGL || undefined,
            numberOfDays: undefined,
          },
        });

        // Initialize real-time subscriptions if online
        if (isOnline()) {
          get().initializeHolidaySubscription();
          get().initializeNotPublicHolidaySubscription();
          // Sync any pending changes
          get().syncPendingChanges();
        }

        // Setup online/offline event listeners
        const cleanup = setupConnectivityListener(() => {
          if (isOnline()) {
            get().initializeHolidaySubscription();
            get().initializeNotPublicHolidaySubscription();
            get().syncPendingChanges();
            get().fetchPublicHolidays();
          }
        });

        // Store cleanup function
        set({ unsubscribeFromHolidays: cleanup });

        // Fetch fresh holidays from API if online
        if (isOnline()) {
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
