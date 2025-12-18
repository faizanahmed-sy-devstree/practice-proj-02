import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"

export interface CalendarEvent {
  id: string
  title: string
  startTime: string // "HH:mm"
  endTime: string // "HH:mm"
  type: "task" | "break"
  color: string
}

interface CalendarState {
  workStart: string;
  workEnd: string;
  events: CalendarEvent[];
  setWorkStart: (time: string) => void;
  setWorkEnd: (time: string) => void;
  setEvents: (events: CalendarEvent[]) => void;
  addEvent: (event: CalendarEvent) => void;
  updateEvent: (id: string, updates: Partial<CalendarEvent>) => void;
  removeEvent: (id: string) => void;
  reset: () => void;
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

export const useCalendarStore = create<CalendarState>()(
  persist(
    (set) => ({
      workStart: "09:00",
      workEnd: "19:00",
      events: INITIAL_EVENTS,
      setWorkStart: (workStart) => set({ workStart }),
      setWorkEnd: (workEnd) => set({ workEnd }),
      setEvents: (events) => set({ events }),
      addEvent: (event) =>
        set((state) => ({ events: [...state.events, event] })),
      updateEvent: (id, updates) =>
        set((state) => ({
          events: state.events.map((e) =>
            e.id === id ? { ...e, ...updates } : e
          ),
        })),
      removeEvent: (id) =>
        set((state) => ({ events: state.events.filter((e) => e.id !== id) })),
      reset: () =>
        set({
          workStart: "09:00",
          workEnd: "19:00",
          events: INITIAL_EVENTS,
        }),
    }),
    {
      name: "calendar-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
