import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"

export interface Lawyer {
  id: string
  name: string
  specialty: string
  rating: number
  reviews: number
  avatar: string
  price: number
}

export interface Appointment {
  id: string
  lawyerId: string
  date: string // ISO string
  timeSlot: string // "09:00 AM"
  userName: string
  userEmail: string
  status: "confirmed" | "pending" | "cancelled"
}

interface BookingState {
  lawyers: Lawyer[]
  appointments: Appointment[]
  addAppointment: (appointment: Appointment) => void
  cancelAppointment: (id: string) => void
}

const INITIAL_LAWYERS: Lawyer[] = [
  {
    id: "1",
    name: "Sarah Jenkins",
    specialty: "Corporate Law",
    rating: 4.9,
    reviews: 124,
    avatar: "https://i.pravatar.cc/150?u=sarah",
    price: 250,
  },
  {
    id: "2",
    name: "Michael Ross",
    specialty: "Criminal Defense",
    rating: 4.8,
    reviews: 89,
    avatar: "https://i.pravatar.cc/150?u=michael",
    price: 300,
  },
  {
    id: "3",
    name: "Harvey Specter",
    specialty: "M&A / Litigation",
    rating: 5.0,
    reviews: 210,
    avatar: "https://i.pravatar.cc/150?u=harvey",
    price: 500,
  },
  {
    id: "4",
    name: "Jessica Pearson",
    specialty: "Real Estate",
    rating: 4.9,
    reviews: 156,
    avatar: "https://i.pravatar.cc/150?u=jessica",
    price: 400,
  },
]

export const useBookingStore = create<BookingState>()(
  persist(
    (set) => ({
      lawyers: INITIAL_LAWYERS,
      appointments: [],
      addAppointment: (appointment) =>
        set((state) => ({ appointments: [...state.appointments, appointment] })),
      cancelAppointment: (id) =>
        set((state) => ({
          appointments: state.appointments.filter((a) => a.id !== id),
        })),
    }),
    {
      name: "booking-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
)
