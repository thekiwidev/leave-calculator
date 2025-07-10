//@component: Leave calculator form for input parameters
import { useState } from "react";
import { useLeaveCalculatorStore } from "@/store/useLeaveCalculatorStore";
import { calculateLeave, validateLeaveInput } from "@/lib/leaveCalculator";
import { Calculator, AlertCircle } from "lucide-react";
import type { LeaveType, GradeLevel } from "@/types";

// Shadcn/UI imports
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";

export function LeaveCalculatorForm() {
  const {
    leaveInput,
    publicHolidays,
    setLeaveInput,
    setLeaveResult,
    setCalculationError,
    setIsCalculating,
    isCalculating,
    calculationError,
  } = useLeaveCalculatorStore();

  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // Handle form submission
  const handleCalculate = () => {
    // Validate input
    const errors = validateLeaveInput(leaveInput);
    setValidationErrors(errors);

    if (errors.length > 0) {
      setCalculationError("Please fix the validation errors below");
      return;
    }

    setIsCalculating(true);
    setCalculationError(null);

    try {
      // Perform calculation
      const result = calculateLeave(leaveInput, publicHolidays);
      setLeaveResult(result);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Calculation failed";
      setCalculationError(errorMessage);
      setLeaveResult(null);
    } finally {
      setIsCalculating(false);
    }
  };

  // Handle leave type change
  const handleLeaveTypeChange = (leaveType: LeaveType) => {
    setLeaveInput({
      leaveType,
      // Reset conditional fields when changing leave type
      gradeLevel: leaveType === "vacation" ? leaveInput.gradeLevel : undefined,
      numberOfDays:
        leaveType !== "vacation" && leaveType !== "maternity"
          ? leaveInput.numberOfDays
          : undefined,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Leave Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Leave Type Selection */}
        <div className="space-y-2">
          <Label htmlFor="leave-type">Leave Type</Label>
          <Select
            value={leaveInput.leaveType}
            onValueChange={(value) => handleLeaveTypeChange(value as LeaveType)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select leave type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="vacation">Vacation/Annual Leave</SelectItem>
              <SelectItem value="maternity">Maternity Leave</SelectItem>
              <SelectItem value="casual">Casual Leave</SelectItem>
              <SelectItem value="study">Study Leave</SelectItem>
              <SelectItem value="sick">Sick Leave</SelectItem>
              <SelectItem value="sabbatical">Sabbatical Leave</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Grade Level (for vacation leave) */}
        {leaveInput.leaveType === "vacation" && (
          <div className="space-y-2">
            <Label htmlFor="grade-level">Grade Level (GL)</Label>
            <Select
              value={leaveInput.gradeLevel?.toString() || ""}
              onValueChange={(value) =>
                setLeaveInput({
                  gradeLevel: parseInt(value, 10) as GradeLevel,
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Grade Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3">GL 01 - 06 (21 working days)</SelectItem>
                <SelectItem value="7">GL 07 - 17 (30 working days)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Number of Days (for other leave types) */}
        {leaveInput.leaveType !== "vacation" &&
          leaveInput.leaveType !== "maternity" && (
            <div className="space-y-2">
              <Label htmlFor="number-of-days">Number of Days</Label>
              <Input
                id="number-of-days"
                type="number"
                min="1"
                max="365"
                value={leaveInput.numberOfDays || ""}
                onChange={(e) =>
                  setLeaveInput({ numberOfDays: parseInt(e.target.value, 10) })
                }
                placeholder="Enter number of days"
              />
            </div>
          )}

        {/* Maternity Leave Info */}
        {leaveInput.leaveType === "maternity" && (
          <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
            <p className="text-sm text-blue-800">
              <strong>Maternity Leave:</strong> Fixed duration of 112 working
              days
            </p>
          </div>
        )}

        {/* Start Date */}
        <div className="space-y-2">
          <Label htmlFor="start-date">Start Date</Label>
          <DatePicker
            value={
              leaveInput.startDate ? new Date(leaveInput.startDate) : undefined
            }
            onChange={(date: Date | undefined) =>
              setLeaveInput({
                startDate: date ? date.toISOString().split("T")[0] : "",
              })
            }
            minDate={new Date()}
            placeholder="Select start date"
          />
        </div>

        {/* Validation Errors */}
        {validationErrors.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3">
            <div className="flex">
              <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 mr-2" />
              <div>
                <h4 className="text-sm font-medium text-red-800">
                  Please fix the following errors:
                </h4>
                <ul className="mt-1 text-sm text-red-700 list-disc list-inside">
                  {validationErrors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Calculation Error */}
        {calculationError && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3">
            <div className="flex">
              <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 mr-2" />
              <p className="text-sm text-red-800">{calculationError}</p>
            </div>
          </div>
        )}

        {/* Calculate Button */}
        <Button
          onClick={handleCalculate}
          disabled={isCalculating}
          className="w-full"
          size="lg"
        >
          {isCalculating ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Calculating...
            </>
          ) : (
            <>
              <Calculator className="w-4 h-4 mr-2" />
              Calculate Leave
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
