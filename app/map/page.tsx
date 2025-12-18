"use client"

import * as React from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  SearchIcon,
  MapsIcon,
  Tick01Icon,
  Delete02Icon,
  Navigation03Icon,
} from "@hugeicons/core-free-icons"
import { toast } from "sonner"

export default function MapPage() {
  const [pos, setPos] = React.useState({ x: 45, y: 38 })
  const [radius, setRadius] = React.useState(20)
  const [search, setSearch] = React.useState("")
  const [saved, setSaved] = React.useState([
    { name: "Central Park", x: 45, y: 38, type: "Park" },
    { name: "Tech Hub", x: 72, y: 15, type: "Office" },
    { name: "Main Station", x: 20, y: 65, type: "Transport" },
  ])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!search) return
    const mockX = Math.random() * 80 + 10
    const mockY = Math.random() * 80 + 10
    setPos({ x: mockX, y: mockY })
    toast.success(`Found: ${search}`, {
      description: `Coordinates: ${mockX.toFixed(2)}, ${mockY.toFixed(2)}`
    })
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col h-[calc(100vh-8rem)]">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Location Intelligence</h1>
            <p className="text-sm text-muted-foreground">Interactive map picker with radius and geofencing capabilities.</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setPos({ x: 50, y: 50 })}>
              <HugeiconsIcon icon={Navigation03Icon} size={14} className="mr-2" />
              Recenter
            </Button>
            <Button size="sm">Save Location</Button>
          </div>
        </div>

        <div className="flex-1 flex gap-6 overflow-hidden">
          <div className="w-80 flex flex-col gap-4">
            <Card className="p-4 space-y-4">
              <form onSubmit={handleSearch} className="space-y-2">
                <label className="text-xs font-bold uppercase text-muted-foreground">Search</label>
                <div className="relative">
                  <HugeiconsIcon icon={SearchIcon} size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input 
                    placeholder="Enter address or coordinates..." 
                    className="pl-9 h-10" 
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                  />
                </div>
              </form>
              
              <div className="space-y-3 pt-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold uppercase text-muted-foreground">Radius Control</label>
                  <Badge variant="secondary" className="font-mono">{radius}km</Badge>
                </div>
                <Slider 
                  value={[radius]} 
                  onValueChange={(v) => {
                    if (Array.isArray(v)) setRadius(v[0]);
                  }} 
                  max={100} 
                  step={1}
                />
              </div>
            </Card>

            <Card className="flex-1 flex flex-col overflow-hidden">
              <div className="p-4 border-b bg-muted/20 flex justify-between items-center">
                <h3 className="text-xs font-bold uppercase text-muted-foreground">Saved Places</h3>
                <Button variant="ghost" size="icon-sm"><HugeiconsIcon icon={Delete02Icon} size={14} /></Button>
              </div>
              <div className="flex-1 overflow-auto p-2 space-y-1">
                {saved.map((place, i) => (
                  <button 
                    key={i} 
                    onClick={() => setPos({ x: place.x, y: place.y })}
                    className="w-full p-3 rounded-xl hover:bg-muted transition-all text-left flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                        <HugeiconsIcon icon={MapsIcon} size={16} />
                      </div>
                      <div>
                        <p className="text-sm font-bold">{place.name}</p>
                        <p className="text-[10px] text-muted-foreground">{place.type}</p>
                      </div>
                    </div>
                    <HugeiconsIcon icon={Tick01Icon} size={14} className="text-emerald-500 opacity-0 group-hover:opacity-100" />
                  </button>
                ))}
              </div>
            </Card>
          </div>

          <div className="flex-1 relative rounded-3xl overflow-hidden border-2 shadow-2xl bg-slate-200 dark:bg-slate-900">
            {/* Mock Map Background */}
            <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ 
              backgroundImage: "linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)",
              backgroundSize: "60px 60px"
            }} />
            
            <div 
              className="absolute inset-0 cursor-crosshair"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect()
                setPos({
                  x: ((e.clientX - rect.left) / rect.width) * 100,
                  y: ((e.clientY - rect.top) / rect.height) * 100
                })
              }}
            >
              {/* Radius Circle */}
              <div 
                className="absolute border-4 border-primary/30 bg-primary/10 rounded-full transition-all duration-700 pointer-events-none shadow-[0_0_50px_rgba(var(--primary),0.1)]"
                style={{ 
                  left: `${pos.x}%`, 
                  top: `${pos.y}%`, 
                  width: `${radius * 8}px`, 
                  height: `${radius * 8}px`,
                  transform: "translate(-50%, -50%)"
                }}
              />
              
              {/* Pin */}
              <div 
                className="absolute w-12 h-12 -ml-6 -mt-12 text-primary transition-all duration-500 pointer-events-none drop-shadow-[0_10px_10px_rgba(0,0,0,0.3)]"
                style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
              >
                <HugeiconsIcon icon={MapsIcon} size={48} />
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-1.5 bg-black/20 rounded-full blur-sm" />
              </div>
            </div>

            {/* Coordinates Overlay */}
            <div className="absolute bottom-6 left-6 flex gap-2">
              <div className="bg-background/90 backdrop-blur-xl p-3 rounded-2xl border shadow-2xl flex items-center gap-4">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold uppercase text-muted-foreground">Latitude</span>
                  <span className="text-sm font-mono font-bold">{(pos.y * 0.89).toFixed(6)}° N</span>
                </div>
                <div className="w-px h-8 bg-border" />
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold uppercase text-muted-foreground">Longitude</span>
                  <span className="text-sm font-mono font-bold">{(pos.x * 1.76).toFixed(6)}° E</span>
                </div>
              </div>
            </div>

            {/* Map Controls */}
            <div className="absolute top-6 right-6 flex flex-col gap-2">
              <MapControl icon={<PlusIcon size={18} />} />
              <MapControl icon={<MinusIcon size={18} />} />
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

function MapControl({ icon }: { icon: React.ReactNode }) {
  return (
    <button className="w-10 h-10 bg-background/90 backdrop-blur-xl border shadow-xl rounded-xl flex items-center justify-center hover:bg-background transition-colors">
      {icon}
    </button>
  )
}

function PlusIcon({ size }: { size: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
}

function MinusIcon({ size }: { size: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line></svg>
}
