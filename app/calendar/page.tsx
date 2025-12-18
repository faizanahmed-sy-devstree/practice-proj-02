"use client"

import * as React from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { HugeiconsIcon } from "@hugeicons/react"
import { 
  Calendar01Icon, 
  Clock01Icon, 
  PlusSignIcon, 
  CoffeeIcon,
  Task01Icon,
  MoreVerticalCircle01Icon
} from "@hugeicons/core-free-icons"
import { cn } from "@/lib/utils"
import { format, addMinutes, startOfDay, differenceInMinutes, parse } from "date-fns"

interface CalendarEvent {
  id: string
  title: string
  startTime: string // "HH:mm"
  endTime: string // "HH:mm"
  type: "task" | "break"
  color: string
}

const INITIAL_EVENTS: CalendarEvent[] = [
  {
    id: "1",
    title: "Morning Standup",
    startTime: "10:00",
    endTime: "10:30",
    type: "task",
    color: "bg-blue-500/10 text-blue-600 border-blue-200",
  },
  {
    id: "2",
    title: "Lunch Break",
    startTime: "13:00",
    endTime: "14:00",
    type: "break",
    color: "bg-emerald-500/10 text-emerald-600 border-emerald-200",
  },
  {
    id: "3",
    title: "Project Deep Work",
    startTime: "14:30",
    endTime: "17:00",
    type: "task",
    color: "bg-purple-500/10 text-purple-600 border-purple-200",
  },
]

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { TimePicker } from "@/components/ui/time-picker";

