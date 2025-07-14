import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { ChevronDownIcon } from "lucide-react";
import { useState } from "react";

function DatePicker() {
  const [date, setDate] = useState<Date | undefined>();
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="p-2 mt-3 m-auto">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button className="m-auto">
              {date ? date.toLocaleDateString() : "Select date"}
              <ChevronDownIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <Calendar
              mode="single"
              onSelect={(selectedDate) => {
                setDate(selectedDate);
                setOpen(false);
              }}
              className="rounded-lg border"
            />
          </PopoverContent>
        </Popover>
      </div>
    </>
  );
}

export default DatePicker;
