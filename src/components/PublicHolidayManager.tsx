//@component: Public holiday management interface with collapsible sections
import { useState } from "react";
import { useLeaveCalculatorStore } from "@/store/useLeaveCalculatorStore";
import { formatDate, getTodayISO } from "@/utils/dateUtils";
import {
  Plus,
  Trash2,
  RefreshCw,
  Calendar,
  AlertCircle,
  CheckCircle,
  Loader,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import type { PublicHoliday } from "@/types";

export function PublicHolidayManager() {
  const {
    publicHolidays,
    isLoadingHolidays,
    holidayError,
    addPublicHoliday,
    removePublicHoliday,
    fetchPublicHolidays,
  } = useLeaveCalculatorStore();

  const [showAddForm, setShowAddForm] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [newHoliday, setNewHoliday] = useState<PublicHoliday>({
    name: "",
    date: "",
  });
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // Handle adding a new holiday
  const handleAddHoliday = () => {
    if (!newHoliday.name.trim() || !newHoliday.date) {
      return;
    }

    addPublicHoliday({
      name: newHoliday.name.trim(),
      date: newHoliday.date,
    });

    // Reset form
    setNewHoliday({ name: "", date: "" });
    setShowAddForm(false);
  };

  // Handle removing a holiday
  const handleRemoveHoliday = (date: string) => {
    if (deleteConfirm === date) {
      removePublicHoliday(date);
      setDeleteConfirm(null);
    } else {
      setDeleteConfirm(date);
      // Auto-clear confirmation after 3 seconds
      setTimeout(() => setDeleteConfirm(null), 3000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Collapsible Header with Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="flex items-center text-left hover:bg-gray-50 p-2 rounded-md transition-colors"
        >
          {isCollapsed ? (
            <ChevronDown className="w-5 h-5 text-gray-400 mr-2" />
          ) : (
            <ChevronUp className="w-5 h-5 text-gray-400 mr-2" />
          )}
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Public Holidays ({publicHolidays.length})
            </h3>
            <p className="text-sm text-gray-600">
              {isCollapsed ? "Click to expand" : "Manage the public holidays used in leave calculations"}
            </p>
          </div>
        </button>

        {!isCollapsed && (
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="flex items-center px-3 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Holiday
            </button>

            <button
              onClick={fetchPublicHolidays}
              disabled={isLoadingHolidays}
              className="flex items-center px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoadingHolidays ? (
                <Loader className="w-4 h-4 mr-1 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4 mr-1" />
              )}
              Refresh
            </button>
          </div>
        )}
      </div>

      {!isCollapsed && (
        <>
          {/* API Error Alert */}
          {holidayError && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
              <div className="flex">
                <AlertCircle className="w-5 h-5 text-yellow-400 mt-0.5 mr-2" />
                <div>
                  <h4 className="text-sm font-medium text-yellow-800">
                    API Notice
                  </h4>
                  <p className="text-sm text-yellow-700 mt-1">
                    {holidayError}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Add Holiday Form */}
          {showAddForm && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-900 mb-3">
                Add New Public Holiday
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Holiday Name
                  </label>
                  <input
                    type="text"
                    value={newHoliday.name}
                    onChange={(e) =>
                      setNewHoliday({ ...newHoliday, name: e.target.value })
                    }
                    placeholder="e.g., Independence Day"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    value={newHoliday.date}
                    min={getTodayISO()}
                    onChange={(e) =>
                      setNewHoliday({ ...newHoliday, date: e.target.value })
                    }
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-3">
                <button
                  onClick={() => setShowAddForm(false)}
                  className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddHoliday}
                  disabled={!newHoliday.name.trim() || !newHoliday.date}
                  className="px-3 py-1 bg-green-600 text-white text-sm font-medium rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Add
                </button>
              </div>
            </div>
          )}

          {/* Holidays List */}
          <div className="bg-white border border-gray-200 rounded-lg">
            {publicHolidays.length === 0 ? (
              <div className="p-6 text-center">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <h4 className="text-lg font-medium text-gray-900 mb-2">
                  No Public Holidays
                </h4>
                <p className="text-gray-600">
                  Add holidays manually or refresh to fetch from the API.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {publicHolidays.map((holiday, index) => (
                  <div
                    key={`${holiday.date}-${index}`}
                    className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      </div>
                      <div>
                        <h5 className="text-sm font-medium text-gray-900">
                          {holiday.name}
                        </h5>
                        <p className="text-xs text-gray-500">
                          {formatDate(holiday.date)}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleRemoveHoliday(holiday.date)}
                      className={`flex items-center px-2 py-1 text-xs font-medium rounded transition-colors ${
                        deleteConfirm === holiday.date
                          ? "bg-red-100 text-red-800 hover:bg-red-200"
                          : "text-gray-400 hover:text-red-600 hover:bg-red-50"
                      }`}
                      title={
                        deleteConfirm === holiday.date
                          ? "Click again to confirm"
                          : "Delete holiday"
                      }
                    >
                      {deleteConfirm === holiday.date ? (
                        <>
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Confirm
                        </>
                      ) : (
                        <Trash2 className="w-3 h-3" />
                      )}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Loading State */}
          {isLoadingHolidays && (
            <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
              <div className="flex items-center">
                <Loader className="w-5 h-5 text-blue-600 mr-2 animate-spin" />
                <p className="text-sm text-blue-800">
                  Fetching public holidays from API...
                </p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
