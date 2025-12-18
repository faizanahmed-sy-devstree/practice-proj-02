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
  MoreVerticalCircle01Icon,
  Delete02Icon,
} from "@hugeicons/core-free-icons";
import { cn } from "@/lib/utils";
import {
  format,
  addMinutes,
  startOfDay,
  differenceInMinutes,
  parse,
} from "date-fns";

import {
  useCalendarStore,
  type CalendarEvent,
} from "@/store/use-calendar-store";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { TimePicker } from "@/components/ui/time-picker";
import { RefreshIcon } from "@hugeicons/core-free-icons";

import {
  DndContext,
  useDraggable,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  restrictToVerticalAxis,
  restrictToParentElement,
} from "@dnd-kit/modifiers";

export default function CalendarPage() {
  const {
    workStart,
    workEnd,
    events,
    setWorkStart,
    setWorkEnd,
    addEvent,
    updateEvent,
    removeEvent,
    reset,
  } = useCalendarStore();

  const [isMultiple, setIsMultiple] = React.useState(false);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const [draftEvents, setDraftEvents] = React.useState<
    Partial<CalendarEvent>[]
  >([{ type: "task", startTime: "11:00", endTime: "12:00", title: "" }]);

  const handleAddEvent = () => {
    const validDrafts = draftEvents.filter(
      (d) => d.title && d.startTime && d.endTime
    );
    if (validDrafts.length === 0) return;

    const colors = {
      task: "bg-blue-500/10 text-blue-600 border-blue-200",
      break: "bg-emerald-500/10 text-emerald-600 border-emerald-200",
    };

    validDrafts.forEach((draft) => {
      const event: CalendarEvent = {
        id: Math.random().toString(36).substr(2, 9),
        title: draft.title!,
        startTime: draft.startTime!,
        endTime: draft.endTime!,
        type: (draft.type as "task" | "break") || "task",
        color: colors[(draft.type as "task" | "break") || "task"],
      };
      addEvent(event);
    });

    if (isMultiple) {
      setDraftEvents([
        { type: "task", startTime: "11:00", endTime: "12:00", title: "" },
        { type: "task", startTime: "11:00", endTime: "12:00", title: "" },
        { type: "task", startTime: "11:00", endTime: "12:00", title: "" },
      ]);
    } else {
      setDraftEvents([
        { type: "task", startTime: "11:00", endTime: "12:00", title: "" },
      ]);
      setDialogOpen(false);
    }
  };

  const addMoreForm = () => {
    setDraftEvents([
      ...draftEvents,
      { type: "task", startTime: "11:00", endTime: "12:00", title: "" },
    ]);
  };

  const updateDraft = (index: number, updates: Partial<CalendarEvent>) => {
    const newDrafts = [...draftEvents];
    newDrafts[index] = { ...newDrafts[index], ...updates };
    setDraftEvents(newDrafts);
  };

  const removeDraft = (index: number) => {
    if (draftEvents.length <= 1) return;
    setDraftEvents(draftEvents.filter((_, i) => i !== index));
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, delta } = event;
    if (!active) return;

    const calendarEvent = events.find((e) => e.id === active.id);
    if (!calendarEvent) return;

    // Calculate minute delta (64px = 30 mins)
    const minuteDelta = Math.round(((delta.y / 64) * 30) / 5) * 5; // Snap to 5 mins

    if (minuteDelta === 0) return;

    const start = parse(calendarEvent.startTime, "HH:mm", new Date());
    const end = parse(calendarEvent.endTime, "HH:mm", new Date());

    const duration = differenceInMinutes(end, start);
    let newStart = addMinutes(start, minuteDelta);

    // Clamp to work day
    const dayStart = parse(workStart, "HH:mm", new Date());
    const dayEnd = parse(workEnd, "HH:mm", new Date());

    if (newStart < dayStart) newStart = dayStart;
    if (addMinutes(newStart, duration) > dayEnd) {
      newStart = addMinutes(dayEnd, -duration);
    }

    const newEnd = addMinutes(newStart, duration);

    updateEvent(calendarEvent.id, {
      startTime: format(newStart, "HH:mm"),
      endTime: format(newEnd, "HH:mm"),
    });
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

    // Overlap detection and cluster grouping
    const getCluster = (id: string) => {
      const cluster = new Set<string>();
      const stack = [id];
      cluster.add(id);
      while (stack.length > 0) {
        const current = stack.pop()!;
        const currEv = allEvents.find((e) => e.id === current)!;
        const s1 = parse(currEv.startTime, "HH:mm", new Date());
        let e1 = parse(currEv.endTime, "HH:mm", new Date());
        if (e1 <= s1) e1 = addMinutes(e1, 24 * 60);

        allEvents.forEach((other) => {
          if (cluster.has(other.id)) return;
          const s2 = parse(other.startTime, "HH:mm", new Date());
          let e2 = parse(other.endTime, "HH:mm", new Date());
          if (e2 <= s2) e2 = addMinutes(e2, 24 * 60);

          if (startOfDay(s1).getTime() === startOfDay(s2).getTime()) {
            if (s1 < e2 && e1 > s2) {
              cluster.add(other.id);
              stack.push(other.id);
            }
          }
        });
      }
      return Array.from(cluster).map(
        (cid) => allEvents.find((e) => e.id === cid)!
      );
    };

    const cluster = getCluster(currentId);

    let left: string | number = "4px";
    let width = "calc(100% - 8px)";

    if (cluster.length > 1) {
      const sortedCluster = cluster.sort((a, b) => {
        if (a.startTime !== b.startTime)
          return a.startTime.localeCompare(b.startTime);
        return a.id.localeCompare(b.id);
      });

      const columns: string[][] = [];
      const eventToColumn: Record<string, number> = {};

      sortedCluster.forEach((ev) => {
        let assigned = false;
        const s1 = parse(ev.startTime, "HH:mm", new Date());
        let e1 = parse(ev.endTime, "HH:mm", new Date());
        if (e1 <= s1) e1 = addMinutes(e1, 24 * 60);

        for (let i = 0; i < columns.length; i++) {
          const hasOverlap = columns[i].some((id) => {
            const other = sortedCluster.find((o) => o.id === id)!;
            const s2 = parse(other.startTime, "HH:mm", new Date());
            let e2 = parse(other.endTime, "HH:mm", new Date());
            if (e2 <= s2) e2 = addMinutes(e2, 24 * 60);
            return s1 < e2 && e1 > s2;
          });
          if (!hasOverlap) {
            columns[i].push(ev.id);
            eventToColumn[ev.id] = i;
            assigned = true;
            break;
          }
        }
        if (!assigned) {
          eventToColumn[ev.id] = columns.length;
          columns.push([ev.id]);
        }
      });

      const total = columns.length;
      const colWidth = 100 / total;
      const myIndex = eventToColumn[currentId];

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

  if (!mounted) return null;

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

            <AlertDialog>
              <AlertDialogTrigger
                render={
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-destructive hover:bg-destructive/10"
                  />
                }
              >
                <HugeiconsIcon icon={RefreshIcon} size={16} className="mr-2" />
                Reset
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will clear all your calendar events and reset work
                    hours to default. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={reset}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Reset Everything
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger
                render={
                  <Button size="sm" className="shadow-lg shadow-primary/20" />
                }
              >
                <HugeiconsIcon icon={PlusSignIcon} size={16} className="mr-2" />
                Add Event
              </DialogTrigger>
              <DialogContent className="sm:max-w-[800px] max-h-[90vh] flex flex-col p-0 overflow-hidden border-none shadow-2xl">
                <DialogHeader className="p-8 pb-0">
                  <DialogTitle className="text-2xl font-bold">
                    Add New Event
                  </DialogTitle>
                  <DialogDescription className="text-base">
                    Create one or more tasks or breaks in your schedule.
                  </DialogDescription>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto p-8 pt-6 space-y-8 no-scrollbar">
                  <div className="flex p-1 bg-muted/50 rounded-xl w-fit mx-auto mb-4">
                    <Button
                      variant={!isMultiple ? "default" : "ghost"}
                      size="sm"
                      className={cn(
                        "px-8 rounded-lg transition-all",
                        !isMultiple &&
                          "bg-background text-foreground shadow-sm hover:bg-background"
                      )}
                      onClick={() => {
                        setIsMultiple(false);
                        if (draftEvents.length > 1)
                          setDraftEvents([draftEvents[0]]);
                      }}
                    >
                      Single Entry
                    </Button>
                    <Button
                      variant={isMultiple ? "default" : "ghost"}
                      size="sm"
                      className={cn(
                        "px-8 rounded-lg transition-all",
                        isMultiple &&
                          "bg-background text-foreground shadow-sm hover:bg-background"
                      )}
                      onClick={() => {
                        setIsMultiple(true);
                        if (draftEvents.length < 3) {
                          const newDrafts = [...draftEvents];
                          while (newDrafts.length < 3) {
                            newDrafts.push({
                              type: "task",
                              startTime: "11:00",
                              endTime: "12:00",
                              title: "",
                            });
                          }
                          setDraftEvents(newDrafts);
                        }
                      }}
                    >
                      Multiple Entry
                    </Button>
                  </div>

                  <div
                    className={cn(
                      "grid gap-6",
                      isMultiple
                        ? "grid-cols-1 md:grid-cols-2"
                        : "grid-cols-1 max-w-xl mx-auto"
                    )}
                  >
                    {draftEvents.map((draft, index) => (
                      <div
                        key={index}
                        className="relative space-y-5 p-6 rounded-2xl border bg-card/50 shadow-sm group/form hover:border-primary/20 transition-colors"
                      >
                        {isMultiple && draftEvents.length > 1 && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="absolute -right-3 -top-3 h-8 w-8 rounded-full bg-background border shadow-md opacity-0 group-hover/form:opacity-100 transition-all hover:bg-destructive hover:text-destructive-foreground hover:border-destructive"
                            onClick={() => removeDraft(index)}
                          >
                            <HugeiconsIcon
                              icon={PlusSignIcon}
                              size={14}
                              className="rotate-45"
                            />
                          </Button>
                        )}

                        <div className="grid gap-2.5">
                          <Label
                            htmlFor={`title-${index}`}
                            className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1"
                          >
                            Event Title
                          </Label>
                          <Input
                            id={`title-${index}`}
                            placeholder="e.g. Design Review"
                            className="h-11 rounded-xl bg-background/50 border-muted-foreground/20 focus:bg-background transition-all"
                            value={draft.title}
                            onChange={(e) =>
                              updateDraft(index, { title: e.target.value })
                            }
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="grid gap-2.5">
                            <Label
                              htmlFor={`type-${index}`}
                              className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1"
                            >
                              Type
                            </Label>
                            <Select
                              value={draft.type}
                              onValueChange={(v) =>
                                v && updateDraft(index, { type: v as any })
                              }
                            >
                              <SelectTrigger
                                id={`type-${index}`}
                                className="h-11 rounded-xl bg-background/50 border-muted-foreground/20"
                              >
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="task">Task</SelectItem>
                                <SelectItem value="break">Break</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="grid gap-2.5">
                            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">
                              Start Time
                            </Label>
                            <TimePicker
                              value={draft.startTime}
                              onChange={(v) =>
                                updateDraft(index, { startTime: v })
                              }
                            />
                          </div>
                        </div>

                        <div className="grid gap-2.5">
                          <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">
                            End Time
                          </Label>
                          <TimePicker
                            value={draft.endTime}
                            onChange={(v) => updateDraft(index, { endTime: v })}
                          />
                        </div>
                      </div>
                    ))}

                    {isMultiple && (
                      <Button
                        variant="outline"
                        className="flex flex-col items-center justify-center gap-2 h-auto min-h-[200px] rounded-2xl border-dashed border-2 bg-muted/20 hover:bg-primary/5 hover:border-primary/50 transition-all group/add"
                        onClick={addMoreForm}
                      >
                        <div className="p-3 rounded-full bg-background border shadow-sm group-hover/add:scale-110 transition-transform">
                          <HugeiconsIcon
                            icon={PlusSignIcon}
                            size={20}
                            className="text-primary"
                          />
                        </div>
                        <span className="font-semibold text-muted-foreground group-hover:text-primary transition-colors">
                          Add Another Event
                        </span>
                      </Button>
                    )}
                  </div>
                </div>

                <DialogFooter className="p-8 pt-4 border-t bg-muted/5">
                  <div className="flex items-center justify-between w-full gap-4">
                    <div className="text-sm text-muted-foreground font-medium">
                      {isMultiple ? (
                        <span>
                          Ready to add{" "}
                          <span className="text-primary font-bold">
                            {draftEvents.filter((d) => d.title).length}
                          </span>{" "}
                          events to your schedule
                        </span>
                      ) : (
                        <span>Fill in the details to schedule your event</span>
                      )}
                    </div>
                    <Button
                      onClick={handleAddEvent}
                      size="lg"
                      className="px-10 rounded-xl shadow-lg shadow-primary/20"
                    >
                      {isMultiple ? "Add All Events" : "Save Event"}
                    </Button>
                  </div>
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
                  <DndContext
                    sensors={sensors}
                    onDragEnd={handleDragEnd}
                    modifiers={[
                      restrictToVerticalAxis,
                      restrictToParentElement,
                    ]}
                  >
                    {events.map((event) => (
                      <DraggableEvent
                        key={event.id}
                        event={event}
                        calculatePosition={calculatePosition}
                        formatTime12h={formatTime12h}
                        removeEvent={removeEvent}
                        updateEvent={updateEvent}
                        allEvents={events}
                      />
                    ))}
                  </DndContext>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}

