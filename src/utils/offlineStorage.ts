//@utils: Offline storage management for holidays
import type { PublicHoliday, NotPublicHolidayDate } from "@/types";

const STORAGE_KEYS = {
  PUBLIC_HOLIDAYS: "public-holidays-offline",
  NOT_PUBLIC_HOLIDAYS: "not-public-holidays-offline",
  PENDING_SYNC: "pending-sync-actions",
} as const;

// Helper to check if we're online
export const isOnline = () => navigator.onLine;

// Load holidays from local storage
export const loadPublicHolidays = (): PublicHoliday[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.PUBLIC_HOLIDAYS);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Failed to load public holidays from storage:", error);
    return [];
  }
};

// Save holidays to local storage
export const savePublicHolidays = (holidays: PublicHoliday[]) => {
  try {
    localStorage.setItem(
      STORAGE_KEYS.PUBLIC_HOLIDAYS,
      JSON.stringify(holidays)
    );
  } catch (error) {
    console.error("Failed to save public holidays to storage:", error);
  }
};

// Load not public holidays from local storage
export const loadNotPublicHolidays = (): NotPublicHolidayDate[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.NOT_PUBLIC_HOLIDAYS);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Failed to load not public holidays from storage:", error);
    return [];
  }
};

// Save not public holidays to local storage
export const saveNotPublicHolidays = (holidays: NotPublicHolidayDate[]) => {
  try {
    localStorage.setItem(
      STORAGE_KEYS.NOT_PUBLIC_HOLIDAYS,
      JSON.stringify(holidays)
    );
  } catch (error) {
    console.error("Failed to save not public holidays to storage:", error);
  }
};

// Check for duplicates in public holidays
export const isDuplicatePublicHoliday = (
  date: string,
  holidays: PublicHoliday[]
): boolean => {
  return holidays.some((h) => h.date === date && !h.action);
};

// Check for duplicates in not public holidays
export const isDuplicateNotPublicHoliday = (
  date: string,
  holidays: NotPublicHolidayDate[]
): boolean => {
  return holidays.some((h) => h.date === date && !h.action);
};

// Add a public holiday locally
export const addPublicHolidayLocally = (
  holiday: PublicHoliday,
  existingHolidays: PublicHoliday[]
): PublicHoliday[] => {
  if (isDuplicatePublicHoliday(holiday.date, existingHolidays)) {
    throw new Error("A holiday with this date already exists");
  }

  const newHolidays: PublicHoliday[] = [
    ...existingHolidays,
    {
      ...holiday,
      pendingSync: !isOnline(),
      action: "add" as const,
    },
  ].sort((a, b) => a.date.localeCompare(b.date));

  savePublicHolidays(newHolidays);
  return newHolidays;
};

// Add a not public holiday locally
export const addNotPublicHolidayLocally = (
  holiday: NotPublicHolidayDate,
  existingHolidays: NotPublicHolidayDate[]
): NotPublicHolidayDate[] => {
  if (isDuplicateNotPublicHoliday(holiday.date, existingHolidays)) {
    throw new Error("A not public holiday with this date already exists");
  }

  const newHolidays: NotPublicHolidayDate[] = [
    ...existingHolidays,
    {
      ...holiday,
      pendingSync: !isOnline(),
      action: "add" as const,
    },
  ].sort((a, b) => a.date.localeCompare(b.date));

  saveNotPublicHolidays(newHolidays);
  return newHolidays;
};

// Remove a public holiday locally
export const removePublicHolidayLocally = (
  date: string,
  existingHolidays: PublicHoliday[]
): PublicHoliday[] => {
  const holidayToRemove = existingHolidays.find((h) => h.date === date);

  if (!holidayToRemove) return existingHolidays;

  const newHolidays = existingHolidays.filter((h) => h.date !== date);

  // If the holiday was pending sync for add, just remove it
  // Otherwise mark it for deletion sync
  if (!holidayToRemove.pendingSync || holidayToRemove.action !== "add") {
    newHolidays.push({
      ...holidayToRemove,
      pendingSync: !isOnline(),
      action: "delete" as const,
    });
  }

  savePublicHolidays(newHolidays);
  return newHolidays;
};

// Remove a not public holiday locally
export const removeNotPublicHolidayLocally = (
  date: string,
  existingHolidays: NotPublicHolidayDate[]
): NotPublicHolidayDate[] => {
  const holidayToRemove = existingHolidays.find((h) => h.date === date);

  if (!holidayToRemove) return existingHolidays;

  const newHolidays = existingHolidays.filter((h) => h.date !== date);

  // If the holiday was pending sync for add, just remove it
  // Otherwise mark it for deletion sync
  if (!holidayToRemove.pendingSync || holidayToRemove.action !== "add") {
    newHolidays.push({
      ...holidayToRemove,
      pendingSync: !isOnline(),
      action: "delete" as const,
    });
  }

  saveNotPublicHolidays(newHolidays);
  return newHolidays;
};

// Get pending sync items
export const getPendingSyncItems = () => {
  const publicHolidays = loadPublicHolidays().filter((h) => h.pendingSync);
  const notPublicHolidays = loadNotPublicHolidays().filter(
    (h) => h.pendingSync
  );
  return { publicHolidays, notPublicHolidays };
};

// Merge online and offline data
export const mergeHolidayData = <
  T extends PublicHoliday | NotPublicHolidayDate
>(
  onlineData: T[],
  offlineData: T[]
): T[] => {
  const merged = [...onlineData];

  // Apply offline changes
  offlineData.forEach((offlineItem) => {
    if (!offlineItem.pendingSync) return;

    if (offlineItem.action === "add") {
      if (!merged.some((item) => item.date === offlineItem.date)) {
        merged.push(offlineItem);
      }
    } else if (offlineItem.action === "delete") {
      const index = merged.findIndex((item) => item.date === offlineItem.date);
      if (index !== -1) {
        merged.splice(index, 1);
      }
    }
  });

  return merged.sort((a, b) => a.date.localeCompare(b.date));
};

// Clear pending sync status for items
export const clearPendingSync = (
  publicHolidayDates: string[] = [],
  notPublicHolidayDates: string[] = []
) => {
  // Clear public holidays pending status
  const publicHolidays = loadPublicHolidays()
    .filter((h) => {
      // Remove items that were pending deletion and are now synced
      return !(
        h.pendingSync &&
        h.action === "delete" &&
        publicHolidayDates.includes(h.date)
      );
    })
    .map((h) => ({
      ...h,
      pendingSync: publicHolidayDates.includes(h.date) ? false : h.pendingSync,
      action: publicHolidayDates.includes(h.date) ? undefined : h.action,
    }));
  savePublicHolidays(publicHolidays);

  // Clear not public holidays pending status
  const notPublicHolidays = loadNotPublicHolidays()
    .filter((h) => {
      // Remove items that were pending deletion and are now synced
      return !(
        h.pendingSync &&
        h.action === "delete" &&
        notPublicHolidayDates.includes(h.date)
      );
    })
    .map((h) => ({
      ...h,
      pendingSync: notPublicHolidayDates.includes(h.date)
        ? false
        : h.pendingSync,
      action: notPublicHolidayDates.includes(h.date) ? undefined : h.action,
    }));
  saveNotPublicHolidays(notPublicHolidays);
};

// Event listener for online/offline status
export const setupConnectivityListener = (callback: () => void) => {
  window.addEventListener("online", callback);
  window.addEventListener("offline", callback);

  return () => {
    window.removeEventListener("online", callback);
    window.removeEventListener("offline", callback);
  };
};
