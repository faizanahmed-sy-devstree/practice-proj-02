"use client"

import * as React from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { Clock01Icon } from "@hugeicons/core-free-icons"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"

interface TimePickerProps {
  value?: string // "HH:mm" (24h format internally for easier math)
  onChange?: (value: string) => void
  className?: string
}

export function TimePicker({ value = "09:00", onChange, className }: TimePickerProps) {
  const [open, setOpen] = React.useState(false)

  // Parse 24h to 12h
  const [h24, m] = value.split(":").map(Number)
  const period = h24 >= 12 ? "PM" : "AM"
  const h12 = h24 % 12 || 12
  const displayTime = `${h12.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")} ${period}`

  const hours = Array.from({ length: 12 }, (_, i) => i + 1)
  const minutes = Array.from({ length: 12 }, (_, i) => i * 5)

  const handleSelect = (newH12: number, newM: number, newPeriod: string) => {
    let finalH24 = newH12 % 12
    if (newPeriod === "PM") finalH24 += 12
    
    const newValue = `${finalH24.toString().padStart(2, "0")}:${newM.toString().padStart(2, "0")}`
    onChange?.(newValue)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !value && "text-muted-foreground",
              className
            )}
          >
            <HugeiconsIcon icon={Clock01Icon} size={16} className="mr-2" />
            {displayTime}
          </Button>
        }
      />
      <PopoverContent className="w-auto p-0" align="start">
        <div className="flex h-[280px] divide-x overflow-hidden">
          <div className="w-16 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <div className="flex flex-col p-1">
              {hours.map((h) => (
                <Button
                  key={h}
                  variant={h12 === h ? "default" : "ghost"}
                  className="h-8 w-full justify-center text-xs"
                  onClick={() => handleSelect(h, m, period)}
                >
                  {h.toString().padStart(2, "0")}
                </Button>
              ))}
            </div>
          </div>
          <div className="w-16 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <div className="flex flex-col p-1">
              {minutes.map((min) => (
                <Button
                  key={min}
                  variant={m === min ? "default" : "ghost"}
                  className="h-8 w-full justify-center text-xs"
                  onClick={() => handleSelect(h12, min, period)}
                >
                  {min.toString().padStart(2, "0")}
                </Button>
              ))}
            </div>
          </div>
          <div className="w-16 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <div className="flex flex-col p-1">
              {["AM", "PM"].map((p) => (
                <Button
                  key={p}
                  variant={period === p ? "default" : "ghost"}
                  className="h-8 w-full justify-center text-xs"
                  onClick={() => handleSelect(h12, m, p)}
                >
                  {p}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
