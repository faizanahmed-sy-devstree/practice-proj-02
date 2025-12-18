"use client"

import * as React from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar } from "@/components/ui/calendar"
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { HugeiconsIcon } from "@hugeicons/react"
import { 
  StarIcon, 
  Clock01Icon, 
  Calendar01Icon, 
  UserGroupIcon,
  CheckmarkCircle02Icon,
  ArrowRight01Icon,
  Location01Icon
} from "@hugeicons/core-free-icons"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { useBookingStore, type Lawyer, type Appointment } from "@/store/use-booking-store"
import { toast } from "sonner"

const TIME_SLOTS = [
  "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
  "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM"
]

export default function BookingPage() {
  const { lawyers, appointments, addAppointment, cancelAppointment } = useBookingStore()
  const [selectedLawyer, setSelectedLawyer] = React.useState<Lawyer | null>(null)
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(new Date())
  const [selectedSlot, setSelectedSlot] = React.useState<string | null>(null)
  const [isBookingModalOpen, setIsBookingModalOpen] = React.useState(false)
  const [userName, setUserName] = React.useState("")
  const [userEmail, setUserEmail] = React.useState("")

  const handleBook = () => {
    if (!selectedLawyer || !selectedDate || !selectedSlot || !userName || !userEmail) {
      toast.error("Please fill in all details")
      return
    }

    const newAppointment: Appointment = {
      id: Math.random().toString(36).substr(2, 9),
      lawyerId: selectedLawyer.id,
      date: selectedDate.toISOString(),
      timeSlot: selectedSlot,
      userName,
      userEmail,
      status: "confirmed"
    }

    addAppointment(newAppointment)
    setIsBookingModalOpen(false)
    setSelectedSlot(null)
    setUserName("")
    setUserEmail("")
    toast.success("Appointment booked successfully!")
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Appointment Booking</h1>
            <p className="text-muted-foreground">
              Schedule a consultation with our top legal experts.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="px-3 py-1 text-sm font-medium">
              {appointments.length} Active Bookings
            </Badge>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
          {/* Left Column: Lawyer Selection */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <HugeiconsIcon icon={UserGroupIcon} size={20} className="text-primary" />
              Select a Professional
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {lawyers.map((lawyer) => (
                <Card 
                  key={lawyer.id}
                  className={cn(
                    "cursor-pointer transition-all hover:shadow-lg border-2",
                    selectedLawyer?.id === lawyer.id ? "border-primary bg-primary/5" : "border-transparent"
                  )}
                  onClick={() => setSelectedLawyer(lawyer)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <Avatar className="h-16 w-16 border-2 border-background shadow-sm">
                        <AvatarImage src={lawyer.avatar} />
                        <AvatarFallback>{lawyer.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-bold text-lg">{lawyer.name}</h3>
                          <div className="flex items-center gap-1 text-amber-500">
                            <HugeiconsIcon icon={StarIcon} size={14} />
                            <span className="text-sm font-bold">{lawyer.rating}</span>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground font-medium">{lawyer.specialty}</p>
                        <div className="flex items-center gap-4 pt-2">
                          <div className="text-xs text-muted-foreground">
                            <span className="font-bold text-foreground">{lawyer.reviews}</span> Reviews
                          </div>
                          <div className="text-xs text-muted-foreground">
                            <span className="font-bold text-foreground">${lawyer.price}</span> / hr
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* My Bookings Section */}
            {appointments.length > 0 && (
              <div className="pt-8 space-y-6">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <HugeiconsIcon icon={CheckmarkCircle02Icon} size={20} className="text-emerald-500" />
                  Your Appointments
                </h2>
                <div className="space-y-4">
                  {appointments.map((apt) => {
                    const lawyer = lawyers.find(l => l.id === apt.lawyerId)
                    return (
                      <Card key={apt.id} className="border-none shadow-md bg-muted/30">
                        <CardContent className="p-4 flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={lawyer?.avatar} />
                              <AvatarFallback>{lawyer?.name[0]}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-semibold text-sm">{lawyer?.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {format(new Date(apt.date), "PPP")} at {apt.timeSlot}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-200">
                              Confirmed
                            </Badge>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-destructive hover:bg-destructive/10"
                              onClick={() => cancelAppointment(apt.id)}
                            >
                              Cancel
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Date & Time Selection */}
          <div className="space-y-6">
            <Card className="border-none shadow-xl bg-background sticky top-24">
              <CardHeader>
                <CardTitle>Schedule Session</CardTitle>
                <CardDescription>Choose your preferred date and time.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-1 rounded-xl border bg-muted/20">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="rounded-md"
                    disabled={(date) => date < new Date(new Date().setHours(0,0,0,0))}
                  />
                </div>

                <div className="space-y-3">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">
                    Available Slots
                  </Label>
                  <div className="grid grid-cols-2 gap-2">
                    {TIME_SLOTS.map((slot) => (
                      <Button
                        key={slot}
                        variant={selectedSlot === slot ? "default" : "outline"}
                        className={cn(
                          "h-10 rounded-lg text-xs font-medium transition-all",
                          selectedSlot === slot && "shadow-lg shadow-primary/20"
                        )}
                        onClick={() => setSelectedSlot(slot)}
                      >
                        <HugeiconsIcon icon={Clock01Icon} size={14} className="mr-2" />
                        {slot}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-0">
                <Dialog open={isBookingModalOpen} onOpenChange={setIsBookingModalOpen}>
                  <DialogTrigger
                    render={
                      <Button 
                        className="w-full h-12 rounded-xl shadow-lg shadow-primary/20"
                        disabled={!selectedLawyer || !selectedSlot}
                      />
                    }
                  >
                    Book Appointment
                    <HugeiconsIcon icon={ArrowRight01Icon} size={18} className="ml-2" />
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Confirm Booking</DialogTitle>
                      <DialogDescription>
                        You are booking a session with <strong>{selectedLawyer?.name}</strong>.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-6 py-4">
                      <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/30 border">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                          <HugeiconsIcon icon={Calendar01Icon} size={20} />
                        </div>
                        <div>
                          <p className="text-sm font-bold">
                            {selectedDate ? format(selectedDate, "PPP") : ""}
                          </p>
                          <p className="text-xs text-muted-foreground">{selectedSlot}</p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="grid gap-2">
                          <Label htmlFor="name">Your Full Name</Label>
                          <Input 
                            id="name" 
                            placeholder="John Doe" 
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="email">Email Address</Label>
                          <Input 
                            id="email" 
                            type="email" 
                            placeholder="john@example.com" 
                            value={userEmail}
                            onChange={(e) => setUserEmail(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsBookingModalOpen(false)}>Cancel</Button>
                      <Button onClick={handleBook}>Confirm Appointment</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
