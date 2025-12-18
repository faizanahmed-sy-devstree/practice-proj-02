"use client"

import * as React from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  GridIcon,
  MapsIcon,
  FilterIcon,
  BubbleChatIcon,
  AiMagicIcon,
  Folder01Icon,
  ArrowRight01Icon,
  ArrowLeft01Icon,
  SearchIcon,
  MailSend01Icon,
} from "@hugeicons/core-free-icons"
import { cn } from "@/lib/utils"

export default function PatternsPage() {
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-8 pb-12">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">UI Patterns - Phase 1</h1>
          <p className="text-muted-foreground">
            Extremely basic versions of common UI patterns for our boilerplate.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* 1. Grid Layout (Seating) */}
          <PatternCard 
            title="Interactive Grid" 
            description="Basic seating/grid selection" 
            icon={GridIcon}
          >
            <BasicGrid />
          </PatternCard>

          {/* 2. Map Picker */}
          <PatternCard 
            title="Location Picker" 
            description="Basic map placeholder" 
            icon={MapsIcon}
          >
            <BasicMap />
          </PatternCard>

          {/* 3. Filter Sidebar */}
          <PatternCard 
            title="Filter Sidebar" 
            description="Basic product filtering" 
            icon={FilterIcon}
          >
            <BasicFilters />
          </PatternCard>

          {/* 4. Chat UI */}
          <PatternCard 
            title="Messaging UI" 
            description="Basic chat interface" 
            icon={BubbleChatIcon}
          >
            <BasicChat />
          </PatternCard>

          {/* 5. Multi-step Wizard */}
          <PatternCard 
            title="Onboarding Wizard" 
            description="Basic 3-step flow" 
            icon={AiMagicIcon}
          >
            <BasicWizard />
          </PatternCard>

          {/* 6. File Explorer */}
          <PatternCard 
            title="File Explorer" 
            description="Basic file list & preview" 
            icon={Folder01Icon}
          >
            <BasicFiles />
          </PatternCard>
        </div>
      </div>
    </DashboardLayout>
  )
}

function PatternCard({ title, description, icon, children }: { title: string, description: string, icon: any, children: React.ReactNode }) {
  return (
    <Card className="flex flex-col h-[400px] overflow-hidden border-2 hover:border-primary/50 transition-colors">
      <CardHeader className="pb-3 border-b bg-muted/30">
        <div className="flex items-center gap-2">
          <HugeiconsIcon icon={icon} size={20} className="text-primary" />
          <CardTitle className="text-lg">{title}</CardTitle>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 p-0 overflow-hidden relative">
        {children}
      </CardContent>
    </Card>
  )
}

// --- Basic Implementations ---

function BasicGrid() {
  const [selected, setSelected] = React.useState<number[]>([])
  const toggle = (i: number) => {
    setSelected(prev => prev.includes(i) ? prev.filter(id => id !== i) : [...prev, i])
  }

  return (
    <div className="p-4 h-full flex items-center justify-center">
      <div className="grid grid-cols-5 gap-2">
        {Array.from({ length: 25 }).map((_, i) => (
          <button
            key={i}
            onClick={() => toggle(i)}
            className={cn(
              "w-8 h-8 rounded-md border transition-all",
              selected.includes(i) 
                ? "bg-primary border-primary shadow-lg scale-110" 
                : "bg-background hover:bg-muted"
            )}
          />
        ))}
      </div>
    </div>
  )
}

function BasicMap() {
  const [pos, setPos] = React.useState({ x: 50, y: 50 })
  return (
    <div 
      className="h-full w-full bg-slate-200 dark:bg-slate-800 relative cursor-crosshair"
      onClick={(e) => {
        const rect = e.currentTarget.getBoundingClientRect()
        setPos({
          x: ((e.clientX - rect.left) / rect.width) * 100,
          y: ((e.clientY - rect.top) / rect.height) * 100
        })
      }}
    >
      <div className="absolute inset-0 flex items-center justify-center text-muted-foreground pointer-events-none opacity-20">
        <HugeiconsIcon icon={MapsIcon} size={100} />
      </div>
      <div 
        className="absolute w-6 h-6 -ml-3 -mt-3 text-primary transition-all duration-300"
        style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
      >
        <div className="relative">
          <div className="absolute inset-0 animate-ping bg-primary rounded-full opacity-75" />
          <div className="relative bg-primary rounded-full w-6 h-6 flex items-center justify-center text-white">
            <div className="w-1.5 h-1.5 bg-white rounded-full" />
          </div>
        </div>
      </div>
      <div className="absolute bottom-4 left-4 right-4 bg-background/80 backdrop-blur p-2 rounded-lg text-[10px] border shadow-sm">
        Lat: {(pos.y * 1.8 - 90).toFixed(4)}, Lng: {(pos.x * 3.6 - 180).toFixed(4)}
      </div>
    </div>
  )
}

