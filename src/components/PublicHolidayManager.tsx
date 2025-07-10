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
  CheckCircle,
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
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { DatePicker } from "@/components/ui/date-picker";

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
  const [isCollapsed, setIsCollapsed] = useState(true); // @comment: Default to collapsed
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
                      disabled={!newHoliday.name.trim() || !newHoliday.date}
                      size="sm"
                    >
                      Add
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
                  <div className="divide-y">
                    {publicHolidays.map((holiday, index) => (
                      <div
                        key={`${holiday.date}-${index}`}
                        className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="flex-shrink-0">
                            <div className="w-2 h-2 bg-primary rounded-full"></div>
                          </div>
                          <div>
                            <h5 className="text-sm font-medium">
                              {holiday.name}
                            </h5>
                            <p className="text-xs text-muted-foreground">
                              {formatDate(holiday.date)}
                            </p>
                          </div>
                        </div>

                        <Button
                          onClick={() => handleRemoveHoliday(holiday.date)}
                          variant={
                            deleteConfirm === holiday.date
                              ? "destructive"
                              : "ghost"
                          }
                          size="sm"
                          className={
                            deleteConfirm === holiday.date
                              ? "h-8"
                              : "h-8 w-8 p-0"
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
                        </Button>
                      </div>
                    ))}
                  </div>
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
