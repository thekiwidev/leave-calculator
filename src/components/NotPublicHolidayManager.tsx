//@ui: Component for managing dates that should not be treated as public holidays
import { useState } from "react";
import { Plus, Trash2, Calendar, ChevronDown, ChevronUp } from "lucide-react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    addNotPublicHolidayDate,
    removeNotPublicHolidayDate,
  } = useLeaveCalculatorStore();

  const [newDate, setNewDate] = useState<Date>();
  const [newName, setNewName] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selectedDates, setSelectedDates] = useState<Set<string>>(new Set());

  const handleAddDate = () => {
    if (newDate && newName.trim()) {
      addNotPublicHolidayDate({
        name: newName.trim(),
        date: format(newDate, "yyyy-MM-dd"),
      });
      setNewDate(undefined);
      setNewName("");
      setIsOpen(false);
    }
  };

  const handleRemoveDate = (date: string) => {
    removeNotPublicHolidayDate(date);
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

  const handleBatchDelete = () => {
    selectedDates.forEach((date) => {
      removeNotPublicHolidayDate(date);
    });
    setSelectedDates(new Set());
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
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              <CardTitle>
                Not Public Holiday Dates
                {notPublicHolidayDates.length > 0 && (
                  <span className="ml-2 text-sm font-normal text-muted-foreground">
                    ({notPublicHolidayDates.length})
                  </span>
                )}
              </CardTitle>
            </div>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm">
                {isCollapsed ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronUp className="h-4 w-4" />
                )}
              </Button>
            </CollapsibleTrigger>
          </div>
          <p className="text-sm text-muted-foreground">
            Manage dates that should NOT be treated as public holidays
          </p>
        </CardHeader>

        <CollapsibleContent>
          <CardContent className="space-y-4">
            {/* Add new date form */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="space-y-2">
                <Label htmlFor="not-holiday-name">Name</Label>
                <Input
                  id="not-holiday-name"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g., Work Day"
                  className="w-full"
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
              <div className="space-y-2">
                <Label className="text-transparent">Action</Label>
                <Button
                  onClick={handleAddDate}
                  disabled={!newDate || !newName.trim()}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Date
                </Button>
              </div>
            </div>

            {/* Batch operations */}
            {notPublicHolidayDates.length > 0 && (
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
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
                          Are you sure you want to delete {selectedDates.size}{" "}
                          selected date(s)? This action cannot be undone.
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

            {/* List of excluded dates */}
            {notPublicHolidayDates.length > 0 && (
              <div className="space-y-2">
                <Label>Excluded Dates ({notPublicHolidayDates.length})</Label>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {notPublicHolidayDates.map((dateItem, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-muted rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <Checkbox
                          id={`date-${index}`}
                          checked={selectedDates.has(dateItem.date)}
                          onCheckedChange={(checked) =>
                            handleSelectDate(dateItem.date, checked as boolean)
                          }
                        />
                        <div className="flex-1">
                          <div className="font-medium">{dateItem.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {formatDateWithDay(dateItem.date)}
                          </div>
                        </div>
                      </div>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm" className="ml-2">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Date</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{dateItem.name}"
                              from excluded dates? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleRemoveDate(dateItem.date)}
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {notPublicHolidayDates.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Calendar className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No excluded dates added yet</p>
                <p className="text-sm">
                  Add dates that should not be treated as public holidays
                </p>
              </div>
            )}
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}