function BasicFilters() {
  const [filters, setFilters] = React.useState({ electronics: true, fashion: false, home: true })
  const items = [
    { name: "Smartphone", cat: "electronics" },
    { name: "T-Shirt", cat: "fashion" },
    { name: "Lamp", cat: "home" },
    { name: "Laptop", cat: "electronics" },
    { name: "Jeans", cat: "fashion" },
  ]

  return (
    <div className="flex h-full">
      <div className="w-1/3 border-r p-3 space-y-4 bg-muted/10">
        <p className="text-[10px] font-bold uppercase text-muted-foreground">Categories</p>
        {Object.entries(filters).map(([key, val]) => (
          <div key={key} className="flex items-center gap-2">
            <Checkbox 
              id={key} 
              checked={val} 
              onCheckedChange={(v) => setFilters(f => ({ ...f, [key]: !!v }))} 
            />
            <label htmlFor={key} className="text-xs capitalize">{key}</label>
          </div>
        ))}
      </div>
      <ScrollArea className="flex-1 p-3">
        <div className="space-y-2">
          {items.filter(i => filters[i.cat as keyof typeof filters]).map((item, i) => (
            <div key={i} className="p-2 rounded border bg-background text-xs flex justify-between items-center">
              {item.name}
              <Badge variant="outline" className="text-[8px] h-4">{item.cat}</Badge>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}

function BasicChat() {
  const [messages, setMessages] = React.useState([
    { text: "Hello! How can I help?", me: false },
    { text: "I'm looking for the patterns page.", me: true },
  ])
  const [input, setInput] = React.useState("")

  const send = () => {
    if (!input) return
    setMessages([...messages, { text: input, me: true }])
    setInput("")
  }

  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((m, i) => (
            <div key={i} className={cn("flex", m.me ? "justify-end" : "justify-start")}>
              <div className={cn(
                "max-w-[80%] p-2 rounded-lg text-xs",
                m.me ? "bg-primary text-primary-foreground" : "bg-muted"
              )}>
                {m.text}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
      <div className="p-3 border-t flex gap-2">
        <Input 
          placeholder="Type..." 
          className="h-8 text-xs" 
          value={input} 
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && send()}
        />
        <Button size="icon-sm" className="h-8 w-8" onClick={send}>
          <HugeiconsIcon icon={MailSend01Icon} size={14} />
        </Button>
      </div>
    </div>
  )
}

function BasicWizard() {
  const [step, setStep] = React.useState(1)
  return (
    <div className="p-6 h-full flex flex-col justify-between">
      <div className="flex justify-between mb-8">
        {[1, 2, 3].map(i => (
          <div key={i} className="flex items-center gap-2">
            <div className={cn(
              "w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold",
              step >= i ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            )}>
              {i}
            </div>
            {i < 3 && <div className={cn("w-8 h-px", step > i ? "bg-primary" : "bg-muted")} />}
          </div>
        ))}
      </div>
      
      <div className="flex-1 flex flex-col items-center justify-center text-center space-y-2">
        <h3 className="font-bold">Step {step}</h3>
        <p className="text-xs text-muted-foreground">
          {step === 1 && "Welcome! Let's get started with your account."}
          {step === 2 && "Tell us a bit more about your preferences."}
          {step === 3 && "All set! You're ready to use the dashboard."}
        </p>
      </div>

      <div className="flex justify-between mt-8">
        <Button 
          variant="outline" 
          size="sm" 
          disabled={step === 1} 
          onClick={() => setStep(s => s - 1)}
          className="h-8"
        >
          <HugeiconsIcon icon={ArrowLeft01Icon} size={14} className="mr-2" />
          Back
        </Button>
        <Button 
          size="sm" 
          onClick={() => step < 3 ? setStep(s => s + 1) : alert("Finished!")}
          className="h-8"
        >
          {step === 3 ? "Finish" : "Next"}
          <HugeiconsIcon icon={ArrowRight01Icon} size={14} className="ml-2" />
        </Button>
      </div>
    </div>
  )
}

function BasicFiles() {
  const files = [
    { name: "dashboard_v1.fig", size: "12MB", type: "Design" },
    { name: "invoice_dec.pdf", size: "1.2MB", type: "Document" },
    { name: "profile_pic.png", size: "450KB", type: "Image" },
    { name: "index.tsx", size: "2KB", type: "Code" },
  ]

  return (
    <div className="p-0 h-full flex flex-col">
      <div className="p-3 bg-muted/20 border-b flex items-center gap-2">
        <HugeiconsIcon icon={SearchIcon} size={14} className="text-muted-foreground" />
        <span className="text-[10px] text-muted-foreground">Search files...</span>
      </div>
      <ScrollArea className="flex-1">
        <div className="divide-y">
          {files.map((f, i) => (
            <button 
              key={i} 
              className="w-full p-3 flex items-center justify-between hover:bg-muted/50 transition-colors text-left"
              onClick={() => alert(`Previewing ${f.name}`)}
            >
              <div className="flex items-center gap-3">
                <HugeiconsIcon icon={Folder01Icon} size={16} className="text-primary/60" />
                <div>
                  <p className="text-xs font-medium">{f.name}</p>
                  <p className="text-[10px] text-muted-foreground">{f.type}</p>
                </div>
              </div>
              <span className="text-[10px] text-muted-foreground">{f.size}</span>
            </button>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
