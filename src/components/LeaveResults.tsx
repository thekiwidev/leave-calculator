//@component: Display leave calculation results
import { useLeaveCalculatorStore } from "@/store/useLeaveCalculatorStore";
import { formatDate } from "@/utils/dateUtils";
import { Calendar, Clock, MapPin } from "lucide-react";

// Shadcn/UI imports
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function LeaveResults() {
  const { leaveResult } = useLeaveCalculatorStore();

  if (!leaveResult) {
    return (
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
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold mb-4">Leave Calculation Results</h3>

      {/* Key Dates */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-red-200 bg-red-50 p-0">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Clock className="w-5 h-5 text-red-600" />
              <div>
                <h4 className="text-sm font-medium text-red-800">
                  Leave Expiration Date
                </h4>
                <p className="text-lg font-semibold text-red-900">
                  {formatDate(leaveResult.leaveExpirationDate)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200 bg-blue-50 p-0">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Calendar className="w-5 h-5 text-blue-600" />
              <div>
                <h4 className="text-sm font-medium text-blue-800">
                  Resumption Date
                </h4>
                <p className="text-lg font-semibold text-blue-900">
                  {formatDate(leaveResult.resumptionDate)}
                </p>
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
                <p className="text-lg font-semibold text-green-900">
                  {leaveResult.totalWorkingDays} days
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Skipped Public Holidays */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            Public Holidays{" "}
            <Badge variant="secondary" className="ml-2">
              {leaveResult.skippedHolidays.length}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {leaveResult.skippedHolidays.length > 0 ? (
            <div className="space-y-2">
              {leaveResult.skippedHolidays.map((holiday, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center py-2 border-b last:border-b-0"
                >
                  <span className="font-medium">{holiday.name}</span>
                  <Badge variant="outline">{formatDate(holiday.date)}</Badge>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">
              No public holidays fall within your leave period.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
