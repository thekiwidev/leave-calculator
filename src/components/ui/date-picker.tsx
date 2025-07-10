//@component: Date picker component using Shadcn/UI Calendar
import * as React from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerProps {
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  disableWeekends?: boolean;
}

export function DatePicker({
  value,
  onChange,
  placeholder = "Pick a date",
  disabled = false,
  className,
  disableWeekends = false,
}: DatePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  // @helper: Handle date selection with proper timezone handling
  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      // Create a new date at local noon to avoid timezone issues
      const localDate = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        12,
        0,
        0
      );
      onChange?.(localDate);
    } else {
      onChange?.(undefined);
    }
    setIsOpen(false);
  };

  // @helper: Check if date is weekend (Saturday = 6, Sunday = 0)
  const isWeekend = (date: Date) => {
    const day = date.getDay();
    return day === 0 || day === 6;
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal border-2",
            !value && "text-muted-foreground",
            className
          )}
          disabled={disabled}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? format(value, "PPP") : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={value}
          onSelect={handleDateSelect}
          disabled={(date) => {
            if (disableWeekends) {
              return isWeekend(date);
            }
            return false;
          }}
          captionLayout="dropdown"
          fromYear={2020}
          toYear={2030}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
