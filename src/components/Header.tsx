//@component: Header component for the application
import { Calendar as CalendarIcon, Clock, X } from "lucide-react";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";

export function Header() {
  // @state: current date and time state
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  // @state: calendar modal visibility
  const [showCalendar, setShowCalendar] = useState(false);

  // @effect: update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    // cleanup timer on component unmount
    return () => clearInterval(timer);
  }, []);

  // @helper: get greeting based on time of day
  const getGreeting = () => {
    const hour = currentDateTime.getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <>
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-4 max-w-4xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowCalendar(true)}
                className="bg-gray-100 hover:bg-gray-200 p-2 rounded-lg transition-colors"
                aria-label="Open calendar"
              >
                <CalendarIcon className="w-6 h-6 text-gray-800" />
              </button>
              <div>
                <h1 className="text-base font-semibold text-gray-900">
                  {getGreeting()}!
                </h1>
                <p className="text-gray-600 text-xs">OSGF Leave Calculator</p>
              </div>
            </div>
            <div className="text-right">
              {/* Desktop: side by side, Mobile: stacked */}
              <div className="hidden sm:flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <CalendarIcon className="w-3 h-3 text-gray-500" />
                  <span className="text-xs font-medium text-gray-700">
                    {format(currentDateTime, "EEEE, MMMM do, yyyy")}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-3 h-3 text-gray-500" />
                  <span className="text-xs font-medium text-gray-700">
                    {format(currentDateTime, "h:mm:ss a")}
                  </span>
                </div>
              </div>
              {/* Mobile: stacked layout */}
              <div className="sm:hidden">
                <div className="flex items-center justify-end space-x-2 mb-1">
                  <CalendarIcon className="w-4 h-4 text-gray-500" />
                  <span className="text-xs font-medium text-gray-700">
                    {format(currentDateTime, "EEE, MMM do, yyyy")}
                  </span>
                </div>
                <div className="flex items-center justify-end space-x-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span className="text-xs font-medium text-gray-700">
                    {format(currentDateTime, "h:mm:ss a")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Calendar Modal */}
      {showCalendar && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Calendar</h2>
              <button
                onClick={() => setShowCalendar(false)}
                className="p-1 hover:bg-gray-100 rounded"
                aria-label="Close calendar"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-6 flex justify-center">
              <Calendar
                mode="single"
                selected={currentDateTime}
                numberOfMonths={1}
                captionLayout="dropdown"
                fromYear={2020}
                toYear={2030}
                className="rounded-md border-none"
                classNames={{
                  month: "space-y-4 w-full",
                  nav: "space-x-1 flex items-center justify-center relative",
                  button_previous: "absolute left-0",
                  button_next: "absolute right-0",
                  month_caption: "flex justify-center items-center",
                  dropdowns: "flex items-center justify-center gap-2",
                  table: "w-full border-collapse space-y-1 mt-4",
                  head_row: "flex",
                  head_cell:
                    "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
                  row: "flex w-full mt-2",
                  day: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected=true])]:bg-accent focus-within:relative focus-within:z-20",
                  day_selected:
                    "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                  day_today: "bg-accent text-accent-foreground",
                  day_outside: "text-muted-foreground opacity-50",
                  day_disabled: "text-muted-foreground opacity-50",
                }}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
