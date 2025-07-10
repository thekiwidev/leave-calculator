//@component: Display leave calculation results
import { useLeaveCalculatorStore } from "@/store/useLeaveCalculatorStore";
import { formatDate } from "@/utils/dateUtils";
import { Calendar, Clock, MapPin } from "lucide-react";

export function LeaveResults() {
  const { leaveResult } = useLeaveCalculatorStore();

  if (!leaveResult) {
    return (
      <div className="bg-gray-50 rounded-lg p-6 text-center">
        <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No Calculation Yet
        </h3>
        <p className="text-gray-600">
          Fill in the leave details and click "Calculate Leave" to see your
          results.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Leave Calculation Results
      </h3>

      {/* Key Dates */}
      <div className="space-y-4">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <Clock className="w-5 h-5 text-green-600 mr-3" />
            <div>
              <h4 className="text-sm font-medium text-green-800">
                Leave Expiration Date
              </h4>
              <p className="text-lg font-semibold text-green-900">
                {formatDate(leaveResult.leaveExpirationDate)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center">
            <Calendar className="w-5 h-5 text-blue-600 mr-3" />
            <div>
              <h4 className="text-sm font-medium text-blue-800">
                Resumption Date
              </h4>
              <p className="text-lg font-semibold text-blue-900">
                {formatDate(leaveResult.resumptionDate)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <div className="flex items-center">
            <MapPin className="w-5 h-5 text-gray-600 mr-3" />
            <div>
              <h4 className="text-sm font-medium text-gray-800">
                Total Working Days
              </h4>
              <p className="text-lg font-semibold text-gray-900">
                {leaveResult.totalWorkingDays} days
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Skipped Public Holidays */}
      {leaveResult.skippedHolidays.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-yellow-800 mb-3">
            Public Holidays Skipped ({leaveResult.skippedHolidays.length})
          </h4>
          <div className="space-y-2">
            {leaveResult.skippedHolidays.map((holiday, index) => (
              <div
                key={index}
                className="flex justify-between items-center text-sm"
              >
                <span className="text-yellow-900 font-medium">
                  {holiday.name}
                </span>
                <span className="text-yellow-700">
                  {formatDate(holiday.date)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No Holidays Skipped */}
      {leaveResult.skippedHolidays.length === 0 && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            Public Holidays Skipped
          </h4>
          <p className="text-sm text-gray-600">
            No public holidays fall within your leave period.
          </p>
        </div>
      )}
    </div>
  );
}
