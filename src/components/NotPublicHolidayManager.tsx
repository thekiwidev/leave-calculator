//@ui: Component for managing dates that should not be treated as public holidays
import { useState } from "react";
import {
  Plus,
  Trash2,
  Calendar,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Loader,
} from "lucide-react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
import { useLeaveCalculatorStore } from "@/store/useLeaveCalculatorStore";
import { formatDateWithDay } from "@/utils/dateUtils";

export function NotPublicHolidayManager() {
  const {
    notPublicHolidayDates,
    isLoadingNotPublicHolidays,
    notPublicHolidayError,
    addNotPublicHolidayDate,
    removeNotPublicHolidayDate,
    removeMultipleNotPublicHolidayDates,
  } = useLeaveCalculatorStore();

  const [newDate, setNewDate] = useState<Date>();
  const [newName, setNewName] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false); // @comment: Controls visibility of add form
  const [isAddingDate, setIsAddingDate] = useState(false); // Loading state for add operation
  const [selectedDates, setSelectedDates] = useState<Set<string>>(new Set());

  const handleAddDate = async () => {
    if (newDate && newName.trim()) {
      setIsAddingDate(true);

      try {
        await addNotPublicHolidayDate({
          name: newName.trim(),
          date: format(newDate, "yyyy-MM-dd"),
        });

        // Reset form
        setNewDate(undefined);
        setNewName("");
        setIsOpen(false);
        setShowAddForm(false); // @comment: Hide form after successful add
      } catch (error) {
        // Error is already handled in the store and shown in notPublicHolidayError
        console.error("Failed to add not public holiday:", error);
      } finally {
        setIsAddingDate(false);
      }
    }
  };

  const handleRemoveDate = async (date: string) => {
    try {
      await removeNotPublicHolidayDate(date);
    } catch (error) {
      // Error is already handled in the store
      console.error("Failed to remove not public holiday:", error);
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedDates(new Set(notPublicHolidayDates.map((d) => d.date)));
    } else {
      setSelectedDates(new Set());
    }
  };

  const handleSelectDate = (date: string, checked: boolean) => {
    const newSelected = new Set(selectedDates);
    if (checked) {
      newSelected.add(date);
    } else {
      newSelected.delete(date);
    }
    setSelectedDates(newSelected);
  };

  const handleBatchDelete = async () => {
    try {
      await removeMultipleNotPublicHolidayDates(Array.from(selectedDates));
      setSelectedDates(new Set());
    } catch (error) {
      // Error is already handled in the store
      console.error("Failed to remove multiple not public holidays:", error);
    }
  };

  const isAllSelected =
    notPublicHolidayDates.length > 0 &&
    selectedDates.size === notPublicHolidayDates.length;
  const isSomeSelected = selectedDates.size > 0;

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
                    Not Public Holiday Dates{" "}
                    <Badge variant="secondary" className="ml-2">
                      {notPublicHolidayDates.length}
                    </Badge>
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {isCollapsed
                      ? "Click to expand"
                      : "Manage dates that should NOT be treated as public holidays"}
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
                Add Date
              </Button>
            </div>

            {/* Error Display */}
            {notPublicHolidayError && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
                <div className="flex">
                  <AlertCircle className="w-5 h-5 text-yellow-400 mt-0.5 mr-2" />
                  <div>
                    <h4 className="text-sm font-medium text-yellow-800">
                      Notice
                    </h4>
                    <p className="text-sm text-yellow-700 mt-1">
                      {notPublicHolidayError}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Add new date form */}
            {showAddForm && (
              <Card className="bg-muted/50">
                <CardHeader>
                  <CardTitle className="text-base">
                    Add New Not Public Holiday Date
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="not-holiday-name">Name</Label>
                      <Input
                        id="not-holiday-name"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        placeholder="e.g., Work Day"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Date</Label>
                      <Popover open={isOpen} onOpenChange={setIsOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !newDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {newDate ? format(newDate, "PPP") : "Pick a date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <CalendarComponent
                            mode="single"
                            selected={newDate}
                            onSelect={setNewDate}
                            initialFocus
                            captionLayout="dropdown"
                            fromYear={2020}
                            toYear={2030}
                          />
                        </PopoverContent>
                      </Popover>
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
                      onClick={handleAddDate}
                      disabled={!newDate || !newName.trim() || isAddingDate}
                      size="sm"
                    >
                      {isAddingDate ? (
                        <>
                          <Loader className="h-4 w-4 mr-1 animate-spin" />
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

            {/* Excluded Dates List */}
            <Card>
              <CardContent className="p-0">
                {notPublicHolidayDates.length === 0 ? (
                  <div className="p-6 text-center">
                    <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                    <h4 className="text-lg font-medium mb-2">
                      No Excluded Dates
                    </h4>
                    <p className="text-muted-foreground">
                      Add dates that should not be treated as public holidays.
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Batch operations */}
                    {notPublicHolidayDates.length > 0 && (
                      <div className="flex items-center justify-between p-4 bg-muted border-b">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="select-all"
                            checked={isAllSelected}
                            onCheckedChange={handleSelectAll}
                          />
                          <Label htmlFor="select-all" className="text-sm">
                            Select all ({notPublicHolidayDates.length})
                          </Label>
                        </div>
                        {isSomeSelected && (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="destructive" size="sm">
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete Selected ({selectedDates.size})
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Delete Selected Dates
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete{" "}
                                  {selectedDates.size} selected date(s)? This
                                  action cannot be undone.
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
                    )}

                    <div className="divide-y">
                      {notPublicHolidayDates.map((dateItem, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex items-center space-x-3">
                            <Checkbox
                              id={`date-${index}`}
                              checked={selectedDates.has(dateItem.date)}
                              onCheckedChange={(checked) =>
                                handleSelectDate(
                                  dateItem.date,
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
                                  {dateItem.name}
                                </h5>
                                <Badge variant="secondary" className="text-xs">
                                  Manual
                                </Badge>
                              </div>
                              <p className="text-xs text-muted-foreground">
                                {formatDateWithDay(dateItem.date)}
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
                                <AlertDialogTitle>Delete Date</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete "
                                  {dateItem.name}" (
                                  {formatDateWithDay(dateItem.date)})? This
                                  action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={async () => {
                                    try {
                                      await handleRemoveDate(dateItem.date);
                                    } catch (error) {
                                      // Error is already handled in the store
                                      console.error(
                                        "Failed to delete not public holiday:",
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
            {isLoadingNotPublicHolidays && (
              <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                <div className="flex items-center">
                  <Loader className="w-5 h-5 text-blue-600 mr-2 animate-spin" />
                  <p className="text-sm text-blue-800">
                    Updating excluded dates...
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
