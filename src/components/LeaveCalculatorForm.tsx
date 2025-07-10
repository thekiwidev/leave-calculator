//@component: Leave calculator form for input parameters
import { useState } from "react";
import { useLeaveCalculatorStore } from "@/store/useLeaveCalculatorStore";
import { calculateLeave, validateLeaveInput } from "@/lib/leaveCalculator";
import { getTodayISO } from "@/utils/dateUtils";
import { Calculator, AlertCircle } from "lucide-react";
import type { LeaveType, GradeLevel } from "@/types";

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
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Leave Details
      </h3>

      {/* Leave Type Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Leave Type
        </label>
        <select
          value={leaveInput.leaveType}
          onChange={(e) => handleLeaveTypeChange(e.target.value as LeaveType)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="vacation">Vacation/Annual Leave</option>
          <option value="maternity">Maternity Leave</option>
          <option value="casual">Casual Leave</option>
          <option value="study">Study Leave</option>
          <option value="sick">Sick Leave</option>
          <option value="sabbatical">Sabbatical Leave</option>
        </select>
      </div>

      {/* Grade Level (for vacation leave) */}
      {leaveInput.leaveType === "vacation" && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Grade Level (GL)
          </label>
          <select
            value={leaveInput.gradeLevel || ""}
            onChange={(e) =>
              setLeaveInput({
                gradeLevel: parseInt(e.target.value, 10) as GradeLevel,
              })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select Grade Level</option>
            <option value={3}>GL 01 - 06 (21 working days)</option>
            <option value={7}>GL 07 - 17 (30 working days)</option>
          </select>
        </div>
      )}

      {/* Number of Days (for other leave types) */}
      {leaveInput.leaveType !== "vacation" &&
        leaveInput.leaveType !== "maternity" && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Number of Days
            </label>
            <input
              type="number"
              min="1"
              max="365"
              value={leaveInput.numberOfDays || ""}
              onChange={(e) =>
                setLeaveInput({ numberOfDays: parseInt(e.target.value, 10) })
              }
              placeholder="Enter number of days"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        )}

      {/* Maternity Leave Info */}
      {leaveInput.leaveType === "maternity" && (
        <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
          <p className="text-sm text-blue-800">
            <strong>Maternity Leave:</strong> Fixed duration of 112 working days
          </p>
        </div>
      )}

      {/* Start Date */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Start Date
        </label>
        <input
          type="date"
          value={leaveInput.startDate}
          min={getTodayISO()}
          onChange={(e) => setLeaveInput({ startDate: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
      <button
        onClick={handleCalculate}
        disabled={isCalculating}
        className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
      </button>
    </div>
  );
}
