//@component: Display leave calculation results
import { useLeaveCalculatorStore } from "@/store/useLeaveCalculatorStore";
import { formatDateWithDay } from "@/utils/dateUtils";
import { Calendar, Clock, MapPin } from "lucide-react";

// Shadcn/UI imports
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function LeaveResults() {
  const { leaveResult } = useLeaveCalculatorStore();

  if (!leaveResult) {
    return (
      <div className="hidden md:block">
        {" "}
        {/* Hide on mobile, show on desktop */}
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6 text-center">
            <Calendar className="w-12 h-12 text-muted-foreground mb-3" />
            <CardTitle className="mb-2">No Calculation Yet</CardTitle>
            <p className="text-muted-foreground">
              Fill in the leave details and click "Calculate Leave" to see your
              results.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="text-base font-semibold mb-4">
        Leave Calculation Results
      </h3>

      {/* Key Dates */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-3">
        {/* Make it width-aware for better responsiveness */}
        <Card className="border-red-200 bg-red-50 p-0">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Clock className="w-5 h-5 text-red-600" />
              <div>
                <h4 className="text-sm font-medium text-red-800">
                  Leave Expiration Date
                </h4>
                <p className="text-base font-semibold text-red-900">
                  {formatDateWithDay(leaveResult.leaveExpirationDate)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200 bg-blue-50 p-0">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Calendar className="w-5 h-5 text-blue-600" />
              <div className="flex-1">
                <h4 className="text-sm font-medium text-blue-800">
                  Resumption Date
                </h4>
                <p className="text-base font-semibold text-blue-900">
                  {formatDateWithDay(leaveResult.resumptionDate)}
                </p>
                {leaveResult.resumptionAdjustment &&
                  leaveResult.resumptionAdjustment.adjustedHolidays.length >
                    0 && (
                    <p className="text-xs text-blue-700 mt-1">
                      Adjusted from{" "}
                      {formatDateWithDay(
                        leaveResult.resumptionAdjustment.originalDate
                      )}{" "}
                      due to {leaveResult.resumptionAdjustment.reason}
                    </p>
                  )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-green-50 p-0">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <MapPin className="w-5 h-5 text-green-600" />
              <div>
                <h4 className="text-sm font-medium text-green-800">
                  Total Working Days
                </h4>
                <p className="text-base font-semibold text-green-900">
                  {leaveResult.totalWorkingDays} days
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Skipped Public Holidays - Only show if there are holidays */}
      {leaveResult.skippedHolidays.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              Public Holidays During Leave{" "}
              <Badge variant="secondary" className="ml-2">
                {leaveResult.skippedHolidays.length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {leaveResult.skippedHolidays.map((holiday, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center py-2 border-b last:border-b-0"
                >
                  <span className="font-medium">{holiday.name}</span>
                  <Badge variant="outline">
                    {formatDateWithDay(holiday.date)}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Resumption Date Adjustment Details */}
      {leaveResult.resumptionAdjustment &&
        leaveResult.resumptionAdjustment.adjustedHolidays.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                Resumption Date Adjustment{" "}
                <Badge variant="outline" className="ml-2">
                  {leaveResult.resumptionAdjustment.adjustedHolidays.length}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">
                Your resumption date was moved from{" "}
                {formatDateWithDay(
                  leaveResult.resumptionAdjustment.originalDate
                )}
                to {formatDateWithDay(leaveResult.resumptionDate)} due to the
                following:
              </p>
              <div className="space-y-2">
                {leaveResult.resumptionAdjustment.adjustedHolidays.map(
                  (holiday, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center py-2 border-b last:border-b-0"
                    >
                      <span className="font-medium">{holiday.name}</span>
                      <Badge variant="outline">
                        {formatDateWithDay(holiday.date)}
                      </Badge>
                    </div>
                  )
                )}
              </div>
            </CardContent>
          </Card>
        )}
    </div>
  );
}
