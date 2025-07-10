//@component: Public holiday management interface with collapsible sections
import { useState } from "react";
import { useLeaveCalculatorStore } from "@/store/useLeaveCalculatorStore";
import { formatDate } from "@/utils/dateUtils";
import {
  Plus,
  Trash2,
  RefreshCw,
  Calendar,
  AlertCircle,
  Loader,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import type { PublicHoliday } from "@/types";

// Shadcn/UI imports
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { DatePicker } from "@/components/ui/date-picker";

export function PublicHolidayManager() {
  const {
    publicHolidays,
    isLoadingHolidays,
    holidayError,
    addPublicHoliday,
    removePublicHoliday,
    removeMultiplePublicHolidays,
    fetchPublicHolidays,
  } = useLeaveCalculatorStore();

  const [showAddForm, setShowAddForm] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(true); // @comment: Default to collapsed
  const [isAddingHoliday, setIsAddingHoliday] = useState(false); // @comment: Loading state for add operation
  const [newHoliday, setNewHoliday] = useState<PublicHoliday>({
    name: "",
    date: "",
  });
  const [selectedHolidays, setSelectedHolidays] = useState<Set<string>>(
    new Set()
  );

  // Handle adding a new holiday
  const handleAddHoliday = async () => {
    if (!newHoliday.name.trim() || !newHoliday.date) {
      return;
    }

    setIsAddingHoliday(true); // @comment: Start loading state

    try {
      await addPublicHoliday({
        name: newHoliday.name.trim(),
        date: newHoliday.date,
      });

      // Reset form
      setNewHoliday({ name: "", date: "" });
      setShowAddForm(false);
    } catch (error) {
      // Error is already handled in the store and shown in holidayError
      console.error("Failed to add holiday:", error);
    } finally {
      setIsAddingHoliday(false); // @comment: End loading state
    }
  };

  // Batch operation handlers
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedHolidays(new Set(publicHolidays.map((h) => h.date)));
    } else {
      setSelectedHolidays(new Set());
    }
  };

  const handleSelectHoliday = (date: string, checked: boolean) => {
    const newSelected = new Set(selectedHolidays);
    if (checked) {
      newSelected.add(date);
    } else {
      newSelected.delete(date);
    }
    setSelectedHolidays(newSelected);
  };

  const handleBatchDelete = async () => {
    try {
      await removeMultiplePublicHolidays(Array.from(selectedHolidays));
      setSelectedHolidays(new Set());
    } catch (error) {
      // Error is already handled in the store and shown in holidayError
      console.error("Failed to delete holidays:", error);
    }
  };

  const isAllSelected =
    publicHolidays.length > 0 &&
    selectedHolidays.size === publicHolidays.length;
  const isSomeSelected = selectedHolidays.size > 0;

  return (
    <Collapsible
      open={!isCollapsed}
      onOpenChange={(open) => setIsCollapsed(!open)}
    >
      <Card>
        <CollapsibleTrigger asChild>
          <CardHeader className="hover:bg-muted/50 transition-colors cursor-pointer">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {isCollapsed ? (
                  <ChevronDown className="w-5 h-5 text-muted-foreground" />
                ) : (
                  <ChevronUp className="w-5 h-5 text-muted-foreground" />
                )}
                <div>
                  <CardTitle className="text-lg">
                    Public Holidays{" "}
                    <Badge variant="secondary" className="ml-2">
                      {publicHolidays.length}
                    </Badge>
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {isCollapsed
                      ? "Click to expand"
                      : "Manage the public holidays used in leave calculations"}
                  </p>
                </div>
              </div>
            </div>
          </CardHeader>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <CardContent className="space-y-6">
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                onClick={() => setShowAddForm(!showAddForm)}
                variant="default"
                size="sm"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Holiday
              </Button>

              <Button
                onClick={fetchPublicHolidays}
                disabled={isLoadingHolidays}
                variant="outline"
                size="sm"
              >
                {isLoadingHolidays ? (
                  <Loader className="w-4 h-4 mr-1 animate-spin" />
                ) : (
                  <RefreshCw className="w-4 h-4 mr-1" />
                )}
                Refresh
              </Button>
            </div>

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
              <Card className="bg-muted/50">
                <CardHeader>
                  <CardTitle className="text-base">
                    Add New Public Holiday
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="holiday-name">Holiday Name</Label>
                      <Input
                        id="holiday-name"
                        type="text"
                        value={newHoliday.name}
                        onChange={(e) =>
                          setNewHoliday({ ...newHoliday, name: e.target.value })
                        }
                        placeholder="e.g., Independence Day"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="holiday-date">Date</Label>
                      <DatePicker
                        value={
                          newHoliday.date
                            ? new Date(newHoliday.date + "T12:00:00")
                            : undefined
                        }
                        onChange={(date: Date | undefined) =>
                          setNewHoliday({
                            ...newHoliday,
                            date: date ? date.toISOString().split("T")[0] : "",
                          })
                        }
                        placeholder="Select holiday date"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button
                      onClick={() => setShowAddForm(false)}
                      variant="ghost"
                      size="sm"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleAddHoliday}
                      disabled={
                        !newHoliday.name.trim() ||
                        !newHoliday.date ||
                        isAddingHoliday
                      }
                      size="sm"
                    >
                      {isAddingHoliday ? (
                        <>
                          <Loader className="w-4 h-4 mr-1 animate-spin" />
                          Adding...
                        </>
                      ) : (
                        "Add"
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Holidays List */}
            <Card>
              <CardContent className="p-0">
                {publicHolidays.length === 0 ? (
                  <div className="p-6 text-center">
                    <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                    <h4 className="text-lg font-medium mb-2">
                      No Public Holidays
                    </h4>
                    <p className="text-muted-foreground">
                      Add holidays manually or refresh to fetch from the API.
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Batch operations */}
                    <div className="flex items-center justify-between p-4 bg-muted border-b">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="select-all-holidays"
                          checked={isAllSelected}
                          onCheckedChange={handleSelectAll}
                        />
                        <Label
                          htmlFor="select-all-holidays"
                          className="text-sm"
                        >
                          Select all ({publicHolidays.length})
                        </Label>
                      </div>
                      {isSomeSelected && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="sm">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete Selected ({selectedHolidays.size})
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Delete Selected Holidays
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete{" "}
                                {selectedHolidays.size} selected holiday(s)?
                                This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={handleBatchDelete}>
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                    </div>

                    <div className="divide-y">
                      {publicHolidays.map((holiday, index) => (
                        <div
                          key={`${holiday.date}-${index}`}
                          className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex items-center space-x-3">
                            <Checkbox
                              id={`holiday-${index}`}
                              checked={selectedHolidays.has(holiday.date)}
                              onCheckedChange={(checked) =>
                                handleSelectHoliday(
                                  holiday.date,
                                  checked as boolean
                                )
                              }
                            />
                            <div className="flex-shrink-0">
                              <div className="w-2 h-2 bg-primary rounded-full"></div>
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h5 className="text-sm font-medium">
                                  {holiday.name}
                                </h5>
                                {holiday.isManual && (
                                  <Badge
                                    variant="secondary"
                                    className="text-xs"
                                  >
                                    Manual
                                  </Badge>
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground">
                                {formatDate(holiday.date)}
                              </p>
                            </div>
                          </div>

                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Delete Holiday
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete "
                                  {holiday.name}" ({formatDate(holiday.date)})?
                                  This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={async () => {
                                    try {
                                      await removePublicHoliday(holiday.date);
                                    } catch (error) {
                                      // Error is already handled in the store
                                      console.error(
                                        "Failed to delete holiday:",
                                        error
                                      );
                                    }
                                  }}
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

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
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}
