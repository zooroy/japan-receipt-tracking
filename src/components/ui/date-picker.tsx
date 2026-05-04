"use client";

import * as React from "react";
import { format, parse, isValid } from "date-fns";
import { zhTW } from "date-fns/locale";
import { ChevronDownIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface DatePickerProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
}

export function DatePicker({ value, onChange, placeholder = "選擇日期" }: DatePickerProps) {
  const [open, setOpen] = React.useState(false);
  const selected = value ? parse(value, "yyyy-MM-dd", new Date()) : undefined;
  const validSelected = selected && isValid(selected) ? selected : undefined;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button
            variant="outline"
            data-empty={!validSelected}
            className="w-full justify-between text-left font-normal data-[empty=true]:text-muted-foreground"
          >
            {validSelected ? format(validSelected, "yyyy/MM/dd", { locale: zhTW }) : <span>{placeholder}</span>}
            <ChevronDownIcon data-icon="inline-end" />
          </Button>
        }
      />
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={validSelected}
          onSelect={(date) => { onChange?.(date ? format(date, "yyyy-MM-dd") : ""); setOpen(false); }}
          defaultMonth={validSelected}
          captionLayout="dropdown"
          locale={zhTW}
        />
      </PopoverContent>
    </Popover>
  );
}
