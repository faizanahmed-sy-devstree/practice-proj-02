"use client"

import * as React from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Tick01Icon,
  GridIcon,
} from "@hugeicons/core-free-icons"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

type SeatStatus = "available" | "occupied" | "reserved" | "blocked"

export default function SeatingPage() {
  const [seats, setSeats] = React.useState(
    Array.from({ length: 120 }).map((_, i) => ({
      id: i,
      label: `${Math.floor(i / 10) + 1}${String.fromCharCode(65 + (i % 10))}`,
      status: (i % 7 === 0 ? "occupied" : i % 13 === 0 ? "reserved" : "available") as SeatStatus
    }))
  )
  const [selected, setSelected] = React.useState<number[]>([])

  const toggleSelect = (id: number) => {
    setSelected(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id])
  }

  const updateStatus = (status: SeatStatus) => {
    setSeats(prev => prev.map(s => selected.includes(s.id) ? { ...s, status } : s))
    setSelected([])
    toast.success(`Updated ${selected.length} seats to ${status}`)
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col h-[calc(100vh-8rem)]">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Interactive Seating Chart</h1>
            <p className="text-sm text-muted-foreground">Manage venue capacity and seat assignments.</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="h-8 px-3">{selected.length} Selected</Badge>
            <Button size="sm" disabled={!selected.length} onClick={() => updateStatus("available")}>Mark Available</Button>
            <Button size="sm" variant="outline" disabled={!selected.length} onClick={() => updateStatus("blocked")}>Block Seats</Button>
          </div>
        </div>

        <div className="flex-1 flex gap-6 overflow-hidden">
          <div className="flex-1 bg-muted/30 rounded-2xl border-2 border-dashed flex items-center justify-center p-8 overflow-auto">
            <div className="grid grid-cols-10 gap-3 p-8 bg-background rounded-3xl shadow-2xl border">
              {/* Stage/Front indicator */}
              <div className="col-span-10 mb-12">
                <div className="w-full h-2 bg-primary/20 rounded-full relative">
                  <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Stage / Front</span>
                </div>
              </div>
              
              {seats.map((seat) => (
                <Popover key={seat.id}>
                  <PopoverTrigger>
                    <button
                      onClick={(e) => {
                        if (e.shiftKey || e.metaKey) toggleSelect(seat.id)
                      }}
                      className={cn(
                        "w-10 h-10 rounded-xl border-2 text-[10px] font-bold transition-all flex items-center justify-center relative group",
                        seat.status === "available" && "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/20 dark:border-emerald-900",
                        seat.status === "occupied" && "border-zinc-200 bg-zinc-100 text-zinc-400 cursor-not-allowed dark:bg-zinc-900 dark:border-zinc-800",
                        seat.status === "reserved" && "border-amber-200 bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:border-amber-900",
                        seat.status === "blocked" && "border-red-200 bg-red-50 text-red-700 dark:bg-red-950/20 dark:border-red-900",
                        selected.includes(seat.id) && "ring-4 ring-primary ring-offset-4 scale-110 z-10 shadow-xl border-primary"
                      )}
                    >
                      {seat.label}
                      {selected.includes(seat.id) && (
                        <div className="absolute -top-2 -right-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center text-white shadow-lg border-2 border-background">
                          <HugeiconsIcon icon={Tick01Icon} size={10} />
                        </div>
                      )}
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-48 p-3">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between border-b pb-2">
                        <span className="text-xs font-bold uppercase">Seat {seat.label}</span>
                        <Badge variant="outline" className="text-[8px] uppercase">{seat.status}</Badge>
                      </div>
                      <div className="grid grid-cols-1 gap-1">
                        {(["available", "occupied", "reserved", "blocked"] as SeatStatus[]).map(s => (
                          <Button 
                            key={s} 
                            variant="ghost" 
                            size="sm" 
                            className="justify-start text-xs h-8 capitalize"
                            onClick={() => {
                              setSeats(prev => prev.map(item => item.id === seat.id ? { ...item, status: s } : item))
                              toast.info(`Seat ${seat.label} marked as ${s}`)
                            }}
                          >
                            <div className={cn(
                              "w-2 h-2 rounded-full mr-2",
                              s === "available" && "bg-emerald-500",
                              s === "occupied" && "bg-zinc-400",
                              s === "reserved" && "bg-amber-500",
                              s === "blocked" && "bg-red-500"
                            )} />
                            {s}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              ))}
            </div>
          </div>

          <div className="w-72 flex flex-col gap-6">
            <div className="p-6 rounded-2xl border bg-card shadow-sm space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Legend</h3>
              <div className="space-y-3">
                <LegendItem color="bg-emerald-500" label="Available" count={seats.filter(s => s.status === "available").length} />
                <LegendItem color="bg-zinc-400" label="Occupied" count={seats.filter(s => s.status === "occupied").length} />
                <LegendItem color="bg-amber-500" label="Reserved" count={seats.filter(s => s.status === "reserved").length} />
                <LegendItem color="bg-red-500" label="Blocked" count={seats.filter(s => s.status === "blocked").length} />
              </div>
            </div>

            <div className="p-6 rounded-2xl border bg-primary/5 border-primary/20 space-y-4">
              <h3 className="text-sm font-bold text-primary">Quick Tips</h3>
              <ul className="text-xs space-y-2 text-muted-foreground">
                <li className="flex gap-2"><div className="w-1 h-1 rounded-full bg-primary mt-1.5 shrink-0" /> Click a seat to change its status individually.</li>
                <li className="flex gap-2"><div className="w-1 h-1 rounded-full bg-primary mt-1.5 shrink-0" /> Hold <strong>Shift</strong> or <strong>Cmd</strong> to multi-select seats.</li>
                <li className="flex gap-2"><div className="w-1 h-1 rounded-full bg-primary mt-1.5 shrink-0" /> Use bulk actions at the top for selected seats.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

function LegendItem({ color, label, count }: { color: string, label: string, count: number }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className={cn("w-3 h-3 rounded-full", color)} />
        <span className="text-sm font-medium">{label}</span>
      </div>
      <span className="text-xs text-muted-foreground font-mono">{count}</span>
    </div>
  )
}