function DraggableEvent({
  event,
  calculatePosition,
  formatTime12h,
  removeEvent,
  updateEvent,
  allEvents,
}: {
  event: CalendarEvent;
  calculatePosition: (
    startTime: string,
    endTime: string,
    allEvents: CalendarEvent[],
    currentId: string
  ) => { top: number; height: number; left: string | number; width: string };
  formatTime12h: (time24: string) => string;
  removeEvent: (id: string) => void;
  updateEvent: (id: string, updates: Partial<CalendarEvent>) => void;
  allEvents: CalendarEvent[];
}) {
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
  const [editDraft, setEditDraft] = React.useState<CalendarEvent>(event);

  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: event.id,
      disabled: isEditDialogOpen,
    });

  const { top, height, left, width } = calculatePosition(
    event.startTime,
    event.endTime,
    allEvents,
    event.id
  );

  const style = {
    top: `${top}px`,
    height: `${height}px`,
    left: left,
    width: width,
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    zIndex: isDragging ? 50 : 10,
    opacity: isDragging ? 0.8 : 1,
  };

  const handleSaveEdit = () => {
    updateEvent(event.id, {
      title: editDraft.title,
      startTime: editDraft.startTime,
      endTime: editDraft.endTime,
      type: editDraft.type,
    });
    setIsEditDialogOpen(false);
  };

  return (
    <Dialog
      open={isEditDialogOpen}
      onOpenChange={(open) => {
        if (open) setEditDraft(event);
        setIsEditDialogOpen(open);
      }}
    >
      <DialogTrigger
        render={
          <div
            ref={setNodeRef}
            style={style}
            className={cn(
              "absolute rounded-lg border p-3 shadow-sm transition-all hover:shadow-md cursor-grab active:cursor-grabbing group",
              event.color,
              isDragging && "shadow-xl ring-2 ring-primary/20"
            )}
            {...attributes}
            {...listeners}
            onClick={(e) => {
              e.stopPropagation();
              setIsEditDialogOpen(true);
            }}
          />
        }
      >
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5">
              <HugeiconsIcon
                icon={event.type === "task" ? Task01Icon : CoffeeIcon}
                size={14}
                strokeWidth={2.5}
              />
              <span className="text-xs font-bold uppercase tracking-wider opacity-70">
                {event.type}
              </span>
            </div>
            <h3 className="text-sm font-bold leading-tight">{event.title}</h3>
            <div className="flex items-center gap-1 text-[10px] font-medium opacity-60">
              <HugeiconsIcon icon={Clock01Icon} size={10} />
              {formatTime12h(event.startTime)} - {formatTime12h(event.endTime)}
            </div>
          </div>
        </div>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Event</DialogTitle>
          <DialogDescription>
            Update the details of your scheduled {event.type}.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="edit-title">Title</Label>
            <Input
              id="edit-title"
              value={editDraft.title}
              onChange={(e) =>
                setEditDraft({ ...editDraft, title: e.target.value })
              }
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-type">Type</Label>
              <Select
                value={editDraft.type}
                onValueChange={(v) =>
                  v && setEditDraft({ ...editDraft, type: v as any })
                }
              >
                <SelectTrigger id="edit-type">
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
                value={editDraft.startTime}
                onChange={(v) => setEditDraft({ ...editDraft, startTime: v })}
              />
            </div>
          </div>
          <div className="grid gap-2">
            <Label>End Time</Label>
            <TimePicker
              value={editDraft.endTime}
              onChange={(v) => setEditDraft({ ...editDraft, endTime: v })}
            />
          </div>
        </div>
        <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-between gap-3 pt-6 border-t mt-4">
          <Button
            variant="ghost"
            className="text-destructive hover:bg-destructive/10 hover:text-destructive"
            onClick={() => {
              removeEvent(event.id);
              setIsEditDialogOpen(false);
            }}
          >
            <HugeiconsIcon icon={Delete02Icon} size={16} className="mr-2" />
            Delete Event
          </Button>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveEdit}>Save Changes</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