export default function CalendarPage() {
  const [workStart, setWorkStart] = React.useState("09:00");
  const [workEnd, setWorkEnd] = React.useState("19:00");
  const [events, setEvents] = React.useState<CalendarEvent[]>(INITIAL_EVENTS);
  const [isMultiple, setIsMultiple] = React.useState(false);
  const [dialogOpen, setDialogOpen] = React.useState(false);

  const [newEvent, setNewEvent] = React.useState<Partial<CalendarEvent>>({
    type: "task",
    startTime: "11:00",
    endTime: "12:00",
    title: "",
  });

  const handleAddEvent = () => {
    if (!newEvent.title || !newEvent.startTime || !newEvent.endTime) return;

    const colors = {
      task: "bg-blue-500/10 text-blue-600 border-blue-200",
      break: "bg-emerald-500/10 text-emerald-600 border-emerald-200",
    };

    const event: CalendarEvent = {
      id: Math.random().toString(36).substr(2, 9),
      title: newEvent.title,
      startTime: newEvent.startTime,
      endTime: newEvent.endTime,
      type: newEvent.type as "task" | "break",
      color: colors[newEvent.type as "task" | "break"],
    };

    setEvents([...events, event]);
    setNewEvent({ ...newEvent, title: "" }); // Keep times for quick multiple entry

    if (!isMultiple) {
      setDialogOpen(false);
    }
  };

  // Generate time slots (every 30 mins)
  const timeSlots = React.useMemo(() => {
    const slots = [];
    const start = parse(workStart, "HH:mm", new Date());
    const end = parse(workEnd, "HH:mm", new Date());

    let current = start;
    while (current <= end) {
      slots.push(format(current, "HH:mm"));
      current = addMinutes(current, 30);
    }
    return slots;
  }, [workStart, workEnd]);

  const calculatePosition = (
    startTime: string,
    endTime: string,
    allEvents: CalendarEvent[],
    currentId: string
  ) => {
    const start = parse(startTime, "HH:mm", new Date());
    let end = parse(endTime, "HH:mm", new Date());
    const workDayStart = parse(workStart, "HH:mm", new Date());

    // Handle cross-day or midnight (e.g. 11:30 PM to 12:00 AM)
    if (end <= start) {
      end = addMinutes(end, 24 * 60);
    }

    const top = differenceInMinutes(start, workDayStart) * (64 / 30);
    const height = Math.max(differenceInMinutes(end, start) * (64 / 30), 20); // Min height 20px

    // Overlap detection
    const overlappingEvents = allEvents
      .filter((e) => {
        if (e.id === currentId) return false;
        const eStart = parse(e.startTime, "HH:mm", new Date());
        let eEnd = parse(e.endTime, "HH:mm", new Date());
        if (eEnd <= eStart) eEnd = addMinutes(eEnd, 24 * 60);

        return start < eEnd && end > eStart;
      })
      .sort((a, b) => a.startTime.localeCompare(b.startTime));

    let left: string | number = "4px";
    let width = "calc(100% - 8px)";

    if (overlappingEvents.length > 0) {
      const allOverlapping = [
        { id: currentId, startTime },
        ...overlappingEvents.map((e) => ({ id: e.id, startTime: e.startTime })),
      ].sort((a, b) => {
        if (a.startTime !== b.startTime)
          return a.startTime.localeCompare(b.startTime);
        return a.id.localeCompare(b.id);
      });

      const total = allOverlapping.length;
      const colWidth = 100 / total;
      const myIndex = allOverlapping.findIndex((e) => e.id === currentId);

      left = `${myIndex * colWidth + 0.2}%`;
      width = `${colWidth - 0.4}%`;
    }

    return {
      top,
      height,
      left,
      width,
    };
  };

  const formatTime12h = (time24: string) => {
    const [h, m] = time24.split(":").map(Number);
    const period = h >= 12 ? "PM" : "AM";
    const h12 = h % 12 || 12;
    return `${h12}:${m.toString().padStart(2, "0")} ${period}`;
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Work Calendar
            </h1>
            <p className="text-muted-foreground">
              Plan your work day with 5-minute precision.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <HugeiconsIcon icon={Calendar01Icon} size={16} className="mr-2" />
              Today
            </Button>

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger
                render={
                  <Button size="sm" className="shadow-lg shadow-primary/20" />
                }
              >
                <HugeiconsIcon icon={PlusSignIcon} size={16} className="mr-2" />
                Add Event
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Add New Event</DialogTitle>
                  <DialogDescription>
                    Create a new task or break in your schedule.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="flex items-center gap-4 mb-2">
                    <Button
                      variant={!isMultiple ? "default" : "outline"}
                      size="sm"
                      className="flex-1"
                      onClick={() => setIsMultiple(false)}
                    >
                      Single Entry
                    </Button>
                    <Button
                      variant={isMultiple ? "default" : "outline"}
                      size="sm"
                      className="flex-1"
                      onClick={() => setIsMultiple(true)}
                    >
                      Multiple Entry
                    </Button>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      placeholder="e.g. Design Review"
                      value={newEvent.title}
                      onChange={(e) =>
                        setNewEvent({ ...newEvent, title: e.target.value })
                      }
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="type">Type</Label>
                      <Select
                        value={newEvent.type}
                        onValueChange={(v) =>
                          v && setNewEvent({ ...newEvent, type: v as any })
                        }
                      >
                        <SelectTrigger id="type">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="task">Task</SelectItem>
                          <SelectItem value="break">Break</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label>Start Time</Label>
                      <TimePicker
                        value={newEvent.startTime}
                        onChange={(v) =>
                          setNewEvent({ ...newEvent, startTime: v })
                        }
                      />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label>End Time</Label>
                    <TimePicker
                      value={newEvent.endTime}
                      onChange={(v) => setNewEvent({ ...newEvent, endTime: v })}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleAddEvent}>
                    {isMultiple ? "Add & Continue" : "Save Event"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[300px_1fr]">
          {/* Sidebar Settings */}
          <div className="space-y-6">
            <Card className="border-none shadow-md">
              <CardHeader>
                <CardTitle className="text-sm font-semibold">
                  Work Day Settings
                </CardTitle>
                <CardDescription>Define your active hours.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label>Start Time</Label>
                  <TimePicker value={workStart} onChange={setWorkStart} />
                </div>
                <div className="grid gap-2">
                  <Label>End Time</Label>
                  <TimePicker value={workEnd} onChange={setWorkEnd} />
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-md">
              <CardHeader>
                <CardTitle className="text-sm font-semibold">
                  Quick Add
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2"
                  size="sm"
                >
                  <HugeiconsIcon
                    icon={Task01Icon}
                    size={16}
                    className="text-blue-500"
                  />
                  New Task
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2"
                  size="sm"
                >
                  <HugeiconsIcon
                    icon={CoffeeIcon}
                    size={16}
                    className="text-emerald-500"
                  />
                  Add Break
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Calendar Grid */}
          <Card className="border-none shadow-lg overflow-hidden bg-background">
            <div className="flex h-12 items-center border-b bg-muted/30 px-6">
              <span className="text-sm font-semibold">Thursday, Dec 18</span>
            </div>
            <CardContent className="p-0 relative overflow-y-auto max-h-[700px] no-scrollbar">
              <div className="relative flex min-w-full">
                {/* Time Column */}
                <div className="w-20 border-r bg-muted/10">
                  {timeSlots.map((time) => (
                    <div
                      key={time}
                      className="h-16 border-b px-3 py-2 text-[10px] font-medium text-muted-foreground"
                    >
                      {formatTime12h(time)}
                    </div>
                  ))}
                </div>

                {/* Grid Column */}
                <div className="flex-1 relative">
                  {/* Grid Lines */}
                  {timeSlots.map((time) => (
                    <div key={time} className="h-16 border-b border-muted/20" />
                  ))}

                  {/* Events */}
                  {events.map((event) => {
                    const { top, height, left, width } = calculatePosition(
                      event.startTime,
                      event.endTime,
                      events,
                      event.id
                    );
                    return (
                      <div
                        key={event.id}
                        className={cn(
                          "absolute rounded-lg border p-3 shadow-sm transition-all hover:shadow-md cursor-pointer group",
                          event.color
                        )}
                        style={{
                          top: `${top}px`,
                          height: `${height}px`,
                          left: left,
                          width: width,
                        }}
                      >
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5">
                              <HugeiconsIcon
                                icon={
                                  event.type === "task"
                                    ? Task01Icon
                                    : CoffeeIcon
                                }
                                size={14}
                                strokeWidth={2.5}
                              />
                              <span className="text-xs font-bold uppercase tracking-wider opacity-70">
                                {event.type}
                              </span>
                            </div>
                            <h3 className="text-sm font-bold leading-tight">
                              {event.title}
                            </h3>
                            <div className="flex items-center gap-1 text-[10px] font-medium opacity-60">
                              <HugeiconsIcon icon={Clock01Icon} size={10} />
                              {formatTime12h(event.startTime)} -{" "}
                              {formatTime12h(event.endTime)}
                            </div>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger
                              render={
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                />
                              }
                            >
                              <HugeiconsIcon
                                icon={MoreVerticalCircle01Icon}
                                size={14}
                              />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                className="text-destructive"
                                onClick={() =>
                                  setEvents(
                                    events.filter((e) => e.id !== event.id)
                                  )
                                }
                              >
                                Delete Event
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
